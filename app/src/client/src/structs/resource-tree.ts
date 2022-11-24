export class ResourceTree {
  root: Node;
  pointers: { [key: string]: Node };

  constructor(rootName: string) {
    this.root = {
      name: rootName,
      parent: undefined,
      children: [],
    };
    this.pointers = {};
    this.pointers[rootName] = this.root;
  }

  addEdge(parent: string, child: string) {
    if (this.pointers[child] === undefined) {
      this.pointers[child] = {
        name: child,
        parent: undefined,
        children: [],
      };
    }

    if (this.pointers[parent] === undefined) {
      this.pointers[parent] = {
        name: parent,
        parent: undefined,
        children: [this.pointers[child]],
      };
    } else {
      this.pointers[parent].children.push(this.pointers[child]);
    }

    this.pointers[child].parent = this.pointers[parent];
  }

  highlightParents() {
    for (const child of Object.keys(this.pointers)) {
      if (this.pointers[child].highlighted) {
        let parent = this.pointers[child].parent;
        while (parent && parent.gProps) {
          parent.highlighted = true;
          parent.gProps["className"] = "custom node highlighted";
          parent = parent.parent;
        }
      }
    }
  }

  emphasize(node: string) {
    let current: Node|undefined = this.pointers[node];
    if (current === undefined) {
      return;
    }
    while (current && current.gProps) {
      current.gProps["className"] += " emphasized";
      current = current.parent;
    }
  }

  getHighlighted() {
    const result: string[] = [];
    for (const node of Object.values(this.pointers)) {
      if (node.highlighted) {
        result.push(node.name ?? "");
      }
    }
    return result;
  }

  getParents(child: string) {
    const result: string[] = [];
    let parent = this.pointers[child].parent;
    while (parent) {
      result.push(parent.name ?? "");
      parent = parent.parent;
    }
    return result;
  }
}

interface Node {
  name?: string;
  parent: Node | undefined;
  children: Node[];
  gProps?: any;
  highlighted?: boolean;
}
