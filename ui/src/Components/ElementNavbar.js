import React, { Component } from 'react'
import * as AccountActions from './../Actions/AccountAction'
import './Style/ElementNavbar.css'


class ElementNavabar extends Component {
  handleSubmit() {
    AccountActions.SignoutUser()
    this.props.history.push(`/`)
  }
  render() {
    if (!this.props.isLoggedIn) {
      return (
        <ul className="navbar-nav mr-auto">
          <li className="nav-item">
            <a className="nav-link" href="/signup">Singup</a>
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
            <a className="nav-link" href="/signup">Dashboard</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="/signin">Collection</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="/about">Decks</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="/about">Shopping</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="/about">Investment</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="/about">Winning Lists</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="/about">Events</a>
          </li>
          <li className="nav-item">
            <i class="fas fa-search"></i>
          </li>
        </ul>
      )
    }
    
  }
}

export default ElementNavabar