const request = require('request')
const rp = require('request-promise')

const setImage = (req, res) => new Promise((resolve, reject) => {
  console.log(req.body)
  if (req.body.urlImage) {
    let options = {
      uri: req.body.urlImage,
      method: 'GET'
    }
    rp(options)
    .then((body) => {
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
})

module.exports = {
  setImage
}
