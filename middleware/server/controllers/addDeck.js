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

// DELETE DECK QUERY
const deleteDeckQuery = (deckID) => new Promise((resolve, reject) => {
  const client = new Client({
    user: config.get('DB.PGUSER'),
    host: config.get('DB.PGHOST'),
    database: config.get('DB.PGDATABASE'),
    password: config.get('DB.PGPASSWORD'),
    port: config.get('DB.PGPORT')
  })
  client.connect((errConnect) => {
    if (errConnect) {
      client.end()
      return reject(errConnect)
    } else {
      console.log(`DELETE FROM ${config.get('DB.PGTABLEDECK.NAME')} WHERE ${config.get('DB.PGTABLEDECK.COLUMN4')} = '${deckID}'`)
      client.query(`DELETE FROM ${config.get('DB.PGTABLEDECK.NAME')} WHERE ${config.get('DB.PGTABLEDECK.COLUMN4')} = '${deckID}'`)
      .then((res) => {
        client.end()
        return resolve()
      })
      .catch((err) => {
        client.end()
        return reject(`Error while deleting deck: ${err}`)
      })
    }
  })
})

const queryInsertDB = (item, client, userID, deckID, date) => new Promise((resolve, reject) => {
  let nameInDB = item.name.replace(`'`,``)
  client.query(`INSERT INTO ${config.get('DB.PGTABLEDECK.NAME')} (${config.get('DB.PGTABLEDECK.COLUMN0')}, ${config.get('DB.PGTABLEDECK.COLUMN1')}, ${config.get('DB.PGTABLEDECK.COLUMN2')}, ${config.get('DB.PGTABLEDECK.COLUMN3')}, ${config.get('DB.PGTABLEDECK.COLUMN4')} , ${config.get('DB.PGTABLEDECK.COLUMN5')} , ${config.get('DB.PGTABLEDECK.COLUMN6')} , ${config.get('DB.PGTABLEDECK.COLUMN7')}) VALUES ('${userID}', '${item.cardID}', '${item.number}', '${date}', '${deckID}', '${item.uri}', '${item.board}' , '${nameInDB}')`)
  .then((res) => {
    console.log(`CARD ${item.cardID} Successfully registered to Deck ${deckID} from User ${userID}`)
    let msg = `CARD ${item.cardID} Successfully registered to Deck ${deckID} from User ${userID}`
    return resolve(msg)
  })
  .catch((errQuery) => {
    console.log(`Error when query: ${item.name}: ${errQuery}`)
    return reject(errQuery)
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
    let allDone = rows.map(function(x){return(queryInsertDB(x, client, userID, deckID, date))})
    let allPromiseDone = Promise.all(allDone)
    allPromiseDone.then(() => {
      pool.end()
      return resolve()
    })
    .catch((errPromise) => {
      pool.end()
      return reject(errPromise)
    })
  })
  .catch((errConnect) => {
    console.log(errConnect)
    return reject(errConnect)
  })
})

const addDeckToList = (userID, deckID, nbMain, nbSide, thumbnail, legality) => new Promise((resolve, reject) => {
  const client = new Client({
    user: config.get('DB.PGUSER'),
    host: config.get('DB.PGHOST'),
    database: config.get('DB.PGDATABASE'),
    password: config.get('DB.PGPASSWORD'),
    port: config.get('DB.PGPORT')
  })
  client.connect((errConect) => {
    if(errConect) {
      return reject(`Error during connection when addDeckToList`)
    } else {
      client.query(`INSERT INTO ${config.get('DB.PGTABLELISTDECKS.NAME')} (${config.get('DB.PGTABLELISTDECKS.COLUMN0')}, ${config.get('DB.PGTABLELISTDECKS.COLUMN1')}, ${config.get('DB.PGTABLELISTDECKS.COLUMN2')}, ${config.get('DB.PGTABLELISTDECKS.COLUMN3')}, ${config.get('DB.PGTABLELISTDECKS.COLUMN4')}, ${config.get('DB.PGTABLELISTDECKS.COLUMN5')}) VALUES ('${userID}', '${deckID}', '${nbMain}', '${nbSide}', '${thumbnail}', '${legality}')`)
      .then(() => {
        client.end()
        return resolve()
      })
      .catch((errAdd) => {
        client.end()
        return reject(`Error while adding deck to decklist`)
      })
    }
  })
})

