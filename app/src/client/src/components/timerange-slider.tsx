import { memo, useEffect, useState } from "react";
import Plot from "react-plotly.js";
import { getCollectionEvents } from "../gateway/backend";
import { CollectionEvent } from "../../../shared/types/collection-event";
import { unpack } from "../util/unpack";
import { randomNameAdj, randomNameStarWars } from "../util/name-generator";

const TimeRangeSlider = (props: {
  setToTime: React.Dispatch<React.SetStateAction<number>>;
  setFromTime: React.Dispatch<React.SetStateAction<number>>;
  filteredCollectionIds: string[];
}) => {
  const { setToTime, setFromTime, filteredCollectionIds } = props;
  const [allCollectionEvents, setAllCollectionEvents] = useState<
    CollectionEvent[]
  >([]);
  const [priorities, setPriorities] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    Promise.all([
      getCollectionEvents(filteredCollectionIds).then((res) => {
        setAllCollectionEvents(res);
      }),
    ]);
  }, [filteredCollectionIds]);

  useEffect(() => {
    const newPriorities: { [key: string]: number } = {};
    let changeOccurred = false;
    for (const x of allCollectionEvents) {
      if (priorities[x.collection_id] === undefined) {
        newPriorities[x.collection_id] = Math.log(x.priority - 100) + Math.random() * 1.5 + 0.75;
        changeOccurred = true;
      } else {
        newPriorities[x.collection_id] = priorities[x.collection_id];
      }
    }

    if (changeOccurred) {
      setPriorities(newPriorities);
    }
  }, [allCollectionEvents]);

  const startDate = new Date(2019, 0, 2).getTime();

  const collectionsStart = [];
  const collectionsStartTypes = new Set(["schedule"]);
  for (const x of allCollectionEvents) {
    if (collectionsStartTypes.has(x.type)) {
      collectionsStart.push(x);
      collectionsStart[collectionsStart.length - 1].priority = priorities[x.collection_id];
    }
  }

  return (
    <>
      <Plot
        revision={1}
        data={[
          {
            x: unpack(collectionsStart, "time").map(
              (x: number) => new Date(startDate + x / 1000)
            ),
            y: unpack(collectionsStart, "priority"),
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
            marker: {
              symbol: "arrow-right",
              size: 15,
              color: "blue",
              opacity: 0.3,
            },
          },
        ]}
        layout={{
          width: 580,
          height: 200,
          showlegend: false,
          yaxis: {
            mirror: true,
            showline: true,
            visible: false,
            fixedrange: true,
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
        onRelayout={(event) => {
          const start = event["xaxis.range[0]"] || event["xaxis.range"]?.[0];
          const end = event["xaxis.range[1]"] || event["xaxis.range"]?.[1];
          setFromTime(
            (new Date(start?.toString() ?? new Date(2019, 0, 1)).getTime() -
              new Date(startDate).getTime()) *
              1000
          );
          setToTime(
            (new Date(end?.toString() ?? new Date(2019, 1, 3)).getTime() -
              new Date(startDate).getTime()) *
              1000
          );
        }}
      />
    </>
  );
};

export default memo(TimeRangeSlider);
