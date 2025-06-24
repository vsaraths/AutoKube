import React, { useState } from 'react';
import { Monitor, Smartphone, Tablet, Eye, Type, Contrast, Accessibility } from 'lucide-react';

const MinimalistAdaptiveUI: React.FC = () => {
  const [viewportSize, setViewportSize] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [contrastMode, setContrastMode] = useState<'normal' | 'high'>('normal');
  const [fontSize, setFontSize] = useState<'small' | 'medium' | 'large'>('medium');

  const getViewportIcon = (size: string) => {
    switch (size) {
      case 'desktop':
        return <Monitor size={20} />;
      case 'tablet':
        return <Tablet size={20} />;
      case 'mobile':
        return <Smartphone size={20} />;
      default:
        return <Monitor size={20} />;
    }
  };

  const getContainerClasses = () => {
    const base = 'transition-all duration-300 rounded-2xl border';
    const contrast = contrastMode === 'high' 
      ? 'bg-black text-white border-white' 
      : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-200 dark:border-gray-700';
    
    const spacing = viewportSize === 'mobile' ? 'p-4' : viewportSize === 'tablet' ? 'p-5' : 'p-6';
    
    return `${base} ${contrast} ${spacing}`;
  };

  const getTextClasses = () => {
    const size = fontSize === 'small' ? 'text-sm' : fontSize === 'large' ? 'text-lg' : 'text-base';
    const contrast = contrastMode === 'high' ? 'text-white' : 'text-gray-600 dark:text-gray-400';
    return `${size} ${contrast}`;
  };

  const getHeadingClasses = () => {
    const size = fontSize === 'small' ? 'text-lg' : fontSize === 'large' ? 'text-2xl' : 'text-xl';
    const contrast = contrastMode === 'high' ? 'text-white' : 'text-gray-900 dark:text-white';
    return `${size} font-semibold ${contrast}`;
  };

  return (
    <div className={getContainerClasses()}>
      {/* Adaptive Controls */}
      <div className="flex flex-wrap items-center justify-between mb-6 gap-4">
        <div className="flex items-center">
          <div className={`p-2 rounded-lg mr-3 ${contrastMode === 'high' ? 'bg-white text-black' : 'bg-blue-100 dark:bg-blue-900/30'}`}>
            <Eye size={20} className={contrastMode === 'high' ? 'text-black' : 'text-blue-600 dark:text-blue-400'} />
          </div>
          <div>
            <h2 className={getHeadingClasses()}>Adaptive Interface</h2>
            <p className={getTextClasses()}>Minimalist design with accessibility features</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Viewport Size Controls */}
          <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            {(['desktop', 'tablet', 'mobile'] as const).map((size) => (
              <button
                key={size}
                onClick={() => setViewportSize(size)}
                className={`p-2 rounded-md transition-all duration-200 ${
                  viewportSize === size
                    ? contrastMode === 'high' 
                      ? 'bg-white text-black' 
                      : 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                    : contrastMode === 'high'
                      ? 'text-gray-300 hover:text-white'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
                title={`${size} view`}
              >
                {getViewportIcon(size)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Accessibility Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Contrast Toggle */}
        <div className={`p-4 rounded-xl border ${contrastMode === 'high' ? 'border-white bg-gray-900' : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50'}`}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <Contrast size={16} className={contrastMode === 'high' ? 'text-white mr-2' : 'text-gray-600 dark:text-gray-400 mr-2'} />
              <span className={`text-sm font-medium ${contrastMode === 'high' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                Contrast
              </span>
            </div>
            <button
              onClick={() => setContrastMode(contrastMode === 'high' ? 'normal' : 'high')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                contrastMode === 'high' ? 'bg-white' : 'bg-gray-200 dark:bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full transition-transform ${
                  contrastMode === 'high' 
                    ? 'translate-x-6 bg-black' 
                    : 'translate-x-1 bg-white dark:bg-gray-300'
                }`}
              />
            </button>
          </div>
          <p className={`text-xs ${contrastMode === 'high' ? 'text-gray-300' : 'text-gray-500 dark:text-gray-400'}`}>
            {contrastMode === 'high' ? 'High contrast enabled' : 'Normal contrast'}
          </p>
        </div>

        {/* Font Size Control */}
        <div className={`p-4 rounded-xl border ${contrastMode === 'high' ? 'border-white bg-gray-900' : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50'}`}>
          <div className="flex items-center mb-2">
            <Type size={16} className={contrastMode === 'high' ? 'text-white mr-2' : 'text-gray-600 dark:text-gray-400 mr-2'} />
            <span className={`text-sm font-medium ${contrastMode === 'high' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
              Font Size
            </span>
          </div>
          <div className="flex space-x-1">
            {(['small', 'medium', 'large'] as const).map((size) => (
              <button
                key={size}
                onClick={() => setFontSize(size)}
                className={`px-2 py-1 text-xs rounded transition-all duration-200 ${
                  fontSize === size
                    ? contrastMode === 'high'
                      ? 'bg-white text-black'
                      : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                    : contrastMode === 'high'
                      ? 'text-gray-300 hover:text-white'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                {size.charAt(0).toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Accessibility Score */}
        <div className={`p-4 rounded-xl border ${contrastMode === 'high' ? 'border-white bg-gray-900' : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50'}`}>
          <div className="flex items-center mb-2">
            <Accessibility size={16} className={contrastMode === 'high' ? 'text-white mr-2' : 'text-green-600 dark:text-green-400 mr-2'} />
            <span className={`text-sm font-medium ${contrastMode === 'high' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
              Accessibility
            </span>
          </div>
          <div className="flex items-center">
            <span className={`text-lg font-bold ${contrastMode === 'high' ? 'text-white' : 'text-green-600 dark:text-green-400'}`}>
              {contrastMode === 'high' ? '98' : '92'}/100
            </span>
            <span className={`text-xs ml-2 ${contrastMode === 'high' ? 'text-gray-300' : 'text-gray-500 dark:text-gray-400'}`}>
              WCAG AA
            </span>
          </div>
        </div>
      </div>

      {/* Adaptive Content Layout */}
      <div className={`grid gap-4 ${
        viewportSize === 'mobile' ? 'grid-cols-1' : 
        viewportSize === 'tablet' ? 'grid-cols-2' : 
        'grid-cols-3'
      }`}>
        {/* Sample Cards */}
        {[1, 2, 3].map((index) => (
          <div
            key={index}
            className={`p-4 rounded-xl border transition-all duration-300 hover:shadow-lg ${
              contrastMode === 'high' 
                ? 'border-white bg-gray-800 hover:bg-gray-700' 
                : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600'
            }`}
          >
            <div className={`w-full h-20 rounded-lg mb-3 ${
              contrastMode === 'high' ? 'bg-white' : 'bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30'
            }`}></div>
            <h3 className={`font-medium mb-1 ${
              fontSize === 'small' ? 'text-sm' : fontSize === 'large' ? 'text-lg' : 'text-base'
            } ${contrastMode === 'high' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
              Metric {index}
            </h3>
            <p className={getTextClasses()}>
              {viewportSize === 'mobile' ? 'Compact view' : 'Detailed information about this metric'}
            </p>
          </div>
        ))}
      </div>

      {/* Responsive Typography Demo */}
      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <h3 className={getHeadingClasses()}>Responsive Typography</h3>
        <p className={`mt-2 ${getTextClasses()}`}>
          This interface automatically adapts to different screen sizes and accessibility preferences. 
          The typography scales appropriately, contrast can be enhanced for better readability, 
          and the layout reorganizes based on the viewport size.
        </p>
        
        <div className="mt-4 flex flex-wrap gap-2">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            contrastMode === 'high' 
              ? 'bg-white text-black' 
              : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
          }`}>
            {viewportSize} layout
          </span>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            contrastMode === 'high' 
              ? 'bg-white text-black' 
              : 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
          }`}>
            {fontSize} text
          </span>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            contrastMode === 'high' 
              ? 'bg-white text-black' 
              : 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
          }`}>
            {contrastMode} contrast
          </span>
        </div>
      </div>
    </div>
  );
};

export default MinimalistAdaptiveUI;