const deleteDeckFromList = (userID, deckID) => new Promise((resolve, reject) => {
  const client = new Client({
    user: config.get('DB.PGUSER'),
    host: config.get('DB.PGHOST'),
    database: config.get('DB.PGDATABASE'),
    password: config.get('DB.PGPASSWORD'),
    port: config.get('DB.PGPORT')
  })
  client.connect((errConect) => {
    if(errConect) {
      return reject(`Error during connection when deleteDeckFromList`)
    } else {
      console.log(`DELETE FROM ${config.get('DB.PGTABLELISTDECKS.NAME')} WHERE ${config.get('DB.PGTABLELISTDECKS.COLUMN0')} = '${userID}' AND ${config.get('DB.PGTABLELISTDECKS.COLUMN1')} = '${deckID}'`)
      client.query(`DELETE FROM ${config.get('DB.PGTABLELISTDECKS.NAME')} WHERE ${config.get('DB.PGTABLELISTDECKS.COLUMN0')} = '${userID}' AND ${config.get('DB.PGTABLELISTDECKS.COLUMN1')} = '${deckID}'`)
      .then(() => {
        client.end()
        return resolve()
      })
      .catch((errAdd) => {
        client.end()
        return reject(`Error while adding deck to decklist`)
      })
    }
  })
})

module.exports = {
  addDeck(req, res) {
    return new Promise((resolve, reject) => {
      console.log(`Body received in middleware: ${JSON.stringify(req.body)}`)
      let deckID = req.body.deck.deckID
      let mainCards = req.body.deck.main
      let sideCards = req.body.deck.sideboard
      let userID = req.body.userID
      let legality = req.body.deck.legality
      let thumbnail = req.body.deck.thumbnail
      let nbSide = req.body.deck.nb_sideboard
      let  nbMain = req.body.deck.nb_main

      console.log(`deck ID: ${deckID}`)
      console.log(`User ID: ${userID}`)
      console.log(`Cards in Main: ${JSON.stringify(mainCards)}`)
      console.log(`Cards in Side: ${JSON.stringify(sideCards)}`)
      console.log(`Thumbnail" ${thumbnail}`)
      checkIfDeckAlreadyExists (deckID)
      .then((exists) => {
        if (exists) {
          deleteDeckQuery(deckID)
          .then(() => {
            addAllCardsQuery(mainCards, deckID, userID)
            .then((msg) => {
              addAllCardsQuery(sideCards, deckID, userID)
              .then((msg) => {
                // res.status(200).send(msg)
                deleteDeckFromList(userID, deckID)
                .then(() => {
                  addDeckToList(userID, deckID, nbMain, nbSide, thumbnail, legality)
                  .then(()=> {
                    res.status(200).send(`Deck Added to DB`)
                  })
                  .catch((errAddToList) => {
                    res.status(400).send(errAddToList)
                  })
                })
                .catch((errDeleteDeck) => {
                  res.status(400).send(errDeleteDeck)
                })
              })
              .catch((errQuerySide) => {
                res.status(400).send(errQuerySide)
              })
            })
            .catch((errQuery) => {
              console.log(`errQuery: ${errQuery}`)
              res.status(400).send(errQuery)
            })
          })
        } else {
          addAllCardsQuery(mainCards, deckID, userID)
          .then((msg) => {
            addAllCardsQuery(sideCards, deckID, userID)
            .then((msg) => {
              addDeckToList(userID, deckID, nbMain, nbSide, thumbnail, legality)
              .then(()=> {
                res.status(200).send(`Deck Added to DB`)
              })
              .catch((errAddToList) => {
                res.status(400).send(errAddToList)
              })
            })
            .catch((errQuerySide) => {
              res.status(400).send(errQuerySide)
            })
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