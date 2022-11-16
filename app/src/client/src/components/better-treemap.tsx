import {
  Checkbox,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { useEffect, useState } from "react";
import Plot from "react-plotly.js";
import { CollectionId, Parent } from "../../../shared/types/collection-event";
import { RequestedInstanceResources } from "../../../shared/types/instance-event";
import {
  collectionParents,
  requestedInstanceResources,
  uniqueCollectionIds,
} from "../gateway/backend";
import { unpack } from "../util/unpack";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export const TreeMap = () => {
  const [instanceResources, setData] = useState<RequestedInstanceResources[]>(
    []
  );
  const [parents, setParents] = useState<Parent[]>([]);
  const [allParents, setAllParents] = useState<Parent[]>([]);
  const [collectionIds, setCollectionIds] = useState<number[]>([]);
  const [selectedCollectionIds, setSelectedCollectionIds] = useState<number[]>([
    319956351863,
  ]);
  const [isLoading, setIsLoading] = useState(true);
  if (allParents?.[0]?.parent_collection_id) {
    console.log(1)
  }

  useEffect(() => {
    Promise.all([
      requestedInstanceResources(selectedCollectionIds)
        .then((x) => setData(x as RequestedInstanceResources[]))
        .catch((err) => console.log(err)),
      collectionParents(selectedCollectionIds)
        .then((x) => setParents(x as Parent[]))
        .catch((err) => console.log(err)),
      collectionParents()
        .then((x) => setAllParents(x as Parent[]))
        .catch((err) => console.log(err)),
      uniqueCollectionIds()
        .then((x) =>
          setCollectionIds((x as CollectionId[]).map((x) => x.collection_id))
        )
        .catch((err) => console.log(err)),
    ]).finally(() => setIsLoading(false));
  }, [selectedCollectionIds]);

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

  if (isLoading) {
    return <div>Loading</div>;
  }

  return (
    <>
      <FormControl sx={{ m: 1, width: 300 }}>
        <InputLabel id="demo-multiple-checkbox-label">Tag</InputLabel>
        <Select
          multiple
          value={selectedCollectionIds}
          onChange={(event: SelectChangeEvent<typeof selectedCollectionIds>) => {
            const {
              target: { value },
            } = event;
            setSelectedCollectionIds(
              typeof value === "string"
                ? value.split(",").map((x) => +x)
                : value
            );
          }}
          input={<OutlinedInput label="Tag" />}
          renderValue={(selected) => selected.join(", ")}
          MenuProps={MenuProps}
        >
          {collectionIds.map((x) => (
            <MenuItem key={x} value={x}>
              <Checkbox checked={selectedCollectionIds.indexOf(x) > -1} />
              <ListItemText primary={x} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
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
