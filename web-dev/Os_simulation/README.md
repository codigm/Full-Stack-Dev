# OS Explorer - Operating System Simulation Tool

A comprehensive web application for simulating and visualizing operating system concepts including CPU scheduling, disk scheduling, memory management, page replacement, and deadlock management.

## Features

- **CPU Scheduling**: Simulate FCFS, SJF, Round Robin, and Priority scheduling algorithms
- **Disk Scheduling**: Visualize FCFS, SSTF, SCAN, C-SCAN, LOOK and C-LOOK algorithms
- **Memory Management**: Explore First Fit, Best Fit, and Worst Fit allocation strategies
- **Page Replacement**: Understand FIFO, LRU, and Optimal page replacement policies
- **Deadlock Management**: Analyze deadlocks using Resource Allocation Graphs and Banker's Algorithm

## Quick Start

### Prerequisites
- Node.js (version 16 or higher)
- npm (comes with Node.js)

### Installation

1. Clone or download the project
2. Navigate to the project directory
3. Install dependencies:
```bash
npm install
```

4. Start the development server:
```bash
npm run dev
```

5. Open your browser and navigate to the URL shown in the terminal (typically `http://localhost:5173`)

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the project for production
- `npm run preview` - Preview the production build
- `npm run lint` - Run ESLint to check code quality
- `npm test` - Run tests

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Chart.js with react-chartjs-2
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Testing**: Vitest

## Project Structure

```
src/
├── components/           # React components
│   ├── ui/              # Reusable UI components
│   ├── CPUScheduling.tsx
│   ├── DiskScheduling.tsx
│   ├── MemoryManagement.tsx
│   ├── PageReplacement.tsx
│   ├── DeadlockManagement.tsx
│   └── Navbar.tsx
├── utils/               # Algorithm implementations
│   ├── cpuSchedulingAlgorithms.ts
│   ├── diskSchedulingAlgorithms.ts
│   ├── memoryManagementAlgorithms.ts
│   ├── pageReplacementAlgorithms.ts
│   └── deadlockManagementAlgorithms.ts
├── App.tsx             # Main application component
├── App.css             # Global styles
└── main.tsx            # Application entry point
```

## Usage

1. **Select a Category**: Choose from CPU Scheduling, Disk Scheduling, Memory Management, Page Replacement, or Deadlock Management from the navigation bar.

2. **Choose an Algorithm**: Click on the algorithm cards to select the specific algorithm you want to simulate.

3. **Input Parameters**: Enter the required parameters (burst times, memory sizes, page references, etc.) in the input fields.

4. **Run Simulation**: Click the "Run Simulation" button to execute the algorithm and view results.

5. **Analyze Results**: View the interactive charts, tables, and visualizations to understand how the algorithm works.

## Features Highlights

### CPU Scheduling
- Interactive Gantt charts showing process execution timeline
- Color-coded process visualization
- Detailed metrics including waiting time and turnaround time
- Support for Round Robin time quantum

### Disk Scheduling
- Visual representation of disk head movement
- Line charts showing seek patterns
- Comparison of different disk scheduling algorithms

### Memory Management
- Visual memory allocation representation
- Memory utilization statistics
- Internal fragmentation analysis

### Page Replacement
- Frame-by-frame visualization of page replacement
- Page fault tracking and analysis
- Hit/miss ratio calculations

### Deadlock Management
- Resource Allocation Graph visualization
- Banker's Algorithm safety analysis
- Safe sequence determination

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the MIT License.

## Support

For questions or issues, please create an issue in the project repository.