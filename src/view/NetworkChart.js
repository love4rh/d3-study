import React, { Component } from 'react';

import * as d3 from 'd3';



const nodes = [
  { id: 1, title: 'node#1', group: 1, weight: 10 },
  { id: 2, title: 'node#2', group: 1, weight: 20 },
  { id: 3, title: 'node#3', group: 1, weight: 5 },
  { id: 4, title: 'node#4', group: 1, weight: 15 },
  { id: 5, title: 'node#5', group: 2, weight: 20 },
  { id: 6, title: 'node#6', group: 2, weight: 30 },
  { id: 7, title: 'node#7', group: 2, weight: 20 },
  { id: 8, title: 'node#8', group: 2, weight: 10 },
  { id: 999, title: 'alone node', group: 999, weight: 15 }
];

// Link는 source와 target으로 지정해야 함
const links = [
  { source: 2, target: 1, weight: 1 },
  { source: 2, target: 3, weight: 10 },
  { source: 2, target: 4, weight: 100 },
  { source: 5, target: 6, weight: 1 },
  { source: 5, target: 7, weight: 100 },
  { source: 5, target: 8, weight: 1 }
];


const drag = (simulation) => {
  return d3.drag()
    .on("start", (event) => {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    })
    .on("drag", (event) => {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    })
    .on("end", (event) => {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    });
}



/**
 * https://observablehq.com/@d3/force-directed-graph
 */
class NetworkChart extends Component {
    constructor (props) {
      super(props);

      this.state = {
        width: 600,
        height: 600
      };

      this._chartDiv = React.createRef();
    }
  
    componentDidMount() {
      this.initializeD3Area();
    }
  
    componentWillUnmount() {
      //
    }

    initializeD3Area = () => {
      const { height } = this.state;
      const width = this._chartDiv.current.clientWidth;
      
      // see https://github.com/d3/d3-force
      const simulation = d3.forceSimulation(nodes)
        .force("link", d3.forceLink(links).id(d => d.id).distance(d => 1.5 * (d.source.weight + d.target.weight) ))
        // .force("collide", d3.forceCollide(20).strength(0.5))
        .force("charge", d3.forceManyBody().distanceMin(50))
        .force("center", d3.forceCenter(width / 2, height / 2));

      const svg = d3.select(this._chartDiv.current)
        .append('svg')
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [0, 0, width, height])
      ;
      
      const link = svg.append("g")
        .attr("stroke", "#999")
        .attr("stroke-opacity", 0.6)
        .selectAll("links")
        .data(links)
        .join("line")
        .attr("stroke-width", (d) => Math.sqrt(d.weight));
      
      const scale = d3.scaleOrdinal(d3.schemeCategory10);

      const node = svg.append("g")
        .attr("stroke", "#444")
        .attr("stroke-width", 1.5)
        .selectAll("circle")
        .data(nodes)
        .join("circle")
        .attr("r", d => Math.max(10, d.weight))
        .attr("fill", d => scale(d.group))
        .call(drag(simulation));

      node.append("title")
        .text(d => d.title);

      const texts = svg.append("g")
        .selectAll("text")
        .data(nodes)
        .join("text")
        .attr("fill", "black")
        .attr("x", d => d.x)
        .attr("y", d => d.y + 6)
        .attr("text-anchor", "middle")
        .attr("style", "cursor: pointer;")
        .text(d => d.title)
        .call(drag(simulation));
      
      simulation.on("tick", () => {
        link
          .attr("x1", (d) => d.source.x)
          .attr("y1", (d) => d.source.y)
          .attr("x2", (d) => d.target.x)
          .attr("y2", (d) => d.target.y);

        node
          .attr("cx", (d) => d.x)
          .attr("cy", (d) => d.y);

        texts
          .attr("x", d => d.x)
          .attr("y", d => d.y + 6);
      });
    }

    render() {
      return (
        <div ref={this._chartDiv} style={{ backgroundColor:'lightgray' }} />
      )
    }
}


export default NetworkChart;
export { NetworkChart };
