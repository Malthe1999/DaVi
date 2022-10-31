import {VisualizationSpec} from 'react-vega';

export default {
    "$schema": "https://vega.github.io/schema/vega/v5.json",
    "description": "A basic area chart example.",
    "width": 500,
    "height": 200,
    "padding": 5,
    "data": [{"name": "data"}],

    "scales": [
        {
            "name": "x",
            "type": "linear",
            "round": true,
            "nice": true,
            "zero": false,
            "domain": {"data": "data", "field": "start_time"},
            "range": "width"
        },
        {
            "name": "y",
            "type": "linear",
            "round": true,
            "nice": true,
            "zero": true,
            "domain": {"data": "data", "field": "average_mem"},
            "range": "height"
        },
    ],

    "axes": [
        {
            "scale": "x",
            "orient": "bottom",
            "tickCount": 5,
            "title": "Time"
            
        },
        {
            "scale": "y",
            "grid": true,
            "domain": false,
            "orient": "left",
            "titlePadding": 5,
            "title": "RAM"
        }
    ],

    "marks": [
        {
            "name": "marks",
            "type": "symbol",
            "from": {"data": "data"},
            "encode": {
                "update": {
                    "x": {"scale": "x", "field": "start_time"},
                    "y": {"scale": "y", "field": "average_mem"},
                    "shape": {"value": "circle"},
                    "strokeWidth": {"value": 1},
                    "stroke": {"value": "#4682b4"},
                    "fill": {"value": "black"}
                }
            }
        }
    ]
} as VisualizationSpec;
