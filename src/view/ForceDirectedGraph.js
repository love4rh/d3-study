import React, { Component } from 'react';

import * as d3 from 'd3';

import nodes from '../data/nodes.json';
import links from '../data/links.json';



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
class ForceDirectedGraph extends Component {
    constructor (props) {
      super(props);

      this.state = {
        width: 600,
        height: 600
      };
    }
  
    componentDidMount() {
      this.initializeD3Area();
    }
  
    componentWillUnmount() {
      //
    }

    initializeD3Area = () => {
      const { width, height } = this.state;
      
      const simulation = d3.forceSimulation(nodes)
        .force("link", d3.forceLink(links).id(d => d.id))
        .force("charge", d3.forceManyBody())
        .force("center", d3.forceCenter(width / 2, height / 2));

      const svg = d3.select('#d3-panel')
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
        .attr("stroke-width", (d) => Math.sqrt(d.value));
      
      const scale = d3.scaleOrdinal(d3.schemeCategory10);

      const node = svg.append("g")
        .attr("stroke", "#444")
        .attr("stroke-width", 1.5)
        .selectAll("circle")
        .data(nodes)
        .join("circle")
        .attr("r", 5)
        .attr("fill", (d) => scale(d.group))
        .call(drag(simulation));

      node.append("title")
        .text((d) => d.id);
      
      simulation.on("tick", () => {
        link
          .attr("x1", (d) => d.source.x)
          .attr("y1", (d) => d.source.y)
          .attr("x2", (d) => d.target.x)
          .attr("y2", (d) => d.target.y);

        node
          .attr("cx", (d) => d.x)
          .attr("cy", (d) => d.y);
      });
    }

    render() {
      return (
        <div id="d3-panel" />
      )
    }
}


export default ForceDirectedGraph;
export { ForceDirectedGraph };
