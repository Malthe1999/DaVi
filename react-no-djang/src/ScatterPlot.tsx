import {VisualizationSpec} from 'react-vega';

export default {
  "$schema": "https://vega.github.io/schema/vega/v5.json",
  "description": "A basic scatter plot example depicting automobile statistics.",
  "width": 200,
  "height": 200,
  "padding": 5,

  "data": [
    {
      "name": "source",
      "url": "data/borg_sample/collection_events.json",
      "transform": [
        {
          "type": "filter",
          "expr": "datum['time'] != null && datum['priority'] != null && datum['type'] != null"
        }
      ]
    }
  ],

  "scales": [
    {
      "name": "x",
      "type": "linear",
      "round": true,
      "nice": true,
      "zero": true,
      "domain": {"data": "source", "field": "time"},
      "range": "width"
    },
    {
      "name": "y",
      "type": "linear",
      "round": true,
      "nice": true,
      "zero": true,
      "domain": {"data": "source", "field": "priority"},
      "range": "height"
    },
    {
      "name": "size",
      "type": "linear",
      "round": true,
      "nice": false,
      "zero": true,
      "domain": {"data": "source", "field": "type"},
      "range": [4,361]
    }
  ],

  "axes": [
    {
      "scale": "x",
      "grid": true,
      "domain": false,
      "orient": "bottom",
      "tickCount": 5,
      "title": "time"
    },
    {
      "scale": "y",
      "grid": true,
      "domain": false,
      "orient": "left",
      "titlePadding": 5,
      "title": "priority"
    }
  ],

  "legends": [
    {
      "size": "size",
      "title": "type",
      "format": "s",
      "symbolStrokeColor": "#4682b4",
      "symbolStrokeWidth": 2,
      "symbolOpacity": 0.5,
      "symbolType": "circle"
    }
  ],

  "marks": [
    {
      "name": "marks",
      "type": "symbol",
      "from": {"data": "source"},
      "encode": {
        "update": {
          "x": {"scale": "x", "field": "time"},
          "y": {"scale": "y", "field": "priority"},
          "size": {"scale": "size", "field": "type"},
          "shape": {"value": "circle"},
          "strokeWidth": {"value": 2},
          "opacity": {"value": 0.5},
          "stroke": {"value": "#4682b4"},
          "fill": {"value": "transparent"}
        }
      }
    }
  ]
} as VisualizationSpec;
