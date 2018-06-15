import React, { Component } from 'react';
import userStore from './../Stores/UserStore'
import TableCollection from './../Components/TableCollection'
import Footer from './../Components/Footer'
import Sidebar from './../Components/Sidebar'
import Navbar from './../Components/Navbar'
import './Style/Dashboard.css'
import PanelCollection from './../Components/PanelCollection'
import DeckDisplay from './../Components/DeckDisplay'
import {CreateDeckDisplay} from './../Functions/CreateDeckDisplay'
import {redirectToDeckPage} from './../Functions/redirectToDeckPage'
import ChartPriceHistory from './../Components/ChartPriceHistory'
import ElementTop5 from './../Components/ElementTop5'
import * as AccountActions from './../Actions/AccountAction'
const DeleteDeck = require('./../Actions/AccountAction').DeleteDeck


class Dashboard extends Component {
  constructor () {
    super()
    this.state = {
      user : userStore.getUser(),
      isLoggedIn: userStore.getIsLoggedIn()
    }
  }
  componentWillMount () {
    userStore.on('change', () => {
      console.log(`Dashboard - change emitted. new user: ${JSON.stringify(userStore.getUser())}`)
      this.setState({
        user: userStore.getUser(),
        isLoggedIn: userStore.getIsLoggedIn()
      })
    })
  }

  
  handleClickNewDeck () {
    this.props.history.push(`/user/${this.state.user.username}/createdeck`)
  }

  handleClickDecks () {
    this.props.history.push(`/user/${this.state.user.username}/decks`)
  }

  handleClickCollection () {
    // console.log(`Go to collection clicked. Username: ${this.state.user.username}`)
    this.props.history.push(`/user/${this.state.user.username}/collection`)
  }

  handleDeleteDeck(userID, deckID) {
    // console.log(`Delete trigger in Dashboard`)
    DeleteDeck(userID, deckID)
    .then(() => {
      // console.log(`Deck deleted`)
    })
    .catch((err) => {
      // console.log(`Error while deleting Deck`)
    })
  }

  CreateDataChartHistoryUser (props) {
    let history = props.user.history
    let investment = props.user.initialInvestment
    let currentValue = props.user.currentValue
    let currentNbCard = props.user.nbCardInCollection
    // console.log(`History: ${JSON.stringify(history)}`)
    let labels = history.map(function(x) {
      return x.date
    })
    let dataInvestment = history.map(function(x) {
      return x.investment
    })
    let dataValue = history.map(function(x) {
      return x.value_collection
    })
    let dataNbCard = history.map(function(x) {
      return x.nb_card
    })
    let dataProfit = history.map(function(x) {
      return x.potential_profit
    })
    let chartDataInvestment = {
      labels: labels,
      datasets: [
        {
          borderColor: '#154360',
          label: 'Investment ($)',
          data: dataInvestment,
          fill: false,
        }
      ]
    }
    let chartDataValue = {
      labels: labels,
      datasets: [
        {
          borderColor: '#154360',
          label: 'Value ($)',
          data: dataValue,
          fill: false,
        }
      ]
    }
    let chartDataNbCard = {
      labels: labels,
      datasets: [
        {
          borderColor: '#154360',
          label: '# Card',
          data: dataNbCard,
          fill: false,
        }
      ]
    }
    
    return (<PanelCollection initialInvestment={investment} currentValue={currentValue} nbCard={currentNbCard} chartDataInvestment={chartDataInvestment} chartDataValue={chartDataValue} chartDataNbCard={chartDataNbCard}/>)
  }

  CreateTop5PriceIncrease(props) {
    let collection = props.collection
    // console.log(`COLLECTION: ${JSON.stringify(collection)}`)
      let top5 = collection.sort(function(a, b) {
      let trendA = a.trend
      let trendB = b.trend
      return trendA<trendB ? 1 : trendA>trendB ? -1 : 0
    }).slice(0,4)
    // return (<TableCollection collection={top5}/>)
    let top5Display = top5.map((element) => {
      // console.log(`card in top5: ${JSON.stringify(element)}`)
      return(<ElementTop5 card={element}/>)
    })
    return top5Display
  }

