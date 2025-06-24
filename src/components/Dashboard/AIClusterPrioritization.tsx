import React, { useState, useEffect } from 'react';
import { Brain, Target, TrendingUp, AlertTriangle, CheckCircle, Clock, Zap, BarChart3, Activity, Gauge } from 'lucide-react';
import { AIClusterPrioritizationEngine, ClusterPriorityScore, FixExecutionPlan, LiveClusterConditions } from '../../api/ai-cluster-prioritization-engine';

const AIClusterPrioritization: React.FC = () => {
  const [prioritizedClusters, setPrioritizedClusters] = useState<ClusterPriorityScore[]>([]);
  const [liveConditions, setLiveConditions] = useState<LiveClusterConditions[]>([]);
  const [executionPlan, setExecutionPlan] = useState<FixExecutionPlan | null>(null);
  const [selectedClusters, setSelectedClusters] = useState<string[]>([]);
  const [executionStrategy, setExecutionStrategy] = useState<'conservative' | 'balanced' | 'aggressive' | 'emergency'>('balanced');
  const [prioritizationReport, setPrioritizationReport] = useState<any>(null);
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);

  useEffect(() => {
    const engine = AIClusterPrioritizationEngine.getInstance();
    
    const loadData = async () => {
      try {
        const clusters = await engine.getPrioritizedClusters();
        setPrioritizedClusters(clusters);
        
        const conditions = await engine.getLiveClusterConditions();
        setLiveConditions(conditions);
        
        const report = engine.generatePrioritizationReport();
        setPrioritizationReport(report);
      } catch (error) {
        console.error('Failed to load prioritization data:', error);
      }
    };

    loadData();
    
    // Update every 15 seconds to show live changes
    const interval = setInterval(loadData, 15000);
    return () => clearInterval(interval);
  }, []);

  const generateExecutionPlan = async () => {
    if (selectedClusters.length === 0) return;
    
    setIsGeneratingPlan(true);
    const engine = AIClusterPrioritizationEngine.getInstance();
    
    try {
      const plan = await engine.generateOptimizedExecutionPlan(
        selectedClusters,
        'multi_cluster_remediation',
        executionStrategy
      );
      setExecutionPlan(plan);
    } catch (error) {
      console.error('Failed to generate execution plan:', error);
    } finally {
      setIsGeneratingPlan(false);
    }
  };

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'critical':
        return 'text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400';
      case 'high':
        return 'text-orange-600 bg-orange-100 dark:bg-orange-900/30 dark:text-orange-400';
      case 'medium':
        return 'text-amber-600 bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400';
      case 'low':
        return 'text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400';
      default:
        return 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400';
    }
  };

  const getLoadTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing':
        return <TrendingUp size={14} className="text-red-500" />;
      case 'decreasing':
        return <TrendingUp size={14} className="text-green-500 rotate-180" />;
      case 'volatile':
        return <Activity size={14} className="text-amber-500" />;
      default:
        return <Activity size={14} className="text-blue-500" />;
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'text-green-600 dark:text-green-400';
    if (confidence >= 75) return 'text-blue-600 dark:text-blue-400';
    if (confidence >= 60) return 'text-amber-600 dark:text-amber-400';
    return 'text-red-600 dark:text-red-400';
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
            <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-blue-600 text-white mr-3">
              <Brain size={20} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">AI Cluster Prioritization Engine</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Real-time adaptive cluster scoring and execution planning</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <select
              value={executionStrategy}
              onChange={(e) => setExecutionStrategy(e.target.value as any)}
              className="px-3 py-1.5 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="conservative">Conservative</option>
              <option value="balanced">Balanced</option>
              <option value="aggressive">Aggressive</option>
              <option value="emergency">Emergency</option>
            </select>
            <button
              onClick={generateExecutionPlan}
              disabled={selectedClusters.length === 0 || isGeneratingPlan}
              className="flex items-center px-3 py-1.5 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors"
            >
              {isGeneratingPlan ? (
                <>
                  <Clock size={16} className="mr-1 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Target size={16} className="mr-1" />
                  Generate Plan
                </>
              )}
            </button>
          </div>
        </div>

        {/* Summary Stats */}
        {prioritizationReport && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg p-4">
              <p className="text-sm text-purple-600 dark:text-purple-400 mb-1">Total Clusters</p>
              <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">{prioritizationReport.summary.totalClusters}</p>
            </div>
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-lg p-4">
              <p className="text-sm text-blue-600 dark:text-blue-400 mb-1">Avg Priority Score</p>
              <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{prioritizationReport.summary.averagePriorityScore}</p>
            </div>
            <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-lg p-4">
              <p className="text-sm text-red-600 dark:text-red-400 mb-1">High Risk</p>
              <p className="text-2xl font-bold text-red-700 dark:text-red-300">{prioritizationReport.summary.highRiskClusters}</p>
            </div>
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg p-4">
              <p className="text-sm text-green-600 dark:text-green-400 mb-1">Optimal Execution</p>
              <p className="text-2xl font-bold text-green-700 dark:text-green-300">{prioritizationReport.summary.optimalExecutionClusters}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Prioritized Clusters */}
          <div>
            <h3 className="text-md font-medium text-gray-900 dark:text-white mb-4 flex items-center">
              <Gauge size={18} className="mr-2 text-purple-600 dark:text-purple-400" />
              AI Priority Ranking
            </h3>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {prioritizedClusters.map((cluster) => {
                const liveCondition = liveConditions.find(c => c.clusterId === cluster.clusterId);
                
                return (
                  <div 
                    key={cluster.clusterId}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      selectedClusters.includes(cluster.clusterId)
                        ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600 bg-gray-50 dark:bg-gray-700/50'
                    }`}
                    onClick={() => toggleClusterSelection(cluster.clusterId)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <div className="w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-xs font-bold flex items-center justify-center mr-2">
                          {cluster.executionOrder}
                        </div>
                        <span className="font-medium text-gray-900 dark:text-white">{cluster.clusterId}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${getRiskColor(cluster.riskLevel)}`}>
                          {cluster.riskLevel}
                        </span>
                        <span className={`text-sm font-bold ${getConfidenceColor(cluster.priorityScore)}`}>
                          {cluster.priorityScore}
                        </span>
                      </div>
                    </div>
                    
                    {liveCondition && (
                      <div className="grid grid-cols-3 gap-2 text-xs mb-2">
                        <div className="flex items-center">
                          <span className="text-gray-600 dark:text-gray-400">Load:</span>
                          <span className={`ml-1 font-medium ${
                            liveCondition.realTimeMetrics.currentLoad > 80 ? 'text-red-600 dark:text-red-400' :
                            liveCondition.realTimeMetrics.currentLoad > 60 ? 'text-amber-600 dark:text-amber-400' :
                            'text-green-600 dark:text-green-400'
                          }`}>
                            {liveCondition.realTimeMetrics.currentLoad}%
                          </span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-gray-600 dark:text-gray-400">Response:</span>
                          <span className="ml-1 font-medium text-gray-900 dark:text-white">
                            {liveCondition.realTimeMetrics.responseTime}ms
                          </span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-gray-600 dark:text-gray-400">Errors:</span>
                          <span className={`ml-1 font-medium ${
                            liveCondition.realTimeMetrics.errorRate > 3 ? 'text-red-600 dark:text-red-400' :
                            liveCondition.realTimeMetrics.errorRate > 1 ? 'text-amber-600 dark:text-amber-400' :
                            'text-green-600 dark:text-green-400'
                          }`}>
                            {liveCondition.realTimeMetrics.errorRate}%
                          </span>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-2">
                        {getLoadTrendIcon(cluster.adaptiveFactors.loadTrend)}
                        <span className="text-gray-500 dark:text-gray-400">
                          {cluster.adaptiveFactors.loadTrend}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`font-medium ${getConfidenceColor(cluster.confidenceLevel)}`}>
                          {cluster.confidenceLevel}% confidence
                        </span>
                      </div>
                    </div>
                    
                    {cluster.reasoning.length > 0 && (
                      <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-600">
                        <p className="text-xs text-gray-600 dark:text-gray-400 italic">
                          {cluster.reasoning[cluster.reasoning.length - 1]}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Execution Plan or Live Conditions */}
          <div>
            {executionPlan ? (
              <div>
                <h3 className="text-md font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                  <Zap size={18} className="mr-2 text-green-600 dark:text-green-400" />
                  AI-Optimized Execution Plan
                </h3>
                
                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 mb-4 border border-green-200 dark:border-green-800">
                  <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                    <div>
                      <span className="text-green-600 dark:text-green-400">Strategy:</span>
                      <span className="ml-1 font-medium text-green-700 dark:text-green-300 capitalize">
                        {executionPlan.executionStrategy}
                      </span>
                    </div>
                    <div>
                      <span className="text-green-600 dark:text-green-400">Success Probability:</span>
                      <span className="ml-1 font-medium text-green-700 dark:text-green-300">
                        {executionPlan.successProbability}%
                      </span>
                    </div>
                    <div>
                      <span className="text-green-600 dark:text-green-400">Total Time:</span>
                      <span className="ml-1 font-medium text-green-700 dark:text-green-300">
                        {executionPlan.totalEstimatedTime}
                      </span>
                    </div>
                    <div>
                      <span className="text-green-600 dark:text-green-400">Phases:</span>
                      <span className="ml-1 font-medium text-green-700 dark:text-green-300">
                        {executionPlan.phases.length}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  {executionPlan.phases.map((phase, index) => (
                    <div key={index} className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-bold flex items-center justify-center mr-2">
                            {phase.phaseNumber}
                          </div>
                          <span className="font-medium text-gray-900 dark:text-white">
                            Phase {phase.phaseNumber}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {phase.estimatedDuration}
                        </span>
                      </div>
                      
                      <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        <strong>Clusters:</strong> {phase.clusters.join(', ')}
                      </div>
                      
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                        <strong>Risk Assessment:</strong> {phase.riskAssessment}
                      </div>
                      
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        <strong>Rollback Triggers:</strong> {phase.rollbackTriggers.join(', ')}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <h4 className="text-sm font-medium text-blue-800 dark:text-blue-400 mb-2">Adaptive Thresholds</h4>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <span className="text-blue-600 dark:text-blue-400">Max Failure Rate:</span>
                      <span className="ml-1 font-medium text-blue-700 dark:text-blue-300">
                        {executionPlan.adaptiveThresholds.maxFailureRate}%
                      </span>
                    </div>
                    <div>
                      <span className="text-blue-600 dark:text-blue-400">Max Response Time:</span>
                      <span className="ml-1 font-medium text-blue-700 dark:text-blue-300">
                        {executionPlan.adaptiveThresholds.maxResponseTime}ms
                      </span>
                    </div>
                    <div>
                      <span className="text-blue-600 dark:text-blue-400">Min Success Rate:</span>
                      <span className="ml-1 font-medium text-blue-700 dark:text-blue-300">
                        {executionPlan.adaptiveThresholds.minSuccessRate}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <h3 className="text-md font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                  <BarChart3 size={18} className="mr-2 text-blue-600 dark:text-blue-400" />
                  Live Cluster Conditions
                </h3>
                
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {liveConditions.map((condition) => (
                    <div key={condition.clusterId} className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-900 dark:text-white">{condition.clusterId}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(condition.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 text-xs mb-2">
                        <div>
                          <span className="text-gray-600 dark:text-gray-400">Load Forecast:</span>
                          <span className="ml-1 font-medium text-gray-900 dark:text-white">
                            {condition.predictiveIndicators.loadForecast}%
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600 dark:text-gray-400">Failure Probability:</span>
                          <span className={`ml-1 font-medium ${
                            condition.predictiveIndicators.failureProbability > 10 ? 'text-red-600 dark:text-red-400' :
                            condition.predictiveIndicators.failureProbability > 5 ? 'text-amber-600 dark:text-amber-400' :
                            'text-green-600 dark:text-green-400'
                          }`}>
                            {condition.predictiveIndicators.failureProbability}%
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600 dark:text-gray-400">Capacity Trend:</span>
                          <span className="ml-1 font-medium text-gray-900 dark:text-white capitalize">
                            {condition.predictiveIndicators.capacityTrend}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600 dark:text-gray-400">Maintenance:</span>
                          <span className={`ml-1 font-medium ${
                            condition.predictiveIndicators.maintenanceScheduled ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'
                          }`}>
                            {condition.predictiveIndicators.maintenanceScheduled ? 'Scheduled' : 'None'}
                          </span>
                        </div>
                      </div>
                      
                      {condition.aiRecommendations.length > 0 && (
                        <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-600">
                          <div className="text-xs">
                            <span className="text-gray-600 dark:text-gray-400">AI Recommendation:</span>
                            <span className="ml-1 text-blue-600 dark:text-blue-400">
                              {condition.aiRecommendations[0].action.replace(/_/g, ' ')}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* AI Recommendations */}
        {prioritizationReport?.recommendations.length > 0 && (
          <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center">
              <AlertTriangle size={16} className="mr-1 text-amber-500" />
              AI Recommendations
            </h4>
            <div className="space-y-2">
              {prioritizationReport.recommendations.map((rec: string, index: number) => (
                <div key={index} className="flex items-start p-2 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                  <CheckCircle size={14} className="text-amber-600 dark:text-amber-400 mt-0.5 mr-2 flex-shrink-0" />
                  <span className="text-sm text-amber-800 dark:text-amber-300">{rec}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Selected Clusters Summary */}
        {selectedClusters.length > 0 && (
          <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Selected {selectedClusters.length} cluster(s) for {executionStrategy} execution
              </div>
              <div className="text-xs text-purple-600 dark:text-purple-400">
                AI will optimize execution order based on real-time conditions
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIClusterPrioritization;