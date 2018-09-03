import {EventEmitter } from 'events'
import dispatcher from './../Dispatchers/Dispatcher'

class UserStore extends EventEmitter {
  constructor() {
    super()
    this.user = {
      username: '',
      userID: 0,
      nbCardInCollection: 0,
      initialInvestment: 0,
      currentValue: 0,
      collection: [
      ],
      decks: [{
        name: '',
        avg_cmc: 0,
        legality: 'standard',
        nb_main: 0,
        nb_sideboard: 0,
        main: [],
        sideboard: []
      }
      ],
    history: []
    }
    this.isLoggedIn = false
    this.top10 = {trendDay:[],
                  trendWeek:[],
                  trendMonth:[]}
  }
  SigninUser(username, userID, nbCardInCollection, initialInvestment, currentValue, cardsInfo, decks, history) {
    this.user.username = username
    this.user.userID = userID
    this.isLoggedIn = true
    this.user.nbCardInCollection = nbCardInCollection
    this.user.collection = cardsInfo
    this.user.initialInvestment = initialInvestment
    this.user.currentValue = currentValue
    this.user.decks = decks
    this.user.history = history
    // console.log(`Collection: ${JSON.stringify(this.user.collection)}`)
    // console.log(`Decks: ${JSON.stringify(this.user.decks)}`)
    // console.log(`Userstore - emit change from Signin : ${JSON.stringify(this.user)}`)
    this.emit('change')
  }
  SignoutUser() {
    this.user = {
      username: '',
      userID: 0,
      nbCardInCollection: 0,
      initialInvestment: 0,
      currentValue: 0,
      collection: [],
      decks: [],
      history: []
    }
    this.isLoggedIn = false
    this.emit('change')
  }
  getUser() {
    return this.user
  }
  getDecks() {
    return this.user.decks
  }
  getIsLoggedIn(){
    return this.isLoggedIn
  }

  getTop10() {
    return this.top10
  }

  getDeck(deckID) {
    this.user.decks.forEach((deck) => {
      // console.log(`Deck we are trying to find: ${deckID}`)
      // console.log(`Deck in Store: ${deck.deckname}`)
      if (deck.deckname === deckID) {
        // console.log(`Deck returned as match found`)
        return deck
      }
    })
  }

  AddCardToCollection = (user, cardInfo, userInfo) => new Promise ((resolve, reject) => {
    if (cardInfo) {
      this.user.collection.push(cardInfo)
      this.user.nbCardInCollection += cardInfo.allCardInfo.DB.number_of_card
      this.user.initialInvestment += cardInfo.allCardInfo.DB.init_price * cardInfo.allCardInfo.DB.number_of_card
      this.user.currentValue += parseFloat(cardInfo.allCardInfo.Scryfall.usd) * cardInfo.allCardInfo.DB.number_of_card
      // console.log(`Type of number_of_card: ${typeof(cardInfo.allCardInfo.DB.number_of_card)}`)
      // console.log(`Type of init_price: ${typeof(cardInfo.allCardInfo.DB.init_price)}`)
      // console.log(`Type of value: ${typeof(cardInfo.allCardInfo.Scryfall.usd)}`)
      
      if (userInfo.existed === "true"){ // update history
        this.user.history[this.user.history.length - 1] = {
          "date": userInfo.date,
          "value_collection": userInfo.value,
          "investment": userInfo.investment,
          "potential_profit": userInfo.profit,
          "nb_card": userInfo.nbCard
        }
      } else { // add entry to history
        this.user.history.push({
          "date": userInfo.date,
          "value_collection": userInfo.value,
          "investment": userInfo.investment,
          "potential_profit": userInfo.profit,
          "nb_card": userInfo.nbCard
        })
      }
      // console.log(`user history: ${JSON.stringify(this.user.history)}`)
      this.emit('change')
      return resolve()
    } else {
      return reject(`CardInfo incorrect`)
    }
      
  })
    

  RemoveCardFromCollection = (collectionID, nbCardToRemove, userInfo) => new Promise((resolve, reject) => {
    let indexCardToRemove = this.user.collection.findIndex(element => element.allCardInfo.DB.collection_id === collectionID)
    // console.log(JSON.stringify(this.user.collection))
    // console.log(`Index: ${indexCardToRemove}`)
    if (indexCardToRemove !== -1) {
      // console.log(`Element removed: ${JSON.stringify(this.user.collection[indexCardToRemove].allCardInfo.Scryfall.name)}`)
      // console.log(`Nb Card to Remove: ${nbCardToRemove}`)
      // console.log(`Init Price: ${this.user.collection[indexCardToRemove].allCardInfo.DB.init_price}`)
      // console.log(`Current Value: ${this.user.collection[indexCardToRemove].allCardInfo.Scryfall.usd}`)
      this.user.nbCardInCollection -= nbCardToRemove
      this.user.initialInvestment -= nbCardToRemove * this.user.collection[indexCardToRemove].allCardInfo.DB.init_price
      this.user.currentValue -= this.user.collection[indexCardToRemove].allCardInfo.Scryfall.usd
      this.user.collection.splice(indexCardToRemove, 1)
      if (userInfo.existed === "true"){ // update history
        this.user.history[this.user.history.length - 1] = {
          "date": userInfo.date,
          "value_collection": userInfo.value,
          "investment": userInfo.investment,
          "potential_profit": userInfo.profit,
          "nb_card": userInfo.nbCard
        }
      } else { // add entry to history
        this.user.history.push({
          "date": userInfo.date,
          "value_collection": userInfo.value,
          "investment": userInfo.investment,
          "potential_profit": userInfo.profit,
          "nb_card": userInfo.nbCard
        })
      }
      // console.log(JSON.stringify(this.user))
      this.emit('change')
      // console.log(`Change emitted`)
      return resolve()
    } else {
      return reject(`RemoveCardFromCollection: Index invalid`)
    }
  })

