import React, { useState } from 'react';
import { CheckCircle, AlertTriangle, XCircle, Plus, Minus } from 'lucide-react';

interface Node {
  id: string;
  name: string;
  status: 'healthy' | 'warning' | 'critical';
  type: 'master' | 'worker';
  pods: number;
  podCapacity: number;
}

const ClusterVisualization: React.FC = () => {
  const [zoomLevel, setZoomLevel] = useState(1);
  
  const nodes: Node[] = [
    { id: 'node-1', name: 'master-1', status: 'healthy', type: 'master', pods: 6, podCapacity: 10 },
    { id: 'node-2', name: 'worker-1', status: 'healthy', type: 'worker', pods: 12, podCapacity: 15 },
    { id: 'node-3', name: 'worker-2', status: 'healthy', type: 'worker', pods: 14, podCapacity: 15 },
    { id: 'node-4', name: 'worker-3', status: 'warning', type: 'worker', pods: 10, podCapacity: 15 },
    { id: 'node-5', name: 'worker-4', status: 'healthy', type: 'worker', pods: 9, podCapacity: 15 },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle size={16} className="text-green-500" />;
      case 'warning':
        return <AlertTriangle size={16} className="text-amber-500" />;
      case 'critical':
        return <XCircle size={16} className="text-red-500" />;
      default:
        return null;
    }
  };

  const getNodeColorClass = (status: string, type: string) => {
    if (type === 'master') {
      return 'border-violet-500 bg-gradient-to-br from-violet-50 to-blue-100 dark:from-violet-950 dark:to-blue-950';
    }
    
    switch (status) {
      case 'healthy':
        return 'border-green-500 bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-950 dark:to-blue-950';
      case 'warning':
        return 'border-amber-500 bg-gradient-to-br from-amber-50 to-violet-50 dark:from-amber-950 dark:to-violet-950';
      case 'critical':
        return 'border-red-500 bg-gradient-to-br from-red-50 to-violet-50 dark:from-red-950 dark:to-violet-950';
      default:
        return 'border-blue-300 bg-gradient-to-br from-blue-50 to-violet-50 dark:from-blue-900 dark:to-violet-900';
    }
  };

  const handleZoomIn = () => {
    if (zoomLevel < 1.5) {
      setZoomLevel(zoomLevel + 0.1);
    }
  };

  const handleZoomOut = () => {
    if (zoomLevel > 0.5) {
      setZoomLevel(zoomLevel - 0.1);
    }
  };

  return (
    <div className="bg-gradient-to-br from-white via-blue-50 to-violet-50 dark:from-gray-900 dark:via-blue-950 dark:to-violet-950 rounded-lg shadow-lg border border-blue-200 dark:border-blue-800">
      <div className="p-5">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-lg font-medium bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">Cluster Visualization</h2>
          <div className="flex space-x-2">
            <button 
              onClick={handleZoomOut}
              className="p-1 rounded bg-gradient-to-r from-blue-100 to-violet-100 dark:from-blue-800 dark:to-violet-800 text-blue-600 dark:text-blue-400 hover:from-blue-200 hover:to-violet-200 dark:hover:from-blue-700 dark:hover:to-violet-700"
            >
              <Minus size={16} />
            </button>
            <button 
              onClick={handleZoomIn}
              className="p-1 rounded bg-gradient-to-r from-blue-100 to-violet-100 dark:from-blue-800 dark:to-violet-800 text-blue-600 dark:text-blue-400 hover:from-blue-200 hover:to-violet-200 dark:hover:from-blue-700 dark:hover:to-violet-700"
            >
              <Plus size={16} />
            </button>
          </div>
        </div>
        
        <div className="border-2 border-dashed border-blue-200 dark:border-blue-800 rounded-lg p-6 h-80 relative overflow-hidden bg-gradient-to-br from-white/50 to-violet-50/50 dark:from-gray-800/50 dark:to-violet-900/50">
          <div 
            className="w-full h-full transition-transform duration-200"
            style={{ 
              transform: `scale(${zoomLevel})`,
              transformOrigin: 'center center'
            }}
          >
            {/* Master node in center */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className={`w-24 h-24 rounded-lg border-2 ${getNodeColorClass('healthy', 'master')} flex flex-col items-center justify-center shadow-lg`}>
                <span className="text-xs font-semibold text-violet-700 dark:text-violet-400">master-1</span>
                <div className="mt-1 flex items-center justify-center">
                  {getStatusIcon('healthy')}
                </div>
                <span className="mt-1 text-xs text-violet-600 dark:text-violet-400">6/10 pods</span>
              </div>
            </div>
            
            {/* Worker nodes in a circle around master */}
            {nodes.filter(node => node.type === 'worker').map((node, index, array) => {
              const angle = (index * 2 * Math.PI) / array.length;
              const radius = 120; // Distance from center
              const x = Math.cos(angle) * radius;
              const y = Math.sin(angle) * radius;
              
              return (
                <div 
                  key={node.id}
                  className="absolute"
                  style={{ 
                    top: `calc(50% + ${y}px)`,
                    left: `calc(50% + ${x}px)`,
                    transform: 'translate(-50%, -50%)'
                  }}
                >
                  <div className={`w-20 h-20 rounded-lg border-2 ${getNodeColorClass(node.status, 'worker')} flex flex-col items-center justify-center shadow-lg`}>
                    <span className="text-xs font-semibold text-blue-700 dark:text-blue-300">{node.name}</span>
                    <div className="mt-1 flex items-center justify-center">
                      {getStatusIcon(node.status)}
                    </div>
                    <span className="mt-1 text-xs text-blue-600 dark:text-blue-400">{node.pods}/{node.podCapacity} pods</span>
                  </div>
                </div>
              );
            })}
            
            {/* Connection lines from master to workers */}
            <svg className="absolute inset-0 w-full h-full z-0 pointer-events-none">
              {nodes.filter(node => node.type === 'worker').map((node, index, array) => {
                const angle = (index * 2 * Math.PI) / array.length;
                const radius = 120;
                const x = Math.cos(angle) * radius;
                const y = Math.sin(angle) * radius;
                
                return (
                  <line 
                    key={node.id}
                    x1="50%" 
                    y1="50%" 
                    x2={`calc(50% + ${x}px)`} 
                    y2={`calc(50% + ${y}px)`} 
                    stroke={node.status === 'warning' ? '#f59e0b' : '#8b5cf6'} 
                    strokeWidth="2"
                    strokeDasharray={node.status === 'warning' ? '5,5' : ''} 
                    className="opacity-40 dark:opacity-60"
                  />
                );
              })}
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClusterVisualization;