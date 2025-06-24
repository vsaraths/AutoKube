import React, { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Clock, Target, BarChart3, Zap, Gauge } from 'lucide-react';
import { CostOptimizationAnalyzer, ResourceCost, OptimizationRecommendation, CostTrend, Budget } from '../../api/cost-optimization-analyzer';

const CostOptimizationAnalyzerComponent: React.FC = () => {
  const [resourceCosts, setResourceCosts] = useState<ResourceCost[]>([]);
  const [recommendations, setRecommendations] = useState<OptimizationRecommendation[]>([]);
  const [costTrends, setCostTrends] = useState<CostTrend[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [selectedResource, setSelectedResource] = useState<ResourceCost | null>(null);
  const [selectedRecommendation, setSelectedRecommendation] = useState<OptimizationRecommendation | null>(null);
  const [costSummary, setCostSummary] = useState<any>(null);
  const [aiRecommendations, setAiRecommendations] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'resources' | 'recommendations' | 'trends' | 'budgets'>('resources');

  useEffect(() => {
    const analyzer = CostOptimizationAnalyzer.getInstance();
    
    const loadData = async () => {
      try {
        const costs = await analyzer.getResourceCosts();
        setResourceCosts(costs);
        
        const recs = await analyzer.getRecommendations();
        setRecommendations(recs);
        
        const trends = await analyzer.getCostTrends();
        setCostTrends(trends);
        
        const budgetData = await analyzer.getBudgets();
        setBudgets(budgetData);
        
        const summary = analyzer.generateCostSummary();
        setCostSummary(summary);
        
        const aiRecs = analyzer.generateAIRecommendations();
        setAiRecommendations(aiRecs);
      } catch (error) {
        console.error('Failed to load cost data:', error);
      }
    };

    loadData();
    
    // Update every minute
    const interval = setInterval(loadData, 60000);
    return () => clearInterval(interval);
  }, []);

  const updateRecommendationStatus = async (recommendationId: string, status: 'approved' | 'rejected' | 'implemented') => {
    const analyzer = CostOptimizationAnalyzer.getInstance();
    
    try {
      const updatedRec = await analyzer.updateRecommendationStatus(recommendationId, status);
      if (updatedRec) {
        setRecommendations(prev => prev.map(rec => 
          rec.recommendationId === recommendationId ? updatedRec : rec
        ));
        
        if (selectedRecommendation?.recommendationId === recommendationId) {
          setSelectedRecommendation(updatedRec);
        }
      }
    } catch (error) {
      console.error('Failed to update recommendation status:', error);
    }
  };

  const getUtilizationColor = (utilization: number) => {
    if (utilization < 30) return 'text-red-600 dark:text-red-400';
    if (utilization < 50) return 'text-amber-600 dark:text-amber-400';
    return 'text-green-600 dark:text-green-400';
  };

  const getWasteColor = (wastedCost: number, totalCost: number) => {
    const percentage = (wastedCost / totalCost) * 100;
    if (percentage > 40) return 'text-red-600 dark:text-red-400';
    if (percentage > 20) return 'text-amber-600 dark:text-amber-400';
    return 'text-blue-600 dark:text-blue-400';
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      case 'medium':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400';
      case 'low':
      case 'none':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400';
    }
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'complex':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      case 'medium':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400';
      case 'easy':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'implemented':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'approved':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400';
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'increasing':
        return 'text-red-600 dark:text-red-400';
      case 'decreasing':
        return 'text-green-600 dark:text-green-400';
      case 'volatile':
        return 'text-amber-600 dark:text-amber-400';
      default:
        return 'text-blue-600 dark:text-blue-400';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing':
        return <TrendingUp size={16} className="text-red-500" />;
      case 'decreasing':
        return <TrendingDown size={16} className="text-green-500" />;
      case 'volatile':
        return <AlertTriangle size={16} className="text-amber-500" />;
      default:
        return <Target size={16} className="text-blue-500" />;
    }
  };

  const getBudgetStatusColor = (current: number, total: number) => {
    const percentage = (current / total) * 100;
    if (percentage > 90) return 'text-red-600 dark:text-red-400';
    if (percentage > 75) return 'text-amber-600 dark:text-amber-400';
    return 'text-green-600 dark:text-green-400';
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="p-2 rounded-lg bg-gradient-to-r from-green-500 to-blue-600 text-white mr-3">
              <DollarSign size={20} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Cost Optimization Analyzer</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">AI-powered cost analysis and optimization recommendations</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setActiveTab('resources')}
              className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                activeTab === 'resources' 
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' 
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              Resources
            </button>
            <button
              onClick={() => setActiveTab('recommendations')}
              className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                activeTab === 'recommendations' 
                  ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              Recommendations
            </button>
            <button
              onClick={() => setActiveTab('trends')}
              className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                activeTab === 'trends' 
                  ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' 
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              Trends
            </button>
            <button
              onClick={() => setActiveTab('budgets')}
              className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                activeTab === 'budgets' 
                  ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' 
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              Budgets
            </button>
          </div>
        </div>

        {/* Cost Summary */}
        {costSummary && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-lg p-4">
              <p className="text-sm text-blue-600 dark:text-blue-400 mb-1">Monthly Cost</p>
              <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{formatCurrency(costSummary.totalCost.monthly)}</p>
            </div>
            <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-lg p-4">
              <p className="text-sm text-red-600 dark:text-red-400 mb-1">Wasted Resources</p>
              <p className="text-2xl font-bold text-red-700 dark:text-red-300">{formatCurrency(costSummary.wastedCost.monthly)}</p>
            </div>
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg p-4">
              <p className="text-sm text-green-600 dark:text-green-400 mb-1">Potential Savings</p>
              <p className="text-2xl font-bold text-green-700 dark:text-green-300">{formatCurrency(costSummary.potentialSavings.monthly)}</p>
            </div>
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg p-4">
              <p className="text-sm text-purple-600 dark:text-purple-400 mb-1">Optimization</p>
              <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">{costSummary.potentialSavings.percentage}%</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Panel - List of Resources/Recommendations/Trends/Budgets */}
          <div>
            {activeTab === 'resources' && (
              <>
                <h3 className="text-md font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                  <Gauge size={18} className="mr-2 text-blue-600 dark:text-blue-400" />
                  Resource Costs
                </h3>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {resourceCosts.map((resource) => (
                    <div 
                      key={resource.resourceId}
                      className={`p-4 border rounded-lg cursor-pointer transition-all ${
                        selectedResource?.resourceId === resource.resourceId 
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                          : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 bg-gray-50 dark:bg-gray-700/50'
                      }`}
                      onClick={() => {
                        setSelectedResource(resource);
                        setSelectedRecommendation(null);
                      }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <span className="font-medium text-gray-900 dark:text-white">{resource.name}</span>
                        </div>
                        <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                          {formatCurrency(resource.costPerMonth)}/mo
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between mb-2 text-sm">
                        <span className="text-gray-600 dark:text-gray-400">{resource.resourceType} • {resource.namespace}</span>
                        <span className={getWasteColor(resource.wastedCost.monthly, resource.costPerMonth)}>
                          {formatCurrency(resource.wastedCost.monthly)} wasted
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-3 text-xs">
                        <div>
                          <span className="text-gray-600 dark:text-gray-400">CPU:</span>
                          <span className={`ml-1 font-medium ${getUtilizationColor(resource.actualUtilization.cpu)}`}>
                            {resource.actualUtilization.cpu}%
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600 dark:text-gray-400">Memory:</span>
                          <span className={`ml-1 font-medium ${getUtilizationColor(resource.actualUtilization.memory)}`}>
                            {resource.actualUtilization.memory}%
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600 dark:text-gray-400">Provider:</span>
                          <span className="ml-1 font-medium text-gray-900 dark:text-white">
                            {resource.provider}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {activeTab === 'recommendations' && (
              <>
                <h3 className="text-md font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                  <Zap size={18} className="mr-2 text-green-600 dark:text-green-400" />
                  Cost Optimization Recommendations
                </h3>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {recommendations.map((recommendation) => (
                    <div 
                      key={recommendation.recommendationId}
                      className={`p-4 border rounded-lg cursor-pointer transition-all ${
                        selectedRecommendation?.recommendationId === recommendation.recommendationId 
                          ? 'border-green-500 bg-green-50 dark:bg-green-900/20' 
                          : 'border-gray-200 dark:border-gray-700 hover:border-green-300 dark:hover:border-green-600 bg-gray-50 dark:bg-gray-700/50'
                      }`}
                      onClick={() => {
                        setSelectedRecommendation(recommendation);
                        setSelectedResource(null);
                      }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <span className="font-medium text-gray-900 dark:text-white">{recommendation.resourceName}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(recommendation.status)}`}>
                            {recommendation.status}
                          </span>
                          <span className="text-sm font-medium text-green-600 dark:text-green-400">
                            {formatCurrency(recommendation.potentialSavings.monthly)}/mo
                          </span>
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {recommendation.recommendationType.replace('-', ' ').toUpperCase()}: {recommendation.justification.split('.')[0]}.
                      </p>
                      
                      <div className="grid grid-cols-3 gap-3 text-xs">
                        <div>
                          <span className="text-gray-600 dark:text-gray-400">Savings:</span>
                          <span className="ml-1 font-medium text-green-600 dark:text-green-400">
                            {recommendation.potentialSavings.percentage}%
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600 dark:text-gray-400">Impact:</span>
                          <span className={`ml-1 font-medium ${
                            recommendation.impact === 'high' ? 'text-red-600 dark:text-red-400' :
                            recommendation.impact === 'medium' ? 'text-amber-600 dark:text-amber-400' :
                            'text-green-600 dark:text-green-400'
                          }`}>
                            {recommendation.impact}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600 dark:text-gray-400">Confidence:</span>
                          <span className="ml-1 font-medium text-gray-900 dark:text-white">
                            {recommendation.confidence}%
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {activeTab === 'trends' && (
              <>
                <h3 className="text-md font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                  <TrendingUp size={18} className="mr-2 text-purple-600 dark:text-purple-400" />
                  Cost Trends
                </h3>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {costTrends.map((trend) => (
                    <div 
                      key={trend.trendId}
                      className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700/50"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-900 dark:text-white">
                          {trend.namespace || trend.provider || trend.resourceType || 'Overall'} Costs
                        </span>
                        <div className="flex items-center">
                          {getTrendIcon(trend.trend)}
                          <span className={`ml-1 text-sm font-medium ${getTrendColor(trend.trend)}`}>
                            {trend.changeRate > 0 ? '+' : ''}{trend.changeRate}%
                          </span>
                        </div>
                      </div>
                      
                      <div className="h-12 flex items-end space-x-1">
                        {trend.dataPoints.slice(-10).map((point, index) => (
                          <div 
                            key={index}
                            className="flex-1 bg-purple-500 dark:bg-purple-600 rounded-t"
                            style={{ 
                              height: `${(point.cost / Math.max(...trend.dataPoints.map(p => p.cost))) * 100}%`,
                              opacity: 0.6 + (index / 20)
                            }}
                          ></div>
                        ))}
                      </div>
                      
                      <div className="flex items-center justify-between mt-2 text-xs">
                        <span className="text-gray-500 dark:text-gray-400">
                          {trend.period} trend
                        </span>
                        {trend.forecastedIncrease && (
                          <span className={`font-medium ${
                            trend.forecastedIncrease > 10 ? 'text-red-600 dark:text-red-400' :
                            trend.forecastedIncrease > 5 ? 'text-amber-600 dark:text-amber-400' :
                            'text-blue-600 dark:text-blue-400'
                          }`}>
                            Forecast: {trend.forecastedIncrease > 0 ? '+' : ''}{trend.forecastedIncrease}%
                          </span>
                        )}
                      </div>
                      
                      {trend.anomalies && trend.anomalies.length > 0 && (
                        <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-600">
                          <div className="flex items-center text-xs text-red-600 dark:text-red-400">
                            <AlertTriangle size={12} className="mr-1" />
                            {trend.anomalies.length} cost anomalies detected
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}

            {activeTab === 'budgets' && (
              <>
                <h3 className="text-md font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                  <DollarSign size={18} className="mr-2 text-amber-600 dark:text-amber-400" />
                  Cost Budgets
                </h3>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {budgets.map((budget) => (
                    <div 
                      key={budget.budgetId}
                      className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700/50"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-900 dark:text-white">{budget.name}</span>
                        <span className={`text-sm font-medium ${getBudgetStatusColor(budget.currentSpend, budget.amount)}`}>
                          {formatCurrency(budget.currentSpend)} / {formatCurrency(budget.amount)}
                        </span>
                      </div>
                      
                      <div className="mb-2">
                        <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
                          <span>Current: {((budget.currentSpend / budget.amount) * 100).toFixed(1)}%</span>
                          <span>Forecasted: {((budget.forecastedSpend / budget.amount) * 100).toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5">
                          <div 
                            className="h-2.5 rounded-full bg-blue-500"
                            style={{ width: `${(budget.currentSpend / budget.amount) * 100}%` }}
                          ></div>
                          {budget.forecastedSpend > budget.currentSpend && (
                            <div 
                              className="h-2.5 rounded-r-full bg-amber-500 opacity-50 -mt-2.5"
                              style={{ 
                                width: `${((budget.forecastedSpend - budget.currentSpend) / budget.amount) * 100}%`,
                                marginLeft: `${(budget.currentSpend / budget.amount) * 100}%`
                              }}
                            ></div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-1 mb-2">
                        {budget.scope.namespaces && budget.scope.namespaces.length > 0 && (
                          <span className="px-2 py-0.5 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 rounded-full">
                            {budget.scope.namespaces.join(', ')}
                          </span>
                        )}
                        {budget.scope.clusters && budget.scope.clusters.length > 0 && (
                          <span className="px-2 py-0.5 text-xs bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 rounded-full">
                            {budget.scope.clusters.join(', ')}
                          </span>
                        )}
                        {budget.scope.labels && Object.keys(budget.scope.labels).length > 0 && (
                          Object.entries(budget.scope.labels).map(([key, value]) => (
                            <span key={key} className="px-2 py-0.5 text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-400 rounded-full">
                              {key}: {value}
                            </span>
                          ))
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500 dark:text-gray-400">
                          {budget.period} budget
                        </span>
                        {budget.alerts.some(alert => alert.triggered) && (
                          <span className="flex items-center text-red-600 dark:text-red-400">
                            <AlertTriangle size={12} className="mr-1" />
                            Alert triggered
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Right Panel - Details or AI Recommendations */}
          <div>
            {selectedResource ? (
              <div>
                <h3 className="text-md font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                  <Gauge size={18} className="mr-2 text-blue-600 dark:text-blue-400" />
                  Resource Details: {selectedResource.name}
                </h3>
                
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-4 border border-blue-200 dark:border-blue-800">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-blue-600 dark:text-blue-400">Resource Type:</span>
                      <span className="ml-1 font-medium text-blue-700 dark:text-blue-300">
                        {selectedResource.resourceType}
                      </span>
                    </div>
                    <div>
                      <span className="text-blue-600 dark:text-blue-400">Namespace:</span>
                      <span className="ml-1 font-medium text-blue-700 dark:text-blue-300">
                        {selectedResource.namespace}
                      </span>
                    </div>
                    <div>
                      <span className="text-blue-600 dark:text-blue-400">Provider:</span>
                      <span className="ml-1 font-medium text-blue-700 dark:text-blue-300">
                        {selectedResource.provider}
                      </span>
                    </div>
                    <div>
                      <span className="text-blue-600 dark:text-blue-400">Region:</span>
                      <span className="ml-1 font-medium text-blue-700 dark:text-blue-300">
                        {selectedResource.region}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 mb-4">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Cost Analysis</h4>
                  <div className="grid grid-cols-3 gap-4 text-sm mb-3">
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Hourly:</span>
                      <span className="ml-1 font-medium text-gray-900 dark:text-white">
                        {formatCurrency(selectedResource.costPerHour)}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Daily:</span>
                      <span className="ml-1 font-medium text-gray-900 dark:text-white">
                        {formatCurrency(selectedResource.costPerDay)}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Monthly:</span>
                      <span className="ml-1 font-medium text-gray-900 dark:text-white">
                        {formatCurrency(selectedResource.costPerMonth)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <h5 className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Wasted Resources</h5>
                    <div className="grid grid-cols-3 gap-3 text-sm">
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">CPU:</span>
                        <span className="ml-1 font-medium text-red-600 dark:text-red-400">
                          {selectedResource.wastedResources.cpu} cores
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">Memory:</span>
                        <span className="ml-1 font-medium text-red-600 dark:text-red-400">
                          {selectedResource.wastedResources.memory} GB
                        </span>
                      </div>
                      {selectedResource.wastedResources.storage && (
                        <div>
                          <span className="text-gray-600 dark:text-gray-400">Storage:</span>
                          <span className="ml-1 font-medium text-red-600 dark:text-red-400">
                            {selectedResource.wastedResources.storage} GB
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h5 className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Wasted Cost</h5>
                    <div className="grid grid-cols-3 gap-3 text-sm">
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">Hourly:</span>
                        <span className="ml-1 font-medium text-red-600 dark:text-red-400">
                          {formatCurrency(selectedResource.wastedCost.hourly)}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">Daily:</span>
                        <span className="ml-1 font-medium text-red-600 dark:text-red-400">
                          {formatCurrency(selectedResource.wastedCost.daily)}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">Monthly:</span>
                        <span className="ml-1 font-medium text-red-600 dark:text-red-400">
                          {formatCurrency(selectedResource.wastedCost.monthly)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Resource Utilization</h4>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
                        <span>CPU: {selectedResource.actualUtilization.cpu}% of {selectedResource.requestedResources.cpu}</span>
                        <span>{selectedResource.actualUtilization.cpu < 30 ? 'Underutilized' : selectedResource.actualUtilization.cpu < 50 ? 'Moderate' : 'Efficient'}</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            selectedResource.actualUtilization.cpu < 30 ? 'bg-red-500' : 
                            selectedResource.actualUtilization.cpu < 50 ? 'bg-amber-500' : 
                            'bg-green-500'
                          }`}
                          style={{ width: `${selectedResource.actualUtilization.cpu}%` }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
                        <span>Memory: {selectedResource.actualUtilization.memory}% of {selectedResource.requestedResources.memory}</span>
                        <span>{selectedResource.actualUtilization.memory < 30 ? 'Underutilized' : selectedResource.actualUtilization.memory < 50 ? 'Moderate' : 'Efficient'}</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            selectedResource.actualUtilization.memory < 30 ? 'bg-red-500' : 
                            selectedResource.actualUtilization.memory < 50 ? 'bg-amber-500' : 
                            'bg-green-500'
                          }`}
                          style={{ width: `${selectedResource.actualUtilization.memory}%` }}
                        ></div>
                      </div>
                    </div>
                    {selectedResource.actualUtilization.storage && (
                      <div>
                        <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
                          <span>Storage: {selectedResource.actualUtilization.storage}% of {selectedResource.requestedResources.storage}</span>
                          <span>{selectedResource.actualUtilization.storage < 30 ? 'Underutilized' : selectedResource.actualUtilization.storage < 50 ? 'Moderate' : 'Efficient'}</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              selectedResource.actualUtilization.storage < 30 ? 'bg-red-500' : 
                              selectedResource.actualUtilization.storage < 50 ? 'bg-amber-500' : 
                              'bg-green-500'
                            }`}
                            style={{ width: `${selectedResource.actualUtilization.storage}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : selectedRecommendation ? (
              <div>
                <h3 className="text-md font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                  <Zap size={18} className="mr-2 text-green-600 dark:text-green-400" />
                  Recommendation: {selectedRecommendation.resourceName}
                </h3>
                
                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 mb-4 border border-green-200 dark:border-green-800">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-green-800 dark:text-green-300">
                        {selectedRecommendation.recommendationType.replace('-', ' ').toUpperCase()}
                      </span>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(selectedRecommendation.status)}`}>
                      {selectedRecommendation.status}
                    </span>
                  </div>
                  <p className="text-sm text-green-700 dark:text-green-300 mb-3">{selectedRecommendation.justification}</p>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-green-600 dark:text-green-400">Monthly Savings:</span>
                      <span className="ml-1 font-medium text-green-700 dark:text-green-300">
                        {formatCurrency(selectedRecommendation.potentialSavings.monthly)}
                      </span>
                    </div>
                    <div>
                      <span className="text-green-600 dark:text-green-400">Annual Savings:</span>
                      <span className="ml-1 font-medium text-green-700 dark:text-green-300">
                        {formatCurrency(selectedRecommendation.potentialSavings.annual)}
                      </span>
                    </div>
                    <div>
                      <span className="text-green-600 dark:text-green-400">Savings %:</span>
                      <span className="ml-1 font-medium text-green-700 dark:text-green-300">
                        {selectedRecommendation.potentialSavings.percentage}%
                      </span>
                    </div>
                    <div>
                      <span className="text-green-600 dark:text-green-400">Confidence:</span>
                      <span className="ml-1 font-medium text-green-700 dark:text-green-300">
                        {selectedRecommendation.confidence}%
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Current State</h4>
                    <div className="space-y-2 text-sm">
                      {Object.entries(selectedRecommendation.currentState).map(([key, value]) => (
                        <div key={key} className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">{key}:</span>
                          <span className="font-medium text-gray-900 dark:text-white">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Recommended State</h4>
                    <div className="space-y-2 text-sm">
                      {Object.entries(selectedRecommendation.recommendedState).map(([key, value]) => (
                        <div key={key} className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">{key}:</span>
                          <span className="font-medium text-green-600 dark:text-green-400">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Implementation Details</h4>
                    <div className="flex items-center space-x-2">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${getImpactColor(selectedRecommendation.impact)}`}>
                        {selectedRecommendation.impact} impact
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${getComplexityColor(selectedRecommendation.implementationComplexity)}`}>
                        {selectedRecommendation.implementationComplexity} complexity
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2 mb-3">
                    {selectedRecommendation.implementationSteps.map((step, index) => (
                      <div key={index} className="flex items-start">
                        <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-xs font-medium flex items-center justify-center mr-2 mt-0.5">
                          {index + 1}
                        </div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">{step}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {selectedRecommendation.status === 'pending' && (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => updateRecommendationStatus(selectedRecommendation.recommendationId, 'approved')}
                      className="flex-1 flex items-center justify-center px-3 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <CheckCircle size={16} className="mr-1" />
                      Approve
                    </button>
                    <button
                      onClick={() => updateRecommendationStatus(selectedRecommendation.recommendationId, 'rejected')}
                      className="flex-1 flex items-center justify-center px-3 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      <XCircle size={16} className="mr-1" />
                      Reject
                    </button>
                  </div>
                )}

                {selectedRecommendation.status === 'approved' && (
                  <button
                    onClick={() => updateRecommendationStatus(selectedRecommendation.recommendationId, 'implemented')}
                    className="w-full flex items-center justify-center px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Zap size={16} className="mr-1" />
                    Implement Now
                  </button>
                )}
              </div>
            ) : (
              <div>
                <h3 className="text-md font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                  <BarChart3 size={18} className="mr-2 text-purple-600 dark:text-purple-400" />
                  AI Cost Optimization Insights
                </h3>
                
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {aiRecommendations.map((recommendation, index) => (
                    <div key={index} className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-purple-800 dark:text-purple-300">{recommendation.title}</span>
                        <div className="flex items-center space-x-2">
                          <span className={`text-xs px-2 py-1 rounded-full font-medium ${getImpactColor(recommendation.impact)}`}>
                            {recommendation.impact} impact
                          </span>
                          <span className={`text-xs px-2 py-1 rounded-full font-medium ${getComplexityColor(recommendation.difficulty)}`}>
                            {recommendation.difficulty} difficulty
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-purple-700 dark:text-purple-300 mb-3">{recommendation.description}</p>
                      <div className="text-sm text-purple-700 dark:text-purple-300 mb-3">
                        <strong>Estimated Savings:</strong> {recommendation.estimatedSavings}
                      </div>
                      <div className="space-y-2 mb-3">
                        <h5 className="text-xs font-medium text-purple-800 dark:text-purple-300">Implementation Steps:</h5>
                        {recommendation.implementationSteps.map((step: string, stepIndex: number) => (
                          <div key={stepIndex} className="flex items-start">
                            <div className="flex-shrink-0 w-5 h-5 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-xs font-medium flex items-center justify-center mr-2 mt-0.5">
                              {stepIndex + 1}
                            </div>
                            <span className="text-sm text-purple-700 dark:text-purple-300">{step}</span>
                          </div>
                        ))}
                      </div>
                      <button className="w-full px-3 py-2 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                        Apply Recommendation
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Top Wasteful Resources */}
        {costSummary?.topWastefulResources.length > 0 && (
          <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-md font-medium text-gray-900 dark:text-white mb-4">Top Wasteful Resources</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Resource</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Namespace</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Utilization</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Wasted Cost</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {costSummary.topWastefulResources.map((resource) => (
                    <tr key={resource.resourceId} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{resource.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{resource.namespace}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`text-sm font-medium ${getUtilizationColor(resource.utilizationPercentage)}`}>
                          {resource.utilizationPercentage.toFixed(1)}%
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-red-600 dark:text-red-400">
                        {formatCurrency(resource.wastedCostMonthly)}/mo
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CostOptimizationAnalyzerComponent;