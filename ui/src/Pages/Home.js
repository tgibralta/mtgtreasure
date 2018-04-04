import React, { Component } from 'react';
import Footer from './../Components/Footer'
import './Style/Home.css'

class Home extends Component {
  render() {
    return (
      <div>
        <div className="jumbotron">
          <div className="container">
            <h1 className="display-3">MTG Treasure</h1>
            <h1 className="">A complete platform for every MTG player</h1>
            <p><a className="btn btn-primary btn-medium" href="/signin" role="button">Signin &raquo;</a></p>
          </div>
        </div>
        <div className="container">
          <div className="row">
            <div className="col-md-4">
              <h2>Maximize value</h2>
              <p>Manage your collection and use MTG Treasure to know its price in real time.</p> 
              <p>Do not miss on opportunities to sell and buy cards at the right time thanks to the embedded assistant functionnality.</p>
              <p>Compare prices in different shops and countries to have the best opportunities globally.</p>
              <p><a className="btn btn-secondary" href="/about/collection" role="button">View details &raquo;</a></p>
            </div>
            <div className="col-md-4">
              <h2>Build like a pro</h2>
              <p>MTG Treasure offers a lot of tools to build and analyze the decks that you want. Don't miss out on the tools to take it to the next level.</p>
              <p>Build, manage, playtest and share your decks with other users to have all the feedback you need to prepare for events.</p>
              <p></p>
              <p><a className="btn btn-secondary" href="/about/deck" role="button">View details &raquo;</a></p>
            </div>
            <div className="col-md-4">
              <h2>Stay up to date</h2>
              <p>Don't miss out on recent events, stay up to date with personnalized information depending on the decks that you like to build regarding the recent MTG events and their influence on the cards value</p>
              <p><a className="btn btn-secondary" href="about/news" role="button">View details &raquo;</a></p>
            </div>
          </div>
        </div>
        <div className="jumbotron">
          <div className="container">
            <h1>Your opinion matters</h1>
              <div className="col-md-4 opinion-div">
                <p>Give us your feedback. We will come back to you as soon as possible and make MTG Treasure evolve to fit your need.</p>
                <p><a className="btn btn-primary" href="/feedback" role="button">Provide Feedback &raquo;</a></p>
              </div>
            <div className="row">
            </div>
          </div>
        </div>
        <Footer/>
      </div>
    );
  }
}

export default Home;
