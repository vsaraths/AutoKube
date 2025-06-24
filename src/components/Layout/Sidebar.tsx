import React from 'react';
import { Home, BarChart2, Terminal, AlertTriangle, Settings, HelpCircle, Cloud, Database, GitBranch, Activity } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
}

interface SidebarItem {
  icon: React.ReactNode;
  label: string;
  isActive?: boolean;
  badge?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  const mainItems: SidebarItem[] = [
    { icon: <Home size={20} />, label: 'Dashboard', isActive: true },
    { icon: <Cloud size={20} />, label: 'Clusters', badge: '3' },
    { icon: <AlertTriangle size={20} />, label: 'Alerts', badge: '12' },
    { icon: <Activity size={20} />, label: 'Monitoring' },
    { icon: <Terminal size={20} />, label: 'Logs' },
    { icon: <GitBranch size={20} />, label: 'GitOps' },
    { icon: <Database size={20} />, label: 'Resources' },
    { icon: <BarChart2 size={20} />, label: 'Analytics' },
  ];

  const bottomItems: SidebarItem[] = [
    { icon: <Settings size={20} />, label: 'Settings' },
    { icon: <HelpCircle size={20} />, label: 'Help & Support' },
  ];

  const renderItem = (item: SidebarItem, index: number) => (
    <li key={index}>
      <a
        href="#"
        className={`flex items-center justify-between py-3 px-4 rounded-lg transition-all group ${
          item.isActive 
            ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 shadow-sm' 
            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700'
        }`}
      >
        <div className="flex items-center">
          <span className="mr-3">{item.icon}</span>
          <span className={`${isOpen ? 'opacity-100' : 'opacity-0'} transition-opacity duration-200 font-medium`}>
            {item.label}
          </span>
        </div>
        {item.badge && isOpen && (
          <span className="bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 text-xs font-medium px-2 py-0.5 rounded-full">
            {item.badge}
          </span>
        )}
      </a>
    </li>
  );

  return (
    <div 
      className={`fixed top-16 left-0 h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 ${
        isOpen ? 'w-64' : 'w-16'
      } z-10 shadow-sm`}
    >
      <div className="flex flex-col justify-between h-[calc(100vh-4rem)] p-4">
        <div>
          <div className={`mb-6 ${isOpen ? 'block' : 'hidden'}`}>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Main Menu</h3>
          </div>
          <ul className="space-y-2">
            {mainItems.map(renderItem)}
          </ul>
        </div>
        <div>
          <div className={`mb-4 ${isOpen ? 'block' : 'hidden'}`}>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Support</h3>
          </div>
          <ul className="space-y-2">
            {bottomItems.map(renderItem)}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;