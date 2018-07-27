import React, { Component } from 'react'
import userStore from './../Stores/UserStore'
import displayDeckStore from './../Stores/DisplayDeckStore'
import './Style/CreateDeck.css'
import FormEditDeck from './../Components/FormEditDeck'
import Navbar from './../Components/Navbar'
import {RedirectNavbar} from './../Functions/RedirectNavbar'
import * as AccountActions from './../Actions/AccountAction'
import Loader from 'react-loader'
import Alert from 'react-s-alert'
import 'react-s-alert/dist/s-alert-default.css'
import 'react-s-alert/dist/s-alert-css-effects/slide.css'   
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

    let nbInMain = mainObject.reduce((accumulator, element) => {
      accumulator += parseInt(element.number, 10)
      return accumulator
    }, 0)
    let nbInSide = sideboardObject.reduce((accumulator, element) => {
      accumulator += parseInt(element.number, 10)
      return accumulator
    }, 0)

    console.log(`nb Card In Main: ${nbInMain}`)
    console.log(`nb Card In Side: ${nbInSide}`)

    if (nbInMain < 60 | nbInSide !== 15) {
      if (nbInMain < 60) {
        Alert.error(`Cards in main: ${nbInMain}`, {
          position: 'bottom-right',
          effect: 'slide',
          beep: false,
          timeout: 2000,
          offset: 100,
          html: true
        })
      }
      if (nbInSide !== 15) {
        Alert.error(`Cards in sideboard: ${nbInSide}`, {
          position: 'bottom-right',
          effect: 'slide',
          beep: false,
          timeout: 2000,
          offset: 100,
          html: true
        })
      }
    } else {
      this.setState({
        loaded: false
      })
      AddDeck(userID, deckName, legality, mainObject, sideboardObject, nbInMain, nbInSide)
      .then((deckCreated) => {
        SetDeck(deckCreated)
        .then(() => {
          console.log(`Create Deck Page - Deck has been updated`)
          this.props.history.push(`/user/${this.state.user.username}/deck/${deckCreated.deckname}`)
          this.setState({
            loaded: true
          })
        })
        .catch((cardSetDeck) => {
          console.log(`Error when trying to redirect: ${cardSetDeck}`)
          this.setState({
            loaded: true
          })
          Alert.error(`Error: ${cardSetDeck}`, {
            position: 'bottom-right',
            effect: 'slide',
            beep: false,
            timeout: 2000,
            offset: 100,
            html: true
          })
        })
      })
      .catch((cardAddDeck) => {
        console.log(`Err during deck creation: ${cardAddDeck}`)
        this.setState({
          loaded: true
        })
        Alert.error(`Error: ${cardAddDeck}`, {
          position: 'bottom-right',
          effect: 'slide',
          beep: false,
          timeout: 2000,
          offset: 100,
          html: true
        })
      })
    }
  }

  Cancel(user) {
    let username = user.username
    this.props.history.push(`/user/${username}/decks/`)
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
          <Alert stack={{limit: 3}} />
          <div className="row">
            <label htmlFor="inputName">Name</label>
            <input className="form-control" id="inputName" placeholder="Name Deck" type="text" defaultValue={this.state.newDeck.deckname}/>
            <div className="col-md-4">
              <FormEditDeck cancel ={this.Cancel.bind(this,this.state.user)} deckInfo={this.state.newDeck} submit={this.Submit.bind(this,this.state.user)} valueMain={this.state.textCardMain} valueSideboard={this.state.textCardSideboard}/>
            </div>
          </div>
        </div>
      </Loader>
    </div>
    );
  }
}

export default CreateDeck;