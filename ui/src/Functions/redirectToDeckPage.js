const SetDeck = require('./../Actions/DisplayDeckAction').SetDeck

export function redirectToDeckPage (deck) {
  console.log(`Redirect called: DECK ${JSON.stringify(deck)}`)
    SetDeck(deck)
    .then(() => {
      this.props.history.push(`/user/${this.state.user.username}/deck/${deck.deckname}`)
    })
    .catch((err) => {
      console.log(`Error when trying to redirect: ${err}`)
    })
  }