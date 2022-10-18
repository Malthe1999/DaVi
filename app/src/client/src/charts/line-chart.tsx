import {VisualizationSpec} from 'react-vega';

export default {
    $schema: "https://vega.github.io/schema/vega-lite/v5.json",
    description: "Stock prices of 5 Tech Companies over Time.",
    data: {name: "table"},
    mark: {
        type: "line",
        point: {
            filled: false,
            fill: "white",
        }
    },
    encoding: {
        x: {
            timeUnit: "seconds",
            field: "time"
        },
        y: {
            field: "priority",
            type: "quantitative",
            scale: {
                domain:[0, 150],
            },
        },
        color: {
            field: "symbol",
            type: "nominal"
        },
    },
} as VisualizationSpec;
