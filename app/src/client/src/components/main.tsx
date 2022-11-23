import { useState } from "react";
import { TreeMap } from "./better-treemap";
import "./index.css";
// @ts-ignore
import { SideView } from "./side-view";

export const Main = () => {
  const [clickedNodes, setClickedNodes] = useState<string[]>([]);
  const [filteredNodes, setFilteredNodes] = useState<string[]>([]);

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
        <TreeMap></TreeMap>
        <SideView
          clickedNodes={clickedNodes}
          setClickedNodes={setClickedNodes}
          setFilteredNodes={setFilteredNodes}
        ></SideView>
      </div>
    </>
  );
};
