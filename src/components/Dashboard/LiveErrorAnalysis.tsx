import React, { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle, Clock, Zap, Brain, Play, Pause } from 'lucide-react';
import { KubernetesErrorAnalyzer } from '../../api/kubernetes-error-analyzer';

const LiveErrorAnalysis: React.FC = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const [remediationPlan, setRemediationPlan] = useState<any>(null);
  const [autoRemediationEnabled, setAutoRemediationEnabled] = useState(false);

  // Real Kubernetes error logs from the user's input
  const realErrorLogs = [
    'E0609 05:23:15.123456    1 reflector.go:138] k8s.io/client-go/informers/factory.go:132: Failed to watch *v1.Pod: Get "https://10.96.0.1:443/api/v1/pods?watch=true": dial tcp 10.96.0.1:443: connect: connection refused',
    'E0609 05:23:17.678901    1 pod_workers.go:190] Error syncing pod default/nginx-deployment-5c689d8b4b-jx3wp, skipping: failed to "StartContainer" for "nginx" with CrashLoopBackOff: "back-off 5m0s restarting failed container=nginx pod=nginx-deployment-5c689d8b4b-jx3wp_default(1234abcd-5678-90ef-ghij-klmnopqrstuv)"',
    'E0609 05:23:18.987654    1 horizontal.go:101] failed to compute desired number of replicas based on CPU utilization: unable to get metrics for resource cpu: no metrics returned from resource metrics API',
    'E0609 05:23:21.234567    1 scheduler.go:597] error selecting node for pod default/backend-654dcbf56c-bw7fr: no nodes available to schedule pods',
    'E0609 05:23:22.876543    1 cni.go:182] Error adding network: failed to set up network for sandbox "efgh1234": CNI request failed with status 400: \'Failed to allocate IP address: No available IPs in network\'',
    'E0609 05:23:25.789012    1 kubelet.go:1555] Failed to pull image "myregistry.local/myapp:v1": rpc error: code = Unknown desc = Error response from daemon: manifest for myregistry.local/myapp:v1 not found',
    'E0609 05:23:26.234567    1 controller_utils.go:1031] Error syncing job: failed to create pods: exceeded quota: default-quota, requested: pods=1, used: pods=10, limited: pods=10'
  ];

  useEffect(() => {
    const analyzer = KubernetesErrorAnalyzer.getInstance();
    
    const runAnalysis = async () => {
      const results = await analyzer.batchAnalyze(realErrorLogs);
      setAnalysisResults(results);
      
      if (results.analyses.length > 0) {
        const plan = analyzer.generateRemediationPlan(results.analyses);
        setRemediationPlan(plan);
      }
    };

    runAnalysis();
  }, []);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400';
      case 'high':
        return 'text-orange-600 bg-orange-100 dark:bg-orange-900/30 dark:text-orange-400';
      case 'medium':
        return 'text-amber-600 bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400';
      default:
        return 'text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400';
    }
  };

  const getHealthScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-amber-600';
    return 'text-red-600';
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="p-2 rounded-lg bg-gradient-to-r from-red-500 to-orange-600 text-white mr-3">
              <Brain size={20} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Live Error Analysis</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">AI-powered Kubernetes troubleshooting</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setAutoRemediationEnabled(!autoRemediationEnabled)}
              className={`flex items-center px-3 py-1.5 text-sm rounded-lg transition-colors ${
                autoRemediationEnabled 
                  ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                  : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
              }`}
            >
              <Zap size={16} className="mr-1" />
              Auto-Fix {autoRemediationEnabled ? 'ON' : 'OFF'}
            </button>
            <button
              onClick={() => setIsAnalyzing(!isAnalyzing)}
              className="flex items-center px-3 py-1.5 text-sm bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
            >
              {isAnalyzing ? <Pause size={16} className="mr-1" /> : <Play size={16} className="mr-1" />}
              {isAnalyzing ? 'Pause' : 'Resume'}
            </button>
          </div>
        </div>

        {analysisResults && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Errors</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{analysisResults.totalErrors}</p>
            </div>
            <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
              <p className="text-sm text-red-600 dark:text-red-400 mb-1">Critical</p>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">{analysisResults.criticalErrors}</p>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
              <p className="text-sm text-green-600 dark:text-green-400 mb-1">Auto-Fixable</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">{analysisResults.autoRemediableErrors}</p>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
              <p className="text-sm text-blue-600 dark:text-blue-400 mb-1">Health Score</p>
              <p className={`text-2xl font-bold ${getHealthScoreColor(analysisResults.clusterHealthScore)}`}>
                {analysisResults.clusterHealthScore}%
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Error Analysis */}
          <div>
            <h3 className="text-md font-medium text-gray-900 dark:text-white mb-4">Detected Issues</h3>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {analysisResults?.analyses.map((analysis: any, index: number) => (
                <div key={index} className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 border-l-4 border-red-500">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center">
                      <AlertTriangle size={16} className="text-red-500 mr-2" />
                      <span className="font-medium text-gray-900 dark:text-white text-sm">
                        {analysis.errorType.replace(/_/g, ' ').toUpperCase()}
                      </span>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${getSeverityColor(analysis.severity)}`}>
                      {analysis.severity}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{analysis.rootCause}</p>
                  <p className="text-xs text-blue-600 dark:text-blue-400 italic mb-3">{analysis.aiDiagnosis}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                      {analysis.autoRemediationAvailable ? (
                        <CheckCircle size={12} className="text-green-500 mr-1" />
                      ) : (
                        <Clock size={12} className="text-amber-500 mr-1" />
                      )}
                      {analysis.autoRemediationAvailable ? 'Auto-fixable' : 'Manual intervention required'}
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {analysis.suggestedFixes.length} fixes available
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Remediation Plan */}
          <div>
            <h3 className="text-md font-medium text-gray-900 dark:text-white mb-4">Auto-Remediation Plan</h3>
            {remediationPlan && (
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {remediationPlan.totalSteps} steps • Est. {remediationPlan.estimatedDuration}
                  </div>
                  <button className="flex items-center px-3 py-1.5 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                    <Play size={14} className="mr-1" />
                    Execute Plan
                  </button>
                </div>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {remediationPlan.plan.map((step: any, index: number) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-medium flex items-center justify-center">
                        {step.step}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{step.description}</p>
                        {step.command && (
                          <code className="text-xs text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded mt-1 block">
                            {step.command}
                          </code>
                        )}
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-gray-500 dark:text-gray-400">Est. {step.estimatedTime}</span>
                          <button className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
                            View Details
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveErrorAnalysis;