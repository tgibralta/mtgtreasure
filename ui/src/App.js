import React, { Component } from 'react';
import './App.css';
import { Switch, Route } from 'react-router-dom'
import HomePage from './Pages/Home'
import Signin from './Pages/Signin'
import Signup from './Pages/Signup'
import UserPage from './Pages/User'
import AboutPage from './Pages/About'
import LastEventsPage from './Pages/LastEvents'
import NotFoundPage from './Pages/NotFound'



class App extends Component {
  render() {
    return (
      <div>
        
        <Switch>
          <Route exact path='/' component={HomePage}/>
          <Route exact path='/signin' component={Signin}/>
          <Route exact path='/signup' component={Signup}/>
          <Route path='/user/:userid' component={UserPage}/>
          <Route exact path='/lastevents' component={LastEventsPage}/>
          <Route exact path='/about' component={AboutPage}/>
          <Route exact path='*' component={NotFoundPage}/>
        </Switch>
      </div>
    )
  }
}

export default App
