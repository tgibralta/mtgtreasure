import React, { Component } from 'react'
import ReactTable from 'react-table'
import 'react-table/react-table.css'
import {DeleteCardFromCollection} from './../Actions/AccountAction'
import {SearchCardPerName} from './../Actions/SearchAction'
import './Style/TableCollection.css'

class TableCollection extends Component {
  allocateData(data) {
    let outputData = []
    
    data.forEach((element) => {
      // let trend = element.trend
      let trend = Math.ceil(100 * (element.allCardInfo.Scryfall.usd - element.allCardInfo.DB.init_price)/element.allCardInfo.DB.init_price)
      let row = {
        buttons : element,
        number : element.allCardInfo.DB.number_of_card,
        name : element.allCardInfo.Scryfall.name,
        // set : element.allCardInfo.Scryfall.set_name,
        // initPrice : element.allCardInfo.DB.init_price,
        currentPrice : element.allCardInfo.Scryfall.usd,
        trend: trend
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
          // console.log(`History: ${JSON.stringify(history)}`)
          let uri = history[0].cardInfo.image_uris.normal
          let cardID = history[0].cardInfo.multiverse_ids[0]
          let currentPrice = history[0].cardInfo.usd
          let initPrice = rowInfo.row.initPrice
          let priceHistory = history[0].priceHistory.priceHistory
          let nameCard = rowInfo.row.name

          // console.log(`Image : ${uri}`)
          // console.log(`currentPrice : ${currentPrice}`)
          // console.log(`initPrice : ${initPrice}`)
          // console.log(`history : ${JSON.stringify(priceHistory)}`)
          // console.log(`Name: ${nameCard}`)

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
      Header: <i className="fab fa-slack-hash icon-dashboard fa-3x"></i>,
      accessor: 'number',
      Cell: props => <p className="text-center text-name">{props.value}</p>,
      minWidth: "10vh"
    },
    {
      Header: <i class="fas fa-info icon-dashboard fa-3x"></i>,
      accessor: 'name',
      Cell: props => <p className="text-center">{props.value}</p>,
      filterable: true,
      minWidth: "10vh"
    },
    {
      Header: <i class="fas fa-dollar-sign icon-dashboard fa-3x"></i>,
      accessor: 'currentPrice',
      Cell: props => <p className="text-center">{props.value}</p>,
      minWidth: "10vh"
    },
    {
      Header: <i class="fas fa-chart-line icon-dashboard fa-3x"></i>,
      accessor: 'trend',
      Cell: props => <div style={{
        backgroundColor:  props.value > 0 ? "#a3e4d7" :
                          props.value < 0 ? "#f1948a" :  "#d6eaf8"
      }}><p className="text-center">{props.value} %</p> </div>,
      minWidth: "10vh",
       

    },
    {
      Header: '',
      accessor: 'buttons',
      Cell: props => <button className="btn btn-lg btn-block btn-primary btn-signin" onClick={this.handleSubmit.bind(this, props.original.buttons)}><i class="far fa-trash-alt"></i></button>,
      minWidth: "10vh"
    }]

    return (
      <div>
        <div className="table-responsive">
          <ReactTable className="table table-striped table-sm"
            data={this.allocateData(this.props.collection)}
            columns={columns}
            defaultPageSize={10}
            getTrProps={this.onRowClick.bind(this)}
            defaultSorted={[
            {
              id: "currentPrice",
              desc: true
            }
          ]}
          defaultPageSize={10}
          className="-striped -highlight"
          />
        </div>
      </div>
    )
  }
}

export default TableCollection