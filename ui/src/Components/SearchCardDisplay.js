import React, { Component } from 'react'
import InfoCard from './InfoCard'
import AddToCollection from './AddToCollection'
import Gallery from 'react-grid-gallery'

class SearchCardDisplay extends Component {
  
  render() {

    return (
      <div>
        <div className='row'>
          <div className="col-md-4">
              <Gallery images={this.props.imageGallery}/>
          </div>
          <div className="col-md-4">
              <InfoCard cardInfo={this.props.infoCardGallery}/>
          </div>
          <div className="col-md-4">
              <AddToCollection cardInfo={this.props.infoCardGallery} user={this.props.user}/>
          </div>
        </div>
        <hr/>
      </div>
    )
  }
}

export default SearchCardDisplay