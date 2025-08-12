import React, { useState } from 'react';
import { Layout } from 'lucide-react';
import Navbar from './components/Navbar';
import CPUScheduling from './components/CPUScheduling';
import DiskScheduling from './components/DiskScheduling';
import MemoryManagement from './components/MemoryManagement';
import PageReplacement from './components/PageReplacement';
import DeadlockManagement from './components/DeadlockManagement';
import './App.css';

function App() {
  const [activeSection, setActiveSection] = useState<string>('home');

  const renderSection = () => {
    switch (activeSection) {
      case 'cpu':
        return <CPUScheduling />;
      case 'disk':
        return <DiskScheduling />;
      case 'memory':
        return <MemoryManagement />;
      case 'page':
        return <PageReplacement />;
      case 'deadlock':
        return <DeadlockManagement />;
      default:
        return (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <Layout className="w-16 h-16 mb-4 text-primary" />
            <h1 className="text-4xl font-bold mb-4">OS Explorer - Simulation Tool</h1>
            <p className="text-xl max-w-2xl mb-8">
              An interactive web application for simulating and visualizing operating system concepts.
              Select a category from the navigation to begin exploring.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { id: 'cpu', title: 'CPU Scheduling', description: 'Simulate FCFS, SJF, Round Robin, and Priority scheduling algorithms' },
                { id: 'disk', title: 'Disk Scheduling', description: 'Visualize FCFS, SSTF, SCAN, C-SCAN, LOOK and C-LOOK algorithms' },
                { id: 'memory', title: 'Memory Management', description: 'Explore First Fit, Best Fit, and Worst Fit allocation strategies' },
                { id: 'page', title: 'Page Replacement', description: 'Understand FIFO, LRU, and Optimal page replacement policies' },
                { id: 'deadlock', title: 'Deadlock Management', description: 'Analyze deadlocks using Resource Allocation Graphs and Banker\'s Algorithm' },
              ].map((item) => (
                <div 
                  key={item.id}
                  className="bg-white rounded-lg shadow-md p-6 cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-lg"
                  onClick={() => setActiveSection(item.id)}
                >
                  <h2 className="text-xl font-semibold mb-3">{item.title}</h2>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar activeSection={activeSection} setActiveSection={setActiveSection} />
      <main className="container mx-auto py-8 px-4">
        {renderSection()}
      </main>
      <footer className="bg-gray-800 text-white py-6 mt-auto">
        <div className="container mx-auto px-4 text-center">
          <p>OS Explorer Web Application &copy; {new Date().getFullYear()}</p>
        </div>
      </footer>
    </div>
  );
}

export default App;