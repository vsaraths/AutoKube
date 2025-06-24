import { z } from 'zod';

// Cost Optimization Analyzer Schema
export const ResourceCostSchema = z.object({
  resourceId: z.string(),
  resourceType: z.string(),
  namespace: z.string(),
  name: z.string(),
  provider: z.string(),
  region: z.string(),
  costPerHour: z.number(),
  costPerDay: z.number(),
  costPerMonth: z.number(),
  requestedResources: z.object({
    cpu: z.string(),
    memory: z.string(),
    storage: z.string().optional(),
    gpu: z.string().optional(),
  }),
  actualUtilization: z.object({
    cpu: z.number().min(0).max(100),
    memory: z.number().min(0).max(100),
    storage: z.number().min(0).max(100).optional(),
    gpu: z.number().min(0).max(100).optional(),
  }),
  wastedResources: z.object({
    cpu: z.number(),
    memory: z.number(),
    storage: z.number().optional(),
    gpu: z.number().optional(),
  }),
  wastedCost: z.object({
    hourly: z.number(),
    daily: z.number(),
    monthly: z.number(),
  }),
  tags: z.record(z.string()).optional(),
  lastUpdated: z.string(),
});

export const OptimizationRecommendationSchema = z.object({
  recommendationId: z.string(),
  resourceId: z.string(),
  resourceType: z.string(),
  resourceName: z.string(),
  recommendationType: z.enum(['resize', 'shutdown', 'consolidate', 'spot-instance', 'storage-tier', 'autoscale']),
  currentState: z.object({
    cpu: z.string(),
    memory: z.string(),
    storage: z.string().optional(),
    instanceType: z.string().optional(),
    storageClass: z.string().optional(),
  }),
  recommendedState: z.object({
    cpu: z.string(),
    memory: z.string(),
    storage: z.string().optional(),
    instanceType: z.string().optional(),
    storageClass: z.string().optional(),
  }),
  potentialSavings: z.object({
    monthly: z.number(),
    annual: z.number(),
    percentage: z.number(),
  }),
  impact: z.enum(['none', 'low', 'medium', 'high']),
  confidence: z.number().min(0).max(100),
  implementationComplexity: z.enum(['easy', 'medium', 'complex']),
  justification: z.string(),
  implementationSteps: z.array(z.string()),
  status: z.enum(['pending', 'approved', 'rejected', 'implemented']),
});

export const CostTrendSchema = z.object({
  trendId: z.string(),
  resourceType: z.string().optional(),
  namespace: z.string().optional(),
  provider: z.string().optional(),
  period: z.enum(['daily', 'weekly', 'monthly', 'quarterly']),
  dataPoints: z.array(z.object({
    timestamp: z.string(),
    cost: z.number(),
  })),
  trend: z.enum(['increasing', 'decreasing', 'stable', 'volatile']),
  changeRate: z.number(), // percentage
  forecastedIncrease: z.number().optional(), // percentage
  anomalies: z.array(z.object({
    timestamp: z.string(),
    expected: z.number(),
    actual: z.number(),
    deviation: z.number(),
  })).optional(),
});

export const BudgetSchema = z.object({
  budgetId: z.string(),
  name: z.string(),
  scope: z.object({
    namespaces: z.array(z.string()).optional(),
    clusters: z.array(z.string()).optional(),
    labels: z.record(z.string()).optional(),
  }),
  period: z.enum(['monthly', 'quarterly', 'annual']),
  amount: z.number(),
  currentSpend: z.number(),
  forecastedSpend: z.number(),
  alerts: z.array(z.object({
    threshold: z.number(), // percentage
    triggered: z.boolean(),
    notificationChannels: z.array(z.string()),
  })),
  lastUpdated: z.string(),
});

export type ResourceCost = z.infer<typeof ResourceCostSchema>;
export type OptimizationRecommendation = z.infer<typeof OptimizationRecommendationSchema>;
export type CostTrend = z.infer<typeof CostTrendSchema>;
export type Budget = z.infer<typeof BudgetSchema>;

// Cost Optimization Analyzer
export class CostOptimizationAnalyzer {
  private static instance: CostOptimizationAnalyzer;
  private resourceCosts: Map<string, ResourceCost> = new Map();
  private recommendations: Map<string, OptimizationRecommendation> = new Map();
  private costTrends: Map<string, CostTrend> = new Map();
  private budgets: Map<string, Budget> = new Map();
  
  private constructor() {
    this.initializeResourceCosts();
    this.initializeRecommendations();
    this.initializeCostTrends();
    this.initializeBudgets();
    this.startMonitoring();
  }
  
