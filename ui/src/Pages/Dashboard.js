import React, { Component } from 'react';
import userStore from './../Stores/UserStore'
import Navbar from './../Components/Navbar'
import './Style/Dashboard.css'
import PanelCollection from './../Components/PanelCollection'
import {CreateDeckDisplay} from './../Functions/CreateDeckDisplay'
import {redirectToDeckPage} from './../Functions/redirectToDeckPage'
import {RedirectNavbar} from './../Functions/RedirectNavbar'
import ElementTop5 from './../Components/ElementTop5'
import * as AccountActions from './../Actions/AccountAction'
import Footer from './../Components/Footer'
import Top10Component from './../Components/Top10Component'
import Popup from 'reactjs-popup'
import ChartPriceHistory from './../Components/ChartPriceHistory'
const DeleteDeck = require('./../Actions/AccountAction').DeleteDeck


class Dashboard extends Component {
  constructor () {
    super()
    this.state = {
      user : userStore.getUser(),
      isLoggedIn: userStore.getIsLoggedIn(),
      top10: userStore.getTop10(),
      openPopup : false,
      popupContent: <p>Test</p>
    }
  }
  componentWillMount () {
    userStore.on('change', () => {
      console.log(`Dashboard - change emitted. new user: ${JSON.stringify(userStore.getUser())}`)
      this.setState({
        user: userStore.getUser(),
        isLoggedIn: userStore.getIsLoggedIn(),
        top10: userStore.getTop10()
      })
    })
  }

  createChartData(trend) {
    let labels = trend.priceHistory.priceHistory.map(function(x, index) {
      let splitDate = x.date.split("/")
        return splitDate[1]
    })
    let data = trend.priceHistory.priceHistory.map(function(x) {
      return x.price
    })
    let chartData = {
      labels: labels,
      datasets: [
        {
          borderColor: '#154360',
          label: '$',
          data: data,
          display: false,
        }
      ]
    }
    return chartData
  }

  setupPopup(elementTop10) {
    console.log(`State when starting setupPopup: ${JSON.stringify(this.state)}`)
    let name=elementTop10.Scryfall.name
    let uri=elementTop10.Scryfall.image_uris.large
    let price=elementTop10.Scryfall.usd
    let chartData=this.createChartData(elementTop10)
    let trend=elementTop10.trend
    let initPrice = elementTop10.Scryfall.usd
    this.setState ({
      popupContent: <div>
          <div className="card border-primary mb-3 card-search">
            <div className="row">
              <div className="col-md-4 col-lg-4">
                <img className="img-popup img-center" alt="card-thumbnail" src={uri}/>
              </div>
               <div className="col-md-8 col-lg-8">
                <ChartPriceHistory chartData={chartData}/>
              </div> 
            </div>
            <hr/>
            <div className="row">
              <div className="col-md-4 col-lg-4">
                <h4><i className="fas fa-money-bill-alt icon-dashboard fa-2x"></i> : {initPrice} $</h4>
              </div>
              <div className="col-md-4 col-lg-4">
                <h4><i className="fas fa-dollar-sign icon-dashboard fa-2x"></i> : {price} $</h4>
              </div>
              <div className="col-md-4 col-lg-4">
                <h4><i className="fas fa-chart-line icon-dashboard fa-2x"></i> : {trend} %</h4>
              </div>
            </div>
          </div>
        </div>,
      openPopup: true
    })
    console.log(`State after starting setupPopup: ${JSON.stringify(this.state)}`)
  }

  closePopup () {
    this.setState({
      openPopup : false,
      popupContent: <p>Test</p>
    })
    console.log(`State after closing Popup: ${JSON.stringify(this.state)}`)
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
    let top5Display = top5.map((element, index) => {
      console.log(`card in top5: ${JSON.stringify(element)}`)
      return(<ElementTop5 card={element} key={index}/>)
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
    let top5Display = top5.map((element, index) => {
      // console.log(`card in top5: ${JSON.stringify(element)}`)
      return(<ElementTop5 card={element} key={index}/>)
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
          <Navbar isLoggedIn={this.state.isLoggedIn} username={this.state.user.username} Logout={this.Logout.bind(this)} Redirect={RedirectNavbar} history={this.props.history}/>
          <div className="container container-text-jumbo">
            <h4 className="text-center text-title-jumbo">DASHBOARD</h4>
          </div>
        </div>
        <Top10Component className="top10" trends={this.state.top10} popup={this.setupPopup.bind(this)}/>
      <div className="container">
        <Popup trigger={<p></p>} position="right center" modal open={this.state.openPopup} children={this.state.popupContent} onClose={this.closePopup.bind(this)}/>
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
              <h2 className="display-4 "><strong className="text-white">DECKS</strong></h2>
            </div>
            <div className="col-md-2">
              <button type="button" className="btn btn-lg btn-block btn-primary btn-white" onClick={this.handleClickDecks.bind(this)}> View </button>
            </div>
          </div>
          <hr className="hr-white"/>
          <div className = "row">
            <CreateDeckDisplay decks={this.state.user.decks} user={this.state.user} delete={this.handleDeleteDeck.bind(this)} goTo={redirectToDeckPage.bind(this)}/>
          </div>
        </div>
      </div>
    </div>
    )
  }
}

export default Dashboard;
