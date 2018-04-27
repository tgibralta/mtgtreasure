import React, { Component } from 'react'
import {Line} from 'react-chartjs-2';

class ChartPriceHistory extends Component {
  render() {
    return (
      <div>
        <Line data={this.props.chartData} options={{}}/>
      </div>
    )
  }
}

export default ChartPriceHistory