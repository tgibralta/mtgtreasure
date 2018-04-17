import React, { Component } from 'react'
import Gallery from 'react-grid-gallery'

class DeckDisplay extends Component {

  render() {
    return (
      <div>
        <div className='row'>
          <div className="col-md-4">
            <Gallery rowHeight='120' images={this.props.imageDeck}/>
          </div>
          <div className="col-md-4">
            <h4>{this.props.deckname}</h4>
            <p>Main: {this.props.nbMain}</p>
            <p>Sideboard: {this.props.nbSideboard}</p>
            <p>Legality: {this.props.legality}</p>
          </div>
          <div className="col-md-4">
            <button type="button" class="btn btn-danger" onClick={this.props.delete.bind(this)}>X</button>
          </div>
        </div>
        <hr/>
      </div>
    )
  }
}

export default DeckDisplay