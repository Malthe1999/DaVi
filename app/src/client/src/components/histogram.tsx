import { memo, useEffect, useState } from "react";
import Plot from "react-plotly.js";
import { collectionParents, cpuResources, memoryResources } from "../gateway/backend";
import { unpack } from "../util/unpack";
import { CircularProgress } from "@mui/material";
import { ResourceTree } from "../structs/resource-tree";
import { ResourceUsage } from "../../../shared/types/resource-usage";

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
  const [dataPoints, setDataPoints] = useState<any[]>([]);
  const [allParents, setAllParents] = useState<{ [key: string]: string }>({});
  const [allResourceUsage, setAllResourceUsage] = useState<ResourceUsage[]>([]);

  useEffect(() => {
    collectionParents().then((x) => {
      const parents: { [key: string]: string } = {};
      for (const relationship of x) {
        parents[relationship.collection_id.toString()] = (
          relationship.parent_collection_id ?? "Cluster"
        ).toString();
      }
      setAllParents(parents);
    });
  }, []);

  useEffect(() => {
    if (viewedResource === "cpu") {
      cpuResources(filteredNodes, fromTime, toTime)
        .then((res) => setAllResourceUsage(res))
        .finally(() => setIsLoading(false));
    } else if (viewedResource === "mem") {
      memoryResources(filteredNodes, fromTime, toTime)
        .then((res) => setAllResourceUsage(res))
        .finally(() => setIsLoading(false));
    } else {
      console.log("Invalid resource type", viewedResource);
    }
  }, [filteredNodes, viewedResource, fromTime, toTime]);

  useEffect(() => {
    const tree = new ResourceTree("Cluster");
    for (const x of allResourceUsage) {
      tree.addEdge(
        allParents[x.collection_id],
        collection(x),
        undefined,
        "collection"
      );
      tree.addEdge(collection(x), machine(x), undefined, "machine");
      tree.addEdge(machine(x), instance(x), x.resource_usage, "instance");
    }
    setDataPoints(tree.toDataPoints(useDifferentColorScales));
  }, [allResourceUsage, allParents, useDifferentColorScales]);

  return (
    <>
      {isLoading ? (
        <CircularProgress />
      ) : (
        <Plot
          data={[
            {
              values: [],
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

const collection = (x: ResourceUsage) => {
  return x.collection_id;
};
const machine = (x: ResourceUsage) => {
  return `${x.collection_id}-${x.machine_id}`;
};
const instance = (x: ResourceUsage) => {
  return `${x.collection_id}-${x.machine_id}-${x.instance_index}`;
};

export default memo(Histogram);