import React, { Component } from 'react'
import InfoCard from './InfoCard'
import AddToCollection from './AddToCollection'
import Gallery from 'react-grid-gallery'
import ChartPriceHistory from './ChartPriceHistory'
import configuration from './../config/Config'

class SearchCardDisplay extends Component {
  
  render() {

    return (
      <div>
        <div className='row'>
          <div className="col-md-3">
            <Gallery images={this.props.imageGallery} rowHeight={configuration.IMAGE.FULLCARD.SMALL.WIDTH}/>  
          </div>
          <div className="col-md-7">
              <h3> {this.props.infoCardGallery.name} </h3>
              <ChartPriceHistory chartData={this.props.chartData}/>
              <h4> Set: {this.props.infoCardGallery.set_name} ({this.props.infoCardGallery.set}) </h4>
              <h4> Current Price: {this.props.infoCardGallery.usd} $</h4>
              <h4> Trend: {this.props.trend} %</h4>
          </div>
          <div className="col-md-2">
              <AddToCollection cardInfo={this.props.infoCardGallery} user={this.props.user}/>
          </div>
        </div>
        <hr/>
      </div>
    )
  }
}

export default SearchCardDisplay