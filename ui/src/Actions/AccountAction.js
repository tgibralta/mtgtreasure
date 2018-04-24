import dispatcher from '../Dispatchers/Dispatcher'
import rp from 'request-promise'
import cors from 'cors'
import {createOptionAddUser, 
        createOptionCardPerIDQuery, 
        createOptionSignin,
        createOptionGetCollection,
        createOptionAddCardToCollection,
        createOptionDeleteCardFromCollection,
        createOptionGetDecks,
        createOptionCardPerNameQuery,
        createOptionAddDeck,
        createOptionDeleteDeck} from './../Models/OptionsQuery'


export const CreateUser = (username, mail, password) => new Promise((resolve, reject) => {
  let options = createOptionAddUser(username, mail, password)
  rp(options)
  .then((res) => {
    let userID = res.userID
    console.log(userID)
    dispatcher.dispatch({
      type: 'CREATE_USER',
      username,
      userID,
    })
    return resolve()
  })
  .catch((err) => {
    return reject(err)
  })
})

export function DeleteUser(user) {
  dispatcher.dispatch({
    type: 'DELETE_USER',
    user
  })
}

const extractInfoElement = (element) => new Promise((resolve, reject) => {
  console.log(`Entered extractInfoElement`)
  let cardID = element.card_id
  let nbCardInElement = element.number_of_card
  let investmentElement = element.number_of_card * element.init_price
  let currentValueElement =0
  let optionCardQuery = createOptionCardPerIDQuery(element)
  rp(optionCardQuery)
  .then((CardInfo) => {
    currentValueElement += nbCardInElement * JSON.parse(CardInfo).usd
    let allCardInfo = {
      "DB": element,
      "Scryfall" : JSON.parse(CardInfo)
    }
    return resolve({allCardInfo, nbCardInElement, investmentElement, currentValueElement})
  })
  .catch((errCard) => {
    return reject(`Error while fetching card information: ${errCard}`)
  })
})

function reducerNbCard(accumulator, element) {
  console.log(`Element Value: ${element.nbCardInElement}`)
  accumulator += element.nbCardInElement
  return accumulator
}

function reducerInvestment(accumulator, element) {
  accumulator += element.investmentElement
  return accumulator
}

function reducerValue(accumulator, element) {
  accumulator += element.currentValueElement
  return accumulator
}

const concatCardsInfo = (element) => new Promise((resolve, reject) => {
  if (element) {
    return resolve(element)
  } else {
    return reject(`Empty Element`)
  }
})


const loopOverArray = (array) => new Promise((resolve, reject) => {
  console.log(`Entered loopOverArray`)
  let actions = array.map(extractInfoElement)
  let results = Promise.all(actions)
  results.then((fullData => {
    console.log(`FULL DATA: ${JSON.stringify(fullData)}`)
    // let totalNbCard = fullData.reduce(reducerNbCard, 0)
    let totalNbCard = 0
    fullData.forEach((element) => {
      totalNbCard += element.nbCardInElement
    })
    let totalInvestment = fullData.reduce(reducerInvestment, 0)
    let totalValue = fullData.reduce(reducerValue, 0)
    // CHANGING THIS TO {allCardInfo: DB {}, Scryfall: {}}
    let PromiseInfo = fullData.map(concatCardsInfo)
    let totalCardInfoP = Promise.all(PromiseInfo)
    totalCardInfoP
    .then((totalCardInfo) => {
      return resolve({totalNbCard, totalInvestment, totalValue, totalCardInfo})
    })
    .catch((err) => {
      return reject (err)
    })
    
  }))
  results.catch((errLoop) => {
    console.log(`Error during Loop: ${errLoop}`)
    return reject(errLoop)
  })
})

