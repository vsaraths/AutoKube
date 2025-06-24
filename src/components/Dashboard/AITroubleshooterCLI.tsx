import React, { useState, useRef, useEffect } from 'react';
import { Terminal, Play, Copy, Download } from 'lucide-react';

interface Command {
  command: string;
  output: string;
  timestamp: Date;
  type: 'success' | 'error' | 'info';
}

const AutoKubeCLI: React.FC = () => {
  const [commands, setCommands] = useState<Command[]>([
    {
      command: 'kubectl autokube status',
      output: `Status: Running
Version: 1.0.0
Uptime: 2h 15m
AI Enabled: true
Auto Remediation: true`,
      timestamp: new Date(),
      type: 'success'
    }
  ]);
  const [currentCommand, setCurrentCommand] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);
  const terminalRef = useRef<HTMLDivElement>(null);

  const sampleCommands = [
    'kubectl autokube detect production',
    'kubectl autokube fix --auto --namespace=staging',
    'kubectl autokube logs -f --lines=50',
    'kubectl autokube status'
  ];

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [commands]);

  const executeCommand = async (cmd: string) => {
    setIsExecuting(true);
    
    // Simulate command execution
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    let output = '';
    let type: 'success' | 'error' | 'info' = 'success';
    
    if (cmd.includes('detect')) {
      output = `Detecting issues in namespace: production
❌ HIGH: Pod CrashLoopBackOff - Pod web-service-abc123 is failing to start
❌ MEDIUM: High CPU usage - Deployment payment-service using 95% CPU
❌ LOW: Image pull warning - Slow image pull for auth-service
Found 3 issues in namespace 'production'`;
    } else if (cmd.includes('fix')) {
      output = `Fixing issues in namespace: staging (auto: true)
✅ restart_pod: Restarted pod web-service-abc123
✅ scale_deployment: Scaled payment-service to 3 replicas
✅ update_image: Updated auth-service image tag
Applied 3 fixes in namespace 'staging'`;
    } else if (cmd.includes('logs')) {
      output = `2025-01-15T10:30:15Z INFO AutoKube started
2025-01-15T10:30:16Z INFO Watching for Kubernetes events
2025-01-15T10:31:22Z WARN Detected pod failure in production namespace
2025-01-15T10:31:23Z INFO AI analysis: CrashLoopBackOff due to memory limits
2025-01-15T10:31:24Z INFO Suggested fix: Increase memory allocation`;
    } else if (cmd.includes('status')) {
      output = `Status: Running
Version: 1.0.0
Uptime: 2h 15m
AI Enabled: true
Auto Remediation: true
Active Watchers: 5
Issues Detected: 12
Fixes Applied: 8`;
    } else {
      output = `Error: Unknown command '${cmd}'
Use 'kubectl autokube help' for usage information`;
      type = 'error';
    }
    
    const newCommand: Command = {
      command: cmd,
      output,
      timestamp: new Date(),
      type
    };
    
    setCommands(prev => [...prev, newCommand]);
    setCurrentCommand('');
    setIsExecuting(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentCommand.trim() && !isExecuting) {
      executeCommand(currentCommand.trim());
    }
  };

  const copyCommand = (command: string) => {
    navigator.clipboard.writeText(command);
  };

  const downloadCLI = () => {
    const cliContent = `#!/bin/bash
# kubectl-autokube CLI tool
# Download and install instructions available at:
# https://github.com/your-org/autokube/releases
`;
    const blob = new Blob([cliContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'kubectl-autokube';
    a.click();
    URL.revokeObjectURL(url);
  };

  const getOutputColor = (type: string) => {
    switch (type) {
      case 'error':
        return 'text-red-400';
      case 'success':
        return 'text-green-400';
      default:
        return 'text-gray-300';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800">
      <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
        <div className="flex items-center">
          <Terminal size={20} className="text-blue-600 dark:text-blue-400 mr-2" />
          <h2 className="text-lg font-medium text-gray-800 dark:text-white">AutoKube CLI</h2>
        </div>
        <button
          onClick={downloadCLI}
          className="flex items-center px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <Download size={16} className="mr-1" />
          Download CLI
        </button>
      </div>
      
      <div className="p-4">
        <div className="mb-4">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Quick Commands</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {sampleCommands.map((cmd, index) => (
              <button
                key={index}
                onClick={() => setCurrentCommand(cmd)}
                className="flex items-center justify-between p-2 text-xs bg-gray-100 dark:bg-gray-800 rounded border hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                <code className="text-gray-700 dark:text-gray-300">{cmd}</code>
                <Copy 
                  size={14} 
                  className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    copyCommand(cmd);
                  }}
                />
              </button>
            ))}
          </div>
        </div>
        
        <div 
          ref={terminalRef}
          className="bg-black rounded-lg p-4 h-64 overflow-y-auto font-mono text-sm"
        >
          {commands.map((cmd, index) => (
            <div key={index} className="mb-3">
              <div className="text-green-400">
                $ {cmd.command}
              </div>
              <pre className={`mt-1 whitespace-pre-wrap ${getOutputColor(cmd.type)}`}>
                {cmd.output}
              </pre>
            </div>
          ))}
          {isExecuting && (
            <div className="text-yellow-400">
              $ {currentCommand}
              <span className="animate-pulse">█</span>
            </div>
          )}
        </div>
        
        <form onSubmit={handleSubmit} className="mt-4">
          <div className="flex">
            <div className="flex-1 relative">
              <input
                type="text"
                value={currentCommand}
                onChange={(e) => setCurrentCommand(e.target.value)}
                placeholder="kubectl autokube ..."
                className="w-full px-4 py-2 pr-10 border border-gray-300 dark:border-gray-700 rounded-l-md bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                disabled={isExecuting}
              />
            </div>
            <button 
              type="submit" 
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-r-md transition-colors disabled:opacity-50"
              disabled={isExecuting || !currentCommand.trim()}
            >
              <Play size={16} />
            </button>
          </div>
        </form>
        
        <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
          <p>💡 Install the CLI: <code>curl -L https://github.com/your-org/autokube/releases/latest/download/kubectl-autokube -o kubectl-autokube</code></p>
          <p>📖 Documentation: <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline">https://docs.autokube.io</a></p>
        </div>
      </div>
    </div>
  );
};

export default AutoKubeCLI;