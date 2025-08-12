import React, { useState } from 'react';
import { MemoryStick, Layers } from 'lucide-react';
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
import { firstFit, bestFit, worstFit } from '../utils/memoryManagementAlgorithms';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const MemoryManagement: React.FC = () => {
  const [memoryBlocks, setMemoryBlocks] = useState<string>('100 500 200 300 600');
  const [processSizes, setProcessSizes] = useState<string>('212 417 112 426');
  const [algorithm, setAlgorithm] = useState<string>('firstfit');
  const [results, setResults] = useState<any>(null);
  
  const calculateResults = () => {
    const memoryBlocksArray = memoryBlocks.split(/\s+/).map(Number);
    const processSizesArray = processSizes.split(/\s+/).map(Number);
    
    let result;
    switch (algorithm) {
      case 'firstfit':
        result = firstFit(memoryBlocksArray, processSizesArray);
        break;
      case 'bestfit':
        result = bestFit(memoryBlocksArray, processSizesArray);
        break;
      case 'worstfit':
        result = worstFit(memoryBlocksArray, processSizesArray);
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
          text: 'Memory Size'
        }
      },
      y: {
        title: {
          display: true,
          text: 'Process / Memory Block'
        }
      }
    },
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Memory Allocation',
      },
    },
  };

  const renderChartData = () => {
    if (!results) return null;
    
    const labels = [
      ...results.processes.map((_: any, index: number) => `Process ${index}`),
      ...results.remainingBlocks.map((_: any, index: number) => `Free Block ${index}`)
    ];
    
    return {
      labels,
      datasets: [
        {
          label: 'Allocated Memory',
          data: [
            ...results.processes.map((p: any) => p.size),
            ...Array(results.remainingBlocks.length).fill(0)
          ],
          backgroundColor: 'rgba(59, 130, 246, 0.8)',
        },
        {
          label: 'Free Memory',
          data: [
            ...Array(results.processes.length).fill(0),
            ...results.remainingBlocks.map((b: any) => b.size)
          ],
          backgroundColor: 'rgba(156, 163, 175, 0.6)',
        }
      ],
    };
  };

  return (
    <div className="fade-in">
      <h1 className="text-3xl font-bold mb-6 flex items-center">
        <MemoryStick className="mr-2" /> Memory Management Simulation
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <AlgorithmCard 
          title="First Fit"
          description="Allocates the first memory block that is big enough to satisfy the request."
          icon={<Layers />}
          isActive={algorithm === 'firstfit'}
          onClick={() => setAlgorithm('firstfit')}
        />
        
        <AlgorithmCard 
          title="Best Fit"
          description="Allocates the smallest memory block that is big enough to satisfy the request."
          icon={<Layers />}
          isActive={algorithm === 'bestfit'}
          onClick={() => setAlgorithm('bestfit')}
        />
        
        <AlgorithmCard 
          title="Worst Fit"
          description="Allocates the largest memory block available to maximize leftover space."
          icon={<Layers />}
          isActive={algorithm === 'worstfit'}
          onClick={() => setAlgorithm('worstfit')}
        />
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Input Parameters</h2>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Memory Block Sizes (space separated)
          </label>
          <input
            type="text"
            className="input-field w-full"
            value={memoryBlocks}
            onChange={(e) => setMemoryBlocks(e.target.value)}
            placeholder="e.g., 100 500 200 300 600"
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Process Sizes (space separated)
          </label>
          <input
            type="text"
            className="input-field w-full"
            value={processSizes}
            onChange={(e) => setProcessSizes(e.target.value)}
            placeholder="e.g., 212 417 112 426"
          />
        </div>
        
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
                <h3 className="font-medium text-blue-800 mb-1">Processes Allocated</h3>
                <p className="text-2xl font-bold">{results.allocatedProcesses} / {results.totalProcesses}</p>
              </div>
              
              <div className="bg-green-50 p-4 rounded-md">
                <h3 className="font-medium text-green-800 mb-1">Memory Utilization</h3>
                <p className="text-2xl font-bold">{results.memoryUtilization.toFixed(2)}%</p>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-md">
                <h3 className="font-medium text-purple-800 mb-1">Internal Fragmentation</h3>
                <p className="text-2xl font-bold">{results.internalFragmentation} units</p>
              </div>
            </div>
            
            <div className="chart-container" style={{ height: '400px' }}>
              <Bar options={chartOptions} data={renderChartData()} />
            </div>
            
            <div className="mt-6">
              <h3 className="font-medium mb-2">Allocation Details</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Process</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Allocated Block</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {results.processes.map((process: any, index: number) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap">Process {index}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{process.size}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {process.allocated !== -1 ? `Block ${process.allocated}` : 'Not Allocated'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {process.allocated !== -1 ? (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              Allocated
                            </span>
                          ) : (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                              Not Allocated
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemoryManagement;