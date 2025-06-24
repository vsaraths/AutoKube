import React, { useState } from 'react';
import { Terminal, Copy, Play, CheckCircle, AlertTriangle, Code } from 'lucide-react';

interface CommandStep {
  id: string;
  title: string;
  description: string;
  command: string;
  expectedOutput: string;
  category: 'setup' | 'test' | 'analyze' | 'remediate';
}

const KubernetesTestCommands: React.FC = () => {
  const [executedCommands, setExecutedCommands] = useState<Set<string>>(new Set());
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const commandSteps: CommandStep[] = [
    {
      id: 'deploy-failing-pod',
      title: 'Deploy Failing Test Pod',
      description: 'Create a pod that will fail health checks to trigger AI remediation',
      command: `kubectl apply -f - <<EOF
apiVersion: v1
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
          path: /health
          port: 80
        initialDelaySeconds: 5
        periodSeconds: 10
      livenessProbe:
        httpGet:
          path: /health
          port: 80
        initialDelaySeconds: 10
        periodSeconds: 20
EOF`,
      expectedOutput: 'pod/failing-app created',
      category: 'setup'
    },
    {
      id: 'check-pod-status',
      title: 'Monitor Pod Status',
      description: 'Watch the pod fail and enter restart loop',
      command: 'kubectl get pods failing-app -w',
      expectedOutput: 'failing-app   0/1     Running   0          10s\nfailing-app   0/1     Running   1          30s',
      category: 'test'
    },
    {
      id: 'get-pod-events',
      title: 'Check Pod Events',
      description: 'View events to see probe failures',
      command: 'kubectl describe pod failing-app',
      expectedOutput: 'Warning  Unhealthy  readiness probe failed: Get "http://10.244.0.5:80/health": dial tcp 10.244.0.5:80: connect: connection refused',
      category: 'analyze'
    },
    {
      id: 'ai-detect-issues',
      title: 'AI Issue Detection',
      description: 'Use AutoKube AI to detect and analyze the failure',
      command: 'kubectl autokube detect --namespace=default',
      expectedOutput: '❌ HIGH: Pod Health Check Failure - Pod failing-app is failing readiness/liveness probes\nFound 1 issues in namespace \'default\'',
      category: 'analyze'
    },
    {
      id: 'ai-auto-fix',
      title: 'Apply AI Auto-Remediation',
      description: 'Let AI automatically fix the probe configuration',
      command: 'kubectl autokube fix --auto --namespace=default',
      expectedOutput: '✅ update_probe_config: Updated health check endpoints for failing-app\n✅ restart_pod: Restarted pod failing-app\nApplied 2 fixes in namespace \'default\'',
      category: 'remediate'
    },
    {
      id: 'deploy-oom-test',
      title: 'Deploy Memory Exhaustion Test',
      description: 'Create a pod that will exceed memory limits',
      command: `kubectl apply -f - <<EOF
apiVersion: v1
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
          memory: "512Mi"
          cpu: "500m"
EOF`,
      expectedOutput: 'pod/memory-hog created',
      category: 'setup'
    },
    {
      id: 'monitor-oom',
      title: 'Monitor OOM Events',
      description: 'Watch for OOMKilled events',
      command: 'kubectl get events --field-selector involvedObject.name=memory-hog',
      expectedOutput: 'Warning   Killing   pod/memory-hog   Stopping container memory-consumer: OOMKilled',
      category: 'test'
    },
    {
      id: 'ai-oom-remediation',
      title: 'AI OOM Remediation',
      description: 'AI detects OOM and increases memory limits',
      command: 'kubectl autokube fix --auto --pod=memory-hog',
      expectedOutput: '✅ scale_memory: Increased memory limit to 1Gi for memory-hog\n✅ restart_pod: Restarted pod memory-hog\nApplied 2 fixes',
      category: 'remediate'
    },
    {
      id: 'deploy-image-error',
      title: 'Deploy Invalid Image Test',
      description: 'Create a pod with non-existent image',
      command: `kubectl apply -f - <<EOF
apiVersion: v1
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
          cpu: "200m"
EOF`,
      expectedOutput: 'pod/invalid-image created',
      category: 'setup'
    },
    {
      id: 'check-image-pull-error',
      title: 'Check ImagePullBackOff',
      description: 'Verify the pod enters ImagePullBackOff state',
      command: 'kubectl get pod invalid-image',
      expectedOutput: 'invalid-image   0/1     ImagePullBackOff   0          2m',
      category: 'test'
    },
    {
      id: 'ai-image-fix',
      title: 'AI Image Remediation',
      description: 'AI suggests and applies valid image tag',
      command: 'kubectl autokube fix --auto --pod=invalid-image',
      expectedOutput: '✅ update_image: Updated image to nginx:latest for invalid-image\n✅ restart_pod: Restarted pod invalid-image\nApplied 2 fixes',
      category: 'remediate'
    },
    {
      id: 'cleanup-tests',
      title: 'Cleanup Test Resources',
      description: 'Remove all test pods and resources',
      command: 'kubectl delete pods failing-app memory-hog invalid-image',
      expectedOutput: 'pod "failing-app" deleted\npod "memory-hog" deleted\npod "invalid-image" deleted',
      category: 'setup'
    }
  ];

  const categories = [
    { id: 'all', name: 'All Commands', color: 'bg-gray-100 text-gray-800' },
    { id: 'setup', name: 'Setup', color: 'bg-blue-100 text-blue-800' },
    { id: 'test', name: 'Test', color: 'bg-amber-100 text-amber-800' },
    { id: 'analyze', name: 'Analyze', color: 'bg-purple-100 text-purple-800' },
    { id: 'remediate', name: 'Remediate', color: 'bg-green-100 text-green-800' }
  ];

  const filteredCommands = selectedCategory === 'all' 
    ? commandSteps 
    : commandSteps.filter(cmd => cmd.category === selectedCategory);

  const copyCommand = (command: string) => {
    navigator.clipboard.writeText(command);
  };

  const markAsExecuted = (commandId: string) => {
    setExecutedCommands(prev => new Set([...prev, commandId]));
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'setup':
        return <Code size={16} className="text-blue-600" />;
      case 'test':
        return <Play size={16} className="text-amber-600" />;
      case 'analyze':
        return <AlertTriangle size={16} className="text-purple-600" />;
      case 'remediate':
        return <CheckCircle size={16} className="text-green-600" />;
      default:
        return <Terminal size={16} className="text-gray-600" />;
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-green-600 text-white mr-3">
              <Terminal size={20} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Kubernetes Test Commands</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Step-by-step AI auto-remediation testing</p>
            </div>
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {executedCommands.size}/{commandSteps.length} completed
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center px-3 py-1.5 text-sm rounded-lg transition-colors ${
                selectedCategory === category.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {getCategoryIcon(category.id)}
              <span className="ml-1">{category.name}</span>
            </button>
          ))}
        </div>

        {/* Command Steps */}
        <div className="space-y-4">
          {filteredCommands.map((step, index) => (
            <div 
              key={step.id}
              className={`border rounded-lg p-4 transition-all ${
                executedCommands.has(step.id)
                  ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20'
                  : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start">
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                    executedCommands.has(step.id)
                      ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                      : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                  }`}>
                    {executedCommands.has(step.id) ? (
                      <CheckCircle size={16} />
                    ) : (
                      <span className="text-sm font-medium">{index + 1}</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center mb-1">
                      {getCategoryIcon(step.category)}
                      <h3 className="ml-2 font-medium text-gray-900 dark:text-white">{step.title}</h3>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{step.description}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => copyCommand(step.command)}
                    className="p-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                    title="Copy command"
                  >
                    <Copy size={16} />
                  </button>
                  <button
                    onClick={() => markAsExecuted(step.id)}
                    className="px-3 py-1.5 text-xs bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Mark Done
                  </button>
                </div>
              </div>
              
              {/* Command */}
              <div className="mb-3">
                <div className="bg-gray-900 rounded-lg p-3">
                  <pre className="text-sm text-gray-300 overflow-x-auto whitespace-pre-wrap">
                    {step.command}
                  </pre>
                </div>
              </div>
              
              {/* Expected Output */}
              <div>
                <h4 className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Expected Output:</h4>
                <div className="bg-green-900 rounded-lg p-2">
                  <pre className="text-xs text-green-300 overflow-x-auto whitespace-pre-wrap">
                    {step.expectedOutput}
                  </pre>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Progress Summary */}
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Testing Progress: {executedCommands.size} of {commandSteps.length} steps completed
            </div>
            <div className="w-48 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(executedCommands.size / commandSteps.length) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KubernetesTestCommands;