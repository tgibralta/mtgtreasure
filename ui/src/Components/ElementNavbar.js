import React, { Component } from 'react'
import * as AccountActions from './../Actions/AccountAction'
import './Style/ElementNavbar.css'


class ElementNavbar extends Component {
  
  handleSubmit() {
    AccountActions.SignoutUser()
    this.props.history.push(`/`)
  }

  displayNavbar () {
    
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
          <li className="nav-item">
            <i class="fas fa-search"></i>
          </li>
        </ul>
      )
    } else {
      return (
        <ul className="navbar-nav mr-auto">
          <li className="nav-item">
            <a className="nav-link" href={`/user/${this.props.username}/`}>Dashboard</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href={`/user/${this.props.username}/collection/`}>Collection</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href={`/user/${this.props.username}/decks/`}>Decks</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href={`/user/${this.props.username}/shopping/`}>Shopping</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" onClick={this.handleSubmit.bind(this)}>Logout</a>
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