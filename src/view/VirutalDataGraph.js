import React, { Component } from 'react';

import * as d3 from 'd3';


//  https://www.udemy.com/course/masteringd3js/learn/lecture/8082036#overview
class VirutalDataGraph extends Component {
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

      const rawData = [
        {
          "name": "Burj Khalifa",
          "height": 350
        },
        {
          "name": "Shanghai Tower",
          "height": 263.34
        },
        {
          "name": "Abraj Al-Bait Clock Tower",
          "height": 254.04
        },
        {
          "name": "Lotte World Tower",
          "height": 230.16
        }
      ];

      const virtualData = {
        get: (i) => i >= rawData.length ? rawData[0].height : rawData[i].height,
        size: () => rawData.length * 2
      };

      const dataSize = {
        length: virtualData.size()
      };

      svg.selectAll('rect')
        .data(dataSize)
        .enter()
          .append('rect')
          .attr('y', 0)
          .attr('x', (_, i) => (i * 60))
          .attr('width', 40)
          .attr('height', (_, i) => virtualData.get(i))
          .attr('fill', 'grey')
      ;
    }

    render() {
      return (
        <div id="d3-canvas" />
      )
    }
}


export default VirutalDataGraph;
export { VirutalDataGraph };

