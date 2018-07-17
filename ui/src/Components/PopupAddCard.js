import React, { Component } from 'react'
import Popup from 'reactjs-popup'
import ChartPriceHistory from './ChartPriceHistory'
import AddToCollection from './AddToCollection'

class PopupAddCard extends Component {

  
  render() {

    return (
      <Popup trigger={<button className="btn btn-lg btn-signin  btn-primary btn-block my-2 my-sm-0">ADD</button>} position="right center" modal>
        <div>
          <div className="card border-primary mb-3 card-search">
            <div className="card-header card-header-search">{this.props.cardInfo.name}</div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  <img alt="img-card" className="img-card "src={this.props.cardInfo.image_uris.small}/>
                  <hr/>
                  <div className="row">
                    <div className="col-md-6 col-sm-6 col-lg-6">
                      <h4><i class="fas fa-dollar-sign icon-dashboard fa-2x"></i> : {this.props.cardInfo.usd}</h4>
                    </div>
                    <div className="col-md-6 col-sm-6 col-lg-6">
                      <h4><i class="fas fa-chart-line icon-dashboard fa-2x"></i> : {this.props.trend} %</h4>
                    </div>
                  </div>
            
                </div>
                <div className="col-md-6">
                  <AddToCollection cardInfo={this.props.cardInfo} user={this.props.user}/>
                </div>
              </div>
              <hr className="text-primary"/>
              <ChartPriceHistory chartData={this.props.chartData}/>
              
              <hr/>
            </div>
          </div>
        </div>
      </Popup>
    )
  }
}

export default PopupAddCard