import dispatcher from '../Dispatchers/Dispatcher'
import rp from 'request-promise'
import cors from 'cors'
import {createOptionCardPerNameQuery} from './../Models/OptionsQuery'

export const SearchCardPerName = (cardName) => new Promise((resolve, reject) => {
  let options = createOptionCardPerNameQuery(cardName)
  rp(options)
  .then((res) => {
      let results = JSON.parse(res).data
    dispatcher.dispatch({
      type: 'SEARCH_CARD',
      results
    })
    return resolve()
  })
  .catch((err) => {
    return reject(`Error at store: ${err}`)
  })
})