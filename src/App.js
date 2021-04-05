import React, { Component } from 'react';

import { D3View } from './view/D3View.js';
import { HorizontalBarChart } from './view/HorizontalBarChart.js';
import { ForceDirectedGraph } from './view/ForceDirectedGraph.js';

import { VirutalDataGraph } from './view/VirutalDataGraph.js';

import { Activity0215 } from './view/Activity0215.js';

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
    const samples = ['working', 'HorizontalBarChart', 'ForceDirectedGraph', 'VirutalDataGraph', 'Activity0215'];

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
        { viewNo === 4 && <Activity0215 /> }
      </div>
    );
  }
}

export default App;
