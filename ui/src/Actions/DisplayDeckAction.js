import dispatcher from '../Dispatchers/Dispatcher'
import rp from 'request-promise'
import cors from 'cors'

export const SetDeck = (deck) => new Promise((resolve, reject) => {
  if (deck) {
    dispatcher.dispatch({
      type: 'SET_DECK_TO_DISPLAY',
      deck
    })
    return resolve()
  } else {
    return reject(`Deck not defined`)
  }
    
})

export const setEditDeck = (deck) => new Promise((resolve, reject) => {
  if (deck) {
    dispatcher.dispatch({
      type: 'SET_DECK_TO_EDIT',
      deck
    })
    return resolve()
  } else {
    return reject(`Deck not defined`)
  }
})