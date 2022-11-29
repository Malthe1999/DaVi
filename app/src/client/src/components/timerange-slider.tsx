import { useEffect, useState } from "react";
import Plot from "react-plotly.js";
import { CircularProgress } from "@mui/material";
import { getCollectionEvents, getInstanceEvents, getMachineEvents } from "../gateway/backend";
import { CollectionEvent } from "../../../shared/types/collection-event";
import { unpack } from "../util/unpack";
import {MachineEvent} from "../../../shared/types/machine-event";
import {InstanceEvent} from "../../../shared/types/instance-event";

export const TimeRangeSlider = (props: { filteredNodes?: string[] }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [collectionEvents, setCollectionEvents] = useState<CollectionEvent[]>(
    []
  );
  const [machineEvents, setMachineEvents] = useState<MachineEvent[]>(
    []
  );

  const [instanceEvents, setInstanceEvents] = useState<InstanceEvent[]>(
    []
  );

  useEffect(() => {
    Promise.all([
      getCollectionEvents([377788307885]).then((x) => {
        setCollectionEvents(x);
      }),
      getMachineEvents([102893142411]).then((x) => {
        setMachineEvents(x);
      }),
      getInstanceEvents([102893142411]).then((x) => {
        setInstanceEvents(x);
      }),
    ]).finally(() => setIsLoading(false));
  }, []);

  console.log(collectionEvents);

  return (
    <>
      {isLoading ? (
        <CircularProgress />
      ) : (
        <Plot
          data={[
            // {
            //   x: [1, 2, 3],
            //   y: [3, 3, 3],
            //   type: "scatter",
            //   mode: "markers",
            //   marker: { symbol: "arrow-down", size: 15, color: "blue" },
            // },
            {
              x: unpack(collectionEvents, "time"),
              y: new Array(collectionEvents.length).fill(1),
              type: "scatter",
              mode: "box",
              boxpoints: "all",
              marker: { symbol: "arrow-down", size: 15, color: "blue" },
            },
            // {
            //   x: [1.5, 2.5],
            //   y: [1, 1],
            //   type: "scatter",
            //   mode: "markers",
            //   marker: { symbol: "arrow-down", size: 15, color: "red" },
            // },
            // {
            //   x: [1.75, 2.25],
            //   y: [2, 2],
            //   type: "scatter",
            //   mode: "markers",
            //   marker: { symbol: "arrow-down", size: 15, color: "green" },
            // },
            // {
            //   x: [0, 2679000000000],
            //   y: [0, 0],
            //   type: "scatter",
            //   mode: "lines",
            //   marker: {},
            // },
          ]}
          layout={{
            width: 1000,
            height: 200,
            showlegend: false,
            yaxis: {
              visible: false,
              fixedrange: true,
            },
            xaxis: {
              rangeslider: {
                borderwidth: 1,
                thickness: 0.3,
              },
              range: [0, 2679000000000],
            },
            margin: {
              b: 10,
              l: 10,
              r: 10,
              t: 10,
              pad: 5,
            },
            // shapes: [
            //   {
            //     type: "line",
            //     x0: 1.5,
            //     y0: 0,
            //     x1: 1.5,
            //     y1: 1.1,
            //     line: {
            //       color: "red",
            //       width: 2,
            //     },
            //   },
            //   {
            //     type: "line",
            //     x0: 1.75,
            //     y0: 0,
            //     x1: 1.75,
            //     y1: 2.1,
            //     line: {
            //       color: "green",
            //       width: 2,
            //     },
            //   },
            //   {
            //     type: "line",
            //     x0: 1,
            //     y0: 0,
            //     x1: 1,
            //     y1: 3.1,
            //     line: {
            //       color: "blue",
            //       width: 2,
            //     },
            //   },
            // ],
          }}
          onRelayout={(event) => {
            const start = event["xaxis.range[0]"] || event["xaxis.range"]?.[0];
            const end = event["xaxis.range[1]"] || event["xaxis.range"]?.[1];
            console.log(start, end);
          }}
        />
      )}
    </>
  );
};
