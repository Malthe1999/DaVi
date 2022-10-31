import {useEffect, useState} from 'react';
import Plot from 'react-plotly.js';
import {CollectionSizeResponse} from '../../../shared/types/collection-size';
import {allCollectionSizes} from '../gateway/backend';
import {randomName} from '../util/name-generator';

export const TreeMap = () => {
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
