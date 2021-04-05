import React, { Component } from 'react';

import * as d3 from 'd3';



/**
 * https://observablehq.com/@d3/learn-d3-scales?collection=@d3/learn-d3
 */
class HorizontalBarChart extends Component {
    constructor (props) {
      super(props);

      this.state = {
        width: 800,
        height: 500,
        margin: { left:30, right:30, top:30, bottom: 30 }
      };
    }
  
    componentDidMount() {
      this.initializeD3Area();
    }
  
    componentWillUnmount() {
      //
    }

    initializeD3Area = () => {
      const { width, height, margin } = this.state;

      const fruits = [
        { "name": "🍊", "count": 21 },
        { "name": "🍇", "count": 13 },
        { "name": "🍏", "count": 8 },
        { "name": "🍌", "count": 5 },
        { "name": "🍐", "count": 3 },
        { "name": "🍋", "count": 2 },
        { "name": "🍎", "count": 1 },
        { "name": "🍉", "count": 1 }
      ];

      const svg = d3.select('#d3-panel')
        .append('svg')
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .attr("viewBox", [0, 0, width, height])
      ;

      const x = d3.scaleLinear()
        .domain([0, d3.max(fruits, d => d.count)])
        .range([margin.left, width - margin.right])
        .interpolate(d3.interpolateRound);
      
      const y = d3.scaleBand()
        .domain(fruits.map(d => d.name))
        .range([margin.top, height - margin.bottom])
        .padding(0.1)
        .round(true);
      
      //
      svg.append("g")
        .call(d3.axisRight(y));

      svg.append("g")
        .call(d3.axisBottom(x));

      svg.append("g")
        .selectAll("rect")
        .data(fruits)
        .enter()
          .append("rect")
            .attr("x", margin.left)
            .attr("y", d => y(d.name))
            .attr("width", d => x(d.count))
            .attr("height", 30);
    }

    render() {
      return (
        <div id="d3-panel" />
      )
    }
}


export default HorizontalBarChart;
export { HorizontalBarChart };
