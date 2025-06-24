import React from 'react';
import { Activity, TrendingUp, Zap, Brain, Shield, Target, Gauge, BarChart3 } from 'lucide-react';

interface BentoCard {
  id: string;
  title: string;
  value: string;
  subtitle: string;
  icon: React.ReactNode;
  trend?: {
    direction: 'up' | 'down' | 'stable';
    value: string;
  };
  size: 'small' | 'medium' | 'large';
  gradient: string;
  interactive?: boolean;
}

const ModernBentoGrid: React.FC = () => {
  const bentoCards: BentoCard[] = [
    {
      id: 'cluster-health',
      title: 'Cluster Health',
      value: '98.7%',
      subtitle: 'All systems operational',
      icon: <Activity size={24} className="text-emerald-600 dark:text-emerald-400" />,
      trend: { direction: 'up', value: '+2.3%' },
      size: 'medium',
      gradient: 'from-emerald-50 via-teal-50 to-cyan-50 dark:from-emerald-950 dark:via-teal-950 dark:to-cyan-950',
      interactive: true
    },
    {
      id: 'ai-confidence',
      title: 'AI Confidence',
      value: '94%',
      subtitle: 'High accuracy predictions',
      icon: <Brain size={24} className="text-violet-600 dark:text-violet-400" />,
      trend: { direction: 'up', value: '+5.2%' },
      size: 'small',
      gradient: 'from-violet-50 via-purple-50 to-fuchsia-50 dark:from-violet-950 dark:via-purple-950 dark:to-fuchsia-950',
      interactive: true
    },
    {
      id: 'auto-fixes',
      title: 'Auto-Fixes Applied',
      value: '127',
      subtitle: 'Last 24 hours',
      icon: <Zap size={24} className="text-amber-600 dark:text-amber-400" />,
      trend: { direction: 'up', value: '+18' },
      size: 'small',
      gradient: 'from-amber-50 via-orange-50 to-red-50 dark:from-amber-950 dark:via-orange-950 dark:to-red-950',
      interactive: true
    },
    {
      id: 'predictive-alerts',
      title: 'Predictive Insights',
      value: '3',
      subtitle: 'Potential issues detected',
      icon: <Target size={24} className="text-blue-600 dark:text-blue-400" />,
      trend: { direction: 'down', value: '-2' },
      size: 'medium',
      gradient: 'from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950 dark:via-indigo-950 dark:to-purple-950',
      interactive: true
    },
    {
      id: 'security-score',
      title: 'Security Score',
      value: '92/100',
      subtitle: 'Excellent security posture',
      icon: <Shield size={24} className="text-green-600 dark:text-green-400" />,
      trend: { direction: 'stable', value: '0%' },
      size: 'small',
      gradient: 'from-green-50 via-emerald-50 to-teal-50 dark:from-green-950 dark:via-emerald-950 dark:to-teal-950',
      interactive: true
    },
    {
      id: 'performance-metrics',
      title: 'Performance',
      value: '847ms',
      subtitle: 'Average response time',
      icon: <Gauge size={24} className="text-cyan-600 dark:text-cyan-400" />,
      trend: { direction: 'down', value: '-23ms' },
      size: 'medium',
      gradient: 'from-cyan-50 via-sky-50 to-blue-50 dark:from-cyan-950 dark:via-sky-950 dark:to-blue-950',
      interactive: true
    }
  ];

  const getTrendIcon = (direction: string) => {
    switch (direction) {
      case 'up':
        return <TrendingUp size={16} className="text-emerald-500" />;
      case 'down':
        return <TrendingUp size={16} className="text-red-500 rotate-180" />;
      default:
        return <BarChart3 size={16} className="text-gray-500" />;
    }
  };

  const getTrendColor = (direction: string) => {
    switch (direction) {
      case 'up':
        return 'text-emerald-600 dark:text-emerald-400';
      case 'down':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getCardSize = (size: string) => {
    switch (size) {
      case 'large':
        return 'col-span-2 row-span-2';
      case 'medium':
        return 'col-span-2 row-span-1';
      default:
        return 'col-span-1 row-span-1';
    }
  };

  return (
    <div className="grid grid-cols-4 grid-rows-3 gap-4 h-96">
      {bentoCards.map((card) => (
        <div
          key={card.id}
          className={`
            ${getCardSize(card.size)}
            bg-gradient-to-br ${card.gradient}
            rounded-2xl p-6 border border-white/20 dark:border-gray-800/50
            backdrop-blur-sm shadow-lg hover:shadow-xl
            transition-all duration-300 ease-out
            ${card.interactive ? 'hover:scale-[1.02] cursor-pointer' : ''}
            group relative overflow-hidden
          `}
        >
          {/* Subtle animated background pattern */}
          <div className="absolute inset-0 opacity-5 dark:opacity-10">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          </div>
          
          <div className="relative z-10 h-full flex flex-col justify-between">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
                {card.icon}
              </div>
              {card.trend && (
                <div className={`flex items-center space-x-1 ${getTrendColor(card.trend.direction)}`}>
                  {getTrendIcon(card.trend.direction)}
                  <span className="text-sm font-medium">{card.trend.value}</span>
                </div>
              )}
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {card.title}
              </h3>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {card.value}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {card.subtitle}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ModernBentoGrid;