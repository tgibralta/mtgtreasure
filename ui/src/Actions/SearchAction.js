import dispatcher from '../Dispatchers/Dispatcher'
import rp from 'request-promise'
import cors from 'cors'
import {createOptionCardPerNameQuery,
        createOptionGetPriceHistory} from './../Models/OptionsQuery'

const getPriceHistoryCard = (cardInfo) => new Promise((resolve, reject) => {
  let cardID = cardInfo.multiverse_ids[0]
  let optionsPrice = createOptionGetPriceHistory(cardID)
  rp(optionsPrice)
  .then((res) => {
    console.log(`Response for history: ${JSON.stringify(res)}`)
    return resolve({
      cardInfo,
      "priceHistory": JSON.parse(res)
    })
  })
  .catch((err) => {
    return reject(err)
  })
})

export const SearchCardPerName = (cardName) => new Promise((resolve, reject) => {
  let options = createOptionCardPerNameQuery(cardName)
  rp(options)
  .then((res) => {
    let results = JSON.parse(res).data
    // get the price history for each card
    let pricePerResult = results.map(getPriceHistoryCard)
    let promiseResult = Promise.all(pricePerResult)
    promiseResult
    .then((objectResult) => {
      console.log(`SEARCH OBJECT: ${JSON.stringify(objectResult)}`)
      dispatcher.dispatch({
        type: 'SEARCH_CARD',
        objectResult
      })
      return resolve()
    })
    .catch((errPrice) => {
      return reject(`Error in price history: ${errPrice}`)
    })
  })
  .catch((err) => {
    return reject(`Error at store: ${err}`)
  })
})