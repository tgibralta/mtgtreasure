const config = require('config')
const { Client } = require('pg')
const currentDate = require('./../helpers/currentDate').currentDate


const checkIfEntryExists = (userID, date) => new Promise ((resolve, reject) => {
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
      client.query(`SELECT * FROM ${config.get("DB.PGTABLEDAILYINFOUSER.NAME")} 
                    WHERE ${config.get("DB.PGTABLEDAILYINFOUSER.COLUMN0")} = '${userID}' AND
                    ${config.get("DB.PGTABLEDAILYINFOUSER.COLUMN5")} = '${date}'`)
      .then((response) => {
        if (response.rows[0]) {
          client.end()
          return resolve(true)
        } else {
          client.end()
          return resolve(false)
        }
      })
      .catch((errQuery) => {
          return reject(errQuery)
      })
    }
  })
})

const deleteEntryHistory = (userID, date) => new Promise ((resolve, reject) => {
  const client = new Client({
    user: config.get('DB.PGUSER'),
    host: config.get('DB.PGHOST'),
    database: config.get('DB.PGDATABASE'),
    password: config.get('DB.PGPASSWORD'),
    port: config.get('DB.PGPORT')
  })
  client.connect((errConnect) => {
    if(errConnect) {
      return reject(errConnect)
    } else {
      client.query(`DELETE FROM ${config.get("DB.PGTABLEDAILYINFOUSER.NAME")} 
                    WHERE ${config.get("DB.PGTABLEDAILYINFOUSER.COLUMN0")} = '${userID}' AND
                    ${config.get("DB.PGTABLEDAILYINFOUSER.COLUMN5")} = '${date}'`)
      .then(() => {
        client.end()
        return resolve()
      })
      .catch((errQuery) => {
        client.end()
        return reject(errQuery)
      })
    }
  })
})

const addEntryHistory = (userID, value, nbCard, investment, profit, date) => new Promise((resolve, reject) => {
  const client = new Client({
    user: config.get('DB.PGUSER'),
    host: config.get('DB.PGHOST'),
    database: config.get('DB.PGDATABASE'),
    password: config.get('DB.PGPASSWORD'),
    port: config.get('DB.PGPORT')
  })
  client.connect((errConnect) => {
    if(errConnect) {
      return reject(errConnect)
    } else {
      client.query(`INSERT INTO ${config.get("DB.PGTABLEDAILYINFOUSER.NAME")} 
                    ( ${config.get("DB.PGTABLEDAILYINFOUSER.COLUMN0")},
                      ${config.get("DB.PGTABLEDAILYINFOUSER.COLUMN1")},
                      ${config.get("DB.PGTABLEDAILYINFOUSER.COLUMN2")},
                      ${config.get("DB.PGTABLEDAILYINFOUSER.COLUMN3")},
                      ${config.get("DB.PGTABLEDAILYINFOUSER.COLUMN4")},
                      ${config.get("DB.PGTABLEDAILYINFOUSER.COLUMN5")})
                      VALUES ('${userID}', '${value}', '${nbCard}', 
                              '${investment}', '${profit}', '${date}')`)
      .then(() => {
        client.end()
        return resolve()
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
   * @description Update information of user's history for this day
   * @param {integer} userID
   * @param {integer} valueCollection
   * @param {integer} nbCard
   * @param {integer} investment
   * @param {integer} potentialProfit
   * @return {String} Success message
   */
  addUserHistory(req, res) {
    let userID = req.body.userID
    let valueCollection = req.body.valueCollection
    let nbCard = req.body.nbCard
    let investment = req.body.investment
    let potentialProfit = req.body. potentialProfit
    let date = currentDate()

    checkIfEntryExists(userID, date)
    .then((ifExist) => {
      if (ifExist) {
        deleteEntryHistory(userID, date)
        then(() => {
          addEntryHistory(userID, valueCollection,nbCard,investment,potentialProfit,date)
          .then(() => {
            res.status(200).send(`Succesfully updated history`)
          })
          .catch((errAddEntry) => {
            console.log(`Error in addEntryHistory: ${errAddEntry}`)
            res.status(400).send(errAddEntry)
          })
        })
        .catch((errDel) =>{
          console.log(`Error in deleteEntryHistory: ${errDel}`)
          res.status(400).send(errDel)
        })
      } else {
        addEntryHistory(userID, valueCollection,nbCard,investment,potentialProfit,date)
        .then(() => {
          res.status(200).send(`Succesfully added history`)
        })
        .catch((errAddEntry) => {
          console.log(`Error in addEntryHistory: ${errAddEntry}`)
          res.status(400).send(errAddEntry)
        })
      }
    })
    .catch((errIfExist) => {
      console.log(`Error in checkIfEntryExists: ${errIfExist}`)
      res.status(400).send(errIfExist)
    })
  },
  checkIfEntryExists,
  deleteEntryHistory,
  addEntryHistory

}