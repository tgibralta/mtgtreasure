import React, { Component } from 'react';
import './Style/Signin.css'
import imgLogo from './../logo-mtg-treasure.png'
import Footer from './../Components/Footer'
import Navbar from './../Components/Navbar'
import userStore from './../Stores/UserStore'
const SigninUser = require('./../Actions/AccountAction').SigninUser

class Signin extends Component {

  constructor () {
    super()
    this.state = {
      user: userStore.getUser(),
      isLoggedIn: userStore.getIsLoggedIn()
    }
  }

  // componentWillMount () {
  //   userStore.on('change', () => {
  //     this.setState({
  //       user: userStore.getUser(),
  //       isLoggedIn: userStore.getIsLoggedIn()
  //     })
  //   })
  // }

  handleSubmit() {
    let username = document.getElementById('inputUsername').value
    let password = document.getElementById('inputPassword').value
    SigninUser(username, password)
    .then(() => {
      this.props.history.push(`/user/${username}/`)
    })
    .catch((err) => {
      console.log(err)
    })
    
  }

  render() {
    return (
      <div>
        <div className="jumbotron jumbotron-full">
          <Navbar isLoggedIn={this.state.isLoggedIn} username={this.state.user.username}/>
          <div className="card card-container card-sign card-transparent">
              <img className="logo-form" src={imgLogo}/>
              <p id="profile-name" className="profile-name-card"></p>
              <form className="form-signin">
                  <span id="reauth-email" className="reauth-email"></span>
                  <input type="text" id="inputUsername" className="form-control" placeholder="Username" required autoFocus/>
                  <input type="password" id="inputPassword" className="form-control" placeholder="Password" required/>
              </form>
              <button className="btn btn-lg btn-primary btn-block btn-signin" onClick={this.handleSubmit.bind(this)}>Sign In</button>
              <a href="/" className="forgot-password">
                Forgot the password?
              </a>
          </div>
        <Footer/>
        </div>
      </div>
    );
  }
}

export default Signin
