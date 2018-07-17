import React, { Component } from 'react'
import userStore from './../Stores/UserStore'
import ElementNavbar from './ElementNavbar'
import logo from './../logo-mtg-treasure.png'
import './Style/Navbar.css'

class Navbar extends Component {

  render() {
    return (
      <div>
         <nav className="navbar navbar-expand-lg navbar-default navbar-dark">
          <a className="navbar-brand" href="/"><img className="logo-navbar" src={logo}/></a>
          <div className="collapse navbar-collapse" id="navbarColor01">
            <ElementNavbar isLoggedIn={this.props.isLoggedIn} username={this.props.username} Logout={this.props.Logout} Redirect={this.props.Redirect} history = {this.props.history}/>
          </div>
        </nav> 
        {/* <nav className="navbar navbar-expand-lg navbar-default navbar-toggleable-sm">
          <div className="container">
            <button class="navbar-toggler" data-toggle="collapse" data-target="#mainNav">
              <span className="navbar-toggler-icon"/>
            </button>
            <ElementNavbar isLoggedIn={this.props.isLoggedIn} username={this.props.username} Logout={this.props.Logout} Redirect={this.props.Redirect} history = {this.props.history}/>
          </div>
        </nav> */}
      </div>
    );
  }
}

export default Navbar