  static getInstance(): CostOptimizationAnalyzer {
    if (!CostOptimizationAnalyzer.instance) {
      CostOptimizationAnalyzer.instance = new CostOptimizationAnalyzer();
    }
    return CostOptimizationAnalyzer.instance;
  }

  private initializeResourceCosts() {
    const sampleResources: ResourceCost[] = [
      {
        resourceId: 'deployment-frontend',
        resourceType: 'Deployment',
        namespace: 'production',
        name: 'frontend',
        provider: 'aws',
        region: 'us-east-1',
        costPerHour: 0.45,
        costPerDay: 10.80,
        costPerMonth: 324.00,
        requestedResources: {
          cpu: '2000m',
          memory: '4Gi',
          storage: '20Gi',
        },
        actualUtilization: {
          cpu: 35,
          memory: 60,
          storage: 45,
        },
        wastedResources: {
          cpu: 1.3,
          memory: 1.6,
          storage: 11,
        },
        wastedCost: {
          hourly: 0.20,
          daily: 4.80,
          monthly: 144.00,
        },
        tags: {
          app: 'frontend',
          team: 'web',
          environment: 'production',
        },
        lastUpdated: new Date().toISOString(),
      },
      {
        resourceId: 'deployment-backend',
        resourceType: 'Deployment',
        namespace: 'production',
        name: 'backend-api',
        provider: 'aws',
        region: 'us-east-1',
        costPerHour: 0.65,
        costPerDay: 15.60,
        costPerMonth: 468.00,
        requestedResources: {
          cpu: '4000m',
          memory: '8Gi',
          storage: '50Gi',
        },
        actualUtilization: {
          cpu: 45,
          memory: 55,
          storage: 30,
        },
        wastedResources: {
          cpu: 2.2,
          memory: 3.6,
          storage: 35,
        },
        wastedCost: {
          hourly: 0.35,
          daily: 8.40,
          monthly: 252.00,
        },
        tags: {
          app: 'backend',
          team: 'api',
          environment: 'production',
        },
        lastUpdated: new Date().toISOString(),
      },
      {
        resourceId: 'statefulset-database',
        resourceType: 'StatefulSet',
        namespace: 'production',
        name: 'postgres-cluster',
        provider: 'aws',
        region: 'us-east-1',
        costPerHour: 1.20,
        costPerDay: 28.80,
        costPerMonth: 864.00,
        requestedResources: {
          cpu: '8000m',
          memory: '32Gi',
          storage: '500Gi',
        },
        actualUtilization: {
          cpu: 30,
          memory: 70,
          storage: 40,
        },
        wastedResources: {
          cpu: 5.6,
          memory: 9.6,
          storage: 300,
        },
        wastedCost: {
          hourly: 0.60,
          daily: 14.40,
          monthly: 432.00,
        },
        tags: {
          app: 'database',
          team: 'data',
          environment: 'production',
        },
        lastUpdated: new Date().toISOString(),
      },
      {
        resourceId: 'deployment-cache',
        resourceType: 'Deployment',
        namespace: 'production',
        name: 'redis-cache',
        provider: 'aws',
        region: 'us-east-1',
        costPerHour: 0.30,
        costPerDay: 7.20,
        costPerMonth: 216.00,
        requestedResources: {
          cpu: '2000m',
          memory: '8Gi',
          storage: '10Gi',
        },
        actualUtilization: {
          cpu: 20,
          memory: 40,
          storage: 30,
        },
        wastedResources: {
          cpu: 1.6,
          memory: 4.8,
          storage: 7,
        },
        wastedCost: {
          hourly: 0.20,
          daily: 4.80,
          monthly: 144.00,
        },
        tags: {
          app: 'cache',
          team: 'infrastructure',
          environment: 'production',
        },
        lastUpdated: new Date().toISOString(),
      },
      {
        resourceId: 'deployment-monitoring',
        resourceType: 'Deployment',
        namespace: 'monitoring',
        name: 'prometheus',
        provider: 'aws',
        region: 'us-east-1',
        costPerHour: 0.40,
        costPerDay: 9.60,
        costPerMonth: 288.00,
        requestedResources: {
          cpu: '4000m',
          memory: '8Gi',
          storage: '100Gi',
        },
        actualUtilization: {
          cpu: 25,
          memory: 60,
          storage: 50,
        },
        wastedResources: {
          cpu: 3.0,
          memory: 3.2,
          storage: 50,
        },
        wastedCost: {
          hourly: 0.25,
          daily: 6.00,
          monthly: 180.00,
        },
        tags: {
          app: 'monitoring',
          team: 'sre',
          environment: 'production',
        },
        lastUpdated: new Date().toISOString(),
      },
      {
        resourceId: 'deployment-analytics',
        resourceType: 'Deployment',
        namespace: 'analytics',
        name: 'data-processing',
        provider: 'gcp',
        region: 'us-central1',
        costPerHour: 0.85,
        costPerDay: 20.40,
        costPerMonth: 612.00,
        requestedResources: {
          cpu: '8000m',
          memory: '16Gi',
          storage: '200Gi',
          gpu: '1',
        },
        actualUtilization: {
          cpu: 15,
          memory: 30,
          storage: 25,
          gpu: 10,
        },
        wastedResources: {
          cpu: 6.8,
          memory: 11.2,
          storage: 150,
          gpu: 0.9,
        },
        wastedCost: {
          hourly: 0.65,
          daily: 15.60,
          monthly: 468.00,
        },
        tags: {
          app: 'analytics',
          team: 'data-science',
          environment: 'production',
        },
        lastUpdated: new Date().toISOString(),
      },
      {
        resourceId: 'deployment-auth',
        resourceType: 'Deployment',
        namespace: 'production',
        name: 'auth-service',
        provider: 'azure',
        region: 'eastus',
        costPerHour: 0.25,
        costPerDay: 6.00,
        costPerMonth: 180.00,
        requestedResources: {
          cpu: '1000m',
          memory: '2Gi',
          storage: '5Gi',
        },
        actualUtilization: {
          cpu: 40,
          memory: 50,
          storage: 30,
        },
        wastedResources: {
          cpu: 0.6,
          memory: 1.0,
          storage: 3.5,
        },
        wastedCost: {
          hourly: 0.10,
          daily: 2.40,
          monthly: 72.00,
        },
        tags: {
          app: 'auth',
          team: 'security',
          environment: 'production',
        },
        lastUpdated: new Date().toISOString(),
      },
    ];

    sampleResources.forEach(resource => {
      this.resourceCosts.set(resource.resourceId, resource);
    });
  }

