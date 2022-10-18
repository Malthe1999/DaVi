import {Vega} from 'react-vega';
import {useEffect, useState} from 'react';
import {getCollectionEvent} from "../gateway/backend";
import BarChart from '../charts/line-chart';
import {CollectionEventResponse} from '../../../shared/types/collection-event';

const Chart = () => {
    const [data, setData] = useState<CollectionEventResponse>({
        data: [],
    });
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        getCollectionEvent(400133700345).then((value) => {
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
                <div className='App-header' >
                    <h1>
                        TODO: Chart
                    </h1>
                    <div className="card" >
                        <Vega spec={BarChart} data={data}></Vega>
                    </div>
                </div>
            )}
        </>
    );
}

export default Chart;
