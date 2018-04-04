import React, { Component } from 'react'
import FontAwesome from 'react-fontawesome'
import './Style/Footer.css'


class Footer extends Component {
  render() {
    return (
      <div>
        <footer className="page-footer font-small stylish-color-dark pt-4 mt-4">
          <div className="text-center">
            <ul className="list-unstyled list-inline">
              <li className="list-inline-item">
                <a className="btn-floating btn-sm btn-fb mx-1">
                  <FontAwesome name="fas fa-facebook-square"/>
                </a>
              </li>
              <li className="list-inline-item">
                <a className="btn-floating btn-sm btn-tw mx-1">
                  <FontAwesome name="fa fa-twitter icon-social"/>
                </a>
              </li>
              <li className="list-inline-item">
                <a className="btn-floating btn-sm btn-gplus mx-1">
                  <FontAwesome name="fa fa-google-plus icon-social"/>
                </a>
              </li>
              <li className="list-inline-item">
                <a className="btn-floating btn-sm btn-li mx-1">
                  <FontAwesome name="fa fa-instagram icon-social"/>
                </a>
              </li>
            </ul>
          </div>
          <div className ="footer-copyright py-3 text-center">
            © 2018 Copyright:
            <a className= "copyright-link" href="/"> MTGTreasure </a>
          </div>
        </footer>
      </div>
    )
  }
}

export default Footer