const schedule = require('node-schedule')
const config = require('config')
const rp = require('request-promise')
const urlSearch = require('./../models/apiDescription').urlGetCards
const { Client, Pool } = require('pg')
const currentDate = require('./../helpers/currentDate').currentDate

const queryToDB = (data, client) => new Promise((resolve, reject) => {
  let card_id = data.multiverse_ids[0] || 0
  let price = data.usd || 0
  let date = currentDate()
  client.query(`INSERT INTO ${config.get("DB.PGTABLEPRICETRACKED.NAME")} (${config.get("DB.PGTABLEPRICETRACKED.COLUMN0")}, ${config.get("DB.PGTABLEPRICETRACKED.COLUMN1")}, ${config.get("DB.PGTABLEPRICETRACKED.COLUMN2")}) 
                VALUES ('${card_id}', '${price}', '${date}')`)
  .then(() => {
    
    return resolve()
  })
  .catch((err) => {
    // client.release()
    return reject(err)
  })  
})

const requestToAPI = (options) => new Promise ((resolve, reject) => {
  
  let optionsQuery = options
  rp(optionsQuery)
  .then((res) => {
    const pool = new Pool({
      user: config.get('DB.PGUSER'),
      host: config.get('DB.PGHOST'),
      database: config.get('DB.PGDATABASE'),
      password: config.get('DB.PGPASSWORD'),
      port: config.get('DB.PGPORT')
    })
    pool.connect()
    .then((client) => {
      let response = JSON.parse(res)
      let has_more = response.has_more
      let next_page = response.next_page
      let data = response.data
      let queries = data.map(function(rowData) {return queryToDB(rowData, client)})
      let promiseQueries = Promise.all(queries)
      promiseQueries
      .then(() => {
        if (has_more) {
          optionsQuery = {
            uri: next_page,
            method: 'GET'
          }
          client.release()
          pool.end()
          console.log(next_page)
          requestToAPI(optionsQuery)
          .then(() => {
            return resolve()
          })
          .catch((errInception) => {
            return reject(errInception)
          })
        } else {
          pool.end()
          return resolve()
        }
      })
      .catch((errQueries) => {
        pool.end()
        return reject(errQueries)
      })
    })
    .catch((errPool) => {
      return reject(errPool)
    })
  })
  .catch((err) => {
    console.log(`FetchPrice Job failed: ${err}`)
  })
})

const checkIfEntryExists = require('./../controllers/addUserHistory').checkIfEntryExists
const deleteEntryHistory = require('./../controllers/addUserHistory').deleteEntryHistory
const addEntryHistory = require('./../controllers/addUserHistory').addEntryHistory

const getUsers = () => new Promise((resolve, reject) => {
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
      client.query(`SELECT * FROM ${config.get("DB.PGTABLELOGIN.NAME")}`)
      .then((response) => {
        client.end()
        return resolve(response.rows)
      })
      .catch((errGetUser)=> {
        client.end()
        return reject(errGetUser)
      })
    }
  })
})

const buildInfoCard = (cardInCollection, client) => new Promise((resolve, reject) =>{
  let cardID = cardInCollection.card_id
  let nbCard = cardInCollection.number_of_card
  let initValue = cardInCollection.init_price
  let userID = cardInCollection.user_id
  let investment = nbCard * initValue
  // console.log(`In buildInfoCard`)
  // console.log(`CARDID: ${cardID}`)
  // console.log(`NBCARD: ${nbCard}`)
  // console.log(`InitPrice: ${initValue}`)
  // console.log(`Investment: ${investment}`)
  client.query(`SELECT * FROM ${config.get("DB.PGTABLEPRICETRACKED.NAME")} WHERE ${config.get("DB.PGTABLEPRICETRACKED.COLUMN0")} = '${cardID}'`)
  .then((response) => {
    let priceCard = response.rows[0].price
    // console.log(`Response for Tracked Price: ${JSON.stringify(response.rows)}`)
    let value = nbCard * priceCard
    // console.log(`Value: ${value}`)
    // console.log(JSON.stringify({nbCard, value, investment, userID}))
    return resolve({nbCard, value, investment, userID})
  })
  .catch((errQuery) => {
    return reject(errQuery)
  })
})

