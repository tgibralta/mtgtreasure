const config = require('config')
const { Pool, Client } = require('pg')

// CHECK FROM DB IF DECK ID ALREADY EXISTS
const checkIfDeckAlreadyExists = (deckID) => new Promise((resolve, reject) => {
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
      client.query(`SELECT * FROM ${config.get('DB.PGTABLEDECK.NAME')} WHERE ${config.get('DB.PGTABLEDECK.COLUMN4')} = '${deckID}'`)
      .then((res) => {
        console.log(`ROWS: ${res.rows}`)
        if(res.rows[0]) {
          client.end()
          console.log(`Deck exists`)
          return resolve(true)
        } else {
          client.end()
          console.log(`Deck does not exist`)
          return resolve(false)
        }
      })
      .catch((errQuery) => {
        console.log(errQuery)
        return reject(errQuery)
      })
    }
  })
})

// LOOP ON ARRAY OF REQUEST AND ADD ALL THE CARDS IN DB WITH THE PROPER DECK ID AND PROPER NUMBER
const addAllCardsQuery = (rows, deckID, userID) => new Promise((resolve, reject) => {
  console.log(`Entering addAllCardsQuery`)
  let msg = ''
  let date = ''
  currentDate = new Date()
  date = currentDate.getUTCFullYear().toString() + '-' + currentDate.getUTCMonth().toString() + '-' + currentDate.getUTCDay().toString()
  const pool = new Pool({
      user: config.get('DB.PGUSER'),
      host: config.get('DB.PGHOST'),
      database: config.get('DB.PGDATABASE'),
      password: config.get('DB.PGPASSWORD'),
      port: config.get('DB.PGPORT')
    })
  pool.connect()
  .then((client) => {
    rows.forEach((item, index) => {
      client.query(`INSERT INTO ${config.get('DB.PGTABLEDECK.NAME')} (${config.get('DB.PGTABLEDECK.COLUMN0')}, ${config.get('DB.PGTABLEDECK.COLUMN1')}, ${config.get('DB.PGTABLEDECK.COLUMN2')}, ${config.get('DB.PGTABLEDECK.COLUMN3')}, ${config.get('DB.PGTABLEDECK.COLUMN4')}) VALUES ('${userID}', '${item.cardID}', '${item.numberOfCard}', '${date}', '${deckID}')`)
      .then((res) => {
        console.log(`CARD ${item.cardID} Successfully registered to Deck ${deckID} from User ${userID}`)
        msg += `CARD ${item.cardID} Successfully registered to Deck ${deckID} from User ${userID}`
        return resolve(msg)
      })
      .catch((errQuery) => {
        console.log(`Error when query: ${errQuery}`)
        return reject(errQuery)
      })
    })
  })
  .catch((errConnect) => {
    console.log(errConnect)
    return reject(errConnect)
  })
})

module.exports = {
  addCardsToDeck(req, res) {
    return new Promise((resolve, reject) => {
      checkIfDeckAlreadyExists (req.body.deckID)
      .then((exists) => {
        if (exists) {
          res.status(400).send(`deckID already exists in DB`)
        } else {
          addAllCardsQuery(req.body.cards, req.body.deckID, req.body.userID)
          .then((msg) => {
            res.status(200).send(msg)
          })
          .catch((errQuery) => {
            console.log(`errQuery: ${errQuery}`)
            res.status(400).send(errQuery)
          })
        }
      })
      .catch((errCheck) => {
        console.log(`errCheck: ${errCheck}`)
        res.status(400).send(errCheck)
      })
    })
  }
}