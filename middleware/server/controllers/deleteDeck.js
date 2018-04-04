const config = require('config')
const { Client } = require('pg')

module.exports = {
   /**
   * @description Delete all cards in a deck
   * @param {integer} deckID
   * @return {String} Success message
   */
  deleteDeck(req, res) {
    const client = new Client({
      user: config.get('DB.PGUSER'),
      host: config.get('DB.PGHOST'),
      database: config.get('DB.PGDATABASE'),
      password: config.get('DB.PGPASSWORD'),
      port: config.get('DB.PGPORT')
    })
    let deckID = req.params.deckid
    console.log(`deckid: ${deckID}`)
    client.connect()
    .then(() => {
      console.log(`DELETE FROM ${config.get('DB.PGTABLEDECK.NAME')} WHERE ${config.get('DB.PGTABLEDECK.COLUMN4')} = '${deckID}'`)
      client.query(`DELETE FROM ${config.get('DB.PGTABLEDECK.NAME')} WHERE ${config.get('DB.PGTABLEDECK.COLUMN4')} = '${deckID}'`)
      .then(() => {
        client.end()
        res.status(200).send()
      })
      .catch((errQuery) => {
        client.end()
        console.log(errQuery)
        res.status(400).send(errQuery)
      })
    })
    .catch((errConnect) => {
      res.status(400).send(errConnect)
    })
  }
}