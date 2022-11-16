export class Tree {
  root: Node;
  pointers: { [key: string]: Node };

  constructor() {
    this.root = { value: "Cluster", parent: undefined, children: [] };
    this.pointers = {
      "Cluster": this.root,
    };
  }

  insert(parent: string | any, child: string) {
    if (this.pointers[parent] === undefined) {
      throw new Error("cannot insert node in tree for nonexistent parent");
    }
    if (this.pointers[child] !== undefined) {
      return;
    }

    if (!parent) {
      parent = "";
    }

    const childNode: Node = {
      value: child,
      parent: this.pointers[parent],
      children: [],
    };
    this.pointers[parent].children.push(childNode);
  }

  addEdge(parent: string, child: string) {
    // Add a possibly disconnected edge in the tree
    if (this.pointers[child] === undefined) {
      this.pointers[child] = { value: child, parent: undefined, children: [] };
    }

    if (this.pointers[parent] === undefined) {
      this.pointers[parent] = {
        value: parent,
        parent: undefined,
        children: [this.pointers[child]],
      };
    } else {
      this.pointers[parent].children.push(this.pointers[child]);
    }

    this.pointers[child].parent = this.pointers[parent];
  }
}

interface Node {
  value: string;
  parent: Node | undefined;
  children: Node[];
}
