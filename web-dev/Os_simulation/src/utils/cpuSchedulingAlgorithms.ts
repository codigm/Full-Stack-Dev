interface Process {
  id: number;
  burstTime: number;
  waitingTime: number;
  turnaroundTime: number;
  priority?: number;
}

interface CPUSchedulingResult {
  processes: Process[];
  averageWaitingTime: number;
  averageTurnaroundTime: number;
  totalExecutionTime: number;
  processOrder: number[];
}

// First-Come, First-Served (FCFS) Algorithm
export const calculateFCFS = (burstTimes: number[]): CPUSchedulingResult => {
  const n = burstTimes.length;
  const processes: Process[] = burstTimes.map((bt, id) => ({
    id,
    burstTime: bt,
    waitingTime: 0,
    turnaroundTime: 0
  }));
  
  let currentTime = 0;
  const processOrder: number[] = [];
  
  for (let i = 0; i < n; i++) {
    processes[i].waitingTime = currentTime;
    processes[i].turnaroundTime = currentTime + processes[i].burstTime;
    
    // Add the process execution to the timeline
    for (let j = 0; j < processes[i].burstTime; j++) {
      processOrder.push(processes[i].id);
    }
    
    currentTime += processes[i].burstTime;
  }
  
  const totalWaitingTime = processes.reduce((sum, process) => sum + process.waitingTime, 0);
  const totalTurnaroundTime = processes.reduce((sum, process) => sum + process.turnaroundTime, 0);
  
  return {
    processes,
    averageWaitingTime: totalWaitingTime / n,
    averageTurnaroundTime: totalTurnaroundTime / n,
    totalExecutionTime: currentTime,
    processOrder
  };
};

// Shortest Job First (SJF) Algorithm
export const calculateSJF = (burstTimes: number[]): CPUSchedulingResult => {
  const n = burstTimes.length;
  const processes: Process[] = burstTimes.map((bt, id) => ({
    id,
    burstTime: bt,
    waitingTime: 0,
    turnaroundTime: 0
  }));
  
  // Sort processes by burst time
  processes.sort((a, b) => a.burstTime - b.burstTime);
  
  let currentTime = 0;
  const processOrder: number[] = [];
  
  for (let i = 0; i < n; i++) {
    processes[i].waitingTime = currentTime;
    processes[i].turnaroundTime = currentTime + processes[i].burstTime;
    
    // Add the process execution to the timeline
    for (let j = 0; j < processes[i].burstTime; j++) {
      processOrder.push(processes[i].id);
    }
    
    currentTime += processes[i].burstTime;
  }
  
  const totalWaitingTime = processes.reduce((sum, process) => sum + process.waitingTime, 0);
  const totalTurnaroundTime = processes.reduce((sum, process) => sum + process.turnaroundTime, 0);
  
  return {
    processes,
    averageWaitingTime: totalWaitingTime / n,
    averageTurnaroundTime: totalTurnaroundTime / n,
    totalExecutionTime: currentTime,
    processOrder
  };
};

// Round Robin Algorithm
export const calculateRoundRobin = (burstTimes: number[], timeQuantum: number): CPUSchedulingResult => {
  const n = burstTimes.length;
  const processes: Process[] = burstTimes.map((bt, id) => ({
    id,
    burstTime: bt,
    waitingTime: 0,
    turnaroundTime: 0
  }));
  
  const remainingTime = [...burstTimes];
  let currentTime = 0;
  const processOrder: number[] = [];
  let done = false;
  
  while (!done) {
    done = true;
    
    for (let i = 0; i < n; i++) {
      if (remainingTime[i] > 0) {
        done = false;
        
        if (remainingTime[i] > timeQuantum) {
          currentTime += timeQuantum;
          remainingTime[i] -= timeQuantum;
          
          // Add the process execution to the timeline
          for (let j = 0; j < timeQuantum; j++) {
            processOrder.push(processes[i].id);
          }
        } else {
          currentTime += remainingTime[i];
          processes[i].waitingTime = currentTime - processes[i].burstTime;
          processes[i].turnaroundTime = currentTime;
          remainingTime[i] = 0;
          
          // Add the process execution to the timeline
          for (let j = 0; j < remainingTime[i]; j++) {
            processOrder.push(processes[i].id);
          }
        }
      }
    }
  }
  
  const totalWaitingTime = processes.reduce((sum, process) => sum + process.waitingTime, 0);
  const totalTurnaroundTime = processes.reduce((sum, process) => sum + process.turnaroundTime, 0);
  
  return {
    processes,
    averageWaitingTime: totalWaitingTime / n,
    averageTurnaroundTime: totalTurnaroundTime / n,
    totalExecutionTime: currentTime,
    processOrder
  };
};

// Priority Scheduling Algorithm
export const calculatePriority = (burstTimes: number[], priorities: number[]): CPUSchedulingResult => {
  const n = burstTimes.length;
  const processes: Process[] = burstTimes.map((bt, id) => ({
    id,
    burstTime: bt,
    waitingTime: 0,
    turnaroundTime: 0,
    priority: priorities[id]
  }));
  
  // Sort processes by priority (higher number = higher priority)
  processes.sort((a, b) => (b.priority || 0) - (a.priority || 0));
  
  let currentTime = 0;
  const processOrder: number[] = [];
  
  for (let i = 0; i < n; i++) {
    processes[i].waitingTime = currentTime;
    processes[i].turnaroundTime = currentTime + processes[i].burstTime;
    
    // Add the process execution to the timeline
    for (let j = 0; j < processes[i].burstTime; j++) {
      processOrder.push(processes[i].id);
    }
    
    currentTime += processes[i].burstTime;
  }
  
  const totalWaitingTime = processes.reduce((sum, process) => sum + process.waitingTime, 0);
  const totalTurnaroundTime = processes.reduce((sum, process) => sum + process.turnaroundTime, 0);
  
  return {
    processes,
    averageWaitingTime: totalWaitingTime / n,
    averageTurnaroundTime: totalTurnaroundTime / n,
    totalExecutionTime: currentTime,
    processOrder
  };
};