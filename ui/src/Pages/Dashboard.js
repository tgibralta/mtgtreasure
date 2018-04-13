import React, { Component } from 'react';
import userStore from './../Stores/UserStore'
import TableCollection from './../Components/TableCollection'
import Footer from './../Components/Footer'
import Sidebar from './../Components/Sidebar'
import './Style/Dashboard.css'
import PanelCollection from './../Components/PanelCollection'
import DeckDisplay from './../Components/DeckDisplay'

class Dashboard extends Component {
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

  handleClickNewDeck () {
    this.props.history.push(`/user/${this.state.user.username}/createdeck`)
  }

  CreateDeckDisplay (props) {
    if (props.decks) {
      let decks = props.decks
      let user = props.user
      let listComponents = decks.map((deck) => {
        let imageGallery = [{
          src: deck.thumbnail,
          thumbnail: deck.thumbnail,
          thumbnailWidth: 170,
          thumbnailHeight: 120
        }]
        let deckName = deck.deckname
        let nbMain = deck.nb_card_in_main
        let nbSideboard = deck.nb_card_in_sideboard
        let legality = deck.legality
        console.log(`ALL STUFFS DEFINED in CreateDeckDisplay`)
        return <DeckDisplay imageDeck={imageGallery} deckname={deckName} nbMain={nbMain} nbSideboard={nbSideboard} legality={legality}/>
      })
      return listComponents
    } else {
      return (<p>No deck created. Create a new deck?</p>)
    }
  }

  
  render() {
    return (
      <div className="container-fluid">
      <div className="row">
        <div className="col-md-2 no-float">
          <Sidebar username={this.state.user.username}/>
        </div>
        <main role="main" className="col-md-9 ml-sm-auto col-lg-10 pt-3 px-4">
          <PanelCollection initialInvestment={this.state.user.initialInvestment} currentValue={this.state.user.currentValue} nbCard={this.state.user.nbCardInCollection}/>
          <hr/>
          <div className='row'>
            <div className="col-md-2">
              <h2>Decks</h2>
            </div>
            <div className="col-md-3">
              <button className="btn btn-lg btn-signin btn-primary btn-block" onClick={this.handleClickNewDeck.bind(this)}>New Deck</button>
            </div>
          </div>
          <hr/>
          <this.CreateDeckDisplay decks={this.state.user.decks} user={this.state.user}/>
        </main>
      </div>
    </div>
    )
  }
}

export default Dashboard;
