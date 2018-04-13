import React, { Component } from 'react'

class FormEditDeck extends Component {
  
  render() {

    return (
      <div>
        <label for="formatSelect">Format</label>
        <select className="form-control" id="formatSelect">
          <option>Standard</option>
          <option>Modern</option>
          <option>Legacy</option>
          <option>EDH</option>
          <option>Pauper</option>
          <option>Frontier</option>
        </select>
        <label for="textMain">Main</label>
        <textarea className="form-control" id="textMain" rows="10" defaultValue={this.props.valueMain}></textarea> 
        <label for="textSideboard">Sideboard</label>
        <textarea className="form-control" id="textSideboard" rows="5" defaultValue={this.props.valueSideboard}></textarea>
        <hr/>
        <button className="btn btn-lg btn-primary btn-block btn-signin" onClick={this.props.submit.bind(this)}>Submit</button>
      </div>
    )
  }
}

export default FormEditDeck