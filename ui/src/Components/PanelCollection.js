import React, { Component } from 'react'
import './Style/PanelCollection.css'

class PanelCollection extends Component {

  getPourcentageEvolution(props) {
    let investment = props.investment
    let currentValue = props.currentValue
    let percentage = Math.ceil(100 * (currentValue - investment) / investment)
    return (<p className="text-user" >{percentage} %</p>)
  }
  
  render() {

    return (
      <div>
        <div className="row">
          <div className="col-md-4">
            <div className="container-logo">
              <i className="fab fa-slack-hash icon-dashboard fa-7x"></i>
              <p className="text-user" >{this.props.user.nbCardInCollection}</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="container-logo">
              <i className="fas fa-dollar-sign icon-dashboard fa-7x"></i>
              <p className="text-user" >{this.props.user.initialInvestment} $</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="container-logo">
              <i className="fas fa-chart-line icon-dashboard fa-7x"></i>
              < this.getPourcentageEvolution investment={this.props.user.initialInvestment} currentValue={this.props.user.currentValue}/>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default PanelCollection