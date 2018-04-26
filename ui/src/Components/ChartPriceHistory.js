import React, { Component } from 'react'
import {Line} from 'react-chartjs-2';

class ChartPriceHistory extends Component {

  // constructor () {
  //   super()
  //   this.state = {
  //     chartData : {
  //       labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  //       datasets: [
  //         {
  //           label: 'Price History',
  //           data:[
  //             150,
  //             151,
  //             152,
  //             150,
  //             149,
  //             220,
  //             150,
  //             151,
  //             152,
  //             150,
  //             149,
  //             220
  //           ]
  //         }
  //       ]
  //     }
  //   }
  // }
  
  render() {
    return (
      <div>
        <Line data={this.props.chartData} options={{}}/>
      </div>
    )
  }
}

export default ChartPriceHistory