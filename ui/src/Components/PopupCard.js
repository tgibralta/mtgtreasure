import React, { Component } from 'react'
import Popup from 'reactjs-popup'
import ChartPriceHistory from './ChartPriceHistory'
import './Style/PopupCard.css'

class PopupCard extends Component {

  
  render() {

    return (
      <Popup trigger={<a>{this.props.name}</a>} position="right center" modal>
        <div>
          <div className="card border-primary mb-3 card-search">
            <img className="img-popup img-center"src={this.props.uri}/>
            <hr/>
            <h4><i class="fas fa-dollar-sign icon-dashboard fa-2x"></i> : {this.props.price}</h4>
          </div>
        </div>
      </Popup>
    )
  }
}

export default PopupCard