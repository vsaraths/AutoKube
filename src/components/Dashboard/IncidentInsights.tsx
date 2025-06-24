import React, { useState, useEffect } from 'react';
import { Brain, TrendingUp, MessageSquare, Code, AlertTriangle, CheckCircle, Clock, Target, Lightbulb } from 'lucide-react';
import { AIIncidentInsightsEngine, IncidentInsight } from '../../api/ai-incident-insights';
import Editor from "@monaco-editor/react";

const IncidentInsights: React.FC = () => {
  const [insights, setInsights] = useState<IncidentInsight[]>([]);
  const [selectedInsight, setSelectedInsight] = useState<IncidentInsight | null>(null);
  const [debuggingSession, setDebuggingSession] = useState<any>(null);
  const [summary, setSummary] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'debugging' | 'trends'>('overview');

  useEffect(() => {
    const engine = AIIncidentInsightsEngine.getInstance();
    
    const loadInsights = async () => {
      // Generate sample insights for demonstration
      const sampleInsights = await Promise.all([
        engine.generateIncidentInsight(
          'pod_crash_loop',
          'CrashLoopBackOff: back-off 5m0s restarting failed container',
          'high',
          { namespace: 'production', podName: 'payment-service-abc123', serviceName: 'payment-service' }
        ),
        engine.generateIncidentInsight(
          'image_pull_error',
          'Failed to pull image: manifest not found',
          'medium',
          { namespace: 'staging', podName: 'auth-service-xyz789', serviceName: 'auth-service' }
        ),
        engine.generateIncidentInsight(
          'network_connectivity',
          'Service discovery failure: connection timeout',
          'high',
          { namespace: 'production', serviceName: 'api-gateway' }
        )
      ]);
      
      setInsights(sampleInsights);
      setSummary(engine.getIncidentInsightsSummary());
    };

    loadInsights();
  }, []);

  const startDebuggingSession = (insight: IncidentInsight) => {
    const engine = AIIncidentInsightsEngine.getInstance();
    const session = engine.generateInteractiveDebuggingSession(
      insight.rootCauseAnalysis.primaryCause.includes('crash') ? 'pod_crash_loop' : 'image_pull_error',
      { namespace: 'production', podName: 'example-pod', serviceName: 'example-service' }
    );
    setDebuggingSession(session);
  };

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

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high':
        return 'text-red-600 dark:text-red-400';
      case 'medium':
        return 'text-amber-600 dark:text-amber-400';
      default:
        return 'text-green-600 dark:text-green-400';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="p-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white mr-3">
              <Brain size={20} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">AI Incident Insights</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Detailed root cause analysis and debugging guidance</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                activeTab === 'overview' 
                  ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400' 
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('debugging')}
              className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                activeTab === 'debugging' 
                  ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400' 
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              Interactive Debug
            </button>
            <button
              onClick={() => setActiveTab('trends')}
              className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                activeTab === 'trends' 
                  ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400' 
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              Trends
            </button>
          </div>
        </div>

        {/* Summary Stats */}
        {summary && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-lg p-4">
              <p className="text-sm text-indigo-600 dark:text-indigo-400 mb-1">Total Incidents</p>
              <p className="text-2xl font-bold text-indigo-700 dark:text-indigo-300">{summary.totalIncidents}</p>
            </div>
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg p-4">
              <p className="text-sm text-green-600 dark:text-green-400 mb-1">Resolved</p>
              <p className="text-2xl font-bold text-green-700 dark:text-green-300">{summary.resolvedIncidents}</p>
            </div>
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-lg p-4">
              <p className="text-sm text-blue-600 dark:text-blue-400 mb-1">Avg Resolution</p>
              <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{summary.averageResolutionTime}</p>
            </div>
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg p-4">
              <p className="text-sm text-purple-600 dark:text-purple-400 mb-1">Pattern Accuracy</p>
              <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">{summary.patternDetectionAccuracy}%</p>
            </div>
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-lg p-4">
              <p className="text-sm text-amber-600 dark:text-amber-400 mb-1">AI Confidence</p>
              <p className="text-2xl font-bold text-amber-700 dark:text-amber-300">91%</p>
            </div>
          </div>
        )}

        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Incident List */}
            <div>
              <h3 className="text-md font-medium text-gray-900 dark:text-white mb-4">Recent Incidents</h3>
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {insights.map((insight) => (
                  <div 
                    key={insight.incidentId}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      selectedInsight?.incidentId === insight.incidentId 
                        ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' 
                        : 'border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-600 bg-gray-50 dark:bg-gray-700/50'
                    }`}
                    onClick={() => setSelectedInsight(insight)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <AlertTriangle size={16} className="text-orange-500 mr-2" />
                        <span className="font-medium text-gray-900 dark:text-white text-sm">{insight.title}</span>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${getSeverityColor(insight.severity)}`}>
                        {insight.severity}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {insight.rootCauseAnalysis.primaryCause}
                    </p>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-blue-600 dark:text-blue-400">
                        {insight.suggestedFix.confidenceScore}% AI confidence
                      </span>
                      <span className="text-gray-500 dark:text-gray-400">
                        {insight.trendAnalysis.historicalOccurrences} similar incidents
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Incident Details */}
            <div>
              {selectedInsight ? (
                <div>
                  <h3 className="text-md font-medium text-gray-900 dark:text-white mb-4">
                    Incident Analysis: {selectedInsight.title}
                  </h3>
                  
                  {/* Root Cause Analysis */}
                  <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <h4 className="text-sm font-medium text-blue-800 dark:text-blue-400 mb-2 flex items-center">
                      <Target size={16} className="mr-1" />
                      Root Cause Analysis
                    </h4>
                    <p className="text-sm text-blue-700 dark:text-blue-300 mb-3">
                      <strong>Primary Cause:</strong> {selectedInsight.rootCauseAnalysis.primaryCause}
                    </p>
                    <div className="mb-3">
                      <p className="text-xs text-blue-600 dark:text-blue-400 mb-1">Contributing Factors:</p>
                      <ul className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
                        {selectedInsight.rootCauseAnalysis.contributingFactors.map((factor, index) => (
                          <li key={index} className="flex items-start">
                            <span className="w-1 h-1 rounded-full bg-blue-500 mt-1.5 mr-2 flex-shrink-0"></span>
                            {factor}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Human-Readable Explanation */}
                  <div className="mb-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                    <h4 className="text-sm font-medium text-green-800 dark:text-green-400 mb-2 flex items-center">
                      <MessageSquare size={16} className="mr-1" />
                      Plain English Explanation
                    </h4>
                    <div className="text-sm text-green-700 dark:text-green-300 whitespace-pre-line">
                      {selectedInsight.rootCauseAnalysis.humanReadableExplanation}
                    </div>
                  </div>

                  {/* Trend Analysis */}
                  {selectedInsight.trendAnalysis.patternDetected && (
                    <div className="mb-4 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                      <h4 className="text-sm font-medium text-amber-800 dark:text-amber-400 mb-2 flex items-center">
                        <TrendingUp size={16} className="mr-1" />
                        Pattern Detection
                      </h4>
                      <p className="text-sm text-amber-700 dark:text-amber-300 mb-2">
                        <strong>Pattern Detected:</strong> {selectedInsight.trendAnalysis.nextOccurrenceProbability}% chance of repeat issue in next deployment cycle.
                      </p>
                      <p className="text-xs text-amber-600 dark:text-amber-400">
                        Based on {selectedInsight.trendAnalysis.historicalOccurrences} similar incidents in the past 30 days.
                      </p>
                    </div>
                  )}

                  {/* Suggested Fix */}
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                      <CheckCircle size={16} className="mr-1" />
                      AI-Suggested Fix
                    </h4>
                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-900 dark:text-white text-sm">
                          {selectedInsight.suggestedFix.action.replace(/_/g, ' ').toUpperCase()}
                        </span>
                        <div className="flex items-center space-x-2">
                          <span className={`text-xs font-medium ${getRiskColor(selectedInsight.suggestedFix.riskLevel)}`}>
                            {selectedInsight.suggestedFix.riskLevel} risk
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {selectedInsight.suggestedFix.confidenceScore}% confidence
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        {selectedInsight.suggestedFix.description}
                      </p>
                      {selectedInsight.suggestedFix.yaml && (
                        <div className="h-32 border border-gray-200 dark:border-gray-700 rounded overflow-hidden mb-3">
                          <Editor
                            height="100%"
                            defaultLanguage="yaml"
                            value={selectedInsight.suggestedFix.yaml}
                            theme="vs-dark"
                            options={{
                              readOnly: true,
                              minimap: { enabled: false },
                              lineNumbers: 'on',
                              scrollBeyondLastLine: false,
                              wordWrap: 'on'
                            }}
                          />
                        </div>
                      )}
                      <div className="flex space-x-2">
                        <button className="flex-1 px-3 py-1.5 text-xs bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
                          Apply Fix
                        </button>
                        <button 
                          onClick={() => startDebuggingSession(selectedInsight)}
                          className="flex-1 px-3 py-1.5 text-xs bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                        >
                          Debug Interactively
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                    <Brain size={24} className="text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Select an Incident</h3>
                  <p className="text-gray-500 dark:text-gray-400">Choose an incident to view detailed AI analysis and debugging guidance</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'debugging' && (
          <div>
            {debuggingSession ? (
              <div>
                <h3 className="text-md font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                  <Code size={18} className="mr-2" />
                  Interactive Debugging Session
                </h3>
                <div className="space-y-4">
                  {debuggingSession.commands.map((command: any, index: number) => (
                    <div key={command.id} className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                      <div className="flex items-start mb-3">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-medium flex items-center justify-center mr-3">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 dark:text-white mb-1">{command.description}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{command.explanation}</p>
                        </div>
                      </div>
                      
                      <div className="bg-gray-900 rounded-lg p-3 mb-3">
                        <code className="text-sm text-gray-300">{command.command}</code>
                      </div>
                      
                      <div className="mb-3">
                        <h5 className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">What to look for:</h5>
                        <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                          {command.nextSteps.map((step: string, stepIndex: number) => (
                            <li key={stepIndex} className="flex items-start">
                              <span className="w-1 h-1 rounded-full bg-gray-400 mt-1.5 mr-2 flex-shrink-0"></span>
                              {step}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <button className="px-3 py-1.5 text-xs bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                        Copy Command
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                  <Code size={24} className="text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Start Interactive Debugging</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4">Select an incident and click "Debug Interactively" to get step-by-step troubleshooting guidance</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'trends' && summary && (
          <div>
            <h3 className="text-md font-medium text-gray-900 dark:text-white mb-4 flex items-center">
              <TrendingUp size={18} className="mr-2" />
              Incident Trends & Patterns
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 dark:text-white mb-3">Top Issue Types</h4>
                <div className="space-y-3">
                  {summary.topIssueTypes.map((issue: any, index: number) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm text-gray-700 dark:text-gray-300">{issue.type}</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">{issue.count}</span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          issue.trend === 'increasing' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' :
                          issue.trend === 'decreasing' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                          'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'
                        }`}>
                          {issue.trend}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 dark:text-white mb-3">AI Insights</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700 dark:text-gray-300">Pattern Detection Rate</span>
                    <span className="text-sm font-medium text-green-600 dark:text-green-400">94%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700 dark:text-gray-300">Auto-Fix Success Rate</span>
                    <span className="text-sm font-medium text-blue-600 dark:text-blue-400">87%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700 dark:text-gray-300">Prediction Accuracy</span>
                    <span className="text-sm font-medium text-purple-600 dark:text-purple-400">91%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default IncidentInsights;