import React, { Component } from 'react';
import userStore from './../Stores/UserStore'
import TableCollection from './../Components/TableCollection'
import Footer from './../Components/Footer'
import Sidebar from './../Components/Sidebar'
import './Style/Dashboard.css'
import PanelCollection from './../Components/PanelCollection'
import DeckDisplay from './../Components/DeckDisplay'
import {CreateDeckDisplay} from './../Functions/CreateDeckDisplay'
import {redirectToDeckPage} from './../Functions/redirectToDeckPage'
import ChartPriceHistory from './../Components/ChartPriceHistory'
const DeleteDeck = require('./../Actions/AccountAction').DeleteDeck

class Dashboard extends Component {
  constructor () {
    super()
    this.state = {
      user : userStore.getUser()
    }
  }
  componentWillMount () {
    userStore.on('change', () => {
      this.setState({
        user: userStore.getUser()
      })
    })
  }

  
  handleClickNewDeck () {
    this.props.history.push(`/user/${this.state.user.username}/createdeck`)
  }

  handleDeleteDeck(userID, deckID) {
    // console.log(`Delete trigger in Dashboard`)
    DeleteDeck(userID, deckID)
    .then(() => {
      console.log(`Deck deleted`)
    })
    .catch((err) => {
      console.log(`Error while deleting Deck`)
    })
  }

  CreateDataChartHistoryUser (props) {
    let history = props.user.history
    let investment = props.user.initialInvestment
    let currentValue = props.user.currentValue
    let currentNbCard = props.user.nbCardInCollection
    console.log(`History: ${JSON.stringify(history)}`)
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

  
  render() {
    return (
      <div className="container-fluid">
      <div className="row">
        <div className="col-md-2 no-float">
          <Sidebar username={this.state.user.username}/>
        </div>
        <main role="main" className="col-md-9 ml-sm-auto col-lg-10 pt-3 px-4">
          
          {/* <PanelCollection initialInvestment={this.state.user.initialInvestment} currentValue={this.state.user.currentValue} nbCard={this.state.user.nbCardInCollection}/> */}
          <this.CreateDataChartHistoryUser user={this.state.user} />
          <hr/>
          <div className='row'>
            <div className="col-md-2">
              <h2>Decks</h2>
            </div>
            <div className="col-md-3">
              <button className="btn btn-lg btn-signin btn-primary btn-block" onClick={this.handleClickNewDeck.bind(this)}>New Deck</button>
            </div>
          </div>
          <hr/>
          <CreateDeckDisplay decks={this.state.user.decks} user={this.state.user} delete={this.handleDeleteDeck.bind(this)} goTo={redirectToDeckPage.bind(this)}/>
        </main>
      </div>
    </div>
    )
  }
}

export default Dashboard;
