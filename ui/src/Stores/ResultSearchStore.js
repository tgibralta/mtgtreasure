import {EventEmitter } from 'events'
import dispatcher from './../Dispatchers/Dispatcher'

class  ResultSearchStore extends EventEmitter {
  constructor() {
    super()
    this.results = [{
      "cardInfo": {
        "name" : "",
        "set" : "",
        "set_name": "",
        "mana_cost": 0,
        "usd" : 0,
        "type_line" : "",
        "image_uris": {
          "large" : "https://magic.wizards.com/sites/mtg/files/image_legacy_migration/magic/images/mtgcom/fcpics/making/mr224_back.jpg",
          "art_crop": "https://magic.wizards.com/sites/mtg/files/image_legacy_migration/magic/images/mtgcom/fcpics/making/mr224_back.jpg"
        },
        "multiverse_ids": [
          ""
        ] 
      },
      "priceHistory": {
        "priceHistory": [
          {
            "price": 0,
            "date": "0"
          }
        ]
      }
    }]
  }

  setResult(results){
    console.log(`In store results: ${JSON.stringify(results)}`)
    this.results = results
    this.emit('change')
  }
  
  getResults() {
    console.log(`LIST RESULTS: ${JSON.stringify(this.results)}`)
    return this.results
  }


  handleActions(action) {
    // console.log(`RESULTSEARCHSTORE: Received an action`)
    switch(action.type){
      case 'SEARCH_CARD' : {
        if (action.objectResult) {
          this.setResult(action.objectResult)
        } else {
          this.setResult([{
            "name" : "",
            "set" : "",
            "usd" : 0,
            "type_line" : "",
            "image_uris": {
              "large" : "https://magic.wizards.com/sites/mtg/files/image_legacy_migration/magic/images/mtgcom/fcpics/making/mr224_back.jpg"
            }
          }])
        }
        
        break
      }
      default : {
      }
    } 
  }
}

const resultSearchStore = new ResultSearchStore()
dispatcher.register(resultSearchStore.handleActions.bind(resultSearchStore))

export default resultSearchStore