import React from 'react';
import { Cpu, HardDrive, MemoryStick as Memory, TrendingUp, TrendingDown } from 'lucide-react';

// This would be a real chart component in a production app
const MockLineChart: React.FC<{ color: string; data: number[] }> = ({ color, data }) => {
  const max = Math.max(...data);
  return (
    <div className="h-20 w-full flex items-end space-x-1">
      {data.map((value, index) => (
        <div 
          key={index}
          style={{ height: `${(value / max) * 100}%` }}
          className={`flex-1 ${color} rounded-sm opacity-80`}
        ></div>
      ))}
    </div>
  );
};

const ResourceCard: React.FC<{
  title: string;
  value: string;
  subtitle: string;
  icon: React.ReactNode;
  color: string;
  chartColor: string;
  trend: 'up' | 'down';
  trendValue: string;
  data: number[];
}> = ({ title, value, subtitle, icon, color, chartColor, trend, trendValue, data }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center">
          <div className={`p-2 rounded-lg ${color} bg-opacity-10`}>
            {icon}
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</h3>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{value}</p>
          </div>
        </div>
        <div className={`flex items-center text-sm ${trend === 'up' ? 'text-red-600' : 'text-green-600'}`}>
          {trend === 'up' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
          <span className="ml-1">{trendValue}</span>
        </div>
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{subtitle}</p>
      <MockLineChart color={chartColor} data={data} />
    </div>
  );
};

const ResourceUsage: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <ResourceCard
        title="CPU Usage"
        value="67%"
        subtitle="8 cores / 12 cores available"
        icon={<Cpu size={20} className="text-blue-600" />}
        color="bg-blue-50 dark:bg-blue-900/20"
        chartColor="bg-blue-500"
        trend="up"
        trendValue="+5.2%"
        data={[30, 45, 25, 60, 75, 40, 50, 65, 55, 70, 67]}
      />
      <ResourceCard
        title="Memory Usage"
        value="42%"
        subtitle="16.8 GB / 40 GB available"
        icon={<Memory size={20} className="text-purple-600" />}
        color="bg-purple-50 dark:bg-purple-900/20"
        chartColor="bg-purple-500"
        trend="down"
        trendValue="-2.1%"
        data={[50, 45, 48, 42, 38, 40, 45, 43, 41, 44, 42]}
      />
      <ResourceCard
        title="Storage Usage"
        value="28%"
        subtitle="280 GB / 1 TB available"
        icon={<HardDrive size={20} className="text-green-600" />}
        color="bg-green-50 dark:bg-green-900/20"
        chartColor="bg-green-500"
        trend="up"
        trendValue="+1.8%"
        data={[20, 22, 25, 23, 26, 24, 27, 25, 28, 26, 28]}
      />
    </div>
  );
};

export default ResourceUsage;