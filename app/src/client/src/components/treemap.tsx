import {Vega} from 'react-vega';
import {useEffect, useState} from 'react';
import {allCollectionSizes} from "../gateway/backend";
import {CollectionSizeResponse} from '../../../shared/types/collection-size';
import TreeMapSpec from '../charts/treemap';
import Plotly from "plotly.js";
import createPlotlyComponent from "react-plotly.js/factory";
const Plot = createPlotlyComponent(Plotly);


const CollectionSizes = () => {
    const [data, setData] = useState<CollectionSizeResponse>({
        data: [],
    });
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        allCollectionSizes().then((value) => {
            setData(value)
            setIsLoading(false);
        }, (reason) => {
            console.log(reason)
        });
    }, []);
    const data1 = [
        {
            x: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
            y: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
            mode: "lines",
        },
    ];
    const layout = {title: "Chart Title"};

    return (
        <>
        <Plot data={data1} layout={layout} />
            {isLoading ? (
                <div>...Loading</div>
            ) : (
                <Vega spec={TreeMapSpec} data={data}></Vega>
            )}
        </>
    );
}

export default CollectionSizes;
