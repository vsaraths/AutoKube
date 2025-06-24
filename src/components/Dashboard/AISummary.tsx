import React from 'react';
import { Sparkles, Zap, ChevronRight, Brain, Target } from 'lucide-react';

const AISummary: React.FC = () => {
  const insights = [
    {
      id: 1,
      title: 'Resource optimization opportunity',
      description: 'CPU request/limit ratio indicates over-provisioning in dev namespace',
      action: 'View recommendation',
      priority: 'medium',
      impact: 'Cost savings: $240/month'
    },
    {
      id: 2,
      title: 'Potential network policy gap',
      description: 'Multiple pods have unrestricted egress traffic',
      action: 'Generate policy',
      priority: 'high',
      impact: 'Security improvement'
    },
    {
      id: 3,
      title: 'Node memory pressure predicted',
      description: 'Worker-3 memory trends suggest OOM risk in ~48 hours',
      action: 'Schedule scaling',
      priority: 'medium',
      impact: 'Prevent downtime'
    }
  ];

  const getPriorityClass = (priority: string) => {
    switch(priority) {
      case 'high':
        return 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30';
      case 'medium':
        return 'text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/30';
      default:
        return 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white mr-3">
              <Brain size={20} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">AI Insights</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Powered by AutoKube AI</p>
            </div>
          </div>
          <div className="flex items-center text-sm text-green-600 dark:text-green-400">
            <Target size={16} className="mr-1" />
            94% accuracy
          </div>
        </div>
        
        <div className="space-y-4">
          {insights.map((insight) => (
            <div key={insight.id} className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <Sparkles size={16} className="text-blue-500 mr-2" />
                    <h3 className="font-medium text-gray-900 dark:text-white">{insight.title}</h3>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{insight.description}</p>
                  <p className="text-xs text-green-600 dark:text-green-400 font-medium">{insight.impact}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${getPriorityClass(insight.priority)}`}>
                  {insight.priority}
                </span>
              </div>
              <div className="flex justify-end">
                <button className="flex items-center text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors">
                  {insight.action}
                  <ChevronRight size={16} className="ml-1" />
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button className="w-full text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium transition-colors">
            View all AI recommendations
          </button>
        </div>
      </div>
    </div>
  );
};

export default AISummary;