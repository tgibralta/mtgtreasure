
import DeckDisplay from './../Components/DeckDisplay'
import React, { Component } from 'react'

export function CreateDeckDisplay(props) {
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
      return <DeckDisplay imageDeck={imageGallery} deckname={deckName} nbMain={nbMain} nbSideboard={nbSideboard} 
      legality={legality} delete={props.delete.bind(this, user.userID, deckName)}
      goTo={props.goTo.bind(this, deck)}/>
    })
    return listComponents
  } else {
    return (<p>No deck created. Create a new deck?</p>)
  }
}