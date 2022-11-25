export class ResourceUsage {
  collection_id: string;
  machine_id: string;
  instance_index: string;
  resource_usage: number;

  constructor(
    collection_id: string,
    machine_id: string,
    instance_index: string,
    resource_usage: number
  ) {
    this.collection_id = collection_id;
    this.machine_id = machine_id;
    this.instance_index = instance_index;
    this.resource_usage = resource_usage;
  }

  collection() {
    return this.collection_id;
  }

  machine() {
    return `${this.collection_id}-${this.machine_id}`;
  }

  instance() {
    return `${this.collection_id}-${this.machine_id}-${this.instance_index}`;
  }
}
