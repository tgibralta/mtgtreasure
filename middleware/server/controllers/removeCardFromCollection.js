const config = require('config')
const { Client } = require('pg')


// CHECK IF CARD IS ALREADY IN TABLE AT THE SAME PRICE OR IF CARD ALREADY IN DB WITH NUMBER = 0
const removeCardQuery = (collectionID, nb_card_to_remove, nb_card_available) => new Promise((resolve, reject) => {
  const client = new Client({
    user: config.get('DB.PGUSER'),
    host: config.get('DB.PGHOST'),
    database: config.get('DB.PGDATABASE'),
    password: config.get('DB.PGPASSWORD'),
    port: config.get('DB.PGPORT')
  })
  client.connect((errorConnect) => {
    if(errorConnect) {
      return reject(errorConnect)
    } else {
      if (nb_card_to_remove === nb_card_available) { // JUST NEED TO REMOVE THE ENTRY
        client.query(`DELETE FROM ${config.get('DB.PGTABLECOLLECTION.NAME')} WHERE ${config.get('DB.PGTABLECOLLECTION.COLUMN0')} = '${collectionID}'`)
        .then(() => {
          client.end()
          return resolve(`Entry deleted from DB`)
        })
        .catch((errDEL) => {
          client.end()
          return reject(`Error during delete`)
        })
      } else { // UPDATE THE NUMBER
        if (nb_card_available < nb_card_to_remove) {
          client.end()
          return reject(`Error: NB Card invalid`)
        } else {
          let newNumber = nb_card_available - nb_card_to_remove
          client.query(`UPDATE ${config.get('DB.PGTABLECOLLECTION.NAME')} SET ${config.get('DB.PGTABLECOLLECTION.COLUMN4')} = '${newNumber}' WHERE ${config.get('DB.PGTABLECOLLECTION.COLUMN0')} = '${collectionID}'`)
          .then(() => {
            client.end()
            return resolve(`Updated`)
          })
          .catch((errDEL) => {
            client.end()
            return reject(`Error during update`)
          })
        }
      }
    }
  })
})

module.exports = {
  removeCardFromCollection(req,res) {
    return new Promise((resolve, reject) => {
      let collectionID = req.body.collectionID
      let nbCardToRemove = req.body.nbCardToRemove
      let currentNbCard = req.body.currentNbCard
      removeCardQuery(collectionID, nbCardToRemove, currentNbCard)
      .then((msg) => {
        res.status(200).send(msg)
      })
      .catch((err) => {
        res.status(400).send(err)
      })
    })
  }
}