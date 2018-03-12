const request = require('request')
const rp = require('request-promise')
const urlCardSearchPerID = rootRequire('server/models/apiDescription').urlCardSearchPerID

const receiveRequest = (req) => new Promise((resolve, reject) => {
  if (req.params.id) {
    return resolve (req.params.id)
  } else {
    return reject('Bad Request')
  }
})

const buildURLSearchCard = (cardID) => new Promise((resolve, reject) => {
  if (cardID) {
    let urlSearch = urlCardSearchPerID + cardID
    return resolve(urlSearch)
  } else {
    return reject('No card ID')
  }
})

const transferToAPI = (cardID) => new Promise((resolve, reject) => {
  buildURLSearchCard(cardID)
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
 * @description Returns a card from Scryfall API
 * @param {String} cardID
 * @return {JSON} Card information
 */
  getCardPerID (req, res) {
    return new Promise((resolve, reject) => {
      receiveRequest(req)
      .then((cardID) => {
        transferToAPI(cardID)
        .then((body) => {
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
    })
  }
}
