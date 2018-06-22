import React, { Component } from 'react';
import userStore from './../Stores/UserStore'
import resultSearchStore from './../Stores/ResultSearchStore'
import TableCollection from './../Components/TableCollection'
import PanelCollection from './../Components/PanelCollection'
import configuration from './../config/Config'
import Navbar from './../Components/Navbar'
import * as AccountActions from './../Actions/AccountAction'
import {RedirectNavbar} from './../Functions/RedirectNavbar'




class Collection extends Component {
  constructor () {
    super()
    this.state = {
      user: userStore.getUser(),
      result: resultSearchStore.getResults(),
      isLoggedIn: userStore.getIsLoggedIn()
    }
  }

  goToAddCard() {
    console.log(`Add to collection button clicked.`)
    this.props.history.push(`/user/${this.state.user.username}/addcard/2`)
  }

  

  componentWillMount () {
    userStore.on('change', () => {
      this.setState({
        user: userStore.getUser(),
        isLoggedIn: userStore.getIsLoggedIn()
      })
    })
    resultSearchStore.on('change', () => {
      this.setState({
        result: resultSearchStore.getResults()
      })
    })
  }

  

  Logout() {
    AccountActions.SignoutUser()
    this.props.history.push(`/`)
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


  render() {
    return (
      <div>
        <div className="jumbotron jumbotron-dashboard">
          <Navbar isLoggedIn={this.state.isLoggedIn} username={this.state.user.username} Logout={this.Logout.bind(this)} Redirect={RedirectNavbar} history={this.props.history}/>
          <div className="container container-text-jumbo">
            <h4 className="text-center text-title-jumbo">COLLECTION</h4>
          </div>
        </div>
        <div className="container">
          <PanelCollection user={this.state.user}/>
          <hr/>
          <button className="btn btn-lg btn-signin  btn-primary btn-block my-2 my-sm-0" type="submit" onClick={this.goToAddCard.bind(this)}>ADD NEW CARD</button>
          <hr/>
          <TableCollection collection={this.state.user.collection} history={this.state.user.history}/>
          
          
        </div>
      </div>
      
    //   <div className="container-fluid">
    //   <div className="row">
    //     <div className="col-md-2 no-float">
    //       <Sidebar username={this.state.user.username}/>
    //     </div>
    //     <main role="main" className="col-md-9 ml-sm-auto col-lg-10 pt-3 px-4">
    //       {/* <PanelCollection initialInvestment={this.state.user.initialInvestment} currentValue={this.state.user.currentValue} nbCard={this.state.user.nbCardInCollection}/> */}
    //       <this.CreateDataChartHistoryUser user={this.state.user} />
    //       <hr/>
    //       <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-2 mb-3 ">
    //         <input className="form-control mr-sm-2" id="inputSearch" placeholder="Search for a card to add to your collection" type="text"/>
    //         <button className="btn btn-lg btn-signin  btn-primary btn-block my-2 my-sm-0" type="submit" onClick={this.handleSearch.bind(this)}>Search</button>
    //       </div>
    //       <div className="jumbotron">
    //         <div className="container">
    //           <this.CreateCardDisplayElements results={this.state.result} user={this.state.user}/>
    //         </div>
    //       </div>
    //       <TableCollection collection={this.state.user.collection} history={this.state.user.history}/>
    //     </main>
    //   </div>
    // </div>
    )
  }
}

export default Collection;
