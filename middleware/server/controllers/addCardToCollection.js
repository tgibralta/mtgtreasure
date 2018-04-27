const config = require('config')
const { Client } = require('pg')

// CHECK IF CARD IS ALREADY IN TABLE AT THE SAME PRICE OR IF CARD ALREADY IN DB WITH NUMBER = 0
const checkIfCardInCollection = (user_id, card_id, price_buy) => new Promise((resolve, reject) => {
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
      client.query(`SELECT * FROM ${config.get('DB.PGTABLECOLLECTION.NAME')} WHERE ${config.get('DB.PGTABLECOLLECTION.COLUMN1')} = '${user_id}' AND ${config.get('DB.PGTABLECOLLECTION.COLUMN2')} = '${card_id}'`)
      .then((res) => {
        let collectionID = 0
        let currentNumber = 0
        let exist = false
        res.rows.forEach((item, index) => {
          console.log(`collectionID: ${item.collection_id}`)
          if (item.init_price === price_buy || (item.number_of_card === 0)) {
            console.log(item.collection_id)
            collectionID = item.collection_id
            currentNumber = item.number_of_card
            exist = true
          }
        })
        client.end()
        return resolve({exist, collectionID, currentNumber})
      })
      .catch((err) => {
        client.end()
        return reject(err)
      })
    }
  })
})

// UPDATE THE NUMBER OF CARDS FOR A COLLECTION ID WITH THE PRICE_BUY
const updateNumberInCollection = (collection_id, new_price_buy, new_number) => new Promise((resolve, reject) => {
  const client = new Client({
    user: config.get('DB.PGUSER'),
    host: config.get('DB.PGHOST'),
    database: config.get('DB.PGDATABASE'),
    password: config.get('DB.PGPASSWORD'),
    port: config.get('DB.PGPORT')
  })
  console.log('Entering updateNumberInCollection')
  client.connect((errConnect) => {
    if (errConnect) {
      return reject(errConnect)
    } else {
      console.log(`QUERY1: UPDATE ${config.get('DB.PGTABLECOLLECTION.NAME')} SET ${config.get('DB.PGTABLECOLLECTION.COLUMN3')} = '${new_price_buy}' WHERE ${config.get('DB.PGTABLECOLLECTION.COLUMN0')} = '${collection_id}'`)
      client.query(`UPDATE ${config.get('DB.PGTABLECOLLECTION.NAME')} SET ${config.get('DB.PGTABLECOLLECTION.COLUMN3')} = '${new_price_buy}' WHERE ${config.get('DB.PGTABLECOLLECTION.COLUMN0')} = '${collection_id}'`)
      .then(() => {
        console.log(`QUERY2: UPDATE ${config.get('DB.PGTABLECOLLECTION.NAME')} SET ${config.get('DB.PGTABLECOLLECTION.COLUMN5')} = '${new_number}' WHERE ${config.get('DB.PGTABLECOLLECTION.COLUMN0')} = '${collection_id}'`)
        client.query(`UPDATE ${config.get('DB.PGTABLECOLLECTION.NAME')} SET ${config.get('DB.PGTABLECOLLECTION.COLUMN4')} = '${new_number}' WHERE ${config.get('DB.PGTABLECOLLECTION.COLUMN0')} = '${collection_id}'`)
        .then(() => {
          client.end()
          return resolve(`Update completed`)
        })
        .catch((errQuery2) => {
          client.end()
          return reject(errQuery2)
        })
      })
      .catch((errQuery1) => {
        client.end()
          return reject(errQuery1)
      })
    }
  })
})

// RETURN COLLECTION ID AS AN ANSWER
const returnCollectionID = (user_id, card_id, price_buy ) => new Promise((resolve, reject) => {
  const client = new Client({
    user: config.get('DB.PGUSER'),
    host: config.get('DB.PGHOST'),
    database: config.get('DB.PGDATABASE'),
    password: config.get('DB.PGPASSWORD'),
    port: config.get('DB.PGPORT')
  })
  client.connect((errConnect) => {
    if(errConnect) {
      return reject(`Err: Card added to collection but failed returning collection_id: ${errConnect}`)
    } else {
      console.log(`QUERY DB: SELECT * FROM ${config.get('DB.PGTABLECOLLECTION.NAME')} WHERE ${config.get('DB.PGTABLECOLLECTION.COLUMN1')} = '${user_id}' AND ${config.get('DB.PGTABLECOLLECTION.COLUMN2')} = '${card_id}' AND ${config.get('DB.PGTABLECOLLECTION.COLUMN3')} = '${price_buy}'`)
      client.query(`SELECT * FROM ${config.get('DB.PGTABLECOLLECTION.NAME')} WHERE ${config.get('DB.PGTABLECOLLECTION.COLUMN1')} = '${user_id}' AND ${config.get('DB.PGTABLECOLLECTION.COLUMN2')} = '${card_id}' AND ${config.get('DB.PGTABLECOLLECTION.COLUMN3')} = '${price_buy}'`)
      .then((res) => {
        client.end()
        console.log(`Collection ID to be returned: ${res.rows[0].collection_id}`)
        let objectCollectionID = {
          "collectionID" : res.rows[0].collection_id
        }
        return resolve(objectCollectionID)
      })
      .catch((errQuery) => {
        client.end()
        return reject(`Err: Card added to collection but failed returning collection_id: ${errQuery}`)
      })
    }
  })
})

