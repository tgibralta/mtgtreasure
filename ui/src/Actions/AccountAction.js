import dispatcher from '../Dispatchers/Dispatcher'
import rp from 'request-promise'
import cors from 'cors'


export const CreateUser = (username, mail, password) => new Promise((resolve, reject) => {
  // CREATE USER ACCOUNT
  let options = {
    uri: `http://localhost:8080/adduser`,
    method: 'POST',
    origin: 'http://localhost:3000',
    body: {
      'username' : username,
      'mail' : mail,
      'password' : password
    },
    json: true
  }
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
  let optionCardQuery = {
    uri: `http://localhost:8080/getcard/id/${cardID}`,
    method: 'GET',
    origin: 'http://localhost:3000'
  }
  rp(optionCardQuery)
  .then((CardInfo) => {
    currentValueElement += nbCardInElement * JSON.parse(CardInfo).usd
    let allCardInfo = {
      "DB": element,
      "Scryfall" : JSON.parse(CardInfo)
    }
    // console.log(`nbCardInElement : ${nbCardInElement}`)
    // console.log(`investmentElement : ${investmentElement}`)
    // console.log(`currentValueElement : ${currentValueElement}`)
    // console.log(`allCardInfo : ${JSON.stringify(allCardInfo)}`)
    return resolve({allCardInfo, nbCardInElement, investmentElement, currentValueElement})
  })
  .catch((errCard) => {
    return reject(`Error while fetching card information: ${errCard}`)
  })
})

function reducerNbCard(accumulator, element) {
  return accumulator + element.nbCardInElement 
}

function reducerInvestment(accumulator, element) {
  return accumulator + element.investmentElement 
}

function reducerValue(accumulator, element) {
  return accumulator + element.currentValueElement
}

function reducerCardInfo(accumulator, element) {
  return accumulator.concat(element)
}


const loopOverArray = (array) => new Promise((resolve, reject) => {
  console.log(`Entered loopOverArray`)
  let actions = array.map(extractInfoElement)
  let results = Promise.all(actions)
  results.then((fullData => {
    let totalNbCard = fullData.reduce(reducerNbCard, 0)
    let totalInvestment = fullData.reduce(reducerInvestment, 0)
    let totalValue = fullData.reduce(reducerValue, 0)
    let totalCardInfo = fullData.reduce(reducerCardInfo, [])
    // console.log(`totalNbCard: ${totalNbCard}`)
    // console.log(`totalInvestment: ${totalInvestment}`)
    // console.log(`totalValue: ${totalValue}`)
    // console.log(`totalCardInfo: ${JSON.stringify(totalCardInfo)}`)
    return resolve({totalNbCard, totalInvestment, totalValue, totalCardInfo})
  }))
  results.catch((errLoop) => {
    console.log(`Error during Loop: ${errLoop}`)
    return reject(errLoop)
  })
})

export const SigninUser = (username, password) => new Promise((resolve, reject) => {
  let optionsSignin = {
    uri: `http://localhost:8080/login/${username}/${password}`,
    method: 'GET',
    origin: 'http://localhost:3000'
  }
  rp(optionsSignin)
  .then((res) => {
    let userID = JSON.parse(res).userID
    // FETCH USER COLLECTION
    let optionsCollection = {
      uri: `http://localhost:8080/getcollection/${userID}`,
      method: 'GET',
      origin: 'http://localhost:3000'
    }
    rp(optionsCollection)
    .then((resCollection) => {
      let JSONReply = JSON.parse(resCollection)
      loopOverArray(JSONReply)
      .then((nbCardAndInfo) => {
        let nbCardInCollection = nbCardAndInfo.totalNbCard
        let cardsInfo = nbCardAndInfo.totalCardInfo
        let initialInvestment = nbCardAndInfo.totalInvestment
        let currentValue = nbCardAndInfo.totalValue
        dispatcher.dispatch({
          type: 'SIGNIN_USER',
          username,
          userID,
          nbCardInCollection,
          initialInvestment,
          currentValue,
          cardsInfo
        })
        return resolve()
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
  let optionsAddCardToCollection = {
    uri: `http://localhost:8080/addcardtocollection`,
    method: 'POST',
    origin: 'http://localhost:3000',
    body: {
      "user_id" : userID,
      "card_id" : cardID,
      "price_when_bought" : floatPrice,
      "number" : intNumber
    },
    json: true
  }
  console.log(JSON.stringify(optionsAddCardToCollection))
  rp(optionsAddCardToCollection)
  .then((collectionIDDB) => {
    let currentDate = new Date()
    let date = currentDate.getUTCFullYear().toString() + '-' + currentDate.getUTCMonth().toString() + '-' + currentDate.getUTCDay().toString()
    let cardInfoStore = {
      "allCardInfo" : {
        "DB" : {
          "collection_id": collectionIDDB,
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
