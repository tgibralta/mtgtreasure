import React, { Component } from 'react'
import './Style/DeckDisplay.css'

class DeckDisplay extends Component {

  render() {
    return (
      <div>
        <div className="card text-center">
          <img className="card-img-top" alt="tumbnail-deck" src={this.props.imageDeck}/>
          <div className="card-body" id="card">
            <h5 className="card-title">{this.props.deckname}</h5>
          </div>
          <div className="card-footer text-muted">
            <div className="row">
              <div className="col-lg-6 col-md-6 col-sm-6">
                <button className="btn btn-lg btn-block btn-primary btn-signin" onClick={this.props.goTo.bind(this)}><i className="fas fa-edit"></i></button>
              </div>
              <div className="col-lg-6 col-md-6 col-sm-6">
                <button className="btn btn-lg btn-block btn-primary btn-signin" onClick={this.props.delete.bind(this)}><i className="far fa-trash-alt"></i></button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default DeckDisplay
