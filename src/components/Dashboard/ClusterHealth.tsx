import React from 'react';
import { CheckCircle, AlertTriangle, XCircle, Activity, TrendingUp } from 'lucide-react';

const ClusterHealth: React.FC = () => {
  const clusterStats = {
    total: 3,
    healthy: 2,
    warning: 1,
    critical: 0
  };

  const health = [
    { name: 'Production', status: 'healthy', uptime: '99.98%', nodes: 8, pods: 42, cpu: 67, memory: 45 },
    { name: 'Staging', status: 'warning', uptime: '98.54%', nodes: 4, pods: 23, cpu: 89, memory: 72 },
    { name: 'Development', status: 'healthy', uptime: '99.87%', nodes: 3, pods: 18, cpu: 34, memory: 28 },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle size={18} className="text-green-500" />;
      case 'warning':
        return <AlertTriangle size={18} className="text-amber-500" />;
      case 'critical':
        return <XCircle size={18} className="text-red-500" />;
      default:
        return <Activity size={18} className="text-gray-500" />;
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'warning':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400';
      case 'critical':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Cluster Health</h2>
          <div className="flex items-center text-sm text-green-600 dark:text-green-400">
            <TrendingUp size={16} className="mr-1" />
            +2.3% this week
          </div>
        </div>
        
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Clusters</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{clusterStats.total}</p>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
            <p className="text-sm text-green-600 dark:text-green-400 mb-1">Healthy</p>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">{clusterStats.healthy}</p>
          </div>
          <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4">
            <p className="text-sm text-amber-600 dark:text-amber-400 mb-1">Warning</p>
            <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">{clusterStats.warning}</p>
          </div>
          <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
            <p className="text-sm text-red-600 dark:text-red-400 mb-1">Critical</p>
            <p className="text-2xl font-bold text-red-600 dark:text-red-400">{clusterStats.critical}</p>
          </div>
        </div>
        
        <div className="space-y-4">
          {health.map((cluster, index) => (
            <div key={index} className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  {getStatusIcon(cluster.status)}
                  <span className="ml-3 font-medium text-gray-900 dark:text-white">{cluster.name}</span>
                  <span className={`ml-3 text-xs font-medium px-2 py-1 rounded-full ${getStatusClass(cluster.status)}`}>
                    {cluster.status.charAt(0).toUpperCase() + cluster.status.slice(1)}
                  </span>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Uptime: {cluster.uptime}
                </div>
              </div>
              <div className="grid grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Nodes:</span>
                  <span className="ml-1 font-medium text-gray-900 dark:text-white">{cluster.nodes}</span>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Pods:</span>
                  <span className="ml-1 font-medium text-gray-900 dark:text-white">{cluster.pods}</span>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">CPU:</span>
                  <span className="ml-1 font-medium text-gray-900 dark:text-white">{cluster.cpu}%</span>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Memory:</span>
                  <span className="ml-1 font-medium text-gray-900 dark:text-white">{cluster.memory}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ClusterHealth;