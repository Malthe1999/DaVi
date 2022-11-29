import {useEffect, useState} from 'react';
import Plot from 'react-plotly.js';
import {CollectionSizeResponse} from '../../../shared/types/collection-size';
import {allCollectionSizes} from '../gateway/backend';
import {randomNameAdj} from '../util/name-generator';

export const TreeMapwSlider = () => {
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
                      labels: data.data.map(x => randomNameAdj(x.name)),
                      parents: data.data.map(x => ''), // no parents
                      values: data.data.map(x => x.size),
                      type: 'treemap',
                      marker: {colorscale: 'RdBu'}
                    },
                  ]
            }
            layout = {
                {
                    width: 1200,
                    height: 800,
                    sliders: [{
                        pad: {
                          t: 30
                        },
                        currentvalue: {
                          xanchor: 'right',
                          prefix: 'colorscale: ',
                          font: {
                            color: '#888',
                            size: 20
                          }
                        },
                        steps: [{
                          label: 'RdBu',
                          method: 'restyle',
                          args: ['marker.colorscale', 'RdBu']
                        },{
                          label: 'red',
                          method: 'restyle',
                          args: ['marker.colorscale', 'Reds']
                        }, {
                          label: 'hot',
                          method: 'restyle',
                          args: ['marker.colorscale', 'Hot']
                        }, {
                          label: 'blue',
                          method: 'restyle',
                          args: ['marker.colorscale', 'Blues']
                        }, {
                          label: 'green',
                          method: 'restyle',
                          args: ['marker.colorscale', 'Greens']
                        }, {
                            label: 'greyscale',
                            method: 'restyle',
                            args: ['marker.colorscale', 'Greys']
                          }]
                      }]
                }}
          />
        )
      }
    </>
  )
}