  CreateTop5PriceDecrease(props) {
    let collection = props.collection
    // console.log(`COLLECTION: ${JSON.stringify(collection)}`)
    let top5 = collection.sort(function(a, b) {
      let trendA = a.trend
      let trendB = b.trend
      return trendA>trendB ? 1 : trendA<trendB ? -1 : 0
    }).slice(0,4)
    // return (<TableCollection collection={top5}/>)
    let top5Display = top5.map((element) => {
      // console.log(`card in top5: ${JSON.stringify(element)}`)
      return(<ElementTop5 card={element}/>)
    })
    return top5Display
  }

  Logout() {
    AccountActions.SignoutUser()
    this.props.history.push(`/`)
  }

  
  render() {
    return (
      <div>
        <div className="jumbotron jumbotron-dashboard">
          <Navbar isLoggedIn={this.state.isLoggedIn} username={this.state.user.username} Logout={this.Logout.bind(this)}/>
          <div className="container container-text-jumbo">
            <h4 className="text-center text-title-jumbo">DASHBOARD</h4>
          </div>
        </div>
      <div className="container">
        <div className="row">
          <div className="col-md-10">
            <h2 className="display-4 "><strong>COLLECTION SUMMARY</strong></h2>
          </div>
          <div className="col-md-2">
            {/* <button className="fas fa-arrow-circle-right icon-dashboard fa-3x icon-goto" onClick={this.handleClickCollection.bind(this)}></button> */}
            <button type="button" className="btn btn-lg btn-block btn-primary btn-signin" onClick={this.handleClickCollection.bind(this)}> View </button>
          </div>
        </div>
        <hr/>
        <PanelCollection user={this.state.user}/>
        <div className="row">
          <div className="col-md-6 col-sm-6 col-lg-6">
            <div className="card border-primary mb-3 card-dashboard">
              <div className="card-header"><strong>TOP 5</strong></div>
              <div className="card-body">
                <this.CreateTop5PriceIncrease collection={this.state.user.collection}/>
              </div>
            </div>
          </div>
          <div className="col-md-6 col-sm-6  col-lg-6">
            <div className="card border-primary mb-3 card-dashboard icon-goto">
              <div className="card-header"><strong>BOTTOM 5</strong></div>
              <div className="card-body">
                <this.CreateTop5PriceDecrease collection={this.state.user.collection}/>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="jumbotron jumbotron-deck">
        <div className="container">
          <div className="row">
            <div className="col-md-10">
              <h2 className="display-4 "><strong className="text-white">DECK</strong></h2>
            </div>
            <div className="col-md-2">
              <button type="button" className="btn btn-lg btn-block btn-secondary btn-signin" onClick={this.handleClickDecks.bind(this)}> View </button>
            </div>
          </div>
          <hr className="hr-white"/>
        


          <div className="card">
          <img className="card-img-top" src="..." alt="Card image cap"/>
          <div className="card-body">
            <h5 className="card-title">Card title</h5>
            <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
            <a href="#" class="btn btn-primary">Go somewhere</a>
          </div>
        </div>
        </div>
      </div>
        {/* <div className='row'>
          <div className="col-md-2">
            <h2>Decks</h2>
          </div>
          <div className="col-md-3">
            <button className="btn btn-lg btn-signin btn-primary btn-block" onClick={this.handleClickNewDeck.bind(this)}>New Deck</button>
          </div>
        </div>
        <hr/>
        <CreateDeckDisplay decks={this.state.user.decks} user={this.state.user} delete={this.handleDeleteDeck.bind(this)} goTo={redirectToDeckPage.bind(this)}/>
        <hr/>
        <h3>Top 5 Price Increase</h3>
        <this.CreateTop5PriceIncrease collection={this.state.user.collection}/>
        <h3>Top 5 Price Decrease</h3>
        <this.CreateTop5PriceDecrease collection={this.state.user.collection}/>
      </div> */}
      
    </div>
    )
  }
}

export default Dashboard;
