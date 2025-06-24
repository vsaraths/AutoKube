import React, { useState, useEffect } from 'react';
import { Globe, Zap, Activity, CheckCircle, AlertTriangle, XCircle, Clock, Target, BarChart3, Cloud, Server } from 'lucide-react';
import { CrossCloudAIFailover, CloudProvider, FailoverConfig, FailoverEvent } from '../../api/cross-cloud-ai-failover';

const CrossCloudFailover: React.FC = () => {
  const [cloudProviders, setCloudProviders] = useState<CloudProvider[]>([]);
  const [failoverConfig, setFailoverConfig] = useState<FailoverConfig | null>(null);
  const [failoverHistory, setFailoverHistory] = useState<FailoverEvent[]>([]);
  const [selectedProvider, setSelectedProvider] = useState<CloudProvider | null>(null);
  const [isTestingFailover, setIsTestingFailover] = useState(false);
  const [failoverReport, setFailoverReport] = useState<any>(null);

  useEffect(() => {
    const failoverEngine = CrossCloudAIFailover.getInstance();
    
    const loadData = async () => {
      try {
        const providers = await failoverEngine.getCloudProviders();
        setCloudProviders(providers);
        
        const config = await failoverEngine.getFailoverConfig();
        setFailoverConfig(config);
        
        const history = await failoverEngine.getFailoverHistory();
        setFailoverHistory(history);
        
        const report = failoverEngine.generateFailoverReport();
        setFailoverReport(report);
      } catch (error) {
        console.error('Failed to load failover data:', error);
      }
    };

    loadData();
    
    // Update every 30 seconds
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, []);

  const runFailoverTest = async (targetProviderId: string) => {
    setIsTestingFailover(true);
    const failoverEngine = CrossCloudAIFailover.getInstance();
    
    try {
      await failoverEngine.runFailoverTest(targetProviderId);
      
      // Refresh data
      const providers = await failoverEngine.getCloudProviders();
      setCloudProviders(providers);
      
      const history = await failoverEngine.getFailoverHistory();
      setFailoverHistory(history);
      
      const report = failoverEngine.generateFailoverReport();
      setFailoverReport(report);
    } catch (error) {
      console.error('Failover test failed:', error);
    } finally {
      setIsTestingFailover(false);
    }
  };

  const initiateManualFailover = async (targetProviderId: string) => {
    if (!window.confirm('Are you sure you want to initiate a manual failover? This will affect production workloads.')) {
      return;
    }
    
    setIsTestingFailover(true);
    const failoverEngine = CrossCloudAIFailover.getInstance();
    
    try {
      await failoverEngine.initiateManualFailover(targetProviderId);
      
      // Refresh data
      const providers = await failoverEngine.getCloudProviders();
      setCloudProviders(providers);
      
      const config = await failoverEngine.getFailoverConfig();
      setFailoverConfig(config);
      
      const history = await failoverEngine.getFailoverHistory();
      setFailoverHistory(history);
      
      const report = failoverEngine.generateFailoverReport();
      setFailoverReport(report);
    } catch (error) {
      console.error('Manual failover failed:', error);
    } finally {
      setIsTestingFailover(false);
    }
  };

  const updateFailoverConfig = async (updates: Partial<FailoverConfig>) => {
    const failoverEngine = CrossCloudAIFailover.getInstance();
    
    try {
      const updatedConfig = await failoverEngine.updateFailoverConfig(updates);
      setFailoverConfig(updatedConfig);
    } catch (error) {
      console.error('Failed to update failover config:', error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle size={16} className="text-green-500" />;
      case 'standby':
        return <Clock size={16} className="text-blue-500" />;
      case 'failing':
        return <AlertTriangle size={16} className="text-amber-500" />;
      case 'failed':
        return <XCircle size={16} className="text-red-500" />;
      case 'maintenance':
        return <Activity size={16} className="text-purple-500" />;
      default:
        return <Clock size={16} className="text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'standby':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'failing':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400';
      case 'failed':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      case 'maintenance':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400';
    }
  };

  const getHealthScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 dark:text-green-400';
    if (score >= 80) return 'text-blue-600 dark:text-blue-400';
    if (score >= 70) return 'text-amber-600 dark:text-amber-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getUtilizationColor = (utilization: number) => {
    if (utilization > 80) return 'text-red-600 dark:text-red-400';
    if (utilization > 60) return 'text-amber-600 dark:text-amber-400';
    return 'text-green-600 dark:text-green-400';
  };

  const getProviderIcon = (provider: string) => {
    if (provider.includes('aws')) return '☁️';
    if (provider.includes('gcp')) return '🌐';
    if (provider.includes('azure')) return '⚡';
    if (provider.includes('onprem')) return '🏢';
    return '☁️';
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'automatic':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      case 'manual':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'test':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'recovery':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white mr-3">
              <Cloud size={20} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Cross-Cloud AI Failover</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Intelligent multi-cloud failover and disaster recovery</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            {failoverConfig && (
              <div className={`flex items-center px-3 py-1.5 text-sm rounded-lg ${
                failoverConfig.enabled 
                  ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                  : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
              }`}>
                <Activity size={16} className="mr-1" />
                Failover {failoverConfig.enabled ? 'Enabled' : 'Disabled'}
              </div>
            )}
            <select
              value={failoverConfig?.mode || 'automatic'}
              onChange={(e) => updateFailoverConfig({ mode: e.target.value as any })}
              className="px-3 py-1.5 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="automatic">Automatic Failover</option>
              <option value="semi-automatic">Semi-Automatic</option>
              <option value="manual">Manual Failover</option>
            </select>
          </div>
        </div>

        {/* Failover Summary */}
        {failoverReport && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-lg p-4">
              <p className="text-sm text-blue-600 dark:text-blue-400 mb-1">Total Failovers</p>
              <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{failoverReport.summary.totalFailovers}</p>
            </div>
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg p-4">
              <p className="text-sm text-green-600 dark:text-green-400 mb-1">Success Rate</p>
              <p className="text-2xl font-bold text-green-700 dark:text-green-300">{failoverReport.summary.successRate}%</p>
            </div>
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-lg p-4">
              <p className="text-sm text-amber-600 dark:text-amber-400 mb-1">Avg Duration</p>
              <p className="text-2xl font-bold text-amber-700 dark:text-amber-300">{failoverReport.summary.averageDuration}s</p>
            </div>
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg p-4">
              <p className="text-sm text-purple-600 dark:text-purple-400 mb-1">Auto Failovers</p>
              <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">{failoverReport.summary.automaticFailovers}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Cloud Providers */}
          <div>
            <h3 className="text-md font-medium text-gray-900 dark:text-white mb-4 flex items-center">
              <Server size={18} className="mr-2 text-blue-600 dark:text-blue-400" />
              Cloud Providers
            </h3>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {cloudProviders.map((provider) => (
                <div 
                  key={provider.providerId}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    selectedProvider?.providerId === provider.providerId 
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                      : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 bg-gray-50 dark:bg-gray-700/50'
                  }`}
                  onClick={() => setSelectedProvider(provider)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-600 flex items-center justify-center mr-3 text-lg">
                        {getProviderIcon(provider.providerId)}
                      </div>
                      <span className="font-medium text-gray-900 dark:text-white">{provider.name}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(provider.status)}`}>
                        {provider.status}
                      </span>
                      <span className={`text-sm font-medium ${getHealthScoreColor(provider.healthScore)}`}>
                        {provider.healthScore}%
                      </span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-3 text-sm mb-2">
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">CPU:</span>
                      <span className={`ml-1 font-medium ${getUtilizationColor(provider.resourceUtilization.cpu)}`}>
                        {provider.resourceUtilization.cpu}%
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Memory:</span>
                      <span className={`ml-1 font-medium ${getUtilizationColor(provider.resourceUtilization.memory)}`}>
                        {provider.resourceUtilization.memory}%
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Latency:</span>
                      <span className="ml-1 font-medium text-gray-900 dark:text-white">
                        {provider.latency}ms
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500 dark:text-gray-400">
                      Region: {provider.region}
                    </span>
                    <span className="text-gray-500 dark:text-gray-400">
                      ${provider.costPerHour.toFixed(2)}/hour
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Provider Details or Failover History */}
          <div>
            {selectedProvider ? (
              <div>
                <h3 className="text-md font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                  <Target size={18} className="mr-2 text-blue-600 dark:text-blue-400" />
                  Provider Details: {selectedProvider.name}
                </h3>
                
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-4 border border-blue-200 dark:border-blue-800">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-blue-600 dark:text-blue-400">Status:</span>
                      <span className={`ml-1 font-medium ${getStatusColor(selectedProvider.status)} px-2 py-0.5 rounded-full text-xs`}>
                        {selectedProvider.status}
                      </span>
                    </div>
                    <div>
                      <span className="text-blue-600 dark:text-blue-400">Health Score:</span>
                      <span className={`ml-1 font-medium ${getHealthScoreColor(selectedProvider.healthScore)}`}>
                        {selectedProvider.healthScore}%
                      </span>
                    </div>
                    <div>
                      <span className="text-blue-600 dark:text-blue-400">Region:</span>
                      <span className="ml-1 font-medium text-blue-700 dark:text-blue-300">
                        {selectedProvider.region}
                      </span>
                    </div>
                    <div>
                      <span className="text-blue-600 dark:text-blue-400">Cost:</span>
                      <span className="ml-1 font-medium text-blue-700 dark:text-blue-300">
                        ${selectedProvider.costPerHour.toFixed(2)}/hour
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 mb-4">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Resource Utilization</h4>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
                        <span>CPU: {selectedProvider.resourceUtilization.cpu}%</span>
                        <span>{selectedProvider.resourceUtilization.cpu > 80 ? 'High' : selectedProvider.resourceUtilization.cpu > 60 ? 'Medium' : 'Low'}</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            selectedProvider.resourceUtilization.cpu > 80 ? 'bg-red-500' : 
                            selectedProvider.resourceUtilization.cpu > 60 ? 'bg-amber-500' : 
                            'bg-green-500'
                          }`}
                          style={{ width: `${selectedProvider.resourceUtilization.cpu}%` }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
                        <span>Memory: {selectedProvider.resourceUtilization.memory}%</span>
                        <span>{selectedProvider.resourceUtilization.memory > 80 ? 'High' : selectedProvider.resourceUtilization.memory > 60 ? 'Medium' : 'Low'}</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            selectedProvider.resourceUtilization.memory > 80 ? 'bg-red-500' : 
                            selectedProvider.resourceUtilization.memory > 60 ? 'bg-amber-500' : 
                            'bg-green-500'
                          }`}
                          style={{ width: `${selectedProvider.resourceUtilization.memory}%` }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
                        <span>Storage: {selectedProvider.resourceUtilization.storage}%</span>
                        <span>{selectedProvider.resourceUtilization.storage > 80 ? 'High' : selectedProvider.resourceUtilization.storage > 60 ? 'Medium' : 'Low'}</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            selectedProvider.resourceUtilization.storage > 80 ? 'bg-red-500' : 
                            selectedProvider.resourceUtilization.storage > 60 ? 'bg-amber-500' : 
                            'bg-green-500'
                          }`}
                          style={{ width: `${selectedProvider.resourceUtilization.storage}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => runFailoverTest(selectedProvider.providerId)}
                    disabled={isTestingFailover || selectedProvider.status === 'active' || selectedProvider.status === 'failing' || selectedProvider.status === 'failed'}
                    className="flex-1 flex items-center justify-center px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                  >
                    <Activity size={16} className="mr-1" />
                    Test Failover
                  </button>
                  <button
                    onClick={() => initiateManualFailover(selectedProvider.providerId)}
                    disabled={isTestingFailover || selectedProvider.status === 'active' || selectedProvider.status === 'failing' || selectedProvider.status === 'failed'}
                    className="flex-1 flex items-center justify-center px-3 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
                  >
                    <Zap size={16} className="mr-1" />
                    Manual Failover
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <h3 className="text-md font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                  <BarChart3 size={18} className="mr-2 text-blue-600 dark:text-blue-400" />
                  Failover History
                </h3>
                
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {failoverHistory.map((event) => (
                    <div key={event.eventId} className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <Zap size={16} className="text-blue-500 mr-2" />
                          <span className="font-medium text-gray-900 dark:text-white text-sm">
                            {event.sourceProvider} → {event.targetProvider}
                          </span>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${getEventTypeColor(event.type)}`}>
                          {event.type}
                        </span>
                      </div>
                      
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{event.reason}</p>
                      
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div>
                          <span className="text-gray-600 dark:text-gray-400">Before:</span>
                          <span className={`ml-1 font-medium ${getHealthScoreColor(event.healthScoreBefore)}`}>
                            {event.healthScoreBefore}%
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600 dark:text-gray-400">After:</span>
                          <span className={`ml-1 font-medium ${getHealthScoreColor(event.healthScoreAfter)}`}>
                            {event.healthScoreAfter}%
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600 dark:text-gray-400">Duration:</span>
                          <span className="ml-1 font-medium text-gray-900 dark:text-white">
                            {event.duration}s
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {failoverHistory.length === 0 && (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                        <Activity size={24} className="text-gray-400" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Failover Events</h3>
                      <p className="text-gray-500 dark:text-gray-400">No failover events have occurred yet</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Failover Configuration */}
        {failoverConfig && (
          <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-md font-medium text-gray-900 dark:text-white mb-4">Failover Configuration</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Settings</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Failover Mode:</span>
                    <select
                      value={failoverConfig.mode}
                      onChange={(e) => updateFailoverConfig({ mode: e.target.value as any })}
                      className="px-2 py-1 text-xs border border-gray-200 dark:border-gray-700 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    >
                      <option value="automatic">Automatic</option>
                      <option value="semi-automatic">Semi-Automatic</option>
                      <option value="manual">Manual</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Health Threshold:</span>
                    <div className="flex items-center">
                      <input
                        type="range"
                        min="50"
                        max="90"
                        value={failoverConfig.healthThreshold}
                        onChange={(e) => updateFailoverConfig({ healthThreshold: parseInt(e.target.value) })}
                        className="w-24 mr-2"
                      />
                      <span className="text-xs font-medium text-gray-900 dark:text-white">{failoverConfig.healthThreshold}%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Check Interval:</span>
                    <select
                      value={failoverConfig.checkInterval}
                      onChange={(e) => updateFailoverConfig({ checkInterval: parseInt(e.target.value) })}
                      className="px-2 py-1 text-xs border border-gray-200 dark:border-gray-700 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    >
                      <option value="10">10 seconds</option>
                      <option value="30">30 seconds</option>
                      <option value="60">1 minute</option>
                      <option value="300">5 minutes</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Grace Period:</span>
                    <select
                      value={failoverConfig.gracePeriod}
                      onChange={(e) => updateFailoverConfig({ gracePeriod: parseInt(e.target.value) })}
                      className="px-2 py-1 text-xs border border-gray-200 dark:border-gray-700 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    >
                      <option value="30">30 seconds</option>
                      <option value="60">1 minute</option>
                      <option value="120">2 minutes</option>
                      <option value="300">5 minutes</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Auto Recovery:</span>
                    <div className="relative inline-block w-10 mr-2 align-middle select-none">
                      <input
                        type="checkbox"
                        id="auto-recovery"
                        checked={failoverConfig.autoRecovery}
                        onChange={(e) => updateFailoverConfig({ autoRecovery: e.target.checked })}
                        className="sr-only"
                      />
                      <label
                        htmlFor="auto-recovery"
                        className={`block overflow-hidden h-6 rounded-full cursor-pointer transition-colors ${
                          failoverConfig.autoRecovery ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
                        }`}
                      >
                        <span
                          className={`block h-6 w-6 rounded-full bg-white shadow transform transition-transform ${
                            failoverConfig.autoRecovery ? 'translate-x-4' : 'translate-x-0'
                          }`}
                        ></span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Primary & Failover Providers</h4>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">Primary Provider:</span>
                    <div className="mt-1 p-2 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800">
                      <div className="flex items-center">
                        <div className="w-6 h-6 rounded-lg bg-gray-100 dark:bg-gray-600 flex items-center justify-center mr-2 text-sm">
                          {getProviderIcon(failoverConfig.primaryProvider)}
                        </div>
                        <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                          {cloudProviders.find(p => p.providerId === failoverConfig.primaryProvider)?.name || failoverConfig.primaryProvider}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">Failover Providers:</span>
                    <div className="mt-1 space-y-2">
                      {failoverConfig.failoverProviders.map((providerId) => (
                        <div key={providerId} className="p-2 bg-gray-100 dark:bg-gray-600 rounded border border-gray-200 dark:border-gray-700">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className="w-6 h-6 rounded-lg bg-gray-200 dark:bg-gray-500 flex items-center justify-center mr-2 text-sm">
                                {getProviderIcon(providerId)}
                              </div>
                              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                {cloudProviders.find(p => p.providerId === providerId)?.name || providerId}
                              </span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <span className={`text-xs px-2 py-0.5 rounded-full ${
                                getStatusColor(cloudProviders.find(p => p.providerId === providerId)?.status || 'unknown')
                              }`}>
                                {cloudProviders.find(p => p.providerId === providerId)?.status || 'unknown'}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* AI Recommendations */}
        {failoverReport?.recommendations.length > 0 && (
          <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center">
              <AlertTriangle size={16} className="mr-1 text-amber-500" />
              AI Recommendations
            </h4>
            <div className="space-y-2">
              {failoverReport.recommendations.map((rec: string, index: number) => (
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

export default CrossCloudFailover;