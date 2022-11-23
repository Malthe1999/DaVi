import { useEffect, useState } from "react";
import { Parent } from "../../../shared/types/collection-event";
import { collectionParents } from "../gateway/backend";
import "./index.css";
// @ts-ignore
import { Tree as TreeGraph } from "react-tree-graph";
import { Tree } from "../structs/tree";

export const SideView = (props: {
  clickedNodes: string[];
  setClickedNodes: React.Dispatch<React.SetStateAction<string[]>>;
  setFilteredNodes: React.Dispatch<React.SetStateAction<string[]>>;
}) => {
  const { clickedNodes, setClickedNodes, setFilteredNodes } = props;
  const [tree, setTree] = useState(new Tree("Cluster"));
  const [parents, setParents] = useState(new Array<Parent>());

  useEffect(() => {
    // Load parents once
    collectionParents()
      .then((parents) => setParents(parents))
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    // Update the highlighted nodes
    let newTree = new Tree("Cluster");
    for (const x of parents as Parent[]) {
      let parent =
        x.parent_collection_id === null
          ? "Cluster"
          : x.parent_collection_id.toString();

      newTree.addEdge(
        parent,
        x.collection_id.toString(),
        clickedNodes.includes(x.collection_id.toString()), // Only highlights the current node
        (child: string) => {
          // Add/remove current node from clicked
          if (!clickedNodes.includes(child)) {
            setClickedNodes([...clickedNodes, child]);
          } else {
            setClickedNodes([...clickedNodes.filter((x) => x != child)]);
          }
        }
      );
    }

    // Highlight all nodes on a path from the root to a clicked node
    newTree.highlightParents();
    setFilteredNodes(newTree.getHighlighted().filter((x) => x != "Cluster"));
    setTree(newTree);
  }, [clickedNodes, parents]);

  return (
    <div className="custom-container">
      <TreeGraph
        data={tree.root}
        height={600}
        svgProps={{
          className: "custom",
        }}
        width={600}
      />
    </div>
  );
};
