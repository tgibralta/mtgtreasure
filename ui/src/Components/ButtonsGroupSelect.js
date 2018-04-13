import React, { Component } from 'react'
import './Style/ButtonsGroupSelect.css'

class ButtonsGroupSelect extends Component {
  
  render() {

    return (
      <div className="center">
        <div className="row" >
          <div className="col-md-4">
            <button class="btn btn-primary">-</button>
          </div>
          <div className="col-md-4">
            <input type="text" name="quant[1]" className="form-control input-number" value="1" min="1" max="10"/>
          </div>
          <div className="col-md-4">
            <button className="btn btn-secondary">+</button>
          </div>
        </div>
      </div>
    )
  }
}

export default ButtonsGroupSelect






