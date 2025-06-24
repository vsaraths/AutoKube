import React, { useState, useEffect } from 'react';
import { TrendingUp, AlertTriangle, Clock, Zap, Brain, Target, Activity, Shield } from 'lucide-react';
import { PredictiveFailureAnalyzer, FailurePrediction } from '../../api/predictive-failure-analysis';

const PredictiveAnalytics: React.FC = () => {
  const [predictions, setPredictions] = useState<FailurePrediction[]>([]);
  const [isForecasting, setIsForecasting] = useState(true);
  const [selectedCluster, setSelectedCluster] = useState('production');
  const [summary, setSummary] = useState<any>(null);

  useEffect(() => {
    const analyzer = PredictiveFailureAnalyzer.getInstance();
    
    const loadPredictions = async () => {
      try {
        const clusterPredictions = await analyzer.predictFailures(selectedCluster);
        setPredictions(clusterPredictions);
        
        const summaryData = analyzer.getPredictionSummary();
        setSummary(summaryData);
      } catch (error) {
        console.error('Failed to load predictions:', error);
      }
    };

    loadPredictions();
    
    // Set up real-time updates every 30 seconds
    const interval = setInterval(loadPredictions, 30000);
    return () => clearInterval(interval);
  }, [selectedCluster]);

  const getAlertLevelColor = (level: string) => {
    switch (level) {
      case 'critical':
        return 'text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800';
      case 'warning':
        return 'text-amber-600 bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800';
      default:
        return 'text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800';
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'critical':
        return 'text-red-600 dark:text-red-400';
      case 'high':
        return 'text-orange-600 dark:text-orange-400';
      case 'medium':
        return 'text-amber-600 dark:text-amber-400';
      default:
        return 'text-blue-600 dark:text-blue-400';
    }
  };

  const getRiskScoreColor = (score: number) => {
    if (score >= 90) return 'text-red-600 dark:text-red-400';
    if (score >= 70) return 'text-amber-600 dark:text-amber-400';
    return 'text-green-600 dark:text-green-400';
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-600 text-white mr-3">
              <TrendingUp size={20} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Predictive Analytics</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">AI-powered failure forecasting</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <select
              value={selectedCluster}
              onChange={(e) => setSelectedCluster(e.target.value)}
              className="px-3 py-1.5 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="production">Production</option>
              <option value="staging">Staging</option>
              <option value="development">Development</option>
            </select>
            <div className={`flex items-center px-3 py-1.5 text-sm rounded-lg ${
              isForecasting 
                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
            }`}>
              <Activity size={16} className="mr-1" />
              {isForecasting ? 'Live Forecasting' : 'Paused'}
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        {summary && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg p-4">
              <p className="text-sm text-purple-600 dark:text-purple-400 mb-1">Total Predictions</p>
              <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">{summary.totalPredictions}</p>
            </div>
            <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-lg p-4">
              <p className="text-sm text-red-600 dark:text-red-400 mb-1">Critical Alerts</p>
              <p className="text-2xl font-bold text-red-700 dark:text-red-300">{summary.criticalAlerts}</p>
            </div>
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-lg p-4">
              <p className="text-sm text-blue-600 dark:text-blue-400 mb-1">Avg Confidence</p>
              <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{summary.averageConfidence}%</p>
            </div>
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg p-4">
              <p className="text-sm text-green-600 dark:text-green-400 mb-1">Prevented Failures</p>
              <p className="text-2xl font-bold text-green-700 dark:text-green-300">{summary.preventedFailures}</p>
            </div>
            <div className="bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 rounded-lg p-4">
              <p className="text-sm text-amber-600 dark:text-amber-400 mb-1">Active Monitoring</p>
              <p className="text-2xl font-bold text-amber-700 dark:text-amber-300">24/7</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Failure Predictions */}
          <div>
            <h3 className="text-md font-medium text-gray-900 dark:text-white mb-4 flex items-center">
              <Brain size={18} className="mr-2 text-purple-600 dark:text-purple-400" />
              Failure Predictions
            </h3>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {predictions.map((prediction) => (
                <div 
                  key={prediction.predictionId}
                  className={`p-4 rounded-lg border-l-4 ${getAlertLevelColor(prediction.alertLevel)}`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center">
                      <AlertTriangle size={16} className="mr-2" />
                      <span className="font-medium text-gray-900 dark:text-white text-sm">
                        {prediction.failureType.replace(/_/g, ' ').toUpperCase()}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`text-xs font-medium ${getRiskScoreColor(prediction.riskScore)}`}>
                        {prediction.riskScore}% risk
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {prediction.confidence}% confidence
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center mb-3">
                    <Clock size={14} className="text-gray-500 mr-1" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Predicted in: <span className="font-medium text-gray-900 dark:text-white">{prediction.timeToFailure}</span>
                    </span>
                  </div>

                  <div className="mb-3">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Affected Resources:</p>
                    <div className="flex flex-wrap gap-1">
                      {prediction.affectedResources.map((resource, index) => (
                        <span key={index} className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded">
                          {resource.kind}/{resource.name}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    <p className="mb-1">Historical Pattern:</p>
                    <p className="italic">{prediction.historicalPatterns[0]}</p>
                  </div>
                </div>
              ))}
              
              {predictions.length === 0 && (
                <div className="text-center py-8">
                  <Shield size={32} className="mx-auto text-green-500 mb-2" />
                  <p className="text-sm text-gray-600 dark:text-gray-400">No immediate failure risks detected</p>
                  <p className="text-xs text-green-600 dark:text-green-400">All systems operating within normal parameters</p>
                </div>
              )}
            </div>
          </div>

          {/* Preventive Actions */}
          <div>
            <h3 className="text-md font-medium text-gray-900 dark:text-white mb-4 flex items-center">
              <Zap size={18} className="mr-2 text-blue-600 dark:text-blue-400" />
              Recommended Actions
            </h3>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {predictions.flatMap(prediction => 
                prediction.preventiveActions.map((action, index) => (
                  <div key={`${prediction.predictionId}-${index}`} className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900 dark:text-white text-sm">
                        {action.action.replace(/_/g, ' ').toUpperCase()}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        action.urgency === 'critical' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' :
                        action.urgency === 'high' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400' :
                        action.urgency === 'medium' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400' :
                        'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                      }`}>
                        {action.urgency}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{action.description}</p>
                    <p className="text-xs text-green-600 dark:text-green-400 mb-3">
                      Impact: {action.estimatedImpact}
                    </p>
                    <div className="flex space-x-2">
                      <button className="flex-1 px-3 py-1.5 text-xs bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                        Apply Now
                      </button>
                      <button className="flex-1 px-3 py-1.5 text-xs border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        Schedule
                      </button>
                    </div>
                  </div>
                ))
              )}
              
              {predictions.length === 0 && (
                <div className="text-center py-8">
                  <Target size={32} className="mx-auto text-blue-500 mb-2" />
                  <p className="text-sm text-gray-600 dark:text-gray-400">No immediate actions required</p>
                  <p className="text-xs text-blue-600 dark:text-blue-400">Continue monitoring for potential issues</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Live Monitoring Status */}
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Live monitoring active • Next prediction update in 4m 32s
              </span>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Analyzing {predictions.length} potential failure scenarios
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PredictiveAnalytics;