export const SigninUser = (username, password) => new Promise((resolve, reject) => {
  let optionsSignin = createOptionSignin(username, password)
  console.log(`OPTION SIGNIN: ${JSON.stringify(optionsSignin)}`)
  rp(optionsSignin)
  .then((res) => {
    let userID = JSON.parse(res).userID
    // FETCH USER COLLECTION
    let optionsCollection = createOptionGetCollection(userID)
    console.log(`OPTION COLLECTION: ${JSON.stringify(optionsCollection)}`)
    rp(optionsCollection)
    .then((resCollection) => {
      let JSONReply = JSON.parse(resCollection)
      loopOverArray(JSONReply)
      .then((nbCardAndInfo) => {
        let nbCardInCollection = nbCardAndInfo.totalNbCard
        let cardsInfo = nbCardAndInfo.totalCardInfo
        let initialInvestment = nbCardAndInfo.totalInvestment
        let currentValue = nbCardAndInfo.totalValue
        console.log(`OBJECT OBTAINED AFTER LOOP OVER ARRAY: ${JSON.stringify(nbCardAndInfo)}`)
        console.log(`NB CARD: ${nbCardInCollection}`)
        console.log(`INVESTMENT: ${initialInvestment}`)
        console.log(`VALUE: ${currentValue}`)
        console.log(`INFO: ${JSON.stringify(cardsInfo)}`)
        // FETCH USER DECKS
        let optionsGetDecks = createOptionGetDecks(userID)
        console.log(`optionsGetDecks: ${JSON.stringify(optionsGetDecks)}`)
        rp(optionsGetDecks)
        .then((decks) => {
          let listDecks = JSON.parse(decks)
          console.log(`DECKS RECEIVED FROM MIDDLEWARE: ${decks}`)
          console.log(`NB CARD IN COLLECTION: ${nbCardInCollection}`)
          dispatcher.dispatch({
            type: 'SIGNIN_USER',
            username,
            userID,
            nbCardInCollection,
            initialInvestment,
            currentValue,
            cardsInfo,
            listDecks
          })
          return resolve()
        })
        .catch((errDecks) => {
          return reject(errDecks)
        })
      })
      .catch((errLoop) => {
        return reject(errLoop)
      })
    })
    .catch((errCollection) => {
      console.log(errCollection)
      return reject(errCollection)
    })
  })
  .catch((err) => {
    return reject(err)
  })
})

export function SignoutUser(user) {
  dispatcher.dispatch({
    type: 'SIGNOUT_USER',
    user
  })
}

export const AddCardToCollection = (userID, cardID, price_when_bought, number,totalInfo) => new Promise((resolve, reject) => {
  let intNumber = parseInt(number)
  let floatPrice = parseFloat(price_when_bought)
  let optionsAddCardToCollection = createOptionAddCardToCollection(userID,cardID,floatPrice,intNumber)
  console.log(JSON.stringify(optionsAddCardToCollection))
  rp(optionsAddCardToCollection)
  .then((res) => {
    console.log(`VALUE COLLECTION ID AFTER ADDING CARD TO DB: ${res.collectionID}`)
    let currentDate = new Date()
    let date = currentDate.getUTCFullYear().toString() + '-' + currentDate.getUTCMonth().toString() + '-' + currentDate.getUTCDay().toString()
    let cardInfoStore = {
      "allCardInfo" : {
        "DB" : {
          "collection_id": res.collectionID,
          "user_id": userID,
          "card_id": cardID,
          "init_price": floatPrice,
          "number_of_card": intNumber,
          "date_buy": date,
          "last_update": date
        },
        "Scryfall": totalInfo
      }
    }
    dispatcher.dispatch({
      type: 'ADD_CARD_TO_COLLECTION',
      userID,
      cardInfoStore
    })
  })
  .catch((errAddCardToCollection) => {
    console.log(errAddCardToCollection)
  })
})

export function DeleteCardFromCollection (element){
  console.log(JSON.stringify(element))
  let collectionID = element.allCardInfo.DB.collection_id
  let nbCardToRemove = element.allCardInfo.DB.number_of_card // TODO: change this after to be able to partially remove
  let nbCardAvailable = element.allCardInfo.DB.number_of_card
  let optionsRemoveCardToCollection = createOptionDeleteCardFromCollection(collectionID, nbCardToRemove, nbCardAvailable)
  rp(optionsRemoveCardToCollection)
  .then((res) => {
    dispatcher.dispatch({
      type: 'REMOVE_CARD_FROM_COLLECTION',
      collectionID,
      nbCardToRemove
    })
  })
  .catch((err) => {
  })
}


const buildInfoCardDeckMain = (card) => new Promise((resolve, reject) => {
  // Ask the information about the card to the middleware
  let options = createOptionCardPerNameQuery(card.cardName)
  console.log(`Card Query: ${card.cardName} #################################################################################`)
  rp(options)
  .then((res) => {
    console.log(JSON.stringify(res))
    // create the corresponding element for the main array
    let JSONRes = JSON.parse(res)
    let mainElement = {
      'cardID': JSONRes.data[0].multiverse_ids[0],
      'name' : JSONRes.data[0].name,
      'cmc' : JSONRes.data[0].cmc,
      'manaCost' : JSONRes.data[0].mana_cost,
      'type' : JSONRes.data[0].type_line,
      'number' : parseInt(card.number),
      'uri' : JSONRes.data[0].image_uris.large,
      'price' : JSONRes.data[0].usd,
      'board': 'main',
      'thumbnail': JSONRes.data[0].image_uris.art_crop
    }
    return resolve(mainElement)
  })
  .catch((err) => {
    return reject(err)
  })
})

