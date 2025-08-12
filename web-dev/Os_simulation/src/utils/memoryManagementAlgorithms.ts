interface Process {
  size: number;
  allocated: number;
}

interface MemoryBlock {
  size: number;
  allocated: boolean;
}

interface MemoryAllocationResult {
  processes: Process[];
  remainingBlocks: { id: number; size: number }[];
  allocatedProcesses: number;
  totalProcesses: number;
  memoryUtilization: number;
  internalFragmentation: number;
}

// First Fit Memory Allocation
export const firstFit = (memoryBlocks: number[], processSizes: number[]): MemoryAllocationResult => {
  const blocks: MemoryBlock[] = memoryBlocks.map(size => ({ size, allocated: false }));
  const processes: Process[] = processSizes.map(size => ({ size, allocated: -1 }));
  
  // Allocate memory using First Fit
  for (let i = 0; i < processes.length; i++) {
    for (let j = 0; j < blocks.length; j++) {
      if (!blocks[j].allocated && blocks[j].size >= processes[i].size) {
        // Allocate this block
        blocks[j].allocated = true;
        processes[i].allocated = j;
        blocks[j].size -= processes[i].size;
        break;
      }
    }
  }
  
  return calculateResults(blocks, processes);
};

// Best Fit Memory Allocation
export const bestFit = (memoryBlocks: number[], processSizes: number[]): MemoryAllocationResult => {
  const blocks: MemoryBlock[] = memoryBlocks.map(size => ({ size, allocated: false }));
  const processes: Process[] = processSizes.map(size => ({ size, allocated: -1 }));
  
  // Allocate memory using Best Fit
  for (let i = 0; i < processes.length; i++) {
    let bestFitIndex = -1;
    let bestFitSize = Infinity;
    
    for (let j = 0; j < blocks.length; j++) {
      if (!blocks[j].allocated && blocks[j].size >= processes[i].size) {
        if (blocks[j].size < bestFitSize) {
          bestFitSize = blocks[j].size;
          bestFitIndex = j;
        }
      }
    }
    
    if (bestFitIndex !== -1) {
      // Allocate this block
      blocks[bestFitIndex].allocated = true;
      processes[i].allocated = bestFitIndex;
      blocks[bestFitIndex].size -= processes[i].size;
    }
  }
  
  return calculateResults(blocks, processes);
};

// Worst Fit Memory Allocation
export const worstFit = (memoryBlocks: number[], processSizes: number[]): MemoryAllocationResult => {
  const blocks: MemoryBlock[] = memoryBlocks.map(size => ({ size, allocated: false }));
  const processes: Process[] = processSizes.map(size => ({ size, allocated: -1 }));
  
  // Allocate memory using Worst Fit
  for (let i = 0; i < processes.length; i++) {
    let worstFitIndex = -1;
    let worstFitSize = -1;
    
    for (let j = 0; j < blocks.length; j++) {
      if (!blocks[j].allocated && blocks[j].size >= processes[i].size) {
        if (blocks[j].size > worstFitSize) {
          worstFitSize = blocks[j].size;
          worstFitIndex = j;
        }
      }
    }
    
    if (worstFitIndex !== -1) {
      // Allocate this block
      blocks[worstFitIndex].allocated = true;
      processes[i].allocated = worstFitIndex;
      blocks[worstFitIndex].size -= processes[i].size;
    }
  }
  
  return calculateResults(blocks, processes);
};

// Helper function to calculate results
const calculateResults = (blocks: MemoryBlock[], processes: Process[]): MemoryAllocationResult => {
  const allocatedProcesses = processes.filter(p => p.allocated !== -1).length;
  const totalMemory = blocks.reduce((sum, block) => sum + block.size, 0) + 
                      processes.reduce((sum, process) => sum + (process.allocated !== -1 ? process.size : 0), 0);
  const usedMemory = processes.reduce((sum, process) => sum + (process.allocated !== -1 ? process.size : 0), 0);
  const memoryUtilization = (usedMemory / totalMemory) * 100;
  
  // Calculate internal fragmentation
  const internalFragmentation = blocks.reduce((sum, block) => sum + (block.allocated ? block.size : 0), 0);
  
  // Prepare remaining blocks for display
  const remainingBlocks = blocks
    .map((block, id) => ({ id, size: block.size }))
    .filter(block => block.size > 0);
  
  return {
    processes,
    remainingBlocks,
    allocatedProcesses,
    totalProcesses: processes.length,
    memoryUtilization,
    internalFragmentation
  };
};