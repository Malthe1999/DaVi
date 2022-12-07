import { useEffect, useState } from "react";
import { Parent } from "../../../shared/types/collection-event";
import { collectionParents } from "../gateway/backend";
import "./index.css";
// @ts-ignore
import { Tree as TreeGraph } from "react-tree-graph";
import { Tree } from "../structs/tree";
import _, { reverse } from "lodash";
import { randomNameAdj } from "../util/name-generator";

export const SideView = (props: {
  clickedNodes: string[];
  filteredNodes: string[];
  setClickedNodes: React.Dispatch<React.SetStateAction<string[]>>;
  setFilteredCollectionIds: React.Dispatch<React.SetStateAction<string[]>>;
  currentlySelectedNode: string;
  fromTime: number;
  toTime: number;
  nameMap: { [key: string]: string };
  reverseNameMap: { [key: string]: string };
}) => {
  const {
    clickedNodes,
    setClickedNodes,
    setFilteredCollectionIds: setFilteredNodes,
    currentlySelectedNode,
    filteredNodes,
    nameMap,
    reverseNameMap,
  } = props;

  const [tree, setTree] = useState(new Tree("Cluster"));
  const [parents, setParents] = useState(new Array<Parent>());

  useEffect(() => {
    // Load parents once
    collectionParents()
      .then((parents) => setParents(parents))
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    if (parents.length === 0 || Object.values(nameMap ?? {}).length === 0) {
      return;
    }
    // Update the highlighted nodes
    let newTree = new Tree("Cluster");
    for (const x of parents as Parent[]) {
      let parent =
        x.parent_collection_id === null
          ? "Cluster"
          : x.parent_collection_id.toString();

      newTree.addEdge(
        nameMap[parent],
        nameMap[x.collection_id.toString()],
        clickedNodes.includes(x.collection_id.toString()), // Only highlights the current node
        (child: string) => {
          // Add/remove current node from clicked
          const id = reverseNameMap[child];
          if (!clickedNodes.includes(id)) {
            setClickedNodes([...clickedNodes, id]);
          } else {
            setClickedNodes([...clickedNodes.filter((x) => x !== id)]);
          }
        }
      );
    }

    // Highlight all nodes on a path from the root to a clicked node
    newTree.highlightParents();
    newTree.emphasize(nameMap[currentlySelectedNode]);
    const newFilteredNodes = newTree
      .getHighlighted()
      .filter((x) => x != "Cluster").map(x => reverseNameMap[x]);
    if (!_.isEqual(filteredNodes, newFilteredNodes)) {
      setFilteredNodes(
        newTree
          .getHighlighted()
          .filter((x) => x != "Cluster")
          .map((x) => reverseNameMap[x])
      );
    }
    setTree(newTree);
  }, [clickedNodes, parents, currentlySelectedNode, nameMap, reverseNameMap]);

  return (
    <div className="custom-container">
      <TreeGraph
        data={tree.root}
        height={550}
        svgProps={{
          className: "custom",
        }}
        width={600}
      />
    </div>
  );
};
