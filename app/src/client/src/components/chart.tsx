import {Vega} from 'react-vega';
import {useEffect, useState} from 'react';
import {getData} from "../gateway/backend";
import BarChart from '../charts/line-chart';

const Chart = () => {
    const [data, setData] = useState({
        data: [],
    });
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        getData<any>("collection-event").then((value) => {
            value.data.sort();
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
