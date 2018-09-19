import React,       { Component } from 'react'
import Slider from 'react-slick'
import PopupCardTop10 from './PopupCardTop10'
import './Style/Top10Component.css'

class Top10Component extends Component {

  

  render() {
    let settings = {
      dots: false,
      infinite: true,
      speed: 2000,
      slidesToShow: 5,
      slidesToScroll: 1,
      autoplaySpeed: 500,
      autoplay: true,
      adaptiveHeight: true,
    }
    return (
        <Slider {...settings}>
          <p className="text-center" onClick={this.props.popup.bind(this, this.props.trends.trendDay[0])}><strong>{this.props.trends.trendDay[0].Scryfall.name}: </strong>{this.props.trends.trendDay[0].Scryfall.usd}$ (<green>+{this.props.trends.trendDay[0].trend}% Today</green>)</p>
          <p className="text-center" onClick={this.props.popup.bind(this, this.props.trends.trendDay[1])}><strong>{this.props.trends.trendDay[1].Scryfall.name}: </strong>{this.props.trends.trendDay[1].Scryfall.usd}$ (<green>+{this.props.trends.trendDay[1].trend}% Today</green>)</p>
          <p className="text-center" onClick={this.props.popup.bind(this, this.props.trends.trendDay[2])}><strong>{this.props.trends.trendDay[2].Scryfall.name}: </strong>{this.props.trends.trendDay[2].Scryfall.usd}$ (<green>+{this.props.trends.trendDay[2].trend}% Today</green>)</p>
          <p className="text-center" onClick={this.props.popup.bind(this, this.props.trends.trendDay[3])}><strong>{this.props.trends.trendDay[3].Scryfall.name}: </strong>{this.props.trends.trendDay[3].Scryfall.usd}$ (<green>+{this.props.trends.trendDay[3].trend}% Today</green>)</p>
          <p className="text-center" onClick={this.props.popup.bind(this, this.props.trends.trendDay[4])}><strong>{this.props.trends.trendDay[4].Scryfall.name}: </strong>{this.props.trends.trendDay[4].Scryfall.usd}$ (<green>+{this.props.trends.trendDay[4].trend}% Today</green>)</p>

          <p className="text-center" onClick={this.props.popup.bind(this, this.props.trends.trendWeek[0])}><strong>{this.props.trends.trendWeek[0].Scryfall.name}: </strong>{this.props.trends.trendWeek[0].Scryfall.usd}$ (<green>+{this.props.trends.trendWeek[0].trend}% Today</green>)</p>
          <p className="text-center" onClick={this.props.popup.bind(this, this.props.trends.trendWeek[1])}><strong>{this.props.trends.trendWeek[1].Scryfall.name}: </strong>{this.props.trends.trendWeek[1].Scryfall.usd}$ (<green>+{this.props.trends.trendWeek[1].trend}% Today</green>)</p>
          <p className="text-center" onClick={this.props.popup.bind(this, this.props.trends.trendWeek[2])}><strong>{this.props.trends.trendWeek[2].Scryfall.name}: </strong>{this.props.trends.trendWeek[2].Scryfall.usd}$ (<green>+{this.props.trends.trendWeek[2].trend}% Today</green>)</p>
          <p className="text-center" onClick={this.props.popup.bind(this, this.props.trends.trendWeek[3])}><strong>{this.props.trends.trendWeek[3].Scryfall.name}: </strong>{this.props.trends.trendWeek[3].Scryfall.usd}$ (<green>+{this.props.trends.trendWeek[3].trend}% Today</green>)</p>
          <p className="text-center" onClick={this.props.popup.bind(this, this.props.trends.trendWeek[4])}><strong>{this.props.trends.trendWeek[4].Scryfall.name}: </strong>{this.props.trends.trendWeek[4].Scryfall.usd}$ (<green>+{this.props.trends.trendWeek[4].trend}% Today</green>)</p>

          <p className="text-center" onClick={this.props.popup.bind(this, this.props.trends.trendMonth[0])}><strong>{this.props.trends.trendMonth[0].Scryfall.name}: </strong>{this.props.trends.trendMonth[0].Scryfall.usd}$ (<green>+{this.props.trends.trendMonth[0].trend}% Today</green>)</p>
          <p className="text-center" onClick={this.props.popup.bind(this, this.props.trends.trendMonth[1])}><strong>{this.props.trends.trendMonth[1].Scryfall.name}: </strong>{this.props.trends.trendMonth[1].Scryfall.usd}$ (<green>+{this.props.trends.trendMonth[1].trend}% Today</green>)</p>
          <p className="text-center" onClick={this.props.popup.bind(this, this.props.trends.trendMonth[2])}><strong>{this.props.trends.trendMonth[2].Scryfall.name}: </strong>{this.props.trends.trendMonth[2].Scryfall.usd}$ (<green>+{this.props.trends.trendMonth[2].trend}% Today</green>)</p>
          <p className="text-center" onClick={this.props.popup.bind(this, this.props.trends.trendMonth[3])}><strong>{this.props.trends.trendMonth[3].Scryfall.name}: </strong>{this.props.trends.trendMonth[3].Scryfall.usd}$ (<green>+{this.props.trends.trendMonth[3].trend}% Today</green>)</p>
          <p className="text-center" onClick={this.props.popup.bind(this, this.props.trends.trendMonth[4])}><strong>{this.props.trends.trendMonth[4].Scryfall.name}: </strong>{this.props.trends.trendMonth[4].Scryfall.usd}$ (<green>+{this.props.trends.trendMonth[4].trend}% Today</green>)</p>
        </Slider>
    )
  }
}

export default Top10Component