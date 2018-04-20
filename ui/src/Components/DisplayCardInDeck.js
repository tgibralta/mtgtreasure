import React, { Component } from 'react'
import Gallery from 'react-grid-gallery'

class DisplayCardInDeck extends Component {

  render() {
    return (
      <div>
        <div className='row'>
          <div className="col-md-1">
            <p>{this.props.number}</p>
          </div>
          <div className="col-md-7">
            <p>{this.props.name}</p>
          </div>
        </div>
      </div>
    )
  }
}

export default DisplayCardInDeck