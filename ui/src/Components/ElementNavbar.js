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
            <a className="nav-link" href="/signup">Signup</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="/signin">Signin</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="/about">About</a>
          </li>
        </ul>
      )
    } else {
      return (
        <ul className="navbar-nav mr-auto">
          <li className="nav-item">
            <a className="nav-link" href="/about">About</a>
          </li>
          <li className="nav-item">
            <a className="nav-link pull-right" href="/option">Options</a>
          </li>
          <li className="nav-item">
            <a className="nav-link pull-right" href="/">Logout</a>
          </li>
        </ul>
      )
    }
    
  }
}

export default ElementNavabar