// CREATE A NEW ENTRY IN TABLE
const createEntryInCollection = (user_id, card_id, price_buy, number) => new Promise ((resolve, reject) => {
  const client = new Client({
    user: config.get('DB.PGUSER'),
    host: config.get('DB.PGHOST'),
    database: config.get('DB.PGDATABASE'),
    password: config.get('DB.PGPASSWORD'),
    port: config.get('DB.PGPORT')
  })
  console.log('Entering updateNumberInCollection')
  client.connect((errConnect) => {
    if (errConnect) {
      return reject(errConnect)
    } else {
      let date = ''
      currentDate = currentDate()
      client.query(`INSERT INTO ${config.get('DB.PGTABLECOLLECTION.NAME')} (${config.get('DB.PGTABLECOLLECTION.COLUMN1')}, ${config.get('DB.PGTABLECOLLECTION.COLUMN2')}, ${config.get('DB.PGTABLECOLLECTION.COLUMN3')}, ${config.get('DB.PGTABLECOLLECTION.COLUMN4')}, ${config.get('DB.PGTABLECOLLECTION.COLUMN5')}, ${config.get('DB.PGTABLECOLLECTION.COLUMN6')}) VALUES ('${user_id}', '${card_id}', ${price_buy}, ${number}, '${date}', '${date}')`)
      .then(() => {
        client.end()
        return resolve(`Card added to Collection`)
      })
      .catch((errQuery) => {
        client.end()
        return reject(errQuery)
      })
    }
  })
})

module.exports = {
 /**
 * @description Adds a card to collection. check if the same cards has been alread added or if a similar entry with 0 cards exists in the DB
 * @param {integer} user_id
 * @param {String} card_id
 * @param {integer} price_when_bought
 * @param {integer} number
 * @return {String} Confirmation message
 */
  addCardToCollection(req, res) {
    return new Promise((resolve, reject) => {
      let userID = req.body.user_id
      let cardID = req.body.card_id
      let initPrice = req.body.price_when_bought
      let number = req.body.number
      console.log(`variable defined: userID: ${userID}, cardID: ${cardID}, initPrice: ${initPrice}, number: ${number}`)
      checkIfCardInCollection(userID, cardID, initPrice)
      .then((object) => {
        if (object.exist) {
          console.log(`AddCardInCollection: card already in collection`)
          let newNumber = number + object.currentNumber
          updateNumberInCollection(object.collectionID, initPrice, newNumber)
          .then((msg) => {
            console.log(`AddCardInCollection: updated number in DB`)
            res.status(200).send(object.collectionID)
          })
          .catch((err) => {
            console.log(`updateNumberInCollection: ${err}`)
            res.status(400).send(err)
          })
        } else {
          console.log(`AddCardInCollection: card not in collection`)
          createEntryInCollection(userID, cardID, initPrice, number)
          .then((msg) => {
            console.log(`AddCardInCollection: created entry in DB`)
            returnCollectionID(userID,cardID,initPrice)
            .then((collectionIDDB) => {
              console.log(`AddCardInCollection: Collection ID returned : ${collectionIDDB}`)
              res.status(200).send(collectionIDDB)
            })
            .catch((errcollectionID) => {
              console.log(`AddCardInCollection: Error during returnCollectionID : ${errcollectionID}`)
              res.status(400).send(errcollectionID)
            })
          })
          .catch((err) => {
            console.log(`createEntryInCollection: ${err}`)
            res.status(400).send(err)
          })
        }
      })
      .catch((err) => {
        console.log(`checkIfCardInCollection: ${err}`)
        res.status(400).send(err)
      })
    })
  }
}