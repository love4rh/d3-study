import React, { Component } from 'react';

import * as d3 from 'd3';

import './RunningChart.scss';


/**
 * props
 * timeFormat: timeData 시간 포맷. basisData가 숫자라면 unix time으로 처리함. ("%m/%d/%Y %H:%M:%S %p")("1/2/2014 8:22:05 AM")
 * timeData: ['yyyy-mm-dd HH:MM:SS', ...] or [unix time, ...]
 * chartData: { 'dataName#1': [value, ...], 'dataName#2': [value, ...], ... }
 * 
 * timeData 없으면 데이터 인덱스를 시간축 값으로 사용
 * chartData 내 데이터 배열의 크기는 동일해야 함. 다르면 짧은 쪽에 맞춤
 * chartData 내 데이터 배열과 basisData 내 배열의 크기를 같아야 함. 다르면 짧은 쪽에 맞춰 차팅함.
 */
class RunningChart extends Component {
  constructor(props) {
    super(props);

    const MARGIN = { LEFT: 100, RIGHT: 100, TOP: 50, BOTTOM: 100 };

    const { timeLabel, valueLabel, timeFormat, timeData, chartData } = props;

    const parseTime = d3.timeParse(timeFormat);
    const basisData = timeData.map(d => parseTime(d));

    const data = Object.keys(chartData).map(k => {
      return { 'name': k, 'values': chartData[k] };
    });

    this.state = {
      MARGIN,
      timeLabel, valueLabel,
      data, basisData,
      chartElement: {}
    };

    this._chartDiv = React.createRef();
  }
  
  componentDidMount() {
    const {
      offsetTop,
      offsetLeft,
      offsetWidth,
      offsetHeight
    } = this._chartDiv.current;

    console.log('component size',
      'offsetTop', offsetTop,
      'offsetLeft', offsetLeft,
      'offsetWidth', offsetWidth,
      'offsetHeight', offsetHeight
    ); // */


    this.initializeD3Area(offsetWidth, offsetHeight);
  }

  componentWillUnmount() {
    if( this._interval ) {
      this._interval.stop();
    }
  }

  initializeD3Area = (WIDTH, HEIGHT) => {
    const { valueLabel, timeLabel, MARGIN, timeFormat } = this.state;

    const svg = d3.select(this._chartDiv.current).append("svg")
      .attr("width", WIDTH + MARGIN.LEFT + MARGIN.RIGHT)
      .attr("height", HEIGHT + MARGIN.TOP + MARGIN.BOTTOM);

    const g = svg.append("g")
      .attr("transform", `translate(${MARGIN.LEFT}, ${MARGIN.TOP})`);

    this._g = g;

    const parseTime = d3.timeParse(timeFormat);
    const formatTime = d3.timeFormat("%Y-%m-%d");

    // for tooltip
    const bisectDate = d3.bisector(d => d).left;

    // add the line for the first time
    g.append("path")
      .attr("class", "line")
      .attr("fill", "none")
      .attr("stroke", "grey")
      .attr("stroke-width", "3px");

    // x axis labels
    g.append("text")
      .attr("class", "x axisLabel")
      .attr("y", HEIGHT + 50)
      .attr("x", WIDTH / 2)
      .attr("font-size", "20px")
      .attr("text-anchor", "middle")
      .text(timeLabel);

    // y axis labels
    g.append("text")
      .attr("class", "y axisLabel")
      .attr("transform", "rotate(-90)")
      .attr("y", -60)
      .attr("x", -170)
      .attr("font-size", "20px")
      .attr("text-anchor", "middle")
      .text(valueLabel);

    // scales
    const x = d3.scaleTime().range([0, WIDTH]);
    const y = d3.scaleLinear().range([HEIGHT, 0]);

    // axis generators
    const xAxisCall = d3.axisBottom();

    const yAxisCall = d3.axisLeft()
      .ticks(6)
      .tickFormat(d => `${parseInt(d / 1000)}k`);

    // axis groups
    const xAxis = g.append("g")
      .attr("class", "x axis")
      .attr("transform", `translate(0, ${HEIGHT})`);

    const yAxis = g.append("g")
      .attr("class", "y axis");

    const chartElement = { parseTime, formatTime, bisectDate, x, y, xAxisCall, yAxisCall, xAxis, yAxis };
    this.setState({ WIDTH, HEIGHT, chartElement });

    this.updateDS3Chart(WIDTH, HEIGHT, chartElement);
  }

  updateDS3Chart = (WIDTH, HEIGHT, chartElement) => {
    const { data, basisData, MARGIN } = this.state;
    const { bisectDate, x, y, xAxisCall, yAxisCall, xAxis, yAxis } = chartElement;

    const t = d3.transition().duration(1000);
  
    x.domain(d3.extent(basisData, d => d));

    let valueMinMax = null;

    data.map(d => {
      const mm = d3.extent(d.values);
      if( valueMinMax === null ) {
        valueMinMax = mm;
      } else {
        valueMinMax[0] = Math.min(valueMinMax[0], mm[0]);
        valueMinMax[1] = Math.max(valueMinMax[1], mm[1]);
      }
      return 0;
    });

    y.domain(valueMinMax);

    const formatSi = d3.format(".2s");

    xAxisCall.scale(x);
    xAxis.transition(t).call(xAxisCall)
      .selectAll("text")
      .attr("y", "10")
      .attr("x", "-5")
      .attr("text-anchor", "end")
      .attr("transform", "rotate(-45)");

    yAxisCall.scale(y);
    yAxis.transition(t).call(yAxisCall.tickFormat((xv) => {
      const s = formatSi(xv);
      switch( s[s.length - 1] ) {
        case "G": return s.slice(0, -1) + "B"; // billions
        case "K": return s.slice(0, -1) + "K"; // thousands
        default: break;
      };
      return s;
    }));

    // yAxis.style("display", "none");
  
    d3.select(".focus").remove();
    d3.select(".overlay").remove();

    const g = this._g;
    const focus = g.append("g")
      .attr("class", "focus")
      .style("display", "none");

    focus.append("line")
      .attr("class", "x-hover-line hover-line")
      .attr("y1", 0)
      .attr("y2", HEIGHT);
  
    focus.append("line")
      .attr("class", "y-hover-line hover-line")
      .attr("x1", 0)
      .attr("x2", WIDTH);
  
    focus.append("circle")
      .attr("r", 7.5);
  
    focus.append("text")
      .attr("x", 15)
      .attr("dy", ".31em");
  
    g.append("rect")
      .attr("class", "overlay")
      .attr("width", WIDTH)
      .attr("height", HEIGHT)
      .on("mouseover", () => focus.style("display", null))
      .on("mouseout", () => focus.style("display", "none"))
      .on("mousemove", (ev) => {
        const x0 = x.invert(ev.offsetX - MARGIN.LEFT);
        const i = bisectDate(basisData, x0, 1);
        const d0 = basisData[i - 1];
        const d1 = basisData[i];
        if( !d0 || !d1 ) {
          return;
        }
        const idx = x0 - d0 > d1 - x0 ? i : i - 1;
        const val = data[0].values[idx];

        focus.attr("transform", `translate(${x(basisData[idx])}, ${y(val)})`);
        focus.select("text").text(val);
        focus.select(".x-hover-line").attr("y2", HEIGHT - y(val));
        focus.select(".y-hover-line").attr("x2", -x(basisData[idx]));
      });
    
    // Path generator
    const line = d3.line()
      .x((_, i) => x(basisData[i]))
      .y(d => y(d));

    // Update our line path
    g.select(".line")
      .transition(t)
      .attr("d", line(data[0].values));
  }

  render() {
    return (
      <div ref={this._chartDiv} className="chartMainDiv" />
    )
  }
}


export default RunningChart;
export { RunningChart };
