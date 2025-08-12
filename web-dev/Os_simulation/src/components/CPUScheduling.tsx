import React, { useState } from 'react';
import { BarChart, Calendar, CheckSquare, Clock, Cpu } from 'lucide-react';
import { Bar } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend 
} from 'chart.js';
import AlgorithmCard from './ui/AlgorithmCard';
import { calculateFCFS, calculateSJF, calculateRoundRobin, calculatePriority } from '../utils/cpuSchedulingAlgorithms';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const CPUScheduling: React.FC = () => {
  const [burstTimes, setBurstTimes] = useState<string>('5 8 12 3 6');
  const [quantum, setQuantum] = useState<string>('2');
  const [priorities, setPriorities] = useState<string>('3 1 4 5 2');
  const [algorithm, setAlgorithm] = useState<string>('fcfs');
  const [results, setResults] = useState<any>(null);
  
  const calculateResults = () => {
    const burstArray = burstTimes.split(/\s+/).map(Number);
    
    let result;
    switch (algorithm) {
      case 'fcfs':
        result = calculateFCFS(burstArray);
        break;
      case 'sjf':
        result = calculateSJF(burstArray);
        break;
      case 'rr':
        result = calculateRoundRobin(burstArray, parseInt(quantum));
        break;
      case 'priority':
        const priorityArray = priorities.split(/\s+/).map(Number);
        result = calculatePriority(burstArray, priorityArray);
        break;
      default:
        result = null;
    }
    
    setResults(result);
  };
  
  const chartOptions = {
    indexAxis: 'y' as const,
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Time Units',
          font: {
            size: 14,
            weight: 'bold'
          }
        },
        grid: {
          display: true,
          color: 'rgba(0, 0, 0, 0.1)'
        },
        ticks: {
          font: {
            size: 12
          }
        }
      },
      y: {
        title: {
          display: true,
          text: 'Process Execution Timeline',
          font: {
            size: 14,
            weight: 'bold'
          }
        },
        grid: {
          display: false
        },
        ticks: {
          font: {
            size: 12
          }
        }
      }
    },
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: true,
        text: 'CPU Scheduling Gantt Chart',
        font: {
          size: 18,
          weight: 'bold'
        },
        padding: 20
      },
      tooltip: {
        callbacks: {
          title: function(context: any) {
            return `Process P${context[0].datasetIndex}`;
          },
          label: function(context: any) {
            const processId = context.datasetIndex;
            const process = results?.processes[processId];
            return [
              `Burst Time: ${process?.burstTime} units`,
              `Waiting Time: ${process?.waitingTime} units`,
              `Turnaround Time: ${process?.turnaroundTime} units`
            ];
          }
        },
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: 'rgba(255, 255, 255, 0.2)',
        borderWidth: 1
      }
    },
    animation: {
      duration: 1000,
      easing: 'easeInOutQuart'
    }
  };

  const renderGanttChart = () => {
    if (!results) return null;
    
    // Create a more detailed timeline representation
    const timeline: { processId: number; startTime: number; endTime: number }[] = [];
    let currentTime = 0;
    
    // Build timeline based on algorithm
    if (algorithm === 'rr') {
      // For Round Robin, we need to handle time slices
      const remainingTime = results.processes.map((p: any) => p.burstTime);
      const quantum = parseInt(quantum);
      let completed = 0;
      
      while (completed < results.processes.length) {
        for (let i = 0; i < results.processes.length; i++) {
          if (remainingTime[i] > 0) {
            const executeTime = Math.min(remainingTime[i], quantum);
            timeline.push({
              processId: i,
              startTime: currentTime,
              endTime: currentTime + executeTime
            });
            currentTime += executeTime;
            remainingTime[i] -= executeTime;
            
            if (remainingTime[i] === 0) {
              completed++;
            }
          }
        }
      }
    } else {
      // For other algorithms, processes run to completion
      results.processes.forEach((process: any, index: number) => {
        timeline.push({
          processId: process.id,
          startTime: process.waitingTime,
          endTime: process.waitingTime + process.burstTime
        });
      });
    }
    
    // Create datasets for each process
    const datasets = results.processes.map((process: any, index: number) => {
      const processTimeline = timeline.filter(t => t.processId === process.id || t.processId === index);
      const colors = [
        'rgba(59, 130, 246, 0.8)',   // Blue
        'rgba(16, 185, 129, 0.8)',   // Green
        'rgba(245, 158, 11, 0.8)',   // Yellow
        'rgba(239, 68, 68, 0.8)',    // Red
        'rgba(139, 92, 246, 0.8)',   // Purple
        'rgba(236, 72, 153, 0.8)',   // Pink
        'rgba(14, 165, 233, 0.8)',   // Sky
        'rgba(34, 197, 94, 0.8)'     // Emerald
      ];
      
      return {
        label: `Process P${process.id}`,
        data: processTimeline.map(t => ({
          x: [t.startTime, t.endTime],
          y: `P${process.id}`
        })),
        backgroundColor: colors[index % colors.length],
        borderColor: colors[index % colors.length].replace('0.8', '1'),
        borderWidth: 2,
        borderRadius: 4,
        borderSkipped: false,
      };
    });
    
    return {
      labels: results.processes.map((p: any) => `P${p.id}`),
      datasets: [{
        label: 'Process Execution',
        data: results.processes.map((process: any) => ({
          x: process.burstTime,
          y: `P${process.id}`
        })),
        backgroundColor: results.processes.map((_: any, index: number) => {
          const colors = [
            'rgba(59, 130, 246, 0.8)',   // Blue
            'rgba(16, 185, 129, 0.8)',   // Green
            'rgba(245, 158, 11, 0.8)',   // Yellow
            'rgba(239, 68, 68, 0.8)',    // Red
            'rgba(139, 92, 246, 0.8)',   // Purple
            'rgba(236, 72, 153, 0.8)',   // Pink
            'rgba(14, 165, 233, 0.8)',   // Sky
            'rgba(34, 197, 94, 0.8)'     // Emerald
          ];
          return colors[index % colors.length];
        }),
        borderColor: results.processes.map((_: any, index: number) => {
          const colors = [
            'rgba(59, 130, 246, 1)',
            'rgba(16, 185, 129, 1)',
            'rgba(245, 158, 11, 1)',
            'rgba(239, 68, 68, 1)',
            'rgba(139, 92, 246, 1)',
            'rgba(236, 72, 153, 1)',
            'rgba(14, 165, 233, 1)',
            'rgba(34, 197, 94, 1)'
          ];
          return colors[index % colors.length];
        }),
        borderWidth: 2,
        borderRadius: 6,
        borderSkipped: false,
      }]
    };
  };

  const renderSimpleGanttChart = () => {
    if (!results) return null;
    
    // Create a simple visual timeline
    let currentTime = 0;
    const timeline: { processId: number; startTime: number; duration: number; color: string }[] = [];
    
    const colors = [
      '#3B82F6', '#10B981', '#F59E0B', '#EF4444', 
      '#8B5CF6', '#EC4899', '#0EA5E9', '#22C55E'
    ];
    
    if (algorithm === 'rr') {
      // Handle Round Robin specially
      const remainingTime = results.processes.map((p: any) => p.burstTime);
      const timeQuantum = parseInt(quantum);
      let completed = 0;
      
      while (completed < results.processes.length) {
        for (let i = 0; i < results.processes.length; i++) {
          if (remainingTime[i] > 0) {
            const executeTime = Math.min(remainingTime[i], timeQuantum);
            timeline.push({
              processId: results.processes[i].id,
              startTime: currentTime,
              duration: executeTime,
              color: colors[i % colors.length]
            });
            currentTime += executeTime;
            remainingTime[i] -= executeTime;
            
            if (remainingTime[i] === 0) {
              completed++;
            }
          }
        }
      }
    } else {
      // For other algorithms
      results.processes.forEach((process: any, index: number) => {
        timeline.push({
          processId: process.id,
          startTime: process.waitingTime,
          duration: process.burstTime,
          color: colors[index % colors.length]
        });
      });
      
      // Sort by start time for proper display
      timeline.sort((a, b) => a.startTime - b.startTime);
    }
    
    const totalTime = Math.max(...timeline.map(t => t.startTime + t.duration));
    
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4 text-center">Process Execution Timeline</h3>
        
        {/* Timeline visualization */}
        <div className="relative mb-6">
          <div className="flex items-center mb-2">
            <span className="text-sm font-medium text-gray-600 w-16">Time:</span>
            <div className="flex-1 relative h-12 bg-gray-100 rounded-lg overflow-hidden">
              {timeline.map((segment, index) => (
                <div
                  key={index}
                  className="absolute top-0 h-full flex items-center justify-center text-white font-semibold text-sm border-r border-white transition-all duration-300 hover:opacity-80"
                  style={{
                    left: `${(segment.startTime / totalTime) * 100}%`,
                    width: `${(segment.duration / totalTime) * 100}%`,
                    backgroundColor: segment.color,
                    minWidth: '40px'
                  }}
                  title={`Process P${segment.processId}: ${segment.startTime}-${segment.startTime + segment.duration}`}
                >
                  P{segment.processId}
                </div>
              ))}
            </div>
          </div>
          
          {/* Time markers */}
          <div className="flex items-center">
            <span className="w-16"></span>
            <div className="flex-1 relative">
              <div className="flex justify-between text-xs text-gray-500">
                {Array.from({ length: Math.min(totalTime + 1, 11) }, (_, i) => (
                  <span key={i} className="text-center">
                    {Math.round((i * totalTime) / Math.min(totalTime, 10))}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Process legend */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {results.processes.map((process: any, index: number) => (
            <div key={index} className="flex items-center space-x-2">
              <div 
                className="w-4 h-4 rounded"
                style={{ backgroundColor: colors[index % colors.length] }}
              ></div>
              <span className="text-sm font-medium">
                P{process.id} ({process.burstTime}u)
              </span>
            </div>
          ))}
        </div>
        
        {/* Execution order for Round Robin */}
        {algorithm === 'rr' && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-800 mb-2">Execution Order:</h4>
            <div className="flex flex-wrap gap-1">
              {timeline.map((segment, index) => (
                <span 
                  key={index}
                  className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium"
                >
                  P{segment.processId}({segment.duration}u)
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="fade-in">
      <h1 className="text-3xl font-bold mb-6 flex items-center">
        <Cpu className="mr-2" /> CPU Scheduling Simulation
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <AlgorithmCard 
          title="First Come First Served (FCFS)"
          description="Processes are executed in the order they arrive in the ready queue."
          icon={<Clock />}
          isActive={algorithm === 'fcfs'}
          onClick={() => setAlgorithm('fcfs')}
        />
        
        <AlgorithmCard 
          title="Shortest Job First (SJF)"
          description="Process with the smallest execution time is selected for execution next."
          icon={<CheckSquare />}
          isActive={algorithm === 'sjf'}
          onClick={() => setAlgorithm('sjf')}
        />
        
        <AlgorithmCard 
          title="Round Robin (RR)"
          description="Each process is assigned a fixed time slice in a cyclic way."
          icon={<Calendar />}
          isActive={algorithm === 'rr'}
          onClick={() => setAlgorithm('rr')}
        />
        
        <AlgorithmCard 
          title="Priority Scheduling"
          description="Each process is assigned a priority, and the process with highest priority is selected."
          icon={<BarChart />}
          isActive={algorithm === 'priority'}
          onClick={() => setAlgorithm('priority')}
        />
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Input Parameters</h2>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Burst Times (space separated)
          </label>
          <input
            type="text"
            className="input-field w-full"
            value={burstTimes}
            onChange={(e) => setBurstTimes(e.target.value)}
            placeholder="e.g., 5 8 12 3 6"
          />
          <p className="text-xs text-gray-500 mt-1">
            Enter the CPU time each process needs (in time units)
          </p>
        </div>
        
        {algorithm === 'rr' && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Time Quantum
            </label>
            <input
              type="number"
              className="input-field w-full"
              value={quantum}
              onChange={(e) => setQuantum(e.target.value)}
              min="1"
            />
            <p className="text-xs text-gray-500 mt-1">
              Maximum time a process can run before being preempted
            </p>
          </div>
        )}
        
        {algorithm === 'priority' && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Priorities (space separated, higher number = higher priority)
            </label>
            <input
              type="text"
              className="input-field w-full"
              value={priorities}
              onChange={(e) => setPriorities(e.target.value)}
              placeholder="e.g., 3 1 4 5 2"
            />
            <p className="text-xs text-gray-500 mt-1">
              Priority values for each process (higher number = higher priority)
            </p>
          </div>
        )}
        
        <button 
          className="btn-primary mt-2"
          onClick={calculateResults}
        >
          Run Simulation
        </button>
      </div>
      
      {results && (
        <div className="mt-8 fade-in">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Simulation Results</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-md">
                <h3 className="font-medium text-blue-800 mb-1">Average Waiting Time</h3>
                <p className="text-2xl font-bold">{results.averageWaitingTime.toFixed(2)}</p>
                <p className="text-xs text-blue-600 mt-1">Time processes wait in queue</p>
              </div>
              
              <div className="bg-green-50 p-4 rounded-md">
                <h3 className="font-medium text-green-800 mb-1">Average Turnaround Time</h3>
                <p className="text-2xl font-bold">{results.averageTurnaroundTime.toFixed(2)}</p>
                <p className="text-xs text-green-600 mt-1">Total time from arrival to completion</p>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-md">
                <h3 className="font-medium text-purple-800 mb-1">Total Execution Time</h3>
                <p className="text-2xl font-bold">{results.totalExecutionTime}</p>
                <p className="text-xs text-purple-600 mt-1">Total time to complete all processes</p>
              </div>
            </div>
            
            {/* Simple Gantt Chart */}
            {renderSimpleGanttChart()}
            
            {/* Traditional Chart */}
            <div className="chart-container mt-6" style={{ height: '300px' }}>
              <Bar options={chartOptions} data={renderGanttChart()} />
            </div>
            
            <div className="mt-6">
              <h3 className="font-medium mb-2">Process Details</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Process</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Burst Time</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Waiting Time</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Turnaround Time</th>
                      {algorithm === 'priority' && (
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                      )}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {results.processes.map((process: any, index: number) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap font-medium">P{process.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{process.burstTime} units</td>
                        <td className="px-6 py-4 whitespace-nowrap">{process.waitingTime} units</td>
                        <td className="px-6 py-4 whitespace-nowrap">{process.turnaroundTime} units</td>
                        {algorithm === 'priority' && (
                          <td className="px-6 py-4 whitespace-nowrap">{process.priority}</td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            {/* Algorithm explanation */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium mb-2">How {algorithm.toUpperCase()} Works:</h4>
              <p className="text-sm text-gray-700">
                {algorithm === 'fcfs' && "Processes are executed in the order they arrive. Simple but can cause long waiting times for short processes."}
                {algorithm === 'sjf' && "The process with the shortest burst time is executed first. Minimizes average waiting time but can cause starvation."}
                {algorithm === 'rr' && `Each process gets a fixed time slice (${quantum} units). Fair scheduling that prevents starvation but may have higher overhead.`}
                {algorithm === 'priority' && "Processes are executed based on their priority. Higher priority processes run first, but can cause starvation of low-priority processes."}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CPUScheduling;