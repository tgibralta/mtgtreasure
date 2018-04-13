import React, { Component } from 'react'

class InfoCard extends Component {
  
  render() {

    return (
      <div>
        <h3> {this.props.cardInfo.name} </h3>
        <p> Type: {this.props.cardInfo.type_line} </p>
        <p> Set: {this.props.cardInfo.set_name} ({this.props.cardInfo.set}) </p>
        <p> Current Price: {this.props.cardInfo.usd} $</p>
      </div>
    )
  }
}

export default InfoCard