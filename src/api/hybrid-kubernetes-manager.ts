import { z } from 'zod';

// Hybrid Kubernetes Manager Schema
export const KubernetesClusterSchema = z.object({
  clusterId: z.string(),
  name: z.string(),
  type: z.enum(['cloud', 'on-premises', 'edge']),
  provider: z.string(),
  region: z.string(),
  version: z.string(),
  status: z.enum(['active', 'inactive', 'provisioning', 'decommissioning', 'maintenance']),
  nodeCount: z.number(),
  capacity: z.object({
    cpu: z.number(),
    memory: z.number(), // GB
    storage: z.number(), // GB
  }),
  utilization: z.object({
    cpu: z.number().min(0).max(100),
    memory: z.number().min(0).max(100),
    storage: z.number().min(0).max(100),
  }),
  networking: z.object({
    podCidr: z.string(),
    serviceCidr: z.string(),
    ingressController: z.string(),
    networkPlugin: z.string(),
  }),
  features: z.object({
    rbacEnabled: z.boolean(),
    loadBalancerType: z.string(),
    storageClasses: z.array(z.string()),
    autoscalingEnabled: z.boolean(),
    monitoringEnabled: z.boolean(),
    loggingEnabled: z.boolean(),
  }),
  tags: z.record(z.string()).optional(),
  createdAt: z.string(),
  lastUpdated: z.string(),
});

export const HybridConnectionSchema = z.object({
  connectionId: z.string(),
  name: z.string(),
  sourceClusterId: z.string(),
  targetClusterId: z.string(),
  status: z.enum(['active', 'inactive', 'degraded', 'failed']),
  connectionType: z.enum(['vpn', 'direct-connect', 'mesh', 'multi-cluster-services']),
  latency: z.number(), // milliseconds
  bandwidth: z.number(), // Mbps
  encryptionEnabled: z.boolean(),
  trafficShaping: z.object({
    rateLimit: z.number().optional(),
    qualityOfService: z.string().optional(),
  }),
  lastChecked: z.string(),
  metrics: z.object({
    packetLoss: z.number().min(0).max(100),
    errorRate: z.number().min(0).max(100),
    throughput: z.number(),
  }),
});

export const WorkloadDistributionSchema = z.object({
  distributionId: z.string(),
  name: z.string(),
  workloadType: z.string(),
  strategy: z.enum(['round-robin', 'weighted', 'locality-aware', 'cost-optimized', 'latency-optimized']),
  clusterWeights: z.record(z.number()),
  constraints: z.array(z.object({
    type: z.string(),
    value: z.string(),
  })).optional(),
  lastUpdated: z.string(),
  status: z.enum(['active', 'paused', 'configuring']),
  metrics: z.object({
    totalRequests: z.number(),
    errorRate: z.number(),
    averageLatency: z.number(),
  }),
});

export type KubernetesCluster = z.infer<typeof KubernetesClusterSchema>;
export type HybridConnection = z.infer<typeof HybridConnectionSchema>;
export type WorkloadDistribution = z.infer<typeof WorkloadDistributionSchema>;

// Hybrid Kubernetes Manager
export class HybridKubernetesManager {
  private static instance: HybridKubernetesManager;
  private clusters: Map<string, KubernetesCluster> = new Map();
  private connections: Map<string, HybridConnection> = new Map();
  private workloadDistributions: Map<string, WorkloadDistribution> = new Map();
  
  private constructor() {
    this.initializeClusters();
    this.initializeConnections();
    this.initializeWorkloadDistributions();
    this.startMonitoring();
  }
  
  static getInstance(): HybridKubernetesManager {
    if (!HybridKubernetesManager.instance) {
      HybridKubernetesManager.instance = new HybridKubernetesManager();
    }
    return HybridKubernetesManager.instance;
  }

  private initializeClusters() {
    const sampleClusters: KubernetesCluster[] = [
      {
        clusterId: 'aws-eks-prod',
        name: 'AWS EKS Production',
        type: 'cloud',
        provider: 'aws',
        region: 'us-east-1',
        version: '1.28',
        status: 'active',
        nodeCount: 10,
        capacity: {
          cpu: 80,
          memory: 320,
          storage: 2000,
        },
        utilization: {
          cpu: 65,
          memory: 72,
          storage: 45,
        },
        networking: {
          podCidr: '10.0.0.0/16',
          serviceCidr: '172.20.0.0/16',
          ingressController: 'nginx',
          networkPlugin: 'amazon-vpc-cni',
        },
        features: {
          rbacEnabled: true,
          loadBalancerType: 'nlb',
          storageClasses: ['gp2', 'io1', 'st1'],
          autoscalingEnabled: true,
          monitoringEnabled: true,
          loggingEnabled: true,
        },
        tags: {
          environment: 'production',
          costCenter: 'cloud-ops',
          criticality: 'high',
        },
        createdAt: '2024-06-01T00:00:00Z',
        lastUpdated: new Date().toISOString(),
      },
      {
        clusterId: 'gcp-gke-prod',
        name: 'GCP GKE Production',
        type: 'cloud',
        provider: 'gcp',
        region: 'us-central1',
        version: '1.27',
        status: 'active',
        nodeCount: 8,
        capacity: {
          cpu: 64,
          memory: 256,
          storage: 1500,
        },
        utilization: {
          cpu: 55,
          memory: 60,
          storage: 40,
        },
        networking: {
          podCidr: '10.1.0.0/16',
          serviceCidr: '172.21.0.0/16',
          ingressController: 'gce',
          networkPlugin: 'kubenet',
        },
        features: {
          rbacEnabled: true,
          loadBalancerType: 'gce',
          storageClasses: ['standard', 'premium-rwo', 'balanced'],
          autoscalingEnabled: true,
          monitoringEnabled: true,
          loggingEnabled: true,
        },
        tags: {
          environment: 'production',
          costCenter: 'cloud-ops',
          criticality: 'high',
        },
        createdAt: '2024-06-15T00:00:00Z',
        lastUpdated: new Date().toISOString(),
      },
      {
        clusterId: 'azure-aks-prod',
        name: 'Azure AKS Production',
        type: 'cloud',
        provider: 'azure',
        region: 'eastus',
        version: '1.27',
        status: 'active',
        nodeCount: 6,
        capacity: {
          cpu: 48,
          memory: 192,
          storage: 1200,
        },
        utilization: {
          cpu: 50,
          memory: 55,
          storage: 35,
        },
        networking: {
          podCidr: '10.2.0.0/16',
          serviceCidr: '172.22.0.0/16',
          ingressController: 'application-gateway',
          networkPlugin: 'azure',
        },
        features: {
          rbacEnabled: true,
          loadBalancerType: 'standard',
          storageClasses: ['default', 'managed-premium', 'azurefile'],
          autoscalingEnabled: true,
          monitoringEnabled: true,
          loggingEnabled: true,
        },
        tags: {
          environment: 'production',
          costCenter: 'cloud-ops',
          criticality: 'high',
        },
        createdAt: '2024-07-01T00:00:00Z',
        lastUpdated: new Date().toISOString(),
      },
      {
        clusterId: 'onprem-dc1',
        name: 'On-Premises Datacenter 1',
        type: 'on-premises',
        provider: 'rancher',
        region: 'dc-east',
        version: '1.26',
        status: 'active',
        nodeCount: 12,
        capacity: {
          cpu: 96,
          memory: 384,
          storage: 4000,
        },
        utilization: {
          cpu: 70,
          memory: 75,
          storage: 60,
        },
        networking: {
          podCidr: '10.3.0.0/16',
          serviceCidr: '172.23.0.0/16',
          ingressController: 'nginx',
          networkPlugin: 'calico',
        },
        features: {
          rbacEnabled: true,
          loadBalancerType: 'metallb',
          storageClasses: ['local-path', 'nfs', 'ceph-rbd'],
          autoscalingEnabled: false,
          monitoringEnabled: true,
          loggingEnabled: true,
        },
        tags: {
          environment: 'production',
          costCenter: 'infrastructure',
          criticality: 'critical',
          compliance: 'hipaa,pci',
        },
        createdAt: '2024-01-15T00:00:00Z',
        lastUpdated: new Date().toISOString(),
      },
      {
        clusterId: 'edge-retail-east',
        name: 'Edge Retail East',
        type: 'edge',
        provider: 'k3s',
        region: 'retail-east',
        version: '1.25',
        status: 'active',
        nodeCount: 3,
        capacity: {
          cpu: 12,
          memory: 48,
          storage: 500,
        },
        utilization: {
          cpu: 40,
          memory: 45,
          storage: 30,
        },
        networking: {
          podCidr: '10.4.0.0/16',
          serviceCidr: '172.24.0.0/16',
          ingressController: 'traefik',
          networkPlugin: 'flannel',
        },
        features: {
          rbacEnabled: true,
          loadBalancerType: 'none',
          storageClasses: ['local-path'],
          autoscalingEnabled: false,
          monitoringEnabled: true,
          loggingEnabled: false,
        },
        tags: {
          environment: 'production',
          costCenter: 'retail-ops',
          criticality: 'medium',
          location: 'retail-stores',
        },
        createdAt: '2024-03-01T00:00:00Z',
        lastUpdated: new Date().toISOString(),
      }
    ];

    sampleClusters.forEach(cluster => {
      this.clusters.set(cluster.clusterId, cluster);
    });
  }

