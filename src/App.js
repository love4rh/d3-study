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

import { RunningChart } from './view/RunningChart.js';

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
      'Activity0215', 'DynamicUpdateChart', 'ScatterChart', 'LineTooltipChart', 'NetworkChart',
      'RunningChart'
    ];

    const timeData = ["14/5/2013", "15/5/2013", "16/5/2013", "17/5/2013", "18/5/2013", "19/5/2013", "20/5/2013", "21/5/2013", "22/5/2013", "23/5/2013", "24/5/2013", "25/5/2013", "26/5/2013", "27/5/2013", "28/5/2013", "29/5/2013", "30/5/2013", "31/5/2013", "1/6/2013", "2/6/2013", "3/6/2013", "4/6/2013", "5/6/2013", "6/6/2013", "7/6/2013", "8/6/2013", "9/6/2013", "10/6/2013", "11/6/2013", "12/6/2013", "13/6/2013", "14/6/2013", "15/6/2013", "16/6/2013", "17/6/2013", "18/6/2013", "19/6/2013", "20/6/2013", "21/6/2013", "22/6/2013", "23/6/2013", "24/6/2013", "25/6/2013", "26/6/2013", "27/6/2013", "28/6/2013", "29/6/2013", "30/6/2013", "1/7/2013", "2/7/2013", "3/7/2013", "4/7/2013", "5/7/2013", "6/7/2013", "7/7/2013", "8/7/2013", "9/7/2013", "10/7/2013", "11/7/2013", "12/7/2013", "13/7/2013", "14/7/2013", "15/7/2013", "16/7/2013", "17/7/2013", "18/7/2013", "19/7/2013", "20/7/2013", "21/7/2013", "22/7/2013", "23/7/2013", "24/7/2013", "25/7/2013", "26/7/2013", "27/7/2013", "28/7/2013", "29/7/2013", "30/7/2013", "31/7/2013", "1/8/2013", "2/8/2013", "3/8/2013", "4/8/2013", "5/8/2013", "6/8/2013", "7/8/2013", "8/8/2013", "9/8/2013", "10/8/2013", "11/8/2013", "12/8/2013", "13/8/2013", "14/8/2013", "15/8/2013", "16/8/2013", "17/8/2013", "18/8/2013", "19/8/2013", "20/8/2013", "21/8/2013"];
    const runningData = [135.3, 141.96, 135.3, 117, 103.43, 91.01, 111.25, 116.79, 118.33, 106.4, 112.64, 113, 118.78, 113.01, 114.713, 117.18, 114.5, 114.156, 115.5, 123.1, 123.88, 120.501, 122.58, 122.9, 123, 125.748, 131.7, 130.77, 134.6, 128.985, 129.179, 132.13, 127.401, 127.98, 129.09, 121.3, 121.16, 121.309, 121.714, 119, 110.09, 108.401, 99.7497, 105.99, 108.9, 108.4, 102.769, 98.399, 99.99, 100.42, 102, 106.55, 107.9, 110.91, 109.015, 107.25, 108, 102.443, 103.691, 103.39, 99.66, 93.3311, 95.3886, 97.504, 89.489, 90.797, 78.8, 78.48, 67.809, 68.0831, 77.502, 76.3915, 77, 85.75, 93.804, 88.0622, 95.58, 94, 97.301, 98.9796, 97.8, 88.7869, 91.572, 89.28, 90.3672, 91.7024, 94.5806, 94.525, 96.9499, 94.13, 94.005, 98.5759, 101.5, 110.34, 106.23, 101.61, 103.7, 104.86, 106.56, 105.841];

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
        { viewNo === 10 &&
          <div style={{ width:'1000px', height:'640px' }}>
            <RunningChart timeFormat={'%m/%d/%Y'} timeData={timeData} chartData={{ 'data#1':runningData }} timeLabel={'시간'} valueLabel={'가격'} />
          </div>
        }
      </div>
    );
  }
}

export default App;
