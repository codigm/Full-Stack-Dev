interface Edge {
  source: string;
  target: string;
}

interface DeadlockDetectionResult {
  edges: Edge[];
  hasDeadlock: boolean;
}

interface BankersAlgorithmResult {
  allocation: number[][];
  maxNeed: number[][];
  need: number[][];
  available: number[];
  isSafe: boolean;
  safeSequence: string[];
}

// Resource Allocation Graph (RAG) for Deadlock Detection
export const detectDeadlock = (edges: Edge[]): DeadlockDetectionResult => {
  // In a real implementation, we would use a graph algorithm to detect cycles
  // For simplicity, we'll use a basic approach to detect cycles in the graph
  
  // Build adjacency list
  const graph: Map<string, string[]> = new Map();
  
  for (const edge of edges) {
    if (!graph.has(edge.source)) {
      graph.set(edge.source, []);
    }
    graph.get(edge.source)?.push(edge.target);
  }
  
  // Check for cycles using DFS
  const visited: Set<string> = new Set();
  const recursionStack: Set<string> = new Set();
  
  const hasCycle = (node: string): boolean => {
    if (!visited.has(node)) {
      visited.add(node);
      recursionStack.add(node);
      
      const neighbors = graph.get(node) || [];
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor) && hasCycle(neighbor)) {
          return true;
        } else if (recursionStack.has(neighbor)) {
          return true;
        }
      }
    }
    
    recursionStack.delete(node);
    return false;
  };
  
  let hasDeadlock = false;
  const nodes = Array.from(new Set(edges.flatMap(edge => [edge.source, edge.target])));
  
  for (const node of nodes) {
    if (!visited.has(node) && hasCycle(node)) {
      hasDeadlock = true;
      break;
    }
  }
  
  return {
    edges,
    hasDeadlock
  };
};

// Banker's Algorithm for Deadlock Avoidance
export const bankerAlgorithm = (
  n: number,     // Number of processes
  m: number,     // Number of resource types
  allocation: number[][],   // Allocation matrix
  maxNeed: number[][],      // Maximum need matrix
  available: number[]       // Available resources
): BankersAlgorithmResult => {
  // Calculate the need matrix
  const need: number[][] = [];
  for (let i = 0; i < n; i++) {
    need[i] = [];
    for (let j = 0; j < m; j++) {
      need[i][j] = maxNeed[i][j] - allocation[i][j];
    }
  }
  
  // Initialize data structures for safety algorithm
  const finish: boolean[] = Array(n).fill(false);
  const safeSequence: string[] = [];
  const availableCopy = [...available];
  
  // Safety algorithm
  let count = 0;
  while (count < n) {
    let found = false;
    
    for (let i = 0; i < n; i++) {
      if (!finish[i]) {
        let canAllocate = true;
        
        // Check if all needed resources can be allocated
        for (let j = 0; j < m; j++) {
          if (need[i][j] > availableCopy[j]) {
            canAllocate = false;
            break;
          }
        }
        
        if (canAllocate) {
          // Process can be executed
          for (let j = 0; j < m; j++) {
            availableCopy[j] += allocation[i][j];
          }
          
          finish[i] = true;
          safeSequence.push(`P${i}`);
          found = true;
          count++;
          break;
        }
      }
    }
    
    if (!found) {
      // No process can be executed
      break;
    }
  }
  
  const isSafe = count === n;
  
  return {
    allocation,
    maxNeed,
    need,
    available,
    isSafe,
    safeSequence
  };
};