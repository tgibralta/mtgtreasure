const request = require('request')
const rp = require('request-promise')
const urlCardSearchPerName = rootRequire('server/models/apiDescription').urlCardSearchPerName
const mcache = require('memory-cache')
const headerCacheScryfall = rootRequire('server/models/cacheInfo').headerCacheScryfall
const timeoutCacheScryfall = rootRequire('server/models/cacheInfo').timeoutCacheScryfall

const receiveRequest = (req) => new Promise((resolve, reject) => {
  if (req.params.cardname) {
    let cardname = req.params.cardname
    return resolve(cardname)
  } else {
    return reject(`Bad Request`)
  }
})

const buildURLSearchCard = (cardname) => new Promise((resolve, reject) => {
  if (cardname) {
    let urlSearch = urlCardSearchPerName + cardname
    return resolve (urlSearch)
  } else {
    return reject(`Empty value for cardname`)
  }
})

const transferToAPI = (cardname) => new Promise((resolve, reject) => {
  buildURLSearchCard(cardname)
  .then((urlSearch) => {
    let options = {
      uri: urlSearch,
      method: 'GET'
    }
    rp(options)
    .then((body) => {
      return resolve(JSON.parse(body))
    })
    .catch((err) => {
      return reject(err)
    })
  })
  .catch((err) => {
    return reject(err)
  })
})



module.exports = {
 /**
 * @description Returns a list of card from Scryfall relative to a request
 * @param {String} cardname
 * @return {JSON} Card information
 */
  getCardPerName (req, res) {
    return new Promise((resolve, reject) => {
      let key = headerCacheScryfall + req.url
      let cachedBody = mcache.get(key)
      if (cachedBody) {
        res.status(200).send(cachedBody)
      } else {
        receiveRequest(req)
        .then((cardname) => {
          transferToAPI(cardname)
          .then((body) => {
            mcache.put(key,body,timeoutCacheScryfall)
            res.status(200).send(body)
          })
          .catch((err) => {
            console.log(`Error transferToAPI: ${err}`)
            res.status(400).send(err)
          })
        })
        .catch((err) => {
          console.log(`Error receiveRequest: ${err}`)
          res.status(400).send(err)
        })
      }
    })
  }
}