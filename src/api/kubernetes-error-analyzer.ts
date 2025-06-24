import { z } from 'zod';

// Real Kubernetes error patterns and their AI-powered solutions
export const KubernetesErrorSchema = z.object({
  timestamp: z.string(),
  level: z.enum(['ERROR', 'WARN', 'INFO']),
  component: z.string(),
  message: z.string(),
  errorCode: z.string().optional(),
  pod: z.string().optional(),
  namespace: z.string().optional(),
});

export const ErrorAnalysisSchema = z.object({
  errorType: z.string(),
  severity: z.enum(['critical', 'high', 'medium', 'low']),
  rootCause: z.string(),
  aiDiagnosis: z.string(),
  autoRemediationAvailable: z.boolean(),
  suggestedFixes: z.array(z.object({
    action: z.string(),
    description: z.string(),
    yaml: z.string().optional(),
    command: z.string().optional(),
    priority: z.number(),
  })),
  preventionStrategy: z.string(),
});

export type KubernetesError = z.infer<typeof KubernetesErrorSchema>;
export type ErrorAnalysis = z.infer<typeof ErrorAnalysisSchema>;

export class KubernetesErrorAnalyzer {
  private static instance: KubernetesErrorAnalyzer;
  
  private constructor() {}
  
  static getInstance(): KubernetesErrorAnalyzer {
    if (!KubernetesErrorAnalyzer.instance) {
      KubernetesErrorAnalyzer.instance = new KubernetesErrorAnalyzer();
    }
    return KubernetesErrorAnalyzer.instance;
  }

  // AI-powered error pattern recognition
  analyzeLogEntry(logEntry: string): ErrorAnalysis | null {
    const errorPatterns = [
      {
        pattern: /Failed to watch.*Pod.*connection refused/,
        type: 'api_server_connection_failure',
        severity: 'critical' as const,
        rootCause: 'Kubernetes API server is unreachable',
        aiDiagnosis: 'The kubelet cannot connect to the API server. This could indicate network issues, API server downtime, or certificate problems.',
        autoRemediation: true,
        fixes: [
          {
            action: 'restart_kubelet',
            description: 'Restart kubelet service to re-establish connection',
            command: 'systemctl restart kubelet',
            priority: 1,
          },
          {
            action: 'check_certificates',
            description: 'Verify kubelet certificates are valid',
            command: 'kubeadm certs check-expiration',
            priority: 2,
          }
        ],
        prevention: 'Implement API server health monitoring and certificate auto-renewal'
      },
      {
        pattern: /CrashLoopBackOff.*back-off.*restarting failed container/,
        type: 'pod_crash_loop',
        severity: 'high' as const,
        rootCause: 'Container repeatedly failing to start',
        aiDiagnosis: 'Pod is stuck in CrashLoopBackOff due to application errors, resource constraints, or configuration issues.',
        autoRemediation: true,
        fixes: [
          {
            action: 'increase_resources',
            description: 'Increase memory and CPU limits',
            yaml: `spec:
  containers:
  - name: nginx
    resources:
      limits:
        memory: "512Mi"
        cpu: "500m"
      requests:
        memory: "256Mi"
        cpu: "250m"`,
            priority: 1,
          },
          {
            action: 'check_logs',
            description: 'Analyze container logs for application errors',
            command: 'kubectl logs nginx-deployment-5c689d8b4b-jx3wp --previous',
            priority: 2,
          }
        ],
        prevention: 'Implement proper health checks and resource monitoring'
      },
      {
        pattern: /no metrics returned from resource metrics API/,
        type: 'metrics_server_failure',
        severity: 'medium' as const,
        rootCause: 'Metrics server is not responding',
        aiDiagnosis: 'HPA cannot scale because metrics server is unavailable. This affects auto-scaling capabilities.',
        autoRemediation: true,
        fixes: [
          {
            action: 'restart_metrics_server',
            description: 'Restart metrics server deployment',
            command: 'kubectl rollout restart deployment metrics-server -n kube-system',
            priority: 1,
          },
          {
            action: 'verify_metrics_server',
            description: 'Check metrics server installation',
            command: 'kubectl get deployment metrics-server -n kube-system',
            priority: 2,
          }
        ],
        prevention: 'Monitor metrics server health and implement redundancy'
      },
      {
        pattern: /no nodes available to schedule pods/,
        type: 'node_scheduling_failure',
        severity: 'high' as const,
        rootCause: 'No available nodes meet pod requirements',
        aiDiagnosis: 'Pod cannot be scheduled due to resource constraints, node selectors, or taints/tolerations.',
        autoRemediation: true,
        fixes: [
          {
            action: 'scale_cluster',
            description: 'Add more worker nodes to the cluster',
            command: 'kubectl get nodes -o wide',
            priority: 1,
          },
          {
            action: 'check_node_resources',
            description: 'Analyze node resource availability',
            command: 'kubectl describe nodes',
            priority: 2,
          }
        ],
        prevention: 'Implement cluster auto-scaling and resource monitoring'
      },
      {
        pattern: /Failed to allocate IP address.*No available IPs/,
        type: 'ip_exhaustion',
        severity: 'high' as const,
        rootCause: 'CNI network IP pool exhausted',
        aiDiagnosis: 'The CNI plugin has run out of available IP addresses in the pod network range.',
        autoRemediation: true,
        fixes: [
          {
            action: 'expand_cidr',
            description: 'Expand pod CIDR range',
            yaml: `spec:
  podCIDR: "10.244.0.0/16"  # Expand from /24 to /16`,
            priority: 1,
          },
          {
            action: 'cleanup_unused_ips',
            description: 'Clean up unused IP allocations',
            command: 'kubectl get pods --all-namespaces | grep Terminating',
            priority: 2,
          }
        ],
        prevention: 'Monitor IP usage and implement CIDR planning'
      },
      {
        pattern: /manifest.*not found/,
        type: 'image_pull_error',
        severity: 'medium' as const,
        rootCause: 'Container image not found in registry',
        aiDiagnosis: 'The specified container image does not exist or is not accessible from the cluster.',
        autoRemediation: true,
        fixes: [
          {
            action: 'verify_image_tag',
            description: 'Check if image tag exists in registry',
            command: 'docker pull myregistry.local/myapp:v1',
            priority: 1,
          },
          {
            action: 'update_image_tag',
            description: 'Update to a valid image tag',
            yaml: `spec:
  containers:
  - name: myapp
    image: myregistry.local/myapp:latest`,
            priority: 2,
          }
        ],
        prevention: 'Implement image scanning and registry monitoring'
      },
      {
        pattern: /exceeded quota.*pods/,
        type: 'resource_quota_exceeded',
        severity: 'medium' as const,
        rootCause: 'Namespace resource quota exceeded',
        aiDiagnosis: 'The namespace has reached its pod limit defined by resource quotas.',
        autoRemediation: true,
        fixes: [
          {
            action: 'increase_quota',
            description: 'Increase pod quota for namespace',
            yaml: `apiVersion: v1
kind: ResourceQuota
metadata:
  name: default-quota
spec:
  hard:
    pods: "20"  # Increased from 10`,
            priority: 1,
          },
          {
            action: 'cleanup_pods',
            description: 'Remove unused or failed pods',
            command: 'kubectl delete pods --field-selector=status.phase=Failed',
            priority: 2,
          }
        ],
        prevention: 'Monitor resource usage and implement auto-scaling quotas'
      }
    ];

    for (const pattern of errorPatterns) {
      if (pattern.pattern.test(logEntry)) {
        return {
          errorType: pattern.type,
          severity: pattern.severity,
          rootCause: pattern.rootCause,
          aiDiagnosis: pattern.aiDiagnosis,
          autoRemediationAvailable: pattern.autoRemediation,
          suggestedFixes: pattern.fixes,
          preventionStrategy: pattern.prevention,
        };
      }
    }

    return null;
  }

  // Batch analyze multiple log entries
  async batchAnalyze(logEntries: string[]): Promise<{
    totalErrors: number;
    criticalErrors: number;
    autoRemediableErrors: number;
    analyses: ErrorAnalysis[];
    clusterHealthScore: number;
  }> {
    const analyses: ErrorAnalysis[] = [];
    
    for (const entry of logEntries) {
      const analysis = this.analyzeLogEntry(entry);
      if (analysis) {
        analyses.push(analysis);
      }
    }

    const criticalErrors = analyses.filter(a => a.severity === 'critical').length;
    const autoRemediableErrors = analyses.filter(a => a.autoRemediationAvailable).length;
    
    // Calculate cluster health score based on error severity
    const healthScore = Math.max(0, 100 - (criticalErrors * 25) - (analyses.length * 5));

    return {
      totalErrors: analyses.length,
      criticalErrors,
      autoRemediableErrors,
      analyses,
      clusterHealthScore: healthScore,
    };
  }

  // Generate auto-remediation plan
  generateRemediationPlan(analyses: ErrorAnalysis[]): {
    plan: Array<{
      step: number;
      action: string;
      description: string;
      command?: string;
      yaml?: string;
      estimatedTime: string;
    }>;
    totalSteps: number;
    estimatedDuration: string;
  } {
    const plan: Array<{
      step: number;
      action: string;
      description: string;
      command?: string;
      yaml?: string;
      estimatedTime: string;
    }> = [];

    let stepCounter = 1;

    // Sort by priority and severity
    const sortedAnalyses = analyses
      .filter(a => a.autoRemediationAvailable)
      .sort((a, b) => {
        const severityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
        return severityOrder[b.severity] - severityOrder[a.severity];
      });

    for (const analysis of sortedAnalyses) {
      for (const fix of analysis.suggestedFixes.sort((a, b) => a.priority - b.priority)) {
        plan.push({
          step: stepCounter++,
          action: fix.action,
          description: fix.description,
          command: fix.command,
          yaml: fix.yaml,
          estimatedTime: this.getEstimatedTime(fix.action),
        });
      }
    }

    return {
      plan,
      totalSteps: plan.length,
      estimatedDuration: this.calculateTotalDuration(plan),
    };
  }

  private getEstimatedTime(action: string): string {
    const timeMap: Record<string, string> = {
      restart_kubelet: '30s',
      restart_metrics_server: '45s',
      increase_resources: '15s',
      scale_cluster: '5m',
      expand_cidr: '2m',
      increase_quota: '10s',
      cleanup_pods: '30s',
      verify_image_tag: '20s',
      update_image_tag: '15s',
    };
    return timeMap[action] || '1m';
  }

  private calculateTotalDuration(plan: Array<{ estimatedTime: string }>): string {
    let totalSeconds = 0;
    
    for (const step of plan) {
      const time = step.estimatedTime;
      if (time.endsWith('s')) {
        totalSeconds += parseInt(time.slice(0, -1));
      } else if (time.endsWith('m')) {
        totalSeconds += parseInt(time.slice(0, -1)) * 60;
      }
    }

    if (totalSeconds < 60) {
      return `${totalSeconds}s`;
    } else {
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;
      return seconds > 0 ? `${minutes}m ${seconds}s` : `${minutes}m`;
    }
  }
}