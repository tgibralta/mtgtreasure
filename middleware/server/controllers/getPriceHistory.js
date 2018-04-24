const config = require('config')
const { Client } = require('pg')

const buildObjectPriceHistory = (row) => new Promise ((resolve, reject) => {
  if (row) {
    return resolve ({
      'price': row.price,
      'date': row.date
    })
  } else return reject(`Invalid row`)
  
})

const extractPriceHistory =(row) => new Promise ((resolve, reject) => {
  const client = new Client({
    user: config.get('DB.PGUSER'),
    host: config.get('DB.PGHOST'),
    database: config.get('DB.PGDATABASE'),
    password: config.get('DB.PGPASSWORD'),
    port: config.get('DB.PGPORT')
  })
  let cardID = row.card_id
  let cardname = row.cardname
  console.log(`CardID: ${cardID}`)
  console.log(`Cardname; ${cardname}`)
  client.connect((errConnect) => {
    if (errConnect) {
      return reject(errConnect)
    } else {
      console.log(`QUERY: SELECT * FROM ${config.get("DB.PGTABLEPRICETRACKED.NAME")} WHERE ${config.get("DB.PGTABLEPRICETRACKED.COLUMN0")} = '${cardID}'`)
      client.query(`SELECT * FROM ${config.get("DB.PGTABLEPRICETRACKED.NAME")} WHERE ${config.get("DB.PGTABLEPRICETRACKED.COLUMN0")} = '${cardID}'`)
      .then((res) => {
        console.log(`ROWS: ${JSON.stringify(res.rows)}`)
        let objectRows = res.rows.map(buildObjectPriceHistory)
        let promiseRow = Promise.all(objectRows)
        promiseRow
        .then((pricesAndDates) => {
          client.end()
          console.log(`Prices and Dates for ${cardname}: ${JSON.stringify(pricesAndDates)}`)
          return resolve ({
            'cardID': cardID,
            'cardName': cardname,
            'history': pricesAndDates
          })
        })
        .catch((errTransfor) => {
          client.end()
          return reject(errTransfor)
        })
      })
      .catch((errQuery) => {
        client.end()
        return reject(errQuery)
      })
    }
  })
})

module.exports = {
  /**
  * @description Return price history for all cards tracked by a given user
  * @param {integer} userID
  * @return {String} Array of all the cards followed by user with price depending on the day
  */
  getPriceHistory(req, res) {
    const client = new Client({
      user: config.get('DB.PGUSER'),
      host: config.get('DB.PGHOST'),
      database: config.get('DB.PGDATABASE'),
      password: config.get('DB.PGPASSWORD'),
      port: config.get('DB.PGPORT')
    })
    let userID = req.params.userid
    client.connect((errConnect) => {
      if (errConnect) {
        res.status(400).send(`Error Connection Database: ${errConnect}`)
      } else {
        client.query(`SELECT * FROM ${config.get("DB.PGTABLELISTTRACKED.NAME")} WHERE ${config.get("DB.PGTABLELISTTRACKED.COLUMN0")} = '${userID}'`)
        .then((response) => {
          console.log(`ROWS: ${JSON.stringify(response.rows)}`)
          let answer = response.rows.map(extractPriceHistory)
          let answerPromise = Promise.all(answer)
          answerPromise
          .then((history) => {
            client.end()
            res.status(200).send(history)
          })
          .catch((errHistory) => {
            client.end()
            res.status(400).send(errHistory)
          })
        })
        .catch((errQueryList) => {
          client.end()
          res.status(400).send(`Error Query Database: ${errQueryList}`)
        })
      }
    })
  }
}