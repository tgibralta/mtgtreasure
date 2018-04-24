import React, { Component } from 'react';
import Sidebar from './../Components/Sidebar'
import userStore from './../Stores/UserStore'
import displayDeckStore from './../Stores/DisplayDeckStore'
import DisplayCardInDeck from './../Components/DisplayCardInDeck'
import {setEditDeck, setImage} from './../Actions/DisplayDeckAction'
import Gallery from 'react-grid-gallery'
import configuration from './../config/Config'

class Deck extends Component {
  constructor (props) {
    super(props)
    this.state = {
      user: userStore.getUser(),
      deck: displayDeckStore.getDeck(),
      activeImage: displayDeckStore.getImage()
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
    displayDeckStore.on('changeImage', () => {
      this.setState({
        activeImage: displayDeckStore.getImage()
      })
    })
  }

  handleClick (imageGallery) {
    setImage(imageGallery)
    .then(() => {
      console.log('Image Properly set')
    })
    .catch((err) => {
      console.log(`Error when setting image: ${err}`)
    })
  }

  DisplayCards (props) {
    let board = props.board
    let isMain = props.isMain
    if (isMain) {
      let Display_elements = []
      let enableLand = 0
      let enablePlaneswalker = 0
      let enableSpell = 0
      let enableCreature = 0
      let listComponentsLand = board.map((card) => {
        let type = card.type.split(' ')
        console.log(`words in type: ${JSON.stringify(type)}`)
        let typeIsLand = 0
        type.forEach((typeCard) => {
          if (typeCard.toLowerCase() === 'land') {
            typeIsLand = 1
            console.log(`It's a Land`)
          }
        })
        if (typeIsLand) {
          let image = card.uri
          let number = card.number
          let name = card.name
          let manacost = card.manaCost
          let price = card.price
          let imageGallery = [{
            src: image,
            thumbnail: image,
            thumbnailWidth: configuration.IMAGE.FULLCARD.LARGE.WIDTH,
            thumbnailHeight: configuration.IMAGE.FULLCARD.LARGE.HEIGHT
          }]
          return <DisplayCardInDeck image={imageGallery} number={number} name={name} manacost= {manacost} price={price} handleClick={props.handleClick.bind(this,imageGallery)}/>
        }
      })

      let listComponentsCreature = board.map((card) => {
        let type = card.type.split(' ')
        let typeIsCreature = 0
        console.log(`words in type: ${JSON.stringify(type)}`)
        type.forEach((typeCard) => {
          if (typeCard.toLowerCase() === 'creature') {
            console.log(`It's a Creature`)
            typeIsCreature = 1
          }
        })
        if (typeIsCreature) {
          let image = card.uri
          let number = card.number
          let name = card.name
          let manacost = card.manaCost
          let price = card.price
          let imageGallery = [{
            src: image,
            thumbnail: image,
            thumbnailWidth: configuration.IMAGE.FULLCARD.LARGE.WIDTH,
            thumbnailHeight: configuration.IMAGE.FULLCARD.LARGE.HEIGHT
          }]
          return <DisplayCardInDeck image={imageGallery} number={number} name={name} manacost= {manacost} price={price} handleClick={props.handleClick.bind(this,imageGallery)}/>
        }
      })

      let listComponentsPlaneswalker = board.map((card) => {
        let type = card.type.split(' ')
        console.log(`words in type: ${JSON.stringify(type)}`)
        let typeIsPlaneswalker = 0
        type.forEach((typeCard) => {
          if (typeCard.toLowerCase() === 'planeswalker') {
            console.log(`It's a Planeswalker`)
            typeIsPlaneswalker = 1
          }
        })
        if (typeIsPlaneswalker) {
          let image = card.uri
          let number = card.number
          let name = card.name
          let manacost = card.manaCost
          let price = card.price
          let imageGallery = [{
            src: image,
            thumbnail: image,
            thumbnailWidth: configuration.IMAGE.FULLCARD.LARGE.WIDTH,
            thumbnailHeight: configuration.IMAGE.FULLCARD.LARGE.HEIGHT
          }]
          return <DisplayCardInDeck image={imageGallery} number={number} name={name} manacost= {manacost} price={price} handleClick={props.handleClick.bind(this,imageGallery)}/>
        }
      })

      let listComponentsElse = board.map((card) => {
        let type = card.type.split(' ')
        console.log(`words in type: ${JSON.stringify(type)}`)
        let typeIsElse = 1
        type.forEach((typeCard) => {
          if (typeCard.toLowerCase() === 'planeswalker' | typeCard.toLowerCase() === 'creature' | typeCard.toLowerCase() === 'land') {
            console.log(`It's not a Spell`)
            typeIsElse = 0
          }
        })
        if (typeIsElse) {
          let image = card.uri
          let number = card.number
          let name = card.name
          let manacost = card.manaCost
          let price = card.price
          let imageGallery = [{
            src: image,
            thumbnail: image,
            thumbnailWidth: configuration.IMAGE.FULLCARD.LARGE.WIDTH,
            thumbnailHeight: configuration.IMAGE.FULLCARD.LARGE.HEIGHT
          }]
          return <DisplayCardInDeck image={imageGallery} number={number} name={name} manacost= {manacost} price={price} handleClick={props.handleClick.bind(this,imageGallery)}/>
        }
      })

      if (listComponentsCreature.length !== 0) {
        Display_elements.push(<p className="font-weight-bold text-uppercase">Creatures</p>)
        Display_elements.push(listComponentsCreature)
      }
      if (listComponentsPlaneswalker.length !== 0) {
        Display_elements.push(<p className="font-weight-bold text-uppercase">Planewalkers</p>)
        Display_elements.push(listComponentsPlaneswalker)
      }
      if (listComponentsElse.length !== 0) {
        Display_elements.push(<p className="font-weight-bold text-uppercase">Spells</p>)
        Display_elements.push(listComponentsElse)
      }
      if (listComponentsLand.length !== 0) {
        Display_elements.push(<p className="font-weight-bold text-uppercase">Lands</p>)
        Display_elements.push(listComponentsLand)
      }
      return Display_elements
    } else {
      let Display_elements = board.map((card) => {
        let image = card.uri
        let number = card.number
        let name = card.name
        let manacost = card.manaCost
        let price = card.price
        let imageGallery = [{
          src: image,
          thumbnail: image,
          thumbnailWidth: configuration.IMAGE.FULLCARD.LARGE.WIDTH,
          thumbnailHeight: configuration.IMAGE.FULLCARD.LARGE.HEIGHT
        }]
        return <DisplayCardInDeck image={imageGallery} number={number} name={name} manacost= {manacost} price={price} handleClick={props.handleClick.bind(this,imageGallery)}/>
      })
      return Display_elements
    }
    
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
              <h3>{this.state.deck.deckname} - {this.state.deck.legality} - {this.state.deck.price} $</h3>
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
              <this.DisplayCards board={this.state.deck.main} isMain={true} handleClick={this.handleClick.bind(this)}/>
            </div>
            <div className="col-md-4">
              <h4>Sideboard ({this.state.deck.nb_card_in_sideboard})</h4>
              <hr/>
              <this.DisplayCards board={this.state.deck.sideboard} isMain={false} handleClick={this.handleClick.bind(this)}/>
            </div>
            <div className="col-md-4">
              <h4>Info</h4>
              <hr/>
              <div className="text-center pagination-centered">
                <Gallery images={this.state.activeImage} rowHeight={configuration.IMAGE.FULLCARD.SMALL.WIDTH}/>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
    );
  }
}

export default Deck;
