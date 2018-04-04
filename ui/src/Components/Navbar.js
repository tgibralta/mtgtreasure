import React, { Component } from 'react'
import userStore from './../Stores/UserStore'
import ElementNavbar from './ElementNavbar'

class Navbar extends Component {
  constructor () {
    super()
    this.state = {
      isLoggedIn : false
    }
  }
  componentWillMount () {
    userStore.on('change', () => {
      console.log('Change emitted from UserStore')
      console.log(`New State: ${userStore.getIsLoggedIn()}`)
      this.setState({
        isLoggedIn: userStore.getIsLoggedIn()
      })
    })
  }

  render() {
    return (
      <div>
       <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
        <a className="navbar-brand" href="/">MTG Treasure</a>
        <div className="collapse navbar-collapse" id="navbarColor01">
          <ElementNavbar isLoggedIn={this.state.isLoggedIn} />
        </div>
      </nav>
      </div>
    );
  }
}

export default Navbar