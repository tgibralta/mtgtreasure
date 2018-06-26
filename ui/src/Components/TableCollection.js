import React, { Component } from 'react'
import ReactTable from 'react-table'
import 'react-table/react-table.css'
import {DeleteCardFromCollection} from './../Actions/AccountAction'
import {SearchCardPerName} from './../Actions/SearchAction'
import './Style/TableCollection.css'
import PopupCardCollection from './PopupCardCollection'

class TableCollection extends Component {
  allocateData(data) {
    let outputData = []
    
    data.forEach((element) => {
      // let trend = element.trend
      console.log(`CARD OBJECT IN TABLE COLLECTION: ${JSON.stringify(element)}`)
      let trend = Math.ceil(100 * (element.allCardInfo.Scryfall.usd - element.allCardInfo.DB.init_price)/element.allCardInfo.DB.init_price)


      let labels = element.allCardInfo.DB.priceHistory.map(function(x, index) {
        let splitDate = x.date.split("/")
          return splitDate[1]
      })
      let data = element.allCardInfo.DB.priceHistory.map(function(x) {
        return x.price
      })
      let chartData = {
        labels: labels,
        datasets: [
          {
            borderColor: '#154360',
            label: '$',
            data: data,
            display: false,
          }
        ]
      }
      let row = {
        buttons : element,
        number : element.allCardInfo.DB.number_of_card,
        name : {
          name: element.allCardInfo.Scryfall.name,
          uri: element.allCardInfo.Scryfall.image_uris.normal,
          price: element.allCardInfo.Scryfall.usd,
          trend: trend,
          initPrice: element.allCardInfo.DB.init_price,
          chartData: chartData
        },
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
      // Cell: props => <p className="text-center">{props.value}</p>,
      Cell: props => <PopupCardCollection name={props.value.name} uri={props.value.uri} price={props.value.price} initPrice={props.value.initPrice} chartData={props.value.chartData} trend={props.value.trend}/>,
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