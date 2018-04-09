import React, { Component } from 'react'
import './Style/PanelCollection.css'

class PanelCollection extends Component {
  
  render() {

    return (
      <div>
        <h2>Collection</h2>
        <div className="row">
          <div className="col-md-4">
            <div class="card border-primary mb-3" >
              <div class="card-header">Inital Investment</div>
                <div class="card-body">
                  <h4 class="card-title">{this.props.initialInvestment} $</h4>
                </div>
            </div>
          </div>
          <div className="col-md-4">
            <div class="card border-primary mb-3" >
              <div class="card-header">Current Value</div>
                <div class="card-body">
                  <h4 class="card-title">{Math.ceil(this.props.currentValue)} $</h4>
                </div>
            </div>
          </div>
          <div className="col-md-4">
            <div class="card border-primary mb-3" >
              <div class="card-header">Nb Card</div>
                <div class="card-body">
                  <h4 class="card-title">{this.props.nbCard}</h4>
                </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default PanelCollection