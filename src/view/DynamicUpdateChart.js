import React, { Component } from 'react';

import * as d3 from 'd3';


//  https://github.com/adamjanes/udemy-d3/blob/master/05/5.08/js/main.js
class DynamicUpdateChart extends Component {
    constructor(props) {
      super(props);

      const MARGIN = { LEFT: 100, RIGHT: 10, TOP: 10, BOTTOM: 100 };
      const WIDTH = 600 - MARGIN.LEFT - MARGIN.RIGHT;
      const HEIGHT = 400 - MARGIN.TOP - MARGIN.BOTTOM;

      this.state = {
        MARGIN, WIDTH, HEIGHT,
        flag: true,
        chartElement: {}
      }  
    }
    
    componentDidMount() {
      this.initializeD3Area();
    }
  
    componentWillUnmount() {
      if( this._interval ) {
        this._interval.stop();
      }
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
        .attr("y", HEIGHT + 60)
        .attr("font-size", "20px")
        .attr("text-anchor", "middle")
        .text("Month");

      this._g = g;

      // Y label
      const yLabel = g.append("text")
        .attr("class", "y axis-label")
        .attr("x", - (HEIGHT / 2))
        .attr("y", -60)
        .attr("font-size", "20px")
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)");

      const x = d3.scaleBand()
        .range([0, WIDTH])
        .paddingInner(0.3)
        .paddingOuter(0.2);

      const y = d3.scaleLinear()
        .range([HEIGHT, 0]);

      const xAxisGroup = g.append("g")
        .attr("class", "x axis")
        .attr("transform", `translate(0, ${HEIGHT})`);

      const yAxisGroup = g.append("g")
        .attr("class", "y axis");

      this.setState({ chartElement:{ x, y, yLabel, xAxisGroup, yAxisGroup } });

      d3.csv("https://raw.githubusercontent.com/adamjanes/udemy-d3/master/03/3.13.1/data/revenues.csv")
        .then(this.handleData);
    }

    handleData = (data) => {
      data.forEach(d => {
        d.revenue = Number(d.revenue);
        d.profit = Number(d.profit);
      });
    
      this._interval = d3.interval(() => {
        const { flag } = this.state;
        const newData = data; // !flag ? data : data.slice(1);

        this.setState({ flag: !flag });
        this.updateDS3Chart(newData);
      }, 3000);
    
      this.updateDS3Chart(data);
    }

    updateDS3Chart = (data) => {
      const { flag, chartElement } = this.state;
      const { x, y, yLabel, xAxisGroup, yAxisGroup } = chartElement;

      const value = flag ? "profit" : "revenue";
      const t = d3.transition().duration(750);
    
      x.domain(data.map(d => d.month));
      y.domain([0, d3.max(data, d => d[value])]);
    
      const xAxisCall = d3.axisBottom(x);
      xAxisGroup.transition(t).call(xAxisCall)
        .selectAll("text")
          .attr("y", "10")
          .attr("x", "-5")
          .attr("text-anchor", "end")
          .attr("transform", "rotate(-40)");
    
      const yAxisCall = d3.axisLeft(y)
        .ticks(4)
        .tickFormat(d => "$" + d);

      yAxisGroup.transition(t).call(yAxisCall);
    
      // JOIN new data with old elements.
      const rects = this._g.selectAll("circle")
        .data(data, d => d.month);
    
      // EXIT old elements not present in new data.
      rects.exit()
        .attr("fill", "red")
        .transition(t)
          .attr("cy", y(0))
          .remove();
    
      // ENTER new elements present in new data...
      rects.enter().append("circle")
        .attr("fill", "grey")
        .attr("cy", y(0))
        .attr("r", 5)
        // AND UPDATE old elements present in new data.
        .merge(rects)
        .transition(t)
          .attr("cx", (d) => x(d.month) + (x.bandwidth() / 2))
          .attr("cy", d => y(d[value]));
    
      yLabel.text(flag ? "Profit ($)" : "Revenue ($)");
    }

    render() {
      return (
        <div id="d3-canvas" />
      )
    }
}


export default DynamicUpdateChart;
export { DynamicUpdateChart };
