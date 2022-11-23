import { useEffect, useState } from "react";
import Plot from "react-plotly.js";
import { CollectionSpreadResponse } from "../../../shared/types/collection-spread";
import { CpuUsage, CpuUsageResponse } from "../../../shared/types/cpu-usage";
import { allCollectionSpread, allCpuUsage } from "../gateway/backend";
import chroma from "chroma-js";
import instanceMapping from "./instance_count_per_collection.json";
import { unpack } from "../util/unpack";

const colourscale = chroma.scale("YlGnBu").domain([0, 25.8389654971]);

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
  const [data, setData] = useState<CpuUsageResponse>({
    data: [],
  });
  const [data2, setData2] = useState<CollectionSpreadResponse>({
    data: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [data3, setData3] = useState<CpuUsageResponse>({
    data: [],
  });
  const mappingArray: any = new Map(Object.entries(instanceMapping));
  var temp: CpuUsage;
  useEffect(() => {
    setIsLoading(true);
    allCpuUsage().then(
      (value) => {
        let tempdata1: Array<CpuUsage> = [];
        value.data.forEach((element) => {
          temp = {
            cpuusage: element.cpuusage,
            id: element.id,
            colid: element.colid,
            tempval: element.tempval / mappingArray.get(String(element.colid)),
            color: "red",
          };
          tempdata1.push(temp);
        });
        setData({ data: tempdata1 });
      },
      (reason) => {
        console.log(reason);
      }
    );
    allCollectionSpread().then(
      (value2) => {
        setData2(value2);
        let data4: Array<CpuUsage> = [];
        temp = {
          cpuusage: 0,
          id: "Total",
          colid: "",
          tempval: 0,
          color: "red",
        };

        data4.push(temp);
        value2.data.forEach((element) => {
          temp = {
            cpuusage: element.cpuusageTotal,
            id: element.id,
            colid: "Total",
            tempval: 0,
            color: colourscale(Math.log(element.cpuusageTotal)).hex(),
          };
          console.log(temp.cpuusage);
          data4.push(temp);
        });
        setData3({ data: data4 });
        setIsLoading(false);
      },
      (reason) => {
        console.log(reason);
      }
    );
  }, []);

  if (data == undefined || data3 == undefined) {
    return <></>;
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
  }

  let final = [...data.data, ...data3.data];
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
        <div>...Loading</div>
      ) : (
        <Plot
          data={[
            {
              labels: unpack(final, "id"),
              parents: unpack(final, "colid"), // no parents
              values: unpack(final, "tempval"),
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
        />
      )}
      {/* <FormControl sx={{ m: 1, width: 300 }}>
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
      /> */}
    </>
  );
};
