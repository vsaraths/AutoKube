import { z } from 'zod';

// Kubernetes resource schemas
export const PodSchema = z.object({
  metadata: z.object({
    name: z.string(),
    namespace: z.string(),
    labels: z.record(z.string()).optional(),
  }),
  spec: z.object({
    containers: z.array(z.object({
      name: z.string(),
      image: z.string(),
      resources: z.object({
        requests: z.record(z.string()).optional(),
        limits: z.record(z.string()).optional(),
      }).optional(),
    })),
  }),
  status: z.object({
    phase: z.string(),
    conditions: z.array(z.object({
      type: z.string(),
      status: z.string(),
      reason: z.string().optional(),
      message: z.string().optional(),
    })).optional(),
  }),
});

export const EventSchema = z.object({
  metadata: z.object({
    name: z.string(),
    namespace: z.string(),
  }),
  involvedObject: z.object({
    kind: z.string(),
    name: z.string(),
    namespace: z.string(),
  }),
  reason: z.string(),
  message: z.string(),
  type: z.string(),
  firstTimestamp: z.string(),
  lastTimestamp: z.string(),
});

export const IssueSchema = z.object({
  id: z.string(),
  severity: z.enum(['low', 'medium', 'high', 'critical']),
  title: z.string(),
  description: z.string(),
  namespace: z.string(),
  resource: z.object({
    kind: z.string(),
    name: z.string(),
  }),
  suggestedFix: z.object({
    action: z.string(),
    yaml: z.string().optional(),
    command: z.string().optional(),
  }).optional(),
  aiAnalysis: z.string(),
});

export const FixSchema = z.object({
  id: z.string(),
  action: z.string(),
  description: z.string(),
  applied: z.boolean(),
  result: z.string().optional(),
});

export type Pod = z.infer<typeof PodSchema>;
export type Event = z.infer<typeof EventSchema>;
export type Issue = z.infer<typeof IssueSchema>;
export type Fix = z.infer<typeof FixSchema>;

// AI-powered issue detection
export class KubernetesAI {
  private static instance: KubernetesAI;
  
  private constructor() {}
  
  static getInstance(): KubernetesAI {
    if (!KubernetesAI.instance) {
      KubernetesAI.instance = new KubernetesAI();
    }
    return KubernetesAI.instance;
  }
  
  async detectIssues(namespace: string): Promise<Issue[]> {
    // Simulate AI-powered issue detection
    const mockIssues: Issue[] = [
      {
        id: 'issue-001',
        severity: 'high',
        title: 'Pod CrashLoopBackOff detected',
        description: 'Pod web-service-abc123 is in CrashLoopBackOff state',
        namespace,
        resource: {
          kind: 'Pod',
          name: 'web-service-abc123',
        },
        suggestedFix: {
          action: 'restart_pod',
          yaml: `apiVersion: v1
kind: Pod
metadata:
  name: web-service-abc123
  namespace: ${namespace}
spec:
  containers:
  - name: web-service
    image: nginx:1.21
    resources:
      requests:
        memory: "256Mi"
        cpu: "250m"
      limits:
        memory: "512Mi"
        cpu: "500m"`,
        },
        aiAnalysis: 'AI detected that the pod is failing due to insufficient memory allocation. Recommended to increase memory limits.',
      },
      {
        id: 'issue-002',
        severity: 'medium',
        title: 'High CPU usage detected',
        description: 'Deployment payment-service is using 95% CPU',
        namespace,
        resource: {
          kind: 'Deployment',
          name: 'payment-service',
        },
        suggestedFix: {
          action: 'scale_deployment',
          command: `kubectl scale deployment payment-service --replicas=3 -n ${namespace}`,
        },
        aiAnalysis: 'AI analysis shows sustained high CPU usage. Scaling up the deployment will distribute the load.',
      },
    ];
    
    return mockIssues;
  }
  
  async applyFix(issue: Issue, autoApply: boolean = false): Promise<Fix> {
    // Simulate applying a fix
    const fix: Fix = {
      id: `fix-${issue.id}`,
      action: issue.suggestedFix?.action || 'manual_intervention',
      description: `Applied fix for ${issue.title}`,
      applied: autoApply,
      result: autoApply ? 'Fix applied successfully' : 'Fix prepared, manual approval required',
    };
    
    return fix;
  }
  
  async analyzeClusterHealth(namespace?: string): Promise<{
    score: number;
    issues: Issue[];
    recommendations: string[];
  }> {
    const issues = await this.detectIssues(namespace || 'default');
    const criticalIssues = issues.filter(i => i.severity === 'critical').length;
    const highIssues = issues.filter(i => i.severity === 'high').length;
    
    const score = Math.max(0, 100 - (criticalIssues * 30) - (highIssues * 15));
    
    const recommendations = [
      'Consider implementing resource quotas to prevent resource exhaustion',
      'Set up monitoring alerts for critical pod failures',
      'Review and optimize container resource requests and limits',
    ];
    
    return {
      score,
      issues,
      recommendations,
    };
  }
}