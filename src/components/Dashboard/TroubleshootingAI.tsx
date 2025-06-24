import React, { useState } from 'react';
import { Bot, Send, Loader2, AlertTriangle, CheckCircle, Code, Copy, MessageSquare, Zap, Brain } from 'lucide-react';
import Editor from "@monaco-editor/react";
import { parse, stringify } from 'yaml';
import { z } from 'zod';

// Schema for basic Kubernetes resource validation
const k8sResourceSchema = z.object({
  apiVersion: z.string(),
  kind: z.string(),
  metadata: z.object({
    name: z.string(),
    namespace: z.string().optional()
  }),
  spec: z.record(z.unknown())
});

const TroubleshootingAI: React.FC = () => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showYamlEditor, setShowYamlEditor] = useState(false);
  const [yamlContent, setYamlContent] = useState('');
  const [yamlError, setYamlError] = useState<string | null>(null);
  
  const mockChat = [
    { 
      role: 'user', 
      content: 'I\'m seeing CrashLoopBackOff errors in my nginx pods',
      timestamp: new Date(Date.now() - 300000).toISOString()
    },
    { 
      role: 'assistant', 
      content: 'I\'ve analyzed your cluster logs and detected that nginx pods are failing due to insufficient memory allocation. The containers are being OOMKilled. I can automatically fix this by increasing the memory limits.',
      timestamp: new Date(Date.now() - 240000).toISOString(),
      suggestedFix: {
        type: 'resource_adjustment',
        yaml: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
  namespace: default
spec:
  template:
    spec:
      containers:
      - name: nginx
        image: nginx:1.21
        resources:
          limits:
            memory: "512Mi"
            cpu: "500m"
          requests:
            memory: "256Mi"
            cpu: "250m"`,
        confidence: 95,
        estimatedFixTime: '30s'
      }
    },
    { 
      role: 'user', 
      content: 'What about the API server connection issues?',
      timestamp: new Date(Date.now() - 180000).toISOString()
    },
    { 
      role: 'assistant', 
      content: 'The API server connection failures are caused by network connectivity issues. I\'ve detected that the kubelet on worker nodes cannot reach the API server at 10.96.0.1:443. This requires immediate attention as it affects cluster stability.',
      timestamp: new Date(Date.now() - 120000).toISOString(),
      suggestedFix: {
        type: 'network_remediation',
        yaml: `# Check network connectivity and restart kubelet
apiVersion: v1
kind: Pod
metadata:
  name: network-debug
spec:
  containers:
  - name: debug
    image: nicolaka/netshoot
    command: ["sleep", "3600"]`,
        confidence: 87,
        estimatedFixTime: '2m'
      }
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    setIsLoading(true);
    // Simulate AI analysis of real Kubernetes errors
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsLoading(false);
    setQuery('');
  };

  const handleYamlChange = (value: string | undefined) => {
    if (!value) return;
    
    setYamlContent(value);
    try {
      const parsed = parse(value);
      k8sResourceSchema.parse(parsed);
      setYamlError(null);
    } catch (error) {
      setYamlError(error instanceof Error ? error.message : 'Invalid YAML');
    }
  };

  const handleCopyYaml = (yaml: string) => {
    navigator.clipboard.writeText(yaml);
  };

  const applyFix = async (yaml: string) => {
    setIsLoading(true);
    // Simulate applying the fix
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsLoading(false);
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'text-green-600 dark:text-green-400';
    if (confidence >= 75) return 'text-amber-600 dark:text-amber-400';
    return 'text-red-600 dark:text-red-400';
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 h-[600px] flex flex-col">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <div className="flex items-center">
          <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white mr-3">
            <Bot size={20} />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">AI Troubleshooter</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Real-time Kubernetes error analysis</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex items-center text-sm text-green-600 dark:text-green-400">
            <div className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></div>
            Analyzing logs
          </div>
          <button
            onClick={() => setShowYamlEditor(!showYamlEditor)}
            className="flex items-center px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            <Code size={16} className="mr-1" />
            {showYamlEditor ? 'Hide Editor' : 'YAML Editor'}
          </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900/50">
        {mockChat.map((message, index) => (
          <div 
            key={index} 
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[85%] rounded-lg px-4 py-3 ${
                message.role === 'user' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs opacity-75">
                  {new Date(message.timestamp).toLocaleTimeString()}
                </span>
                {message.role === 'assistant' && (
                  <div className="flex items-center">
                    <Brain size={14} className="text-blue-500 mr-1" />
                    <span className="text-xs text-blue-500">AI Analysis</span>
                  </div>
                )}
              </div>
              <p className="text-sm leading-relaxed">{message.content}</p>
              {message.suggestedFix && (
                <div className="mt-4 p-3 bg-gray-900 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <Zap size={14} className="text-yellow-400 mr-2" />
                      <span className="text-sm text-gray-300 font-medium">Auto-Remediation Available</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className={`text-xs font-medium ${getConfidenceColor(message.suggestedFix.confidence)}`}>
                        {message.suggestedFix.confidence}% confidence
                      </span>
                      <span className="text-xs text-gray-400">
                        Est. {message.suggestedFix.estimatedFixTime}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-300 font-medium">Suggested Fix</span>
                    <button
                      onClick={() => handleCopyYaml(message.suggestedFix.yaml)}
                      className="text-xs text-blue-400 hover:text-blue-300 flex items-center transition-colors"
                    >
                      <Copy size={12} className="mr-1" />
                      Copy YAML
                    </button>
                  </div>
                  <pre className="text-xs text-gray-300 overflow-x-auto whitespace-pre-wrap bg-gray-800 p-2 rounded border">
                    {message.suggestedFix.yaml}
                  </pre>
                  <div className="flex space-x-2 mt-3">
                    <button
                      onClick={() => applyFix(message.suggestedFix.yaml)}
                      className="text-xs bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-md transition-colors font-medium flex items-center"
                    >
                      <CheckCircle size={12} className="mr-1" />
                      Auto-Apply Fix
                    </button>
                    <button className="text-xs bg-gray-600 hover:bg-gray-700 text-white px-3 py-1.5 rounded-md transition-colors font-medium">
                      Review Changes
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-3 max-w-[85%]">
              <div className="flex items-center">
                <Loader2 size={16} className="animate-spin text-blue-500 mr-2" />
                <span className="text-sm text-gray-600 dark:text-gray-400">AI is analyzing your Kubernetes logs...</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {showYamlEditor && (
        <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-900/50">
          <div className="h-48 mb-4 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
            <Editor
              height="100%"
              defaultLanguage="yaml"
              value={yamlContent}
              onChange={handleYamlChange}
              theme="vs-dark"
              options={{
                minimap: { enabled: false },
                lineNumbers: 'on',
                scrollBeyondLastLine: false,
                wordWrap: 'on'
              }}
            />
          </div>
          {yamlError && (
            <div className="flex items-center text-red-500 text-sm mb-2">
              <AlertTriangle size={16} className="mr-1" />
              {yamlError}
            </div>
          )}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Describe your Kubernetes issue or paste error logs..."
            className="w-full px-4 py-3 pr-12 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button 
            type="submit" 
            className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
            disabled={isLoading}
          >
            {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
          </button>
        </div>
        <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          💡 Try: "Why are my pods crashing?" or paste Kubernetes error logs for instant AI analysis
        </div>
      </form>
    </div>
  );
};

export default TroubleshootingAI;