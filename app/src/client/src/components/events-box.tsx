import { memo, useEffect, useState } from "react";
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
import {
  randomNameAdj,
  randomNameAni,
  randomNameCol,
  randomNameStarWars,
} from "../util/name-generator";

const EventsBox = (props: {
  collectionIds: (number | string)[];
  machineIds: (number | string)[];
  instanceIds: (number | string)[];
}) => {
  const { collectionIds, machineIds, instanceIds } =
    props;
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

  const startDate = new Date(2019, 0, 2).getTime();

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
            y: new Array(collectionsStart.length).fill(1),
            text: collectionsStart.map(
              (x) =>
                `Event: ${x.type}<br>Collection: ${randomNameAdj(
                  x.collection_id.toString()
                )}<br>Scheduling class: ${x.scheduling_class}<br>Priority: ${
                  x.priority
                }<br>User: ${randomNameStarWars(x.user)}`
            ),
            type: "scatter",
            mode: "markers",
            hoverinfo: "text",
            boxpoints: "all",
            marker: { symbol: "arrow-right", size: 15, color: "blue" },
          },
          {
            x: unpack(collectionsMid, "time").map(
              (x: number) => new Date(startDate + x / 1000)
            ),
            y: new Array(collectionsMid.length).fill(1),
            text: collectionsMid.map(
              (x) =>
                `Event: ${x.type}<br>Collection: ${randomNameAdj(
                  x.collection_id.toString()
                )}<br>Scheduling class: ${x.scheduling_class}<br>Priority: ${
                  x.priority
                }<br>User: ${randomNameStarWars(x.user)}`
            ),
            type: "scatter",
            mode: "markers",
            hoverinfo: "text",
            boxpoints: "all",
            marker: { symbol: "circle", size: 15, color: "blue" },
          },
          {
            x: unpack(collectionsEnd, "time").map(
              (x: number) => new Date(startDate + x / 1000)
            ),
            y: new Array(collectionsEnd.length).fill(1),
            text: collectionsEnd.map(
              (x) =>
                `Event: ${x.type}<br>Collection: ${randomNameAdj(
                  x.collection_id.toString()
                )}<br>Scheduling class: ${x.scheduling_class}<br>Priority: ${
                  x.priority
                }<br>User: ${randomNameStarWars(x.user)}`
            ),
            type: "scatter",
            mode: "markers",
            hoverinfo: "text",
            boxpoints: "all",
            marker: { symbol: "arrow-left", size: 15, color: "blue" },
          },
          {
            x: unpack(machinesStart, "time").map(
              (x: number) => new Date(startDate + x / 1000)
            ),
            y: new Array(machinesStart.length).fill(1.6),
            text: machinesStart.map(
              (x) =>
                `Event: ${x.type}<br>Machine: ${randomNameCol(
                  collectionIds[0] + "-" + x.machine_id.toString()
                )}<br>Capacity CPU: ${x.capacity_cpu}<br>Capacity RAM: ${
                  x.capacity_mem
                }`
            ),
            type: "scatter",
            mode: "markers",
            hoverinfo: "text",
            boxpoints: "all",
            marker: { symbol: "arrow-right", size: 15, color: "green" },
          },
          {
            x: unpack(machinesMid, "time").map(
              (x: number) => new Date(startDate + x / 1000)
            ),
            y: new Array(machinesMid.length).fill(1.6),
            text: machinesMid.map(
              (x) =>
                `Event: ${x.type}<br>Machine: ${randomNameCol(
                  collectionIds[0] + "-" + x.machine_id.toString()
                )}<br>Capacity CPU: ${x.capacity_cpu}<br>Capacity RAM: ${
                  x.capacity_mem
                }`
            ),
            type: "scatter",
            mode: "markers",
            hoverinfo: "text",
            boxpoints: "all",
            marker: { symbol: "circle", size: 15, color: "green" },
          },
          {
            x: unpack(machinesEnd, "time").map(
              (x: number) => new Date(startDate + x / 1000)
            ),
            y: new Array(machinesEnd.length).fill(1.6),
            text: machinesEnd.map(
              (x) =>
                `Event: ${x.type}<br>Machine: ${randomNameCol(
                  collectionIds[0] + "-" + x.machine_id.toString()
                )}<br>Capacity CPU: ${x.capacity_cpu}<br>Capacity RAM: ${
                  x.capacity_mem
                }`
            ),
            type: "scatter",
            mode: "markers",
            hoverinfo: "text",
            boxpoints: "all",
            marker: { symbol: "arrow-left", size: 15, color: "green" },
          },
          {
            x: unpack(instancesStart, "time").map(
              (x: number) => new Date(startDate + x / 1000)
            ),
            y: new Array(instancesStart.length).fill(2.2),
            text: instancesStart.map(
              (x) =>
                `Event: ${x.type}<br>Instance: ${randomNameAni(
                  x.collection_id.toString() +
                    "-" +
                    x.machine_id.toString() +
                    "-" +
                    x.instance_index.toString()
                )}<br>Scheduling class: ${x.scheduling_class}<br>Priority: ${
                  x.priority
                }<br>Requested CPU: ${x.requested_cpu}<br>Requested RAM: ${
                  x.requested_mem
                }`
            ),
            type: "scatter",
            mode: "markers",
            hoverinfo: "text",
            boxpoints: "all",
            marker: { symbol: "arrow-right", size: 15, color: "purple" },
          },
          {
            x: unpack(instancesMid, "time").map(
              (x: number) => new Date(startDate + x / 1000)
            ),
            y: new Array(instancesMid.length).fill(2.2),
            text: instancesMid.map(
              (x) =>
                `Event: ${x.type}<br>Instance: ${randomNameAni(
                  x.collection_id.toString() +
                    "-" +
                    x.machine_id.toString() +
                    "-" +
                    x.instance_index.toString()
                )}<br>Scheduling class: ${x.scheduling_class}<br>Priority: ${
                  x.priority
                }<br>Requested CPU: ${x.requested_cpu}<br>Requested RAM: ${
                  x.requested_mem
                }`
            ),
            type: "scatter",
            mode: "markers",
            hoverinfo: "text",
            boxpoints: "all",
            marker: { symbol: "circle", size: 15, color: "purple" },
          },
          {
            x: unpack(instancesEnd, "time").map(
              (x: number) => new Date(startDate + x / 1000)
            ),
            y: new Array(instancesEnd.length).fill(2.2),
            text: instancesEnd.map(
              (x) =>
                `Event: ${x.type}<br>Instance: ${randomNameAni(
                  x.collection_id.toString() +
                    "-" +
                    x.machine_id.toString() +
                    "-" +
                    x.instance_index.toString()
                )}<br>Scheduling class: ${x.scheduling_class}<br>Priority: ${
                  x.priority
                }<br>Requested CPU: ${x.requested_cpu}<br>Requested RAM: ${
                  x.requested_mem
                }`
            ),
            type: "scatter",
            mode: "markers",
            hoverinfo: "text",
            boxpoints: "all",
            marker: { symbol: "arrow-left", size: 15, color: "purple" },
          },
          {
            x: [new Date(2019, 0, 1), new Date(2019, 1, 3)],
            y: [0, 0],
            type: "scatter",
            mode: "lines",
            marker: {},
          },
        ]}
        layout={{
          width: 900,
          height: 200,
          showlegend: false,
          yaxis: {
            mirror: true,
            showline: true,
            visible: false,
            fixedrange: true,
            range: [0.7, 2.5],
          },
          xaxis: {
            mirror: true,
            showline: true,
            ticks: "outside",
            rangeslider: {
              borderwidth: 1,
              thickness: 0.3,
            },
            range: [new Date(2019, 0, 1), new Date(2019, 1, 3)], // Dates are shifted to start on 2019-01-02
          },
          margin: {
            b: 10,
            l: 10,
            r: 10,
            t: 10,
            pad: 5,
          },
        }}
      />
    </>
  );
};

export default memo(EventsBox);
