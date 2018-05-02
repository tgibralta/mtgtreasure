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

export function createOptionGetDecks (userID) {
  return {
    uri: configuration.MIDDLEWARE.GET_DECKS.URI + `${userID}`,
    method: configuration.MIDDLEWARE.GET_DECKS.METHOD,
    origin: configuration.UI.URI
  }
}

export function createOptionAddDeck (userID, deck) {
  return {
    uri: configuration.MIDDLEWARE.ADD_DECK.URI,
    method: configuration.MIDDLEWARE.ADD_DECK.METHOD,
    origin: configuration.UI.URI,
    body : {
      userID,
      deck
    },
    json: true
  }
}

export function createOptionDeleteDeck (userID, deckID) {
  return {
    uri: configuration.MIDDLEWARE.DELETE_DECK.URI,
    method: configuration.MIDDLEWARE.DELETE_DECK.METHOD,
    origin: configuration.UI.URI,
    body : {
      "userID": userID,
      "deckID": deckID
    },
    json: true
  }
}

export function createOptionGetPriceHistory (cardID) {
  return {
    uri: configuration.MIDDLEWARE.GET_PRICE_HISTORY.URI + cardID,
    method: configuration.MIDDLEWARE.GET_PRICE_HISTORY.METHOD,
    origin: configuration.UI.URI,
  }
}

export function createOptionGetUserHistory (userID) {
  return {
    uri: configuration.MIDDLEWARE.GET_USER_HISTORY.URI + userID,
    method: configuration.MIDDLEWARE.GET_USER_HISTORY.METHOD,
    origin: configuration.UI.URI,
  }
}

export function createOptionAddToUserHistory (userID, nbCard, Value, Investment) {
  return {
    uri: configuration.MIDDLEWARE.UPDATE_USER_HISTORY.URI,
    method: configuration.MIDDLEWARE.UPDATE_USER_HISTORY.METHOD,
    origin: configuration.UI.URI,
    body : {
      "userID": userID,
      "mode": "ADD",
      "differenceNbCard": nbCard,
      "differenceValue": Value,
      "differenceInvestment": Investment
    },
    json: true
  }
}

export function createOptionRemoveToUserHistory (userID, nbCard, Value, Investment) {
  return {
    uri: configuration.MIDDLEWARE.UPDATE_USER_HISTORY.URI,
    method: configuration.MIDDLEWARE.UPDATE_USER_HISTORY.METHOD,
    origin: configuration.UI.URI,
    body : {
      "userID": userID,
      "mode": "REMOVE",
      "differenceNbCard": nbCard,
      "differenceValue": Value,
      "differenceInvestment": Investment
    },
    json: true
  }
}