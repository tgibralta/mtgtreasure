import React, { Component } from 'react'
import Navbar from './../Components/Navbar'
import userStore from './../Stores/UserStore'
import resultSearchStore from './../Stores/ResultSearchStore'
import * as AccountActions from './../Actions/AccountAction'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import SearchCardDisplay from './../Components/SearchCardDisplay'
import 'react-tabs/style/react-tabs.css'
import {RedirectNavbar} from './../Functions/RedirectNavbar'

const SearchCardPerName = require('./../Actions/SearchAction').SearchCardPerName

class AddCard extends Component {

  constructor () {
    super()
    this.state = {
      user: userStore.getUser(),
      result: resultSearchStore.getResults(),
      isLoggedIn: userStore.getIsLoggedIn(),
    }
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

  CreateCardDisplayElements (props) {
    if (props.results) {
      let results = props.results
      let user = props.user
      // console.log(`result in createDisplay: ${JSON.stringify(results)}`)
      let listComponents = results.map((result, index) => {
        console.log(`Generating SearchCardDisplay for index ${index}`)
        if (result.cardInfo.image_uris && result.cardInfo.image_uris.large) {
          let imageGallery = result.cardInfo.image_uris.large
          let history = result.priceHistory.priceHistory
          let lengthhistory = history.length - 1
          let labels = history.map(function(x, index) {
            let splitDate = x.date.split("/")
            return splitDate[1]
          })
          let data = history.map(function(x) {
            return x.price
          })
          let trend = 0
          if (history[lengthhistory - 1].price !== 0) {
            trend = Math.ceil(100* (history[lengthhistory].price - history[lengthhistory - 1].price) / history[lengthhistory - 1].price)
          }
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
          return <SearchCardDisplay imageGallery={imageGallery}  infoCardGallery={result.cardInfo} user={user} chartData={chartData} trend={trend}/>// goToAddCard={props.goToAddCard.bind(this)}/>
        } else {
          return (<h3>Error display</h3>)
        }      
      })
      let lengthModulo3 = Math.ceil(listComponents.length/3)
      let heightGrid = new Array(lengthModulo3)
      heightGrid.fill(0)
      let listTab = heightGrid.map((element, index) => {
        let indexPage = index + 1
        return(
          <Tab>{indexPage}</Tab>  
        )
      })
      console.log(`Number Tabs: ${JSON.stringify(heightGrid.length)}`)
      let GridCards = heightGrid.map((element, index) => {
        return (
          <TabPanel>
            <div className="row">
              <div className="col-md-4 col-lg-4">
                {listComponents[3 * index]}
              </div>
              <div className="col-md-4 col-lg-4">
                {listComponents[3 * index + 1]}
              </div>
              <div className="col-md-4 col-lg-4">
                {listComponents[3 * index + 2]}
              </div>
            </div>
          </TabPanel>
        )
      })
      console.log(`Number Panels: ${GridCards.length}`)
      return (
        <Tabs>
          <TabList>
            {listTab}
          </TabList>
          {GridCards}
        </Tabs>
      )
    } else {
      return (
        <Tabs>
          <TabList>
            <Tab>0</Tab>
          </TabList>
          <TabPanel>
            <h3>No result found</h3>
          </TabPanel>
        </Tabs>
      )
    }
  }

  handleSearch () {
    let cardName = document.getElementById('inputSearch').value
    SearchCardPerName(cardName)
    .then(() => {
      // console.log(`Results of the search returned from Action`)
    })
    .catch((err) => {
      console.log(err)
    })
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
            <h4 className="text-center text-title-jumbo">ADD CARD</h4>
          </div>
        </div>
        <div className="container">
          <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-2 mb-3 ">
            <input className="form-control mr-sm-2" id="inputSearch" placeholder="Search for a card to add to your collection" type="text"/>
            <button className="btn btn-lg btn-signin  btn-primary btn-block my-2 my-sm-0" type="submit" onClick={this.handleSearch.bind(this)}><i class="fas fa-search"></i></button>
          </div>
          <div className="jumbotron">
            <div className="container">
              <this.CreateCardDisplayElements results={this.state.result} user={this.state.user}/>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default AddCard;