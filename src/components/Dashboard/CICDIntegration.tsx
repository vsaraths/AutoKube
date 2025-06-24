import React, { useState, useEffect } from 'react';
import { GitBranch, Zap, CheckCircle, AlertTriangle, XCircle, Clock, Code, Play, Pause, FileText, Target, BarChart3 } from 'lucide-react';
import { AICICDIntegrationEngine, CICDPipelineConfig, PreDeploymentAnalysis, CICDFixExecution } from '../../api/ai-cicd-integration-engine';
import Editor from "@monaco-editor/react";

const CICDIntegration: React.FC = () => {
  const [pipelineConfigs, setPipelineConfigs] = useState<CICDPipelineConfig[]>([]);
  const [selectedPipeline, setSelectedPipeline] = useState<string | null>(null);
  const [analysisHistory, setAnalysisHistory] = useState<PreDeploymentAnalysis[]>([]);
  const [executionHistory, setExecutionHistory] = useState<CICDFixExecution[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [isRunningAnalysis, setIsRunningAnalysis] = useState(false);
  const [isExecutingFixes, setIsExecutingFixes] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<'githubActions' | 'jenkins' | 'argocd' | 'gitlabCI'>('githubActions');
  const [pipelineTemplates, setPipelineTemplates] = useState<any>(null);

  useEffect(() => {
    const engine = AICICDIntegrationEngine.getInstance();
    
    const loadData = async () => {
      try {
        const configs = await engine.getPipelineConfigs();
        setPipelineConfigs(configs);
        
        const analyticsData = engine.generateCICDAnalytics();
        setAnalytics(analyticsData);
        
        const templates = engine.generatePipelineTemplates();
        setPipelineTemplates(templates);
        
        if (configs.length > 0 && !selectedPipeline) {
          setSelectedPipeline(configs[0].pipelineId);
        }
      } catch (error) {
        console.error('Failed to load CI/CD data:', error);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    if (selectedPipeline) {
      loadPipelineData(selectedPipeline);
    }
  }, [selectedPipeline]);

  const loadPipelineData = async (pipelineId: string) => {
    const engine = AICICDIntegrationEngine.getInstance();
    
    try {
      const analyses = await engine.getAnalysisHistory(pipelineId);
      setAnalysisHistory(analyses);
      
      const executions = await engine.getExecutionHistory(pipelineId);
      setExecutionHistory(executions);
    } catch (error) {
      console.error('Failed to load pipeline data:', error);
    }
  };

  const runPreDeploymentAnalysis = async () => {
    if (!selectedPipeline) return;
    
    setIsRunningAnalysis(true);
    const engine = AICICDIntegrationEngine.getInstance();
    
    try {
      const config = pipelineConfigs.find(p => p.pipelineId === selectedPipeline);
      if (!config) return;
      
      const analysis = await engine.runPreDeploymentAnalysis(
        selectedPipeline,
        config.environment,
        ['deployment.yaml', 'service.yaml', 'configmap.yaml']
      );
      
      setAnalysisHistory(prev => [analysis, ...prev]);
    } catch (error) {
      console.error('Pre-deployment analysis failed:', error);
    } finally {
      setIsRunningAnalysis(false);
    }
  };

  const executeCICDFixes = async (analysisId: string) => {
    if (!selectedPipeline) return;
    
    setIsExecutingFixes(true);
    const engine = AICICDIntegrationEngine.getInstance();
    
    try {
      const execution = await engine.executeCICDFixes(selectedPipeline, analysisId, false);
      setExecutionHistory(prev => [execution, ...prev]);
    } catch (error) {
      console.error('Fix execution failed:', error);
    } finally {
      setIsExecutingFixes(false);
    }
  };

  const getProviderIcon = (provider: string) => {
    switch (provider) {
      case 'github-actions':
        return <GitBranch size={16} className="text-gray-800 dark:text-gray-200" />;
      case 'jenkins':
        return <Code size={16} className="text-blue-600" />;
      case 'argocd':
        return <Target size={16} className="text-orange-600" />;
      case 'gitlab-ci':
        return <GitBranch size={16} className="text-orange-500" />;
      default:
        return <Code size={16} className="text-gray-600" />;
    }
  };

  const getEnvironmentColor = (environment: string) => {
    switch (environment) {
      case 'production':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      case 'staging':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400';
      case 'development':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400';
    }
  };

  const getRecommendationIcon = (recommendation: string) => {
    switch (recommendation) {
      case 'proceed':
        return <CheckCircle size={16} className="text-green-500" />;
      case 'proceed-with-caution':
        return <AlertTriangle size={16} className="text-amber-500" />;
      case 'fix-then-deploy':
        return <Zap size={16} className="text-blue-500" />;
      case 'block-deployment':
        return <XCircle size={16} className="text-red-500" />;
      default:
        return <Clock size={16} className="text-gray-500" />;
    }
  };

  const getRecommendationColor = (recommendation: string) => {
    switch (recommendation) {
      case 'proceed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'proceed-with-caution':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400';
      case 'fix-then-deploy':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'block-deployment':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle size={16} className="text-green-500" />;
      case 'failed':
        return <XCircle size={16} className="text-red-500" />;
      case 'in-progress':
        return <Clock size={16} className="text-blue-500 animate-spin" />;
      case 'awaiting-approval':
        return <AlertTriangle size={16} className="text-amber-500" />;
      default:
        return <Clock size={16} className="text-gray-500" />;
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-green-600 text-white mr-3">
              <GitBranch size={20} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">AI-Powered CI/CD Integration</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Intelligent pre-deployment checks and automated remediation</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <select
              value={selectedPipeline || ''}
              onChange={(e) => setSelectedPipeline(e.target.value)}
              className="px-3 py-1.5 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              {pipelineConfigs.map((config) => (
                <option key={config.pipelineId} value={config.pipelineId}>
                  {config.name}
                </option>
              ))}
            </select>
            <button
              onClick={runPreDeploymentAnalysis}
              disabled={!selectedPipeline || isRunningAnalysis}
              className="flex items-center px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {isRunningAnalysis ? (
                <>
                  <Clock size={16} className="mr-1 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Zap size={16} className="mr-1" />
                  Run Analysis
                </>
              )}
            </button>
          </div>
        </div>

        {/* Analytics Summary */}
        {analytics && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-lg p-4">
              <p className="text-sm text-blue-600 dark:text-blue-400 mb-1">Total Pipelines</p>
              <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{analytics.summary.totalPipelines}</p>
            </div>
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg p-4">
              <p className="text-sm text-green-600 dark:text-green-400 mb-1">Auto-Fixes Applied</p>
              <p className="text-2xl font-bold text-green-700 dark:text-green-300">{analytics.trends.autoFixesApplied}</p>
            </div>
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-lg p-4">
              <p className="text-sm text-amber-600 dark:text-amber-400 mb-1">Deployments Blocked</p>
              <p className="text-2xl font-bold text-amber-700 dark:text-amber-300">{analytics.trends.deploymentsBlocked}</p>
            </div>
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg p-4">
              <p className="text-sm text-purple-600 dark:text-purple-400 mb-1">Success Rate</p>
              <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">{analytics.summary.averageSuccessRate}%</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pipeline Configuration & Analysis History */}
          <div>
            <h3 className="text-md font-medium text-gray-900 dark:text-white mb-4 flex items-center">
              <BarChart3 size={18} className="mr-2 text-blue-600 dark:text-blue-400" />
              Analysis History
            </h3>
            
            {selectedPipeline && (
              <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    {getProviderIcon(pipelineConfigs.find(p => p.pipelineId === selectedPipeline)?.provider || '')}
                    <span className="ml-2 font-medium text-gray-900 dark:text-white">
                      {pipelineConfigs.find(p => p.pipelineId === selectedPipeline)?.name}
                    </span>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${getEnvironmentColor(pipelineConfigs.find(p => p.pipelineId === selectedPipeline)?.environment || '')}`}>
                    {pipelineConfigs.find(p => p.pipelineId === selectedPipeline)?.environment}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">AI Integration:</span>
                    <span className="ml-1 font-medium text-gray-900 dark:text-white capitalize">
                      {pipelineConfigs.find(p => p.pipelineId === selectedPipeline)?.aiIntegrationLevel}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Auto-Remediation:</span>
                    <span className={`ml-1 font-medium ${pipelineConfigs.find(p => p.pipelineId === selectedPipeline)?.autoRemediation.enabled ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                      {pipelineConfigs.find(p => p.pipelineId === selectedPipeline)?.autoRemediation.enabled ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                </div>
              </div>
            )}
            
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {analysisHistory.map((analysis) => (
                <div key={analysis.analysisId} className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      {getRecommendationIcon(analysis.deploymentRecommendation)}
                      <span className="ml-2 text-sm font-medium text-gray-900 dark:text-white">
                        Risk Score: {analysis.riskScore}%
                      </span>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${getRecommendationColor(analysis.deploymentRecommendation)}`}>
                      {analysis.deploymentRecommendation.replace('-', ' ')}
                    </span>
                  </div>
                  
                  <div className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                    {analysis.issuesDetected.length} issues detected • {analysis.aiConfidence}% AI confidence
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(analysis.timestamp).toLocaleString()}
                    </span>
                    <button
                      onClick={() => executeCICDFixes(analysis.analysisId)}
                      disabled={isExecutingFixes || analysis.deploymentRecommendation === 'block-deployment'}
                      className="px-2 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 transition-colors"
                    >
                      Apply Fixes
                    </button>
                  </div>
                </div>
              ))}
              
              {analysisHistory.length === 0 && (
                <div className="text-center py-8">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                    <BarChart3 size={20} className="text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">No analysis history yet</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">Run an analysis to see results here</p>
                </div>
              )}
            </div>
          </div>

          {/* Pipeline Templates */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-md font-medium text-gray-900 dark:text-white flex items-center">
                <FileText size={18} className="mr-2 text-green-600 dark:text-green-400" />
                Pipeline Templates
              </h3>
              <select
                value={selectedTemplate}
                onChange={(e) => setSelectedTemplate(e.target.value as any)}
                className="px-2 py-1 text-xs border border-gray-200 dark:border-gray-700 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <option value="githubActions">GitHub Actions</option>
                <option value="jenkins">Jenkins</option>
                <option value="argocd">ArgoCD</option>
                <option value="gitlabCI">GitLab CI</option>
              </select>
            </div>
            
            {pipelineTemplates && (
              <div className="h-80 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                <Editor
                  height="100%"
                  defaultLanguage={selectedTemplate === 'argocd' ? 'yaml' : selectedTemplate === 'jenkins' ? 'groovy' : 'yaml'}
                  value={pipelineTemplates[selectedTemplate]}
                  theme="vs-dark"
                  options={{
                    readOnly: true,
                    minimap: { enabled: false },
                    lineNumbers: 'on',
                    scrollBeyondLastLine: false,
                    wordWrap: 'on',
                    fontSize: 12,
                  }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Execution History */}
        {executionHistory.length > 0 && (
          <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-md font-medium text-gray-900 dark:text-white mb-4">Recent Fix Executions</h3>
            <div className="space-y-3">
              {executionHistory.slice(0, 3).map((execution) => (
                <div key={execution.executionId} className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      {getStatusIcon(execution.overallStatus)}
                      <span className="ml-2 text-sm font-medium text-gray-900 dark:text-white">
                        {execution.fixes.length} fixes • {execution.successRate}% success
                      </span>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(execution.timestamp).toLocaleString()}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Completed:</span>
                      <span className="ml-1 font-medium text-green-600 dark:text-green-400">
                        {execution.fixes.filter(f => f.status === 'completed').length}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Failed:</span>
                      <span className="ml-1 font-medium text-red-600 dark:text-red-400">
                        {execution.fixes.filter(f => f.status === 'failed').length}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Pending Approval:</span>
                      <span className="ml-1 font-medium text-amber-600 dark:text-amber-400">
                        {execution.fixes.filter(f => f.status === 'requires-approval').length}
                      </span>
                    </div>
                  </div>
                  
                  {execution.gitopsCommit && execution.gitopsCommit.committed && (
                    <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-600">
                      <div className="flex items-center text-xs">
                        <GitBranch size={12} className="text-green-500 mr-1" />
                        <span className="text-green-600 dark:text-green-400">
                          GitOps sync: {execution.gitopsCommit.filesChanged.length} files committed
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* AI Recommendations */}
        {analytics?.recommendations.length > 0 && (
          <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center">
              <AlertTriangle size={16} className="mr-1 text-amber-500" />
              AI Recommendations
            </h4>
            <div className="space-y-2">
              {analytics.recommendations.map((rec: string, index: number) => (
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

export default CICDIntegration;