import {EventEmitter } from 'events'
import dispatcher from './../Dispatchers/Dispatcher'

class  ResultSearchStore extends EventEmitter {
  constructor() {
    super()
    this.results = [{
      "name" : "",
      "set" : "",
      "usd" : 0,
      "type_line" : "",
      "image_uris": {
        "normal" : "https://magic.wizards.com/sites/mtg/files/image_legacy_migration/magic/images/mtgcom/fcpics/making/mr224_back.jpg"
      },
      "multiverse_ids": [
        ""
      ]
    }]
  }

  setResult(results){
    console.log(`In store results: ${JSON.stringify(results)}`)
    this.results = results
    this.emit('change')
  }
  
  getResults() {
    return this.results
  }


  handleActions(action) {
    console.log(`RESULTSEARCHSTORE: Received an action`)
    switch(action.type){
      case 'SEARCH_CARD' : {
        if (action.results) {
          this.setResult(action.results)
        } else {
          this.setResult([{
            "name" : "",
            "set" : "",
            "usd" : 0,
            "type_line" : "",
            "image_uris": {
              "normal" : "https://magic.wizards.com/sites/mtg/files/image_legacy_migration/magic/images/mtgcom/fcpics/making/mr224_back.jpg"
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