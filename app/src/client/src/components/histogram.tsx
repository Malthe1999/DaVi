import { memo, useEffect, useState } from "react";
import Plot from "react-plotly.js";
import { collectionParents, cpuHistogram, cpuResources, memoryResources } from "../gateway/backend";
import { unpack } from "../util/unpack";
import { CircularProgress } from "@mui/material";
import { ResourceTree } from "../structs/resource-tree";
import { HistogramUsage } from "../../../shared/types/histogram-data";

const Histogram = (props: {
  fromTime: number;
  toTime: number;
  showHistogram: number[];
}) => {
  const {
    fromTime,
    toTime,
    showHistogram
  } = props;
  const [isLoading, setIsLoading] = useState(true);
  const [allHistogram, setAllHistogram] = useState<HistogramUsage[]>([]);

  useEffect(() => {
    if (showHistogram.length === 3) {
      cpuHistogram(showHistogram[0],showHistogram[2], fromTime, toTime)
        .then((res) => setAllHistogram(res))
        .finally(() => setIsLoading(false));
    } else {
      setAllHistogram([])
      setIsLoading(true)
    }
  }, [showHistogram[0], showHistogram[2], fromTime, toTime]);
  return (
    <>
      {isLoading ? (
        <div/>
      ) : (
        <Plot
          data={[
            {
              opacity: 0.4,
              x: unpack(allHistogram, "average_cpu"),
              type: "histogram",
              histnorm: "",
            },
          ]}
          layout={{
            width: 880,
            height: 620,
            xaxis: {
              "title": "Resource usage"
            },
            yaxis: {
              "title": "Count"
            },
          }}
        />
      )}
    </>
  );
};


export default memo(Histogram);
