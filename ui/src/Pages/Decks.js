import React, { Component } from 'react'
import Sidebar from './../Components/Sidebar'
import userStore from './../Stores/UserStore'
import DeckDisplay from './../Components/DeckDisplay'

class Decks extends Component {
  constructor () {
    super()
    this.state = {
      decks : userStore.getDecks()
    }
  }
  componentWillMount () {
    userStore.on('change', () => {
      this.setState({
        decks: userStore.getDecks()
      }) 
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
          <h2>Decks</h2>
          <hr/>
          <DeckDisplay />
        </main>
      </div>
    </div>
    );
  }
}

export default Decks;
