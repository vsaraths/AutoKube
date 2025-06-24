import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, CheckCircle, AlertTriangle, XCircle, Clock, Zap, Brain, Terminal, FileText } from 'lucide-react';
import Editor from "@monaco-editor/react";

interface TestScenario {
  id: string;
  name: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  yaml: string;
  expectedFailure: string;
  aiRemediation: string[];
  status: 'pending' | 'running' | 'failed' | 'remediated' | 'completed';
  logs: string[];
  duration?: number;
}

const AutoRemediationTester: React.FC = () => {
  const [activeTest, setActiveTest] = useState<string | null>(null);
  const [testResults, setTestResults] = useState<Record<string, any>>({});
  const [autoMode, setAutoMode] = useState(true);
  const [selectedScenario, setSelectedScenario] = useState<TestScenario | null>(null);

  const testScenarios: TestScenario[] = [
    {
      id: 'probe-failure',
      name: 'Health Probe Failure',
      description: 'Pod fails readiness/liveness probes causing restart loops',
      severity: 'high',
      yaml: `apiVersion: v1
kind: Pod
metadata:
  name: failing-app
  labels:
    app: test-failure
spec:
  containers:
    - name: nginx
      image: nginx:latest
      resources:
        requests:
          memory: "512Mi"
          cpu: "500m"
        limits:
          memory: "512Mi"
          cpu: "500m"
      readinessProbe:
        httpGet:
          path: /health  # This endpoint doesn't exist
          port: 80
        initialDelaySeconds: 5
        periodSeconds: 10
      livenessProbe:
        httpGet:
          path: /health  # This endpoint doesn't exist
          port: 80
        initialDelaySeconds: 10
        periodSeconds: 20`,
      expectedFailure: 'Pod will fail readiness/liveness probes and enter restart loop',
      aiRemediation: [
        'Detect probe failure pattern in logs',
        'Analyze container startup and health check responses',
        'Suggest probe configuration adjustments',
        'Auto-apply corrected probe settings'
      ],
      status: 'pending',
      logs: []
    },
    {
      id: 'resource-exhaustion',
      name: 'Memory Exhaustion',
      description: 'Pod exceeds memory limits causing OOMKilled events',
      severity: 'critical',
      yaml: `apiVersion: v1
kind: Pod
metadata:
  name: memory-hog
  labels:
    app: test-oom
spec:
  containers:
    - name: memory-consumer
      image: progrium/stress
      args: ["--vm", "1", "--vm-bytes", "1G", "--timeout", "60s"]
      resources:
        requests:
          memory: "256Mi"
          cpu: "100m"
        limits:
          memory: "512Mi"  # Will be exceeded
          cpu: "500m"`,
      expectedFailure: 'Container will be OOMKilled due to memory limit exceeded',
      aiRemediation: [
        'Detect OOMKilled events in pod status',
        'Analyze memory usage patterns',
        'Calculate optimal memory allocation',
        'Auto-scale memory limits and restart pod'
      ],
      status: 'pending',
      logs: []
    },
    {
      id: 'image-pull-error',
      name: 'Image Pull Failure',
      description: 'Pod fails to start due to invalid container image',
      severity: 'medium',
      yaml: `apiVersion: v1
kind: Pod
metadata:
  name: invalid-image
  labels:
    app: test-image-error
spec:
  containers:
    - name: app
      image: nonexistent/invalid-image:v999
      resources:
        requests:
          memory: "128Mi"
          cpu: "100m"
        limits:
          memory: "256Mi"
          cpu: "200m"`,
      expectedFailure: 'ImagePullBackOff due to non-existent container image',
      aiRemediation: [
        'Detect ImagePullBackOff status',
        'Validate image registry and tag availability',
        'Suggest alternative image versions',
        'Auto-update to valid image tag'
      ],
      status: 'pending',
      logs: []
    },
    {
      id: 'network-policy-block',
      name: 'Network Connectivity Issue',
      description: 'Service cannot connect due to network policy restrictions',
      severity: 'high',
      yaml: `apiVersion: v1
kind: Pod
metadata:
  name: network-test
  labels:
    app: test-network
spec:
  containers:
    - name: curl
      image: curlimages/curl
      command: ["sleep", "3600"]
---
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: deny-all
spec:
  podSelector:
    matchLabels:
      app: test-network
  policyTypes:
  - Ingress
  - Egress`,
      expectedFailure: 'Network connections blocked by restrictive network policy',
      aiRemediation: [
        'Detect network connectivity timeouts',
        'Analyze network policy rules',
        'Identify required network access patterns',
        'Generate appropriate network policy exceptions'
      ],
      status: 'pending',
      logs: []
    }
  ];

  const runTest = async (scenario: TestScenario) => {
    setActiveTest(scenario.id);
    setSelectedScenario(scenario);
    
    // Update scenario status
    const updatedScenario = { ...scenario, status: 'running' as const, logs: [] };
    
    // Simulate test execution phases
    const phases = [
      { phase: 'Deploying test resources', duration: 2000 },
      { phase: 'Waiting for failure condition', duration: 3000 },
      { phase: 'AI analyzing failure patterns', duration: 2500 },
      { phase: 'Generating remediation plan', duration: 2000 },
      { phase: 'Applying auto-remediation', duration: 3000 },
      { phase: 'Verifying fix effectiveness', duration: 2000 }
    ];

    for (const { phase, duration } of phases) {
      updatedScenario.logs.push(`[${new Date().toLocaleTimeString()}] ${phase}...`);
      setSelectedScenario({ ...updatedScenario });
      await new Promise(resolve => setTimeout(resolve, duration));
    }

    // Simulate final result
    updatedScenario.status = 'remediated';
    updatedScenario.logs.push(`[${new Date().toLocaleTimeString()}] ✅ Test completed successfully`);
    updatedScenario.logs.push(`[${new Date().toLocaleTimeString()}] AI remediation applied and verified`);
    
    setSelectedScenario(updatedScenario);
    setTestResults(prev => ({
      ...prev,
      [scenario.id]: {
        success: true,
        duration: phases.reduce((acc, p) => acc + p.duration, 0),
        remediationSteps: scenario.aiRemediation.length
      }
    }));
    
    setActiveTest(null);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running':
        return <Clock size={16} className="text-blue-500 animate-spin" />;
      case 'remediated':
      case 'completed':
        return <CheckCircle size={16} className="text-green-500" />;
      case 'failed':
        return <XCircle size={16} className="text-red-500" />;
      default:
        return <AlertTriangle size={16} className="text-gray-400" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      case 'high':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400';
      case 'medium':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400';
      default:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="p-2 rounded-lg bg-gradient-to-r from-green-500 to-blue-600 text-white mr-3">
              <Zap size={20} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">AI Auto-Remediation Testing</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Simulate failures and test AI-powered fixes</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setAutoMode(!autoMode)}
              className={`flex items-center px-3 py-1.5 text-sm rounded-lg transition-colors ${
                autoMode 
                  ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                  : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
              }`}
            >
              <Brain size={16} className="mr-1" />
              Auto-Fix {autoMode ? 'ON' : 'OFF'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Test Scenarios */}
          <div>
            <h3 className="text-md font-medium text-gray-900 dark:text-white mb-4">Test Scenarios</h3>
            <div className="space-y-3">
              {testScenarios.map((scenario) => (
                <div 
                  key={scenario.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    selectedScenario?.id === scenario.id 
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                      : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 bg-gray-50 dark:bg-gray-700/50'
                  }`}
                  onClick={() => setSelectedScenario(scenario)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      {getStatusIcon(scenario.status)}
                      <span className="ml-2 font-medium text-gray-900 dark:text-white">{scenario.name}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${getSeverityColor(scenario.severity)}`}>
                        {scenario.severity}
                      </span>
                      {testResults[scenario.id] && (
                        <span className="text-xs text-green-600 dark:text-green-400">
                          ✓ {testResults[scenario.id].duration}ms
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{scenario.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {scenario.aiRemediation.length} remediation steps
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        runTest(scenario);
                      }}
                      disabled={activeTest === scenario.id}
                      className="flex items-center px-3 py-1.5 text-xs bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {activeTest === scenario.id ? (
                        <>
                          <Clock size={12} className="mr-1 animate-spin" />
                          Running
                        </>
                      ) : (
                        <>
                          <Play size={12} className="mr-1" />
                          Run Test
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Test Details and Results */}
          <div>
            {selectedScenario ? (
              <div>
                <h3 className="text-md font-medium text-gray-900 dark:text-white mb-4">
                  Test Details: {selectedScenario.name}
                </h3>
                
                {/* YAML Configuration */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                    <FileText size={16} className="mr-1" />
                    Test Configuration
                  </h4>
                  <div className="h-48 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                    <Editor
                      height="100%"
                      defaultLanguage="yaml"
                      value={selectedScenario.yaml}
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
                </div>

                {/* Expected Failure */}
                <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                  <h4 className="text-sm font-medium text-red-800 dark:text-red-400 mb-1">Expected Failure</h4>
                  <p className="text-sm text-red-700 dark:text-red-300">{selectedScenario.expectedFailure}</p>
                </div>

                {/* AI Remediation Steps */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                    <Brain size={16} className="mr-1" />
                    AI Remediation Plan
                  </h4>
                  <div className="space-y-2">
                    {selectedScenario.aiRemediation.map((step, index) => (
                      <div key={index} className="flex items-start p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <div className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-medium flex items-center justify-center mr-2 mt-0.5">
                          {index + 1}
                        </div>
                        <span className="text-sm text-blue-800 dark:text-blue-300">{step}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Live Logs */}
                {selectedScenario.logs.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                      <Terminal size={16} className="mr-1" />
                      Live Test Logs
                    </h4>
                    <div className="bg-gray-900 rounded-lg p-3 h-32 overflow-y-auto">
                      {selectedScenario.logs.map((log, index) => (
                        <div key={index} className="text-xs text-gray-300 font-mono mb-1">
                          {log}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                  <Zap size={24} className="text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Select a Test Scenario</h3>
                <p className="text-gray-500 dark:text-gray-400">Choose a test scenario to view details and run AI auto-remediation tests</p>
              </div>
            )}
          </div>
        </div>

        {/* Test Summary */}
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{testScenarios.length}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Tests</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {Object.keys(testResults).length}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Completed</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {Object.values(testResults).reduce((acc: number, result: any) => acc + (result.remediationSteps || 0), 0)}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">AI Fixes Applied</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {Object.values(testResults).length > 0 
                  ? Math.round(Object.values(testResults).reduce((acc: number, result: any) => acc + (result.duration || 0), 0) / Object.values(testResults).length)
                  : 0}ms
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Avg Response Time</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AutoRemediationTester;