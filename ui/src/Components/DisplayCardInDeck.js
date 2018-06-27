import React, { Component } from 'react'
import './Style/DisplayCardInDeck.css'
import PopupCard from './PopupCard'

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
            let classMana = 'ms ms-' + {symbol}
            return <i className={classMana }>{symbol}</i>
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
          <div className="col-md-2">
            <p>{this.props.cardInfo.number}</p>
          </div>
          <div className="col-md-7">
            <PopupCard name={this.props.cardInfo.name} uri={this.props.cardInfo.uri} price={this.props.cardInfo.price}/>
          </div>
          <div className="col-md-3">
            <this.ConvertManaCost manacost={this.props.manacost}/>
          </div>
          {/* <div className="col-md-2">
            <this.ConvertManaCost manacost={this.props.manacost}/>
          </div>
          <div className="col-md-2">
            <p>{this.props.price} $</p>
          </div> */}
        </div>
      </div>
    )
  }
}

export default DisplayCardInDeck