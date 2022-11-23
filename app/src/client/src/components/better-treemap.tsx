import {useEffect, useState} from 'react';
import Plot from 'react-plotly.js';
import {CollectionSizeResponse} from '../../../shared/types/collection-size';
import {CollectionSpreadResponse} from '../../../shared/types/collection-spread';
import {CpuUsage, CpuUsageResponse} from '../../../shared/types/cpu-usage';
import {allCollectionSizes, allCollectionSpread, allCpuUsage} from '../gateway/backend';
import {randomName} from '../util/name-generator';
import chroma from "chroma-js";
import e from 'express';
import instanceMapping from './instance_count_per_collection.json'

const colourscale = chroma.scale('YlGnBu').domain([0,25.8389654971])
function unpack(rows: any, key: any) {
  return rows.map(function (row: any) {return row[key]});
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
  const mappingArray:any = new Map(Object.entries(instanceMapping));
  var temp: CpuUsage;
  useEffect(() => {
    setIsLoading(true);
    allCpuUsage().then((value) => {
      let tempdata1: Array<CpuUsage> = [];
      value.data.forEach((element) => {
        temp = {
          cpuusage: element.cpuusage,
          id: element.id,
          colid: element.colid,
          tempval: element.tempval/mappingArray.get(String(element.colid)),
          color: 'red'
        };
        tempdata1.push(temp);
      })
      setData({data: tempdata1})
    }, (reason) => {
      console.log(reason)
    });
    allCollectionSpread().then((value2) => {
      setData2(value2)
      let data4: Array<CpuUsage> = [];
      temp = {
        cpuusage: 0,
        id: 'Total',
        colid: '',
        tempval: 0,
        color: 'red'
      };
      
      data4.push(temp);
      value2.data.forEach((element) => {
        temp = {
          cpuusage: element.cpuusageTotal,
          id: element.id,
          colid: 'Total',
          tempval: 0,
          color: colourscale(Math.log(element.cpuusageTotal)).hex()
        };
          console.log(temp.cpuusage)
          data4.push(temp);
      })
      setData3({data: data4})
      setIsLoading(false);
    }, (reason) => {
      console.log(reason)
    });
  }, []);

  if (data == undefined || data3 == undefined) {
    return (<></>);
  }

  let final = [...data.data, ...data3.data];
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
                  labels: unpack(final, 'id'),
                  parents: unpack(final, 'colid'), // no parents
                  values: unpack(final, 'tempval'),
                  type: 'treemap',
                  branchvalues: 'remainder',
                  maxdepth: 2,
                  marker: {colors: unpack(final, 'color')}
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
