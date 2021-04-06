import React, { Component } from 'react';

import * as d3 from 'd3';


//  https://github.com/adamjanes/udemy-d3/blob/master/05/5.08/js/main.js
class ScatterChart extends Component {
    constructor(props) {
      super(props);

      const MARGIN = { LEFT: 100, RIGHT: 10, TOP: 10, BOTTOM: 100 };
      const WIDTH = 800 - MARGIN.LEFT - MARGIN.RIGHT;
      const HEIGHT = 500 - MARGIN.TOP - MARGIN.BOTTOM;

      this.state = {
        MARGIN, WIDTH, HEIGHT,
        flag: true,
        chartElement: {},
        time: 0
      };

      this._g = null;
      this._interval = null;
    }
    
    componentDidMount() {
      this.initializeD3Area();
    }
  
    componentWillUnmount() {
      if( this._interval ) {
        clearInterval(this._interval);
      }
    }

    initializeD3Area = () => {
      const { MARGIN, WIDTH, HEIGHT } = this.state;

      const svg = d3.select("#d3-canvas").append("svg")
        .attr("width", WIDTH + MARGIN.LEFT + MARGIN.RIGHT)
        .attr("height", HEIGHT + MARGIN.TOP + MARGIN.BOTTOM);

      const g = svg.append("g")
        .attr("transform", `translate(${MARGIN.LEFT}, ${MARGIN.TOP})`);

      this._g = g;

      // Scales
      const x = d3.scaleLog()
        .base(10)
        .range([0, WIDTH])
        .domain([142, 150000]);

      const y = d3.scaleLinear()
        .range([HEIGHT, 0])
        .domain([0, 90]);

      const area = d3.scaleLinear()
        .range([25*Math.PI, 1500*Math.PI])
        .domain([2000, 1400000000]);

      const continentColor = d3.scaleOrdinal(d3.schemePastel1);

      // Labels
      g.append("text")
        .attr("y", HEIGHT + 50)
        .attr("x", WIDTH / 2)
        .attr("font-size", "20px")
        .attr("text-anchor", "middle")
        .text("GDP Per Capita ($)");

      g.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -40)
        .attr("x", -170)
        .attr("font-size", "20px")
        .attr("text-anchor", "middle")
        .text("Life Expectancy (Years)");

      const timeLabel = g.append("text")
        .attr("y", HEIGHT - 10)
        .attr("x", WIDTH - 40)
        .attr("font-size", "40px")
        .attr("opacity", "0.4")
        .attr("text-anchor", "middle")
        .text("1800");

      // X Axis
      const xAxisCall = d3.axisBottom(x)
        .tickValues([400, 4000, 40000])
        .tickFormat(d3.format("$"));

      g.append("g")
        .attr("class", "x axis")
        .attr("transform", `translate(0, ${HEIGHT})`)
        .call(xAxisCall);

      // Y Axis
      const yAxisCall = d3.axisLeft(y);

      g.append("g")
        .attr("class", "y axis")
        .call(yAxisCall);

      const continents = ["europe", "asia", "americas", "africa"];

      const legend = g.append("g")
        .attr("transform", `translate(${WIDTH - 10}, ${HEIGHT - 125})`);

      continents.forEach((continent, i) => {
        const legendRow = legend.append("g")
          .attr("transform", `translate(0, ${i * 20})`);

        legendRow.append("rect")
          .attr("width", 10)
          .attr("height", 10)
          .attr("fill", continentColor(continent));

        legendRow.append("text")
          .attr("x", -10)
          .attr("y", 10)
          .attr("text-anchor", "end")
          .style("text-transform", "capitalize")
          .text(continent);
      });

      this.setState({ chartElement:{ x, y, timeLabel, area, continentColor } });

      d3.json("https://raw.githubusercontent.com/adamjanes/udemy-d3/master/06/6.02/data/data.json")
        .then(this.handleData);
    }

    handleData = (data) => {
      console.log('data', data);
      // clean data
      const formattedData = data.map(year => {
        return year["countries"].filter(country => {
          const dataExists = (country.income && country.life_exp);
          return dataExists;
        }).map(country => {
          country.income = Number(country.income);
          country.life_exp = Number(country.life_exp);
          return country;
        });
      });

      this.setState({ formattedData, time:0 });

      // first run of the visualization
      this.updateDS3Chart(0);
    }

    updateDS3Chart = (time) => {
      const { chartElement, formattedData } = this.state;
      const { x, y, timeLabel, area, continentColor } = chartElement;
      const data = formattedData[time];

      // standard transition time for the visualization
      const t = d3.transition()
        .duration(100);

      const g = this._g;

      // JOIN new data with old elements.
      const circles = g.selectAll("circle")
        .data(data, d => d.country);

      // EXIT old elements not present in new data.
      circles.exit().remove();

      // ENTER new elements present in new data.
      circles.enter().append("circle")
        .attr("fill", d => continentColor(d.continent))
        .merge(circles)
        .transition(t)
          .attr("cy", d => y(d.life_exp))
          .attr("cx", d => x(d.income))
          .attr("r", d => Math.sqrt(area(d.population) / Math.PI));

      // update the time label
      timeLabel.text(String(time + 1800));

      this.setState({ time });
    }

    handleClick = (inc) => () => {
      if( this._interval ) {
        clearInterval(this._interval);
        this._interval = null;
      }

      const { time } = this.state;
      this.updateDS3Chart( Math.min(Math.max(0, time + inc), 214) );
    }

    handleGoing = () => {
      if( this._interval ) {
        clearInterval(this._interval);
        this._interval = null;
        return;
      }

      this._interval = setInterval(() => {
        const { time } = this.state;
        if( time >= 214) {
          clearInterval(this._interval);
          this._interval = null;
        } else {
          this.updateDS3Chart( time + 1 );
        }
      }, 200);
    }

    render() {
      return (
        <div>
          <div id="d3-canvas" />
          <div>
            <button onClick={this.handleClick(-1)}>Prev</button>
            <button onClick={this.handleClick( 1)}>Next</button>
            <button onClick={this.handleGoing}>Going</button>
          </div>
        </div>
      )
    }
}


export default ScatterChart;
export { ScatterChart };
