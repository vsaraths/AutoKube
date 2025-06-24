import React, { useState } from 'react';
import { Heart, Star, Zap, CheckCircle, AlertTriangle, TrendingUp, Activity, Target } from 'lucide-react';

const MicroInteractionsDemo: React.FC = () => {
  const [likedItems, setLikedItems] = useState<Set<string>>(new Set());
  const [starredItems, setStarredItems] = useState<Set<string>>(new Set());
  const [completedTasks, setCompletedTasks] = useState<Set<string>>(new Set());

  const toggleLike = (id: string) => {
    setLikedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const toggleStar = (id: string) => {
    setStarredItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const toggleTask = (id: string) => {
    setCompletedTasks(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const metrics = [
    { id: 'cpu', label: 'CPU Usage', value: 67, icon: Activity, color: 'blue' },
    { id: 'memory', label: 'Memory', value: 42, icon: TrendingUp, color: 'purple' },
    { id: 'network', label: 'Network', value: 89, icon: Target, color: 'green' },
  ];

  const tasks = [
    { id: 'task1', title: 'Update cluster certificates', priority: 'high' },
    { id: 'task2', title: 'Scale production workloads', priority: 'medium' },
    { id: 'task3', title: 'Review security policies', priority: 'low' },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Interactive Elements</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">Micro-interactions and motion UI demonstrations</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Animated Metrics */}
        <div>
          <h3 className="text-md font-medium text-gray-900 dark:text-white mb-4">Animated Metrics</h3>
          <div className="space-y-4">
            {metrics.map((metric) => (
              <div
                key={metric.id}
                className="group p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 cursor-pointer"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <div className={`p-2 rounded-lg bg-${metric.color}-100 dark:bg-${metric.color}-900/30 group-hover:scale-110 transition-transform duration-200`}>
                      <metric.icon size={16} className={`text-${metric.color}-600 dark:text-${metric.color}-400`} />
                    </div>
                    <span className="ml-3 font-medium text-gray-900 dark:text-white">{metric.label}</span>
                  </div>
                  <span className={`text-lg font-bold text-${metric.color}-600 dark:text-${metric.color}-400`}>
                    {metric.value}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r from-${metric.color}-400 to-${metric.color}-600 rounded-full transition-all duration-1000 ease-out group-hover:animate-pulse`}
                    style={{ width: `${metric.value}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Interactive Actions */}
        <div>
          <h3 className="text-md font-medium text-gray-900 dark:text-white mb-4">Interactive Actions</h3>
          <div className="space-y-4">
            {/* Like/Star Buttons */}
            <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Feedback Actions</h4>
              <div className="flex space-x-4">
                <button
                  onClick={() => toggleLike('demo')}
                  className={`group flex items-center px-4 py-2 rounded-lg transition-all duration-200 ${
                    likedItems.has('demo')
                      ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                      : 'bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/20'
                  }`}
                >
                  <Heart
                    size={16}
                    className={`mr-2 transition-all duration-200 ${
                      likedItems.has('demo')
                        ? 'fill-current scale-110'
                        : 'group-hover:scale-110'
                    }`}
                  />
                  <span className="text-sm font-medium">
                    {likedItems.has('demo') ? 'Liked' : 'Like'}
                  </span>
                </button>

                <button
                  onClick={() => toggleStar('demo')}
                  className={`group flex items-center px-4 py-2 rounded-lg transition-all duration-200 ${
                    starredItems.has('demo')
                      ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400'
                      : 'bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-400 hover:bg-yellow-50 dark:hover:bg-yellow-900/20'
                  }`}
                >
                  <Star
                    size={16}
                    className={`mr-2 transition-all duration-200 ${
                      starredItems.has('demo')
                        ? 'fill-current scale-110'
                        : 'group-hover:scale-110'
                    }`}
                  />
                  <span className="text-sm font-medium">
                    {starredItems.has('demo') ? 'Starred' : 'Star'}
                  </span>
                </button>
              </div>
            </div>

            {/* Task Completion */}
            <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Task Management</h4>
              <div className="space-y-2">
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    className={`group flex items-center p-3 rounded-lg transition-all duration-300 cursor-pointer ${
                      completedTasks.has(task.id)
                        ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                        : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-green-300 dark:hover:border-green-600'
                    }`}
                    onClick={() => toggleTask(task.id)}
                  >
                    <div className="relative mr-3">
                      <CheckCircle
                        size={20}
                        className={`transition-all duration-200 ${
                          completedTasks.has(task.id)
                            ? 'text-green-600 dark:text-green-400 scale-110'
                            : 'text-gray-300 dark:text-gray-600 group-hover:text-green-400 group-hover:scale-105'
                        }`}
                      />
                      {completedTasks.has(task.id) && (
                        <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-20"></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <span
                        className={`text-sm font-medium transition-all duration-200 ${
                          completedTasks.has(task.id)
                            ? 'text-green-700 dark:text-green-300 line-through'
                            : 'text-gray-900 dark:text-white'
                        }`}
                      >
                        {task.title}
                      </span>
                    </div>
                    <span
                      className={`text-xs px-2 py-1 rounded-full font-medium ${
                        task.priority === 'high'
                          ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                          : task.priority === 'medium'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
                          : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                      }`}
                    >
                      {task.priority}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Floating Action Button */}
            <div className="relative">
              <button className="group w-full flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 hover:shadow-lg hover:scale-105 active:scale-95">
                <Zap size={20} className="mr-2 group-hover:animate-pulse" />
                <span className="font-medium">Execute AI Action</span>
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 rounded-xl transition-opacity duration-300"></div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Notification */}
      <div className="mt-6 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-xl border border-emerald-200 dark:border-emerald-800">
        <div className="flex items-center">
          <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg mr-3">
            <CheckCircle size={16} className="text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <h4 className="text-sm font-medium text-emerald-800 dark:text-emerald-300">Micro-interactions Active</h4>
            <p className="text-xs text-emerald-600 dark:text-emerald-400">Enhanced user experience with smooth animations and feedback</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MicroInteractionsDemo;