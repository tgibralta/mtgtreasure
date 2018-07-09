import React, { Component } from 'react';
import Sidebar from './../Components/Sidebar'
import userStore from './../Stores/UserStore'
import displayDeckStore from './../Stores/DisplayDeckStore'
import './Style/CreateDeck.css'
import FormEditDeck from './../Components/FormEditDeck'
import {redirectToDeckPage} from './../Functions/redirectToDeckPage'
import Navbar from './../Components/Navbar'
import {RedirectNavbar} from './../Functions/RedirectNavbar'
import * as AccountActions from './../Actions/AccountAction'
import Loader from 'react-loader'
const SearchCardPerName = require('./../Actions/SearchAction').SearchCardPerName
const SetDeck = require('./../Actions/DisplayDeckAction').SetDeck
const AddDeck = require('./../Actions/AccountAction').AddDeck

class CreateDeck extends Component {
  constructor () {
    super()
    this.state = {
      user: userStore.getUser(),
      isLoggedIn: userStore.getIsLoggedIn(),
      newDeck : displayDeckStore.getDeckEdited(),
      textCardMain : displayDeckStore.getTextMain(),
      textCardSideboard : displayDeckStore.getTextSideboard(),
      loaded: true
    }
  }


  componentWillMount () {
    userStore.on('change', () => {
      this.setState({
        user: userStore.getUser(),
        isLoggedIn: userStore.getIsLoggedIn(),
        loaded: true
      }) 
    })
    displayDeckStore.on('change', () => {
      this.setState({
        newDeck : displayDeckStore.getDeckEdited(),
        textCardMain : displayDeckStore.getTextMain(),
        textCardSideboard : displayDeckStore.getTextSideboard()
      }) 
    })
  }

  Logout() {
    AccountActions.SignoutUser()
    this.props.history.push(`/`)
  }

  Submit(user) {
    this.setState({
      loaded: false
    })
    let userID = user.userID
    let username = user.username
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

    // console.log(`Main: ${JSON.stringify(mainObject)}`)
    // console.log(`Sideboard: ${JSON.stringify(sideboardObject)}`)
    AddDeck(userID, deckName, legality, mainObject, sideboardObject)
    .then((deckCreated) => {
      // console.log(`Now waiting to redirect: ${JSON.stringify(deckCreated)}`)
      // redirectToDeckPage.bind(this, deckCreated)
      SetDeck(deckCreated)
      .then(() => {
        this.props.history.push(`/user/${this.state.user.username}/deck/${deckCreated.deckname}`)
        this.setState({
          loaded: true
        })
      })
      .catch((err) => {
        console.log(`Error when trying to redirect: ${err}`)
        this.setState({
          loaded: true
        })
      })
    })
    .catch((err) => {
      console.log(`Err during deck creation: ${err}`)
      this.setState({
        loaded: true
      })
    })

  }

  render() {
    return (
    <div>
      <Loader loaded={this.state.loaded} className="loader-spinner-white">
        <div className="jumbotron jumbotron-dashboard">
          <Navbar isLoggedIn={this.state.isLoggedIn} username={this.state.user.username} Logout={this.Logout.bind(this)} Redirect={RedirectNavbar} history={this.props.history}/>
          <div className="container container-text-jumbo">
            <h4 className="text-center text-title-jumbo">DASHBOARD</h4>
          </div>
        </div>
        <div className="container">
          <h3>Edit Deck</h3>
          <hr/>
          <div className="row">
            <label for="inputName">Name</label>
            <input className="form-control" id="inputName" placeholder="Name Deck" type="text" defaultValue={this.state.newDeck.deckname}/>
            <div className="col-md-4">
              <FormEditDeck deckInfo={this.state.newDeck} submit={this.Submit.bind(this,this.state.user)} valueMain={this.state.textCardMain} valueSideboard={this.state.textCardSideboard}/>
            </div>
          </div>
        </div>
      </Loader>
    </div>
    );
  }
}

export default CreateDeck;