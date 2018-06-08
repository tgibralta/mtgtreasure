import React, { Component } from 'react'
import FontAwesome from 'react-fontawesome'
import './Style/Footer.css'


class Footer extends Component {
  render() {
    return (
      <div>
        <footer className="page-footer font-small stylish-color-dark pt-4 mt-4">
          <div className="container">
            <div className="row">
              <div className="col-md-3">
              </div>
              <div className="col-md-2">
                <p>Contacts</p>
              </div>
              <div className="col-md-2">
                <p>Partners</p>
              </div>
              <div className="col-md-2">
                <p>Developers</p>
              </div>
              <div className="col-md-3">
                
              </div>
            </div>
          </div>
        </footer>
      </div>
    )
  }
}

export default Footer