const buildInfoCardDeckSide = (card) => new Promise((resolve, reject) => {
  // Ask the information about the card to the middleware
  let options = createOptionCardPerNameQuery(card.cardName)
  rp(options)
  .then((res) => {
    console.log(JSON.stringify(res))
    let JSONRes = JSON.parse(res)
    // create the corresponding element for the main array
    let mainElement = {
      'cardID': JSONRes.data[0].multiverse_ids[0],
      'name' : JSONRes.data[0].name,
      'cmc' : JSONRes.data[0].cmc,
      'manaCost' : JSONRes.data[0].mana_cost,
      'type' : JSONRes.data[0].type_line,
      'number' : parseInt(card.number),
      'uri' : JSONRes.data[0].image_uris.large,
      'price' : JSONRes.data[0].usd,
      'board': 'side',
      'thumbnail': JSONRes.data[0].image_uris.art_crop
    }
    return resolve(mainElement)
  })
  .catch((err) => {
    return reject(err)
  })
})

function reducerNbCard(accumulator, element) {
  accumulator += element.number
  return accumulator
}

function reducerPrice(accumulator, element){
  accumulator += element.price * element.number
  return accumulator
 }
// const queryAddToDeck = (elementBoard) => new Promise((resolve, reject) => {
// })

export const AddDeck = (userID, deckName, legality, mainboardCards, sideboardCards) => new Promise((resolve, reject) => {
  console.log(`Deck Name: ${deckName}`)
  console.log(`Legality: ${legality}`)
  console.log(`Mainboard Cards: ${JSON.stringify(mainboardCards)}`)
  console.log(`Sideboard Cards: ${JSON.stringify(sideboardCards)}`)
  let main_element = mainboardCards.map(buildInfoCardDeckMain)
  let resultMain = Promise.all(main_element)
  resultMain.then((dataMain) => {
    let side_element = sideboardCards.map(buildInfoCardDeckSide)
    let resultSide = Promise.all(side_element)
    resultSide.then((dataSide) => {
      let nbCardMain = dataMain.reduce(reducerNbCard, 0)
      let nbCardSide = dataSide.reduce(reducerNbCard, 0)
      let priceMain = dataMain.reduce(reducerPrice, 0)
      let priceSide = dataSide.reduce(reducerPrice, 0)
      let priceDeck = priceMain + priceSide
      let newDeck = {
        'deckID': deckName,
        'legality': legality,
        'nb_main' : nbCardMain,
        'nb_sideboard' : nbCardSide,
        'main' : dataMain,
        'sideboard' : dataSide,
        'thumbnail' : dataMain[0].thumbnail,
        'price' : priceDeck
      }
      let DeckStore = {
        'deckname': deckName,
        'nb_card_in_main': nbCardMain,
        'nb_card_in_sideboard': nbCardSide,
        'thumbnail': dataMain[0].thumbnail,
        'main': dataMain,
        'sideboard': dataSide,
        'legality' : legality,
        'price' : priceDeck
      }
      console.log(`Deck: ${JSON.stringify(newDeck)}`)
      let optionsQuery = createOptionAddDeck(userID, newDeck)
      console.log(`Option Query: ${JSON.stringify(optionsQuery)}`)
      rp(optionsQuery)
      .then((res) => {
        console.log(res)
        dispatcher.dispatch({
          type: 'ADD_DECK',
          DeckStore,
          userID

        })
        return resolve(DeckStore)
      })
      .catch((err) => {
        console.log(err)
        return reject(err)
      })
      
    })
    .catch((errSide) => {
      console.log(`Error in Query Sideboard: ${errSide}`)
      return reject(errSide)
    })
  })
  .catch((errMain) => {
    console.log(`Error in Query Mainboard: ${errMain}`)
    return reject(errMain)
  })

})

export const DeleteDeck = (userID, deckID) => new Promise((resolve, reject) => {
  let options = createOptionDeleteDeck(userID, deckID)
  rp(options)
  .then(() => {
    dispatcher.dispatch({
      type: 'DELETE_DECK',
      userID,
      deckID
    })
    return resolve()
  })
  .catch((err) => {
    return reject()
  })
})
