import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import BarChart from './BarChart';
import {VegaLite} from 'react-vega';
import {Vega} from 'react-vega';
import ScatterPlot from './ScatterPlot';
import collection_events from './borg_sample/collection_events.json'

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
const barData = {
  name: "table",
  values: collection_events,
}
root.render(
  <React.StrictMode>
    <App />
    <Vega spec={BarChart} data = {barData}></Vega>
    <Vega spec={ScatterPlot} data = {barData} ></Vega>
  </React.StrictMode>
  
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
