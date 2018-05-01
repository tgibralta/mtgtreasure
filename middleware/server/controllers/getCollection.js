const config = require('config')
const { Client } = require('pg')
const sortPerDate = require('./../helpers/sortPerDate').sortPerDate

const buildObjectPriceHistory = (row) => new Promise ((resolve, reject) => {
  if (row) {
    return resolve ({
      'price': row.price,
      'date': row.date
    })
  } else return reject(`Invalid row`)
  
})

const getPriceHistory= (row) => new Promise((resolve, reject) =>{
  let cardID = row.card_id
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
      // console.log(`SELECT * FROM ${config.get("DB.PGTABLEPRICETRACKED.NAME")} WHERE ${config.get("DB.PGTABLEPRICETRACKED.COLUMN0")} = '${cardID}'`)
      client.query(`SELECT * FROM ${config.get("DB.PGTABLEPRICETRACKED.NAME")} WHERE ${config.get("DB.PGTABLEPRICETRACKED.COLUMN0")} = '${cardID}'`)
      .then((response) => {
        let priceHistoryObject = response.rows.map(buildObjectPriceHistory)
        let promiseHistory = Promise.all(priceHistoryObject)
        promiseHistory
        .then((priceHistoryUnsorted) => {
          client.end()
          let priceHistory = priceHistoryUnsorted.sort(sortPerDate)
          // console.log(`Price history: ${JSON.stringify(priceHistory)}`)

          return resolve({
                "collection_id":row.collection_id,
                "user_id":row.user_id,
                "card_id":row.card_id,
                "init_price":row.init_price,
                "number_of_card":row.number_of_card,
                "date_buy":row.date_buy,
                "last_update":row.last_update,
                priceHistory
          })
        })
        .catch((errHistory) => {
          client.end()
          console.log(errHistory)
          return reject(errHistory)
        })
      })
      .catch((errQuery) => {
        client.end()
        console.log(errQuery)
        return reject(errQuery)
      })
    }
  })
})

const queryCollection = (user_id) => new Promise((resolve, reject) => {
  const client = new Client({
    user: config.get('DB.PGUSER'),
    host: config.get('DB.PGHOST'),
    database: config.get('DB.PGDATABASE'),
    password: config.get('DB.PGPASSWORD'),
    port: config.get('DB.PGPORT')
  })
  client.connect((errorConnect) => {
    if (errorConnect) {
      return reject(errorConnect)
    } else {
      client.query(`SELECT * FROM ${config.get('DB.PGTABLECOLLECTION.NAME')} WHERE ${config.get('DB.PGTABLECOLLECTION.COLUMN1')} = '${user_id}'`)
      .then((res) => {
        let rows = res.rows
        let mapHistory = rows.map(getPriceHistory)
        let promiseHistory = Promise.all(mapHistory)
        promiseHistory
        .then((objectCollectionWithHistory) => {
          client.end()
          return resolve(objectCollectionWithHistory)
        })
        .catch((errPromise) => {
          return reject(errPromise)
        })   
      })
      .catch((errQuery) => {
        client.end()
        console.log(errQuery)
        return reject(`Error during query DB: ${errQuery}`)
      })
    }
  })
})

module.exports = {
 /**
 * @description Returns an array with all the cards belonging to a user
 * @param {String} userID
 * @return {JSON} Array of cards
 */
  getCollection (req, res) {
    return new Promise((resolve, reject) => {
      queryCollection(req.params.userid)
      .then((rows) => {
        console.log(JSON.stringify(rows))
        res.status(200).send(rows)
      })
      .catch((err) => {
        res.status(400).send(err)
      })
    })
  }
}