import { useEffect, useState } from "react";
import { Parent } from "../../../shared/types/collection-event";
import { collectionParents } from "../gateway/backend";
import "./index.css";
// @ts-ignore
import { Tree as TreeGraph } from "react-tree-graph";
import { Tree } from "../structs/tree";

const data = {
  name: "Parent",
  children: [
    {
      name: "Child One",
    },
    {
      name: "Child Two",
    },
  ],
};

export const SideView = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [tree, setTree] = useState(new Tree("Cluster"));
  const [highlighted, setHighlighted] = useState<string[]>([]);

  useEffect(() => {
    Promise.all([
      collectionParents()
        .then((parents) => {
          let newTree = new Tree("Cluster");
          for (const x of parents as Parent[]) {
            let parent =
              x.parent_collection_id === null
                ? "Cluster"
                : x.parent_collection_id.toString();
            newTree.addEdge(
              parent,
              x.collection_id.toString(),
              highlighted.includes(x.collection_id.toString()),
              (child: string) => {
                if (!highlighted.includes(child)) {
                  setHighlighted([...highlighted, child]);
                } else {
                  setHighlighted([...highlighted.filter((x) => x != child)]);
                }
              }
            );
          }
          newTree.highlightParents()
          setTree(newTree);
        })
        .catch((err) => console.log(err)),
    ]).finally(() => setIsLoading(false));
  }, [highlighted]);

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
