import dispatcher from '../Dispatchers/Dispatcher'
import rp from 'request-promise'
import {createOptionAddUser, 
        createOptionCardPerIDQuery, 
        createOptionSignin,
        createOptionGetCollection,
        createOptionAddCardToCollection,
        createOptionDeleteCardFromCollection,
        createOptionGetDecks,
        createOptionCardPerNameQuery,
        createOptionAddDeck,
        createOptionDeleteDeck,
        createOptionGetUserHistory,
        createOptionAddToUserHistory,
        createOptionRemoveToUserHistory,
        createOptionTop10,
        createOptionGetPriceHistory} from './../Models/OptionsQuery'


export const CreateUser = (username, mail, password) => new Promise((resolve, reject) => {
  let options = createOptionAddUser(username, mail, password)
  rp(options)
  .then((res) => {
    let userID = res.userID
    // console.log(userID)
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
  // console.log(`Entered extractInfoElement`)
  let nbCardInElement = element.number_of_card
  let investmentElement = element.number_of_card * element.init_price
  let currentValueElement =0
  let priceHistory = element.priceHistory

  let lengthHistory = priceHistory.length - 1
  
  let trend = Math.ceil(100 * ((priceHistory[lengthHistory].price - priceHistory[lengthHistory - 1].price) / priceHistory[lengthHistory - 1].price))
  let optionCardQuery = createOptionCardPerIDQuery(element)
  rp(optionCardQuery)
  .then((CardInfo) => {
    currentValueElement += nbCardInElement * JSON.parse(CardInfo).usd
    let allCardInfo = {
      "DB": element,
      "Scryfall" : JSON.parse(CardInfo),
    }
    // console.log(`Card: ${JSON.parse(CardInfo).name}`)
    // console.log(`Yesterday's Price: ${priceHistory[lengthHistory - 1].price}, Date: ${priceHistory[lengthHistory - 1].date}`)
    // console.log(`Today's Price: ${priceHistory[lengthHistory].price}, Date: ${priceHistory[lengthHistory].date}`)
    return resolve({allCardInfo, nbCardInElement, investmentElement, currentValueElement, trend})
  })
  .catch((errCard) => {
    return reject(`Error while fetching card information: ${errCard}`)
  })
})

function reducerNbCard(accumulator, element) {
  // console.log(`Element Value: ${element.nbCardInElement}`)
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
  // console.log(`Entered loopOverArray`)
  let actions = array.map(extractInfoElement)
  let results = Promise.all(actions)
  results.then((fullData => {
    // console.log(`FULL DATA: ${JSON.stringify(fullData)}`)
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
    // console.log(`Error during Loop: ${errLoop}`)
    return reject(errLoop)
  })
})

export const SigninUser = (username, password) => new Promise((resolve, reject) => {
  let optionsSignin = createOptionSignin(username, password)
  // console.log(`OPTION SIGNIN: ${JSON.stringify(optionsSignin)}`)
  rp(optionsSignin)
  .then((res) => {
    let userID = JSON.parse(res).userID
    // FETCH USER COLLECTION
    let optionsCollection = createOptionGetCollection(userID)
    // console.log(`OPTION COLLECTION: ${JSON.stringify(optionsCollection)}`)
    rp(optionsCollection)
    .then((resCollection) => {
      let JSONReply = JSON.parse(resCollection)
      console.log(`Response server: ${resCollection}`)
      loopOverArray(JSONReply)
      .then((nbCardAndInfo) => {
        let nbCardInCollection = nbCardAndInfo.totalNbCard
        let cardsInfo = nbCardAndInfo.totalCardInfo
        let initialInvestment = nbCardAndInfo.totalInvestment
        let currentValue = nbCardAndInfo.totalValue
        // console.log(`OBJECT OBTAINED AFTER LOOP OVER ARRAY: ${JSON.stringify(nbCardAndInfo)}`)
        // console.log(`NB CARD: ${nbCardInCollection}`)
        // console.log(`INVESTMENT: ${initialInvestment}`)
        // console.log(`VALUE: ${currentValue}`)
        // console.log(`INFO: ${JSON.stringify(cardsInfo)}`)
        // FETCH USER DECKS
        let optionsGetDecks = createOptionGetDecks(userID)
        // console.log(`optionsGetDecks: ${JSON.stringify(optionsGetDecks)}`)
        rp(optionsGetDecks)
        .then((decks) => {
          let listDecks = JSON.parse(decks)
          // console.log(`DECKS RECEIVED FROM MIDDLEWARE: ${decks}`)
          // console.log(`NB CARD IN COLLECTION: ${nbCardInCollection}`)
          
          // GET USER HISTORY
          let optionsUserHistory = createOptionGetUserHistory(userID)
          rp(optionsUserHistory)
          .then ((historyDB) => {
            let history = JSON.parse(historyDB)
            // console.log(`History received: ${JSON.stringify(history)}`)
            getTop10()
            .then((trends) => {
              // console.log(`TRENDS FROM TOP 10: ${JSON.stringify(trends)}`)
              dispatcher.dispatch({
                type: 'TOP_10',
                trends
              })
              dispatcher.dispatch({
                type: 'SIGNIN_USER',
                username,
                userID,
                nbCardInCollection,
                initialInvestment,
                currentValue,
                cardsInfo,
                listDecks,
                history
              })
              return resolve()
            })
            .catch((errtop10) => {
              return reject(errtop10)
            })
          })
          .catch((errHistory) => {
            return reject(errHistory)
          })
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
  let intNumber = parseInt(number, 10)
  let floatPrice = parseFloat(price_when_bought)
  let optionsAddCardToCollection = createOptionAddCardToCollection(userID,cardID,floatPrice,intNumber)
  // console.log(JSON.stringify(optionsAddCardToCollection))
  rp(optionsAddCardToCollection)
  .then((res) => {
    // console.log(`VALUE COLLECTION ID AFTER ADDING CARD TO DB: ${res.collectionID}`)
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
    // console.log(`totalInfo: ${JSON.stringify(totalInfo)}`)
    let optionsAddUserHistory = createOptionAddToUserHistory(userID, intNumber, totalInfo.usd,floatPrice)
    rp(optionsAddUserHistory)
    .then((UserInfo) => {
      dispatcher.dispatch({
        type: 'ADD_CARD_TO_COLLECTION',
        userID,
        cardInfoStore,
        UserInfo
      })
      return resolve()
    })
    .catch((errAddUserHistory) => {
      console.log(errAddUserHistory)
      return reject(errAddUserHistory)
    })
  })
  .catch((errAddCardToCollection) => {
    console.log(errAddCardToCollection)
    return reject(errAddCardToCollection)
  })
})

export function DeleteCardFromCollection (element){
  // console.log(JSON.stringify(element))
  let collectionID = element.allCardInfo.DB.collection_id
  let userID = element.allCardInfo.DB.user_id
  let nbCardToRemove = element.allCardInfo.DB.number_of_card // TODO: change this after to be able to partially remove
  let nbCardAvailable = element.allCardInfo.DB.number_of_card
  let value = element.allCardInfo.Scryfall.usd
  let investment = element.allCardInfo.DB.init_price
  let optionsRemoveCardToCollection = createOptionDeleteCardFromCollection(collectionID, nbCardToRemove, nbCardAvailable)
  rp(optionsRemoveCardToCollection)
  .then((res) => {
    let optionRemoveFromUserHistory = createOptionRemoveToUserHistory(userID, nbCardToRemove, value,investment)
    rp(optionRemoveFromUserHistory)
    .then((UserInfo) => {
      dispatcher.dispatch({
        type: 'REMOVE_CARD_FROM_COLLECTION',
        collectionID,
        nbCardToRemove,
        UserInfo
      })
    })
    .catch((errRemove) => {
      console.log(errRemove)
    })
  })
  .catch((err) => {
    console.log(err)
  })
}

const buildInfoCardDeckMain = (card) => new Promise((resolve, reject) => {
  // Ask the information about the card to the middleware
  let options = createOptionCardPerNameQuery(card.cardName)
  // console.log(`Card Query: ${card.cardName} #################################################################################`)
  rp(options)
  .then((res) => {
    // console.log(JSON.stringify(res))
    // create the corresponding element for the main array
    let JSONRes = JSON.parse(res)
    let mainElement = {
      'cardID': JSONRes.data[0].multiverse_ids[0],
      'name' : JSONRes.data[0].name,
      'cmc' : JSONRes.data[0].cmc,
      'manaCost' : JSONRes.data[0].mana_cost,
      'type' : JSONRes.data[0].type_line,
      'number' : parseInt(card.number, 10),
      'uri' : JSONRes.data[0].image_uris.large,
      'price' : JSONRes.data[0].usd,
      'board': 'main',
      'thumbnail': JSONRes.data[0].image_uris.art_crop
    }
    return resolve(mainElement)
  })
  .catch((err) => {
    return reject({
      error: err,
      card: card.cardName
    })
  })
})

const buildInfoCardDeckSide = (card) => new Promise((resolve, reject) => {
  // Ask the information about the card to the middleware
  let options = createOptionCardPerNameQuery(card.cardName)
  rp(options)
  .then((res) => {
    // console.log(JSON.stringify(res))
    let JSONRes = JSON.parse(res)
    // create the corresponding element for the main array
    let mainElement = {
      'cardID': JSONRes.data[0].multiverse_ids[0],
      'name' : JSONRes.data[0].name,
      'cmc' : JSONRes.data[0].cmc,
      'manaCost' : JSONRes.data[0].mana_cost,
      'type' : JSONRes.data[0].type_line,
      'number' : parseInt(card.number, 10),
      'uri' : JSONRes.data[0].image_uris.large,
      'price' : JSONRes.data[0].usd,
      'board': 'side',
      'thumbnail': JSONRes.data[0].image_uris.art_crop
    }
    return resolve(mainElement)
  })
  .catch((err) => {
    return reject({
      error: err,
      card: card.cardName
    })
  })
})

function reducerPrice(accumulator, element){
  accumulator += element.price * element.number
  return accumulator
 }
// const queryAddToDeck = (elementBoard) => new Promise((resolve, reject) => {
// })

export const AddDeck = (userID, deckName, legality, mainboardCards, sideboardCards, nbCardMain, nbCardSide) => new Promise((resolve, reject) => {
  // console.log(`Deck Name: ${deckName}`)
  // console.log(`Legality: ${legality}`)
  // console.log(`Mainboard Cards: ${JSON.stringify(mainboardCards)}`)
  // console.log(`Sideboard Cards: ${JSON.stringify(sideboardCards)}`)
  console.log(`Add Deck Called`)
  let main_element = mainboardCards.map(buildInfoCardDeckMain)
  let resultMain = Promise.all(main_element)
  resultMain.then((dataMain) => {
    let side_element = sideboardCards.map(buildInfoCardDeckSide)
    let resultSide = Promise.all(side_element)
    resultSide.then((dataSide) => {
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
      // console.log(`New Deck: ${JSON.stringify(newDeck)}`)
      // console.log(`New DeckStore: ${JSON.stringify(DeckStore)}`)
      let optionsQuery = createOptionAddDeck(userID, newDeck)
      // console.log(`Option Query: ${JSON.stringify(optionsQuery)}`)
      rp(optionsQuery)
      .then((res) => {
        // console.log(res)
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
      console.log(`Error in Query Sideboard: ${JSON.stringify(errSide)}`)
      return reject(errSide.card)
    })
  })
  .catch((errMain) => {
    console.log(`Error in Query Mainboard: ${JSON.stringify(errMain)}`)
    return reject(errMain.card)
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

const buildArrayFromTop10 = (trendArray) => new Promise((resolve, reject) => {
  let cardInfoDay= trendArray.map((card) => {
      let options = createOptionCardPerIDQuery(card)
      // console.log(JSON.stringify(options))
      return (rp(options))
    })
    let cardInfoDayPromise = Promise.all(cardInfoDay)
    cardInfoDayPromise.then((infoAPIDay) => {
      console.log(`Card Info received from ID`)
      let priceHistoryDay = trendArray.map((card) => {
        let cardID = card.card_id
        let options = createOptionGetPriceHistory(cardID)
        // console.log(JSON.stringify(options))
        return (rp(options))
      })
      let priceHistoryPromise = Promise.all(priceHistoryDay)
      priceHistoryPromise.then((priceHistory) => {
        let cardInfo = trendArray.map((element, index) => {
          return ({
            Scryfall: JSON.parse(infoAPIDay[index]),
            priceHistory: JSON.parse(priceHistory[index]),
            trend: element.trend
          })
        })
        return resolve(cardInfo)
      })
      .catch((errHistory) => {
        return reject (errHistory)
      })
    })
    .catch((errDay) => {
      return reject(errDay)
    })
})


const getTop10 = () => new Promise((resolve, reject) =>{
  let options = createOptionTop10()
  // console.log(`Option trends:${JSON.stringify(options)}`)
  rp(options)
  .then((res) => {
    let incTrendDay = JSON.parse(res).trendDay
    let incTrendWeek = JSON.parse(res).trendWeek
    let incTrendMonth = JSON.parse(res).trendMonth
    console.log(`TOP10 DAY`)
    buildArrayFromTop10(incTrendDay)
    .then((trendDay) => {
      console.log(`TOP10 WEEK`)
      buildArrayFromTop10(incTrendWeek)
      .then((trendWeek) => {
        console.log(`TOP10 MONTH`)
        buildArrayFromTop10(incTrendMonth)
        .then((trendMonth) => {
          return resolve({
            trendDay,
            trendWeek,
            trendMonth
          })
        })
        .catch((errMonth) => {
          return reject(errMonth)
        })
      })
      .catch((errWeek) => {
        return reject(errWeek)
      })
    })
    .catch((errDay) => {
      return reject(errDay)
    })
  })
  .catch((err) => {
    return reject(err)
  })
})