const getCollection = (user) => new Promise((resolve, reject) => {
  let userID = user.user_id
  const pool = new Pool({
    user: config.get('DB.PGUSER'),
    host: config.get('DB.PGHOST'),
    database: config.get('DB.PGDATABASE'),
    password: config.get('DB.PGPASSWORD'),
    port: config.get('DB.PGPORT')
  })
  pool.connect()
  .then((client) => {
    // console.log(`SELECT * FROM ${config.get("DB.PGTABLECOLLECTION.NAME")} WHERE ${config.get("DB.PGTABLECOLLECTION.COLUMN1")} = '${userID}'`)
    client.query(`SELECT * FROM ${config.get("DB.PGTABLECOLLECTION.NAME")} WHERE ${config.get("DB.PGTABLECOLLECTION.COLUMN1")} = '${userID}'`)
    .then((response) => {
      let collection = response.rows
      if (collection) {
        let cardInfo = collection.map(function(cardInCollection) {
          return (buildInfoCard(cardInCollection, client))
        })
        let cardInfoPromise = Promise.all(cardInfo)
        cardInfoPromise
        .then((infoCard) => {
          client.release()
          console.log(`Entering Final step with reduces`)
          let valueUser = 0
          let nbCardUser = 0
          let investmentUser = 0
          let profitUser = 0
          let userID = infoCard[0].userID
          infoCard.forEach((info) => {
            valueUser += info.value
            nbCardUser += info.nbCard
            investmentUser += info.investment
            profitUser += (info.value - info.investment)
          })
          console.log(`Values: ${valueUser}, ${nbCardUser}, ${investmentUser}, ${profitUser} for user ${userID}`)
          console.log(``)
          let date = currentDate()
          console.log(`Date: ${date}`)
          checkIfEntryExists(userID, date)
          .then((ifExist) => {
            if (ifExist) {
              console.log('Updating entry')
              deleteEntryHistory(userID, date)
              .then(() => {
                addEntryHistory(userID, valueUser,nbCardUser,investmentUser,profitUser,date)
                .then(() => {
                  pool.end()
                  return resolve()
                })
                .catch((errAddEntry) => {
                  pool.end()
                  console.log(`addEntryHistory : ${errAddEntry}`)
                  return reject(errAddEntry)
                })
              })
              .catch((errDel) =>{
                pool.end()
                console.log(`deleteEntryHistory : ${errDel}`)
                return reject(errDel)
              })
            } else {
              console.log('Creating entry')
              addEntryHistory(userID, valueUser,nbCardUser,investmentUser,profitUser,date)
              .then(() => {
                pool.end()
                return resolve()
              })
              .catch((errAddEntry) => {
                pool.end()
                console.log(`addEntryHistory : ${errAddEntry}`)
                return reject(errAddEntry)
              })
            }
          })
          .catch((errIfExist) => {
            return reject(errIfExist)
          })
        })
        .catch((errCardInfo) => {
          return reject(errCardInfo)
        })
      } else { // empty collection case
        return resolve()
      }
    })
    .catch((errGetUser)=> {
      pool.end()
      return reject(errGetUser)
    })
  })
  .catch((errConnect) => {
    return reject(errConnect)
  })
})




const updateClientHistory = () => new Promise((resolve, reject) => {
  getUsers()
  .then ((users) => {
    console.log(`List Users: ${JSON.stringify(users)}`)
    let collectionUser = users.map(getCollection)
    let collectionPromise = Promise.all(collectionUser)
    collectionPromise
    .then (() => {
      return resolve()
    })
    .catch((errCollection) => {
      return reject(errCollection)
    })
  })
  .catch((errUser) => {
    console.log(`Error while fetching users: ${errUser}`)
    return reject (errUser)
  })
})


let rule = new schedule.RecurrenceRule()
rule.hour = config.get("SCHEDULE_FETCH_PRICE.H")
rule.minute = config.get("SCHEDULE_FETCH_PRICE.MIN")
// rule.second = new schedule.Range(0,59,30)

let scheduleFetchPrice = schedule.scheduleJob(rule, function(){

  let pageNb = 1
  let url = urlSearch + pageNb.toString()
  console.log(url)
  let options = {
    uri: url,
    method: 'GET'
  }
  requestToAPI(options)
  .then(() => {
    console.log(`Schedule Job gracefully completed. Now updating the client history`)
    updateClientHistory()
    .then (() => {
      console.log(`History Job gracefully completed`)
    })
    .catch((errUpdate) => {
      console.log(`History Update sadly failed: ${errUpdate}`)
    })
  })
  .catch((errRequest) => {
    console.log(`Schedule Job sadly failed: ${errRequest}`)
  })
})