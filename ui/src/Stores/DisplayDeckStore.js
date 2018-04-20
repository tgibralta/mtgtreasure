import {EventEmitter } from 'events'
import dispatcher from './../Dispatchers/Dispatcher'

class  DisplayDeckStore extends EventEmitter {
  constructor() {
    super()
    this.deck = {
        'deckname': 'No name'
    }
    this.deckEdited = {
      'deckname': '',
      'main': [],
      'sideboard': []
    }
  }

  setDeck(deck){
    console.log(`In store Display Deck: ${JSON.stringify(deck)}`)
    this.deck = deck
    this.emit('change')
  }

  setEditDeck(deck){
    console.log(`Edited Deck: ${JSON.stringify(deck)}`)
    this.deckEdited = deck
    this.emit('change')
  }
  
  getDeck() {
    console.log(`Get Deck triggered: ${JSON.stringify(this.deck)}`)
    return this.deck
  }

  getDeckEdited() {
    return this.deckEdited
  }

  getTextMain() {
    console.log(`getTextMain called`)
    let text =this.deckEdited.main.reduce((accumulator, card) => {
      accumulator += `${card.number} ${card.name}\n`
      return (accumulator)
    }, '')
    text = text.slice(0,-1)
    return text
  }
  getTextSideboard() {
    console.log(`getTextSideboard called`)
    let text =this.deckEdited.sideboard.reduce((accumulator, card) => {
      accumulator += `${card.number} ${card.name}\n`
      return (accumulator)
    }, '')
    text = text.slice(0,-1)
    return text
  }


  handleActions(action) {
    // console.log(`RESULTSEARCHSTORE: Received an action`)
    switch(action.type){
      case 'SET_DECK_TO_DISPLAY' : {
        this.setDeck(action.deck)
        break
      }
      case 'SET_DECK_TO_EDIT' : {
        this.setEditDeck(action.deck)
        break
      }
      default : {
          break
      }
    } 
  }
}

const displayDeckStore = new DisplayDeckStore()
dispatcher.register(displayDeckStore.handleActions.bind(displayDeckStore))

export default displayDeckStore