import config from 'react-global-configuration'
import configuration from './../config/Config'

export function createOptionAddUser (username, mail, password) {
  console.log()
  return {
    uri: configuration.MIDDLEWARE.ADD_USER.URI,
    method: configuration.MIDDLEWARE.ADD_USER.METHOD,
    origin: configuration.UI.URI,
    body: {
      'username' : username,
      'mail' : mail,
      'password' : password
    },
    json: true
  }
}

export function createOptionCardPerIDQuery (element) {
  return {
    uri: configuration.MIDDLEWARE.GET_CARD_PER_ID.URI + `${element.card_id}`,
    method: configuration.MIDDLEWARE.GET_CARD_PER_ID.METHOD,
    origin: configuration.UI.URI
  }
}

export function createOptionCardPerNameQuery (cardName) {
  return {
    uri: configuration.MIDDLEWARE.GET_CARD_PER_NAME.URI + `${cardName}`,
    method: configuration.MIDDLEWARE.GET_CARD_PER_NAME.METHOD,
    origin: configuration.UI.URI
  }
}

export function createOptionSignin (username, password){
  return {
    uri: configuration.MIDDLEWARE.SIGNIN.URI + `${username}/${password}`,
    method: configuration.MIDDLEWARE.SIGNIN.METHOD,
    origin: configuration.UI.URI
  }
}

export function createOptionGetCollection (userID) {
  return {
    uri: configuration.MIDDLEWARE.GET_COLLECTION.URI + `${userID}`,
    method: configuration.MIDDLEWARE.GET_COLLECTION.METHOD,
    origin: configuration.UI.URI
  }
}

export function createOptionAddCardToCollection (userID, cardID, price_when_bought, number) {
  return {
    uri: configuration.MIDDLEWARE.ADD_CARD_TO_COLLECTION.URI,
    method: configuration.MIDDLEWARE.ADD_CARD_TO_COLLECTION.METHOD,
    origin: configuration.UI.URI,
    body: {
      "user_id" : userID,
      "card_id" : cardID,
      "price_when_bought" : price_when_bought,
      "number" : number
    },
    json: true
  }
}

export function createOptionDeleteCardFromCollection (collectionID, nbToRemove, nbAvailable) {
  return {
    uri: configuration.MIDDLEWARE.REMOVE_CARD_FROM_COLLECTION.URI,
    method: configuration.MIDDLEWARE.REMOVE_CARD_FROM_COLLECTION.METHOD,
    origin: configuration.UI.URI,
    body: {
      "collectionID" : collectionID,
      "nbCardToRemove" : nbToRemove,
      "currentNbCard" : nbAvailable
    },
    json: true
  }
}