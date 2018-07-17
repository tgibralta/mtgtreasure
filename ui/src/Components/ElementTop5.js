import React, { Component } from 'react'
import './Style/ElementTop5.css'
import PopupCardCollection from './PopupCardCollection'

class ElementTop5 extends Component {

  faTrend(props) {
      let trend = props.trend
      if (trend > 0) {
      return (<i className="fas fa-angle-double-up"></i>)
    } else if (trend < 0) {
      return (<i className="fas fa-angle-double-down"></i>)
    } else {
      return (<i className="fas fa-minus"></i>)
    }
  }

  createChartData(card) {
    let labels = card.allCardInfo.DB.priceHistory.map(function(x, index) {
      let splitDate = x.date.split("/")
        return splitDate[1]
    })
    let data = card.allCardInfo.DB.priceHistory.map(function(x) {
      return x.price
    })
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
    return chartData
  }

  render() {
    return (
      <div>
        <div className="card card-container card-top5">
            <div className="row">
                <div className="col-md-7">
                  <PopupCardCollection name={this.props.card.allCardInfo.Scryfall.name} uri={this.props.card.allCardInfo.Scryfall.image_uris.large} price={this.props.card.allCardInfo.Scryfall.usd} initPrice={this.props.card.allCardInfo.DB.init_price} trend={this.props.card.trend} chartData={this.createChartData.bind(this, this.props.card)}/>
                </div>
                <div className="col-md-3">
                    <p>{this.props.card.trend} %</p>
                </div>
                <div className="col-md-2">
                    <this.faTrend trend={this.props.card.trend}/>
                </div>
            </div>
        </div>
      </div>
    )
  }
}

export default ElementTop5