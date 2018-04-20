import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom'
import DashboardPage from './Dashboard'
import CollectionPage from './Collection'
import DecksPage from './Decks'
import DeckPage from './Deck'
import OptionsPage from './Options'
import NotFoundPage from './NotFound'
import CreateDeckPage from './CreateDeck'

class User extends Component {
  render() {
    console.log(this.props.match)
    return (
      <div>
        <Switch>
          <Route exact path={`${this.props.match.url}/`} component={DashboardPage}/>
          <Route exact path={`${this.props.match.url}/collection`} component={CollectionPage}/>
          <Route exact path={`${this.props.match.url}/decks`} component={DecksPage}/>
          <Route exact path={`${this.props.match.url}/createdeck`} component={CreateDeckPage}/>
          <Route exact path={`${this.props.match.url}/deck/:deckid`} component={DeckPage}/>
          <Route exact path={`${this.props.match.url}/options`} component={OptionsPage}/>
          <Route exact path='*' component={NotFoundPage}/>
        </Switch>
      </div>
    )
  }
}

export default User;