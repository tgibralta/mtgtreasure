const schedule = require('node-schedule')
const config = require('config')
const rp = require('request-promise')
const urlSearch = require('./../models/apiDescription').urlGetCards
const urlCardSearchPerID = require('./../models/apiDescription').urlCardSearchPerID
const { Client, Pool } = require('pg')
const currentDate = require('./../helpers/currentDate').currentDate
const dateYesterday = require('./../helpers/currentDate').dateYesterday
const dateLastWeek = require('./../helpers/currentDate').dateLastWeek
const dateLastMonth = require('./../helpers/currentDate').dateLastMonth

// Query DB to get the price history for a particular price ID
const getPriceDate = (client, date) => new Promise((resolve, reject) => {
  console.time(`Query_DB`)
  client.query(`SELECT * FROM ${config.get("DB.PGTABLEPRICETRACKED.NAME")} WHERE ${config.get("DB.PGTABLEPRICETRACKED.COLUMN2")} = '${date}'`)
  .then((res) => {
    console.timeEnd(`Query_DB`)
    return resolve(res.rows)
  })
  .catch((err) => {
    console.timeEnd(`Query_DB`)
    return reject(err)
  })
})

const clearDB = (client) => new Promise((resolve, reject) => {
  console.time(`CLEAR_DB`)
  client.query(`DELETE FROM ${config.get("DB.PGTABLEPRICETRACKED.NAME")} WHERE ${config.get("DB.PGTABLEPRICETRACKED.COLUMN0")} = '0'`)
  .then((res) => {
    console.timeEnd(`CLEAR_DB`)
    return resolve()
  })
  .catch((err) => {
    return reject(err)
  })
})

const eraseFormerTop10 = (client) => new Promise((resolve, reject) => {
  client.query(`DELETE FROM ${config.get("DB.PGTABLETRENDDAY.NAME")}`)
  .then(() => {
    console.log(`Former top10 Day deleted`)
    client.query(`DELETE FROM ${config.get("DB.PGTABLETRENDWEEK.NAME")}`)
    .then(() => {
      console.log(`Former top10 Week deleted`)
      client.query(`DELETE FROM ${config.get("DB.PGTABLETRENDMONTH.NAME")}`)
      .then(() => {
        console.log(`Former top10 Month deleted`)
        return resolve()
      })
      .catch((errMonth) => {
        return reject(errMonth)
      })
    })
    .catch((errWeek) => {
      return reject(errWeek)
    })
  })
  .catch((errDay) => {
    return reject(errDay)
  })
})

function reducerID (cardID, accumulator, currentValue) {
  if (currentValue.card_id === cardID) {
    accumulator += currentValue.price
  }
  return accumulator
}

const comparisonID = (element, arrayWeek, arrayYesterday, arrayMonth) => new Promise((resolve, reject) => {
  let trendDay = 0
  let trendWeek = 0
  let trendMonth = 0
  console.log(`CARDID: ${element.card_id}`)
  if (element) {
    let cardID = element.card_id
    let priceToday = element.price
    let priceYesterday = arrayYesterday.reduce((accumulator, value) => {
      return(reducerID(cardID, accumulator, value))
    }, 0)
    let priceWeek = arrayWeek.reduce((accumulator, value) => {
      return(reducerID(cardID, accumulator, value))
    }, 0)
    let priceMonth = arrayMonth.reduce((accumulator, value) => {
      return(reducerID(cardID, accumulator, value))
    }, 0)
    if (priceToday === 0) {
      return resolve({
        cardID,
        trendDay: 0,
        trendWeek: 0,
        trendMonth: 0,
        priceToday
      })
    } else {
      if (priceYesterday != 0) {
        trendDay = Math.ceil(100* (priceToday - priceYesterday)/priceYesterday)
      }
      if (priceWeek != 0) {
        trendWeek = Math.ceil(100* (priceToday - priceWeek)/priceWeek)
      }
      if (priceMonth != 0) {
        trendMonth = Math.ceil(100* (priceToday - priceMonth)/priceMonth)
      }
      return resolve({
        cardID,
        trendDay,
        trendWeek,
        trendMonth,
        priceToday
      })
    }
  } else {
    return reject(`Empty element`)
  }
  
})

