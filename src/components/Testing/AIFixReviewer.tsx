import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Eye, Play, Pause, Code, GitBranch, Clock, Brain, Shield } from 'lucide-react';
import Editor from "@monaco-editor/react";
import { KubernetesErrorAnalyzer } from '../../api/kubernetes-error-analyzer';

interface AIFix {
  id: string;
  errorType: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  aiConfidence: number;
  suggestedFix: {
    action: string;
    description: string;
    yaml?: string;
    command?: string;
    priority: number;
  };
  bestPracticeAlignment: number;
  riskAssessment: {
    level: 'low' | 'medium' | 'high';
    factors: string[];
  };
  manualReview: {
    status: 'pending' | 'approved' | 'rejected' | 'modified';
    reviewer?: string;
    notes?: string;
    modifiedFix?: string;
  };
  testResults?: {
    dryRun: boolean;
    success: boolean;
    output: string;
  };
}

const AIFixReviewer: React.FC = () => {
  const [fixes, setFixes] = useState<AIFix[]>([]);
  const [selectedFix, setSelectedFix] = useState<AIFix | null>(null);
  const [reviewMode, setReviewMode] = useState<'manual' | 'auto'>('manual');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    generateMockFixes();
  }, []);

  const generateMockFixes = async () => {
    setIsAnalyzing(true);
    
    // Simulate AI analysis of real Kubernetes errors
    const mockErrors = [
      'E0609 05:23:17.678901    1 pod_workers.go:190] Error syncing pod default/nginx-deployment-5c689d8b4b-jx3wp, skipping: failed to "StartContainer" for "nginx" with CrashLoopBackOff',
      'E0609 05:23:18.987654    1 horizontal.go:101] failed to compute desired number of replicas based on CPU utilization: unable to get metrics for resource cpu: no metrics returned from resource metrics API',
      'E0609 05:23:21.234567    1 scheduler.go:597] error selecting node for pod default/backend-654dcbf56c-bw7fr: no nodes available to schedule pods',
      'E0609 05:23:25.789012    1 kubelet.go:1555] Failed to pull image "myregistry.local/myapp:v1": rpc error: code = Unknown desc = Error response from daemon: manifest for myregistry.local/myapp:v1 not found'
    ];

    const analyzer = KubernetesErrorAnalyzer.getInstance();
    const analysisResults = await analyzer.batchAnalyze(mockErrors);
    
    const generatedFixes: AIFix[] = analysisResults.analyses.map((analysis, index) => ({
      id: `fix-${index + 1}`,
      errorType: analysis.errorType,
      severity: analysis.severity,
      description: analysis.rootCause,
      aiConfidence: Math.floor(Math.random() * 20) + 80, // 80-100%
      suggestedFix: analysis.suggestedFixes[0] || {
        action: 'manual_intervention',
        description: 'Manual intervention required',
        priority: 1
      },
      bestPracticeAlignment: Math.floor(Math.random() * 30) + 70, // 70-100%
      riskAssessment: {
        level: analysis.severity === 'critical' ? 'high' : analysis.severity === 'high' ? 'medium' : 'low',
        factors: [
          'Production environment impact',
          'Resource modification required',
          'Service availability during fix'
        ]
      },
      manualReview: {
        status: 'pending'
      }
    }));

    setFixes(generatedFixes);
    setIsAnalyzing(false);
  };

  const reviewFix = (fixId: string, status: 'approved' | 'rejected' | 'modified', notes?: string, modifiedFix?: string) => {
    setFixes(prev => prev.map(fix => 
      fix.id === fixId 
        ? {
            ...fix,
            manualReview: {
              status,
              reviewer: 'admin@autokube.io',
              notes,
              modifiedFix
            }
          }
        : fix
    ));
  };

  const runDryTest = async (fix: AIFix) => {
    // Simulate dry run test
    const testResult = {
      dryRun: true,
      success: Math.random() > 0.2, // 80% success rate
      output: fix.suggestedFix.command 
        ? `$ ${fix.suggestedFix.command}\n✓ Command validation successful\n✓ No conflicts detected\n✓ Safe to apply`
        : `$ kubectl apply --dry-run=client -f fix.yaml\n✓ YAML validation successful\n✓ Resource constraints satisfied\n✓ No policy violations`
    };

    setFixes(prev => prev.map(f => 
      f.id === fix.id ? { ...f, testResults: testResult } : f
    ));
  };

  const applyFix = async (fix: AIFix) => {
    // Simulate applying the fix
    console.log(`Applying fix: ${fix.suggestedFix.action}`);
    
    // Update status to show fix is being applied
    setFixes(prev => prev.map(f => 
      f.id === fix.id 
        ? {
            ...f,
            manualReview: {
              ...f.manualReview,
              status: 'approved'
            }
          }
        : f
    ));
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'text-green-600 dark:text-green-400';
    if (confidence >= 75) return 'text-amber-600 dark:text-amber-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'high':
        return 'text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400';
      case 'medium':
        return 'text-amber-600 bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400';
      default:
        return 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle size={16} className="text-green-500" />;
      case 'rejected':
        return <XCircle size={16} className="text-red-500" />;
      case 'modified':
        return <Code size={16} className="text-blue-500" />;
      default:
        return <Clock size={16} className="text-amber-500" />;
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-blue-600 text-white mr-3">
              <Shield size={20} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">AI Fix Review & Validation</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Manual review of AI-generated fixes before execution</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setReviewMode(reviewMode === 'manual' ? 'auto' : 'manual')}
              className={`flex items-center px-3 py-1.5 text-sm rounded-lg transition-colors ${
                reviewMode === 'manual' 
                  ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' 
                  : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
              }`}
            >
              <Eye size={16} className="mr-1" />
              Manual Review {reviewMode === 'manual' ? 'ON' : 'OFF'}
            </button>
            <button
              onClick={generateMockFixes}
              disabled={isAnalyzing}
              className="flex items-center px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              <Brain size={16} className="mr-1" />
              {isAnalyzing ? 'Analyzing...' : 'Analyze Logs'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Fix List */}
          <div>
            <h3 className="text-md font-medium text-gray-900 dark:text-white mb-4">AI-Generated Fixes</h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {fixes.map((fix) => (
                <div 
                  key={fix.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    selectedFix?.id === fix.id 
                      ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20' 
                      : 'border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600 bg-gray-50 dark:bg-gray-700/50'
                  }`}
                  onClick={() => setSelectedFix(fix)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      {getStatusIcon(fix.manualReview.status)}
                      <span className="ml-2 font-medium text-gray-900 dark:text-white text-sm">
                        {fix.errorType.replace(/_/g, ' ').toUpperCase()}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${getRiskColor(fix.riskAssessment.level)}`}>
                        {fix.riskAssessment.level} risk
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{fix.description}</p>
                  <div className="flex items-center justify-between text-xs">
                    <span className={`font-medium ${getConfidenceColor(fix.aiConfidence)}`}>
                      {fix.aiConfidence}% AI confidence
                    </span>
                    <span className="text-gray-500 dark:text-gray-400">
                      {fix.bestPracticeAlignment}% best practice alignment
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Fix Details and Review */}
          <div>
            {selectedFix ? (
              <div>
                <h3 className="text-md font-medium text-gray-900 dark:text-white mb-4">
                  Fix Review: {selectedFix.errorType.replace(/_/g, ' ')}
                </h3>
                
                {/* AI Analysis */}
                <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <h4 className="text-sm font-medium text-blue-800 dark:text-blue-400 mb-2 flex items-center">
                    <Brain size={16} className="mr-1" />
                    AI Analysis
                  </h4>
                  <p className="text-sm text-blue-700 dark:text-blue-300 mb-2">{selectedFix.description}</p>
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-blue-600 dark:text-blue-400">Confidence:</span>
                      <span className={`ml-1 font-medium ${getConfidenceColor(selectedFix.aiConfidence)}`}>
                        {selectedFix.aiConfidence}%
                      </span>
                    </div>
                    <div>
                      <span className="text-blue-600 dark:text-blue-400">Best Practice:</span>
                      <span className="ml-1 font-medium text-blue-700 dark:text-blue-300">
                        {selectedFix.bestPracticeAlignment}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Suggested Fix */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Suggested Fix</h4>
                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 mb-3">
                    <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                      {selectedFix.suggestedFix.action.replace(/_/g, ' ').toUpperCase()}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {selectedFix.suggestedFix.description}
                    </p>
                    {selectedFix.suggestedFix.yaml && (
                      <div className="h-32 border border-gray-200 dark:border-gray-700 rounded overflow-hidden">
                        <Editor
                          height="100%"
                          defaultLanguage="yaml"
                          value={selectedFix.suggestedFix.yaml}
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
                    {selectedFix.suggestedFix.command && (
                      <div className="bg-gray-900 rounded p-2 mt-2">
                        <code className="text-sm text-gray-300">{selectedFix.suggestedFix.command}</code>
                      </div>
                    )}
                  </div>
                </div>

                {/* Risk Assessment */}
                <div className="mb-4 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                  <h4 className="text-sm font-medium text-amber-800 dark:text-amber-400 mb-2 flex items-center">
                    <AlertTriangle size={16} className="mr-1" />
                    Risk Assessment
                  </h4>
                  <div className="mb-2">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${getRiskColor(selectedFix.riskAssessment.level)}`}>
                      {selectedFix.riskAssessment.level.toUpperCase()} RISK
                    </span>
                  </div>
                  <ul className="text-sm text-amber-700 dark:text-amber-300 space-y-1">
                    {selectedFix.riskAssessment.factors.map((factor, index) => (
                      <li key={index} className="flex items-start">
                        <span className="w-1 h-1 rounded-full bg-amber-500 mt-2 mr-2 flex-shrink-0"></span>
                        {factor}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Test Results */}
                {selectedFix.testResults && (
                  <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                    <h4 className="text-sm font-medium text-green-800 dark:text-green-400 mb-2">Dry Run Results</h4>
                    <div className="bg-gray-900 rounded p-2">
                      <pre className="text-xs text-gray-300 whitespace-pre-wrap">
                        {selectedFix.testResults.output}
                      </pre>
                    </div>
                  </div>
                )}

                {/* Review Actions */}
                <div className="space-y-3">
                  {selectedFix.manualReview.status === 'pending' && (
                    <>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => runDryTest(selectedFix)}
                          className="flex-1 flex items-center justify-center px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <Play size={16} className="mr-1" />
                          Run Dry Test
                        </button>
                        <button
                          onClick={() => reviewFix(selectedFix.id, 'approved', 'Fix approved after manual review')}
                          className="flex-1 flex items-center justify-center px-3 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                          <CheckCircle size={16} className="mr-1" />
                          Approve
                        </button>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => reviewFix(selectedFix.id, 'rejected', 'Fix rejected - requires manual intervention')}
                          className="flex-1 flex items-center justify-center px-3 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                          <XCircle size={16} className="mr-1" />
                          Reject
                        </button>
                        <button
                          onClick={() => reviewFix(selectedFix.id, 'modified', 'Fix modified for safety')}
                          className="flex-1 flex items-center justify-center px-3 py-2 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                        >
                          <Code size={16} className="mr-1" />
                          Modify
                        </button>
                      </div>
                    </>
                  )}
                  
                  {selectedFix.manualReview.status === 'approved' && (
                    <button
                      onClick={() => applyFix(selectedFix)}
                      className="w-full flex items-center justify-center px-3 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <GitBranch size={16} className="mr-1" />
                      Apply Fix to Cluster
                    </button>
                  )}
                  
                  {selectedFix.manualReview.status !== 'pending' && (
                    <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <div className="flex items-center mb-1">
                        {getStatusIcon(selectedFix.manualReview.status)}
                        <span className="ml-2 text-sm font-medium text-gray-900 dark:text-white">
                          {selectedFix.manualReview.status.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        Reviewed by: {selectedFix.manualReview.reviewer}
                      </p>
                      {selectedFix.manualReview.notes && (
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                          Notes: {selectedFix.manualReview.notes}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                  <Shield size={24} className="text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Select a Fix to Review</h3>
                <p className="text-gray-500 dark:text-gray-400">Choose an AI-generated fix to review and validate before execution</p>
              </div>
            )}
          </div>
        </div>

        {/* Summary Stats */}
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{fixes.length}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Fixes</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {fixes.filter(f => f.manualReview.status === 'approved').length}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Approved</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                {fixes.filter(f => f.manualReview.status === 'pending').length}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Pending Review</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {fixes.length > 0 ? Math.round(fixes.reduce((acc, f) => acc + f.aiConfidence, 0) / fixes.length) : 0}%
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Avg Confidence</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIFixReviewer;