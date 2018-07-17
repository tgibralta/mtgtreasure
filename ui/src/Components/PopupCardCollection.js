import React, { Component } from 'react'
import Popup from 'reactjs-popup'
import ChartPriceHistory from './ChartPriceHistory'
import './Style/PopupCard.css'

class PopupCardCollection extends Component {

  
  render() {

    return (
      <Popup trigger={<p>{this.props.name}</p>} position="right center" modal>
        <div>
          <div className="card border-primary mb-3 card-search">
            <div className="row">
              <div className="col-md-4 col-lg-4">
                <img className="img-popup img-center" alt="card-thumbnail" src={this.props.uri}/>
              </div>
               <div className="col-md-8 col-lg-8">
                <ChartPriceHistory chartData={this.props.chartData}/>
              </div> 
            </div>
            <hr/>
            <div className="row">
              <div className="col-md-4 col-lg-4">
                <h4><i class="fas fa-money-bill-alt icon-dashboard fa-2x"></i> : {this.props.initPrice} $</h4>
              </div>
              <div className="col-md-4 col-lg-4">
                <h4><i class="fas fa-dollar-sign icon-dashboard fa-2x"></i> : {this.props.price} $</h4>
              </div>
              <div className="col-md-4 col-lg-4">
                <h4><i class="fas fa-chart-line icon-dashboard fa-2x"></i> : {this.props.trend} %</h4>
              </div>
            </div>
            
          </div>
        </div>
      </Popup>
    )
  }
}

export default PopupCardCollection