const request = require('request')
const rp = require('request-promise')
const mcache = require('memory-cache')
const headerCacheScryfall = rootRequire('server/models/cacheInfo').headerCacheScryfall
const timeoutCacheScryfall = rootRequire('server/models/cacheInfo').timeoutCacheScryfall

const setImage = (req, res) => new Promise((resolve, reject) => {
  let key = headerCacheScryfall + body.urlImage
  let cachedBody = mcache.get(key)
  if (cachedBody) {
    res.status(200).send(cachedBody)
    return resolve()
  } else {
    if (req.body.urlImage) {
      let options = {
        uri: req.body.urlImage,
        method: 'GET'
      }
      rp(options)
      .then((body) => {
        mcache.put(key,body,timeoutCacheScryfall)
        res.status(200).send(body)
        return resolve()
      })
      .catch((err) => {
        res.status(400).send(err)
        return reject()
      })
    } else {
      res.status(400).send('Bad Request')
      return reject ()
    }
  }
  
})

module.exports = {
  setImage
}
