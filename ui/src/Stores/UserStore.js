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
      decks: [
      ]
    }
    this.isLoggedIn = false
  }
  SigninUser(username, userID, nbCardInCollection, initialInvestment, currentValue, cardsInfo) {
    this.user.username = username
    this.user.userID = userID
    this.isLoggedIn = true
    this.user.nbCardInCollection = nbCardInCollection
    this.user.collection = cardsInfo
    this.user.initialInvestment = initialInvestment
    this.user.currentValue = currentValue
    this.emit('change')
    console.log(`New State: ${JSON.stringify(this.user)}`)
  }
  SignoutUser() {
    this.user = {
      username: '',
      userID: 0,
      nbCardInCollection: 0,
      initialInvestment: 0,
      currentValue: 0,
      collection: [],
      decks: []
    }
    this.isLoggedIn = false
    this.emit('change')
  }
  getUser() {
    return this.user
  }
  getIsLoggedIn(){
    return this.isLoggedIn
  }

  AddCardToCollection(user, cardInfo) {
    this.user.collection.push(cardInfo)
    this.user.nbCardInCollection += cardInfo.allCardInfo.DB.number_of_card
    this.user.initialInvestment += cardInfo.allCardInfo.DB.init_price
    this.user.currentValue += parseFloat(cardInfo.allCardInfo.Scryfall.usd)
    console.log(`Type of number_of_card: ${typeof(cardInfo.allCardInfo.DB.number_of_card)}`)
    console.log(`Type of init_price: ${typeof(cardInfo.allCardInfo.DB.init_price)}`)
    console.log(`Type of value: ${typeof(cardInfo.allCardInfo.Scryfall.usd)}`)
    this.emit('change')
  }

  handleActions(action) {
    console.log(`USERSTORE: Received an action`)
    switch(action.type){
      case 'SIGNIN_USER' : {
        // console.log(`USERSTORE: USER Signin In`)
        // console.log(action)
        this.SigninUser(action.username, action.userID, action.nbCardInCollection, action.initialInvestment, action.currentValue, action.cardsInfo)
        break
      }
      case 'SIGNOUT_USER' : {
        this.SignoutUser()
        break
      }
      case 'CREATE_USER' : {
        // console.log(`USERSTORE: Setting user information`)
        this.SigninUser(action.username, action.userID, 0, 0, 0, [])
        break
      }
      case 'ADD_CARD_TO_COLLECTION' : {
        console.log('USERSTORE: Adding card to collection')
        this.AddCardToCollection(action.userID, action.cardInfoStore)
        break
      }
      default : {
        // console.log('cactched an unhandled action')
      }
    } 
  }
}

const userStore = new UserStore()
dispatcher.register(userStore.handleActions.bind(userStore))

export default userStore