  private initializeRecommendations() {
    const sampleRecommendations: OptimizationRecommendation[] = [
      {
        recommendationId: 'rec-frontend-resize',
        resourceId: 'deployment-frontend',
        resourceType: 'Deployment',
        resourceName: 'frontend',
        recommendationType: 'resize',
        currentState: {
          cpu: '2000m',
          memory: '4Gi',
          storage: '20Gi',
          instanceType: 't3.large',
        },
        recommendedState: {
          cpu: '1000m',
          memory: '2Gi',
          storage: '10Gi',
          instanceType: 't3.medium',
        },
        potentialSavings: {
          monthly: 144.00,
          annual: 1728.00,
          percentage: 44,
        },
        impact: 'low',
        confidence: 92,
        implementationComplexity: 'easy',
        justification: 'Frontend deployment consistently uses less than 40% of allocated CPU and 60% of memory. Rightsizing will maintain performance while reducing costs.',
        implementationSteps: [
          'Update deployment YAML to reduce resource requests and limits',
          'Apply changes with kubectl apply',
          'Monitor performance for 24 hours to ensure stability',
        ],
        status: 'pending',
      },
      {
        recommendationId: 'rec-database-storage',
        resourceId: 'statefulset-database',
        resourceType: 'StatefulSet',
        resourceName: 'postgres-cluster',
        recommendationType: 'storage-tier',
        currentState: {
          cpu: '8000m',
          memory: '32Gi',
          storage: '500Gi',
          storageClass: 'gp2',
        },
        recommendedState: {
          cpu: '8000m',
          memory: '32Gi',
          storage: '300Gi',
          storageClass: 'gp3',
        },
        potentialSavings: {
          monthly: 180.00,
          annual: 2160.00,
          percentage: 21,
        },
        impact: 'low',
        confidence: 85,
        implementationComplexity: 'medium',
        justification: 'Database is using only 40% of allocated storage. Reducing size and switching to gp3 storage class will maintain performance with significant cost savings.',
        implementationSteps: [
          'Create new PVCs with gp3 storage class',
          'Perform data migration to new volumes',
          'Update StatefulSet to use new PVCs',
          'Verify data integrity and performance',
        ],
        status: 'pending',
      },
      {
        recommendationId: 'rec-analytics-spot',
        resourceId: 'deployment-analytics',
        resourceType: 'Deployment',
        resourceName: 'data-processing',
        recommendationType: 'spot-instance',
        currentState: {
          cpu: '8000m',
          memory: '16Gi',
          instanceType: 'n1-standard-8',
        },
        recommendedState: {
          cpu: '8000m',
          memory: '16Gi',
          instanceType: 'n1-standard-8-spot',
        },
        potentialSavings: {
          monthly: 306.00,
          annual: 3672.00,
          percentage: 50,
        },
        impact: 'medium',
        confidence: 80,
        implementationComplexity: 'medium',
        justification: 'Analytics workloads are fault-tolerant and can be interrupted. Using spot instances will significantly reduce costs with minimal impact.',
        implementationSteps: [
          'Update node affinity rules to target spot instances',
          'Configure appropriate pod disruption budgets',
          'Implement retry logic for interrupted jobs',
          'Monitor for spot instance terminations',
        ],
        status: 'pending',
      },
      {
        recommendationId: 'rec-cache-autoscale',
        resourceId: 'deployment-cache',
        resourceType: 'Deployment',
        resourceName: 'redis-cache',
        recommendationType: 'autoscale',
        currentState: {
          cpu: '2000m',
          memory: '8Gi',
        },
        recommendedState: {
          cpu: '1000m',
          memory: '4Gi',
        },
        potentialSavings: {
          monthly: 108.00,
          annual: 1296.00,
          percentage: 50,
        },
        impact: 'low',
        confidence: 88,
        implementationComplexity: 'easy',
        justification: 'Cache usage varies throughout the day but is consistently overprovisioned. Implementing HPA will allow it to scale based on actual demand.',
        implementationSteps: [
          'Reduce base resource allocation',
          'Configure Horizontal Pod Autoscaler',
          'Set appropriate min/max replicas',
          'Monitor cache performance during peak hours',
        ],
        status: 'pending',
      },
      {
        recommendationId: 'rec-monitoring-consolidate',
        resourceId: 'deployment-monitoring',
        resourceType: 'Deployment',
        resourceName: 'prometheus',
        recommendationType: 'consolidate',
        currentState: {
          cpu: '4000m',
          memory: '8Gi',
          storage: '100Gi',
        },
        recommendedState: {
          cpu: '2000m',
          memory: '6Gi',
          storage: '50Gi',
        },
        potentialSavings: {
          monthly: 144.00,
          annual: 1728.00,
          percentage: 50,
        },
        impact: 'medium',
        confidence: 75,
        implementationComplexity: 'complex',
        justification: 'Monitoring stack can be optimized by consolidating scrapers and improving storage efficiency with better retention policies.',
        implementationSteps: [
          'Update Prometheus configuration to optimize scrape intervals',
          'Implement improved data retention policies',
          'Consolidate duplicate metrics',
          'Reduce resource requests and limits',
        ],
        status: 'pending',
      },
    ];

    sampleRecommendations.forEach(recommendation => {
      this.recommendations.set(recommendation.recommendationId, recommendation);
    });
  }

