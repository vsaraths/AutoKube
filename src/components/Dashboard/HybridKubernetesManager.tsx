import React, { useState, useEffect } from 'react';
import { Server, Globe, Network, Activity, CheckCircle, AlertTriangle, XCircle, Clock, Target, BarChart3, Zap, Cloud } from 'lucide-react';
import { HybridKubernetesManager, KubernetesCluster, HybridConnection, WorkloadDistribution } from '../../api/hybrid-kubernetes-manager';

const HybridKubernetesManagerComponent: React.FC = () => {
  const [clusters, setClusters] = useState<KubernetesCluster[]>([]);
  const [connections, setConnections] = useState<HybridConnection[]>([]);
  const [workloadDistributions, setWorkloadDistributions] = useState<WorkloadDistribution[]>([]);
  const [selectedCluster, setSelectedCluster] = useState<KubernetesCluster | null>(null);
  const [selectedConnection, setSelectedConnection] = useState<HybridConnection | null>(null);
  const [hybridReport, setHybridReport] = useState<any>(null);
  const [optimizationSuggestions, setOptimizationSuggestions] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'clusters' | 'connections' | 'workloads'>('clusters');

  useEffect(() => {
    const manager = HybridKubernetesManager.getInstance();
    
    const loadData = async () => {
      try {
        const clusterData = await manager.getClusters();
        setClusters(clusterData);
        
        const connectionData = await manager.getConnections();
        setConnections(connectionData);
        
        const workloadData = await manager.getWorkloadDistributions();
        setWorkloadDistributions(workloadData);
        
        const report = manager.generateHybridReport();
        setHybridReport(report);
        
        const suggestions = manager.generateWorkloadOptimizationSuggestions();
        setOptimizationSuggestions(suggestions);
      } catch (error) {
        console.error('Failed to load hybrid Kubernetes data:', error);
      }
    };

    loadData();
    
    // Update every 30 seconds
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, []);

  const getClusterTypeColor = (type: string) => {
    switch (type) {
      case 'cloud':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'on-premises':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
      case 'edge':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'inactive':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400';
      case 'provisioning':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'decommissioning':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      case 'maintenance':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400';
    }
  };

  const getConnectionStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'inactive':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400';
      case 'degraded':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400';
      case 'failed':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400';
    }
  };

  const getUtilizationColor = (utilization: number) => {
    if (utilization > 80) return 'text-red-600 dark:text-red-400';
    if (utilization > 60) return 'text-amber-600 dark:text-amber-400';
    return 'text-green-600 dark:text-green-400';
  };

  const getWorkloadStrategyColor = (strategy: string) => {
    switch (strategy) {
      case 'round-robin':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'weighted':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
      case 'locality-aware':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'cost-optimized':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400';
      case 'latency-optimized':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'text-green-600 dark:text-green-400';
    if (confidence >= 75) return 'text-blue-600 dark:text-blue-400';
    if (confidence >= 60) return 'text-amber-600 dark:text-amber-400';
    return 'text-red-600 dark:text-red-400';
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="p-2 rounded-lg bg-gradient-to-r from-green-500 to-blue-600 text-white mr-3">
              <Server size={20} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Hybrid Kubernetes Manager</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Unified management of cloud, on-premises, and edge Kubernetes clusters</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setActiveTab('clusters')}
              className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                activeTab === 'clusters' 
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' 
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              Clusters
            </button>
            <button
              onClick={() => setActiveTab('connections')}
              className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                activeTab === 'connections' 
                  ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' 
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              Connections
            </button>
            <button
              onClick={() => setActiveTab('workloads')}
              className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                activeTab === 'workloads' 
                  ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              Workloads
            </button>
          </div>
        </div>

        {/* Environment Summary */}
        {hybridReport && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-lg p-4">
              <p className="text-sm text-blue-600 dark:text-blue-400 mb-1">Total Clusters</p>
              <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{hybridReport.summary.totalClusters}</p>
            </div>
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg p-4">
              <p className="text-sm text-purple-600 dark:text-purple-400 mb-1">Connections</p>
              <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">{hybridReport.summary.totalConnections}</p>
            </div>
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg p-4">
              <p className="text-sm text-green-600 dark:text-green-400 mb-1">Workloads</p>
              <p className="text-2xl font-bold text-green-700 dark:text-green-300">{hybridReport.summary.totalWorkloads}</p>
            </div>
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-lg p-4">
              <p className="text-sm text-amber-600 dark:text-amber-400 mb-1">Avg Latency</p>
              <p className="text-2xl font-bold text-amber-700 dark:text-amber-300">{hybridReport.performance.averageLatency}ms</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Panel - List of Clusters/Connections/Workloads */}
          <div>
            {activeTab === 'clusters' && (
              <>
                <h3 className="text-md font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                  <Server size={18} className="mr-2 text-blue-600 dark:text-blue-400" />
                  Kubernetes Clusters
                </h3>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {clusters.map((cluster) => (
                    <div 
                      key={cluster.clusterId}
                      className={`p-4 border rounded-lg cursor-pointer transition-all ${
                        selectedCluster?.clusterId === cluster.clusterId 
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                          : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 bg-gray-50 dark:bg-gray-700/50'
                      }`}
                      onClick={() => {
                        setSelectedCluster(cluster);
                        setSelectedConnection(null);
                      }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <span className="font-medium text-gray-900 dark:text-white">{cluster.name}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`text-xs px-2 py-1 rounded-full font-medium ${getClusterTypeColor(cluster.type)}`}>
                            {cluster.type}
                          </span>
                          <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(cluster.status)}`}>
                            {cluster.status}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between mb-2 text-sm">
                        <span className="text-gray-600 dark:text-gray-400">{cluster.provider} • {cluster.region}</span>
                        <span className="text-gray-600 dark:text-gray-400">v{cluster.version}</span>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-3 text-xs">
                        <div>
                          <span className="text-gray-600 dark:text-gray-400">CPU:</span>
                          <span className={`ml-1 font-medium ${getUtilizationColor(cluster.utilization.cpu)}`}>
                            {cluster.utilization.cpu}%
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600 dark:text-gray-400">Memory:</span>
                          <span className={`ml-1 font-medium ${getUtilizationColor(cluster.utilization.memory)}`}>
                            {cluster.utilization.memory}%
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600 dark:text-gray-400">Nodes:</span>
                          <span className="ml-1 font-medium text-gray-900 dark:text-white">
                            {cluster.nodeCount}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {activeTab === 'connections' && (
              <>
                <h3 className="text-md font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                  <Network size={18} className="mr-2 text-purple-600 dark:text-purple-400" />
                  Hybrid Connections
                </h3>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {connections.map((connection) => (
                    <div 
                      key={connection.connectionId}
                      className={`p-4 border rounded-lg cursor-pointer transition-all ${
                        selectedConnection?.connectionId === connection.connectionId 
                          ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20' 
                          : 'border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600 bg-gray-50 dark:bg-gray-700/50'
                      }`}
                      onClick={() => {
                        setSelectedConnection(connection);
                        setSelectedCluster(null);
                      }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <span className="font-medium text-gray-900 dark:text-white">{connection.name}</span>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${getConnectionStatusColor(connection.status)}`}>
                          {connection.status}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between mb-2 text-sm">
                        <span className="text-gray-600 dark:text-gray-400">
                          {clusters.find(c => c.clusterId === connection.sourceClusterId)?.name || connection.sourceClusterId} → 
                          {clusters.find(c => c.clusterId === connection.targetClusterId)?.name || connection.targetClusterId}
                        </span>
                        <span className="text-gray-600 dark:text-gray-400">{connection.connectionType}</span>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-3 text-xs">
                        <div>
                          <span className="text-gray-600 dark:text-gray-400">Latency:</span>
                          <span className={`ml-1 font-medium ${
                            connection.latency > 50 ? 'text-red-600 dark:text-red-400' :
                            connection.latency > 30 ? 'text-amber-600 dark:text-amber-400' :
                            'text-green-600 dark:text-green-400'
                          }`}>
                            {connection.latency}ms
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600 dark:text-gray-400">Bandwidth:</span>
                          <span className="ml-1 font-medium text-gray-900 dark:text-white">
                            {connection.bandwidth}Mbps
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600 dark:text-gray-400">Packet Loss:</span>
                          <span className={`ml-1 font-medium ${
                            connection.metrics.packetLoss > 1 ? 'text-red-600 dark:text-red-400' :
                            connection.metrics.packetLoss > 0.5 ? 'text-amber-600 dark:text-amber-400' :
                            'text-green-600 dark:text-green-400'
                          }`}>
                            {connection.metrics.packetLoss}%
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {activeTab === 'workloads' && (
              <>
                <h3 className="text-md font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                  <Cloud size={18} className="mr-2 text-green-600 dark:text-green-400" />
                  Workload Distributions
                </h3>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {workloadDistributions.map((workload) => (
                    <div 
                      key={workload.distributionId}
                      className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700/50"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-900 dark:text-white">{workload.name}</span>
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${getWorkloadStrategyColor(workload.strategy)}`}>
                          {workload.strategy.replace('-', ' ')}
                        </span>
                      </div>
                      
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        {workload.workloadType}
                      </p>
                      
                      <div className="mb-3">
                        <h4 className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">Cluster Distribution</h4>
                        <div className="space-y-2">
                          {Object.entries(workload.clusterWeights).map(([clusterId, weight]) => (
                            <div key={clusterId} className="flex items-center">
                              <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2 mr-2">
                                <div 
                                  className="h-2 rounded-full bg-green-500"
                                  style={{ width: `${weight}%` }}
                                ></div>
                              </div>
                              <span className="text-xs text-gray-600 dark:text-gray-400 min-w-[40px] text-right">
                                {weight}%
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-3 text-xs">
                        <div>
                          <span className="text-gray-600 dark:text-gray-400">Requests:</span>
                          <span className="ml-1 font-medium text-gray-900 dark:text-white">
                            {workload.metrics.totalRequests.toLocaleString()}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600 dark:text-gray-400">Errors:</span>
                          <span className={`ml-1 font-medium ${
                            workload.metrics.errorRate > 1 ? 'text-red-600 dark:text-red-400' :
                            workload.metrics.errorRate > 0.5 ? 'text-amber-600 dark:text-amber-400' :
                            'text-green-600 dark:text-green-400'
                          }`}>
                            {workload.metrics.errorRate}%
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600 dark:text-gray-400">Latency:</span>
                          <span className={`ml-1 font-medium ${
                            workload.metrics.averageLatency > 100 ? 'text-red-600 dark:text-red-400' :
                            workload.metrics.averageLatency > 50 ? 'text-amber-600 dark:text-amber-400' :
                            'text-green-600 dark:text-green-400'
                          }`}>
                            {workload.metrics.averageLatency}ms
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Right Panel - Details or Optimization Suggestions */}
          <div>
            {selectedCluster ? (
              <div>
                <h3 className="text-md font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                  <Server size={18} className="mr-2 text-blue-600 dark:text-blue-400" />
                  Cluster Details: {selectedCluster.name}
                </h3>
                
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-4 border border-blue-200 dark:border-blue-800">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-blue-600 dark:text-blue-400">Type:</span>
                      <span className="ml-1 font-medium text-blue-700 dark:text-blue-300 capitalize">
                        {selectedCluster.type}
                      </span>
                    </div>
                    <div>
                      <span className="text-blue-600 dark:text-blue-400">Provider:</span>
                      <span className="ml-1 font-medium text-blue-700 dark:text-blue-300">
                        {selectedCluster.provider}
                      </span>
                    </div>
                    <div>
                      <span className="text-blue-600 dark:text-blue-400">Region:</span>
                      <span className="ml-1 font-medium text-blue-700 dark:text-blue-300">
                        {selectedCluster.region}
                      </span>
                    </div>
                    <div>
                      <span className="text-blue-600 dark:text-blue-400">Version:</span>
                      <span className="ml-1 font-medium text-blue-700 dark:text-blue-300">
                        {selectedCluster.version}
                      </span>
                    </div>
                    <div>
                      <span className="text-blue-600 dark:text-blue-400">Status:</span>
                      <span className={`ml-1 font-medium ${getStatusColor(selectedCluster.status)} px-2 py-0.5 rounded-full text-xs`}>
                        {selectedCluster.status}
                      </span>
                    </div>
                    <div>
                      <span className="text-blue-600 dark:text-blue-400">Nodes:</span>
                      <span className="ml-1 font-medium text-blue-700 dark:text-blue-300">
                        {selectedCluster.nodeCount}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 mb-4">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Capacity & Utilization</h4>
                  <div className="grid grid-cols-3 gap-4 text-sm mb-3">
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">CPU:</span>
                      <span className="ml-1 font-medium text-gray-900 dark:text-white">
                        {selectedCluster.capacity.cpu} cores
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Memory:</span>
                      <span className="ml-1 font-medium text-gray-900 dark:text-white">
                        {selectedCluster.capacity.memory} GB
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Storage:</span>
                      <span className="ml-1 font-medium text-gray-900 dark:text-white">
                        {selectedCluster.capacity.storage} GB
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
                        <span>CPU: {selectedCluster.utilization.cpu}%</span>
                        <span>{selectedCluster.utilization.cpu > 80 ? 'High' : selectedCluster.utilization.cpu > 60 ? 'Medium' : 'Low'}</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            selectedCluster.utilization.cpu > 80 ? 'bg-red-500' : 
                            selectedCluster.utilization.cpu > 60 ? 'bg-amber-500' : 
                            'bg-green-500'
                          }`}
                          style={{ width: `${selectedCluster.utilization.cpu}%` }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
                        <span>Memory: {selectedCluster.utilization.memory}%</span>
                        <span>{selectedCluster.utilization.memory > 80 ? 'High' : selectedCluster.utilization.memory > 60 ? 'Medium' : 'Low'}</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            selectedCluster.utilization.memory > 80 ? 'bg-red-500' : 
                            selectedCluster.utilization.memory > 60 ? 'bg-amber-500' : 
                            'bg-green-500'
                          }`}
                          style={{ width: `${selectedCluster.utilization.memory}%` }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
                        <span>Storage: {selectedCluster.utilization.storage}%</span>
                        <span>{selectedCluster.utilization.storage > 80 ? 'High' : selectedCluster.utilization.storage > 60 ? 'Medium' : 'Low'}</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            selectedCluster.utilization.storage > 80 ? 'bg-red-500' : 
                            selectedCluster.utilization.storage > 60 ? 'bg-amber-500' : 
                            'bg-green-500'
                          }`}
                          style={{ width: `${selectedCluster.utilization.storage}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Networking & Features</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Pod CIDR:</span>
                      <span className="ml-1 font-medium text-gray-900 dark:text-white">
                        {selectedCluster.networking.podCidr}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Service CIDR:</span>
                      <span className="ml-1 font-medium text-gray-900 dark:text-white">
                        {selectedCluster.networking.serviceCidr}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Ingress:</span>
                      <span className="ml-1 font-medium text-gray-900 dark:text-white">
                        {selectedCluster.networking.ingressController}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Network Plugin:</span>
                      <span className="ml-1 font-medium text-gray-900 dark:text-white">
                        {selectedCluster.networking.networkPlugin}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${selectedCluster.features.rbacEnabled ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'}`}>
                      RBAC: {selectedCluster.features.rbacEnabled ? 'Enabled' : 'Disabled'}
                    </span>
                    <span className={`px-2 py-1 text-xs rounded-full ${selectedCluster.features.autoscalingEnabled ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'}`}>
                      Autoscaling: {selectedCluster.features.autoscalingEnabled ? 'Enabled' : 'Disabled'}
                    </span>
                    <span className={`px-2 py-1 text-xs rounded-full ${selectedCluster.features.monitoringEnabled ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'}`}>
                      Monitoring: {selectedCluster.features.monitoringEnabled ? 'Enabled' : 'Disabled'}
                    </span>
                    <span className={`px-2 py-1 text-xs rounded-full ${selectedCluster.features.loggingEnabled ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'}`}>
                      Logging: {selectedCluster.features.loggingEnabled ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                </div>
              </div>
            ) : selectedConnection ? (
              <div>
                <h3 className="text-md font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                  <Network size={18} className="mr-2 text-purple-600 dark:text-purple-400" />
                  Connection Details: {selectedConnection.name}
                </h3>
                
                <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 mb-4 border border-purple-200 dark:border-purple-800">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-purple-600 dark:text-purple-400">Status:</span>
                      <span className={`ml-1 font-medium ${getConnectionStatusColor(selectedConnection.status)} px-2 py-0.5 rounded-full text-xs`}>
                        {selectedConnection.status}
                      </span>
                    </div>
                    <div>
                      <span className="text-purple-600 dark:text-purple-400">Type:</span>
                      <span className="ml-1 font-medium text-purple-700 dark:text-purple-300">
                        {selectedConnection.connectionType}
                      </span>
                    </div>
                    <div>
                      <span className="text-purple-600 dark:text-purple-400">Source:</span>
                      <span className="ml-1 font-medium text-purple-700 dark:text-purple-300">
                        {clusters.find(c => c.clusterId === selectedConnection.sourceClusterId)?.name || selectedConnection.sourceClusterId}
                      </span>
                    </div>
                    <div>
                      <span className="text-purple-600 dark:text-purple-400">Target:</span>
                      <span className="ml-1 font-medium text-purple-700 dark:text-purple-300">
                        {clusters.find(c => c.clusterId === selectedConnection.targetClusterId)?.name || selectedConnection.targetClusterId}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 mb-4">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Connection Metrics</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Latency:</span>
                      <span className={`ml-1 font-medium ${
                        selectedConnection.latency > 50 ? 'text-red-600 dark:text-red-400' :
                        selectedConnection.latency > 30 ? 'text-amber-600 dark:text-amber-400' :
                        'text-green-600 dark:text-green-400'
                      }`}>
                        {selectedConnection.latency}ms
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Bandwidth:</span>
                      <span className="ml-1 font-medium text-gray-900 dark:text-white">
                        {selectedConnection.bandwidth}Mbps
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Encryption:</span>
                      <span className={`ml-1 font-medium ${
                        selectedConnection.encryptionEnabled ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                      }`}>
                        {selectedConnection.encryptionEnabled ? 'Enabled' : 'Disabled'}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Last Checked:</span>
                      <span className="ml-1 font-medium text-gray-900 dark:text-white">
                        {new Date(selectedConnection.lastChecked).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
                        <span>Packet Loss: {selectedConnection.metrics.packetLoss}%</span>
                        <span>{selectedConnection.metrics.packetLoss > 1 ? 'High' : selectedConnection.metrics.packetLoss > 0.5 ? 'Medium' : 'Low'}</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            selectedConnection.metrics.packetLoss > 1 ? 'bg-red-500' : 
                            selectedConnection.metrics.packetLoss > 0.5 ? 'bg-amber-500' : 
                            'bg-green-500'
                          }`}
                          style={{ width: `${Math.min(selectedConnection.metrics.packetLoss * 20, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
                        <span>Error Rate: {selectedConnection.metrics.errorRate}%</span>
                        <span>{selectedConnection.metrics.errorRate > 1 ? 'High' : selectedConnection.metrics.errorRate > 0.5 ? 'Medium' : 'Low'}</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            selectedConnection.metrics.errorRate > 1 ? 'bg-red-500' : 
                            selectedConnection.metrics.errorRate > 0.5 ? 'bg-amber-500' : 
                            'bg-green-500'
                          }`}
                          style={{ width: `${Math.min(selectedConnection.metrics.errorRate * 20, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
                        <span>Throughput: {selectedConnection.metrics.throughput}Mbps</span>
                        <span>{selectedConnection.metrics.throughput > selectedConnection.bandwidth * 0.8 ? 'High' : selectedConnection.metrics.throughput > selectedConnection.bandwidth * 0.5 ? 'Medium' : 'Low'}</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            selectedConnection.metrics.throughput > selectedConnection.bandwidth * 0.8 ? 'bg-amber-500' : 
                            'bg-green-500'
                          }`}
                          style={{ width: `${(selectedConnection.metrics.throughput / selectedConnection.bandwidth) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                {selectedConnection.trafficShaping && (
                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Traffic Shaping</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      {selectedConnection.trafficShaping.rateLimit && (
                        <div>
                          <span className="text-gray-600 dark:text-gray-400">Rate Limit:</span>
                          <span className="ml-1 font-medium text-gray-900 dark:text-white">
                            {selectedConnection.trafficShaping.rateLimit}Mbps
                          </span>
                        </div>
                      )}
                      {selectedConnection.trafficShaping.qualityOfService && (
                        <div>
                          <span className="text-gray-600 dark:text-gray-400">QoS:</span>
                          <span className="ml-1 font-medium text-gray-900 dark:text-white capitalize">
                            {selectedConnection.trafficShaping.qualityOfService}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <h3 className="text-md font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                  <BarChart3 size={18} className="mr-2 text-green-600 dark:text-green-400" />
                  Workload Optimization Suggestions
                </h3>
                
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {optimizationSuggestions.map((suggestion, index) => (
                    <div key={index} className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-green-800 dark:text-green-300">{suggestion.workloadName}</span>
                        <div className="flex items-center">
                          <span className={`text-sm font-medium ${getConfidenceColor(suggestion.confidence)}`}>
                            {suggestion.confidence}%
                          </span>
                        </div>
                      </div>
                      
                      <div className="mb-3">
                        <div className="flex items-center text-sm text-green-700 dark:text-green-300 mb-1">
                          <span className="font-medium">Current Strategy:</span>
                          <span className="ml-1">{suggestion.currentStrategy.replace('-', ' ')}</span>
                        </div>
                        <div className="flex items-center text-sm text-green-700 dark:text-green-300">
                          <span className="font-medium">Suggested Strategy:</span>
                          <span className="ml-1">{suggestion.suggestedStrategy.replace('-', ' ')}</span>
                        </div>
                      </div>
                      
                      <p className="text-sm text-green-700 dark:text-green-300 mb-2">{suggestion.reasoning}</p>
                      
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-green-600 dark:text-green-400 font-medium">
                          Potential Benefit: {suggestion.potentialBenefit}
                        </span>
                        <button className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 transition-colors">
                          Apply Suggestion
                        </button>
                      </div>
                    </div>
                  ))}
                  
                  {optimizationSuggestions.length === 0 && (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                        <CheckCircle size={24} className="text-green-500" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Optimally Distributed</h3>
                      <p className="text-gray-500 dark:text-gray-400">Your workloads are currently optimally distributed across clusters</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Environment Breakdown */}
        {hybridReport && (
          <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-md font-medium text-gray-900 dark:text-white mb-4">Environment Breakdown</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Cluster Types</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Cloud</span>
                    <span className="text-sm font-medium text-blue-600 dark:text-blue-400">{hybridReport.summary.cloudClusters}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">On-Premises</span>
                    <span className="text-sm font-medium text-purple-600 dark:text-purple-400">{hybridReport.summary.onPremClusters}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Edge</span>
                    <span className="text-sm font-medium text-green-600 dark:text-green-400">{hybridReport.summary.edgeClusters}</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Resource Utilization</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">CPU</span>
                    <span className={`text-sm font-medium ${getUtilizationColor(hybridReport.performance.averageUtilization.cpu)}`}>
                      {hybridReport.performance.averageUtilization.cpu}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Memory</span>
                    <span className={`text-sm font-medium ${getUtilizationColor(hybridReport.performance.averageUtilization.memory)}`}>
                      {hybridReport.performance.averageUtilization.memory}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Storage</span>
                    <span className={`text-sm font-medium ${getUtilizationColor(hybridReport.performance.averageUtilization.storage)}`}>
                      {hybridReport.performance.averageUtilization.storage}%
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Network Performance</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Avg Latency</span>
                    <span className={`text-sm font-medium ${
                      hybridReport.performance.averageLatency > 50 ? 'text-red-600 dark:text-red-400' :
                      hybridReport.performance.averageLatency > 30 ? 'text-amber-600 dark:text-amber-400' :
                      'text-green-600 dark:text-green-400'
                    }`}>
                      {hybridReport.performance.averageLatency}ms
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Cross-Cluster Traffic</span>
                    <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                      {hybridReport.performance.crossClusterTraffic}Mbps
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Healthy Connections</span>
                    <span className="text-sm font-medium text-green-600 dark:text-green-400">
                      {hybridReport.summary.healthyConnections}/{hybridReport.summary.totalConnections}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* AI Recommendations */}
        {hybridReport?.recommendations.length > 0 && (
          <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center">
              <AlertTriangle size={16} className="mr-1 text-amber-500" />
              AI Recommendations
            </h4>
            <div className="space-y-2">
              {hybridReport.recommendations.map((rec: string, index: number) => (
                <div key={index} className="flex items-start p-2 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                  <CheckCircle size={14} className="text-amber-600 dark:text-amber-400 mt-0.5 mr-2 flex-shrink-0" />
                  <span className="text-sm text-amber-800 dark:text-amber-300">{rec}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HybridKubernetesManagerComponent;