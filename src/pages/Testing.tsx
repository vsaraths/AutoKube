import React from 'react';
import Layout from '../components/Layout/Layout';
import AutoRemediationTester from '../components/Testing/AutoRemediationTester';
import KubernetesTestCommands from '../components/Testing/KubernetesTestCommands';
import AIFixReviewer from '../components/Testing/AIFixReviewer';
import LargeScaleValidator from '../components/Testing/LargeScaleValidator';
import DeploymentScenarioValidator from '../components/Testing/DeploymentScenarioValidator';

const Testing: React.FC = () => {
  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">AI Auto-Remediation Testing</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Comprehensive testing framework for AI-powered Kubernetes troubleshooting and auto-remediation
        </p>
      </div>
      
      <div className="space-y-8">
        {/* 🚀 REAL-WORLD DEPLOYMENT SCENARIO VALIDATION */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <span className="w-2 h-2 rounded-full bg-gradient-to-r from-red-500 to-purple-500 mr-3"></span>
            🚀 Real-World Deployment Scenario Validation
          </h2>
          <DeploymentScenarioValidator />
        </div>
        
        {/* Large-Scale Validation */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Large-Scale Remediation Validation</h2>
          <LargeScaleValidator />
        </div>
        
        {/* AI Fix Review System */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">AI Fix Review & Validation</h2>
          <AIFixReviewer />
        </div>
        
        {/* Interactive Test Runner */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Interactive Test Runner</h2>
          <AutoRemediationTester />
        </div>
        
        {/* Manual Test Commands */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Manual Testing Commands</h2>
          <KubernetesTestCommands />
        </div>
      </div>
    </Layout>
  );
};

export default Testing;