import {useEffect, useState} from 'react';
import Plot from 'react-plotly.js';
import {CollectionSizeResponse} from '../../../shared/types/collection-size';
import { CollectionSpreadResponse } from '../../../shared/types/collection-spread';
import { CpuUsage, CpuUsageResponse } from '../../../shared/types/cpu-usage';
import {allCollectionSizes, allCollectionSpread, allCpuUsage} from '../gateway/backend';
import {randomName} from '../util/name-generator';
function unpack(rows:any, key:any) {
  return rows.map(function(row:any) { return row[key]});
}

export const TreeMapNot = () => {
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

  return (
    <>
      {
        isLoading ? (
          <div>...Loading</div >
        ) : (
          <Plot
            data={
              [
                {
                  labels: data.data.map(x => randomName(x.name)),
                  parents: data.data.map(x => ''), // no parents
                  values: data.data.map(x => x.size),
                  type: 'treemap',
                },
              ]
            }
            layout={{width: 1200, height: 800, title: 'TODO: Change this title'}}
          />
        )
      }
    </>
  )
}
export const TreeMap = () => {
  const [data, setData] = useState<CpuUsageResponse>({
    data: [],
  });
  const [data2, setData2] = useState<CollectionSpreadResponse>({
    data: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [data3, setData3] = useState<CpuUsageResponse>({
    data: [],
  });
  var temp:CpuUsage;
  useEffect( () => {
    setIsLoading(true);
    allCpuUsage().then((value) => {
      setData(value)
    }, (reason) => {
      console.log(reason)
    });
  allCollectionSpread().then((value2) => {
    setData2(value2)
    let data4 = []
    data2.data.forEach( (element) => 
      temp = {
        cpuusage: 0.00000001,
        id: element.id,
        colid: ''
      },
      data4.push(temp),
    )
    console.log("SETTING");
    setData3({data: data4})
    setIsLoading(false);
  }, (reason) => {
    console.log(reason)
    });
  }, []);
  console.log("ONE TIME")
  console.log(data3.data)

  return (
    <>
      {
        isLoading ? (
          <div>...Loading</div >
        ) : (
          <Plot
            data={
              [
                {
                  labels: unpack(data3.data, 'id'),
                  parents: unpack(data3.data, 'colid'), // no parents
                  values: unpack(data3.data, 'colid'),
                  type: 'treemap',
                },
              ]
            }
            layout={{width: 1200, height: 800, title: 'TODO: Change this title'}}
          />
        )
      }
    </>
  )
}