const createArrayPrice = (arrayMonth, arrayWeek, arrayYesterday, arrayToday) => new Promise((resolve, reject) => {
  console.time('FULL_PRICE')
  console.log(`Starting price array creation...`)
  if (arrayToday.length !== 0) {
    let arrayPrices = arrayToday.map((element) => {
      return (comparisonID(element, arrayWeek, arrayYesterday, arrayMonth))
    })
    let promisePrice = Promise.all(arrayPrices)
    promisePrice.then((prices) => {
      console.timeEnd('FULL_PRICE')
      return resolve(prices)
    })
    .catch((errPromise) => {
      console.timeEnd('FULL_PRICE')
      return reject(errPromise)
    })
  } else {
    console.timeEnd('FULL_PRICE')
    return reject(new Error(`Error: invalid input`))
  }
})

const buildURLSearchCard = (cardID) => new Promise((resolve, reject) => {
  if (cardID) {
    let urlSearch = urlCardSearchPerID + cardID
    return resolve(urlSearch)
  } else {
    return reject('No card ID')
  }
})

const getNameCard = (cardTrends) => new Promise((resolve, reject) => {
  let cardID = cardTrends.cardID
  let trendDay = cardTrends.trendDay
  let trendWeek = cardTrends.trendWeek
  let trendMonth = cardTrends.trendMonth
  let price = cardTrends.priceToday
  buildURLSearchCard(cardID)
  .then((urlSearch) => {
    let options = {
        uri: urlSearch,
        method: 'GET'
    }
    rp(options)
    .then((body) => {
        let name = JSON.parse(body).name
        return resolve({
          cardID,
          name,
          trendDay,
          trendWeek,
          trendMonth, 
          price
        })
    })
    .catch((err) => {
        return reject(err)
    })
  })
  .catch((err) => {
    return reject(err)
  })
})

const getNameAllCard = (arrayTrend) => new Promise((resolve, reject) => {
  let queries = arrayTrend.map((cardTrends) => {
    return (getNameCard(cardTrends))
  })
  let queriesPromise = Promise.all(queries)
  queriesPromise.then((completeArray) => {
    return resolve(completeArray)
  })
  .catch((errArray) => {
    return reject(errArray)
  })
})

const createTop10 = (arrayTrends) => new Promise((resolve, reject) => {
  console.time(`SORT`)
  console.log(`Sorting the arrays ...`)
  let sortedArrayDayNoName = arrayTrends.sort((a, b) => {
    return (b.trendDay - a.trendDay)
  }).slice(0, 10)
  let sortedArrayWeekNoName = arrayTrends.sort((a, b) => {
    return (b.trendWeek - a.trendWeek)
  }).slice(0, 10)
  let sortedArrayMonthNoName = arrayTrends.sort((a, b) => {
    return (b.trendMonth - a.trendMonth)
  }).slice(0, 10)
  getNameAllCard(sortedArrayDayNoName)
  .then((sortedArrayDay) => {
    getNameAllCard(sortedArrayDayNoName)
    .then((sortedArrayWeek) => {
      getNameAllCard(sortedArrayMonthNoName)
      .then((sortedArrayMonth) => {
        console.timeEnd(`SORT`)
        return resolve({
          sortedArrayDay,
          sortedArrayWeek,
          sortedArrayMonth
        })
      })
      .catch((errMonth) => {
        return reject(errMonth)
      })
    })
    .catch((errWeek) => {
      return reject(errWeek)
    })
  })
  .catch((errDay) => {
    return reject(errDay)
  })
  
})

