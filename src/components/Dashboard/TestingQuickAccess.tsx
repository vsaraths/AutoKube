import React from 'react';
import { TestTube, Zap, Terminal, Play, CheckCircle, AlertTriangle, Shield, Eye } from 'lucide-react';

const TestingQuickAccess: React.FC = () => {
  const quickTests = [
    {
      id: 'probe-failure',
      name: 'Health Probe Failure',
      description: 'Test AI detection of failing readiness/liveness probes',
      severity: 'high',
      estimatedTime: '2m',
      status: 'ready',
      confidence: 92
    },
    {
      id: 'memory-oom',
      name: 'Memory Exhaustion',
      description: 'Simulate OOMKilled events and auto-scaling',
      severity: 'critical',
      estimatedTime: '3m',
      status: 'ready',
      confidence: 88
    },
    {
      id: 'image-pull',
      name: 'Image Pull Error',
      description: 'Test ImagePullBackOff remediation',
      severity: 'medium',
      estimatedTime: '1m',
      status: 'ready',
      confidence: 95
    }
  ];

  const reviewStats = {
    pendingReview: 4,
    approved: 12,
    avgConfidence: 91
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ready':
        return <CheckCircle size={16} className="text-green-500" />;
      case 'running':
        return <Play size={16} className="text-blue-500 animate-pulse" />;
      case 'failed':
        return <AlertTriangle size={16} className="text-red-500" />;
      default:
        return <CheckCircle size={16} className="text-gray-400" />;
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="p-2 rounded-lg bg-gradient-to-r from-green-500 to-blue-600 text-white mr-3">
              <TestTube size={20} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Quick Testing</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Run AI auto-remediation tests</p>
            </div>
          </div>
          <button className="flex items-center px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Terminal size={16} className="mr-1" />
            Full Test Suite
          </button>
        </div>

        {/* AI Fix Review Summary */}
        <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              <Shield size={18} className="text-purple-600 dark:text-purple-400 mr-2" />
              <h3 className="font-medium text-purple-800 dark:text-purple-300">AI Fix Review Status</h3>
            </div>
            <button className="flex items-center px-2 py-1 text-xs bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors">
              <Eye size={12} className="mr-1" />
              Review Fixes
            </button>
          </div>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="text-center">
              <p className="text-lg font-bold text-amber-600 dark:text-amber-400">{reviewStats.pendingReview}</p>
              <p className="text-xs text-purple-700 dark:text-purple-300">Pending Review</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-green-600 dark:text-green-400">{reviewStats.approved}</p>
              <p className="text-xs text-purple-700 dark:text-purple-300">Approved</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{reviewStats.avgConfidence}%</p>
              <p className="text-xs text-purple-700 dark:text-purple-300">Avg Confidence</p>
            </div>
          </div>
        </div>
        
        <div className="space-y-3">
          {quickTests.map((test) => (
            <div key={test.id} className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  {getStatusIcon(test.status)}
                  <span className="ml-2 font-medium text-gray-900 dark:text-white">{test.name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${getSeverityColor(test.severity)}`}>
                    {test.severity}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">{test.estimatedTime}</span>
                </div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{test.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                  {test.confidence}% AI confidence
                </span>
                <button className="flex items-center px-3 py-1.5 text-xs bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
                  <Zap size={12} className="mr-1" />
                  Run Test
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              💡 Tests simulate real Kubernetes failures to validate AI auto-remediation capabilities
            </p>
            <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">
              🛡️ All AI fixes undergo manual review before execution
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestingQuickAccess;