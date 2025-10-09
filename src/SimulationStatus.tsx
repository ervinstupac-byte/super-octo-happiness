import React from 'react';

interface SimulationStatusProps {
  log: string;
  progress: number;
}

const SimulationStatus: React.FC<SimulationStatusProps> = ({ log, progress }) => {
  return (
    <div className="bg-gray-800 p-4 rounded-lg mb-4">
      <h3 className="text-lg font-bold text-white mb-2">CFD Simulation Status</h3>
      <div className="w-full bg-gray-600 rounded-full h-4 mb-2">
        <div 
          className="bg-blue-500 h-4 rounded-full transition-all duration-500 ease-in-out"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <pre className="bg-black text-white p-4 rounded-md h-64 overflow-y-auto text-sm whitespace-pre-wrap">
        {log}
      </pre>
    </div>
  );
};

export default SimulationStatus;
