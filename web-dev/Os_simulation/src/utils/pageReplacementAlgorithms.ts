interface PageReplacementResult {
  pages: number[];
  pageFaults: number;
  capacity: number;
  frameHistory: number[][];
  faultSequence: boolean[];
}

// FIFO Page Replacement
export const fifo = (pages: number[], capacity: number): PageReplacementResult => {
  const frames: number[] = [];
  let pageFaults = 0;
  const frameHistory: number[][] = [];
  const faultSequence: boolean[] = [];
  
  for (let i = 0; i < pages.length; i++) {
    // Check if the page is already in a frame
    if (!frames.includes(pages[i])) {
      // Page fault
      pageFaults++;
      faultSequence.push(true);
      
      if (frames.length < capacity) {
        // Add the page to a free frame
        frames.push(pages[i]);
      } else {
        // Replace the oldest page (first-in)
        frames.shift();
        frames.push(pages[i]);
      }
    } else {
      // Page hit
      faultSequence.push(false);
    }
    
    // Record the frame state for visualization
    frameHistory.push([...frames]);
  }
  
  return {
    pages,
    pageFaults,
    capacity,
    frameHistory,
    faultSequence
  };
};

// LRU Page Replacement
export const lru = (pages: number[], capacity: number): PageReplacementResult => {
  const frames: number[] = [];
  let pageFaults = 0;
  const frameHistory: number[][] = [];
  const faultSequence: boolean[] = [];
  const lastUsed: Map<number, number> = new Map();
  
  for (let i = 0; i < pages.length; i++) {
    // Update the last used time for the current page
    lastUsed.set(pages[i], i);
    
    // Check if the page is already in a frame
    if (!frames.includes(pages[i])) {
      // Page fault
      pageFaults++;
      faultSequence.push(true);
      
      if (frames.length < capacity) {
        // Add the page to a free frame
        frames.push(pages[i]);
      } else {
        // Find the least recently used page
        let lruPage = frames[0];
        let lruTime = lastUsed.get(lruPage) || 0;
        
        for (const frame of frames) {
          const time = lastUsed.get(frame) || 0;
          if (time < lruTime) {
            lruPage = frame;
            lruTime = time;
          }
        }
        
        // Replace the LRU page
        const index = frames.indexOf(lruPage);
        if (index !== -1) {
          frames[index] = pages[i];
        }
      }
    } else {
      // Page hit
      faultSequence.push(false);
    }
    
    // Record the frame state for visualization
    frameHistory.push([...frames]);
  }
  
  return {
    pages,
    pageFaults,
    capacity,
    frameHistory,
    faultSequence
  };
};

// Optimal Page Replacement
export const optimal = (pages: number[], capacity: number): PageReplacementResult => {
  const frames: number[] = [];
  let pageFaults = 0;
  const frameHistory: number[][] = [];
  const faultSequence: boolean[] = [];
  
  for (let i = 0; i < pages.length; i++) {
    // Check if the page is already in a frame
    if (!frames.includes(pages[i])) {
      // Page fault
      pageFaults++;
      faultSequence.push(true);
      
      if (frames.length < capacity) {
        // Add the page to a free frame
        frames.push(pages[i]);
      } else {
        // Find the page that will not be used for the longest time in the future
        const nextUse: Map<number, number> = new Map();
        
        // Initialize with infinity (won't be used again)
        for (const frame of frames) {
          nextUse.set(frame, Infinity);
        }
        
        // Find the next occurrence of each page in frames
        for (let j = i + 1; j < pages.length; j++) {
          if (frames.includes(pages[j]) && !nextUse.has(pages[j])) {
            nextUse.set(pages[j], j);
          }
        }
        
        // Find the page with the furthest next use
        let optimalPage = frames[0];
        let furthestUse = nextUse.get(optimalPage) || Infinity;
        
        for (const frame of frames) {
          const nextUseTime = nextUse.get(frame) || Infinity;
          if (nextUseTime > furthestUse) {
            optimalPage = frame;
            furthestUse = nextUseTime;
          }
        }
        
        // Replace the optimal page
        const index = frames.indexOf(optimalPage);
        if (index !== -1) {
          frames[index] = pages[i];
        }
      }
    } else {
      // Page hit
      faultSequence.push(false);
    }
    
    // Record the frame state for visualization
    frameHistory.push([...frames]);
  }
  
  return {
    pages,
    pageFaults,
    capacity,
    frameHistory,
    faultSequence
  };
};