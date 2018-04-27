import React, { Component } from 'react'
import ReactTable from 'react-table'
import 'react-table/react-table.css'
import {DeleteCardFromCollection} from './../Actions/AccountAction'
import {SearchCardPerName} from './../Actions/SearchAction'

class TableCollection extends Component {
  allocateData(data) {
    let outputData = []
    // console.log(`Data to be displayed in Table: ${JSON.stringify(data)}`)
    data.forEach((element) => {
      let row = {
        buttons : element,
        number : element.allCardInfo.DB.number_of_card,
        name : element.allCardInfo.Scryfall.name,
        set : element.allCardInfo.Scryfall.set_name,
        initPrice : element.allCardInfo.DB.init_price,
        currentPrice : element.allCardInfo.Scryfall.usd
      }
      outputData.push(row)
    })
    return outputData
  }

  handleSubmit(props){
    DeleteCardFromCollection(props)
  }

  onRowClick (state, rowInfo, column, instance){
    return {
      onClick: e => {
        let cardName = rowInfo.row.name
        SearchCardPerName(cardName)
        .then((history) => {
          console.log(`History: ${JSON.stringify(history)}`)
          let uri = history[0].cardInfo.image_uris.normal
          let cardID = history[0].cardInfo.multiverse_ids[0]
          let currentPrice = history[0].cardInfo.usd
          let initPrice = rowInfo.row.initPrice
          let priceHistory = history[0].priceHistory.priceHistory

          console.log(`Image : ${uri}`)
          console.log(`currentPrice : ${currentPrice}`)
          console.log(`initPrice : ${initPrice}`)
          console.log(`history : ${JSON.stringify(priceHistory)}`)
        })
        .catch((errHistory) => {
          console.log(errHistory)
        })
      }
    }
  }
  
  
  render() {
    const columns = [
    {
      Header: <p className="text-uppercase font-weight-bold">#</p>,
      accessor: 'number',
      Cell: props => <p className="text-center text-name">{props.value}</p>,
    },
    {
      Header: <p className="text-uppercase font-weight-bold">Name</p>,
      accessor: 'name',
      Cell: props => <p className="text-center">{props.value}</p>,
    },
    {
      Header: <p className="text-uppercase font-weight-bold">Set</p>,
      accessor: 'set',
      Cell: props => <p className="text-center">{props.value}</p>,
    },
    {
      Header: <p className="text-uppercase font-weight-bold">Inital Price ($)</p>,
      accessor: 'initPrice',
      Cell: props => <p className="text-center">{props.value}</p>
    },
    {
      Header: <p className="text-uppercase font-weight-bold">Current Price ($)</p>,
      accessor: 'currentPrice',
      Cell: props => <p className="text-center">{props.value}</p>
    },
    {
      Header: '',
      accessor: 'buttons',
      Cell: props => <button type="button" class="btn btn-danger btn-small" onClick={this.handleSubmit.bind(this, props.original.buttons)}>X</button>,
    }]

    return (
      <div>
        <h2>List</h2>
        <div className="table-responsive">
          <ReactTable className="table table-striped table-sm"
            data={this.allocateData(this.props.collection)}
            columns={columns}
            defaultPageSize={10}
            getTrProps={this.onRowClick.bind(this)}
          />
        </div>
      </div>
    )
  }
}

export default TableCollection