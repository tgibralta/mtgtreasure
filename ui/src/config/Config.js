let MIDDLEWARE_URI = process.env.MIDDLEWARE_URI || 'http://localhost:8080'
let UI_URI = process.env.UI_URI || 'http://localhost:3000'


const configuration ={
  "MIDDLEWARE": {
    "ADD_USER": {
      "URI": MIDDLEWARE_URI + '/adduser',
      "METHOD": "POST"
    },
    "GET_CARD_PER_ID": {
      "URI": MIDDLEWARE_URI + '/getcard/id/',
      "METHOD": "GET"
    },
    "SIGNIN": {
      "URI": MIDDLEWARE_URI + '/login/',
      "METHOD": "GET"
    },
    "GET_COLLECTION": {
      "URI": MIDDLEWARE_URI + '/getcollection/',
      "METHOD": "GET"
    },
    "ADD_CARD_TO_COLLECTION": {
      "URI": MIDDLEWARE_URI + '/addcardtocollection',
      "METHOD": "POST"
    },
    "REMOVE_CARD_FROM_COLLECTION": {
      "URI": MIDDLEWARE_URI + '/removecardfromcollection',
      "METHOD": "PUT"
    }
  },
  "UI": {
    "URI": UI_URI
  }
}

export default configuration