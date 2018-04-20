import React, { Component } from 'react'
import Sidebar from './../Components/Sidebar'
import userStore from './../Stores/UserStore'
import DeckDisplay from './../Components/DeckDisplay'
import {CreateDeckDisplay} from './../Functions/CreateDeckDisplay'
import {redirectToDeckPage} from './../Functions/redirectToDeckPage'

const DeleteDeck = require('./../Actions/AccountAction').DeleteDeck

class Decks extends Component {
  constructor () {
    super()
    this.state = {
      user : userStore.getUser()
    }
  }
  componentWillMount () {
    userStore.on('change', () => {
      this.setState({
        user: userStore.getUser()
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

  render() {
    return (
      <div className="container-fluid">
      <div className="row">
        <div className="col-md-2 no-float">
          <Sidebar username={this.state.user.username}/>
        </div>
        <main role="main" className="col-md-9 ml-sm-auto col-lg-10 pt-3 px-4">
          <div className='row'>
            <div className="col-md-2">
              <h2>Decks</h2>
            </div>
            <div className="col-md-2">
              <button className="btn btn-lg btn-signin  btn-primary btn-block" onClick={this.handleClickNewDeck.bind(this)}>New Deck</button>
            </div>
          </div>
          <hr/>
          <CreateDeckDisplay decks={this.state.user.decks} user={this.state.user} delete={this.handleDelete.bind(this)} goTo={redirectToDeckPage.bind(this)}/>
        </main>
      </div>
    </div>
    );
  }
}

export default Decks;
