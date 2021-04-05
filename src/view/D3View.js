import React, { Component } from 'react';

import * as d3 from 'd3';



class D3View extends Component {
    constructor (props) {
      super(props);
  
      this._refEditor = React.createRef();
    }
  
    componentDidMount() {
      this.initializeD3Area();
    }
  
    componentWillUnmount() {
      //
    }

    initializeD3Area = () => {
      const margin = { top: 10, right: 40, bottom: 30, left: 30 },
        width = 450 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

      const svg = d3.select('#d3-panel')
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`);
      ;

      // const n = 100;
      // const genRandom = d3.randomNormal(0, 0.2);
      // const data = d3.range(n).map(genRandom);

      const x = d3.scaleLinear().domain([0, 100]).range([0, width]);
      const y = d3.scaleLinear().domain([0, 100]).range([height, 0]);

      svg.append('g').attr('transform', `translate(0, ${height})`).call(d3.axisBottom(x));
      svg.append('g').call(d3.axisLeft(y));

      const data = [ {x:10, y:20}, {x:40, y:90}, {x:80, y:50} ];

      svg.selectAll('whatever').data(data).enter().append('circle').attr('cx', (d) => x(d.x)).attr('cy', (d) => y(d.y)).attr('r', 7);
    }

    render() {
      return (
        <div id="d3-panel" />
      )
    }
}


export default D3View;
export { D3View };
