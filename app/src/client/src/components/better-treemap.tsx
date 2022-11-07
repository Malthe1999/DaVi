import { useEffect, useState } from "react";
import Plot from "react-plotly.js";
import { Parent } from "../../../shared/types/collection-event";
import { RequestedInstanceResources } from "../../../shared/types/instance-event";
import {
  collectionParents,
  requestedInstanceResources,
} from "../gateway/backend";
function unpack(rows: any, key: any) {
  return rows.map((row: any) => {
    return row[key];
  });
}

export const TreeMap = () => {
  const [instanceResources, setData] = useState<RequestedInstanceResources[]>(
    []
  );
  const [parents, setParents] = useState<Parent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    Promise.all([
      requestedInstanceResources()
        .then((x) => setData(x as RequestedInstanceResources[]))
        .catch((err) => console.log(err)),
      collectionParents()
        .then((x) => setParents(x as Parent[]))
        .catch((err) => console.log(err)),
    ]).finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return <div>Loading</div>;
  }

  const totalColor = "red";
  const nodeColor = "blue";
  const leafColor = "green";
  const machineColor = "yellow";
  const instanceColor = "pink";
  let tree = [{ parent: "", child: "Total", weight: 1, color: totalColor }];
  tree.push();

  let hasChildren = new Set();
  for (let x of parents) {
    hasChildren.add(x.parent_collection_id);
  }

  for (let x of parents) {
    tree.push({
      parent:
        x.parent_collection_id == null
          ? "Total"
          : x.parent_collection_id.toString(),
      child: x.collection_id.toString(),
      weight: 1,
      color: hasChildren.has(x.collection_id) ? nodeColor : leafColor,
    });
  }

  const unspecifiedMachines = new Set();
  for (let x of instanceResources) {
    if (unspecifiedMachines.has(`${x.collection_id}.${x.machine_id}`)) {
      continue;
    }

    unspecifiedMachines.add(`${x.collection_id}.${x.machine_id}`);
    tree.push({
      parent: `${x.collection_id}`,
      child: `${x.collection_id}_${x.machine_id}`,
      weight: 1,
      color: machineColor,
    });
  }

  for (let x of instanceResources) {
    tree.push({
      parent: `${x.collection_id}_${x.machine_id}`,
      child: `${x.collection_id}.${x.machine_id}.${x.instance_index}`,
      weight: 1,
      color: instanceColor,
    });
  }

  return (
    <>
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
      />
    </>
  );
};
