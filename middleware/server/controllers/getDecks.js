const config = require('config')
const { Client } = require('pg')

module.exports = {
  /**
  * @description Return all decks in the database for a given userID
  * @param {integer} userID
  * @return {JSON} Object with all the deckID, Legality and most expensive card in it
  */
  getDecks(req, res) {
    const client = new Client({
      user: config.get('DB.PGUSER'),
      host: config.get('DB.PGHOST'),
      database: config.get('DB.PGDATABASE'),
      password: config.get('DB.PGPASSWORD'),
      port: config.get('DB.PGPORT')
    })
    console.log(`Client: ${client}`)
    let userID = req.params.userid
    client.connect((errConnect) => {
      if(errConnect) {
        console.log(`errConnect: ${errConnect}`)
        res.status(400).send(errConnect)
      } else {
        client.query(`SELECT * FROM ${config.get('DB.PGTABLELISTDECKS.NAME')} WHERE ${config.get('DB.PGTABLELISTDECKS.COLUMN0')} = '${userID}'`)
        .then((response) => {
          res.status(200).send(response.rows)
        })
        .catch((errQuery) => {
          console.log(`errQuery: ${errQuery}`)
          res.status(400).send(errQuery)
        })
      }
    })
  }
}