const queryDB = (client, infoCard, type) => new Promise((resolve, reject) => {
  let cardID = infoCard.cardID
  let name = infoCard.name.replace(/'/g,'')
  console.log(`Name: ${name}`)
  let price = infoCard.price
  console.log(`Querying the DB and updating the TOP10...: ${type}`)
  let trend = 0
  let DB=""
  if (type === 0) {
    trend = infoCard.trendDay
    DB = config.get("DB.PGTABLETRENDDAY.NAME")
  } else if (type === 1) {
    trend = infoCard.trendWeek
    DB = config.get("DB.PGTABLETRENDWEEK.NAME")
  } else if (type === 2) {
    DB = config.get("DB.PGTABLETRENDMONTH.NAME")
    trend = infoCard.trendMonth
  } else {
    return reject(`Unknown type`)
  }
  console.log(`INSERT INTO ${DB} (${config.get("DB.PGTABLETRENDDAY.COLUMN0")}, ${config.get("DB.PGTABLETRENDDAY.COLUMN1")}, ${config.get("DB.PGTABLETRENDDAY.COLUMN2")}, ${config.get("DB.PGTABLETRENDDAY.COLUMN3")}) VALUES ('${cardID}', '${name}', '${trend}', '${price}')`)
  client.query(`INSERT INTO ${DB} (${config.get("DB.PGTABLETRENDDAY.COLUMN0")}, ${config.get("DB.PGTABLETRENDDAY.COLUMN1")}, ${config.get("DB.PGTABLETRENDDAY.COLUMN2")}, ${config.get("DB.PGTABLETRENDDAY.COLUMN3")}) VALUES ('${cardID}', '${name}', '${trend}', '${price}')`)
  .then(() => {
    return resolve()
  })
  .catch((errDB) => {
    return reject(errDB)
  })
})

const allQueriesDB = (sortedArrays) => new Promise((resolve, reject) => {
  let arrayDay = sortedArrays.sortedArrayDay
  let arrayWeek = sortedArrays.sortedArrayWeek
  let arrayMonth = sortedArrays.sortedArrayMonth
  
  const pool = new Pool({
    user: config.get('DB.PGUSER'),
    host: config.get('DB.PGHOST'),
    database: config.get('DB.PGDATABASE'),
    password: config.get('DB.PGPASSWORD'),
    port: config.get('DB.PGPORT')
  })
  pool.connect()
  .then((client) => {
    let queryDay = arrayDay.map((array) => {
      return (queryDB(client, array, 0))
    })
    let queryDayPromise = Promise.all(queryDay)
    queryDayPromise.then(() => {
      console.log(`Queries DB Day Done`)
      let queryWeek = arrayWeek.map((array) => {
        return (queryDB(client, array, 1))
      })
      let queryWeekPromise = Promise.all(queryWeek)
      queryWeekPromise.then(() => {
        console.log(`Queries DB Week Done`)
        let queryMonth = arrayMonth.map((array) => {
          return (queryDB(client, array, 2))
        })
        let queryMonthPromise = Promise.all(queryMonth)
        queryMonthPromise.then(() => {
          console.log(`Queries DB Month Done`)
          pool.end()
          return resolve()
        })
        .catch((errMonth) => {
          pool.end()
          return reject(errMonth)
        })
      })
      .catch((errWeek) => {
        pool.end()
        return reject(errWeek)
      })
    })
    .catch((errDay) => {
      pool.end()
      return reject(errDay)
    })
  })
  .catch((errPool) => {
    return reject(errPool)
  })
})

DefineTop10 = () => new Promise((resolve, reject) => {
  const pool = new Pool({
    user: config.get('DB.PGUSER'),
    host: config.get('DB.PGHOST'),
    database: config.get('DB.PGDATABASE'),
    password: config.get('DB.PGPASSWORD'),
    port: config.get('DB.PGPORT')
  })
  pool.connect()
  .then((client) => {
    clearDB(client)
    .then(() => {
      console.log(`Clear DB done`)
      getPriceDate(client, currentDate())
      .then((infoToday) => {
        console.log(`Info Today received`)
        getPriceDate(client, dateYesterday())
        .then((infoYesterday) => {
          console.log(`Info Yesterday received`)
          getPriceDate(client, dateLastWeek())
          .then((infoLastWeek) => {
            console.log(`Info Last Week received`)
            getPriceDate(client, dateLastMonth())
            .then((infoLastMonth) => {
              console.log(`Info Last Month received`)
              createArrayPrice(infoLastMonth, infoLastWeek, infoYesterday, infoToday)
              .then((arrayTrend) => {
                createTop10(arrayTrend)
                .then((sortedArrays) => {
                  eraseFormerTop10(client)
                  .then(() => {
                    allQueriesDB(sortedArrays)
                    .then(() => {
                      return resolve()
                    })
                    .catch((errLast) => {
                      return reject(errLast)
                    })
                  })
                  .catch((errErase) => {
                    return reject(errErase)
                  })
                })
                .catch((errtop10) => {
                  return reject(errtop10)
                })
              })
              .catch((errPrices) => {
                return reject(errPrices)
              })
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
        pool.end()
        return reject(errToday)
      })
    })
    .catch((errDel) => {
      pool.end()
      return reject(errDel)
    })
  })
  .catch((errPool) => {
    return reject(errPool)
  })
})

let rule = new schedule.RecurrenceRule()
rule.hour = config.get("SCHEDULE_TOP_10.H")
rule.minute = config.get("SCHEDULE_TOP_10.MIN")

let scheduleTop10 = schedule.scheduleJob(rule, function() {
  console.time('TOP10')
  console.log(`Today: ${currentDate()}`)
  console.log(`Yesterday: ${dateYesterday()}`)
  console.log(`Last Week: ${dateLastWeek()}`)
  console.log(`Last Month: ${dateLastMonth()}`)
  DefineTop10()
  .then((trendsArray) => {
    console.log(`Succes DefineTop10`)
    console.timeEnd('TOP10')
  })
  .catch((err) => {
    console.log(err)
  })
})