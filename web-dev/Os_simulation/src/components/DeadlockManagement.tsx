import React, { useState } from 'react';
import { AlertTriangle, CheckCircle, Network } from 'lucide-react';
import AlgorithmCard from './ui/AlgorithmCard';
import { detectDeadlock, bankerAlgorithm } from '../utils/deadlockManagementAlgorithms';

const DeadlockManagement: React.FC = () => {
  const [algorithm, setAlgorithm] = useState<string>('rag');
  const [ragEdges, setRagEdges] = useState<string>('P0 R0, P1 R1, R0 P1, R1 P0');
  const [processes, setProcesses] = useState<string>('3');
  const [resources, setResources] = useState<string>('3');
  const [available, setAvailable] = useState<string>('3 3 2');
  
  // State for banker's algorithm
  const [allocation, setAllocation] = useState<string[]>([
    '0 1 0',
    '2 0 0',
    '3 0 2'
  ]);
  
  const [maxNeed, setMaxNeed] = useState<string[]>([
    '7 5 3',
    '3 2 2',
    '9 0 2'
  ]);
  
  const [results, setResults] = useState<any>(null);
  
  const calculateResults = () => {
    if (algorithm === 'rag') {
      const edges = ragEdges.split(',').map(edge => {
        const [source, target] = edge.trim().split(/\s+/);
        return { source, target };
      });
      
      const result = detectDeadlock(edges);
      setResults(result);
    } else {
      const n = parseInt(processes);
      const m = parseInt(resources);
      const availableArray = available.split(/\s+/).map(Number);
      
      const allocationMatrix = allocation.map(row => row.split(/\s+/).map(Number));
      const maxNeedMatrix = maxNeed.map(row => row.split(/\s+/).map(Number));
      
      const result = bankerAlgorithm(n, m, allocationMatrix, maxNeedMatrix, availableArray);
      setResults(result);
    }
  };
  
  const handleAllocationChange = (index: number, value: string) => {
    const newAllocation = [...allocation];
    newAllocation[index] = value;
    setAllocation(newAllocation);
  };
  
  const handleMaxNeedChange = (index: number, value: string) => {
    const newMaxNeed = [...maxNeed];
    newMaxNeed[index] = value;
    setMaxNeed(newMaxNeed);
  };
  
  const handleProcessesChange = (value: string) => {
    const newCount = parseInt(value);
    if (!isNaN(newCount) && newCount > 0) {
      setProcesses(value);
      
      // Adjust allocation and maxNeed arrays
      if (newCount > allocation.length) {
        // Add new rows
        const newAllocation = [...allocation];
        const newMaxNeed = [...maxNeed];
        const resourceCount = parseInt(resources) || 3;
        
        for (let i = allocation.length; i < newCount; i++) {
          newAllocation.push('0 '.repeat(resourceCount).trim());
          newMaxNeed.push('0 '.repeat(resourceCount).trim());
        }
        
        setAllocation(newAllocation);
        setMaxNeed(newMaxNeed);
      } else if (newCount < allocation.length) {
        // Remove excess rows
        setAllocation(allocation.slice(0, newCount));
        setMaxNeed(maxNeed.slice(0, newCount));
      }
    }
  };
  
  const renderResourceInputs = () => {
    if (algorithm !== 'bankers') return null;
    
    const n = parseInt(processes);
    const m = parseInt(resources);
    
    return (
      <div className="mt-6">
        <h3 className="font-medium mb-3">Resource Matrices</h3>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Available Resources (space separated)
          </label>
          <input
            type="text"
            className="input-field w-full"
            value={available}
            onChange={(e) => setAvailable(e.target.value)}
            placeholder={`e.g., ${'3 '.repeat(m).trim()}`}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium mb-2 text-sm">Allocation Matrix</h4>
            {Array.from({ length: n }).map((_, i) => (
              <div key={`alloc-${i}`} className="mb-2 flex items-center">
                <span className="w-8 inline-block font-medium text-gray-700">P{i}</span>
                <input
                  type="text"
                  className="input-field flex-1"
                  value={allocation[i] || ''}
                  onChange={(e) => handleAllocationChange(i, e.target.value)}
                  placeholder={`e.g., ${'0 '.repeat(m).trim()}`}
                />
              </div>
            ))}
          </div>
          
          <div>
            <h4 className="font-medium mb-2 text-sm">Max Need Matrix</h4>
            {Array.from({ length: n }).map((_, i) => (
              <div key={`max-${i}`} className="mb-2 flex items-center">
                <span className="w-8 inline-block font-medium text-gray-700">P{i}</span>
                <input
                  type="text"
                  className="input-field flex-1"
                  value={maxNeed[i] || ''}
                  onChange={(e) => handleMaxNeedChange(i, e.target.value)}
                  placeholder={`e.g., ${'0 '.repeat(m).trim()}`}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="fade-in">
      <h1 className="text-3xl font-bold mb-6 flex items-center">
        <AlertTriangle className="mr-2" /> Deadlock Management
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <AlgorithmCard 
          title="Resource Allocation Graph (RAG)"
          description="Detect deadlocks by visualizing the allocation and request of resources."
          icon={<Network />}
          isActive={algorithm === 'rag'}
          onClick={() => setAlgorithm('rag')}
        />
        
        <AlgorithmCard 
          title="Banker's Algorithm"
          description="Avoid deadlocks by maintaining a safe state in resource allocation."
          icon={<CheckCircle />}
          isActive={algorithm === 'bankers'}
          onClick={() => setAlgorithm('bankers')}
        />
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Input Parameters</h2>
        
        {algorithm === 'rag' ? (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Resource Allocation Graph Edges (comma separated)
            </label>
            <textarea
              className="input-field w-full"
              value={ragEdges}
              onChange={(e) => setRagEdges(e.target.value)}
              placeholder="e.g., P0 R0, P1 R1, R0 P1, R1 P0"
              rows={5}
            />
            <p className="text-sm text-gray-500 mt-1">
              Format: P0 R0 means process P0 requests resource R0, R0 P0 means resource R0 is allocated to process P0
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Number of Processes
                </label>
                <input
                  type="number"
                  className="input-field w-full"
                  value={processes}
                  onChange={(e) => handleProcessesChange(e.target.value)}
                  min="1"
                  max="10"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Number of Resource Types
                </label>
                <input
                  type="number"
                  className="input-field w-full"
                  value={resources}
                  onChange={(e) => setResources(e.target.value)}
                  min="1"
                  max="10"
                />
              </div>
            </div>
            
            {renderResourceInputs()}
          </>
        )}
        
        <button 
          className="btn-primary mt-4"
          onClick={calculateResults}
        >
          Run Simulation
        </button>
      </div>
      
      {results && (
        <div className="mt-8 fade-in">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Simulation Results</h2>
            
            {algorithm === 'rag' ? (
              <div className="flex flex-col items-center">
                <svg width="400" height="300" className="border rounded">
                  {/* We would render the graph here, but since we're focusing on the frontend conversion,
                      we'll use a placeholder and describe how the RAG visualization would work */}
                  <g>
                    {results.edges.map((edge: any, index: number) => (
                      <g key={index}>
                        <circle 
                          cx={100 + 100 * (index % 3)} 
                          cy={100}
                          r={25}
                          fill={edge.source.startsWith('P') ? 'rgba(59, 130, 246, 0.8)' : 'rgba(16, 185, 129, 0.8)'}
                        />
                        <text 
                          x={100 + 100 * (index % 3)} 
                          y={100} 
                          textAnchor="middle" 
                          dominantBaseline="middle"
                          fill="white"
                        >
                          {edge.source}
                        </text>
                        
                        <circle 
                          cx={100 + 100 * (index % 3)} 
                          cy={200}
                          r={25}
                          fill={edge.target.startsWith('P') ? 'rgba(59, 130, 246, 0.8)' : 'rgba(16, 185, 129, 0.8)'}
                        />
                        <text 
                          x={100 + 100 * (index % 3)} 
                          y={200} 
                          textAnchor="middle" 
                          dominantBaseline="middle"
                          fill="white"
                        >
                          {edge.target}
                        </text>
                        
                        <line 
                          x1={100 + 100 * (index % 3)} 
                          y1={125} 
                          x2={100 + 100 * (index % 3)} 
                          y2={175}
                          stroke="black"
                          strokeWidth={2}
                          markerEnd="url(#arrow)"
                        />
                      </g>
                    ))}
                    
                    <defs>
                      <marker 
                        id="arrow" 
                        markerWidth="10" 
                        markerHeight="10" 
                        refX="9" 
                        refY="3" 
                        orient="auto"
                        markerUnits="strokeWidth">
                        <path d="M0,0 L0,6 L9,3 z" fill="black" />
                      </marker>
                    </defs>
                  </g>
                </svg>
                
                <div className={`mt-6 p-4 rounded-md ${results.hasDeadlock ? 'bg-red-50' : 'bg-green-50'}`}>
                  <h3 className={`font-bold text-xl ${results.hasDeadlock ? 'text-red-600' : 'text-green-600'}`}>
                    {results.hasDeadlock ? 'Deadlock Detected!' : 'No Deadlock Detected'}
                  </h3>
                  <p className="mt-2">
                    {results.hasDeadlock 
                      ? 'The system is in deadlock state. Resource allocation graph contains cycles.' 
                      : 'The system is in a safe state. Resource allocation graph is cycle-free.'}
                  </p>
                </div>
              </div>
            ) : (
              <div>
                <div className={`p-4 rounded-md ${results.isSafe ? 'bg-green-50' : 'bg-red-50'}`}>
                  <h3 className={`font-bold text-xl ${results.isSafe ? 'text-green-600' : 'text-red-600'}`}>
                    {results.isSafe ? 'System is in Safe State' : 'System is in Unsafe State (Potential Deadlock)'}
                  </h3>
                  
                  {results.isSafe && (
                    <div className="mt-4">
                      <p className="font-medium mb-2">Safe Sequence:</p>
                      <div className="flex items-center">
                        {results.safeSequence.map((process: string, index: number) => (
                          <React.Fragment key={process}>
                            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded">
                              {process}
                            </span>
                            {index < results.safeSequence.length - 1 && (
                              <svg className="w-6 h-6 mx-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="mt-6">
                  <h3 className="font-medium mb-3">Resource Allocation Details</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gray-50 p-4 rounded-md">
                      <h4 className="font-medium mb-2">Allocation Matrix</h4>
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead>
                            <tr>
                              <th className="px-2 py-1">Process</th>
                              {Array.from({ length: parseInt(resources) }).map((_, i) => (
                                <th key={i} className="px-2 py-1">R{i}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {results.allocation.map((row: number[], i: number) => (
                              <tr key={i}>
                                <td className="px-2 py-1 font-medium">P{i}</td>
                                {row.map((val, j) => (
                                  <td key={j} className="px-2 py-1 text-center">{val}</td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-md">
                      <h4 className="font-medium mb-2">Max Need Matrix</h4>
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead>
                            <tr>
                              <th className="px-2 py-1">Process</th>
                              {Array.from({ length: parseInt(resources) }).map((_, i) => (
                                <th key={i} className="px-2 py-1">R{i}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {results.maxNeed.map((row: number[], i: number) => (
                              <tr key={i}>
                                <td className="px-2 py-1 font-medium">P{i}</td>
                                {row.map((val, j) => (
                                  <td key={j} className="px-2 py-1 text-center">{val}</td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-md">
                      <h4 className="font-medium mb-2">Need Matrix</h4>
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead>
                            <tr>
                              <th className="px-2 py-1">Process</th>
                              {Array.from({ length: parseInt(resources) }).map((_, i) => (
                                <th key={i} className="px-2 py-1">R{i}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {results.need.map((row: number[], i: number) => (
                              <tr key={i}>
                                <td className="px-2 py-1 font-medium">P{i}</td>
                                {row.map((val, j) => (
                                  <td key={j} className="px-2 py-1 text-center">{val}</td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 bg-gray-50 p-4 rounded-md">
                    <h4 className="font-medium mb-2">Available Resources</h4>
                    <div className="flex space-x-3">
                      {results.available.map((val: number, i: number) => (
                        <div key={i} className="bg-blue-100 text-blue-800 px-3 py-1 rounded">
                          R{i}: {val}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DeadlockManagement;