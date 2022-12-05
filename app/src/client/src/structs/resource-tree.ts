import chroma from "chroma-js";
import {randomNameAdj, randomNameAni, randomNameCol} from '../util/name-generator';

const collectionColorScheme = (max: number) =>
  chroma.scale("Blues").domain([0, Math.log(max)]);
const machineColorScheme = (max: number) =>
  chroma.scale("Greens").domain([0, Math.log(max)]);
const instanceColorScheme = (max: number) =>
  chroma.scale("Purples").domain([0, Math.log(max)]);
const otherColorScheme = (max: number) =>
  chroma.scale("Greys").domain([0, Math.log(max)]);

const generalColorScale = (max: number) =>
  chroma.scale("YlGnBu").domain([0, Math.log(max)]);

export class ResourceTree {
  root: Node;
  pointers: { [key: string]: Node };

  constructor(rootName: string) {
    this.root = {
      name: rootName,
      parent: undefined,
      children: [],
      information_listing: "",
    };
    this.pointers = {};
    this.pointers[rootName] = this.root;
  }

  addEdge(
    parent: string,
    child: string,
    resourceUsage?: number,
    type?: string,
    information_listing?: string
  ) {
    if (this.pointers[child] === undefined) {
      this.pointers[child] = {
        name: child,
        parent: undefined,
        children: [],
        resourceUsage: resourceUsage,
        type: type,
        information_listing: information_listing,
      };
    }

    if (this.pointers[parent] === undefined) {
      this.pointers[parent] = {
        name: parent,
        parent: undefined,
        children: [this.pointers[child]],
        information_listing: information_listing,
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

  toDataPoints(useDifferentColorScales: boolean) {
    this.calculateNodeSizes();
    this.calculateResources(this.root);
    const colorScale = generalColorScale(this.getMaxResources());
    const collection = collectionColorScheme(this.getMaxResources());
    const machine = machineColorScheme(this.getMaxResources());
    const instance = instanceColorScheme(this.getMaxResources());
    const other = otherColorScheme(this.getMaxResources());

    const result = [];
    for (const node of Object.values(this.pointers)) {
      let color = colorScale(Math.log(node.resourceUsage!));
      let label = "";
      if (useDifferentColorScales) {
        if (node.type === "collection") {
          color = collection(Math.log(node.resourceUsage!));
        }
        else if (node.type === "machine") {
          color = machine(Math.log(node.resourceUsage!));
        }
        else if (node.type === "instance") {
          color = instance(Math.log(node.resourceUsage!));
        }
        else {
          color = other(Math.log(node.resourceUsage!));
        }
      }
      if (node.type === "collection") {
        label = randomNameAdj(node.name!)
      }
      else if (node.type === "machine") {
        label = randomNameCol(node.name!)
      }
      else if (node.type === "instance") {
        label = randomNameAni(node.name!)
      }
      else {
        label = "Cluster"
      }
      result.push({
        label: label,
        id: node.name,
        parent: node.parent?.name ?? "", // Cluster has no parent
        nodeSize: node.nodeSize,
        color: color.hex(),
        informationListing: node.information_listing
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
  type?: string;
  information_listing?: string;
}