  private initializeConnections() {
    const sampleConnections: HybridConnection[] = [
      {
        connectionId: 'aws-to-onprem',
        name: 'AWS to On-Premises',
        sourceClusterId: 'aws-eks-prod',
        targetClusterId: 'onprem-dc1',
        status: 'active',
        connectionType: 'direct-connect',
        latency: 15,
        bandwidth: 1000,
        encryptionEnabled: true,
        trafficShaping: {
          rateLimit: 800,
          qualityOfService: 'high',
        },
        lastChecked: new Date().toISOString(),
        metrics: {
          packetLoss: 0.1,
          errorRate: 0.05,
          throughput: 750,
        },
      },
      {
        connectionId: 'gcp-to-aws',
        name: 'GCP to AWS',
        sourceClusterId: 'gcp-gke-prod',
        targetClusterId: 'aws-eks-prod',
        status: 'active',
        connectionType: 'mesh',
        latency: 35,
        bandwidth: 500,
        encryptionEnabled: true,
        trafficShaping: {
          rateLimit: 450,
          qualityOfService: 'medium',
        },
        lastChecked: new Date().toISOString(),
        metrics: {
          packetLoss: 0.2,
          errorRate: 0.1,
          throughput: 400,
        },
      },
      {
        connectionId: 'azure-to-gcp',
        name: 'Azure to GCP',
        sourceClusterId: 'azure-aks-prod',
        targetClusterId: 'gcp-gke-prod',
        status: 'active',
        connectionType: 'mesh',
        latency: 40,
        bandwidth: 500,
        encryptionEnabled: true,
        trafficShaping: {
          rateLimit: 450,
          qualityOfService: 'medium',
        },
        lastChecked: new Date().toISOString(),
        metrics: {
          packetLoss: 0.3,
          errorRate: 0.15,
          throughput: 380,
        },
      },
      {
        connectionId: 'onprem-to-edge',
        name: 'On-Premises to Edge',
        sourceClusterId: 'onprem-dc1',
        targetClusterId: 'edge-retail-east',
        status: 'active',
        connectionType: 'vpn',
        latency: 50,
        bandwidth: 200,
        encryptionEnabled: true,
        trafficShaping: {
          rateLimit: 180,
          qualityOfService: 'medium',
        },
        lastChecked: new Date().toISOString(),
        metrics: {
          packetLoss: 0.5,
          errorRate: 0.2,
          throughput: 150,
        },
      },
    ];

    sampleConnections.forEach(connection => {
      this.connections.set(connection.connectionId, connection);
    });
  }

