import React, { Component } from 'react';
import userStore from './../Stores/UserStore'
import resultSearchStore from './../Stores/ResultSearchStore'
import TableCollection from './../Components/TableCollection'
import Sidebar from './../Components/Sidebar'
import SearchCardDisplay from './../Components/SearchCardDisplay'
import PanelCollection from './../Components/PanelCollection'
import configuration from './../config/Config'

const SearchCardPerName = require('./../Actions/SearchAction').SearchCardPerName

class Collection extends Component {
  constructor () {
    super()
    this.state = {
      user: userStore.getUser(),
      result: resultSearchStore.getResults()
    }
  }

  CreateCardDisplayElements (props) {
    if (props.results) {
      let results = props.results
      let user = props.user
      // console.log(`result in createDisplay: ${JSON.stringify(results)}`)
      let listComponents = results.map((result) => {
        if (result.cardInfo.image_uris) {
          let imageGallery = [{
            src: result.cardInfo.image_uris.large,
            thumbnail: result.cardInfo.image_uris.large,
            thumbnailWidth: configuration.IMAGE.FULLCARD.MEDIUM.WIDTH,
            thumbnailHeight: configuration.IMAGE.FULLCARD.LARGE.HEIGHT
          }]
          // console.log(`Image to be displayed: ${JSON.stringify(imageGallery)}`)
          let labels = result.priceHistory.priceHistory.map(function(x) {
            return x.date
          })
          let data = result.priceHistory.priceHistory.map(function(x) {
            return x.price
          })
          let chartData = {
            labels: labels,
            datasets: [
              {
                borderColor: '#e74c3c',
                label: 'Price History',
                data: data
              }
            ]
          }
          console.log(`Data sent to graph: ${JSON.stringify(chartData)}`)
          return <SearchCardDisplay imageGallery={imageGallery}  infoCardGallery={result.cardInfo} user={user} chartData={chartData}/>
        } else {
          let imageGallery = [{
            src: "https://magic.wizards.com/sites/mtg/files/image_legacy_migration/magic/images/mtgcom/fcpics/making/mr224_back.jpg",
            thumbnail: "https://magic.wizards.com/sites/mtg/files/image_legacy_migration/magic/images/mtgcom/fcpics/making/mr224_back.jpg",
            thumbnailWidth: configuration.IMAGE.FULLCARD.MEDIUM.WIDTH,
            thumbnailHeight: configuration.IMAGE.FULLCARD.MEDIUM.HEIGHT
          }]
          let listComponents = <SearchCardDisplay imageGallery={imageGallery}  infoCardGallery={result} user={user}/>
        }      
      })
      return listComponents
    } else {
      return ('No results found')
    }
  }

  componentWillMount () {
    userStore.on('change', () => {
      this.setState({
        user: userStore.getUser()
      })
    })
    resultSearchStore.on('change', () => {
      this.setState({
        result: resultSearchStore.getResults()
      })
    })
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
          <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-2 mb-3 ">
            <input className="form-control mr-sm-2" id="inputSearch" placeholder="Search for a card to add to your collection" type="text"/>
            <button className="btn btn-lg btn-signin  btn-primary btn-block my-2 my-sm-0" type="submit" onClick={this.handleSearch.bind(this)}>Search</button>
          </div>
          <div className="jumbotron">
            <div className="container">
              <this.CreateCardDisplayElements results={this.state.result} user={this.state.user}/>
            </div>
          </div>
          <TableCollection collection={this.state.user.collection}/>
        </main>
      </div>
    </div>
    )
  }
}

export default Collection;
