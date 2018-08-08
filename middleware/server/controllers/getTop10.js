const config = require('config')
const { Client } = require('pg')

const queryDB = () => new Promise((resolve, reject) => {
  const client = new Client({
    user: config.get('DB.PGUSER'),
    host: config.get('DB.PGHOST'),
    database: config.get('DB.PGDATABASE'),
    password: config.get('DB.PGPASSWORD'),
    port: config.get('DB.PGPORT')
  })
  client.connect((errConnect) => {
    if(errConnect) {
      return reject(new Error(`Error while connection to DB: ${errConnect}`))
    } else {
      client.query(`SELECT * FROM ${config.get("DB.PGTABLETRENDDAY.NAME")}`)
      .then((resDay) => {
        let trendDay = resDay.rows
        client.query(`SELECT * FROM ${config.get("DB.PGTABLETRENDWEEK.NAME")}`)
        .then((resWeek) => {
          let trendWeek = resWeek.rows
          client.query(`SELECT * FROM ${config.get("DB.PGTABLETRENDMONTH.NAME")}`)
          .then((resMonth) => {
            let trendMonth = resMonth.rows
            client.end()
            return resolve({
              trendDay,
              trendWeek,
              trendMonth
            })
          })
          .catch((errMonth) => {
            client.end()
            return reject((errMonth))
          })
        })
        .catch((errWeek) => {
          client.end()
          return reject(errWeek)
        })
      })
      .catch((errDay) => {
        client.end()
        return reject(errDay)
      })
    }
  })
})

module.exports = {
  getTop10(req, res) {
    console.log(`Received request getTop10: ${req}`)
    queryDB()
    .then((trendObject) => {
      res.status(200).send(trendObject)
    })
    .catch((err) => {
      res.status(400).send(`Error while retrieving top10: ${err}`)
    })
  }
}