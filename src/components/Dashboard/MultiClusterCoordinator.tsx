import React, { useState, useEffect } from 'react';
import { Globe, Zap, Activity, CheckCircle, AlertTriangle, XCircle, Clock, Target, BarChart3, Network, Server, MapPin } from 'lucide-react';
import { MultiClusterAICoordinator, ClusterHealth } from '../../api/multi-cluster-ai-coordinator';

const MultiClusterCoordinator: React.FC = () => {
  const [clusterStatus, setClusterStatus] = useState<any>(null);
  const [selectedClusters, setSelectedClusters] = useState<string[]>([]);
  const [remediationInProgress, setRemediationInProgress] = useState(false);
  const [executionPlan, setExecutionPlan] = useState<any>(null);
  const [analytics, setAnalytics] = useState<any>(null);
  const [syncPolicy, setSyncPolicy] = useState<'sequential' | 'parallel' | 'canary' | 'blue-green'>('parallel');

  useEffect(() => {
    const coordinator = MultiClusterAICoordinator.getInstance();
    
    const loadData = async () => {
      try {
        const status = await coordinator.getMultiClusterStatus();
        setClusterStatus(status);
        
        const analyticsData = coordinator.getRemediationAnalytics();
        setAnalytics(analyticsData);
      } catch (error) {
        console.error('Failed to load cluster data:', error);
      }
    };

    loadData();
    
    // Update every 30 seconds
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, []);

  const executeMultiClusterRemediation = async () => {
    if (selectedClusters.length === 0) return;
    
    setRemediationInProgress(true);
    const coordinator = MultiClusterAICoordinator.getInstance();
    
    try {
      const plan = await coordinator.coordinateMultiClusterRemediation(
        'AI-optimized resource allocation and pod restart',
        selectedClusters,
        'high',
        syncPolicy
      );
      
      setExecutionPlan(plan);
      
      // Simulate execution
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Refresh status
      const updatedStatus = await coordinator.getMultiClusterStatus();
      setClusterStatus(updatedStatus);
      
    } catch (error) {
      console.error('Multi-cluster remediation failed:', error);
    } finally {
      setRemediationInProgress(false);
    }
  };

  const selectOptimalCluster = async () => {
    const coordinator = MultiClusterAICoordinator.getInstance();
    
    try {
      const result = await coordinator.selectBestClusterForFix(
        'memory_optimization',
        { cpu: 20, memory: 30, storage: 10 },
        { environment: 'production' }
      );
      
      setSelectedClusters([result.selectedCluster.clusterId]);
      
      // Show selection reasoning
      console.log('AI Selected Cluster:', result.selectedCluster.name);
      console.log('Confidence:', result.confidence + '%');
      console.log('Reasoning:', result.reasoning);
      
    } catch (error) {
      console.error('Cluster selection failed:', error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle size={16} className="text-green-500" />;
      case 'degraded':
        return <AlertTriangle size={16} className="text-amber-500" />;
      case 'critical':
        return <XCircle size={16} className="text-red-500" />;
      default:
        return <Clock size={16} className="text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'degraded':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400';
      case 'critical':
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

  const toggleClusterSelection = (clusterId: string) => {
    setSelectedClusters(prev => 
      prev.includes(clusterId) 
        ? prev.filter(id => id !== clusterId)
        : [...prev, clusterId]
    );
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white mr-3">
              <Globe size={20} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Multi-Cluster AI Coordinator</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Intelligent cluster selection and remediation orchestration</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <select
              value={syncPolicy}
              onChange={(e) => setSyncPolicy(e.target.value as any)}
              className="px-3 py-1.5 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="parallel">Parallel Execution</option>
              <option value="sequential">Sequential Execution</option>
              <option value="canary">Canary Deployment</option>
              <option value="blue-green">Blue-Green Strategy</option>
            </select>
            <button
              onClick={selectOptimalCluster}
              className="flex items-center px-3 py-1.5 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Target size={16} className="mr-1" />
              AI Select
            </button>
            <button
              onClick={executeMultiClusterRemediation}
              disabled={selectedClusters.length === 0 || remediationInProgress}
              className="flex items-center px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {remediationInProgress ? (
                <>
                  <Clock size={16} className="mr-1 animate-spin" />
                  Executing...
                </>
              ) : (
                <>
                  <Zap size={16} className="mr-1" />
                  Execute Fix
                </>
              )}
            </button>
          </div>
        </div>

        {/* Cluster Overview */}
        {clusterStatus && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-lg p-4">
              <p className="text-sm text-blue-600 dark:text-blue-400 mb-1">Total Clusters</p>
              <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{clusterStatus.totalClusters}</p>
            </div>
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg p-4">
              <p className="text-sm text-green-600 dark:text-green-400 mb-1">Healthy</p>
              <p className="text-2xl font-bold text-green-700 dark:text-green-300">{clusterStatus.healthyClusters}</p>
            </div>
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-lg p-4">
              <p className="text-sm text-amber-600 dark:text-amber-400 mb-1">Degraded</p>
              <p className="text-2xl font-bold text-amber-700 dark:text-amber-300">{clusterStatus.degradedClusters}</p>
            </div>
            <div className="bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 rounded-lg p-4">
              <p className="text-sm text-red-600 dark:text-red-400 mb-1">Critical</p>
              <p className="text-2xl font-bold text-red-700 dark:text-red-300">{clusterStatus.criticalClusters}</p>
            </div>
            <div className="bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 rounded-lg p-4">
              <p className="text-sm text-purple-600 dark:text-purple-400 mb-1">Active Fixes</p>
              <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">{clusterStatus.activeRemediations}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Cluster List */}
          <div>
            <h3 className="text-md font-medium text-gray-900 dark:text-white mb-4 flex items-center">
              <Server size={18} className="mr-2 text-blue-600 dark:text-blue-400" />
              Cluster Status
            </h3>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {clusterStatus?.clusterDetails.map((cluster: ClusterHealth) => (
                <div 
                  key={cluster.clusterId}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    selectedClusters.includes(cluster.clusterId)
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 bg-gray-50 dark:bg-gray-700/50'
                  }`}
                  onClick={() => toggleClusterSelection(cluster.clusterId)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      {getStatusIcon(cluster.status)}
                      <span className="ml-2 font-medium text-gray-900 dark:text-white">{cluster.name}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(cluster.status)}`}>
                        {cluster.status}
                      </span>
                      <div className="flex items-center">
                        <MapPin size={12} className="text-gray-500 mr-1" />
                        <span className="text-xs text-gray-500 dark:text-gray-400">{cluster.location.region}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-3 text-sm mb-2">
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">CPU:</span>
                      <span className={`ml-1 font-medium ${getUtilizationColor(cluster.resourceUtilization.cpu)}`}>
                        {cluster.resourceUtilization.cpu}%
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Memory:</span>
                      <span className={`ml-1 font-medium ${getUtilizationColor(cluster.resourceUtilization.memory)}`}>
                        {cluster.resourceUtilization.memory}%
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Pods:</span>
                      <span className="ml-1 font-medium text-gray-900 dark:text-white">
                        {cluster.capacity.pods}/{cluster.capacity.maxPods}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500 dark:text-gray-400">
                      Remediation Capacity: {cluster.remediationCapacity}%
                    </span>
                    <span className="text-gray-500 dark:text-gray-400">
                      {cluster.capacity.nodes} nodes
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Execution Plan & Analytics */}
          <div>
            {executionPlan ? (
              <div>
                <h3 className="text-md font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                  <Network size={18} className="mr-2 text-green-600 dark:text-green-400" />
                  Execution Plan
                </h3>
                
                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 mb-4 border border-green-200 dark:border-green-800">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-medium text-green-800 dark:text-green-300">Fix ID: {executionPlan.fixId}</span>
                    <span className="text-sm text-green-600 dark:text-green-400">
                      Est. Duration: {executionPlan.totalEstimatedDuration}
                    </span>
                  </div>
                  <div className="space-y-2">
                    {executionPlan.executionPlan.map((step: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-white dark:bg-gray-800 rounded border">
                        <div className="flex items-center">
                          <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-xs font-medium flex items-center justify-center mr-2">
                            {step.order}
                          </div>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {clusterStatus?.clusterDetails.find((c: ClusterHealth) => c.clusterId === step.clusterId)?.name}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-500 dark:text-gray-400">{step.estimatedDuration}</span>
                          {step.dependencies.length > 0 && (
                            <span className="text-xs text-blue-600 dark:text-blue-400">
                              Depends on: {step.dependencies.length}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : analytics ? (
              <div>
                <h3 className="text-md font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                  <BarChart3 size={18} className="mr-2 text-purple-600 dark:text-purple-400" />
                  Remediation Analytics
                </h3>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3">
                      <p className="text-sm text-purple-600 dark:text-purple-400 mb-1">Total Remediations</p>
                      <p className="text-xl font-bold text-purple-700 dark:text-purple-300">{analytics.totalRemediations}</p>
                    </div>
                    <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3">
                      <p className="text-sm text-green-600 dark:text-green-400 mb-1">Success Rate</p>
                      <p className="text-xl font-bold text-green-700 dark:text-green-300">{analytics.successRate}%</p>
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                    <h4 className="text-sm font-medium text-blue-800 dark:text-blue-400 mb-2">Cluster Utilization</h4>
                    <div className="space-y-2">
                      {analytics.clusterUtilization.slice(0, 3).map((cluster: any, index: number) => (
                        <div key={index} className="flex items-center justify-between text-sm">
                          <span className="text-blue-700 dark:text-blue-300">{cluster.clusterId}</span>
                          <div className="flex items-center space-x-2">
                            <span className="text-blue-600 dark:text-blue-400">{cluster.remediationCount} fixes</span>
                            <span className="text-green-600 dark:text-green-400">{cluster.successRate}% success</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4 border border-amber-200 dark:border-amber-800">
                    <h4 className="text-sm font-medium text-amber-800 dark:text-amber-400 mb-2">Trend Analysis</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-amber-700 dark:text-amber-300">Daily Average:</span>
                        <span className="font-medium text-amber-800 dark:text-amber-200">{analytics.trendAnalysis.dailyRemediations} fixes</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-amber-700 dark:text-amber-300">Weekly Trend:</span>
                        <span className={`font-medium ${
                          analytics.trendAnalysis.weeklyTrend === 'improving' ? 'text-green-600 dark:text-green-400' :
                          analytics.trendAnalysis.weeklyTrend === 'stable' ? 'text-blue-600 dark:text-blue-400' :
                          'text-red-600 dark:text-red-400'
                        }`}>
                          {analytics.trendAnalysis.weeklyTrend}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                  <Globe size={24} className="text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Multi-Cluster Coordination</h3>
                <p className="text-gray-500 dark:text-gray-400">Select clusters and execute AI-coordinated remediation across your infrastructure</p>
              </div>
            )}
          </div>
        </div>

        {/* Selected Clusters Summary */}
        {selectedClusters.length > 0 && (
          <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Selected {selectedClusters.length} cluster(s) for {syncPolicy} remediation
              </div>
              <div className="text-xs text-blue-600 dark:text-blue-400">
                AI will optimize execution order and timing
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MultiClusterCoordinator;