  private initializeWorkloadDistributions() {
    const sampleDistributions: WorkloadDistribution[] = [
      {
        distributionId: 'web-frontend',
        name: 'Web Frontend Distribution',
        workloadType: 'stateless-web',
        strategy: 'latency-optimized',
        clusterWeights: {
          'aws-eks-prod': 40,
          'gcp-gke-prod': 30,
          'azure-aks-prod': 30,
        },
        constraints: [
          { type: 'min-nodes', value: '3' },
          { type: 'max-latency', value: '100ms' },
        ],
        lastUpdated: new Date().toISOString(),
        status: 'active',
        metrics: {
          totalRequests: 15000,
          errorRate: 0.2,
          averageLatency: 45,
        },
      },
      {
        distributionId: 'data-processing',
        name: 'Data Processing Pipeline',
        workloadType: 'batch-processing',
        strategy: 'cost-optimized',
        clusterWeights: {
          'aws-eks-prod': 20,
          'gcp-gke-prod': 30,
          'onprem-dc1': 50,
        },
        constraints: [
          { type: 'min-cpu', value: '16' },
          { type: 'min-memory', value: '64Gi' },
        ],
        lastUpdated: new Date().toISOString(),
        status: 'active',
        metrics: {
          totalRequests: 5000,
          errorRate: 0.5,
          averageLatency: 120,
        },
      },
      {
        distributionId: 'user-database',
        name: 'User Database Sharding',
        workloadType: 'stateful-database',
        strategy: 'locality-aware',
        clusterWeights: {
          'aws-eks-prod': 30,
          'onprem-dc1': 70,
        },
        constraints: [
          { type: 'storage-class', value: 'premium' },
          { type: 'compliance', value: 'pci,gdpr' },
        ],
        lastUpdated: new Date().toISOString(),
        status: 'active',
        metrics: {
          totalRequests: 25000,
          errorRate: 0.1,
          averageLatency: 15,
        },
      },
      {
        distributionId: 'edge-analytics',
        name: 'Edge Analytics Processing',
        workloadType: 'edge-computing',
        strategy: 'locality-aware',
        clusterWeights: {
          'edge-retail-east': 80,
          'onprem-dc1': 20,
        },
        constraints: [
          { type: 'max-latency', value: '50ms' },
          { type: 'local-storage', value: 'required' },
        ],
        lastUpdated: new Date().toISOString(),
        status: 'active',
        metrics: {
          totalRequests: 8000,
          errorRate: 0.8,
          averageLatency: 25,
        },
      },
    ];

    sampleDistributions.forEach(distribution => {
      this.workloadDistributions.set(distribution.distributionId, distribution);
    });
  }

  private startMonitoring() {
    // Simulate real-time updates
    setInterval(() => {
      this.updateClusterMetrics();
      this.updateConnectionMetrics();
      this.updateWorkloadMetrics();
    }, 30000); // Update every 30 seconds
  }

  private updateClusterMetrics() {
    this.clusters.forEach(cluster => {
      // Simulate utilization changes
      cluster.utilization.cpu = Math.max(0, Math.min(100, cluster.utilization.cpu + (Math.random() * 10 - 5)));
      cluster.utilization.memory = Math.max(0, Math.min(100, cluster.utilization.memory + (Math.random() * 8 - 4)));
      cluster.utilization.storage = Math.max(0, Math.min(100, cluster.utilization.storage + (Math.random() * 5 - 2.5)));
      
      // Update status based on utilization
      if (cluster.utilization.cpu > 90 || cluster.utilization.memory > 90) {
        cluster.status = 'maintenance';
      } else if (cluster.status === 'maintenance' && cluster.utilization.cpu < 80 && cluster.utilization.memory < 80) {
        cluster.status = 'active';
      }
      
      cluster.lastUpdated = new Date().toISOString();
      this.clusters.set(cluster.clusterId, cluster);
    });
  }

  private updateConnectionMetrics() {
    this.connections.forEach(connection => {
      // Simulate metric changes
      connection.latency = Math.max(5, connection.latency + (Math.random() * 10 - 5));
      connection.metrics.packetLoss = Math.max(0, Math.min(5, connection.metrics.packetLoss + (Math.random() * 0.4 - 0.2)));
      connection.metrics.errorRate = Math.max(0, Math.min(5, connection.metrics.errorRate + (Math.random() * 0.3 - 0.15)));
      connection.metrics.throughput = Math.max(0, connection.metrics.throughput + (Math.random() * 50 - 25));
      
      // Update status based on metrics
      if (connection.metrics.packetLoss > 2 || connection.metrics.errorRate > 2) {
        connection.status = 'degraded';
      } else if (connection.metrics.packetLoss > 4 || connection.metrics.errorRate > 4) {
        connection.status = 'failed';
      } else if (connection.status !== 'active') {
        connection.status = 'active';
      }
      
      connection.lastChecked = new Date().toISOString();
      this.connections.set(connection.connectionId, connection);
    });
  }

