import React, { Component } from 'react'
import InfoCard from './InfoCard'
import AddToCollection from './AddToCollection'
import Gallery from 'react-grid-gallery'
import ChartPriceHistory from './ChartPriceHistory'
import configuration from './../config/Config'
import './Style/SearchCardDisplay.css'
import PopupAddCard from './../Components/PopupAddCard'

class SearchCardDisplay extends Component {
  
  render() {

    return (
      <div>
        {/* <div className='row'>
          <div className="col-md-6">
            <h4> {this.props.infoCardGallery.name} </h4>
            <img className="img-card "src={this.props.imageGallery}/>
          </div>
          <div className="col-md-6">
            <p>Price: {this.props.infoCardGallery.usd} $</p>
            <p>Trend: ${this.props.trend} %</p>
          </div>
        </div> */}
        {/* <div className="col-md-6 col-sm-6 col-lg-6"> */}
          <div className="card border-primary mb-3 card-search">
            <div className="card-header card-header-search">{this.props.infoCardGallery.name}</div>
            <div className="card-body">
              <img className="img-card "src={this.props.imageGallery}/>
              <hr className="text-primary"/>
              {/* <div className="card border-primary mb-3 card-dashboard"> */}
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
                {/* <button className="btn btn-lg btn-signin  btn-primary btn-block my-2 my-sm-0" type="submit" onClick={this.props.goToAddCard.bind(this)}>ADD</button> */}
              {/* </div> */}
            </div>
          </div>
        {/* </div> */}
        {/* <div className='row'>
          <div className="col-md-3">
            <Gallery images={this.props.imageGallery} rowHeight={configuration.IMAGE.FULLCARD.SMALL.WIDTH}/>  
          </div>
          <div className="col-md-7">
              <h3> {this.props.infoCardGallery.name} </h3>
              
              <h4> Set: {this.props.infoCardGallery.set_name} ({this.props.infoCardGallery.set}) </h4>
              <h4> Current Price: {this.props.infoCardGallery.usd} $</h4>
              <h4> Trend: {this.props.trend} %</h4>
          </div>
          <div className="col-md-2">
              <AddToCollection cardInfo={this.props.infoCardGallery} user={this.props.user}/>
          </div>
        </div>
        <hr/> */}
      </div>
    )
  }
}

export default SearchCardDisplay