  private initializeCostTrends() {
    // Generate sample cost trends
    const generateDataPoints = (
      baseValue: number, 
      volatility: number, 
      trend: 'increasing' | 'decreasing' | 'stable' | 'volatile',
      days: number
    ) => {
      const dataPoints = [];
      let value = baseValue;
      
      for (let i = days; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        
        // Apply trend
        switch (trend) {
          case 'increasing':
            value += (baseValue * 0.01) + (Math.random() * volatility - volatility/2);
            break;
          case 'decreasing':
            value -= (baseValue * 0.01) + (Math.random() * volatility - volatility/2);
            break;
          case 'stable':
            value += (Math.random() * volatility - volatility/2);
            break;
          case 'volatile':
            value += (Math.random() * volatility * 2 - volatility);
            break;
        }
        
        // Ensure value doesn't go below zero
        value = Math.max(0, value);
        
        dataPoints.push({
          timestamp: date.toISOString(),
          cost: parseFloat(value.toFixed(2)),
        });
      }
      
      return dataPoints;
    };

    const sampleTrends: CostTrend[] = [
      {
        trendId: 'trend-overall',
        period: 'daily',
        dataPoints: generateDataPoints(100, 10, 'increasing', 30),
        trend: 'increasing',
        changeRate: 15.5,
        forecastedIncrease: 22.3,
        anomalies: [
          {
            timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            expected: 110,
            actual: 150,
            deviation: 36.4,
          }
        ],
      },
      {
        trendId: 'trend-production',
        namespace: 'production',
        period: 'daily',
        dataPoints: generateDataPoints(80, 8, 'increasing', 30),
        trend: 'increasing',
        changeRate: 18.2,
        forecastedIncrease: 25.7,
      },
      {
        trendId: 'trend-monitoring',
        namespace: 'monitoring',
        period: 'daily',
        dataPoints: generateDataPoints(20, 3, 'stable', 30),
        trend: 'stable',
        changeRate: 2.1,
        forecastedIncrease: 3.5,
      },
      {
        trendId: 'trend-aws',
        provider: 'aws',
        period: 'daily',
        dataPoints: generateDataPoints(60, 6, 'increasing', 30),
        trend: 'increasing',
        changeRate: 12.8,
        forecastedIncrease: 18.4,
      },
      {
        trendId: 'trend-gcp',
        provider: 'gcp',
        period: 'daily',
        dataPoints: generateDataPoints(30, 5, 'volatile', 30),
        trend: 'volatile',
        changeRate: 8.5,
        forecastedIncrease: 10.2,
      },
      {
        trendId: 'trend-deployments',
        resourceType: 'Deployment',
        period: 'daily',
        dataPoints: generateDataPoints(70, 7, 'increasing', 30),
        trend: 'increasing',
        changeRate: 14.3,
        forecastedIncrease: 20.1,
      },
    ];

    sampleTrends.forEach(trend => {
      this.costTrends.set(trend.trendId, trend);
    });
  }

