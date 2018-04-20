const config = require('config')
const { Client } = require('pg')


const requestListDecks = (userID) => new Promise((resolve, reject) => {
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
      client.query(`SELECT * FROM ${config.get('DB.PGTABLELISTDECKS.NAME')} WHERE ${config.get('DB.PGTABLELISTDECKS.COLUMN0')} = '${userID}'`)
      .then((res) => {
        // console.log(`Decks retrieved for user ${userID}`)
        client.end()
        return resolve(res.rows)
      })
      .catch((errQuery) => {
        client.end()
        return reject(errQuery)
      })
    }
  })
})

const requestCardsInDeck = (userID, deckID) => new Promise((resolve, reject) => {
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
      client.query(`SELECT * FROM ${config.get('DB.PGTABLEDECK.NAME')} WHERE ${config.get('DB.PGTABLEDECK.COLUMN0')} = '${userID}' AND ${config.get('DB.PGTABLEDECK.COLUMN4')} = '${deckID}'`)
      .then((res) => {
        // console.log(`Cards retrieved for user ${userID}, deck ${deckID}`)
        return resolve(res.rows)
      })
      .catch((errQuery) => {
        return reject(errQuery)
      })
    }
  })
})

const buildInfoCardDeckMain = (card) => new Promise((resolve, reject) => {
  if (card) {
    // console.log(`Card: ${JSON.stringify(card)}`)
    if (card.main_or_side === 'main') {
      // console.log('buildInfoCardDeckMain: Main Card')
      let cardMain = {
        'cardID': card.card_id,
        'name': card.name,
        'number': card.number_of_card,
        'uri': card.uri_image,
        'board': card.main_or_side
      }
      return resolve (cardMain)
    } else {
      
      return resolve(0)
    }
  } else {
    return reject(`No card`)
  }
})

const buildInfoCardDeckSide = (card) => new Promise((resolve, reject) => {
  if (card) {
    // console.log(`Card: ${JSON.stringify(card)}`)
    if (card.main_or_side === 'side') {
      // console.log('buildInfoCardDeckMain: Side Card')
      let cardSide = {
        'cardID': card.card_id,
        'name': card.name,
        'number': card.number_of_card,
        'uri': card.uri_image,
        'board': card.main_or_side
      }
      return resolve (cardSide)
    } else {
      return resolve(0)
    }
  } else {
    return reject(`No card`)
  }
})

function reducerNotNull (accumulator, element) {
  console.log(`Element: ${element}`)
  if (element !== 0) {
    accumulator.push(element)
  }
  return accumulator
}

const buildDecksObject = (objectList, CardsInDeck) => new Promise((resolve, reject) => {
  if (objectList) {
    let objectMain = []
    let objectSide = []
    // console.log(`Cards in deck: ${JSON.stringify(CardsInDeck)}`)
    objectMain = CardsInDeck.map(buildInfoCardDeckMain)
    let resultMain = Promise.all(objectMain)
    resultMain.then((dataMain) => {
      console.log(`DataMain Obtained: ${JSON.stringify(dataMain)}`)
      objectSide = CardsInDeck.map(buildInfoCardDeckSide)
      let resultSide = Promise.all(objectSide)
      resultSide.then((dataSide) => {
        console.log(`DataSide Obtained: ${JSON.stringify(dataSide)}`)
        let arrayMain = dataMain.reduce(reducerNotNull,[])
        let arraySide = dataSide.reduce(reducerNotNull,[])
        return resolve(
          {
            'deckname': objectList.deckname,
            'nb_card_in_main': objectList.nb_card_in_main,
            'nb_card_in_sideboard': objectList.nb_card_in_sideboard,
            'thumbnail': objectList.thumbnail,
            'legality': objectList.legality,
            'main': arrayMain,
            'sideboard': arraySide
          }
        )
      })
      .catch((errSide) => {
        return reject(errSide)
      })
    })
    .catch((errMain) => {
      return reject(errMain)
    })
  } else {
    return reject('Invalid deck')
  }
})

const buildDeckFromList = (DeckInfo, userID) => new Promise((resolve, reject) => {
  let deckID = DeckInfo.deckname
  requestCardsInDeck(userID, deckID)
  .then((rows)=> {
    // console.log(`Deck List: ${JSON.stringify(rows)}`)
    buildDecksObject(DeckInfo, rows)
    .then((objectDeck) => {
      return resolve(objectDeck)
    })
    .catch((errBuild) => {
      return reject(errBuild)
    })
  })
  .catch((errRequestCards) => {
    return errRequestCards
  })
})



module.exports = {
  /**
  * @description Return all decks in the database for a given userID
  * @param {integer} userID
  * @return {JSON} Return object with all the info about the deck and each card it contains
  */
  getDecks(req, res) {
    let userID = req.params.userid
    requestListDecks(userID)
    .then((listDecks) => {
      console.log(`List Decks: ${JSON.stringify(listDecks)}`)
      let decks = listDecks.map(function(deck){return(buildDeckFromList(deck, userID))})
      let resultDeck = Promise.all(decks)
      resultDeck.then((dataDecks) => {
        console.log(`Answering to UI : ${JSON.stringify(dataDecks)}`)
        res.status(200).send(dataDecks)
      })
      .catch((errResultDeck) => {
        console.log(errResultDeck)
        res.status(400).send(errResultDeck)
      })
    })
    .catch((errRequestList) => {
      console.log(errRequestList)
      res.status(400).send(errRequestList)
    })
  }
}