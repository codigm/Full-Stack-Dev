import React, { useState } from 'react';
import { HardDrive, ArrowUpDown } from 'lucide-react';
import { Line } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend 
} from 'chart.js';
import AlgorithmCard from './ui/AlgorithmCard';
import { 
  calculateFCFS, 
  calculateSSTF, 
  calculateSCAN, 
  calculateCSCAN, 
  calculateLOOK, 
  calculateCLOOK 
} from '../utils/diskSchedulingAlgorithms';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const DiskScheduling: React.FC = () => {
  const [requests, setRequests] = useState<string>('98 183 37 122 14 124 65 67');
  const [headPosition, setHeadPosition] = useState<string>('53');
  const [algorithm, setAlgorithm] = useState<string>('fcfs');
  const [results, setResults] = useState<any>(null);
  
  const calculateResults = () => {
    const requestsArray = requests.split(/\s+/).map(Number);
    const head = parseInt(headPosition);
    
    let result;
    switch (algorithm) {
      case 'fcfs':
        result = calculateFCFS(requestsArray, head);
        break;
      case 'sstf':
        result = calculateSSTF(requestsArray, head);
        break;
      case 'scan':
        result = calculateSCAN(requestsArray, head);
        break;
      case 'cscan':
        result = calculateCSCAN(requestsArray, head);
        break;
      case 'look':
        result = calculateLOOK(requestsArray, head);
        break;
      case 'clook':
        result = calculateCLOOK(requestsArray, head);
        break;
      default:
        result = null;
    }
    
    setResults(result);
  };
  
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        reverse: true,
        title: {
          display: true,
          text: 'Cylinder Position'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Seek Sequence'
        }
      }
    },
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Disk Head Movement',
      },
    },
  };

  const renderChartData = () => {
    if (!results) return null;
    
    return {
      labels: results.sequence.map((_: any, index: number) => index),
      datasets: [
        {
          label: 'Head Position',
          data: results.sequence,
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.5)',
          tension: 0.1,
        },
      ],
    };
  };

  const algorithmDescriptions = {
    fcfs: "First Come First Served: Disk requests are serviced in the order they arrive.",
    sstf: "Shortest Seek Time First: Selects the request closest to the current head position.",
    scan: "SCAN: Head moves from one end to the other, servicing requests along the way.",
    cscan: "C-SCAN: Like SCAN but after reaching the end, the head immediately returns to the beginning.",
    look: "LOOK: Like SCAN but stops and reverses direction once it reaches the last request in that direction.",
    clook: "C-LOOK: Like C-SCAN but goes only as far as the last request in each direction.",
  };

  return (
    <div className="fade-in">
      <h1 className="text-3xl font-bold mb-6 flex items-center">
        <HardDrive className="mr-2" /> Disk Scheduling Simulation
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <AlgorithmCard 
          title="FCFS"
          description={algorithmDescriptions.fcfs}
          icon={<ArrowUpDown />}
          isActive={algorithm === 'fcfs'}
          onClick={() => setAlgorithm('fcfs')}
        />
        
        <AlgorithmCard 
          title="SSTF"
          description={algorithmDescriptions.sstf}
          icon={<ArrowUpDown />}
          isActive={algorithm === 'sstf'}
          onClick={() => setAlgorithm('sstf')}
        />
        
        <AlgorithmCard 
          title="SCAN"
          description={algorithmDescriptions.scan}
          icon={<ArrowUpDown />}
          isActive={algorithm === 'scan'}
          onClick={() => setAlgorithm('scan')}
        />
        
        <AlgorithmCard 
          title="C-SCAN"
          description={algorithmDescriptions.cscan}
          icon={<ArrowUpDown />}
          isActive={algorithm === 'cscan'}
          onClick={() => setAlgorithm('cscan')}
        />
        
        <AlgorithmCard 
          title="LOOK"
          description={algorithmDescriptions.look}
          icon={<ArrowUpDown />}
          isActive={algorithm === 'look'}
          onClick={() => setAlgorithm('look')}
        />
        
        <AlgorithmCard 
          title="C-LOOK"
          description={algorithmDescriptions.clook}
          icon={<ArrowUpDown />}
          isActive={algorithm === 'clook'}
          onClick={() => setAlgorithm('clook')}
        />
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Input Parameters</h2>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Disk Requests (space separated)
          </label>
          <input
            type="text"
            className="input-field w-full"
            value={requests}
            onChange={(e) => setRequests(e.target.value)}
            placeholder="e.g., 98 183 37 122 14 124 65 67"
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Initial Head Position
          </label>
          <input
            type="number"
            className="input-field w-full"
            value={headPosition}
            onChange={(e) => setHeadPosition(e.target.value)}
            min="0"
            max="199"
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
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-md">
                <h3 className="font-medium text-blue-800 mb-1">Total Head Movement</h3>
                <p className="text-2xl font-bold">{results.totalHeadMovement} cylinders</p>
              </div>
              
              <div className="bg-green-50 p-4 rounded-md">
                <h3 className="font-medium text-green-800 mb-1">Average Seek Time</h3>
                <p className="text-2xl font-bold">{results.averageSeekTime.toFixed(2)} cylinders</p>
              </div>
            </div>
            
            <div className="chart-container" style={{ height: '400px' }}>
              <Line options={chartOptions} data={renderChartData()} />
            </div>
            
            <div className="mt-6">
              <h3 className="font-medium mb-2">Seek Sequence</h3>
              <div className="bg-gray-50 p-4 rounded-md overflow-x-auto">
                <p className="font-mono">
                  {results.sequence.join(' → ')}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DiskScheduling;