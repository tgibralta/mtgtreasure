const config = require('config')
const { Client } = require('pg')



module.exports = {
   /**
   * @description Return all cards in a given deck depending on deckID
   * @param {integer} deckID
   * @return {String} Array of all the cards in the deck
   */
  getDeck(req, res) {
    const client = new Client({
      user: config.get('DB.PGUSER'),
      host: config.get('DB.PGHOST'),
      database: config.get('DB.PGDATABASE'),
      password: config.get('DB.PGPASSWORD'),
      port: config.get('DB.PGPORT')
    })
    let deckID = req.params.deckid
    console.log(`deckid: ${deckID}`)
    client.connect((errConnect) => {
      if(errConnect) {
        console.log(`errConnect: ${errConnect}`)
        res.status(400).send(errConnect)
      } else {
        client.query(`SELECT * FROM ${config.get('DB.PGTABLEDECK.NAME')} WHERE ${config.get('DB.PGTABLEDECK.COLUMN4')} = '${deckID}'`)
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