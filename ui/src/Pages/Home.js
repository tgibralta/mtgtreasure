import React, { Component } from 'react';
import Footer from './../Components/Footer'
import imgLogo from './../logo-mtg-treasure.png'
import Navbar from './../Components/Navbar'
import logo from './../logo-mtg-treasure.png'
import userStore from './../Stores/UserStore'
import * as AccountActions from './../Actions/AccountAction'
import './Style/Home.css'

class Home extends Component {
  constructor () {
    super()
    this.state = {
      user: userStore.getUser(),
      isLoggedIn: userStore.getIsLoggedIn()
    }
  }

  componentWillMount () {
    userStore.on('change', () => {
      this.setState({
        user: userStore.getUser(),
        isLoggedIn: userStore.getIsLoggedIn()
      })
    })
  }

  Logout() {
    AccountActions.SignoutUser()
    this.props.history.push(`/`)
  }

  render() {
    return (
      <div>
        <div className="jumbotron jumbotron-full">
          <Navbar isLoggedIn={this.state.isLoggedIn} username={this.state.user.username} Logout={this.Logout.bind(this)}/>
          <div className="container container-title">
            <img className="logo-home" src={imgLogo}/>
            <h1 class="text-center  font-weight-bold text-title">MTG TREASURE</h1>
            <h3 class="text-center text-white">The essential financial and deck-building tool for every Magic The Gathering cards owner.</h3>
          </div>
          <Footer />
        </div>
        <div className="jumbotron jumbotron-white">
          <div className="container">
            <div className="row">
              <div className="col-md-4 col-sm-4">
                <img class="rounded-circle circle-left" src="https://img.scryfall.com/cards/art_crop/en/vma/4.jpg?1517813031" alt="Generic placeholder image" width="140" height="140"/>
              </div>
              <div className="col-md-8 col-sm-8">
                <div class="card">
                  <div class="card-body">
                    <h2 class="card-title">Track the value of your collection</h2>
                    <p class="card-text">Enter your collection in our database and enjoy services as price tracking, analysis and sell/buy advice.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="jumbotron jumbotron-main">
          <div className="container">
            <div className="row">
              <div className="col-md-8 col-sm-8">
                <div class="card card-white">
                <div class="card-body">
                  <h2 class="card-title ">Build decks like a Pro</h2>
                  <p class="card-text">Enjoy the deck building tools to tune and build the best decks for your FNM or other events.</p>
                </div>
              </div>
              </div>
              <div className="col-md-4 col-sm-4">
                <img class="rounded-circle circle-right" src="https://img.scryfall.com/cards/art_crop/en/a25/36.jpg?1521724900" alt="Generic placeholder image" width="140" height="140"/>
              </div>
            </div>
          </div>
        </div>
        <div className="jumbotron jumbotron-white">
          <div className="container">
            <div className="row">
              <div className="col-md-4 col-sm-4">
                <img class="rounded-circle circle-left" src="http://media.wizards.com/2015/images/daily/cardart_160402.jpg" alt="Generic placeholder image" width="140" height="140"/>
              </div>
              <div className="col-md-8 col-sm-8">
                <div class="card">
                  <div class="card-body">
                    <h2 class="card-title">Stay up to date</h2>
                    <p class="card-text">Have access to the latest results from all over the world and their impact on card prices.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
      </div>
    );
  }
}

export default Home;