  addTop10 = (trends) => new Promise((resolve, reject) => {
    if (trends) {
      this.top10 = trends
      this.emit('change')
      return resolve()
    } else {
      return reject('Empty trends')
    }
  })


  AddDeck = (newDeck) => new Promise((resolve, reject) => {
    // console.log(`User Created/edited a deck`)
    if (newDeck) {
      // check if decks already exists
      let newName = newDeck.deckname
      let exist = 0
      this.user.decks.forEach((deck) => {
        // console.log(`Deck: ${JSON.stringify(deck)}`)
        if (deck.deckname === newName) {
          exist = 1
        }
      })
      // console.log(`EXIST: ${exist} #############################################`)
      if (exist === 1) {
        //find index and replace
        let indexToReplace = this.user.decks.findIndex(function (x) {
          if (x.deckname === newName) {
            return x
          }
        })
        // console.log(`Existing deck. Index ${indexToReplace}`)
        this.user.decks[indexToReplace] = newDeck
        this.emit('change')
      } else {
        this.user.decks.push(newDeck)
        this.emit('change')
      }
    } else {
      return reject(`Not a valid new deck`)
    }
  })


  DeleteDeck = (userID, deckID) => new Promise((resolve, reject) => {
    // console.log(`Decks object: ${JSON.stringify(this.user.decks)}`)
    let indexDeck = this.user.decks.findIndex((element)=> element.deckname === deckID)
    // console.log(`indexDeck: ${indexDeck}`)
    if (indexDeck > -1) {
      this.user.decks.splice(indexDeck, 1)
      this.emit('change')
      // console.log(`State after deleting deck: ${JSON.stringify(this.user)}`)
      return resolve()
    } else {
      return reject(`Deck does not exist in Userstore`)
    }
  })
    

  handleActions(action) {
    // console.log(`USERSTORE: Received an action`)
    switch(action.type){
      case 'SIGNIN_USER' : {
        // console.log(`USERSTORE: USER Signin In`)
        // console.log(action)
        this.SigninUser(action.username, action.userID, action.nbCardInCollection, action.initialInvestment, action.currentValue, action.cardsInfo, action.listDecks, action.history)
        break
      }
      case 'SIGNOUT_USER' : {
        this.SignoutUser()
        break
      }
      case 'CREATE_USER' : {
        // console.log(`USERSTORE: Setting user information`)
        this.SigninUser(action.username, action.userID, 0, 0, 0, [], action.trends)
        break
      }
      case 'ADD_CARD_TO_COLLECTION' : {
        // console.log('USERSTORE: Adding card to collection')
        this.AddCardToCollection(action.userID, action.cardInfoStore, action.UserInfo)
        .then(()=> {
          // console.log(`Card Added Successfully`)
        })
        .catch((err)=> {
          console.log(`Error in store when adding card ${err}`)
        })
        break
      }
      case 'REMOVE_CARD_FROM_COLLECTION' : {
        // console.log('USERSTORE: Removing card from collection')
        this.RemoveCardFromCollection(action.collectionID, action.nbCardToRemove, action.UserInfo)
        .then(()=> {
          // console.log(`Card Removed Successfully`)
        })
        .catch((err)=> {
          console.log(`Error in store when removing card: ${err}`)
        })
        break
      }
      case 'ADD_DECK' : {
        this.AddDeck(action.DeckStore)
        .then(()=> {
          // console.log(`USERSTORE: deck successfuly added`)
        })
        .catch((err) => {
          // console.log(`USERSTORE: Error when adding deck: ${err}`)
        })
        break
      }
      case 'DELETE_DECK': {
        // console.log(`USERSTORE: deleting deck ${action.deckID}`)
        this.DeleteDeck(action.userID, action.deckID)
        .then(() => {
          // console.log(`Removed Deck Successfuly`)
        })
        .catch((err) => {
          console.log(`Error while deleting deck: ${err}`)
        })
        break
      }
      case 'TOP_10': {
        this.addTop10(action.trends)
        .then(() => {
          console.log(`top10 updated: ${this.top10}`)
        })
        .catch((err) => {
          console.log(`Err while updating top10: ${err}`)
        })
        break
      }
      
      default : {
        break
      }
    } 
  }
}

const userStore = new UserStore()
dispatcher.register(userStore.handleActions.bind(userStore))

export default userStore