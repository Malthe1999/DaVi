import {Vega} from 'react-vega';
import {useEffect, useState} from 'react';
import {instanceUsageByMachineId} from "../gateway/backend";
import RENAMEME4242 from '../charts/collection';
import {InstanceUsageResponse} from '../../../shared/types/instance-usage';

const Collection = () => {
    const [data, setData] = useState<InstanceUsageResponse>({
        table: [],
    });
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        instanceUsageByMachineId(939078529).then((value) => {
            setData(value)
            setIsLoading(false);
        }, (reason) => {
            console.log(reason)
        });
    }, []);

    let min = 1;
    for (let x of data.table) {
        if (x.start_time > min) {
            min = x.start_time
        }
    }
    console.log(min)

    return (
        <>
            {isLoading ? (
                <div>...Loading</div>
            ) : (
                <Vega spec={RENAMEME4242} data={data}></Vega>
            )}
        </>
    );
}

export default Collection;
