import React, { Component } from 'react'
import * as AccountActions from './../Actions/AccountAction'
import './Style/ElementNavbar.css'


class ElementNavbar extends Component {
  
  render() {
    if (!this.props.isLoggedIn) {
      return (
        <ul className="navbar-nav mr-auto">
          <li className="nav-item">
            <a className="nav-link" href="/signup">Signup</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="/signin">Signin</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="/about">About</a>
          </li>
          <li className="nav-item">
            <i class="fas fa-search"></i>
          </li>
        </ul>
      )
    } else {
      return (
        <ul className="navbar-nav mr-auto">
          <li className="nav-item">
            <a className="nav-link" onClick={this.props.Redirect.bind(this, this.props.username,'', this.props.history)}>Dashboard</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" onClick={this.props.Redirect.bind(this, this.props.username,'collection/', this.props.history)}>Collection</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" onClick={this.props.Redirect.bind(this, this.props.username,'decks/', this.props.history)}>Decks</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" onClick={this.props.Redirect.bind(this, this.props.username,'shopping/', this.props.history)}>Shopping</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" onClick={this.props.Logout}>Logout</a>
          </li>
          <li className="nav-item">
            <i class="fas fa-search"></i>
          </li>
        </ul>
      )
    }
    
  }
}

export default ElementNavbar