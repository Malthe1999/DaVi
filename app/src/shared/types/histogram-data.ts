export class HistogramUsage {
    average_cpu: number;
  
    constructor(
      average_cpu: number
    ) {
      this.average_cpu = average_cpu;
    }
  
    cpu() {
      return this.average_cpu;
    }
  }
  