import React, { Component } from 'react'
import './Style/DisplayCardInDeck.css'

class DisplayCardInDeck extends Component {

  ConvertManaCost(props) {
    let manacost = props.manacost
    let array = manacost.split('')
    let arraySymbols = array.map((symbol) => {
      if (symbol !=='{' & symbol !=='}') {
        switch (symbol) {
          case 'C': {
            // return  <i className="far fa-circle circle-grey"/> 
            return <i className="ms ms-c"/>
            break
          }
          case 'U': {
            // return  <i className="far fa-circle circle-blue"/> 
            return <i className="ms ms-u"/>
            break
          }
          case 'W': {
            // return  <i className="far fa-circle circle-white"/> 
            return <i className="ms ms-w"/>
            break
          }
          case 'R': {
            // return  <i className="far fa-circle circle-red"/> 
            return <i className="ms ms-r"/>
            break
          }
          case 'G': {
            // return  <i className="far fa-circle circle-green"/> 
            return <i className="ms ms-g"/>
            break
          }
          case 'B': {
            // return  <i className="far fa-circle circle-black"/> 
            return <i className="ms ms-b"/>
            break
          }
          case 'P': {
            return <i className="ms ms-p"/>
          }
          default : {
            return <i className='ms'>{symbol}</i>
            break
          }
        }
      } else return null
    })
    return arraySymbols
  }

  render() {
    return (
      <div>
        <div className='row'>
          <div className="col-md-1">
            <p>{this.props.number}</p>
          </div>
          <div className="col-md-7">
            <a onClick={this.props.handleClick.bind(this)}>{this.props.name}</a>
          </div>
          <div className="col-md-2">
            {/* <p>{this.props.manacost} </p> */}
            <this.ConvertManaCost manacost={this.props.manacost}/>
          </div>
          <div className="col-md-2">
            <p>{this.props.price} $</p>
          </div>
        </div>
      </div>
    )
  }
}

export default DisplayCardInDeck