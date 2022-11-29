import {
  Checkbox,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { useState } from "react";
import TreeMap from "./better-treemap";
import Histogram from "./histogram";
import "./index.css";
// @ts-ignore
import { SideView } from "./side-view";

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
  const [filteredNodes, setFilteredNodes] = useState<string[]>([
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
  console.log(showHistogram);

  return (
    <>
      <h1
        style={{
          color: "white",
        }}
      >
        Borg Cluster
      </h1>
      <div className="custom-container">
        <FormControl>
          <InputLabel
            style={{
              color: "white",
            }}
          >
            Resource
          </InputLabel>
          <Select
            style={{
              color: "white",
            }}
            value={viewedResource}
            label="Resource"
            onChange={(event) => setViewedResource(event.target.value)}
          >
            <MenuItem value={"cpu"}>CPU</MenuItem>
            <MenuItem value={"mem"}>RAM</MenuItem>
          </Select>
          <TextField
            id="outlined-basic"
            label="From Time"
            variant="standard"
            value={fromTime}
            onChange={(event) => {
              setFromTime(+event.target.value);
            }}
          />
          <TextField
            id="outlined-basic"
            label="To Time"
            variant="standard"
            value={toTime}
            onChange={(event) => {
              setToTime(+event.target.value);
            }}
          />
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
        <div>
          <Histogram
            filteredNodes={filteredNodes}
            setCurrentlySelectedNode={setCurrentlySelectedNode}
            viewedResource={viewedResource}
            fromTime={fromTime}
            toTime={toTime}
            useDifferentColorScales={useDifferentColorScales}
          ></Histogram>
          <TreeMap
            filteredNodes={filteredNodes}
            setCurrentlySelectedNode={setCurrentlySelectedNode}
            viewedResource={viewedResource}
            fromTime={fromTime}
            toTime={toTime}
            useDifferentColorScales={useDifferentColorScales}
            setShowHistogram={setShowHistogram}
          ></TreeMap>
        </div>
        <SideView
          clickedNodes={clickedNodes}
          setClickedNodes={setClickedNodes}
          filteredNodes={filteredNodes}
          setFilteredNodes={setFilteredNodes}
          currentlySelectedNode={currentlySelectedNode}
          fromTime={fromTime}
          toTime={toTime}
        ></SideView>
      </div>
    </>
  );
};
