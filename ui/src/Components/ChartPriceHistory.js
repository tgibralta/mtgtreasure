import React, { Component } from 'react'
import {Line} from 'react-chartjs-2'

class ChartPriceHistory extends Component {
  render() {
    return (
      <div>
        <Line data={this.props.chartData} options={
          {
            legend: {
              display: false,
            },
            options: {
              scales: {
                xAxes: [{
                  ticks: {
                    stepSize: 1
                  }
                }]
              }
            }
          }
        }/>
      </div>
    )
  }
}

export default ChartPriceHistory