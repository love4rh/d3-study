import React, { Component } from 'react';

import * as d3 from 'd3';


//  https://github.com/adamjanes/udemy-d3/blob/master/03/3.13.1/js/main.js
class VerticalBarChart extends Component {
    constructor(props) {
      super(props);

      const MARGIN = { LEFT: 100, RIGHT: 10, TOP: 10, BOTTOM: 130 };
      const WIDTH = 600 - MARGIN.LEFT - MARGIN.RIGHT;
      const HEIGHT = 400 - MARGIN.TOP - MARGIN.BOTTOM;

      this.state = {
        MARGIN, WIDTH, HEIGHT
      }  
    }
    
    componentDidMount() {
      this.initializeD3Area();
    }
  
    componentWillUnmount() {
      //
    }

    initializeD3Area = () => {
      const { MARGIN, WIDTH, HEIGHT } = this.state;

      const svg = d3.select("#d3-canvas").append("svg")
        .attr("width", WIDTH + MARGIN.LEFT + MARGIN.RIGHT)
        .attr("height", HEIGHT + MARGIN.TOP + MARGIN.BOTTOM);

      const g = svg.append("g")
        .attr("transform", `translate(${MARGIN.LEFT}, ${MARGIN.TOP})`);

      // X label
      g.append("text")
        .attr("class", "x axis-label")
        .attr("x", WIDTH / 2)
        .attr("y", HEIGHT + 50)
        .attr("font-size", "20px")
        .attr("text-anchor", "middle")
        .text("Month");

      // Y label
      g.append("text")
        .attr("class", "y axis-label")
        .attr("x", - (HEIGHT / 2))
        .attr("y", -60)
        .attr("font-size", "20px")
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        .text("Revenue ($)");

      const dataPath = "https://raw.githubusercontent.com/adamjanes/udemy-d3/master/03/3.13.1/data/revenues.csv";

      d3.csv(dataPath).then(data => {
        data.forEach(d => {
          d.revenue = Number(d.revenue)
        });

        const x = d3.scaleBand()
          .domain(data.map(d => d.month))
          .range([0, WIDTH])
          .paddingInner(0.3)
          .paddingOuter(0.2);

        const y = d3.scaleLinear()
          .domain([0, d3.max(data, d => d.revenue)])
          .range([HEIGHT, 0]);

        const xAxisCall = d3.axisBottom(x);

        g.append("g")
          .attr("class", "x axis")
          .attr("transform", `translate(0, ${HEIGHT})`)
          .call(xAxisCall)
          .selectAll("text")
            .attr("y", "10")
            .attr("x", "-5")
            .attr("text-anchor", "end")
            .attr("transform", "rotate(-40)");

        const yAxisCall = d3.axisLeft(y)
          .ticks(4)
          .tickFormat(d => d + "m");

        g.append("g")
          .attr("class", "y axis")
          .call(yAxisCall);

        const rects = g.selectAll("rect")
          .data(data);

        rects.enter().append("rect")
          .attr("y", d => y(d.revenue))
          .attr("x", (d) => x(d.month))
          .attr("width", x.bandwidth())
          .attr("height", d => HEIGHT - y(d.revenue))
          .attr("fill", "grey");
      });
    }

    render() {
      return (
        <div id="d3-canvas" />
      )
    }
}


export default VerticalBarChart;
export { VerticalBarChart };
