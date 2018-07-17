import React, { Component } from 'react'
import './Style/ElementTop5.css'

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

  render() {
    return (
      <div>
        <div className="card card-container card-top5">
            <div className="row">
                <div className="col-md-7">
                    <p>{this.props.card.allCardInfo.Scryfall.name}</p>
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