
import DeckDisplay from './../Components/DeckDisplay'
import React from 'react'

export function CreateDeckDisplay(props) {
  if (props.decks) {
    let decks = props.decks
    let user = props.user
    let listComponents = decks.map((deck, index) => {
      let deckName = deck.deckname
      let nbMain = deck.nb_card_in_main
      let nbSideboard = deck.nb_card_in_sideboard
      let legality = deck.legality
      let imageDeck = deck.thumbnail
      return (
        <div className="col-md-3 col-sm-3 col-lg-3"  key={index}>
          <DeckDisplay imageDeck={imageDeck} deckname={deckName} nbMain={nbMain} nbSideboard={nbSideboard} 
          legality={legality} delete={props.delete.bind(this, user.userID, deckName)}
          goTo={props.goTo.bind(this, deck)}/>
        </div>)
    })
    return listComponents
  } else {
    return (<p>No deck created. Create a new deck?</p>)
  }
}