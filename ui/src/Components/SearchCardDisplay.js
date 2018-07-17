import React, { Component } from 'react'
import ChartPriceHistory from './ChartPriceHistory'
import './Style/SearchCardDisplay.css'
import PopupAddCard from './../Components/PopupAddCard'

class SearchCardDisplay extends Component {
  
  render() {

    return (
      <div>
          <div className="card border-primary mb-3 card-search">
            <div className="card-header card-header-search">{this.props.infoCardGallery.name}</div>
            <div className="card-body">
              <img className="img-card" alt="thumbnail-card" src={this.props.imageGallery}/>
              <hr className="text-primary"/>
              <div className="row">
                <div className="col-md-6 col-sm-6 col-lg-6">
                  <h4><i class="fas fa-dollar-sign icon-dashboard fa-2x"></i> : {this.props.infoCardGallery.usd}</h4>
                </div>
                <div className="col-md-6 col-sm-6 col-lg-6">
                  <h4><i class="fas fa-chart-line icon-dashboard fa-2x"></i> : {this.props.trend} %</h4>
                </div>
              </div>
              <hr/>
              <ChartPriceHistory chartData={this.props.chartData}/>
              <hr/>
              <PopupAddCard cardInfo={this.props.infoCardGallery} trend={this.props.trend} chartData={this.props.chartData} user={this.props.user}/>
            </div>
          </div>
      </div>
    )
  }
}

export default SearchCardDisplay