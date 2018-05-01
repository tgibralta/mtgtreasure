import React, { Component } from 'react'
import ChartPriceHistory from './ChartPriceHistory'
import './Style/PanelCollection.css'

class PanelCollection extends Component {
  
  render() {

    return (
      <div>
        <h2>Collection</h2>
        <hr/>
        <div className="row">
          <div className="col-md-4">
            <div class="card border-primary mb-3" >
              <div class="card-header">Inital Investment {this.props.initialInvestment} $</div>
                <div class="card-body">
                  <ChartPriceHistory chartData={this.props.chartDataInvestment}/>
                </div>
            </div>
          </div>
          <div className="col-md-4">
            <div class="card border-primary mb-3" >
              <div class="card-header">Current Value: {Math.ceil(this.props.currentValue)} $</div>
                <div class="card-body">
                  <ChartPriceHistory chartData={this.props.chartDataValue}/>
                </div>
            </div>
          </div>
          <div className="col-md-4">
            <div class="card border-primary mb-3" >
              <div class="card-header">Nb Card: {this.props.nbCard}</div>
                <div class="card-body">
                  <ChartPriceHistory chartData={this.props.chartDataNbCard}/>
                </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default PanelCollection