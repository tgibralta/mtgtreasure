import React, { Component } from 'react'
import Slider from 'react-slick'
import './Style/Footer.css'


class Footer extends Component {
  render() {
    let settings = {
      dots: false,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1
    } 
    return (
      <div>
        <footer className="page-footer font-small">
          <Slider {...settings}>
            <div>
              <div className="row">
                <div className="col-md-1 col-sm-1">
                  <p>Daily</p>
                </div>
                <div className="col-md-1 col-sm-1">
                  <p>{this.props.trends.trendDay[0].name}: {this.props.trends.trendDay[0].price}$ ({this.props.trends.trendDay[0].trend}) </p>
                </div>
                <div className="col-md-1 col-sm-1">
                  <p>{this.props.trends.trendDay[1].name}: {this.props.trends.trendDay[1].price}$ ({this.props.trends.trendDay[1].trend}) </p>
                </div>
                <div className="col-md-1 col-sm-1">
                  <p>{this.props.trends.trendDay[2].name}: {this.props.trends.trendDay[2].price}$ ({this.props.trends.trendDay[2].trend}) </p>
                </div>
                <div className="col-md-1 col-sm-1">
                  <p>{this.props.trends.trendDay[3].name}: {this.props.trends.trendDay[3].price}$ ({this.props.trends.trendDay[3].trend}) </p>
                </div>
                <div className="col-md-1 col-sm-1">
                  <p>{this.props.trends.trendDay[4].name}: {this.props.trends.trendDay[4].price}$ ({this.props.trends.trendDay[4].trend}) </p>
                </div>
                <div className="col-md-1 col-sm-1">
                  <p>{this.props.trends.trendDay[5].name}: {this.props.trends.trendDay[5].price}$ ({this.props.trends.trendDay[5].trend}) </p>
                </div>
                <div className="col-md-1 col-sm-1">
                  <p>{this.props.trends.trendDay[6].name}: {this.props.trends.trendDay[6].price}$ ({this.props.trends.trendDay[6].trend}) </p>
                </div>
                <div className="col-md-1 col-sm-1">
                  <p>{this.props.trends.trendDay[7].name}: {this.props.trends.trendDay[7].price}$ ({this.props.trends.trendDay[7].trend}) </p>
                </div>
                <div className="col-md-1 col-sm-1">
                  <p>{this.props.trends.trendDay[8].name}: {this.props.trends.trendDay[8].price}$ ({this.props.trends.trendDay[8].trend}) </p>
                </div>
                <div className="col-md-1 col-sm-1">
                  <p>{this.props.trends.trendDay[9].name}: {this.props.trends.trendDay[9].price}$ ({this.props.trends.trendDay[9].trend}) </p>
                </div>
              </div>
            </div>

            <div>
              <div className="row">
                <div className="col-md-1 col-sm-1">
                  <p>Weekly</p>
                </div>
                <div className="col-md-1 col-sm-1">
                  <p>{this.props.trends.trendWeek[0].name}: {this.props.trends.trendWeek[0].price}$ ({this.props.trends.trendWeek[0].trend}) </p>
                </div>
                <div className="col-md-1 col-sm-1">
                  <p>{this.props.trends.trendWeek[1].name}: {this.props.trends.trendWeek[1].price}$ ({this.props.trends.trendWeek[1].trend}) </p>
                </div>
                <div className="col-md-1 col-sm-1">
                  <p>{this.props.trends.trendWeek[2].name}: {this.props.trends.trendWeek[2].price}$ ({this.props.trends.trendWeek[2].trend}) </p>
                </div>
                <div className="col-md-1 col-sm-1">
                  <p>{this.props.trends.trendWeek[3].name}: {this.props.trends.trendWeek[3].price}$ ({this.props.trends.trendWeek[3].trend}) </p>
                </div>
                <div className="col-md-1 col-sm-1">
                  <p>{this.props.trends.trendWeek[4].name}: {this.props.trends.trendWeek[4].price}$ ({this.props.trends.trendWeek[4].trend}) </p>
                </div>
                <div className="col-md-1 col-sm-1">
                  <p>{this.props.trends.trendWeek[5].name}: {this.props.trends.trendWeek[5].price}$ ({this.props.trends.trendWeek[5].trend}) </p>
                </div>
                <div className="col-md-1 col-sm-1">
                  <p>{this.props.trends.trendWeek[6].name}: {this.props.trends.trendWeek[6].price}$ ({this.props.trends.trendWeek[6].trend}) </p>
                </div>
                <div className="col-md-1 col-sm-1">
                  <p>{this.props.trends.trendWeek[7].name}: {this.props.trends.trendWeek[7].price}$ ({this.props.trends.trendWeek[7].trend}) </p>
                </div>
                <div className="col-md-1 col-sm-1">
                  <p>{this.props.trends.trendWeek[8].name}: {this.props.trends.trendWeek[8].price}$ ({this.props.trends.trendWeek[8].trend}) </p>
                </div>
                <div className="col-md-1 col-sm-1">
                  <p>{this.props.trends.trendWeek[9].name}: {this.props.trends.trendWeek[9].price}$ ({this.props.trends.trendWeek[9].trend}) </p>
                </div>
              </div>
            </div>

            <div>
              <div className="row">
                <div className="col-md-1 col-sm-1">
                  <p>Monthly</p>
                </div>
                <div className="col-md-1 col-sm-1">
                  <p>{this.props.trends.trendMonth[0].name}: {this.props.trends.trendMonth[0].price}$ ({this.props.trends.trendMonth[0].trend}) </p>
                </div>
                <div className="col-md-1 col-sm-1">
                  <p>{this.props.trends.trendMonth[1].name}: {this.props.trends.trendMonth[1].price}$ ({this.props.trends.trendMonth[1].trend}) </p>
                </div>
                <div className="col-md-1 col-sm-1">
                  <p>{this.props.trends.trendMonth[2].name}: {this.props.trends.trendMonth[2].price}$ ({this.props.trends.trendMonth[2].trend}) </p>
                </div>
                <div className="col-md-1 col-sm-1">
                  <p>{this.props.trends.trendMonth[3].name}: {this.props.trends.trendMonth[3].price}$ ({this.props.trends.trendMonth[3].trend}) </p>
                </div>
                <div className="col-md-1 col-sm-1">
                  <p>{this.props.trends.trendMonth[4].name}: {this.props.trends.trendMonth[4].price}$ ({this.props.trends.trendMonth[4].trend}) </p>
                </div>
                <div className="col-md-1 col-sm-1">
                  <p>{this.props.trends.trendMonth[5].name}: {this.props.trends.trendMonth[5].price}$ ({this.props.trends.trendMonth[5].trend}) </p>
                </div>
                <div className="col-md-1 col-sm-1">
                  <p>{this.props.trends.trendMonth[6].name}: {this.props.trends.trendMonth[6].price}$ ({this.props.trends.trendMonth[6].trend}) </p>
                </div>
                <div className="col-md-1 col-sm-1">
                  <p>{this.props.trends.trendMonth[7].name}: {this.props.trends.trendMonth[7].price}$ ({this.props.trends.trendMonth[7].trend}) </p>
                </div>
                <div className="col-md-1 col-sm-1">
                  <p>{this.props.trends.trendMonth[8].name}: {this.props.trends.trendMonth[8].price}$ ({this.props.trends.trendMonth[8].trend}) </p>
                </div>
                <div className="col-md-1 col-sm-1">
                  <p>{this.props.trends.trendMonth[9].name}: {this.props.trends.trendMonth[9].price}$ ({this.props.trends.trendMonth[9].trend}) </p>
                </div>
              </div>
            </div>
          </Slider>
        </footer>
      </div>
    )
  }
}

export default Footer