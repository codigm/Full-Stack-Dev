interface DiskSchedulingResult {
  sequence: number[];
  totalHeadMovement: number;
  averageSeekTime: number;
}

// First-Come, First-Served (FCFS) Disk Scheduling
export const calculateFCFS = (requests: number[], initialHead: number): DiskSchedulingResult => {
  const sequence = [initialHead, ...requests];
  let totalHeadMovement = 0;
  
  for (let i = 0; i < requests.length; i++) {
    totalHeadMovement += Math.abs(sequence[i] - sequence[i + 1]);
  }
  
  return {
    sequence,
    totalHeadMovement,
    averageSeekTime: totalHeadMovement / requests.length
  };
};

// Shortest Seek Time First (SSTF) Disk Scheduling
export const calculateSSTF = (requests: number[], initialHead: number): DiskSchedulingResult => {
  const sequence = [initialHead];
  let totalHeadMovement = 0;
  let currentHead = initialHead;
  const remainingRequests = [...requests];
  
  while (remainingRequests.length > 0) {
    // Find the request with the shortest seek time
    let shortestSeekTime = Infinity;
    let shortestIndex = -1;
    
    for (let i = 0; i < remainingRequests.length; i++) {
      const seekTime = Math.abs(currentHead - remainingRequests[i]);
      if (seekTime < shortestSeekTime) {
        shortestSeekTime = seekTime;
        shortestIndex = i;
      }
    }
    
    // Move to the selected request
    currentHead = remainingRequests[shortestIndex];
    sequence.push(currentHead);
    totalHeadMovement += shortestSeekTime;
    
    // Remove the processed request
    remainingRequests.splice(shortestIndex, 1);
  }
  
  return {
    sequence,
    totalHeadMovement,
    averageSeekTime: totalHeadMovement / requests.length
  };
};

// SCAN Disk Scheduling
export const calculateSCAN = (requests: number[], initialHead: number): DiskSchedulingResult => {
  const diskSize = 200; // Assuming disk size is 200
  const sequence = [initialHead];
  let totalHeadMovement = 0;
  
  // Sort requests
  const sortedRequests = [...requests].sort((a, b) => a - b);
  
  // Find the request just greater than the initial head
  let pivot = 0;
  while (pivot < sortedRequests.length && sortedRequests[pivot] < initialHead) {
    pivot++;
  }
  
  // Movement to the right (increasing cylinder numbers)
  for (let i = pivot; i < sortedRequests.length; i++) {
    sequence.push(sortedRequests[i]);
  }
  
  // Go to the end of the disk
  sequence.push(diskSize - 1);
  
  // Movement to the left (decreasing cylinder numbers)
  for (let i = pivot - 1; i >= 0; i--) {
    sequence.push(sortedRequests[i]);
  }
  
  // Calculate total head movement
  for (let i = 0; i < sequence.length - 1; i++) {
    totalHeadMovement += Math.abs(sequence[i] - sequence[i + 1]);
  }
  
  return {
    sequence,
    totalHeadMovement,
    averageSeekTime: totalHeadMovement / requests.length
  };
};

// C-SCAN Disk Scheduling
export const calculateCSCAN = (requests: number[], initialHead: number): DiskSchedulingResult => {
  const diskSize = 200; // Assuming disk size is 200
  const sequence = [initialHead];
  let totalHeadMovement = 0;
  
  // Sort requests
  const sortedRequests = [...requests].sort((a, b) => a - b);
  
  // Find the request just greater than the initial head
  let pivot = 0;
  while (pivot < sortedRequests.length && sortedRequests[pivot] < initialHead) {
    pivot++;
  }
  
  // Movement to the right (increasing cylinder numbers)
  for (let i = pivot; i < sortedRequests.length; i++) {
    sequence.push(sortedRequests[i]);
  }
  
  // Go to the end of the disk
  sequence.push(diskSize - 1);
  
  // Jump to the beginning of the disk
  sequence.push(0);
  
  // Movement from the beginning to the pivot
  for (let i = 0; i < pivot; i++) {
    sequence.push(sortedRequests[i]);
  }
  
  // Calculate total head movement
  for (let i = 0; i < sequence.length - 1; i++) {
    totalHeadMovement += Math.abs(sequence[i] - sequence[i + 1]);
  }
  
  // Adjust for the jump from end to beginning (should not count in head movement)
  totalHeadMovement -= (diskSize - 1);
  
  return {
    sequence,
    totalHeadMovement,
    averageSeekTime: totalHeadMovement / requests.length
  };
};

// LOOK Disk Scheduling
export const calculateLOOK = (requests: number[], initialHead: number): DiskSchedulingResult => {
  const sequence = [initialHead];
  let totalHeadMovement = 0;
  
  // Sort requests
  const sortedRequests = [...requests].sort((a, b) => a - b);
  
  // Find the request just greater than the initial head
  let pivot = 0;
  while (pivot < sortedRequests.length && sortedRequests[pivot] < initialHead) {
    pivot++;
  }
  
  // Movement to the right (increasing cylinder numbers)
  for (let i = pivot; i < sortedRequests.length; i++) {
    sequence.push(sortedRequests[i]);
  }
  
  // Movement to the left (decreasing cylinder numbers)
  for (let i = pivot - 1; i >= 0; i--) {
    sequence.push(sortedRequests[i]);
  }
  
  // Calculate total head movement
  for (let i = 0; i < sequence.length - 1; i++) {
    totalHeadMovement += Math.abs(sequence[i] - sequence[i + 1]);
  }
  
  return {
    sequence,
    totalHeadMovement,
    averageSeekTime: totalHeadMovement / requests.length
  };
};

// C-LOOK Disk Scheduling
export const calculateCLOOK = (requests: number[], initialHead: number): DiskSchedulingResult => {
  const sequence = [initialHead];
  let totalHeadMovement = 0;
  
  // Sort requests
  const sortedRequests = [...requests].sort((a, b) => a - b);
  
  // Find the request just greater than the initial head
  let pivot = 0;
  while (pivot < sortedRequests.length && sortedRequests[pivot] < initialHead) {
    pivot++;
  }
  
  // Movement to the right (increasing cylinder numbers)
  for (let i = pivot; i < sortedRequests.length; i++) {
    sequence.push(sortedRequests[i]);
  }
  
  // Jump to the beginning of the requests
  // Movement from the beginning to the pivot
  for (let i = 0; i < pivot; i++) {
    sequence.push(sortedRequests[i]);
  }
  
  // Calculate total head movement
  for (let i = 0; i < sequence.length - 1; i++) {
    totalHeadMovement += Math.abs(sequence[i] - sequence[i + 1]);
  }
  
  return {
    sequence,
    totalHeadMovement,
    averageSeekTime: totalHeadMovement / requests.length
  };
};