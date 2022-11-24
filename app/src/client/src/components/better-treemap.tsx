import { useEffect, useState } from "react";
import Plot from "react-plotly.js";
import { CpuUsage } from "../../../shared/types/cpu-usage";
import {
  allCollectionSpread,
  allCpuUsage,
  cpuResources,
} from "../gateway/backend";
import chroma from "chroma-js";
import instanceMapping from "./instance_count_per_collection.json";
import { unpack } from "../util/unpack";
import { CircularProgress } from "@mui/material";
import { ResourceTree } from "../structs/resource-tree";
import { ResourceUsage } from "../../../shared/types/resource-usage";

const colourscale = chroma.scale("YlGnBu").domain([0, 25.8389654971]);

export const TreeMap = (props: {
  filteredNodes: string[];
  setCurrentlySelectedNode: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const { setCurrentlySelectedNode, filteredNodes } = props;
  // const [instanceUsage, setInstanceUsage] = useState<CpuUsage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  // const [collectionUsage, setCollectionUsage] = useState<CpuUsage[]>([]);
  const mappingArray: any = new Map(Object.entries(instanceMapping));
  const final: [] = [];

  useEffect(() => {
    Promise.all([
      cpuResources([319956351863]).then((res) => {
        const tree = new ResourceTree("Cluster");
        for (const x of res) {
          tree.addEdge("Cluster", collection(x));
          tree.addEdge(collection(x), machine(x));
          tree.addEdge(machine(x), instance(x));
        }
      }),
      // allCpuUsage()
      //   .then((res) => {
      //     let result: Array<CpuUsage> = [];
      //     res.data.forEach((element) => {
      //       result.push({
      //         cpuusage: element.cpuusage,
      //         id: element.id,
      //         parent: element.parent,
      //         nodeScale: 1 / mappingArray.get(String(element.parent)),
      //         color: "red",
      //       });
      //     });
      //     setInstanceUsage(result);
      //   })
      //   .catch((err) => console.log(err)),
      // allCollectionSpread()
      //   .then((res) => {
      //     let result: Array<CpuUsage> = [
      //       {
      //         cpuusage: 0,
      //         id: "Cluster",
      //         parent: "",
      //         nodeScale: 0,
      //         color: "red",
      //       },
      //     ];
      //     res.data.forEach((element) => {
      //       result.push({
      //         cpuusage: element.cpuusageTotal,
      //         id: element.id,
      //         parent: "Cluster",
      //         nodeScale: 0,
      //         color: colourscale(Math.log(element.cpuusageTotal)).hex(),
      //       });
      //     });
      //     setCollectionUsage(result);
      //     setIsLoading(false);
      //   })
      //   .catch((err) => console.log(err)),
    ]).finally(() => setIsLoading(false));
  }, []);

  // const [instanceResources, setData] = useState<RequestedInstanceResources[]>(
  //   []
  // );
  // const [parents, setParents] = useState<Parent[]>([]);
  // const [allParents, setAllParents] = useState<Parent[]>([]);
  // const [collectionIds, setCollectionIds] = useState<number[]>([]);
  // const [selectedCollectionIds, setSelectedCollectionIds] = useState<number[]>([
  //   319956351863,
  // ]);
  // const [isLoading, setIsLoading] = useState(true);
  // if (allParents?.[0]?.parent_collection_id) {
  //   console.log(1)

  // let final = [...instanceUsage, ...collectionUsage];
  // useEffect(() => {
  //   Promise.all([
  //     requestedInstanceResources(selectedCollectionIds)
  //       .then((x) => setData(x as RequestedInstanceResources[]))
  //       .catch((err) => console.log(err)),
  //     collectionParents(selectedCollectionIds)
  //       .then((x) => setParents(x as Parent[]))
  //       .catch((err) => console.log(err)),
  //     collectionParents()
  //       .then((x) => setAllParents(x as Parent[]))
  //       .catch((err) => console.log(err)),
  //     uniqueCollectionIds()
  //       .then((x) =>
  //         setCollectionIds((x as CollectionId[]).map((x) => x.collection_id))
  //       )
  //       .catch((err) => console.log(err)),
  //   ]).finally(() => setIsLoading(false));
  // }, [selectedCollectionIds]);

  // const totalColor = "red";
  // const nodeColor = "blue";
  // const leafColor = "green";
  // const machineColor = "yellow";
  // const instanceColor = "pink";
  // let tree = [{ parent: "", child: "Total", weight: 1, color: totalColor }];
  // tree.push();

  // let hasChildren = new Set();
  // for (let x of parents) {
  //   hasChildren.add(x.parent_collection_id);
  // }

  // for (let x of parents) {
  //   tree.push({
  //     parent:
  //       x.parent_collection_id == null
  //         ? "Total"
  //         : x.parent_collection_id.toString(),
  //     child: x.collection_id.toString(),
  //     weight: 1,
  //     color: hasChildren.has(x.collection_id) ? nodeColor : leafColor,
  //   });
  // }

  // const unspecifiedMachines = new Set();
  // for (let x of instanceResources) {
  //   if (unspecifiedMachines.has(`${x.collection_id}.${x.machine_id}`)) {
  //     continue;
  //   }

  //   unspecifiedMachines.add(`${x.collection_id}.${x.machine_id}`);
  //   tree.push({
  //     parent: `${x.collection_id}`,
  //     child: `${x.collection_id}_${x.machine_id}`,
  //     weight: 1,
  //     color: machineColor,
  //   });
  // }

  // for (let x of instanceResources) {
  //   tree.push({
  //     parent: `${x.collection_id}_${x.machine_id}`,
  //     child: `${x.collection_id}.${x.machine_id}.${x.instance_index}`,
  //     weight: 1,
  //     color: instanceColor,
  //   });
  // }

  // if (isLoading) {
  //   return <div>Loading</div>;
  // }

  return (
    <>
      {isLoading ? (
        <CircularProgress />
      ) : (
        <Plot
          data={[
            {
              labels: unpack(final, "id"),
              parents: unpack(final, "parent"), // no parents
              values: unpack(final, "nodeScale"),
              type: "treemap",
              branchvalues: "remainder",
              maxdepth: 2,
              marker: { colors: unpack(final, "color") },
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
          // onUpdate={(x) => {
          //   setCurrentlySelectedNode(((x.data[0] as any)['level'] ?? 'Cluster').toString());
          //   console.log(((x.data[0] as any)['level'] ?? 'Cluster').toString());
          // }}
        />
      )}
      {/* 
      <Plot
        data={[
          {
            labels: unpack(tree, "child"),
            parents: unpack(tree, "parent"),
            values: unpack(tree, "weight"),
            marker: {
              colors: unpack(tree, "color"),
            },
            type: "treemap",
            branchvalues: "remainder",
            maxdepth: 2,
          },
        ]}
        layout={{
          width: 1200,
          height: 800,
          title: "TODO: Change this title",
        }}
      /> */}
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
