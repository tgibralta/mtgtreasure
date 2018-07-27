const schedule = require('node-schedule')
const config = require('config')
const rp = require('request-promise')
const urlSearch = require('./../models/apiDescription').urlGetCards
const { Client, Pool } = require('pg')
const currentDate = require('./../helpers/currentDate').currentDate
const dateYesterday = require('./../helpers/currentDate').dateYesterday
const dateLastWeek = require('./../helpers/currentDate').dateLastWeek
const dateLastMonth = require('./../helpers/currentDate').dateLastMonth

// Query the Scryfall API to get one page
const queryAPIOnePage = (urlPage) => new Promise((resolve, reject) => {
  console.log(urlPage)
  let options = {
    uri: urlPage,
    method: 'GET'
  }
  rp(options)
  .then((res) => {
    return resolve(JSON.parse(res))
  })
  .catch((err) => {
    return reject(`Error page ${pageNb}: ${err}`)
  })
})

// Query DB to get the price history for a particular price ID
const queryDBPriceHistory = (cardID, date, client) => new Promise((resolve, reject) => {
  client.query(`SELECT * FROM ${config.get("DB.PGTABLEPRICETRACKED.NAME")} WHERE ${config.get("DB.PGTABLEPRICETRACKED.COLUMN0")} = '${cardID}' AND ${config.get("DB.PGTABLEPRICETRACKED.COLUMN2")} = '${date}'`)
  .then((res) => {
    console.log(`Received price history for ${cardID}`)
    if (res.rows[0]) {
      let price = res.rows[0].price
      return resolve(price)
    } else return resolve(0)
  })
  .catch((err) => {
    return reject(err)
  })
})

// From Price history, creates trend for Day, Week and Month. If not enough data, returns 0
const createTrend = (priceHistory) => new Promise((resolve, reject) => {
  let trendDay = 0
  let trendWeek = 0
  let trendMonth = 0
  if (priceHistory.length > 1) {
    trendDay = 100 * (priceHistory[priceHistory.length - 1] - priceHistory[priceHistory.length - 2])/priceHistory[priceHistory.length - 2]
  }
  if (priceHistory.length > 7) {
    trendWeek = 100 * (priceHistory[priceHistory.length - 1] - priceHistory[priceHistory.length - 8])/priceHistory[priceHistory.length - 8]
  }
  if (priceHistory.length > 31) {
    trendMonth = 100 * (priceHistory[priceHistory.length - 1] - priceHistory[priceHistory.length - 32])/priceHistory[priceHistory.length - 32]
  }
  return ({
    trendDay,
    trendWeek,
    trendMonth
  })
})

// Take a trend and compare it to a vector top10, return arranged array
// trendarray is {cardID, cardName, price, trend}
const replaceAndSortTop10 = (trendObject, arraytop10, ifPositive) => new Promise((resolve, reject) => {
  // find where to put the index
  if (trendObject) {
    let indexTrend = arraytop10.reduce((accumulator, value, index) => {
      if (ifPositive) {
        if (trendObject.trend > value) { // compare trends
          if (index > accumulator) { // only return the bigger index
            accumulator = index
            return accumulator
          }
        }
      } else {
        if (trendObject.trend < value) { // compare trends
          if (index > accumulator) { // only return the bigger index
            accumulator = index
            return accumulator
          }
        }
      }
    })
  // reorganize the arrayTop10
    let newArray = arraytop10.map((element, index) => {
      if (index > indexTrend) {
        return element
      } else if (index === indexTrend) {
        return value
      } else {
        return arrayTop10[index + 1]
      }
    })
    return resolve(newArray)
  } else {
    return reject(new Error('invalid trend'))
  }
})

