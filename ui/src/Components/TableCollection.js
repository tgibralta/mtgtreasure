import React, { Component } from 'react'
import ReactTable from 'react-table'
import 'react-table/react-table.css'
import {DeleteCardFromCollection} from './../Actions/AccountAction'

class TableCollection extends Component {
  allocateData(data) {
    let outputData = []
    // console.log(`Data to be displayed in Table: ${JSON.stringify(data)}`)
    data.forEach((element) => {
      let row = {
        buttons : element,
        image : element.allCardInfo.Scryfall.image_uris.small,
        number : element.allCardInfo.DB.number_of_card,
        name : element.allCardInfo.Scryfall.name,
        set : element.allCardInfo.Scryfall.set,
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

  
  render() {
    const columns = [
    {
      Header: <p className="text-uppercase font-weight-bold">Image</p>,
      accessor: 'image',
      Cell: props => <img height='120' src={props.value}/>,
    },
    {
      Header: <p className="text-uppercase font-weight-bold">#</p>,
      accessor: 'number',
      Cell: props => <p className="text-center text-name">{props.value}</p>,
      width: 50
    },
    {
      Header: <p className="text-uppercase font-weight-bold">Name</p>,
      accessor: 'name',
      Cell: props => <p className="text-center">{props.value}</p>,
      minWidth: 250
    },
    {
      Header: <p className="text-uppercase font-weight-bold">Set</p>,
      accessor: 'set',
      Cell: props => <p className="text-center">{props.value}</p>,
      width: 75
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
            defaultPageSize={5}
          />
        </div>
      </div>
    )
  }
}

export default TableCollection