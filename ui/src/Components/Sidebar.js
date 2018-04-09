import React, { Component } from 'react'
import userStore from './../Stores/UserStore'
import { NavHashLink as NavLink } from 'react-router-hash-link';
import './Style/Sidebar.css'

class Sidebar extends Component {
  

  render() {
    return (
      <div>
      <nav className="d-none d-md-block bg-light sidebar">
        <div className="sidebar-sticky">
          <ul className="nav flex-column sidebar-ul">
            <li className="nav-item">
              <a>
                <NavLink to={`/user/${this.props.username}/`} activeClassName='selected'>Dashboard</NavLink>
              </a>
            </li>
            <li className="nav-item">
              <a>
                <NavLink to={`/user/${this.props.username}/collection/`} activeClassName='selected'>Collection</NavLink>
              </a>
            </li>
            <li className="nav-item">
              <a>
                <NavLink to={`/user/${this.props.username}/decks/`} activeClassName='selected'>Decks</NavLink>
              </a>
            </li>
            <li className="nav-item">
              <a>
                <NavLink to={`/user/${this.props.username}/shopping`} activeClassName='selected'>Shopping</NavLink>
              </a>
            </li>
            <li className="nav-item">
              <a>
                <NavLink to={`/user/${this.props.username}/investment`} activeClassName='selected'>Investment</NavLink>
              </a>
            </li>
            <li className="nav-item">
              <a>
                <NavLink to={`/top8decks`} activeClassName='selected'>Winning Lists</NavLink>
              </a>
            </li>
            <li className="nav-item">
              <a>
                <NavLink to={`/upcomingevents`} activeClassName='selected'>Upcoming Events</NavLink>
              </a>
            </li>
          </ul>
        </div>
      </nav>
    </div>
    )
  }
}

export default Sidebar