  private initializeBudgets() {
    const sampleBudgets: Budget[] = [
      {
        budgetId: 'budget-overall',
        name: 'Overall Kubernetes Budget',
        scope: {},
        period: 'monthly',
        amount: 3000,
        currentSpend: 2100,
        forecastedSpend: 2800,
        alerts: [
          {
            threshold: 80,
            triggered: false,
            notificationChannels: ['email', 'slack'],
          },
          {
            threshold: 90,
            triggered: false,
            notificationChannels: ['email', 'slack', 'pagerduty'],
          },
          {
            threshold: 100,
            triggered: false,
            notificationChannels: ['email', 'slack', 'pagerduty', 'sms'],
          },
        ],
        lastUpdated: new Date().toISOString(),
      },
      {
        budgetId: 'budget-production',
        name: 'Production Namespace Budget',
        scope: {
          namespaces: ['production'],
        },
        period: 'monthly',
        amount: 2000,
        currentSpend: 1500,
        forecastedSpend: 1900,
        alerts: [
          {
            threshold: 80,
            triggered: false,
            notificationChannels: ['email', 'slack'],
          },
          {
            threshold: 100,
            triggered: false,
            notificationChannels: ['email', 'slack', 'pagerduty'],
          },
        ],
        lastUpdated: new Date().toISOString(),
      },
      {
        budgetId: 'budget-aws',
        name: 'AWS Provider Budget',
        scope: {
          labels: {
            provider: 'aws',
          },
        },
        period: 'monthly',
        amount: 1500,
        currentSpend: 1200,
        forecastedSpend: 1600,
        alerts: [
          {
            threshold: 90,
            triggered: false,
            notificationChannels: ['email', 'slack'],
          },
          {
            threshold: 110,
            triggered: false,
            notificationChannels: ['email', 'slack', 'pagerduty'],
          },
        ],
        lastUpdated: new Date().toISOString(),
      },
      {
        budgetId: 'budget-team-web',
        name: 'Web Team Budget',
        scope: {
          labels: {
            team: 'web',
          },
        },
        period: 'monthly',
        amount: 800,
        currentSpend: 500,
        forecastedSpend: 750,
        alerts: [
          {
            threshold: 80,
            triggered: false,
            notificationChannels: ['email', 'slack'],
          },
        ],
        lastUpdated: new Date().toISOString(),
      },
    ];

    sampleBudgets.forEach(budget => {
      this.budgets.set(budget.budgetId, budget);
    });
  }

  private startMonitoring() {
    // Simulate real-time updates
    setInterval(() => {
      this.updateResourceMetrics();
      this.updateBudgets();
    }, 60000); // Update every minute
  }

