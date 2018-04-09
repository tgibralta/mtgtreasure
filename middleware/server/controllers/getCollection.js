const config = require('config')
const { Client } = require('pg')

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
        client.end()
        return resolve(res.rows)
      })
      .catch((errQuery) => {
        client.end()
        return reject(`Error during query DB`)
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
        res.status(200).send(rows)
      })
      .catch((err) => {
        res.status(400).send(err)
      })
    })
  }
}