import React, { Component } from 'react';
import './App.css';
import { Switch, Route } from 'react-router-dom'
import HomePage from './Pages/Home'
import LoginPage from './Pages/Login'
import SigninPage from './Pages/Signin'
import UserPage from './Pages/User'
import LastEventsPage from './Pages/LastEvents'
import NotFoundPage from './Pages/NotFound'

class App extends Component {
  render() {
    return (
      <Switch>
        <Route exact path='/' component={HomePage}/>
        <Route exact path='/login' component={LoginPage}/>
        <Route exact path='/signin' component={SigninPage}/>
        <Route path='/user/:userid' component={UserPage}/>
        <Route exact path='/lastevents' component={LastEventsPage}/>
        <Route exact path='*' component={NotFoundPage}/>
      </Switch>
    )
  }
}

export default App