  private updateResourceMetrics() {
    this.resourceCosts.forEach(resource => {
      // Simulate utilization changes
      resource.actualUtilization.cpu = Math.max(0, Math.min(100, resource.actualUtilization.cpu + (Math.random() * 10 - 5)));
      resource.actualUtilization.memory = Math.max(0, Math.min(100, resource.actualUtilization.memory + (Math.random() * 8 - 4)));
      if (resource.actualUtilization.storage) {
        resource.actualUtilization.storage = Math.max(0, Math.min(100, resource.actualUtilization.storage + (Math.random() * 5 - 2.5)));
      }
      
      // Update wasted resources based on utilization
      const cpuRequested = parseFloat(resource.requestedResources.cpu.replace('m', '')) / 1000;
      const memoryRequested = parseFloat(resource.requestedResources.memory.replace('Gi', ''));
      
      resource.wastedResources.cpu = parseFloat((cpuRequested * (1 - resource.actualUtilization.cpu / 100)).toFixed(1));
      resource.wastedResources.memory = parseFloat((memoryRequested * (1 - resource.actualUtilization.memory / 100)).toFixed(1));
      
      if (resource.actualUtilization.storage && resource.wastedResources.storage) {
        const storageRequested = parseFloat(resource.requestedResources.storage.replace('Gi', ''));
        resource.wastedResources.storage = parseFloat((storageRequested * (1 - resource.actualUtilization.storage / 100)).toFixed(1));
      }
      
      // Update wasted costs
      const wastedRatio = (resource.wastedResources.cpu / cpuRequested + resource.wastedResources.memory / memoryRequested) / 2;
      resource.wastedCost.hourly = parseFloat((resource.costPerHour * wastedRatio).toFixed(2));
      resource.wastedCost.daily = parseFloat((resource.wastedCost.hourly * 24).toFixed(2));
      resource.wastedCost.monthly = parseFloat((resource.wastedCost.daily * 30).toFixed(2));
      
      resource.lastUpdated = new Date().toISOString();
      this.resourceCosts.set(resource.resourceId, resource);
    });
  }

  private updateBudgets() {
    this.budgets.forEach(budget => {
      // Simulate spend changes
      const spendChange = (Math.random() * 0.05 - 0.01) * budget.amount; // -1% to +4%
      budget.currentSpend = Math.max(0, budget.currentSpend + spendChange);
      
      // Update forecasted spend
      const daysInMonth = 30;
      const currentDate = new Date();
      const dayOfMonth = currentDate.getDate();
      const remainingDays = daysInMonth - dayOfMonth;
      
      const dailyRate = budget.currentSpend / dayOfMonth;
      budget.forecastedSpend = budget.currentSpend + (dailyRate * remainingDays);
      
      // Check alerts
      budget.alerts.forEach(alert => {
        alert.triggered = (budget.forecastedSpend / budget.amount) * 100 >= alert.threshold;
      });
      
      budget.lastUpdated = new Date().toISOString();
      this.budgets.set(budget.budgetId, budget);
    });
  }

  // Public API Methods
  async getResourceCosts(): Promise<ResourceCost[]> {
    return Array.from(this.resourceCosts.values());
  }

  async getResourceCostById(resourceId: string): Promise<ResourceCost | null> {
    return this.resourceCosts.get(resourceId) || null;
  }

  async getRecommendations(): Promise<OptimizationRecommendation[]> {
    return Array.from(this.recommendations.values());
  }

  async getRecommendationById(recommendationId: string): Promise<OptimizationRecommendation | null> {
    return this.recommendations.get(recommendationId) || null;
  }

  async getCostTrends(): Promise<CostTrend[]> {
    return Array.from(this.costTrends.values());
  }

  async getCostTrendById(trendId: string): Promise<CostTrend | null> {
    return this.costTrends.get(trendId) || null;
  }

  async getBudgets(): Promise<Budget[]> {
    return Array.from(this.budgets.values());
  }

  async getBudgetById(budgetId: string): Promise<Budget | null> {
    return this.budgets.get(budgetId) || null;
  }

  async updateRecommendationStatus(recommendationId: string, status: 'approved' | 'rejected' | 'implemented'): Promise<OptimizationRecommendation | null> {
    const recommendation = this.recommendations.get(recommendationId);
    if (!recommendation) return null;
    
    recommendation.status = status;
    this.recommendations.set(recommendationId, recommendation);
    
    return recommendation;
  }

  async updateBudget(budgetId: string, updates: Partial<Budget>): Promise<Budget | null> {
    const budget = this.budgets.get(budgetId);
    if (!budget) return null;
    
    const updatedBudget = { ...budget, ...updates, lastUpdated: new Date().toISOString() };
    this.budgets.set(budgetId, updatedBudget);
    
    return updatedBudget;
  }

  // Generate cost optimization summary
  generateCostSummary(): {
    totalCost: {
      monthly: number;
      annual: number;
    };
    wastedCost: {
      monthly: number;
      annual: number;
      percentage: number;
    };
    potentialSavings: {
      monthly: number;
      annual: number;
      percentage: number;
    };
    topWastefulResources: Array<{
      resourceId: string;
      name: string;
      namespace: string;
      wastedCostMonthly: number;
      utilizationPercentage: number;
    }>;
    costTrends: {
      overall: {
        trend: string;
        changeRate: number;
      };
      byProvider: Record<string, {
        trend: string;
        changeRate: number;
      }>;
    };
    budgetStatus: {
      totalBudgets: number;
      alertedBudgets: number;
      forecastedOverages: number;
    };
  } {
    const resources = Array.from(this.resourceCosts.values());
    const recommendations = Array.from(this.recommendations.values());
    
    // Calculate total costs
    const totalMonthly = resources.reduce((sum, r) => sum + r.costPerMonth, 0);
    const totalAnnual = totalMonthly * 12;
    
    // Calculate wasted costs
    const wastedMonthly = resources.reduce((sum, r) => sum + r.wastedCost.monthly, 0);
    const wastedAnnual = wastedMonthly * 12;
    const wastedPercentage = (wastedMonthly / totalMonthly) * 100;
    
    // Calculate potential savings
    const potentialSavingsMonthly = recommendations.reduce((sum, r) => sum + r.potentialSavings.monthly, 0);
    const potentialSavingsAnnual = potentialSavingsMonthly * 12;
    const savingsPercentage = (potentialSavingsMonthly / totalMonthly) * 100;
    
    // Get top wasteful resources
    const topWastefulResources = resources
      .sort((a, b) => b.wastedCost.monthly - a.wastedCost.monthly)
      .slice(0, 5)
      .map(r => ({
        resourceId: r.resourceId,
        name: r.name,
        namespace: r.namespace,
        wastedCostMonthly: r.wastedCost.monthly,
        utilizationPercentage: (r.actualUtilization.cpu + r.actualUtilization.memory) / 2,
      }));
    
    // Get cost trends
    const overallTrend = this.costTrends.get('trend-overall');
    
    const providerTrends: Record<string, { trend: string; changeRate: number }> = {};
    Array.from(this.costTrends.values())
      .filter(t => t.provider)
      .forEach(t => {
        if (t.provider) {
          providerTrends[t.provider] = {
            trend: t.trend,
            changeRate: t.changeRate,
          };
        }
      });
    
    // Get budget status
    const budgets = Array.from(this.budgets.values());
    const alertedBudgets = budgets.filter(b => b.alerts.some(a => a.triggered)).length;
    const forecastedOverages = budgets.filter(b => b.forecastedSpend > b.amount).length;
    
    return {
      totalCost: {
        monthly: parseFloat(totalMonthly.toFixed(2)),
        annual: parseFloat(totalAnnual.toFixed(2)),
      },
      wastedCost: {
        monthly: parseFloat(wastedMonthly.toFixed(2)),
        annual: parseFloat(wastedAnnual.toFixed(2)),
        percentage: parseFloat(wastedPercentage.toFixed(1)),
      },
      potentialSavings: {
        monthly: parseFloat(potentialSavingsMonthly.toFixed(2)),
        annual: parseFloat(potentialSavingsAnnual.toFixed(2)),
        percentage: parseFloat(savingsPercentage.toFixed(1)),
      },
      topWastefulResources,
      costTrends: {
        overall: {
          trend: overallTrend?.trend || 'stable',
          changeRate: overallTrend?.changeRate || 0,
        },
        byProvider: providerTrends,
      },
      budgetStatus: {
        totalBudgets: budgets.length,
        alertedBudgets,
        forecastedOverages,
      },
    };
  }

