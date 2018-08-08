import React, { Component } from 'react';
import './Style/Signin.css'
import imgLogo from './../logo-mtg-treasure.png'
import Footer from './../Components/Footer'
import Navbar from './../Components/Navbar'
import userStore from './../Stores/UserStore'
import Loader from 'react-loader'
import Alert from 'react-s-alert'
import 'react-s-alert/dist/s-alert-default.css'
import 'react-s-alert/dist/s-alert-css-effects/slide.css'
const SigninUser = require('./../Actions/AccountAction').SigninUser

class Signin extends Component {

  constructor () {
    super()
    this.state = {
      user: userStore.getUser(),
      isLoggedIn: userStore.getIsLoggedIn(),
      loaded: true
    }
  }

  componentWillMount () {
    this.setState({
      user: userStore.getUser(),
      isLoggedIn: userStore.getIsLoggedIn(),
      loaded: true
    })
  }

  handleSubmit() {
    this.setState({ loaded: false })
    let username = document.getElementById('inputUsername').value
    let password = document.getElementById('inputPassword').value
    console.log(`Value loaded was changed: ${this.state.loaded}`)
    SigninUser(username, password)
    .then(() => {
      this.props.history.push(`/user/${username}/`)
    })
    .catch((err) => {
      this.setState({ loaded: true })
      console.log(err)
      Alert.error('Invalid credentials', {
          position: 'bottom-right',
          effect: 'slide',
          beep: false,
          timeout: 2000,
          offset: 100,
          html: true
      })
    })
    
  }

  render() {
    return (
      
      <div>
        <Loader loaded={this.state.loaded} className="loader-spinner-white">
          <div className="jumbotron jumbotron-full">
            <Navbar isLoggedIn={this.state.isLoggedIn} username={this.state.user.username}/>
            <Alert stack={{limit: 3}} />
            <div className="card card-container card-sign card-transparent">
                <img alt="logo" className="logo-form" src={imgLogo}/>
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
          </div>
        </Loader>
        {/* </AlertProvider> */}
      </div>
      
    );
  }
}

export default Signin
