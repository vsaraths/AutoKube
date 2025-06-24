import React, { useState, useEffect } from 'react';
import { Play, Clock, CheckCircle, AlertTriangle, XCircle, Zap, Target, BarChart3, TrendingUp, Activity, Gauge } from 'lucide-react';
import { AIDeploymentScenarioValidator, DeploymentScenario, CICDPerformanceTest, RealWorldValidation } from '../../api/ai-deployment-scenario-validator';

const DeploymentScenarioValidator: React.FC = () => {
  const [testScenarios, setTestScenarios] = useState<DeploymentScenario[]>([]);
  const [testResults, setTestResults] = useState<CICDPerformanceTest[]>([]);
  const [validationHistory, setValidationHistory] = useState<RealWorldValidation[]>([]);
  const [selectedScenario, setSelectedScenario] = useState<DeploymentScenario | null>(null);
  const [isRunningTest, setIsRunningTest] = useState(false);
  const [isRunningValidation, setIsRunningValidation] = useState(false);
  const [validationReport, setValidationReport] = useState<any>(null);
  const [activeTestId, setActiveTestId] = useState<string | null>(null);

  useEffect(() => {
    const validator = AIDeploymentScenarioValidator.getInstance();
    
    const loadData = async () => {
      try {
        const scenarios = await validator.getTestScenarios();
        setTestScenarios(scenarios);
        
        const results = await validator.getTestResults();
        setTestResults(results);
        
        const history = await validator.getValidationHistory();
        setValidationHistory(history);
        
        const report = validator.generateValidationReport();
        setValidationReport(report);
      } catch (error) {
        console.error('Failed to load validation data:', error);
      }
    };

    loadData();
  }, []);

  const runScenarioTest = async (scenarioId: string) => {
    setIsRunningTest(true);
    setActiveTestId(scenarioId);
    const validator = AIDeploymentScenarioValidator.getInstance();
    
    try {
      const result = await validator.executeDeploymentScenario(scenarioId);
      setTestResults(prev => [result, ...prev]);
      
      // Update validation report
      const report = validator.generateValidationReport();
      setValidationReport(report);
    } catch (error) {
      console.error('Scenario test failed:', error);
    } finally {
      setIsRunningTest(false);
      setActiveTestId(null);
    }
  };

  const runFullValidation = async () => {
    setIsRunningValidation(true);
    const validator = AIDeploymentScenarioValidator.getInstance();
    
    try {
      const validation = await validator.executeRealWorldValidation('Comprehensive Production Readiness Test');
      setValidationHistory(prev => [validation, ...prev]);
      
      // Update test results with new scenario results
      setTestResults(prev => [...validation.scenarios, ...prev]);
      
      // Update validation report
      const report = validator.generateValidationReport();
      setValidationReport(report);
    } catch (error) {
      console.error('Full validation failed:', error);
    } finally {
      setIsRunningValidation(false);
    }
  };

  const getEnvironmentColor = (environment: string) => {
    switch (environment) {
      case 'production':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      case 'staging':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400';
      case 'development':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400';
    }
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'enterprise':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
      case 'complex':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      case 'moderate':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400';
      case 'simple':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400';
    }
  };

  const getStabilityIcon = (stability: string) => {
    switch (stability) {
      case 'stable':
        return <CheckCircle size={16} className="text-green-500" />;
      case 'degraded':
        return <AlertTriangle size={16} className="text-amber-500" />;
      case 'unstable':
        return <XCircle size={16} className="text-red-500" />;
      case 'failed':
        return <XCircle size={16} className="text-red-600" />;
      default:
        return <Clock size={16} className="text-gray-500" />;
    }
  };

  const getPerformanceColor = (score: number) => {
    if (score >= 90) return 'text-green-600 dark:text-green-400';
    if (score >= 80) return 'text-blue-600 dark:text-blue-400';
    if (score >= 70) return 'text-amber-600 dark:text-amber-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      case 'high':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400';
      case 'medium':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400';
      case 'low':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="p-2 rounded-lg bg-gradient-to-r from-red-500 to-purple-600 text-white mr-3">
              <Target size={20} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">AI Deployment Scenario Validator</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Real-world deployment testing with fault injection and performance validation</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={runFullValidation}
              disabled={isRunningValidation}
              className="flex items-center px-3 py-1.5 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors"
            >
              {isRunningValidation ? (
                <>
                  <Clock size={16} className="mr-1 animate-spin" />
                  Running Validation...
                </>
              ) : (
                <>
                  <Zap size={16} className="mr-1" />
                  Run Full Validation
                </>
              )}
            </button>
          </div>
        </div>

        {/* Validation Summary */}
        {validationReport && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg p-4">
              <p className="text-sm text-purple-600 dark:text-purple-400 mb-1">Total Validations</p>
              <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">{validationReport.summary.totalValidations}</p>
            </div>
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-lg p-4">
              <p className="text-sm text-blue-600 dark:text-blue-400 mb-1">Production Readiness</p>
              <p className={`text-2xl font-bold ${getPerformanceColor(validationReport.summary.averageProductionReadiness)}`}>
                {validationReport.summary.averageProductionReadiness}%
              </p>
            </div>
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg p-4">
              <p className="text-sm text-green-600 dark:text-green-400 mb-1">System Reliability</p>
              <p className={`text-2xl font-bold ${getPerformanceColor(validationReport.summary.averageSystemReliability)}`}>
                {validationReport.summary.averageSystemReliability}%
              </p>
            </div>
            <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-lg p-4">
              <p className="text-sm text-red-600 dark:text-red-400 mb-1">Critical Issues</p>
              <p className="text-2xl font-bold text-red-700 dark:text-red-300">{validationReport.summary.criticalIssuesFound}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Test Scenarios */}
          <div>
            <h3 className="text-md font-medium text-gray-900 dark:text-white mb-4 flex items-center">
              <Gauge size={18} className="mr-2 text-red-600 dark:text-red-400" />
              Deployment Test Scenarios
            </h3>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {testScenarios.map((scenario) => (
                <div 
                  key={scenario.scenarioId}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    selectedScenario?.scenarioId === scenario.scenarioId 
                      ? 'border-red-500 bg-red-50 dark:bg-red-900/20' 
                      : 'border-gray-200 dark:border-gray-700 hover:border-red-300 dark:hover:border-red-600 bg-gray-50 dark:bg-gray-700/50'
                  }`}
                  onClick={() => setSelectedScenario(scenario)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <Target size={16} className="text-red-500 mr-2" />
                      <span className="font-medium text-gray-900 dark:text-white">{scenario.name}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${getEnvironmentColor(scenario.environment)}`}>
                        {scenario.environment}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${getComplexityColor(scenario.complexity)}`}>
                        {scenario.complexity}
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{scenario.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {scenario.faultInjection.enabled ? (
                        <span className="flex items-center">
                          <AlertTriangle size={12} className="mr-1 text-amber-500" />
                          {scenario.faultInjection.faultTypes.length} fault types
                        </span>
                      ) : (
                        <span>No fault injection</span>
                      )}
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        runScenarioTest(scenario.scenarioId);
                      }}
                      disabled={isRunningTest && activeTestId === scenario.scenarioId}
                      className="flex items-center px-3 py-1.5 text-xs bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 transition-colors"
                    >
                      {isRunningTest && activeTestId === scenario.scenarioId ? (
                        <>
                          <Clock size={12} className="mr-1 animate-spin" />
                          Testing...
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

          {/* Test Results or Scenario Details */}
          <div>
            {selectedScenario ? (
              <div>
                <h3 className="text-md font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                  <Activity size={18} className="mr-2 text-blue-600 dark:text-blue-400" />
                  Scenario Details: {selectedScenario.name}
                </h3>
                
                <div className="space-y-4">
                  {/* Expected Behavior */}
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                    <h4 className="text-sm font-medium text-blue-800 dark:text-blue-400 mb-2">Expected Behavior</h4>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-blue-600 dark:text-blue-400">Detection Time:</span>
                        <span className="ml-1 font-medium text-blue-700 dark:text-blue-300">{selectedScenario.expectedBehavior.detectionTime}</span>
                      </div>
                      <div>
                        <span className="text-blue-600 dark:text-blue-400">Fix Time:</span>
                        <span className="ml-1 font-medium text-blue-700 dark:text-blue-300">{selectedScenario.expectedBehavior.fixApplicationTime}</span>
                      </div>
                      <div>
                        <span className="text-blue-600 dark:text-blue-400">Rollback Time:</span>
                        <span className="ml-1 font-medium text-blue-700 dark:text-blue-300">{selectedScenario.expectedBehavior.rollbackTime}</span>
                      </div>
                    </div>
                  </div>

                  {/* Fault Injection */}
                  {selectedScenario.faultInjection.enabled && (
                    <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4 border border-amber-200 dark:border-amber-800">
                      <h4 className="text-sm font-medium text-amber-800 dark:text-amber-400 mb-2">Fault Injection</h4>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="text-amber-600 dark:text-amber-400">Fault Types:</span>
                          <div className="mt-1 flex flex-wrap gap-1">
                            {selectedScenario.faultInjection.faultTypes.map((fault, index) => (
                              <span key={index} className="text-xs bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 px-2 py-1 rounded">
                                {fault}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <span className="text-amber-600 dark:text-amber-400">Intensity:</span>
                            <span className="ml-1 font-medium text-amber-700 dark:text-amber-300 capitalize">{selectedScenario.faultInjection.intensity}</span>
                          </div>
                          <div>
                            <span className="text-amber-600 dark:text-amber-400">Duration:</span>
                            <span className="ml-1 font-medium text-amber-700 dark:text-amber-300">{selectedScenario.faultInjection.duration}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Success Criteria */}
                  <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
                    <h4 className="text-sm font-medium text-green-800 dark:text-green-400 mb-2">Success Criteria</h4>
                    <ul className="text-sm text-green-700 dark:text-green-300 space-y-1">
                      {selectedScenario.expectedBehavior.successCriteria.map((criteria, index) => (
                        <li key={index} className="flex items-start">
                          <CheckCircle size={14} className="text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                          {criteria}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <h3 className="text-md font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                  <BarChart3 size={18} className="mr-2 text-green-600 dark:text-green-400" />
                  Recent Test Results
                </h3>
                
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {testResults.slice(0, 5).map((result) => (
                    <div key={result.testId} className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          {getStabilityIcon(result.stressTestResults.systemStability)}
                          <span className="ml-2 font-medium text-gray-900 dark:text-white text-sm">
                            {result.scenario.name}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(result.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3 text-xs mb-2">
                        <div>
                          <span className="text-gray-600 dark:text-gray-400">AI Response:</span>
                          <span className="ml-1 font-medium text-gray-900 dark:text-white">
                            {result.aiPerformance.issueDetectionSpeed}ms
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600 dark:text-gray-400">Fix Success:</span>
                          <span className={`ml-1 font-medium ${getPerformanceColor(result.aiPerformance.confidenceAccuracy)}`}>
                            {result.aiPerformance.confidenceAccuracy}%
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600 dark:text-gray-400">Uptime:</span>
                          <span className={`ml-1 font-medium ${getPerformanceColor(result.reliabilityMetrics.uptime)}`}>
                            {result.reliabilityMetrics.uptime}%
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600 dark:text-gray-400">System:</span>
                          <span className="ml-1 font-medium text-gray-900 dark:text-white capitalize">
                            {result.stressTestResults.systemStability}
                          </span>
                        </div>
                      </div>
                      
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {result.deploymentResults.successfulDeployments}/{result.deploymentResults.totalDeployments} deployments successful
                      </div>
                    </div>
                  ))}
                  
                  {testResults.length === 0 && (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                        <BarChart3 size={24} className="text-gray-400" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Test Results</h3>
                      <p className="text-gray-500 dark:text-gray-400">Run a scenario test to see performance results</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Validation History */}
        {validationHistory.length > 0 && (
          <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-md font-medium text-gray-900 dark:text-white mb-4 flex items-center">
              <TrendingUp size={18} className="mr-2 text-purple-600 dark:text-purple-400" />
              Validation History
            </h3>
            <div className="space-y-3">
              {validationHistory.slice(0, 3).map((validation) => (
                <div key={validation.validationId} className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900 dark:text-white">{validation.testSuite}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">Duration: {validation.duration}</span>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 text-sm mb-3">
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Tests:</span>
                      <span className="ml-1 font-medium text-gray-900 dark:text-white">
                        {validation.overallResults.passedTests}/{validation.overallResults.totalTests}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Production Ready:</span>
                      <span className={`ml-1 font-medium ${getPerformanceColor(validation.overallResults.productionReadinessScore)}`}>
                        {validation.overallResults.productionReadinessScore}%
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">AI Response:</span>
                      <span className="ml-1 font-medium text-gray-900 dark:text-white">
                        {validation.overallResults.averageAIResponseTime}ms
                      </span>
                    </div>
                  </div>
                  
                  {validation.recommendations.length > 0 && (
                    <div className="pt-2 border-t border-gray-200 dark:border-gray-600">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-600 dark:text-gray-400">
                          {validation.recommendations.length} recommendations
                        </span>
                        <div className="flex space-x-1">
                          {validation.recommendations.slice(0, 3).map((rec, index) => (
                            <span key={index} className={`text-xs px-2 py-1 rounded-full font-medium ${getPriorityColor(rec.priority)}`}>
                              {rec.priority}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* AI Insights */}
        {validationReport?.insights.length > 0 && (
          <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center">
              <AlertTriangle size={16} className="mr-1 text-blue-500" />
              AI Validation Insights
            </h4>
            <div className="space-y-2">
              {validationReport.insights.map((insight: string, index: number) => (
                <div key={index} className="flex items-start p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <CheckCircle size={14} className="text-blue-600 dark:text-blue-400 mt-0.5 mr-2 flex-shrink-0" />
                  <span className="text-sm text-blue-800 dark:text-blue-300">{insight}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeploymentScenarioValidator;