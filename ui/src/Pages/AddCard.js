import React, { Component } from 'react'
import Navbar from './../Components/Navbar'
import userStore from './../Stores/UserStore'
import resultSearchStore from './../Stores/ResultSearchStore'
import * as AccountActions from './../Actions/AccountAction'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import SearchCardDisplay from './../Components/SearchCardDisplay'
import 'react-tabs/style/react-tabs.css'
import {RedirectNavbar} from './../Functions/RedirectNavbar'
import Loader from 'react-loader'
import Alert from 'react-s-alert'
import 'react-s-alert/dist/s-alert-default.css'
import 'react-s-alert/dist/s-alert-css-effects/slide.css'
import Footer from './../Components/Footer'

const SearchCardPerName = require('./../Actions/SearchAction').SearchCardPerName

class AddCard extends Component {

  constructor () {
    super()
    this.state = {
      user: userStore.getUser(),
      result: resultSearchStore.getResults(),
      isLoggedIn: userStore.getIsLoggedIn(),
      loaded: true,
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
          return <SearchCardDisplay imageGallery={imageGallery}  infoCardGallery={result.cardInfo} user={user} chartData={chartData} trend={trend}/>
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
    if (cardName === '') {
      Alert.error('Empty search', {
          position: 'bottom-right',
          effect: 'slide',
          beep: false,
          timeout: 2000,
          offset: 100,
          html: true
      })
    } else {
      this.setState({
        loaded: false
      })
      SearchCardPerName(cardName)
      .then(() => {
        this.setState({
          loaded: true
        })
      })
      .catch((err) => {
        console.log(err)
        this.setState({
          loaded: true
        })
        Alert.error('Error: no card to display', {
          position: 'bottom-right',
          effect: 'slide',
          beep: false,
          timeout: 2000,
          offset: 100,
          html: true
        })
      })
    }
    
  }
    Logout() {
    AccountActions.SignoutUser()
    this.props.history.push(`/`)
  }

  Back (user) {
    let username = user.username
    this.props.history.push(`/user/${username}/collection/`)
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
          <Alert stack={{limit: 3}} />
            <div className="row">
              <div className="col-md-8 col-sm-8">
                <input className="form-control mr-sm-2" id="inputSearch" placeholder="Search for a card to add to your collection" type="text"/>
              </div>
              <div className="col-md-2 col-sm-2">
                <button className="btn btn-lg btn-signin  btn-primary btn-block" type="submit" onClick={this.handleSearch.bind(this)}>Search</button>
              </div>
              <div className="col-md-2 col-sm-2">
                <button className="btn btn-lg btn-signin  btn-primary  btn-block" type="submit" onClick={this.Back.bind(this, this.state.user)}>Back</button>
              </div>
          </div>
          <hr/>
          <Loader loaded={this.state.loaded} className="loader-spinner">
            <div className="jumbotron">
              <div className="container">
                <this.CreateCardDisplayElements results={this.state.result} user={this.state.user}/>
              </div>
            </div>
          </Loader>
        </div>
      </div>
    );
  }
}

export default AddCard;