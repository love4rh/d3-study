import React, { Component } from 'react';

import { D3View } from './view/D3View.js';
import { HorizontalBarChart } from './view/HorizontalBarChart.js';
import { ForceDirectedGraph } from './view/ForceDirectedGraph.js';

import { VirutalDataGraph } from './view/VirutalDataGraph.js';

import { Activity0215 } from './view/Activity0215.js';

import { VerticalBarChart } from './view/VerticalBarChart.js';
import { DynamicUpdateChart } from './view/DynamicUpdateChart.js';
import { ScatterChart } from './view/ScatterChart.js';
import { LineTooltipChart } from './view/LineTooltipChart.js';

import { NetworkChart } from './view/NetworkChart.js';

import './App.css';


class App extends Component {
  constructor (props) {
    super(props);

    this.state = {
      viewNo: 0
    };
  }

  handleChange = (ev) => {
    this.setState({ viewNo: Number(ev.target.value) });
  }

  render () {
    const { viewNo } = this.state;
    const samples = [
      'working', 'HorizontalBarChart', 'ForceDirectedGraph', 'VirutalDataGraph', 'VerticalBarChart',
      'Activity0215', 'DynamicUpdateChart', 'ScatterChart', 'LineTooltipChart', 'NetworkChart'
    ];

    return (
      <div className="App">
        <div>
          <select name="viewType" id="viewTypes" onChange={this.handleChange}>
            { samples.map((o, i) => <option key={`view-${i}`} value={i}>{o}</option>) }
          </select>
        </div>
        { viewNo === 0 && <D3View /> }
        { viewNo === 1 && <HorizontalBarChart /> }
        { viewNo === 2 && <ForceDirectedGraph /> }
        { viewNo === 3 && <VirutalDataGraph /> }
        { viewNo === 4 && <VerticalBarChart /> }
        { viewNo === 5 && <Activity0215 /> }
        { viewNo === 6 && <DynamicUpdateChart /> }
        { viewNo === 7 && <ScatterChart /> }
        { viewNo === 8 && <LineTooltipChart /> }
        { viewNo === 9 && <NetworkChart /> }
      </div>
    );
  }
}

export default App;
