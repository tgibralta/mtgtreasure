import React, { Component } from 'react';
import userStore from './../Stores/UserStore'
import TableCollection from './../Components/TableCollection'
import Footer from './../Components/Footer'
import './Style/Dashboard.css'

class Dashboard extends Component {
  constructor () {
    super()
    this.state = {
      user : userStore.getUser()
    }
  }
  componentWillMount () {
    userStore.on('change', () => {
      this.setState({
        user: userStore.getUser()
      })
    })
  }
  
  render() {
    return (
      <div className="container-fluid">
      <div className="row">
        <nav className="col-md-2 d-none d-md-block bg-light sidebar">
          <div className="sidebar-sticky">
            <ul className="nav flex-column">
              <li className="nav-item">
                <a className="nav-link" href="/">
                  <span data-feather="file"></span>
                  Summary
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href={`${this.props.match.url}/`}>
                  <span data-feather="shopping-cart"></span>
                  Collection
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href={`${this.props.match.url}/decks`}>
                  <span data-feather="users"></span>
                  Decks
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href={`${this.props.match.url}/shopping`}>
                  <span data-feather="bar-chart-2"></span>
                  Shopping
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href={`${this.props.match.url}/investment`}>
                  <span data-feather="bar-chart-2"></span>
                  Investment
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href={`${this.props.match.url}/top8deck`}>
                  <span data-feather="layers"></span>
                  Winning Lists
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href={`${this.props.match.url}/comingevents`}>
                  <span data-feather="layers"></span>
                  Upcoming Events
                </a>
              </li>
            </ul>
          </div>
        </nav>

        <main role="main" className="col-md-9 ml-sm-auto col-lg-10 pt-3 px-4">
          <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-2 mb-3 ">
            <h1 className="h2">Dashboard</h1>
          </div>
          <section className="row text-center placeholders">
            <div className="col-4 col-sm-4 placeholder">
              <p className='logo-dashboard'><i className='fas fa-dollar-sign icon-dashboard img-fluid rounded-circle'/></p>
              <h4>Investment</h4>
              <div className="text-muted">Initial investment: {this.state.user.initalInvestment}</div>
              <div className="text-muted">Current Value: {this.state.user.currentValue}</div>
            </div>
            <div className="col-4 col-sm-4 placeholder">
              <p className='logo-dashboard'><i className='fas fa-chart-line icon-dashboard img-fluid rounded-circle'/></p>
              <h4>VALUE EVOLUTION</h4>
              <span className="text-muted">Trend over last month: </span>
            </div>
            <div className="col-4 col-sm-4 placeholder">
              <p className='logo-dashboard'><i className='far fa-clipboard icon-dashboard img-fluid rounded-circle'/></p>
              <h4>Total Number of Cards</h4>
              <span className="text-muted">Value : {this.state.user.nbCardInCollection}</span>
            </div>
          </section>

          <canvas className="my-4" id="myChart" width="900" height="100"></canvas>
          <TableCollection collection={this.state.user.collection}/>
        </main>
      </div>
      <Footer/>
    </div>
    );
  }
}

export default Dashboard;
