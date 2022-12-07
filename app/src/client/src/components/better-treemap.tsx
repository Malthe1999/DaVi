import { memo, useEffect, useState } from "react";
import Plot from "react-plotly.js";
import {
  collectionParents,
  cpuResources,
  getCollectionAttributes,
  memoryResources,
} from "../gateway/backend";
import { unpack } from "../util/unpack";
import { CircularProgress } from "@mui/material";
import { ResourceTree } from "../structs/resource-tree";
import { ResourceUsage } from "../../../shared/types/resource-usage";

const TreeMap = (props: {
  filteredNodes: string[];
  setCurrentlySelectedNode: React.Dispatch<React.SetStateAction<string>>;
  viewedResource: string;
  fromTime: number;
  toTime: number;
  useDifferentColorScales: boolean;
  setShowHistogram: React.Dispatch<React.SetStateAction<number[]>>;
  setEventFilters: React.Dispatch<React.SetStateAction<string[]>>;
  nameMap: { [key: string]: string };
  reverseNameMap: { [key: string]: string };
}) => {
  const {
    setCurrentlySelectedNode,
    filteredNodes,
    viewedResource,
    fromTime,
    toTime,
    useDifferentColorScales,
    setShowHistogram,
    setEventFilters,
    nameMap,
    reverseNameMap,
  } = props;
  const [isLoading, setIsLoading] = useState(true);
  const [dataPoints, setDataPoints] = useState<any[]>([]);
  const [allParents, setAllParents] = useState<{ [key: string]: string }>({});
  const [collectionAttributes, setCollectionAttributes] = useState<{
    [key: string]: string;
  }>({});
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
    getCollectionAttributes().then((res) => {
      const collectionAttributes: { [key: string]: string } = {}; // TODO fix type
      for (const collectionAttribute of res) {
        collectionAttributes[collectionAttribute.id?.toString()] =
          collectionAttribute.information_listing?.toString();
      }
      setCollectionAttributes(collectionAttributes);
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
    const tree = new ResourceTree("Cluster", nameMap);
    for (const x of allResourceUsage) {
      tree.addEdge(
        allParents[x.collection_id],
        collection(x),
        undefined,
        "collection",
        collectionAttributes[x.collection_id.toString()]
      );
      tree.addEdge(
        collection(x),
        machine(x),
        undefined,
        "machine",
        ""
      );
      tree.addEdge(
        machine(x),
        instance(x),
        x.resource_usage,
        "instance",
        x.information_listing
      );
    }
    setDataPoints(tree.toDataPoints(useDifferentColorScales));
  }, [
    allResourceUsage,
    allParents,
    useDifferentColorScales,
    collectionAttributes,
  ]);

  return (
    <>
      {isLoading ? (
        <CircularProgress />
      ) : (
        <Plot
          style={{ position: "absolute" }}
          data={[
            {
              labels: unpack(dataPoints, "label"),
              ids: unpack(dataPoints, "id"),
              parents: unpack(dataPoints, "parent"), // no parents
              values: unpack(dataPoints, "nodeSize"),
              type: "treemap",
              branchvalues: "remainder",
              maxdepth: 2,
              marker: { colors: unpack(dataPoints, "color") },
              hovertext: unpack(dataPoints, "informationListing"),
              hoverinfo: "text",
            },
          ]}
          layout={{
            width: 900,
            height: 650,
            margin: {
              b: 0,
              l: 0,
              r: 0,
              t: 0,
              pad: 0,
            },
          }}
          onUpdate={(x) => {
            if ((x.data[0] as any)["level"] === "Cluster") {
              setEventFilters([]);
            } else {
              setEventFilters((x.data[0] as any)["level"]?.split("-"));
            }

            setCurrentlySelectedNode(
              (
                (x.data[0] as any)["level"]?.split("-")[0] ?? "Cluster"
              ).toString()
            );
            if (
              ((x.data[0] as any)["level"]?.toString().match(/\-/g) || [])
                .length == 2
            ) {
              setShowHistogram(
                (x.data[0] as any)["level"]?.split("-").map((x: string) => +x)
              );
            } else {
              setShowHistogram([]);
            }
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

export default memo(TreeMap);
