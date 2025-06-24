import React, { useState, useEffect } from 'react';
import { User, Settings, Eye, Brain, Palette, Layout, Zap } from 'lucide-react';

interface PersonalizationSettings {
  theme: 'light' | 'dark' | 'auto';
  layout: 'compact' | 'comfortable' | 'spacious';
  aiInsights: 'minimal' | 'standard' | 'detailed';
  colorScheme: 'blue' | 'purple' | 'green' | 'amber';
  animations: boolean;
  autoRefresh: number; // seconds
}

const AIPersonalizationPanel: React.FC = () => {
  const [settings, setSettings] = useState<PersonalizationSettings>({
    theme: 'auto',
    layout: 'comfortable',
    aiInsights: 'standard',
    colorScheme: 'blue',
    animations: true,
    autoRefresh: 30
  });

  const [isPersonalizing, setIsPersonalizing] = useState(false);
  const [aiRecommendations, setAiRecommendations] = useState<string[]>([]);

  useEffect(() => {
    // Simulate AI-driven personalization recommendations
    const recommendations = [
      'Based on your usage, consider switching to detailed AI insights',
      'Your cluster size suggests a compact layout would be more efficient',
      'Enable auto-refresh for better real-time monitoring',
      'Purple color scheme matches your team\'s branding preferences'
    ];
    setAiRecommendations(recommendations);
  }, []);

  const handleSettingChange = (key: keyof PersonalizationSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const applyAIRecommendations = async () => {
    setIsPersonalizing(true);
    
    // Simulate AI applying personalization
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setSettings({
      theme: 'dark',
      layout: 'compact',
      aiInsights: 'detailed',
      colorScheme: 'purple',
      animations: true,
      autoRefresh: 15
    });
    
    setIsPersonalizing(false);
  };

  const colorSchemes = {
    blue: 'from-blue-500 to-cyan-500',
    purple: 'from-purple-500 to-pink-500',
    green: 'from-green-500 to-emerald-500',
    amber: 'from-amber-500 to-orange-500'
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className={`p-3 rounded-xl bg-gradient-to-r ${colorSchemes[settings.colorScheme]} text-white mr-3`}>
              <Brain size={20} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">AI Personalization</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Adaptive dashboard tailored to your workflow</p>
            </div>
          </div>
          <button
            onClick={applyAIRecommendations}
            disabled={isPersonalizing}
            className={`flex items-center px-4 py-2 text-sm bg-gradient-to-r ${colorSchemes[settings.colorScheme]} text-white rounded-lg hover:shadow-lg transition-all duration-200 disabled:opacity-50`}
          >
            {isPersonalizing ? (
              <>
                <Brain size={16} className="mr-2 animate-pulse" />
                Personalizing...
              </>
            ) : (
              <>
                <Zap size={16} className="mr-2" />
                Apply AI Suggestions
              </>
            )}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Settings Panel */}
          <div className="space-y-4">
            <h3 className="text-md font-medium text-gray-900 dark:text-white mb-4">Preferences</h3>
            
            {/* Theme Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Theme Preference
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['light', 'dark', 'auto'] as const).map((theme) => (
                  <button
                    key={theme}
                    onClick={() => handleSettingChange('theme', theme)}
                    className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                      settings.theme === theme
                        ? `border-${settings.colorScheme}-500 bg-${settings.colorScheme}-50 dark:bg-${settings.colorScheme}-900/20`
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <div className="text-xs font-medium text-gray-900 dark:text-white capitalize">
                      {theme}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Layout Density */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Layout Density
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['compact', 'comfortable', 'spacious'] as const).map((layout) => (
                  <button
                    key={layout}
                    onClick={() => handleSettingChange('layout', layout)}
                    className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                      settings.layout === layout
                        ? `border-${settings.colorScheme}-500 bg-${settings.colorScheme}-50 dark:bg-${settings.colorScheme}-900/20`
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <Layout size={16} className="mx-auto mb-1 text-gray-600 dark:text-gray-400" />
                    <div className="text-xs font-medium text-gray-900 dark:text-white capitalize">
                      {layout}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Color Scheme */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Color Scheme
              </label>
              <div className="grid grid-cols-4 gap-2">
                {(Object.keys(colorSchemes) as Array<keyof typeof colorSchemes>).map((scheme) => (
                  <button
                    key={scheme}
                    onClick={() => handleSettingChange('colorScheme', scheme)}
                    className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                      settings.colorScheme === scheme
                        ? 'border-gray-400 dark:border-gray-500'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <div className={`w-6 h-6 rounded-full bg-gradient-to-r ${colorSchemes[scheme]} mx-auto`}></div>
                    <div className="text-xs font-medium text-gray-900 dark:text-white capitalize mt-1">
                      {scheme}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* AI Insights Level */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                AI Insights Detail
              </label>
              <select
                value={settings.aiInsights}
                onChange={(e) => handleSettingChange('aiInsights', e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              >
                <option value="minimal">Minimal - Key metrics only</option>
                <option value="standard">Standard - Balanced insights</option>
                <option value="detailed">Detailed - Comprehensive analysis</option>
              </select>
            </div>
          </div>

          {/* AI Recommendations */}
          <div>
            <h3 className="text-md font-medium text-gray-900 dark:text-white mb-4 flex items-center">
              <Brain size={18} className="mr-2 text-purple-600 dark:text-purple-400" />
              AI Recommendations
            </h3>
            
            <div className="space-y-3">
              {aiRecommendations.map((recommendation, index) => (
                <div
                  key={index}
                  className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg border border-purple-200 dark:border-purple-800"
                >
                  <div className="flex items-start">
                    <div className="w-2 h-2 rounded-full bg-purple-500 mt-2 mr-3 flex-shrink-0"></div>
                    <p className="text-sm text-purple-800 dark:text-purple-300">{recommendation}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="mt-6 space-y-2">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Quick Actions</h4>
              <div className="grid grid-cols-2 gap-2">
                <button className="flex items-center justify-center px-3 py-2 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                  <Eye size={14} className="mr-1" />
                  Preview Changes
                </button>
                <button className="flex items-center justify-center px-3 py-2 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                  <Settings size={14} className="mr-1" />
                  Reset to Default
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Live Preview */}
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Live Preview</h4>
          <div className={`p-4 rounded-lg bg-gradient-to-r ${colorSchemes[settings.colorScheme]} bg-opacity-10`}>
            <div className="flex items-center justify-between">
              <div>
                <h5 className="font-medium text-gray-900 dark:text-white">Dashboard Preview</h5>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {settings.layout} layout • {settings.aiInsights} insights • {settings.theme} theme
                </p>
              </div>
              <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${colorSchemes[settings.colorScheme]} flex items-center justify-center`}>
                <User size={20} className="text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIPersonalizationPanel;