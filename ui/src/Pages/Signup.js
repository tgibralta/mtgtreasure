import React, { Component } from 'react';
import "./Style/Signup.css"
import Footer from './../Components/Footer'
const CreateUser = require('./../Actions/AccountAction').CreateUser

class Signup extends Component {

  handleSubmit() {
    let username = document.getElementById('inputUsername').value
    let password = document.getElementById('inputPassword').value
    let mail = document.getElementById('inputEmail').value
    CreateUser(username, mail, password)
    .then(() => {
      console.log(`User successfuly created`)
      this.props.history.push(`/user/${username}/`)
    })
    .catch((err) => {
      console.log(`Failed to contact middleware: ${err}`)
    })
  }

  render() {
    return (
      <div>
        <div className="jumbotron">
          <h1 className="display-5 text-center">Welcome to the community!</h1>
          <div className = 'card card-container'>
            <h1 className="text-center">MTG</h1>
            <h1 className="text-center">Treasure</h1>
            <form className='form-signin' onSubmit={this.handleSubmit}>
              <input type='text' id='inputUsername' className="form-control" placeholder='Username' required autoFocus/>
              <input type='email' id='inputEmail' className="form-control" placeholder='Mail' required autoFocus/>
              <input type='password' id='inputPassword' className="form-control" placeholder='Password' required autoFocus/>
            </form>
            <button className='btn btn-lg btn-block btn-primary btn-signin' onClick={this.handleSubmit.bind(this)}>Signup</button>
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

export default Signup
