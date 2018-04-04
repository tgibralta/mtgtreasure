import React, { Component } from 'react';
import './Style/Signin.css'
import Footer from './../Components/Footer'
const SigninUser = require('./../Actions/AccountAction').SigninUser

class Signin extends Component {

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
        <div className="jumbotron">
        <h1 className="display-5 text-center">Welcome back!</h1>
        <div className="card card-container">
            <h1 className="text-center">MTG</h1>
            <h1 className="text-center">Treasure</h1>
            <p id="profile-name" className="profile-name-card"></p>
            <form className="form-signin">
                <span id="reauth-email" className="reauth-email"></span>
                <input type="text" id="inputUsername" className="form-control" placeholder="Username" required autoFocus/>
                <input type="password" id="inputPassword" className="form-control" placeholder="Password" required/>
                <div id="remember" className="checkbox">
                    <label>
                        <input type="checkbox" value="remember-me"/> Remember me
                    </label>
                </div>
            </form>
            <button className="btn btn-lg btn-primary btn-block btn-signin" onClick={this.handleSubmit.bind(this)}>Sign In</button>
            <a href="/" className="forgot-password">
              Forgot the password?
            </a>
        </div>
      </div>
      <div className="container">
        NEWS BANNER
      </div>
      <Footer/>
      </div>
    );
  }
}

export default Signin
