import React, { useState } from 'react';
import { FileText, Layers } from 'lucide-react';
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
import { fifo, lru, optimal } from '../utils/pageReplacementAlgorithms';

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

const PageReplacement: React.FC = () => {
  const [referenceString, setReferenceString] = useState<string>('7 0 1 2 0 3 0 4 2 3 0 3 2 1 2 0 1 7 0 1');
  const [frameCapacity, setFrameCapacity] = useState<string>('3');
  const [algorithm, setAlgorithm] = useState<string>('fifo');
  const [results, setResults] = useState<any>(null);
  
  const calculateResults = () => {
    const pages = referenceString.split(/\s+/).map(Number);
    const capacity = parseInt(frameCapacity);
    
    let result;
    switch (algorithm) {
      case 'fifo':
        result = fifo(pages, capacity);
        break;
      case 'lru':
        result = lru(pages, capacity);
        break;
      case 'optimal':
        result = optimal(pages, capacity);
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
        beginAtZero: true,
        title: {
          display: true,
          text: 'Page Number'
        },
        ticks: {
          stepSize: 1
        }
      },
      x: {
        title: {
          display: true,
          text: 'Reference Sequence'
        }
      }
    },
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Page Reference Pattern',
      },
    },
  };

  const frameChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        title: {
          display: true,
          text: 'Frame'
        },
        ticks: {
          stepSize: 1
        }
      },
      x: {
        title: {
          display: true,
          text: 'Reference Sequence'
        }
      }
    },
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: true,
        text: 'Frame Contents Over Time',
      },
    },
  };

  const renderChartData = () => {
    if (!results) return null;
    
    return {
      labels: Array.from({ length: results.pages.length }, (_, i) => i),
      datasets: [
        {
          label: 'Page Reference',
          data: results.pages,
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.5)',
          pointStyle: 'circle',
          pointRadius: 6,
        }
      ],
    };
  };

  const renderFrameChartData = () => {
    if (!results) return null;
    
    // Create datasets for each frame
    const datasets = [];
    
    for (let i = 0; i < results.capacity; i++) {
      datasets.push({
        label: `Frame ${i}`,
        data: results.frameHistory.map((frames: any) => frames[i] ?? null),
        borderColor: `rgba(${(i * 50) % 255}, ${(i * 100) % 255}, ${(i * 150) % 255}, 1)`,
        backgroundColor: `rgba(${(i * 50) % 255}, ${(i * 100) % 255}, ${(i * 150) % 255}, 0.2)`,
        pointStyle: 'rectRot',
        pointRadius: 6,
        showLine: false,
      });
    }
    
    return {
      labels: Array.from({ length: results.frameHistory.length }, (_, i) => i),
      datasets,
    };
  };

  return (
    <div className="fade-in">
      <h1 className="text-3xl font-bold mb-6 flex items-center">
        <FileText className="mr-2" /> Page Replacement Simulation
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <AlgorithmCard 
          title="FIFO (First In First Out)"
          description="Replaces the page that has been in memory the longest."
          icon={<Layers />}
          isActive={algorithm === 'fifo'}
          onClick={() => setAlgorithm('fifo')}
        />
        
        <AlgorithmCard 
          title="LRU (Least Recently Used)"
          description="Replaces the page that has not been used for the longest period of time."
          icon={<Layers />}
          isActive={algorithm === 'lru'}
          onClick={() => setAlgorithm('lru')}
        />
        
        <AlgorithmCard 
          title="Optimal"
          description="Replaces the page that will not be used for the longest period of time in the future."
          icon={<Layers />}
          isActive={algorithm === 'optimal'}
          onClick={() => setAlgorithm('optimal')}
        />
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Input Parameters</h2>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Page Reference String (space separated)
          </label>
          <input
            type="text"
            className="input-field w-full"
            value={referenceString}
            onChange={(e) => setReferenceString(e.target.value)}
            placeholder="e.g., 7 0 1 2 0 3 0 4 2 3 0 3 2 1 2 0 1 7 0 1"
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Frame Capacity
          </label>
          <input
            type="number"
            className="input-field w-full"
            value={frameCapacity}
            onChange={(e) => setFrameCapacity(e.target.value)}
            min="1"
            max="10"
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
                <h3 className="font-medium text-blue-800 mb-1">Page Faults</h3>
                <p className="text-2xl font-bold">{results.pageFaults}</p>
              </div>
              
              <div className="bg-green-50 p-4 rounded-md">
                <h3 className="font-medium text-green-800 mb-1">Page Fault Rate</h3>
                <p className="text-2xl font-bold">{(results.pageFaults / results.pages.length * 100).toFixed(2)}%</p>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-md">
                <h3 className="font-medium text-purple-800 mb-1">Page Hits</h3>
                <p className="text-2xl font-bold">{results.pages.length - results.pageFaults}</p>
              </div>
            </div>
            
            <div className="chart-container" style={{ height: '250px' }}>
              <Line options={chartOptions} data={renderChartData()} />
            </div>
            
            <div className="chart-container mt-6" style={{ height: '300px' }}>
              <Line options={frameChartOptions} data={renderFrameChartData()} />
            </div>
            
            <div className="mt-6">
              <h3 className="font-medium mb-2">Page Fault Sequence</h3>
              <div className="bg-gray-50 p-4 rounded-md overflow-x-auto">
                <div className="flex">
                  {results.faultSequence.map((isFault: boolean, index: number) => (
                    <div key={index} className="flex flex-col items-center mx-1">
                      <span className="font-mono">{results.pages[index]}</span>
                      <span className={`w-6 h-6 flex items-center justify-center rounded-full mt-1 ${
                        isFault 
                          ? 'bg-red-500 text-white' 
                          : 'bg-green-500 text-white'
                      }`}>
                        {isFault ? 'F' : 'H'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PageReplacement;