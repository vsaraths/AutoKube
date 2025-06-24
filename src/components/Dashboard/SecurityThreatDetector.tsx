import React, { useState, useEffect } from 'react';
import { Shield, AlertTriangle, CheckCircle, XCircle, Eye, Lock, Zap, TrendingUp } from 'lucide-react';

interface ThreatAlert {
  id: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  type: string;
  description: string;
  timestamp: string;
  status: 'active' | 'mitigated' | 'investigating';
  affectedResources: string[];
}

interface SecurityMetric {
  name: string;
  value: number;
  trend: 'up' | 'down' | 'stable';
  status: 'good' | 'warning' | 'critical';
}

const SecurityThreatDetector: React.FC = () => {
  const [threats, setThreats] = useState<ThreatAlert[]>([]);
  const [metrics, setMetrics] = useState<SecurityMetric[]>([]);
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    // Simulate real-time threat detection
    const mockThreats: ThreatAlert[] = [
      {
        id: '1',
        severity: 'critical',
        type: 'Privilege Escalation',
        description: 'Suspicious container attempting to access host filesystem',
        timestamp: '2 minutes ago',
        status: 'active',
        affectedResources: ['pod/suspicious-app-7d8f9', 'namespace/production']
      },
      {
        id: '2',
        severity: 'high',
        type: 'Network Anomaly',
        description: 'Unusual outbound traffic detected from cluster',
        timestamp: '5 minutes ago',
        status: 'investigating',
        affectedResources: ['service/api-gateway', 'ingress/main-ingress']
      },
      {
        id: '3',
        severity: 'medium',
        type: 'Configuration Drift',
        description: 'Security policy violation in deployment configuration',
        timestamp: '12 minutes ago',
        status: 'mitigated',
        affectedResources: ['deployment/web-app']
      }
    ];

    const mockMetrics: SecurityMetric[] = [
      { name: 'Security Score', value: 87, trend: 'up', status: 'good' },
      { name: 'Vulnerabilities', value: 3, trend: 'down', status: 'warning' },
      { name: 'Policy Violations', value: 1, trend: 'stable', status: 'good' },
      { name: 'Threat Level', value: 2, trend: 'down', status: 'warning' }
    ];

    setThreats(mockThreats);
    setMetrics(mockMetrics);
  }, []);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'investigating': return <Eye className="w-4 h-4 text-yellow-500" />;
      case 'mitigated': return <CheckCircle className="w-4 h-4 text-green-500" />;
      default: return <XCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'down': return <TrendingUp className="w-4 h-4 text-red-500 rotate-180" />;
      default: return <div className="w-4 h-4 bg-gray-400 rounded-full" />;
    }
  };

  const startScan = () => {
    setIsScanning(true);
    setTimeout(() => setIsScanning(false), 3000);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
            <Shield className="w-6 h-6 text-red-600 dark:text-red-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              AI Security Threat Detector
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Real-time threat detection and security monitoring
            </p>
          </div>
        </div>
        <button
          onClick={startScan}
          disabled={isScanning}
          className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white rounded-lg transition-colors"
        >
          <Zap className={`w-4 h-4 ${isScanning ? 'animate-spin' : ''}`} />
          <span>{isScanning ? 'Scanning...' : 'Deep Scan'}</span>
        </button>
      </div>

      {/* Security Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {metrics.map((metric, index) => (
          <div key={index} className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {metric.name}
              </span>
              {getTrendIcon(metric.trend)}
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                {metric.value}
              </span>
              <div className={`w-2 h-2 rounded-full ${
                metric.status === 'good' ? 'bg-green-500' :
                metric.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
              }`} />
            </div>
          </div>
        ))}
      </div>

      {/* Active Threats */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-md font-semibold text-gray-900 dark:text-white">
            Active Threats
          </h4>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {threats.filter(t => t.status === 'active').length} active
          </span>
        </div>

        <div className="space-y-3 max-h-64 overflow-y-auto">
          {threats.map((threat) => (
            <div
              key={threat.id}
              className={`border rounded-lg p-4 ${getSeverityColor(threat.severity)} dark:bg-gray-700/50 dark:border-gray-600`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-2">
                  {getStatusIcon(threat.status)}
                  <span className="font-semibold text-sm uppercase tracking-wide">
                    {threat.severity}
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {threat.timestamp}
                  </span>
                </div>
                <Lock className="w-4 h-4 text-gray-400" />
              </div>
              
              <h5 className="font-semibold text-gray-900 dark:text-white mb-1">
                {threat.type}
              </h5>
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                {threat.description}
              </p>
              
              <div className="flex flex-wrap gap-2">
                {threat.affectedResources.map((resource, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 bg-white dark:bg-gray-800 text-xs rounded-md border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300"
                  >
                    {resource}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Recommendations */}
      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <div className="flex items-start space-x-3">
          <div className="p-1 bg-blue-100 dark:bg-blue-900/40 rounded">
            <Shield className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h5 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">
              AI Security Recommendations
            </h5>
            <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
              <li>• Enable Pod Security Standards for production namespace</li>
              <li>• Implement network policies to restrict inter-pod communication</li>
              <li>• Update container images to patch known vulnerabilities</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityThreatDetector;