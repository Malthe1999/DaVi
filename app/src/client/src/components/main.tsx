import {
  Checkbox,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Parent } from "../../../shared/types/collection-event";
import { collectionParents } from "../gateway/backend";
import { Tree } from "../structs/tree";
import {randomNameAdj} from "../util/name-generator";
import BetterTreemap from "./better-treemap";
import EventsBox from "./events-box";
import Histogram from "./histogram";
import "./index.css";
// @ts-ignore
import { SideView } from "./side-view";
import TimeRangeSlider from "./timerange-slider";

export const Main = () => {
  const [clickedNodes, setClickedNodes] = useState<string[]>([
    "395309053288",
    "400424637904",
    "384115980813",
    "400083630480",
    "400359504871",
    "399735044474",
    "400017778662",
    "397188062864",
    "396114412610",
    "394100656170",
    "383935133305",
    "377798680268",
    "377788307885",
    "383195444727",
    "383608861807",
    "384616480023",
  ]);
  const [filteredCollectionIds, setFilteredCollectionIds] = useState<string[]>([
    "377787092035",
    "377797560396",
    "383195444727",
    "383608861807",
    "383884105961",
    "384115980665",
    "384603189188",
    "394097188469",
    "395304012910",
    "396094938307",
    "397187982822",
    "399653678562",
    "400017778662",
    "400359504871",
    "400424409030",
    "377788304537",
    "377788307885",
    "377798675385",
    "377798680268",
    "383935116162",
    "383935133305",
    "384115980813",
    "384616436814",
    "384616480023",
    "394100645117",
    "394100656170",
    "395307610239",
    "395309053288",
    "396114412610",
    "397188062864",
    "399735044474",
    "400083630480",
    "400424637904",
  ]);
  const [currentlySelectedNode, setCurrentlySelectedNode] =
    useState<string>("Cluster");

  const [viewedResource, setViewedResource] = useState<string>("cpu");
  const [fromTime, setFromTime] = useState<number>(300000000);
  const [toTime, setToTime] = useState<number>(2679000000000);
  const [useDifferentColorScales, setUseDifferentColorScales] = useState(false);
  const [showHistogram, setShowHistogram] = useState<number[]>([]);
  const [eventFilters, setEventFilters] = useState<string[]>([]);
  const [tree, setTree] = useState(new Tree("Cluster"));
  const [parents, setParents] = useState(new Array<Parent>());

  const [nameMap, setNameMap] = useState<{ [key: string]: string }>({});
  const [reverseNameMap, setReverseNameMap] = useState<{
    [key: string]: string;
  }>({});

  useEffect(() => {
    // Load parents once
    collectionParents()
      .then((parents) => {
        const map: { [key: string]: string } = {};
        const reverseMap: { [key: string]: string } = {};

        map["Cluster"] = "Cluster";
        reverseMap["Cluster"] = "Cluster";
        let counter = 1;
        for (const parent of parents) {
          map[parent.collection_id.toString()] = `${randomNameAdj(
            parent.collection_id.toString()
          )} (${counter})`;

          reverseMap[
            `${randomNameAdj(parent.collection_id.toString())} (${counter})`
          ] = parent.collection_id.toString();
          counter += 1;
        }

        setNameMap(map);
        setReverseNameMap(reverseMap);
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    collectionParents()
      .then((parents) => setParents(parents))
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    let newTree = new Tree("Cluster");
    for (const x of parents as Parent[]) {
      let parent =
        x.parent_collection_id === null
          ? "Cluster"
          : x.parent_collection_id.toString();

      newTree.addEdge(parent, x.collection_id.toString(), false, null);
    }
    setTree(newTree);
  }, [parents]);

  const collectionIds = [eventFilters?.[0] ?? ""].filter(
    (x) => x.length !== 0 && x !== "Cluster"
  );
  if (collectionIds.length !== 0) {
    collectionIds.push(
      ...tree.getParents(collectionIds[0]).filter((x) => x !== "Cluster")
    );
  }

  return (
    <>
      <h1
        style={{
          marginLeft: '20px',
        }}
      >
        Borg Cluster
      </h1>
      <div className="custom-container">
        <div className="filters">
          <FormControl>
            <InputLabel
            >
              Resource
            </InputLabel>
            <Select
              value={viewedResource}
              label="Resource"
              onChange={(event) => setViewedResource(event.target.value)}
            >
              <MenuItem value={"cpu"}>CPU</MenuItem>
              <MenuItem value={"mem"}>RAM</MenuItem>
            </Select>
            <FormControlLabel
              control={
                <Checkbox
                  checked={useDifferentColorScales}
                  onChange={(event) =>
                    setUseDifferentColorScales(event.target.checked)
                  }
                  inputProps={{ "aria-label": "controlled" }}
                />
              }
              label="Use different color scales for Collections, Machines, and Instances"
            />
          </FormControl>
          <TimeRangeSlider
            setToTime={setToTime}
            setFromTime={setFromTime}
            filteredCollectionIds={filteredCollectionIds}
          />
          <SideView
            clickedNodes={clickedNodes}
            filteredNodes={filteredCollectionIds}
            setClickedNodes={setClickedNodes}
            setFilteredCollectionIds={setFilteredCollectionIds}
            currentlySelectedNode={currentlySelectedNode}
            fromTime={fromTime}
            toTime={toTime}
            nameMap={nameMap}
            reverseNameMap={reverseNameMap}
          />
        </div>
        <div className="treemap-container">
          <BetterTreemap
            filteredNodes={filteredCollectionIds}
            setCurrentlySelectedNode={setCurrentlySelectedNode}
            viewedResource={viewedResource}
            fromTime={fromTime}
            toTime={toTime}
            useDifferentColorScales={useDifferentColorScales}
            setShowHistogram={setShowHistogram}
            setEventFilters={setEventFilters}
            nameMap={nameMap}
            reverseNameMap={reverseNameMap}
          />
        </div>
        <div className="histogram-container">
          { <Histogram
            fromTime={fromTime}
            toTime={toTime}
            showHistogram={showHistogram}
          /> }
        </div>
        
        <div className="eventbox-container">
          <EventsBox
            collectionIds={collectionIds}
            machineIds={[eventFilters?.[1] ?? ""].filter((x) => x.length !== 0)}
            instanceIds={[eventFilters?.[2] ?? ""].filter(
              (x) => x.length !== 0
            )}
          />
        </div>
      </div>
    </>
  );
};
