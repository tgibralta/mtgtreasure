import React, { Component } from 'react'
import userStore from './../Stores/UserStore'
import {CreateDeckDisplay} from './../Functions/CreateDeckDisplay'
import {redirectToDeckPage} from './../Functions/redirectToDeckPage'
import Navbar from './../Components/Navbar'
import * as AccountActions from './../Actions/AccountAction'
import {RedirectNavbar} from './../Functions/RedirectNavbar'
import Footer from './../Components/Footer'

const DeleteDeck = require('./../Actions/AccountAction').DeleteDeck

class Decks extends Component {
  constructor () {
    super()
    this.state = {
      user: userStore.getUser(),
      isLoggedIn: userStore.getIsLoggedIn(),
      trends: userStore.getTop10()
    }
  }
  componentWillMount () {
    userStore.on('change', () => {
      this.setState({
        user: userStore.getUser(),
        isLoggedIn: userStore.getIsLoggedIn(),
      trends: userStore.getTop10()
      })
    })
  }


  handleDelete(userID, deckID) {
    console.log(`Delete trigger in Decks`)
    DeleteDeck(userID, deckID)
    .then(() => {
      console.log(`Deck deleted`)
    })
    .catch((err) => {
      console.log(`Error while deleting Deck`)
    })
  }

  handleClickNewDeck () {
    this.props.history.push(`/user/${this.state.user.username}/createdeck`)
  }

  Logout() {
    AccountActions.SignoutUser()
    this.props.history.push(`/`)
  }

  render() {
    return (
    <div>
      <div className="jumbotron jumbotron-dashboard">
        <Navbar isLoggedIn={this.state.isLoggedIn} username={this.state.user.username} Logout={this.Logout.bind(this)} Redirect={RedirectNavbar} history={this.props.history}/>
        <div className="container container-text-jumbo">
          <h4 className="text-center text-title-jumbo">DECKS</h4>
        </div>
      </div>
      <div className="container">
        <div className = "row">
          <CreateDeckDisplay decks={this.state.user.decks} user={this.state.user} delete={this.handleDelete.bind(this)} goTo={redirectToDeckPage.bind(this)}/>
        </div>
        <hr/>
        <button className="btn btn-lg btn-signin  btn-primary btn-block" onClick={this.handleClickNewDeck.bind(this)}>New Deck</button>
      </div>
    </div>
    );
  }
}

export default Decks
