import { useEffect, useState } from "react";
import Plot from "react-plotly.js";
import {
  getCollectionEvents,
  getInstanceEvents,
  getMachineEvents,
} from "../gateway/backend";
import { CollectionEvent } from "../../../shared/types/collection-event";
import { unpack } from "../util/unpack";
import { MachineEvent } from "../../../shared/types/machine-event";
import { InstanceEvent } from "../../../shared/types/instance-event";

export const TimeRangeSlider = (props: {
  collectionIds: (number | string)[];
  machineIds: (number | string)[];
  instanceIds: (number | string)[];
}) => {
  const { collectionIds, machineIds, instanceIds } = props;
  const [isLoading, setIsLoading] = useState(true);
  const [collectionEvents, setCollectionEvents] = useState<CollectionEvent[]>(
    []
  );
  const [machineEvents, setMachineEvents] = useState<MachineEvent[]>([]);
  const [instanceEvents, setInstanceEvents] = useState<InstanceEvent[]>([]);

  useEffect(() => {
    setIsLoading(true);
    Promise.all([
      getCollectionEvents(collectionIds).then((x) => {
        setCollectionEvents(x);
      }),
      getMachineEvents(machineIds).then((x) => {
        setMachineEvents(x);
      }),
      getInstanceEvents(collectionIds, machineIds, instanceIds).then((x) => {
        setInstanceEvents(x);
      }),
    ]).finally(() => setIsLoading(false));
  }, [collectionIds, machineIds, instanceIds]);

  const startDate = new Date(2019, 1, 2).getTime();

  const collectionsStart = [];
  const collectionsMid = [];
  const collectionsEnd = [];
  const collectionsStartTypes = new Set(["schedule", "enable", "submit"]);
  const collectionsEndTypes = new Set(["kill", "finish", "fail"]);
  for (const x of collectionEvents) {
    if (collectionsStartTypes.has(x.type)) {
      collectionsStart.push(x);
    } else if (collectionsEndTypes.has(x.type)) {
      collectionsEnd.push(x);
    } else {
      collectionsMid.push(x);
    }
  }

  const machinesStart = [];
  const machinesMid = [];
  const machinesEnd = [];
  const machinesStartTypes = new Set(["add"]);
  const machinesEndTypes = new Set(["remove"]);
  for (const x of machineEvents) {
    if (machinesStartTypes.has(x.type)) {
      machinesStart.push(x);
    } else if (machinesEndTypes.has(x.type)) {
      machinesEnd.push(x);
    } else {
      machinesMid.push(x);
    }
  }

  const instancesStart = [];
  const instancesMid = [];
  const instancesEnd = [];
  const instancesStartTypes = new Set(["submit", "schedule", "enable"]);
  const instancesEndTypes = new Set([
    "kill",
    "finish",
    "evict",
    "fail",
    "lost",
  ]);
  for (const x of instanceEvents) {
    if (instancesStartTypes.has(x.type)) {
      instancesStart.push(x);
    } else if (instancesEndTypes.has(x.type)) {
      instancesEnd.push(x);
    } else {
      instancesMid.push(x);
    }
  }

  return (
    <>
      <Plot
        data={[
          {
            x: unpack(collectionsStart, "time").map(
              (x: number) => new Date(startDate + x / 1000)
            ),
            y: new Array(collectionsStart.length).fill(0.6),
            text: collectionsStart.map(x => `Event: ${x.type}<br>Collection: ${x.collection_id}`),
            type: "box",
            mode: "box",
            hoverinfo: "text",
            boxpoints: "all",
            marker: { symbol: "arrow-right", size: 15, color: "blue" },
          },
          {
            x: unpack(machineEvents, "time").map(
              (x: number) => new Date(startDate + x / 1000)
            ),
            y: new Array(machineEvents.length).fill(1),
            text: [],
            type: "box",
            mode: "box",
            hoverinfo: "text",
            boxpoints: "all",
            marker: { symbol: "arrow-down", size: 15, color: "red" },
          },
          {
            x: unpack(instanceEvents, "time").map(
              (x: number) => new Date(startDate + x / 1000)
            ),
            y: new Array(instanceEvents.length).fill(2),
            text: [],
            type: "box",
            mode: "box",
            hoverinfo: "text",
            boxpoints: "all",
            marker: { symbol: "arrow-down", size: 15, color: "green" },
          },
        ]}
        layout={{
          width: 1000,
          height: 200,
          showlegend: false,
          yaxis: {
            visible: false,
            fixedrange: true,
            range: [0, 3],
          },
          xaxis: {
            rangeslider: {
              borderwidth: 1,
              thickness: 0.3,
            },
            range: [new Date(2019, 0, 1), new Date(2019, 2, 6)], // Dates are shifted to start on 2019-01-02
          },
          margin: {
            b: 10,
            l: 10,
            r: 10,
            t: 10,
            pad: 5,
          },
        }}
        onRelayout={(event) => {
          const start = event["xaxis.range[0]"] || event["xaxis.range"]?.[0];
          const end = event["xaxis.range[1]"] || event["xaxis.range"]?.[1];
          console.log(start, end);
        }}
      />
    </>
  );
};
