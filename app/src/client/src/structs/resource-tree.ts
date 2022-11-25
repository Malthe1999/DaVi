import chroma from "chroma-js";

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

  addEdge(parent: string, child: string, resourceUsage?: number) {
    if (this.pointers[child] === undefined) {
      this.pointers[child] = {
        name: child,
        parent: undefined,
        children: [],
        resourceUsage: resourceUsage,
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

  calculateNodeSizes() {
    const stak: Array<Node> = [];
    stak.push(this.root);
    this.root.nodeSize = 1;
    while (stak.length > 0) {
      const current: Node = stak.pop()!;
      for (const child of current.children) {
        child.nodeSize = current.nodeSize! / current.children.length;
        stak.push(child);
      }
      if (current.children.length > 0) {
        current.nodeSize = 0;
      }
    }
  }

  calculateResources(node: Node) {
    let total = 0;
    if (node.children.length === 0) {
      return node.resourceUsage ?? 0;
    }
    for (const child of node.children) {
      this.calculateResources(child);
      total += child.resourceUsage ?? 0;
    }
    node.resourceUsage = total;
  }

  getMaxResources() {
    let result = 0;
    for (const child of Object.values(this.pointers)) {
      result = Math.max(result, child.resourceUsage ?? 0);
    }
    return result;
  }

  toDataPoints() {
    this.calculateNodeSizes();
    this.calculateResources(this.root);
    const colourscale = chroma
      .scale("YlGnBu")
      .domain([0, Math.log(this.getMaxResources())]);

    const result = [];
    for (const node of Object.values(this.pointers)) {
      result.push({
        label: node.name,
        parent: node.parent?.name ?? "", // Cluster has no parent
        nodeSize: node.nodeSize,
        color: colourscale(Math.log(node.resourceUsage!)).hex(),
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
  nodeSize?: number;
  resourceUsage?: number;
}
