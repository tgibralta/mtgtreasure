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

module.exports = {
  /**
  * @description Return price history for a given card
  * @param {integer} cardID
  * @return {String} Array of all the cards followed by user with price depending on the day
  */
  getPriceHistory(req, res) {
    let cardID = req.params.cardid
    const client = new Client({
      user: config.get('DB.PGUSER'),
      host: config.get('DB.PGHOST'),
      database: config.get('DB.PGDATABASE'),
      password: config.get('DB.PGPASSWORD'),
      port: config.get('DB.PGPORT')
    })
    
    client.connect((errConnect) => {
      if (errConnect) {
        res.status(400).send(`Error Connection Database: ${errConnect}`)
      } else {
        console.log(`SELECT * FROM ${config.get("DB.PGTABLEPRICETRACKED.NAME")} WHERE ${config.get("DB.PGTABLEPRICETRACKED.COLUMN0")} = '${cardID}'`)
        client.query(`SELECT * FROM ${config.get("DB.PGTABLEPRICETRACKED.NAME")} WHERE ${config.get("DB.PGTABLEPRICETRACKED.COLUMN0")} = '${cardID}'`)
        .then((response) => {
          let priceHistoryObject = response.rows.map(buildObjectPriceHistory)
          let promiseHistory = Promise.all(priceHistoryObject)
          promiseHistory
          .then((priceHistoryUnsorted) => {
            let priceHistory = priceHistoryUnsorted.sort(sortPerDate)
            client.end()
            console.log(`Price history: JSON.stringify(${priceHistory})`)
            res.status(200).send({priceHistory})
          })
          .catch((errHistory) => {
            client.end()
            console.log(errHistory)
            res.status(400).send(errHistory)
          })
        })
        .catch((errQuery) => {
          client.end()
          console.log(errQuery)
          res.status(400).send(errQuery)
        })
      }
    })
  }
}