import React, { Component } from 'react';
import Sidebar from './../Components/Sidebar'
import userStore from './../Stores/UserStore'
import displayDeckStore from './../Stores/DisplayDeckStore'
import DisplayCardInDeck from './../Components/DisplayCardInDeck'
import {setEditDeck} from './../Actions/DisplayDeckAction'

class Deck extends Component {
  constructor (props) {
    super(props)
    this.state = {
      user: userStore.getUser(),
      deck: displayDeckStore.getDeck()
    }
  }

  componentWillMount () {
    userStore.on('change', () => {
      this.setState({
        user: userStore.getUser(),
      })
    })
    displayDeckStore.on('change', () => {
      this.setState({
        deck: displayDeckStore.getDeck()
      })
    })
  }

  DisplayCards (props) {
    let board = props.board
    let listComponents = board.map((card) => {
      let image = card.uri
      let number = card.number
      let name = card.name
      let imageGallery = [{
        src: image,
        thumbnail: image,
        thumbnailWidth: 170,
        thumbnailHeight: 120
      }]
      return <DisplayCardInDeck image={imageGallery} number={number} name={name}/>
    })
    return listComponents
  }

  handleEdit(deck) {
    // console.log(`Edit button pushed`)
    setEditDeck(deck)
    .then(() => {
      console.log(`Deck ready to be edited`)
      this.props.history.push(`/user/${this.state.user.username}/createdeck`)
    })
    .catch((err) => {
      console.log(`Error when handling Edit deck: ${err}`)
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
          <div className ="row">
            <div className="col-md-9">
              <h3>{this.state.deck.deckname} - {this.state.deck.legality}</h3>
            </div>
            <div className="col-md-3">
              <button className="btn btn-lg btn-signin btn-primary btn-block" onClick={this.handleEdit.bind(this, this.state.deck)}>Edit Deck</button>
            </div>
          </div>
          <hr/>
          <div className="row">
            <div className="col-md-4">
              <h4>Main ({this.state.deck.nb_card_in_main})</h4>
              <hr/>
              <this.DisplayCards board={this.state.deck.main}/>
            </div>
            <div className="col-md-4">
              <h4>Sideboard ({this.state.deck.nb_card_in_sideboard})</h4>
              <hr/>
              <this.DisplayCards board={this.state.deck.sideboard}/>
              </div>
            </div>
        </main>
      </div>
    </div>
    );
  }
}

export default Deck;
