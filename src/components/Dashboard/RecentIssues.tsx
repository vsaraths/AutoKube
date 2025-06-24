import React from 'react';
import { AlertCircle, ArrowRight, Clock, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

const RecentIssues: React.FC = () => {
  const issues = [
    {
      id: 'ISSUE-3421',
      title: 'CoreDNS resolution failures in production',
      severity: 'high',
      timestamp: '10 minutes ago',
      cluster: 'Production',
      aiAnalysis: 'DNS cache poisoning detected. Auto-remediation applied.',
      status: 'resolved',
      type: 'network'
    },
    {
      id: 'ISSUE-3420',
      title: 'Persistent volume claim pending in staging',
      severity: 'medium',
      timestamp: '1 hour ago',
      cluster: 'Staging',
      aiAnalysis: 'Storage class misconfiguration. Manual action required.',
      status: 'pending',
      type: 'storage'
    },
    {
      id: 'ISSUE-3419',
      title: 'Deployment failed due to image pull error',
      severity: 'medium',
      timestamp: '3 hours ago',
      cluster: 'Development',
      aiAnalysis: 'Invalid image tag in deployment spec. Auto-remediation available.',
      status: 'pending',
      type: 'deployment'
    },
    {
      id: 'ISSUE-3418',
      title: 'High memory usage on worker nodes',
      severity: 'low',
      timestamp: '6 hours ago',
      cluster: 'Production',
      aiAnalysis: 'Memory optimization recommendations generated.',
      status: 'in_progress',
      type: 'resource'
    }
  ];

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">Critical</span>;
      case 'high':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400">High</span>;
      case 'medium':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">Medium</span>;
      default:
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">Low</span>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'resolved':
        return <CheckCircle size={16} className="text-green-500" />;
      case 'in_progress':
        return <AlertTriangle size={16} className="text-blue-500" />;
      default:
        return <XCircle size={16} className="text-gray-500" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'network':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'storage':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
      case 'deployment':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'resource':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Issues</h2>
          <a href="#" className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 flex items-center font-medium">
            View all <ArrowRight size={16} className="ml-1" />
          </a>
        </div>
        
        <div className="space-y-4">
          {issues.map((issue) => (
            <div key={issue.id} className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start">
                  <AlertCircle size={18} className="text-gray-400 mt-0.5 mr-3 flex-shrink-0" />
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 dark:text-white mb-2">{issue.title}</h3>
                    <div className="flex items-center space-x-3 mb-2">
                      {getSeverityBadge(issue.severity)}
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${getTypeColor(issue.type)}`}>
                        {issue.type}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                        <Clock size={12} className="mr-1" />
                        {issue.timestamp}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {issue.cluster}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center">
                  {getStatusIcon(issue.status)}
                </div>
              </div>
              <div className="ml-9">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 italic">{issue.aiAnalysis}</p>
                <div className="flex space-x-2">
                  <button className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md transition-colors font-medium">
                    View Details
                  </button>
                  {issue.status !== 'resolved' && (
                    <button className="text-xs bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-md transition-colors font-medium">
                      Apply Fix
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecentIssues;