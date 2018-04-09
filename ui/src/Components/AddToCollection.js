import React, { Component } from 'react'
const AddCardToCollection = require('./../Actions/AccountAction').AddCardToCollection

class AddToCollection extends Component {

  handleSubmit() {
    let nbCard = 0
    let price = 0
    if (document.getElementById('inputNumberCard')) {
      nbCard = document.getElementById('inputNumberCard').value
    }
    if (document.getElementById("inputInitPrice")) {
      price = document.getElementById("inputInitPrice").value
    }
    AddCardToCollection(this.props.user.userID, this.props.cardInfo.multiverse_ids[0], price, nbCard, this.props.cardInfo)
    .then(() => {
      console.log(`Value Sent`)
    })
  }

  render() {
    return (
      <div class="form-group">
        <label >Number</label>
        <select class="form-control" id="inputNumberCard" defaultValue='0'>
          <option>0</option>
          <option>1</option>
          <option>2</option>
          <option>3</option>
          <option>4</option>
          <option>5</option>
          <option>6</option>
          <option>7</option>
          <option>8</option>
          <option>9</option>
        </select>
        <div class="form-group">
          <label >Price when Acquired</label>
          <input class="form-control" id="inputInitPrice"   placeholder={this.props.cardInfo.usd} type="number" step="0.01" defaultValue={this.props.cardInfo.usd}/>
        </div>
        <button type="button" class="btn btn-primary btn-block" onClick={this.handleSubmit.bind(this)}>Add to Collection</button>
      </div>
    )
  }
}

export default AddToCollection