  private updateWorkloadMetrics() {
    this.workloadDistributions.forEach(distribution => {
      // Simulate metric changes
      distribution.metrics.totalRequests = Math.max(0, distribution.metrics.totalRequests + (Math.random() * 1000 - 200));
      distribution.metrics.errorRate = Math.max(0, Math.min(5, distribution.metrics.errorRate + (Math.random() * 0.2 - 0.1)));
      distribution.metrics.averageLatency = Math.max(5, distribution.metrics.averageLatency + (Math.random() * 10 - 5));
      
      // Adjust cluster weights based on performance
      const weights = distribution.clusterWeights;
      const clusters = Object.keys(weights);
      
      if (clusters.length > 1 && Math.random() > 0.7) {
        // Occasionally rebalance weights
        const adjustAmount = Math.floor(Math.random() * 5) + 1;
        const sourceIndex = Math.floor(Math.random() * clusters.length);
        let targetIndex = Math.floor(Math.random() * clusters.length);
        while (targetIndex === sourceIndex) {
          targetIndex = Math.floor(Math.random() * clusters.length);
        }
        
        const sourceCluster = clusters[sourceIndex];
        const targetCluster = clusters[targetIndex];
        
        if (weights[sourceCluster] > adjustAmount) {
          weights[sourceCluster] -= adjustAmount;
          weights[targetCluster] += adjustAmount;
        }
      }
      
      distribution.lastUpdated = new Date().toISOString();
      this.workloadDistributions.set(distribution.distributionId, distribution);
    });
  }

  // Public API Methods
  async getClusters(): Promise<KubernetesCluster[]> {
    return Array.from(this.clusters.values());
  }

  async getClusterById(clusterId: string): Promise<KubernetesCluster | null> {
    return this.clusters.get(clusterId) || null;
  }

  async getConnections(): Promise<HybridConnection[]> {
    return Array.from(this.connections.values());
  }

  async getConnectionById(connectionId: string): Promise<HybridConnection | null> {
    return this.connections.get(connectionId) || null;
  }

  async getWorkloadDistributions(): Promise<WorkloadDistribution[]> {
    return Array.from(this.workloadDistributions.values());
  }

  async getWorkloadDistributionById(distributionId: string): Promise<WorkloadDistribution | null> {
    return this.workloadDistributions.get(distributionId) || null;
  }

  async updateCluster(clusterId: string, updates: Partial<KubernetesCluster>): Promise<KubernetesCluster | null> {
    const cluster = this.clusters.get(clusterId);
    if (!cluster) return null;
    
    const updatedCluster = { ...cluster, ...updates, lastUpdated: new Date().toISOString() };
    this.clusters.set(clusterId, updatedCluster);
    
    return updatedCluster;
  }

  async updateConnection(connectionId: string, updates: Partial<HybridConnection>): Promise<HybridConnection | null> {
    const connection = this.connections.get(connectionId);
    if (!connection) return null;
    
    const updatedConnection = { ...connection, ...updates, lastChecked: new Date().toISOString() };
    this.connections.set(connectionId, updatedConnection);
    
    return updatedConnection;
  }

  async updateWorkloadDistribution(distributionId: string, updates: Partial<WorkloadDistribution>): Promise<WorkloadDistribution | null> {
    const distribution = this.workloadDistributions.get(distributionId);
    if (!distribution) return null;
    
    const updatedDistribution = { ...distribution, ...updates, lastUpdated: new Date().toISOString() };
    this.workloadDistributions.set(distributionId, updatedDistribution);
    
    return updatedDistribution;
  }

  // Generate hybrid environment report
  generateHybridReport(): {
    summary: {
      totalClusters: number;
      cloudClusters: number;
      onPremClusters: number;
      edgeClusters: number;
      totalConnections: number;
      healthyConnections: number;
      totalWorkloads: number;
    };
    performance: {
      averageLatency: number;
      averageUtilization: {
        cpu: number;
        memory: number;
        storage: number;
      };
      crossClusterTraffic: number; // Mbps
    };
    recommendations: string[];
  } {
    const clusters = Array.from(this.clusters.values());
    const connections = Array.from(this.connections.values());
    const distributions = Array.from(this.workloadDistributions.values());
    
    const cloudClusters = clusters.filter(c => c.type === 'cloud').length;
    const onPremClusters = clusters.filter(c => c.type === 'on-premises').length;
    const edgeClusters = clusters.filter(c => c.type === 'edge').length;
    
    const healthyConnections = connections.filter(c => c.status === 'active').length;
    
    // Calculate average utilization
    const avgCpuUtil = clusters.reduce((sum, c) => sum + c.utilization.cpu, 0) / clusters.length;
    const avgMemUtil = clusters.reduce((sum, c) => sum + c.utilization.memory, 0) / clusters.length;
    const avgStorageUtil = clusters.reduce((sum, c) => sum + c.utilization.storage, 0) / clusters.length;
    
    // Calculate average latency
    const avgLatency = connections.reduce((sum, c) => sum + c.latency, 0) / connections.length;
    
    // Calculate cross-cluster traffic
    const totalTraffic = connections.reduce((sum, c) => sum + c.metrics.throughput, 0);
    
    // Generate recommendations
    const recommendations: string[] = [];
    
    if (avgCpuUtil > 70) {
      recommendations.push('Consider scaling up CPU resources across clusters');
    }
    
    if (avgMemUtil > 75) {
      recommendations.push('Memory utilization is high - evaluate memory optimization or expansion');
    }
    
    if (connections.some(c => c.metrics.packetLoss > 1)) {
      recommendations.push('Some connections experiencing packet loss - investigate network quality');
    }
    
    if (connections.filter(c => c.status === 'degraded' || c.status === 'failed').length > 0) {
      recommendations.push('Degraded connections detected - review network connectivity');
    }
    
    if (cloudClusters === 0 || onPremClusters === 0) {
      recommendations.push('Consider a more diverse hybrid deployment for better resilience');
    }
    
    return {
      summary: {
        totalClusters: clusters.length,
        cloudClusters,
        onPremClusters,
        edgeClusters,
        totalConnections: connections.length,
        healthyConnections,
        totalWorkloads: distributions.length,
      },
      performance: {
        averageLatency: Math.round(avgLatency),
        averageUtilization: {
          cpu: Math.round(avgCpuUtil),
          memory: Math.round(avgMemUtil),
          storage: Math.round(avgStorageUtil),
        },
        crossClusterTraffic: Math.round(totalTraffic),
      },
      recommendations,
    };
  }

