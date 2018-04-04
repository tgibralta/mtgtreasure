import React, { Component } from 'react'
import ReactTable from 'react-table'
import 'react-table/react-table.css'

class TableCollection extends Component {
  allocateData(data) {
    let outputData = []
    data.forEach((element) => {
      let row = {
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
  allocateNumber
  
  render() {
    const columns = [{
      Header: 'Number',
      accessor: 'number'
    },
    {
      Header: 'Name',
      accessor: 'name'
    },
    {
      Header: 'Set',
      accessor: 'set'
    },
    {
      Header: 'Inital Price ($)',
      accessor: 'initPrice'
    },
    {
      Header: 'Current Price ($)',
      accessor: 'currentPrice'
    },]

    return (
      <div>
        <h2>Collection Overview</h2>
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