  // Generate AI-powered cost optimization recommendations
  generateAIRecommendations(): Array<{
    category: string;
    title: string;
    description: string;
    impact: 'high' | 'medium' | 'low';
    difficulty: 'easy' | 'medium' | 'complex';
    estimatedSavings: string;
    implementationSteps: string[];
  }> {
    const resources = Array.from(this.resourceCosts.values());
    const trends = Array.from(this.costTrends.values());
    
    const recommendations = [];
    
    // Check for underutilized resources
    const underutilizedResources = resources.filter(r => 
      r.actualUtilization.cpu < 40 && 
      r.actualUtilization.memory < 50 &&
      r.wastedCost.monthly > 100
    );
    
    if (underutilizedResources.length > 0) {
      const totalWasted = underutilizedResources.reduce((sum, r) => sum + r.wastedCost.monthly, 0);
      recommendations.push({
        category: 'Resource Optimization',
        title: 'Rightsize Underutilized Resources',
        description: `${underutilizedResources.length} resources are significantly underutilized, wasting ${totalWasted.toFixed(2)} USD monthly. Implementing automated scaling or reducing allocated resources can significantly cut costs.`,
        impact: 'high',
        difficulty: 'medium',
        estimatedSavings: `${(totalWasted * 0.7).toFixed(2)} USD monthly`,
        implementationSteps: [
          'Identify resources with consistently low utilization',
          'Analyze usage patterns to determine appropriate sizing',
          'Implement Horizontal Pod Autoscaling for variable workloads',
          'Reduce resource requests and limits for consistently underutilized deployments',
          'Monitor performance after changes to ensure stability',
        ],
      });
    }
    
    // Check for cost trend anomalies
    const anomalousTrends = trends.filter(t => t.anomalies && t.anomalies.length > 0);
    if (anomalousTrends.length > 0) {
      recommendations.push({
        category: 'Cost Anomaly',
        title: 'Investigate Cost Spikes',
        description: 'Unusual cost increases detected in recent usage patterns. These anomalies may indicate inefficient resource usage or unexpected workload changes.',
        impact: 'high',
        difficulty: 'medium',
        estimatedSavings: 'Variable',
        implementationSteps: [
          'Review cost anomalies in the cost explorer',
          'Correlate spikes with deployment or configuration changes',
          'Implement cost anomaly alerts for early detection',
          'Set up automated responses to common cost increase patterns',
        ],
      });
    }
    
    // Check for spot/preemptible instance opportunities
    const spotCandidates = resources.filter(r => 
      r.resourceType === 'Deployment' && 
      !r.name.includes('database') && 
      !r.name.includes('critical') &&
      r.costPerMonth > 200
    );
    
    if (spotCandidates.length > 0) {
      const totalSpotSavings = spotCandidates.reduce((sum, r) => sum + r.costPerMonth * 0.6, 0);
      recommendations.push({
        category: 'Pricing Optimization',
        title: 'Leverage Spot/Preemptible Instances',
        description: `${spotCandidates.length} deployments are good candidates for spot/preemptible instances, which can reduce costs by up to 60-80% for fault-tolerant workloads.`,
        impact: 'high',
        difficulty: 'medium',
        estimatedSavings: `${totalSpotSavings.toFixed(2)} USD monthly`,
        implementationSteps: [
          'Identify non-critical workloads suitable for spot instances',
          'Configure node affinity rules to target spot instance node pools',
          'Implement appropriate pod disruption budgets',
          'Set up monitoring for spot instance terminations',
          'Add retry logic for interrupted batch jobs',
        ],
      });
    }
    
    // Check for idle resources during off-hours
    recommendations.push({
      category: 'Scheduling Optimization',
      title: 'Implement Off-Hours Scaling',
      description: 'Development and testing environments show consistent usage patterns with minimal activity during nights and weekends. Automatically scaling down during these periods can reduce costs.',
      impact: 'medium',
      difficulty: 'easy',
      estimatedSavings: '15-30% of non-production costs',
      implementationSteps: [
        'Identify non-production workloads with predictable usage patterns',
        'Implement Kubernetes CronJobs to scale deployments down during off-hours',
        'Configure corresponding jobs to scale back up before work hours',
        'Set up notifications for manual intervention if needed',
        'Monitor for any impact on development workflows',
      ],
    });
    
    // Check for storage optimization
    const storageHeavyResources = resources.filter(r => 
      r.requestedResources.storage && 
      parseFloat(r.requestedResources.storage.replace('Gi', '')) > 100 &&
      (r.actualUtilization.storage || 0) < 50
    );
    
    if (storageHeavyResources.length > 0) {
      recommendations.push({
        category: 'Storage Optimization',
        title: 'Optimize Storage Provisioning',
        description: 'Several persistent volumes are significantly overprovisioned, with utilization below 50%. Rightsizing these volumes and implementing more efficient storage classes can reduce costs.',
        impact: 'medium',
        difficulty: 'medium',
        estimatedSavings: '20-40% of storage costs',
        implementationSteps: [
          'Audit current storage usage across all persistent volumes',
          'Identify volumes with consistently low utilization',
          'Implement storage autoscaling where supported',
          'Migrate to more cost-effective storage classes for appropriate workloads',
          'Consider implementing data lifecycle policies for automatic archiving',
        ],
      });
    }
    
    // Namespace consolidation
    recommendations.push({
      category: 'Cluster Optimization',
      title: 'Consolidate Low-Utilization Namespaces',
      description: 'Multiple namespaces are running at very low utilization. Consolidating these workloads can reduce overhead and improve resource efficiency.',
      impact: 'medium',
      difficulty: 'complex',
      estimatedSavings: '10-15% of overall cluster costs',
      implementationSteps: [
        'Identify namespaces with consistently low resource utilization',
        'Analyze workload compatibility for potential consolidation',
        'Implement appropriate network policies and RBAC for multi-tenant namespaces',
        'Gradually migrate workloads to consolidated namespaces',
        'Decommission empty namespaces and reclaim resources',
      ],
    });
    
    return recommendations;
  }
}