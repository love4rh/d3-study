import React, { Component } from 'react';

import * as d3 from 'd3';


//  https://www.udemy.com/course/masteringd3js/learn/lecture/8082036#overview
class Activity0215 extends Component {
    componentDidMount() {
      this.initializeD3Area();
    }
  
    componentWillUnmount() {
      //
    }

    initializeD3Area = () => {
      const svg = d3.select('#d3-canvas')
        .append('svg')
        .attr('width', 400)
        .attr('height', 400)
      ;

      const dataPath = 'https://raw.githubusercontent.com/adamjanes/udemy-d3/master/02/2.08.0/data/buildings.json';

      d3.json(dataPath).then(data => {
        // 문자 --> 숫자
        data.forEach(d => {
          d.height = Number(d.height)
        });

        svg.selectAll('rect')
          .data(data)
          .enter()
            .append('rect')
            .attr('y', 0)
            .attr('x', (_, i) => (i * 60))
            .attr('width', 40)
            .attr('height', d => d.height)
            .attr('fill', 'grey')
        ;
      });
    }

    render() {
      return (
        <div id="d3-canvas" />
      )
    }
}


export default Activity0215;
export { Activity0215 };

