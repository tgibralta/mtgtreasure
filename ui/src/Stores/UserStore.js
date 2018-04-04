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
  }
  SignoutUser() {
    this.user = {
      username: '',
      userID: 0,
      nbCardInCollection: 0
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

  handleActions(action) {
    // console.log(`USERSTORE: Received an action`)
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
      default : {
        // console.log('cactched an unhandled action')
      }
    } 
  }
}

const userStore = new UserStore()
dispatcher.register(userStore.handleActions.bind(userStore))

export default userStore