import {VisualizationSpec} from 'react-vega';

const TreeMapSpec = {
    "$schema": "https://vega.github.io/schema/vega/v5.json",
    "description": "TODO",
    "width": 960,
    "height": 500,
    "padding": 2.5,
    "autosize": "none",
    "signals": [
        {
            "name": "layout", "value": "squarify",
            "bind": {
                "input": "select",
                "options": [
                    "squarify",
                    "binary",
                    "slicedice"
                ]
            }
        },
        {
            "name": "aspectRatio", "value": 1.6,
            "bind": {"input": "range", "min": 1, "max": 5, "step": 0.1}
        }
    ],
    "scales": [
        {
            "name": "color",
            "type": "ordinal",
            "domain": {"data": "data", "field": "data"},
            "range": [
                "#3182bd", "#6baed6", "#9ecae1", "#c6dbef", "#e6550d",
                "#fd8d3c", "#fdae6b", "#fdd0a2", "#31a354", "#74c476",
                "#a1d99b", "#c7e9c0", "#756bb1", "#9e9ac8", "#bcbddc",
                "#dadaeb", "#636363", "#969696", "#bdbdbd", "#d9d9d9"
            ]
        },
        {
            "name": "size",
            "type": "ordinal",
            "domain": [0, 1, 2, 3],
            "range": [256, 28, 20, 14]
        },
        {
            "name": "opacity",
            "type": "ordinal",
            "domain": [0, 1, 2, 3],
            "range": [0.15, 0.5, 0.8, 1.0]
        }
    ],
    "marks": [
        {
            "type": "rect",
            "from": {"data": "data"},
            "interactive": false,
            "encode": {
                "enter": {
                    "fill": {"scale": "color", "field": "name"}
                },
                "update": {
                    "x": {"field": "x0"},
                    "y": {"field": "y0"},
                    "x2": {"field": "x1"},
                    "y2": {"field": "y1"}
                }
            }
        },
        {
            "type": "rect",
            "from": {"data": "data"},
            "encode": {
                "enter": {
                    "stroke": {"value": "#fff"}
                },
                "update": {
                    "x": {"field": "x0"},
                    "y": {"field": "y0"},
                    "x2": {"field": "x1"},
                    "y2": {"field": "y1"},
                    "fill": {"value": "transparent"}
                },
                "hover": {
                    "fill": {"value": "red"}
                }
            }
        },
        {
            "type": "text",
            "from": {"data": "data"},
            "interactive": false,
            "encode": {
                "enter": {
                    "font": {"value": "Helvetica Neue, Arial"},
                    "align": {"value": "center"},
                    "baseline": {"value": "middle"},
                    "fill": {"value": "#000"},
                    "text": {"field": "name"},
                    "fontSize": {"scale": "size", "field": "depth"},
                    "fillOpacity": {"scale": "opacity", "field": "depth"}
                },
                "update": {
                    "x": {"signal": "0.5 * (datum.x0 + datum.x1)"},
                    "y": {"signal": "0.5 * (datum.y0 + datum.y1)"}
                }
            }
        }
    ]

} as VisualizationSpec;

export default TreeMapSpec;
