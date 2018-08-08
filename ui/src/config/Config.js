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
    "GET_CARD_PER_NAME": {
      "URI": MIDDLEWARE_URI + '/getcard/name/',
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
    },
    "GET_DECKS": {
      "URI": MIDDLEWARE_URI + '/getdecks/',
      "METHOD": "GET"
    },
    "ADD_DECK": {
      "URI": MIDDLEWARE_URI + '/adddeck',
      "METHOD": "POST"
    },
    "DELETE_DECK": {
      "URI": MIDDLEWARE_URI + '/deletedeck',
      "METHOD": "PUT"
    },
    "GET_PRICE_HISTORY": {
      "URI": MIDDLEWARE_URI + '/getpricehistory/',
      "METHOD": "GET"
    },
    "GET_USER_HISTORY": {
      "URI": MIDDLEWARE_URI + '/getuserhistory/',
      "METHOD": "GET"
    },
    "UPDATE_USER_HISTORY": {
      "URI": MIDDLEWARE_URI + '/updateuserhistory',
      "METHOD": "PUT"
    },
    "GET_TOP_10": {
      "URI": MIDDLEWARE_URI + '/gettop10',
      "METHOD": "GET"
    }
  },
  "UI": {
    "URI": UI_URI
  },
  "IMAGE": {
    "FULLCARD": {
      "SMALL": {
        "HEIGHT": 680,
        "WIDTH": 288
      },
      "MEDIUM": {
        "HEIGHT": 1020,
        "WIDTH": 950
      },
      "LARGE": {
        "HEIGHT": 1360,
        "WIDTH": 976
      }
    }, 
    "ART_CROP": {
      "SMALL": {
        "HEIGHT": 120,
        "WIDTH" : 170
      },
      "MEDIUM": {
        "HEIGHT": 180,
        "WIDTH" : 255
      },
      "LARGE": {
        "HEIGHT": 240,
        "WIDTH" : 340
      },
      
    }
  }
}

export default configuration