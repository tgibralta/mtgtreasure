import dispatcher from '../Dispatchers/Dispatcher'
import rp from 'request-promise'
import cors from 'cors'

export const SearchCardPerName = (cardName) => new Promise((resolve, reject) => {
  let options = {
    uri: `http://localhost:8080/getcard/name/${cardName}`,
    method: 'GET',
    origin: 'http://localhost:3000'
  }
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