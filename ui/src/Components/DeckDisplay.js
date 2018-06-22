import React, { Component } from 'react'
import Gallery from 'react-grid-gallery'
import { NavHashLink as NavLink } from 'react-router-hash-link';
import './Style/DeckDisplay.css'

class DeckDisplay extends Component {

  render() {
    return (
      <div>
        {/* <div className='row'>
          <div className="card border-primary mb-3 card-deck">
            <div className="card-header">
              <a>{this.props.deckname}</a>
            </div>
            <Gallery rowHeight='120' images={this.props.imageDeck}/>
            <div className="card-body">
              <Gallery rowHeight='120' images={this.props.imageDeck}/>
              <div className="card border-primary mb-3 card-dashboard">
                <div className="row ">
                  <div className="col-md-6">
                    <button className="btn btn-lg btn-block btn-primary btn-signin"  onClick={this.props.goTo.bind(this)}><i class="fas fa-edit"></i></button>
                  </div>
                  <div className="col-md-6">
                    <button className="btn btn-lg btn-block btn-primary btn-signin" onClick={this.props.delete.bind(this)}><i class="far fa-trash-alt" ></i></button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div> */}
        <div class="card text-center">
          <img class="card-img-top" src={this.props.imageDeck}/>
          <div class="card-body" id="card">
            <h5 class="card-title">{this.props.deckname}</h5>
          </div>
          <div class="card-footer text-muted">
            <div class="row">
              <div class="col-lg-6 col-md-6 col-sm-6">
                <button className="btn btn-lg btn-block btn-primary btn-signin" onClick={this.props.goTo.bind(this)}><i class="fas fa-edit"></i></button>
              </div>
              <div class="col-lg-6 col-md-6 col-sm-6">
                <button className="btn btn-lg btn-block btn-primary btn-signin" onClick={this.props.delete.bind(this)}><i class="far fa-trash-alt"></i></button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default DeckDisplay
