import React, { Component } from 'react';
import userStore from './../Stores/UserStore'
import resultSearchStore from './../Stores/ResultSearchStore'
import TableCollection from './../Components/TableCollection'
import Sidebar from './../Components/Sidebar'
import SearchCardDisplay from './../Components/SearchCardDisplay'
import PanelCollection from './../Components/PanelCollection'

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
      console.log(`result in createDisplay: ${JSON.stringify(results)}`)
      let listComponents = results.map((result) => {
        if (result.image_uris) {
          let imageGallery = [{
                              src: result.image_uris.normal,
                              thumbnail: result.image_uris.normal,
                              thumbnailWidth: 340,
                              thumbnailHeight: 471
                            }]
          console.log(`Image to be displayed: ${JSON.stringify(imageGallery)}`)
          return <SearchCardDisplay imageGallery={imageGallery}  infoCardGallery={result} user={user}/>
        } else {
          let imageGallery = [{
                              src: "https://magic.wizards.com/sites/mtg/files/image_legacy_migration/magic/images/mtgcom/fcpics/making/mr224_back.jpg",
                              thumbnail: "https://magic.wizards.com/sites/mtg/files/image_legacy_migration/magic/images/mtgcom/fcpics/making/mr224_back.jpg",
                              thumbnailWidth: 340,
                              thumbnailHeight: 471
                            }]
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
  }


  render() {
    return (
      <div className="container-fluid">
      <div className="row">
        <div className="col-md-2 no-float">
          <Sidebar username={this.state.user.username}/>
        </div>
        <main role="main" className="col-md-9 ml-sm-auto col-lg-10 pt-3 px-4">
          <PanelCollection initialInvestment={this.state.user.initialInvestment} currentValue={this.state.user.currentValue} nbCard={this.state.user.nbCardInCollection}/>
          <hr/>
          <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-2 mb-3 ">
            <input className="form-control mr-sm-2" id="inputSearch" placeholder="Search for a card to add to your collection" type="text"/>
            <button className="btn btn-primary my-2 my-sm-0" type="submit" onClick={this.handleSearch.bind(this)}>Search</button>
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
