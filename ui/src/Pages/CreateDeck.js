import React, { Component } from 'react';
import Sidebar from './../Components/Sidebar'
import userStore from './../Stores/UserStore'
import './Style/CreateDeck.css'
import FormEditDeck from './../Components/FormEditDeck'
const SearchCardPerName = require('./../Actions/SearchAction').SearchCardPerName
const AddDeck = require('./../Actions/AccountAction').AddDeck

class CreateDeck extends Component {
  constructor () {
    super()
    this.state = {
      user: userStore.getUser(),
      newDeck: {
                  name: '',
                  avg_cmc: 0,
                  legality: 'standard',
                  nb_main: 0,
                  nb_sideboard: 0,
                  main: [],
                  sideboard: []
                },
      textCardMain: "",
      textCardSideboard: "",
    }
  }
  componentWillMount () {
    userStore.on('change', () => {
      this.setState({
        user: userStore.getUser()
      }) 
    })
  }

  Submit(user) {
    let userID = user.userID
    // Parse the content of the text area for the Main
    let mainObject = []
    let sideboardObject = []
    let deckName = document.getElementById('inputName').value
    let legality = document.getElementById('formatSelect').value
    let linesMain = document.getElementById('textMain').value.split('\n')
    linesMain.forEach((line) => {
      let infos = line.split(' ')
      let numberCard = infos[0]
      let nameCard = ''
      infos.forEach((word) => {
        if (infos.indexOf(word) === 0) {
          // already treated
        } else {
          nameCard += word
        }
      })
      let element = {
        'number'    : numberCard,
        'cardName'  : nameCard
      }
      mainObject.push(element)
    })

    // Parse the Content of the text area for the Sideboard
    let linesSideboard = document.getElementById('textSideboard').value.split('\n')
    linesSideboard.forEach((line) => {
      let infos = line.split(' ')
      let numberCard = infos[0]
      let nameCard = ''
      infos.forEach((word) => {
        if (infos.indexOf(word) === 0) {
          // already treated
        } else {
          nameCard += word
        }
      })
      let element = {
        'number'    : numberCard,
        'cardName'  : nameCard
      }
      sideboardObject.push(element)
    })

    console.log(`Main: ${JSON.stringify(mainObject)}`)
    console.log(`Sideboard: ${JSON.stringify(sideboardObject)}`)
    AddDeck(userID, deckName, legality, mainObject, sideboardObject)
    .then(() => {
      console.log(`Deck created. Will need to be redirected to deck page (WIP)`)
    })
    .catch((err) => {
      console.log(`Err during deck creation: ${err}`)
    })

  }

  render() {
    return (
      <div className="container-fluid">
      <div className="row">
        <div className="col-md-2 no-float">
          <Sidebar username={this.state.user.username}/>
        </div>
        <main role="main" className="col-md-9 ml-sm-auto col-lg-10 pt-3 px-4">
          <h3>Edit Deck</h3>
          <hr/>
          <div className="row">
            <label for="inputName">Name</label>
            <input className="form-control" id="inputName" placeholder="Name Deck" type="text" defaultValue={this.state.newDeck.name}/>
            <div className="col-md-4">
              <FormEditDeck deckInfo={this.state.newDeck} submit={this.Submit.bind(this,this.state.user)} valueMain={this.state.textCardMain} valueSideboard={this.state.textCardSideboard}/>
            </div>
          </div>
        </main>
      </div>
    </div>
    );
  }
}

export default CreateDeck;