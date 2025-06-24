/**
 * API service for AutoKube
 * Handles communication with backend services
 */

// Base API URL - can be configured based on environment
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

// Generic fetch wrapper with error handling
async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  // Add default headers
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  try {
    const response = await fetch(url, { ...options, headers });
    
    // Handle non-2xx responses
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `API error: ${response.status}`);
    }
    
    // Parse JSON response
    return await response.json();
  } catch (error) {
    console.error(`API request failed: ${endpoint}`, error);
    throw error;
  }
}

// API endpoints
export const api = {
  // Cluster management
  clusters: {
    getAll: () => fetchWithAuth('/clusters'),
    getById: (id: string) => fetchWithAuth(`/clusters/${id}`),
    getStatus: (id: string) => fetchWithAuth(`/clusters/${id}/status`),
  },
  
  // Issue detection and remediation
  issues: {
    detect: (namespace: string) => fetchWithAuth(`/issues/detect?namespace=${namespace}`),
    getAll: () => fetchWithAuth('/issues'),
    getById: (id: string) => fetchWithAuth(`/issues/${id}`),
    applyFix: (issueId: string, autoApprove = false) => 
      fetchWithAuth(`/issues/${issueId}/fix`, {
        method: 'POST',
        body: JSON.stringify({ autoApprove }),
      }),
  },
  
  // AI analysis
  ai: {
    analyzeCluster: (clusterId: string) => 
      fetchWithAuth(`/ai/analyze?clusterId=${clusterId}`),
    getPredictions: (namespace: string) => 
      fetchWithAuth(`/ai/predict?namespace=${namespace}`),
    getRecommendations: () => fetchWithAuth('/ai/recommendations'),
  },
  
  // Security
  security: {
    getThreats: () => fetchWithAuth('/security/threats'),
    getAnomalies: () => fetchWithAuth('/security/anomalies'),
    respondToThreat: (threatId: string, action: string) => 
      fetchWithAuth(`/security/threats/${threatId}/respond`, {
        method: 'POST',
        body: JSON.stringify({ action }),
      }),
  },
  
  // Cost optimization
  costs: {
    getAnalysis: () => fetchWithAuth('/costs/analysis'),
    getRecommendations: () => fetchWithAuth('/costs/recommendations'),
    applyRecommendation: (recommendationId: string) => 
      fetchWithAuth(`/costs/recommendations/${recommendationId}/apply`, {
        method: 'POST',
      }),
  },
  
  // System status
  system: {
    getStatus: () => fetchWithAuth('/system/status'),
    getLogs: (lines = 100) => fetchWithAuth(`/system/logs?lines=${lines}`),
  },
};

export default api;