// arrayTrend is an array of {cardID, cardName, trend, price}
const queryHistoryDB = (arrayTrend, type) => new Promise((resolve, reject) => {
  const client = new Client({
    user: config.get('DB.PGUSER'),
    host: config.get('DB.PGHOST'),
    database: config.get('DB.PGDATABASE'),
    password: config.get('DB.PGPASSWORD'),
    port: config.get('DB.PGPORT')
  })
  client.connect((errConnect) => {
    if (errConnect) {
      return reject(errConnect)
    } else {
      let queries = arrayTrend.map((element, index) => {
        switch(type) {
          case "day":
            client.query(`INSERT INTO ${config.get('DB.PGTABLETRENDDAY.NAME')} (${config.get('DB.PGTABLETRENDDAY.COLUMN0')}, ${config.get('DB.PGTABLETRENDDAY.COLUMN1')}, ${config.get('DB.PGTABLETRENDDAY.COLUMN2')}, ${config.get('DB.PGTABLETRENDDAY.COLUMN3')} VALUES ('${element.cardID}', ${element.name}', ${element.trend}', ${element.price}'))`)
            .then((res) => {
              client.end()
              return resolve(res)
            })
            .catch((errQuery) => {
              client.end()
              return reject(new Error('Failure Query DB DAY'))
            })
          break
          case "week":
            client.query(`INSERT INTO ${config.get('DB.PGTABLETRENDWEEK.NAME')} (${config.get('DB.PGTABLETRENDDAY.COLUMN0')}, ${config.get('DB.PGTABLETRENDDAY.COLUMN1')}, ${config.get('DB.PGTABLETRENDDAY.COLUMN2')}, ${config.get('DB.PGTABLETRENDDAY.COLUMN3')} VALUES ('${element.cardID}', ${element.name}', ${element.trend}', ${element.price}'))`)
            .then((res) => {
              client.end()
              return resolve(res)
            })
            .catch((errQuery) => {
              client.end()
              return reject(new Error('Failure Query DB WEEK'))
            })
          break
          case "month":
            client.query(`INSERT INTO ${config.get('DB.PGTABLETRENDMONTH.NAME')} (${config.get('DB.PGTABLETRENDDAY.COLUMN0')}, ${config.get('DB.PGTABLETRENDDAY.COLUMN1')}, ${config.get('DB.PGTABLETRENDDAY.COLUMN2')}, ${config.get('DB.PGTABLETRENDDAY.COLUMN3')} VALUES ('${element.cardID}', ${element.name}', ${element.trend}', ${element.price}'))`)
            .then((res) => {
              client.end()
              return resolve(res)
            })
            .catch((errQuery) => {
              client.end()
              return resolve(new Error('Failure Query DB MONTH'))
            })
          break
          default:
            return reject(new Error('Unknown type of operation'))
          break
        }
      })
    }
  })
  .catch((errConnect) => {
    return reject(new Error('Error while connecting to the database'))
  })
})

DefineTop10 = (initPage, arrayTop10, arrayBottom10) => new Promise((resolve, reject) => {
  queryAPIOnePage(initPage)// query api
  .then((response) => {
    let cards = response.data
    let has_more = response.has_more
    let next_page = response.next_page
    console.log(`has_more: ${has_more}`)
    console.log(`next_page: ${next_page}`)
    const pool = new Pool({
      user: config.get('DB.PGUSER'),
      host: config.get('DB.PGHOST'),
      database: config.get('DB.PGDATABASE'),
      password: config.get('DB.PGPASSWORD'),
      port: config.get('DB.PGPORT')
    })
    pool.connect()
    .then((client) => {
      console.log(`Pool connected`)
      let queriesToday = cards.map((card) => {
        let cardID = card.multiverse_ids[0] || 0
        return(queryDBPriceHistory(cardID, currentDate(), client))
      })
      let queriesTodayPromise = Promise.all(queriesToday)
      queriesTodayPromise.then((priceToday) => {
        console.log(`Prices Today received: ${JSON.stringify(priceToday)}`)
        let queriesYesterday = cards.map((card) => {
          let cardID = card.multiverse_ids[0] || 0
          return(queryDBPriceHistory(cardID, dateYesterday(), client))
        })
        let queriesYesterdayPromise = Promise.all(queriesYesterday)
        queriesYesterdayPromise.then((priceYesterday) => {
          console.log(`Prices Yesterday received: ${JSON.stringify(priceYesterday)}`)
          let queriesLastWeek = cards.map((card) => {
            let cardID = card.multiverse_ids[0] || 0
            return(queryDBPriceHistory(cardID, dateLastWeek(), client))
          })
          let queriesLastWeekPromise = Promise.all(queriesLastWeek)
          queriesLastWeekPromise.then((priceLastWeek) => {
            console.log(`Prices Last Week received: ${JSON.stringify(priceLastWeek)}`)
            let queriesLasMonth = cards.map((card) => {
              let cardID = card.multiverse_ids[0] || 0
              return(queryDBPriceHistory(cardID, dateLastMonth(), client))
            })
            let queriesLasMonthPromise = Promise.all(queriesLasMonth)
            queriesLasMonthPromise.then((priceLastMonth) => {
              console.log(`Prices Last Month received: ${JSON.stringify(priceLastMonth)}`)
              return resolve()
            })
            .catch((errLastMonth) => {
              return reject(errLastMonth)
            })
          })
          .catch((errLastWeek) => {
            return reject(errLastWeek)
          })
        })
        .catch((errYesterday) => {
          return reject(errYesterday)
        })
      })
      .catch((errToday) => {
        return reject(errToday)
      })
    })
    .catch((errPool) => {
      return reject(errPool)
    })
  })
  .catch((errAPI) => {
    console.log(`Error during Scryfall Query: ${errAPI}`)
    return reject(errAPI)
  })
})

let rule = new schedule.RecurrenceRule()
rule.hour = config.get("SCHEDULE_TOP_10.H")
rule.minute = config.get("SCHEDULE_TOP_10.MIN")

let scheduleTop10 = schedule.scheduleJob(rule, function() {
  let initPage = urlSearch + "1"
  let arrayTop10 = new Array(10)
  let arrayBottom10 = new Array(10)
  arrayTop10.fill(0)
  arrayBottom10.fill(0)
  DefineTop10(initPage, arrayTop10, arrayBottom10)
  .then((trendsArray) => {
    console.log(`Succes DefineTop10`)
  })
  .catch((err) => {
    console.log(err)
  })
})
