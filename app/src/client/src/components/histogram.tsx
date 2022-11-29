import { memo, useEffect, useState } from "react";
import Plot from "react-plotly.js";
import { collectionParents, cpuHistogram, cpuResources, memoryResources } from "../gateway/backend";
import { unpack } from "../util/unpack";
import { CircularProgress } from "@mui/material";
import { ResourceTree } from "../structs/resource-tree";
import { HistogramUsage } from "../../../shared/types/histogram-data";

const Histogram = (props: {
  filteredNodes: string[];
  setCurrentlySelectedNode: React.Dispatch<React.SetStateAction<string>>;
  viewedResource: string;
  fromTime: number;
  toTime: number;
  useDifferentColorScales: boolean;
}) => {
  const {
    setCurrentlySelectedNode,
    filteredNodes,
    viewedResource,
    fromTime,
    toTime,
    useDifferentColorScales,
  } = props;
  const [isLoading, setIsLoading] = useState(true);
  const [allResourceUsage, setAllResourceUsage] = useState<HistogramUsage[]>([]);

  useEffect(() => {
    if (viewedResource === "instance") {
      cpuHistogram(0,0, fromTime, toTime)
        .then((res) => setAllResourceUsage(res))
        .finally(() => setIsLoading(false));
    } else {
      console.log("Invalid resource type", viewedResource);
    }
  }, [filteredNodes, viewedResource, fromTime, toTime]);

  return (
    <>
      {isLoading ? (
        <CircularProgress />
      ) : (
        <Plot style={{position:"absolute"}}
          data={[
            {
              values: unpack(allResourceUsage, "average_cpu"),
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
          onUpdate={(x) => {
            setCurrentlySelectedNode(
              (
                (x.data[0] as any)["level"]?.split("-")[0] ?? "Cluster"
              ).toString()
            );
          }}
        />
      )}
    </>
  );
};


export default memo(Histogram);
