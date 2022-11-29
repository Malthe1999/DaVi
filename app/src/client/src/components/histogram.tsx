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
  const [allHistogram, setAallHistogram] = useState<HistogramUsage[]>([]);

  useEffect(() => {
    if (showHistogram.length === 3) {
      cpuHistogram(showHistogram[0],showHistogram[2], fromTime, toTime)
        .then((res) => setAallHistogram(res))
        .finally(() => setIsLoading(false));
    } else {
      setAallHistogram([])
      console.log("Invalid resource type");
    }
  }, [showHistogram[0], showHistogram[2], fromTime, toTime]);
  return (
    <>
      {isLoading ? (
        <CircularProgress />
      ) : (
        <Plot
          data={[
            {
              x: unpack(allHistogram, "average_cpu"),
              type: "histogram",
            },
          ]}
          layout={{
            width: 800,
            height: 800,
            margin: {
              b: 0,
              l: 0,
              r: 0,
              t: 0,
              pad: 0,
            },
          }}
        />
      )}
    </>
  );
};


export default memo(Histogram);
