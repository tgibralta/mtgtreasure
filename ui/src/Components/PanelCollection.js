import React, { Component } from 'react'
import ChartPriceHistory from './ChartPriceHistory'
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
            {/* <div class="card border-primary mb-3" >
              <div class="card-header">Inital Investment {this.props.initialInvestment} $</div>
                <div class="card-body">
                  <ChartPriceHistory chartData={this.props.chartDataInvestment}/>
                </div>
            </div> */}
            <div className="container-logo">
              <i class="fab fa-slack-hash icon-dashboard fa-7x"></i>
              <p className="text-user" >{this.props.user.nbCardInCollection}</p>
            </div>
          </div>
          <div className="col-md-4">
            {/* <div class="card border-primary mb-3" >
              <div class="card-header">Current Value: {Math.ceil(this.props.currentValue)} $</div>
                <div class="card-body">
                  <ChartPriceHistory chartData={this.props.chartDataValue}/>
                </div>
            </div> */}
            <div className="container-logo">
              <i class="fas fa-dollar-sign icon-dashboard fa-7x"></i>
              <p className="text-user" >{this.props.user.initialInvestment} $</p>
            </div>
          </div>
          <div className="col-md-4">
            {/* <div class="card border-primary mb-3" >
              <div class="card-header">Nb Card: {this.props.nbCard}</div>
                <div class="card-body">
                  <ChartPriceHistory chartData={this.props.chartDataNbCard}/>
                </div>
            </div> */}
            <div className="container-logo">
              <i class="fas fa-chart-line icon-dashboard fa-7x"></i>
              < this.getPourcentageEvolution investment={this.props.user.initialInvestment} currentValue={this.props.user.currentValue}/>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default PanelCollection