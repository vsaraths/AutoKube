import React, { useState } from 'react';
import { Package, GitBranch, CheckCircle, AlertTriangle, RefreshCw } from 'lucide-react';

interface HelmRelease {
  name: string;
  namespace: string;
  revision: number;
  status: 'deployed' | 'failed' | 'pending-install' | 'pending-upgrade';
  chart: string;
  appVersion: string;
  updated: string;
  aiRecommendations?: string[];
}

const HelmIntegration: React.FC = () => {
  const [releases] = useState<HelmRelease[]>([
    {
      name: 'autokube',
      namespace: 'default',
      revision: 1,
      status: 'deployed',
      chart: 'autokube-0.1.0',
      appVersion: '1.0.0',
      updated: '2025-01-15 10:30:15',
      aiRecommendations: [
        'Consider enabling auto-scaling for better resource utilization',
        'Update to latest chart version for security patches'
      ]
    },
    {
      name: 'nginx-ingress',
      namespace: 'ingress-nginx',
      revision: 3,
      status: 'deployed',
      chart: 'ingress-nginx-4.8.3',
      appVersion: '1.9.4',
      updated: '2025-01-14 15:22:10',
      aiRecommendations: [
        'SSL certificate expires in 30 days - consider auto-renewal',
        'High traffic detected - scale up replicas'
      ]
    },
    {
      name: 'prometheus',
      namespace: 'monitoring',
      revision: 2,
      status: 'failed',
      chart: 'prometheus-25.8.0',
      appVersion: '2.48.0',
      updated: '2025-01-15 09:15:30',
      aiRecommendations: [
        'Storage volume full - increase PVC size',
        'Memory limits too low for current workload'
      ]
    }
  ]);

  const [selectedRelease, setSelectedRelease] = useState<HelmRelease | null>(null);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'deployed':
        return <CheckCircle size={16} className="text-green-500" />;
      case 'failed':
        return <AlertTriangle size={16} className="text-red-500" />;
      case 'pending-install':
      case 'pending-upgrade':
        return <RefreshCw size={16} className="text-yellow-500 animate-spin" />;
      default:
        return <AlertTriangle size={16} className="text-gray-500" />;
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'deployed':
        return 'bg-gradient-to-r from-green-100 to-green-200 text-green-800 dark:from-green-900/30 dark:to-green-800/30 dark:text-green-400';
      case 'failed':
        return 'bg-gradient-to-r from-red-100 to-red-200 text-red-800 dark:from-red-900/30 dark:to-red-800/30 dark:text-red-400';
      case 'pending-install':
      case 'pending-upgrade':
        return 'bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 dark:from-yellow-900/30 dark:to-yellow-800/30 dark:text-yellow-400';
      default:
        return 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 dark:from-gray-800 dark:to-gray-700 dark:text-gray-400';
    }
  };

  const installCommand = `# Install AutoKube using Helm
helm repo add autokube https://charts.autokube.io
helm repo update
helm install autokube autokube/autokube \\
  --namespace autokube \\
  --create-namespace \\
  --set ai.autoRemediation=true \\
  --set monitoring.enabled=true`;

  return (
    <div className="bg-gradient-to-br from-white via-blue-50 to-violet-50 dark:from-gray-900 dark:via-blue-950 dark:to-violet-950 rounded-lg shadow-lg border border-blue-200 dark:border-blue-800">
      <div className="p-5">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center">
            <Package size={20} className="text-violet-600 dark:text-violet-400 mr-2" />
            <h2 className="text-lg font-medium bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">Helm Integration</h2>
          </div>
          <div className="flex items-center space-x-2">
            <GitBranch size={16} className="text-blue-500" />
            <span className="text-sm text-blue-600 dark:text-blue-400">GitOps Ready</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h3 className="text-md font-medium text-blue-800 dark:text-blue-200 mb-3">Helm Releases</h3>
            <div className="space-y-3">
              {releases.map((release) => (
                <div 
                  key={`${release.name}-${release.namespace}`}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    selectedRelease?.name === release.name 
                      ? 'border-violet-500 bg-gradient-to-r from-violet-50 to-blue-100 dark:from-violet-900/20 dark:to-blue-900/20' 
                      : 'border-blue-200 dark:border-blue-700 hover:border-violet-300 dark:hover:border-violet-600 bg-gradient-to-r from-white to-blue-50 dark:from-gray-800/50 dark:to-blue-900/50'
                  }`}
                  onClick={() => setSelectedRelease(release)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      {getStatusIcon(release.status)}
                      <span className="ml-2 font-medium text-blue-900 dark:text-blue-100">{release.name}</span>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusClass(release.status)}`}>
                      {release.status}
                    </span>
                  </div>
                  <div className="text-sm text-blue-700 dark:text-blue-300">
                    <p>Namespace: {release.namespace}</p>
                    <p>Chart: {release.chart}</p>
                    <p>Revision: {release.revision}</p>
                  </div>
                  {release.aiRecommendations && release.aiRecommendations.length > 0 && (
                    <div className="mt-2">
                      <span className="inline-flex items-center px-2 py-1 text-xs bg-gradient-to-r from-violet-100 to-violet-200 text-violet-800 dark:from-violet-900/30 dark:to-violet-800/30 dark:text-violet-400 rounded">
                        {release.aiRecommendations.length} AI Recommendations
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div>
            {selectedRelease ? (
              <div>
                <h3 className="text-md font-medium text-blue-800 dark:text-blue-200 mb-3">
                  Release Details: {selectedRelease.name}
                </h3>
                <div className="bg-gradient-to-r from-blue-50 to-violet-50 dark:from-blue-900/20 dark:to-violet-900/20 rounded-lg p-4 mb-4 border border-blue-200 dark:border-blue-800">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-blue-600 dark:text-blue-400">Status:</span>
                      <div className="flex items-center mt-1">
                        {getStatusIcon(selectedRelease.status)}
                        <span className="ml-2 text-blue-900 dark:text-blue-100">{selectedRelease.status}</span>
                      </div>
                    </div>
                    <div>
                      <span className="text-blue-600 dark:text-blue-400">App Version:</span>
                      <p className="text-blue-900 dark:text-blue-100">{selectedRelease.appVersion}</p>
                    </div>
                    <div>
                      <span className="text-blue-600 dark:text-blue-400">Revision:</span>
                      <p className="text-blue-900 dark:text-blue-100">{selectedRelease.revision}</p>
                    </div>
                    <div>
                      <span className="text-blue-600 dark:text-blue-400">Updated:</span>
                      <p className="text-blue-900 dark:text-blue-100">{selectedRelease.updated}</p>
                    </div>
                  </div>
                </div>

                {selectedRelease.aiRecommendations && selectedRelease.aiRecommendations.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">AI Recommendations</h4>
                    <div className="space-y-2">
                      {selectedRelease.aiRecommendations.map((recommendation, index) => (
                        <div key={index} className="flex items-start p-3 bg-gradient-to-r from-violet-50 to-blue-50 dark:from-violet-900/20 dark:to-blue-900/20 rounded-lg border border-violet-200 dark:border-violet-800">
                          <div className="w-2 h-2 rounded-full bg-gradient-to-r from-violet-500 to-blue-500 mt-2 mr-3 flex-shrink-0"></div>
                          <p className="text-sm text-blue-700 dark:text-blue-300">{recommendation}</p>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 flex space-x-2">
                      <button className="px-3 py-1 text-xs bg-gradient-to-r from-violet-600 to-blue-600 text-white rounded hover:from-violet-700 hover:to-blue-700 transition-all">
                        Apply All
                      </button>
                      <button className="px-3 py-1 text-xs border border-violet-600 text-violet-600 rounded hover:bg-gradient-to-r hover:from-violet-50 hover:to-blue-50 dark:hover:from-violet-900/20 dark:hover:to-blue-900/20 transition-all">
                        Review Changes
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <h3 className="text-md font-medium text-blue-800 dark:text-blue-200 mb-3">Installation</h3>
                <div className="bg-gray-900 rounded-lg p-4">
                  <pre className="text-sm text-gray-300 overflow-x-auto">
                    {installCommand}
                  </pre>
                </div>
                <div className="mt-4 text-sm text-blue-700 dark:text-blue-300">
                  <p>Select a Helm release to view AI-powered recommendations and optimization suggestions.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelmIntegration;