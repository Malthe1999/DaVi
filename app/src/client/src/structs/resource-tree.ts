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
    } else if (!this.pointers[parent].children.find((x) => x.name === child)) {
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
    let current: Node | undefined = this.pointers[node];
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

  calculateValues() {
    const stak: Array<Node> = [];
    stak.push(this.root);
    this.root.value = 1;
    console.log(this.root);
    while (stak.length > 0) {
      const current: Node = stak.pop()!;
      for (const child of current.children) {
        child.value = current.value! / current.children.length;
        stak.push(child);
      }
      if (current.children.length > 0) {
        current.value = 0;
      }
    }
  }

  toDataPoints() {
    this.calculateValues();

    const result = [];
    for (const node of Object.values(this.pointers)) {
      result.push({
        label: node.name,
        parent: node.parent?.name ?? "", // Cluster has no parent
        value: node.value, // todo
        color: "red",
      });
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
  value?: number;
}
