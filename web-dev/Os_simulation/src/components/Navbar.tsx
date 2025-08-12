import React from 'react';
import { Layout, Cpu, HardDrive, MemoryStick, FileText, AlertTriangle, Home } from 'lucide-react';

interface NavbarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ activeSection, setActiveSection }) => {
  const navItems = [
    { id: 'home', label: 'Home', icon: <Home size={20} /> },
    { id: 'cpu', label: 'CPU Scheduling', icon: <Cpu size={20} /> },
    { id: 'disk', label: 'Disk Scheduling', icon: <HardDrive size={20} /> },
    { id: 'memory', label: 'Memory Management', icon: <MemoryStick size={20} /> },
    { id: 'page', label: 'Page Replacement', icon: <FileText size={20} /> },
    { id: 'deadlock', label: 'Deadlock Management', icon: <AlertTriangle size={20} /> },
  ];

  return (
    <nav className="bg-gray-800 text-white shadow-md sticky top-0 z-10">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row">
          <div className="flex items-center py-4">
            <Layout className="mr-2" />
            <span className="font-bold text-xl">OS Explorer</span>
          </div>
          
          <div className="md:ml-auto overflow-x-auto md:overflow-visible">
            <ul className="flex space-x-1 md:space-x-4 py-4 md:py-0">
              {navItems.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => setActiveSection(item.id)}
                    className={`flex items-center px-3 py-2 rounded-md transition-colors ${
                      activeSection === item.id 
                        ? 'bg-blue-600 text-white' 
                        : 'hover:bg-gray-700'
                    }`}
                  >
                    <span className="mr-2">{item.icon}</span>
                    <span className="hidden md:inline">{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;