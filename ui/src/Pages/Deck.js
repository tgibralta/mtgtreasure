import React, { Component } from 'react'
import userStore from './../Stores/UserStore'
import displayDeckStore from './../Stores/DisplayDeckStore'
import DisplayCardInDeck from './../Components/DisplayCardInDeck'
import {setEditDeck, setImage} from './../Actions/DisplayDeckAction'
import Navbar from './../Components/Navbar'
import * as AccountActions from './../Actions/AccountAction'
import {RedirectNavbar} from './../Functions/RedirectNavbar'
import {Bar, Line} from 'react-chartjs-2'
import ProbData from './../Assets/probLandDrop'
import Footer from './../Components/Footer'


class Deck extends Component {
  constructor (props) {
    super(props)
    this.state = {
      user: userStore.getUser(),
      deck: displayDeckStore.getDeck(),
      activeImage: displayDeckStore.getImage(),
      isLoggedIn: userStore.getIsLoggedIn(),
      top10: userStore.getTop10()
    }
  }

  componentWillMount () {
    userStore.on('change', () => {
      this.setState({
        user: userStore.getUser(),
        isLoggedIn: userStore.getIsLoggedIn(),
        top10: userStore.getTop10()
      })
    })
    displayDeckStore.on('change', () => {
      console.log(`Deck Page - Deck has been updated`)
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

  Logout() {
    AccountActions.SignoutUser()
    this.props.history.push(`/`)
  }

  CreateLineLandDrop(props) {
    let mainBoard = props.mainBoard

    let arrayNbLand = mainBoard.map((card) => {
      let type = card.type.split(' ')
      // console.log(`words in type: ${JSON.stringify(type)}`)
      let typeIsLand = 0
      type.forEach((typeCard) => {
        if (typeCard.toLowerCase() === 'land') {
          typeIsLand = 1
          // console.log(`It's a Land`)
        }
      })
      if (typeIsLand) return card.number
      else return 0
    })

    let nbLand = arrayNbLand.reduce((accumulator, element)=> {
      accumulator = accumulator + element
      return accumulator
    }, 0)

    let indexLand = nbLand - 17

    let labels = [2,3,4,5]
    let dataSetPlay = ProbData.ProbLandDropPlay[indexLand]
    let dataSetDraw = ProbData.ProbLandDropDraw[indexLand]

    console.log(`Nb Land: ${nbLand}`)
    console.log(`Object ProbData: ${JSON.stringify(ProbData)}`)
    console.log(`Prob Play: ${JSON.stringify(dataSetPlay)}`)
    console.log(`Prob Draw: ${JSON.stringify(dataSetDraw)}`)

    let chartData = {
      labels: labels,
      datasets: [
        {
          borderColor: ' #f8c471 ',
          label: 'Play',
          data: dataSetPlay,
          fill: false,
        },
        {
          borderColor: ' #76d7c4',
          label: 'Draw',
          data: dataSetDraw,
          fill: false,
        }
      ]
    }
    return <Line data={chartData} width={100} height={100}/>
  }

  CreateManaFlowProb (props) {
    let mainBoard = props.mainBoard
    let arrayNbLand = mainBoard.map((card) => {
      let type = card.type.split(' ')
      // console.log(`words in type: ${JSON.stringify(type)}`)
      let typeIsLand = 0
      type.forEach((typeCard) => {
        if (typeCard.toLowerCase() === 'land') {
          typeIsLand = 1
          // console.log(`It's a Land`)
        }
      })
      if (typeIsLand) return card.number
      else return 0
    })

    let nbLand = arrayNbLand.reduce((accumulator, element)=> {
      accumulator = accumulator + element
      return accumulator
    }, 0)

    let indexLand = nbLand - 17
    let manaFlow = ProbData.ProbManaFlow[indexLand]

    return (<h3>{manaFlow} %</h3>)
  }

  CreateBarManaCost (props) {
    let mainBoard = props.mainBoard
    let nbCardCMC1 = mainBoard.reduce((accumulator, element) => {
      if (element.cmc === '1') {
        accumulator += 1
      }
      return accumulator
    }, 0)
    let nbCardCMC2 = mainBoard.reduce((accumulator, element) => {
      if (element.cmc === '2') {
        console.log(`CMC: ${element.cmc}`)
        console.log(`Type CMC: ${typeof(element.cmc)}`)
        accumulator += element.number
      }
      console.log(`Accumulator: ${accumulator}`)
      return accumulator
    }, 0)
    let nbCardCMC3 = mainBoard.reduce((accumulator, element) => {
      if (element.cmc === '3') {
        accumulator += element.number
      }
      return accumulator
    }, 0)
    let nbCardCMC4 = mainBoard.reduce((accumulator, element) => {
      if (element.cmc === '4') {
        accumulator += element.number
      }
      return accumulator
    }, 0)
    let nbCardCMC5ORMORE = mainBoard.reduce((accumulator, element) => {
      if (parseInt(element.cmc, 10) >= 5) {
        accumulator += element.number
      }
      return accumulator
    }, 0)

    let labels = ["1","2","3","4","5+"]
    let dataCMC = [nbCardCMC1, nbCardCMC2, nbCardCMC3 ,nbCardCMC4, nbCardCMC5ORMORE]
    console.log(`CMC: ${JSON.stringify(dataCMC)}`)
    let dataBar = {
      labels: labels,
      datasets: [
        {
          label: 'CMC',
          data: dataCMC,
          fill: false,
          backgroundColor: ['#d1f2eb', ' #a3e4d7 ', ' #76d7c4 ', ' #48c9b0 ', '#1abc9c'],
          borderColor: '#117864',
        }
      ]
    }

    return (
      <Bar 
        data={dataBar}
        width={100}
        height={100}
      />
    )
  }

  DisplayCards (props) {
    let board = props.board
    let isMain = props.isMain
    console.log(`Mainboard: ${board}`)
    if (isMain) {
      let Display_elements = []
      let listComponentsLand = board.map((card, index) => {
        let type = card.type.split(' ')
        // console.log(`words in type: ${JSON.stringify(type)}`)
        let typeIsLand = 0
        type.forEach((typeCard) => {
          if (typeCard.toLowerCase() === 'land') {
            typeIsLand = 1
            // console.log(`It's a Land`)
          }
        })
        if (typeIsLand) {
          let number = card.number
          let manacost = card.manaCost
          let price = card.price
          return <DisplayCardInDeck number={number} cardInfo={card} manacost= {manacost} price={price} key={index}/>
        }
      })

      let listComponentsCreature = board.map((card, index) => {
        // console.log(`CARD: ${JSON.stringify(card)}`)
        let type = card.type.split(' ')
        let typeIsCreature = 0
        // console.log(`words in type: ${JSON.stringify(type)}`)
        type.forEach((typeCard) => {
          if (typeCard.toLowerCase() === 'creature') {
            // console.log(`It's a Creature`)
            typeIsCreature = 1
          }
        })
        if (typeIsCreature) {
          let number = card.number
          let manacost = card.manaCost
          let price = card.price
          return <DisplayCardInDeck number={number} cardInfo={card} manacost= {manacost} price={price} key={index}/>
        }
      })

      let listComponentsPlaneswalker = board.map((card, index) => {
        let type = card.type.split(' ')
        // console.log(`words in type: ${JSON.stringify(type)}`)
        let typeIsPlaneswalker = 0
        type.forEach((typeCard) => {
          if (typeCard.toLowerCase() === 'planeswalker') {
            // console.log(`It's a Planeswalker`)
            typeIsPlaneswalker = 1
          }
        })
        if (typeIsPlaneswalker) {
          let number = card.number
          let manacost = card.manaCost
          let price = card.price
          return <DisplayCardInDeck number={number} cardInfo={card} manacost= {manacost} price={price} key={index}/>
        }
      })

      let listComponentsElse = board.map((card, index) => {
        let type = card.type.split(' ')
        // console.log(`words in type: ${JSON.stringify(type)}`)
        let typeIsElse = 1
        type.forEach((typeCard) => {
          if (typeCard.toLowerCase() === 'planeswalker' | typeCard.toLowerCase() === 'creature' | typeCard.toLowerCase() === 'land') {
            // console.log(`It's not a Spell`)
            typeIsElse = 0
          }
        })
        if (typeIsElse) {
          let number = card.number
          let manacost = card.manaCost
          let price = card.price
          return <DisplayCardInDeck number={number} cardInfo={card} manacost= {manacost} price={price} key={index}/>
        }
      })

      if (listComponentsCreature) {
        Display_elements.push(<h3 className="text-left "><strong>Creatures</strong></h3>)
        Display_elements.push(<hr/>)
        Display_elements.push(listComponentsCreature)
      }
      if (listComponentsPlaneswalker) {
        Display_elements.push(<h3 className="text-left"><strong>Planewalkers</strong></h3>)
        Display_elements.push(<hr/>)
        Display_elements.push(listComponentsPlaneswalker)
      }
      if (listComponentsElse) {
        Display_elements.push(<h3 className="text-left"><strong>Spells</strong></h3>)
        Display_elements.push(<hr/>)
        Display_elements.push(listComponentsElse)
      }
      if (listComponentsLand) {
        Display_elements.push(<h3 className="text-left"><strong>Lands</strong></h3>)
        Display_elements.push(<hr/>)
        Display_elements.push(listComponentsLand)
      }
      return Display_elements
    } else {
      let Display_elements = board.map((card, index) => {
        let number = card.number
        let manacost = card.manaCost
        let price = card.price
        return <DisplayCardInDeck number={number} cardInfo={card} manacost= {manacost} price={price} key={index}/>
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

  redirectBack(username) {
    this.props.history.push(`/user/${username}/decks/`)
  }

  render() {
    
    return (
      <div>
        <div className="jumbotron jumbotron-dashboard">
          <Navbar isLoggedIn={this.state.isLoggedIn} username={this.state.user.username} Logout={this.Logout.bind(this)} Redirect={RedirectNavbar} history={this.props.history}/>
          <div className="container container-text-jumbo">
            <h4 className="text-center text-title-jumbo">{this.state.deck.deckname}</h4>
          </div>
        </div>
        <div className="container">
          <div className ="row">
            <div className="col-md-8">
              <h3><strong>Format: {this.state.deck.legality} - {Math.ceil(this.state.deck.price)} $</strong></h3>
            </div>
            <div className="col-md-2">
              <button className="btn btn-lg btn-signin btn-primary btn-block" onClick={this.handleEdit.bind(this, this.state.deck)}>Edit Deck</button>
            </div>
            <div className="col-md-2">
              <button className="btn btn-lg btn-signin btn-primary btn-block" onClick={this.redirectBack.bind(this, this.state.user.username)}>Back</button>
            </div>
          </div>
          <hr/>
          <div className="row">
            <div className="col-md-6">
              <div className="card border-primary mb-3 card-search">
                <div className="card-header card-header-search">Main ({this.state.deck.nb_card_in_main})</div>
                <div className="card-body">
                  <this.DisplayCards board={this.state.deck.main} isMain={true} handleClick={this.handleClick.bind(this)}/>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="card border-primary mb-3 card-search">
                <div className="card-header card-header-search">Sideboard ({this.state.deck.nb_card_in_sideboard})</div>
                <div className="card-body">
                  <this.DisplayCards board={this.state.deck.sideboard} isMain={false} handleClick={this.handleClick.bind(this)}/>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="jumbotron jumbotron-deck">
          <div className="container">
            <h2 className="display-4 "><strong className="text-white">Analysis</strong></h2>
            <hr className="hr-white"/>
            <div className="row">
              <div className="col-md-4 col-lg-4">
                <div className="card border-primary mb-3 card-search">
                  <div className="card-header card-header-search">Converted Mana Cost</div>
                  <this.CreateBarManaCost mainBoard={this.state.deck.main}/> 
                </div>
              </div>
              <div className="col-md-4 col-lg-4">
                <div className="card border-primary mb-3 card-search">
                  <div className="card-header card-header-search">Land Drop probability/Turn</div>
                  <this.CreateLineLandDrop mainBoard={this.state.deck.main}/>
                </div>
              </div>
              <div className="col-md-4 col-lg-4">
                <div className="card border-primary mb-3 card-search">
                  <div className="card-header card-header-search">Mana Flow Probability</div>
                  <this.CreateManaFlowProb mainBoard={this.state.deck.main}/>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Deck;
