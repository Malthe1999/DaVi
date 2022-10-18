import {Vega} from 'react-vega';
import {useEffect, useState} from 'react';
import {collectionEventByCollectionId} from "../gateway/backend";
import LineChartExample from '../charts/line-chart';
import {CollectionEventResponse} from '../../../shared/types/collection-event';

const Chart = () => {
    const [data, setData] = useState<CollectionEventResponse>({
        table: [],
    });
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        collectionEventByCollectionId(400133700345).then((value) => {
            setData(value)
            setIsLoading(false);
        }, (reason) => {
            console.log(reason)
        });
    }, []);

    return (
        <>
            {isLoading ? (
                <div>...Data Loading.....</div>
            ) : (
                <Vega spec={LineChartExample} data={data}></Vega>
            )}
        </>
    );
}

export default Chart;
