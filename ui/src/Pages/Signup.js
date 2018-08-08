import React, { Component } from 'react';
import "./Style/Signup.css"
import imgLogo from './../logo-mtg-treasure.png'
import Footer from './../Components/Footer'
import Navbar from './../Components/Navbar'
import userStore from './../Stores/UserStore'
import Loader from 'react-loader'
import Alert from 'react-s-alert'
import 'react-s-alert/dist/s-alert-default.css'
import 'react-s-alert/dist/s-alert-css-effects/slide.css'
const CreateUser = require('./../Actions/AccountAction').CreateUser

class Signup extends Component {

  constructor () {
    super()
    this.state = {
      user: userStore.getUser(),
      isLoggedIn: userStore.getIsLoggedIn(),
      loaded: true,
      trends: userStore.getTop10()
    }
  }

  componentWillMount () {
    this.setState({
      loaded: true,
      trends: userStore.getTop10()
    })
  }

  handleSubmit() {
    
    let username = document.getElementById('inputUsername').value
    let password = document.getElementById('inputPassword').value
    let mail = document.getElementById('inputEmail').value
    if (username === '' | password === '' | mail === '') {
      if (username === '') {
          Alert.error('Empty username', {
            position: 'bottom-right',
            effect: 'slide',
            beep: false,
            timeout: 2000,
            offset: 100,
            html: true
        })
      }
      if (password === '') {
          Alert.error('Empty password', {
            position: 'bottom-right',
            effect: 'slide',
            beep: false,
            timeout: 2000,
            offset: 100,
            html: true
        })
      }
      if (mail === '') {
          Alert.error('Empty mail', {
            position: 'bottom-right',
            effect: 'slide',
            beep: false,
            timeout: 2000,
            offset: 100,
            html: true
        })
      }
    } else {
      this.setState({
        loaded: false
      })
      CreateUser(username, mail, password)
      .then(() => {
        console.log(`User successfuly created`)
        this.props.history.push(`/user/${username}/`)
        this.setState({
          loaded: true
        })
      })
      .catch((err) => {
        console.log(`Failed to contact middleware: ${err}`)
        this.setState({
          loaded: true
        })
      })
    }
    
  }

  render() {
    return (
      <div>
        <Loader loaded={this.state.loaded} className="loader-spinner-white">
          <div className="jumbotron jumbotron-sign jumbotron-full">
            <Navbar isLoggedIn={this.state.isLoggedIn} username={this.state.user.username}/>
            <Alert stack={{limit: 3}} />
            <div className = 'card card-container card-sign card-transparent'>
              <img className="logo-form" alt="logo" src={imgLogo}/>
              <form className='form-signin' onSubmit={this.handleSubmit}>
                <input type='text' id='inputUsername' className="form-control" placeholder='Username' required autoFocus/>
                <input type='email' id='inputEmail' className="form-control" placeholder='Mail' required autoFocus/>
                <input type='password' id='inputPassword' className="form-control" placeholder='Password' required autoFocus/>
              </form>
              <button className='btn btn-lg btn-block btn-primary btn-signin' onClick={this.handleSubmit.bind(this)}>Signup</button>
            </div>
          </div>
        </Loader>
      </div>
    );
  }
}

export default Signup
