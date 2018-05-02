const config = require('config')
const { Client } = require('pg')
const currentDate = require('./../helpers/currentDate').currentDate
const deleteEntryHistory = require('./addUserHistory').deleteEntryHistory
const addEntryHistory = require('./addUserHistory').addEntryHistory
const checkIfEntryExists = require('./../controllers/addUserHistory').checkIfEntryExists

const returnCurrentUserValue = (userID, date) => new Promise ((resolve, reject) => {
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
        client.end()
        return resolve(response.rows)
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
   * @param {integer} mode // ADD OR REMOVE
   * @param {integer} differenceNbCard
   * @param {integer} differenceValue
   * @param {integer} differenceInvestment
   * @return {String} Success message
   */
  updateUserHistory(req, res) {
    let userID = req.body.userID
    let nbCard = req.body.differenceNbCard
    let value = parseFloat(req.body.differenceValue)
    let investment = req.body.differenceInvestment
    let date = currentDate()
    let mode = req.body.mode
    console.log(`UserID: ${userID}`)
    console.log(`value: ${value}, ${typeof(value)}`)
    console.log(`nbCard: ${nbCard}`)
    console.log(`investment: ${investment}`)
    console.log(`date: ${date}`)
    if (mode === "ADD" | mode === "REMOVE") {
      checkIfEntryExists(userID, date)
      .then((ifExist) => {
        if (ifExist) {
          returnCurrentUserValue(userID, date)
          .then ((rows) => {
            let currentValue = parseFloat(rows[0].value)
            let currentNbCard = rows[0].nb_card
            let currentInvestment = rows[0].investment
            let currentPotentialProfit = rows[0].potential_profit
            console.log(`UserID: ${userID}`)
            console.log(`currentValue: ${currentValue}, ${typeof(currentValue)}`)
            console.log(`currentNbCard: ${currentNbCard}`)
            console.log(`currentInvestment: ${currentInvestment}`)
            console.log(`currentPotentialProfit: ${currentPotentialProfit}`)
            let newValue = 0
            let newNbCard = 0
            let newInvestment = 0
            let newProfit = 0
            
            if (mode === "ADD") {
              newValue = currentValue + value
              newNbCard = currentNbCard + nbCard
              newInvestment = currentInvestment + investment
              newProfit = Math.ceil(currentPotentialProfit + (newValue - newInvestment))
            } else if (mode === "REMOVE") {
              newValue = currentValue - value
              newNbCard = currentNbCard - nbCard
              newInvestment = currentInvestment - investment
              newProfit = Math.ceil(currentPotentialProfit + (newValue - newInvestment))
            }
            console.log(`UserID: ${userID}`)
            console.log(`newValue: ${newValue}`)
            console.log(`newNbCard: ${newNbCard}`)
            console.log(`newInvestment: ${newInvestment}`)
            console.log(`newProfit: ${newProfit}`)
            console.log(`date: ${date}`)
            deleteEntryHistory(userID, date)
            .then(() => {
              addEntryHistory(userID, newValue, newNbCard, newInvestment, newProfit, date)
              .then(() => {
                res.status(200).send({
                  "existed": "true",
                  "value": newValue,
                  "nbCard": newNbCard,
                  "investment": newInvestment,
                  "profit": newProfit,
                  "date": date
                })
              })
              .catch((errEntry) => {
                console.log(errEntry)
                res.status(400).send(errEntry)
              })
            })
            .catch((errDel) => {
              console.log(errDel)
              res.status(400).send(errDel)
            })
          })
          .catch((errCurrentValue) => {
            console.log(errCurrentValue)
            res.status(400).send(errCurrentValue)
          })
        } else {
          let dateElements = date.split("/")
          let dateYesterday = ""
          if (dateElements[2] == 1 && dateElements[1] == 1) {
            dateYesterday = (parseInt(dateElements[0]) - 1).toString() + "/" + "12" + "/" + "31"
          } else if (dateElements[2] == 1) {
            dateYesterday = dateElements[0] + "/" + (parseInt(dateElements[1]) - 1).toString() + "/" + "31"
          }
          returnCurrentUserValue(userID, dateYesterday)
          .then ((rows) => {
            let currentValue = rows[0].value
            let currentNbCard = rows[0].nb_card
            let currentInvestment = rows[0].investment
            let currentPotentialProfit = rows[0].potential_profit

            let newValue = 0
            let newNbCard = 0
            let newInvestment = 0
            let newProfit = 0
            
            if (mode === "ADD") {
              newValue = currentValue + value
              newNbCard = currentNbCard + nbCard
              newInvestment = currentInvestment + investment
              newProfit = Math.ceil(currentPotentialProfit + (newValue - newInvestment))
            } else if (mode === "REMOVE") {
              newValue = currentValue - value
              newNbCard = currentNbCard - nbCard
              newInvestment = currentInvestment - investment
              newProfit = Math.ceil(currentPotentialProfit + (newValue - newInvestment))
            }
            addEntryHistory(userID, newValue, newNbCard, newInvestment, newProfit, date)
            .then(() => {
              res.status(200).send({
                "existed": "false",
                "value": newValue,
                "nbCard": newNbCard,
                "investment": newInvestment,
                "profit": newProfit
              })
            })
            .catch((errEntry) => {
              console.log(errEntry)
              res.status(400).send(errEntry)
            })
          })
          .catch((errCurrentValue) => {
            console.log(errCurrentValue)
            res.status(400).send(errCurrentValue)
          })
        }
      })
      .catch((errCheckIfExists) => {

      })
      
    } else {
      res.status(400).send("Wrong operation")
    }
    
  }

}