import React from 'react';
import Layout from '../components/Layout/Layout';
import ClusterHealth from '../components/Dashboard/ClusterHealth';
import ResourceUsage from '../components/Dashboard/ResourceUsage';
import TroubleshootingAI from '../components/Dashboard/TroubleshootingAI';
import RecentIssues from '../components/Dashboard/RecentIssues';
import ClusterVisualization from '../components/Dashboard/ClusterVisualization';
import AISummary from '../components/Dashboard/AISummary';
import AutoKubeCLI from '../components/Dashboard/AITroubleshooterCLI';
import HelmIntegration from '../components/Dashboard/HelmIntegration';
import LiveErrorAnalysis from '../components/Dashboard/LiveErrorAnalysis';
import TestingQuickAccess from '../components/Dashboard/TestingQuickAccess';
import PredictiveAnalytics from '../components/Dashboard/PredictiveAnalytics';
import IncidentInsights from '../components/Dashboard/IncidentInsights';
import ModernBentoGrid from '../components/Dashboard/ModernBentoGrid';
import AIPersonalizationPanel from '../components/Dashboard/AIPersonalizationPanel';
import MicroInteractionsDemo from '../components/Dashboard/MicroInteractionsDemo';
import MinimalistAdaptiveUI from '../components/Dashboard/MinimalistAdaptiveUI';
import GlassmorphismDashboard from '../components/Dashboard/GlassmorphismDashboard';
import MultiClusterCoordinator from '../components/Dashboard/MultiClusterCoordinator';
import AIClusterPrioritization from '../components/Dashboard/AIClusterPrioritization';
import CICDIntegration from '../components/Dashboard/CICDIntegration';
import SecurityThreatDetector from '../components/Dashboard/SecurityThreatDetector';
import CrossCloudFailover from '../components/Dashboard/CrossCloudFailover';
import HybridKubernetesManager from '../components/Dashboard/HybridKubernetesManager';
import CostOptimizationAnalyzer from '../components/Dashboard/CostOptimizationAnalyzer';

const Dashboard: React.FC = () => {
  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent mb-2">
          AutoKube Dashboard 2025
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          AI-powered Kubernetes monitoring with futuristic glassmorphism design
        </p>
      </div>
      
      <div className="space-y-8">
        {/* 🚀 FUTURISTIC GLASSMORPHISM DASHBOARD */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <span className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 mr-3 animate-pulse"></span>
            🚀 Futuristic Glassmorphism Dashboard
          </h2>
          <div className="rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
            <GlassmorphismDashboard />
          </div>
        </div>

        {/* 🔄 CROSS-CLOUD AI FAILOVER */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <span className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 mr-3"></span>
            🔄 Cross-Cloud AI Failover
          </h2>
          <CrossCloudFailover />
        </div>

        {/* 🌐 HYBRID KUBERNETES MANAGER */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <span className="w-2 h-2 rounded-full bg-gradient-to-r from-green-500 to-blue-500 mr-3"></span>
            🌐 Hybrid Kubernetes Manager
          </h2>
          <HybridKubernetesManager />
        </div>

        {/* 📊 COST OPTIMIZATION ANALYZER */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <span className="w-2 h-2 rounded-full bg-gradient-to-r from-green-500 to-blue-500 mr-3"></span>
            📊 Cost Optimization Analyzer
          </h2>
          <CostOptimizationAnalyzer />
        </div>

        {/* 🔒 AI SECURITY THREAT DETECTOR */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <span className="w-2 h-2 rounded-full bg-gradient-to-r from-red-500 to-purple-500 mr-3"></span>
            🔒 AI Security Threat Detector
          </h2>
          <SecurityThreatDetector />
        </div>

        {/* 🔄 AI-POWERED CI/CD INTEGRATION */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <span className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-green-500 mr-3"></span>
            🔄 AI-Powered CI/CD Integration
          </h2>
          <CICDIntegration />
        </div>

        {/* 🌐 MULTI-CLUSTER AI COORDINATION */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <span className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-green-500 mr-3"></span>
            🌐 Multi-Cluster AI Coordination
          </h2>
          <MultiClusterCoordinator />
        </div>

        {/* 🧠 AI CLUSTER PRIORITIZATION ENGINE */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <span className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 mr-3"></span>
            🧠 AI Cluster Prioritization Engine
          </h2>
          <AIClusterPrioritization />
        </div>

        {/* 2025 Design Trends Showcase */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <span className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 mr-3"></span>
            Modern Bento Grid Layout
          </h2>
          <ModernBentoGrid />
        </div>

        {/* AI Personalization */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <span className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 mr-3"></span>
            AI-Powered Hyper-Personalization
          </h2>
          <AIPersonalizationPanel />
        </div>

        {/* Micro-Interactions & Motion UI */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <span className="w-2 h-2 rounded-full bg-gradient-to-r from-green-500 to-blue-500 mr-3"></span>
            Micro-Interactions & Motion UI
          </h2>
          <MicroInteractionsDemo />
        </div>

        {/* Minimalist & Adaptive UI */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <span className="w-2 h-2 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 mr-3"></span>
            Minimalist & Adaptive Interface
          </h2>
          <MinimalistAdaptiveUI />
        </div>
        
        {/* Resource Usage Cards */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Resource Overview</h2>
          <ResourceUsage />
        </div>
        
        {/* AI Incident Insights */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">AI Incident Insights</h2>
          <IncidentInsights />
        </div>
        
        {/* Predictive Analytics */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">AI Predictive Analytics</h2>
          <PredictiveAnalytics />
        </div>
        
        {/* Live Error Analysis */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Real-Time Error Analysis</h2>
          <LiveErrorAnalysis />
        </div>
        
        {/* Cluster Health and Visualization */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <ClusterHealth />
          <ClusterVisualization />
        </div>
        
        {/* AI Features */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className="space-y-6">
            <AISummary />
            <AutoKubeCLI />
          </div>
          <TroubleshootingAI />
        </div>
        
        {/* Issues, Helm, and Testing */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <RecentIssues />
          <HelmIntegration />
          <TestingQuickAccess />
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;