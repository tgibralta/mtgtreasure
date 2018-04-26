const config = require('config')
const { Client } = require('pg')

const buildUserHistory = (row) => new Promise((resolve, reject) => {
  if (row) {
    return resolve ({
      "date" : row.date,
      "value_collection": row.value,
      "investment" : row.investment,
      "potential_profit" : row.potential_profit,
      "nb_card" : row.nb_card
    })
  } else {
    return reject(`Invalid History information`)
  }
})

module.exports = {
  /**
  * @description Return history of information for a user
  * @param {integer} userid
  * @return {String} Array of all information for a given user per day
  */
  getUserHistory(req, res) {
    let userID = req.params.userid
    const client = new Client({
      user: config.get('DB.PGUSER'),
      host: config.get('DB.PGHOST'),
      database: config.get('DB.PGDATABASE'),
      password: config.get('DB.PGPASSWORD'),
      port: config.get('DB.PGPORT')
    })
    client.connect((errConnect) => {
      if (errConnect) {
          res.status(400).send(errConnect)
      } else {
        console.log(`Query to client: SELECT * FROM ${config.get("DB.PGTABLEDAILYINFOUSER.NAME")} 
                        WHERE ${config.get("DB.PGTABLEDAILYINFOUSER.COLUMN0")} = '${userID}'`)
        client.query(`  SELECT * FROM ${config.get("DB.PGTABLEDAILYINFOUSER.NAME")} 
                        WHERE ${config.get("DB.PGTABLEDAILYINFOUSER.COLUMN0")} = '${userID}'`)
        .then((response) => {
          let history = response.rows
          let mapHistory = history.map(buildUserHistory)
          let promiseHistory = Promise.all(mapHistory)
          promiseHistory
          .then((userHistory) => {
            client.end()
            res.status(200).send(userHistory)
          })
          .catch((errHistory) => {
            client.end()
            console.log(`History: ${errHistory}`)
            res.status(400).send(errHistory)
          })
        })
        .catch((errQuery) => {
          client.end()
          console.log(`Query: ${errQuery}`)
          res.status(400).send(errQuery)
        })
      }
    })
  }
}