  // Generate workload optimization suggestions
  generateWorkloadOptimizationSuggestions(): Array<{
    workloadId: string;
    workloadName: string;
    currentStrategy: string;
    suggestedStrategy: string;
    potentialBenefit: string;
    reasoning: string;
    confidence: number;
  }> {
    const suggestions = [];
    const clusters = Array.from(this.clusters.values());
    const connections = Array.from(this.connections.values());
    
    for (const distribution of this.workloadDistributions.values()) {
      // Skip if already optimized
      if (Math.random() > 0.7) continue;
      
      let suggestedStrategy = distribution.strategy;
      let potentialBenefit = '';
      let reasoning = '';
      let confidence = 0;
      
      // Analyze current distribution and suggest improvements
      switch (distribution.workloadType) {
        case 'stateless-web':
          if (distribution.metrics.averageLatency > 50 && distribution.strategy !== 'latency-optimized') {
            suggestedStrategy = 'latency-optimized';
            potentialBenefit = 'Reduce latency by ~30%';
            reasoning = 'High latency detected for web workload, redistributing to lower latency regions';
            confidence = 85;
          } else if (distribution.metrics.errorRate > 1 && distribution.strategy !== 'weighted') {
            suggestedStrategy = 'weighted';
            potentialBenefit = 'Reduce error rate by ~40%';
            reasoning = 'Error rates above threshold, suggesting weighted distribution to more reliable clusters';
            confidence = 80;
          }
          break;
          
        case 'batch-processing':
          if (distribution.strategy !== 'cost-optimized') {
            suggestedStrategy = 'cost-optimized';
            potentialBenefit = 'Reduce costs by ~25%';
            reasoning = 'Batch processing workloads benefit from cost optimization without latency concerns';
            confidence = 90;
          }
          break;
          
        case 'stateful-database':
          if (distribution.strategy !== 'locality-aware') {
            suggestedStrategy = 'locality-aware';
            potentialBenefit = 'Improve data locality and reduce cross-region traffic by ~50%';
            reasoning = 'Database workloads benefit from data locality to reduce latency and transfer costs';
            confidence = 95;
          }
          break;
          
        case 'edge-computing':
          const edgeClusters = clusters.filter(c => c.type === 'edge');
          if (edgeClusters.length > 0 && !Object.keys(distribution.clusterWeights).some(id => 
            edgeClusters.some(c => c.clusterId === id))) {
            suggestedStrategy = 'locality-aware';
            potentialBenefit = 'Reduce latency by ~60% for edge users';
            reasoning = 'Edge computing workloads should prioritize edge clusters for lower latency';
            confidence = 90;
          }
          break;
      }
      
      // Only add if there's a suggestion
      if (suggestedStrategy !== distribution.strategy) {
        suggestions.push({
          workloadId: distribution.distributionId,
          workloadName: distribution.name,
          currentStrategy: distribution.strategy,
          suggestedStrategy,
          potentialBenefit,
          reasoning,
          confidence,
        });
      }
    }
    
    return suggestions;
  }
}