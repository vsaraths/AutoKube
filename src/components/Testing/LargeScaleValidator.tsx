import React, { useState, useEffect } from 'react';
import { Activity, Zap, TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Clock, Target, BarChart3, Gauge } from 'lucide-react';
import { LargeScaleRemediationValidator, HighTrafficTest, PerformanceMonitoring } from '../../api/large-scale-remediation-validator';

const LargeScaleValidator: React.FC = () => {
  const [activeTest, setActiveTest] = useState<HighTrafficTest | null>(null);
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMonitoring | null>(null);
  const [reliabilityData, setReliabilityData] = useState<any>(null);
  const [stressTestReport, setStressTestReport] = useState<any>(null);
  const [isRunningTest, setIsRunningTest] = useState(false);
  const [selectedTrafficLevel, setSelectedTrafficLevel] = useState<'low' | 'medium' | 'high' | 'extreme'>('medium');
  const [workloadCount, setWorkloadCount] = useState(25);

  useEffect(() => {
    const validator = LargeScaleRemediationValidator.getInstance();
    
    const loadInitialData = async () => {
      try {
        const metrics = await validator.monitorPerformanceMetrics('medium-cluster');
        setPerformanceMetrics(metrics);
        
        const report = validator.generateStressTestReport();
        setStressTestReport(report);
      } catch (error) {
        console.error('Failed to load initial data:', error);
      }
    };

    loadInitialData();
  }, []);

  const runStressTest = async () => {
    setIsRunningTest(true);
    const validator = LargeScaleRemediationValidator.getInstance();
    
    try {
      // Simulate test execution phases
      const phases = [
        'Deploying test workloads...',
        'Triggering failure scenarios...',
        'AI analyzing failures...',
        'Executing remediation fixes...',
        'Measuring performance metrics...',
        'Validating fix accuracy...'
      ];

      for (const phase of phases) {
        console.log(phase);
        await new Promise(resolve => setTimeout(resolve, 1500));
      }

      const testResult = await validator.simulateHighTrafficFailures(workloadCount, selectedTrafficLevel);
      setActiveTest(testResult);
      
      const updatedReport = validator.generateStressTestReport();
      setStressTestReport(updatedReport);
      
    } catch (error) {
      console.error('Stress test failed:', error);
    } finally {
      setIsRunningTest(false);
    }
  };

  const runReliabilityTest = async () => {
    const validator = LargeScaleRemediationValidator.getInstance();
    
    try {
      const reliabilityResult = await validator.validateReliabilityOverTime(10, 'pod_crash_loop');
      setReliabilityData(reliabilityResult);
    } catch (error) {
      console.error('Reliability test failed:', error);
    }
  };

  const getTrafficLevelColor = (level: string) => {
    switch (level) {
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'medium':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'high':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400';
      case 'extreme':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400';
    }
  };

  const getPerformanceColor = (score: number) => {
    if (score >= 90) return 'text-green-600 dark:text-green-400';
    if (score >= 80) return 'text-blue-600 dark:text-blue-400';
    if (score >= 70) return 'text-amber-600 dark:text-amber-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving':
        return <TrendingUp size={16} className="text-green-500" />;
      case 'declining':
        return <TrendingDown size={16} className="text-red-500" />;
      default:
        return <Activity size={16} className="text-blue-500" />;
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-red-600 text-white mr-3">
              <Gauge size={20} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Large-Scale Remediation Validator</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">AI performance validation under high-traffic conditions</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <select
              value={selectedTrafficLevel}
              onChange={(e) => setSelectedTrafficLevel(e.target.value as any)}
              className="px-3 py-1.5 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="low">Low Traffic</option>
              <option value="medium">Medium Traffic</option>
              <option value="high">High Traffic</option>
              <option value="extreme">Extreme Traffic</option>
            </select>
            <input
              type="number"
              value={workloadCount}
              onChange={(e) => setWorkloadCount(parseInt(e.target.value))}
              min="10"
              max="100"
              className="w-20 px-2 py-1.5 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
            <button
              onClick={runStressTest}
              disabled={isRunningTest}
              className="flex items-center px-3 py-1.5 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors"
            >
              {isRunningTest ? (
                <>
                  <Clock size={16} className="mr-1 animate-spin" />
                  Testing...
                </>
              ) : (
                <>
                  <Zap size={16} className="mr-1" />
                  Run Stress Test
                </>
              )}
            </button>
          </div>
        </div>

        {/* Performance Overview */}
        {performanceMetrics && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-lg p-4">
              <p className="text-sm text-blue-600 dark:text-blue-400 mb-1">AI Latency</p>
              <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{performanceMetrics.metrics.aiLatency}ms</p>
            </div>
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg p-4">
              <p className="text-sm text-green-600 dark:text-green-400 mb-1">Fixes/Min</p>
              <p className="text-2xl font-bold text-green-700 dark:text-green-300">{performanceMetrics.throughput.fixesAppliedPerMinute}</p>
            </div>
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg p-4">
              <p className="text-sm text-purple-600 dark:text-purple-400 mb-1">Concurrent Capacity</p>
              <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">{performanceMetrics.throughput.concurrentFixCapacity}</p>
            </div>
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-lg p-4">
              <p className="text-sm text-amber-600 dark:text-amber-400 mb-1">Resource Overhead</p>
              <p className="text-2xl font-bold text-amber-700 dark:text-amber-300">{performanceMetrics.metrics.resourceOverhead}%</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Stress Test Results */}
          <div>
            <h3 className="text-md font-medium text-gray-900 dark:text-white mb-4 flex items-center">
              <Target size={18} className="mr-2 text-purple-600 dark:text-purple-400" />
              Stress Test Results
            </h3>
            
            {activeTest ? (
              <div className="space-y-4">
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-gray-900 dark:text-white">{activeTest.scenario.name}</h4>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${getTrafficLevelColor(activeTest.scenario.trafficLevel)}`}>
                      {activeTest.scenario.trafficLevel.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{activeTest.scenario.description}</p>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Workloads:</span>
                      <span className="ml-1 font-medium text-gray-900 dark:text-white">{activeTest.scenario.workloadCount}</span>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Response Time:</span>
                      <span className="ml-1 font-medium text-gray-900 dark:text-white">{activeTest.aiPerformance.responseTime}ms</span>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Success Rate:</span>
                      <span className={`ml-1 font-medium ${getPerformanceColor((activeTest.remediationResults.successfulFixes / activeTest.remediationResults.totalFixes) * 100)}`}>
                        {Math.round((activeTest.remediationResults.successfulFixes / activeTest.remediationResults.totalFixes) * 100)}%
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Accuracy:</span>
                      <span className={`ml-1 font-medium ${getPerformanceColor(activeTest.reliabilityMetrics.accuracyRate)}`}>
                        {activeTest.reliabilityMetrics.accuracyRate}%
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                  <h4 className="text-sm font-medium text-blue-800 dark:text-blue-400 mb-2">AI Performance Metrics</h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-blue-600 dark:text-blue-400">Fix Speed:</span>
                      <span className="ml-1 font-medium text-blue-700 dark:text-blue-300">{activeTest.aiPerformance.fixExecutionSpeed}/min</span>
                    </div>
                    <div>
                      <span className="text-blue-600 dark:text-blue-400">Prioritization:</span>
                      <span className="ml-1 font-medium text-blue-700 dark:text-blue-300">{activeTest.aiPerformance.prioritizationAccuracy}%</span>
                    </div>
                    <div>
                      <span className="text-blue-600 dark:text-blue-400">Resource Usage:</span>
                      <span className="ml-1 font-medium text-blue-700 dark:text-blue-300">{activeTest.aiPerformance.resourceUtilization}%</span>
                    </div>
                    <div>
                      <span className="text-blue-600 dark:text-blue-400">Consistency:</span>
                      <span className="ml-1 font-medium text-blue-700 dark:text-blue-300">{activeTest.reliabilityMetrics.consistencyScore}%</span>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
                  <h4 className="text-sm font-medium text-green-800 dark:text-green-400 mb-2">Remediation Results</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-green-600 dark:text-green-400">Total Fixes Applied:</span>
                      <span className="font-medium text-green-700 dark:text-green-300">{activeTest.remediationResults.totalFixes}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-green-600 dark:text-green-400">Successful Fixes:</span>
                      <span className="font-medium text-green-700 dark:text-green-300">{activeTest.remediationResults.successfulFixes}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-green-600 dark:text-green-400">Critical Issues Resolved:</span>
                      <span className="font-medium text-green-700 dark:text-green-300">{activeTest.remediationResults.criticalIssuesResolved}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-green-600 dark:text-green-400">Average Fix Time:</span>
                      <span className="font-medium text-green-700 dark:text-green-300">{activeTest.remediationResults.averageFixTime}ms</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                  <Gauge size={24} className="text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Run Stress Test</h3>
                <p className="text-gray-500 dark:text-gray-400">Configure test parameters and run a high-traffic stress test to validate AI performance</p>
              </div>
            )}
          </div>

          {/* Reliability Analysis */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-md font-medium text-gray-900 dark:text-white flex items-center">
                <BarChart3 size={18} className="mr-2 text-blue-600 dark:text-blue-400" />
                Reliability Analysis
              </h3>
              <button
                onClick={runReliabilityTest}
                className="px-3 py-1.5 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Run Reliability Test
              </button>
            </div>

            {reliabilityData ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3">
                    <p className="text-sm text-purple-600 dark:text-purple-400 mb-1">Overall Reliability</p>
                    <p className={`text-xl font-bold ${getPerformanceColor(reliabilityData.overallReliability)}`}>
                      {reliabilityData.overallReliability}%
                    </p>
                  </div>
                  <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3">
                    <p className="text-sm text-green-600 dark:text-green-400 mb-1">Improvement Trend</p>
                    <p className="text-xl font-bold text-green-700 dark:text-green-300">
                      +{reliabilityData.improvementTrend}%
                    </p>
                  </div>
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
                    <p className="text-sm text-blue-600 dark:text-blue-400 mb-1">Consistency Score</p>
                    <p className={`text-xl font-bold ${getPerformanceColor(reliabilityData.consistencyScore)}`}>
                      {reliabilityData.consistencyScore}%
                    </p>
                  </div>
                  <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-3">
                    <p className="text-sm text-amber-600 dark:text-amber-400 mb-1">Learning Effectiveness</p>
                    <p className="text-xl font-bold text-amber-700 dark:text-amber-300">
                      {reliabilityData.learningEffectiveness}%
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Test Cycle Results</h4>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {reliabilityData.testResults.map((result: any, index: number) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Cycle {result.cycle}:</span>
                        <div className="flex items-center space-x-3">
                          <span className={`font-medium ${getPerformanceColor(result.accuracy)}`}>
                            {result.accuracy}% accuracy
                          </span>
                          <span className="text-gray-500 dark:text-gray-400">
                            {result.responseTime}ms
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                  <BarChart3 size={24} className="text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Reliability Testing</h3>
                <p className="text-gray-500 dark:text-gray-400">Run repeated failure simulations to validate AI fix reliability and learning effectiveness</p>
              </div>
            )}
          </div>
        </div>

        {/* Stress Test Report Summary */}
        {stressTestReport && (
          <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-md font-medium text-gray-900 dark:text-white mb-4">Overall Performance Report</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stressTestReport.summary.totalTests}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Tests</p>
              </div>
              <div className="text-center">
                <p className={`text-2xl font-bold ${getPerformanceColor(stressTestReport.summary.averagePerformance)}`}>
                  {stressTestReport.summary.averagePerformance}%
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Avg Performance</p>
              </div>
              <div className="text-center">
                <p className={`text-2xl font-bold ${getPerformanceColor(stressTestReport.summary.reliabilityScore)}`}>
                  {stressTestReport.summary.reliabilityScore}%
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Reliability Score</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {stressTestReport.summary.scalabilityRating}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Scalability Rating</p>
              </div>
            </div>

            {stressTestReport.recommendations.length > 0 && (
              <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4 border border-amber-200 dark:border-amber-800">
                <h4 className="text-sm font-medium text-amber-800 dark:text-amber-400 mb-2 flex items-center">
                  <AlertTriangle size={16} className="mr-1" />
                  Recommendations
                </h4>
                <ul className="text-sm text-amber-700 dark:text-amber-300 space-y-1">
                  {stressTestReport.recommendations.map((rec: string, index: number) => (
                    <li key={index} className="flex items-start">
                      <span className="w-1 h-1 rounded-full bg-amber-500 mt-2 mr-2 flex-shrink-0"></span>
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default LargeScaleValidator;