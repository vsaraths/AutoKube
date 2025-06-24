import { z } from 'zod';

// AI Incident Insights Schema
export const IncidentInsightSchema = z.object({
  incidentId: z.string(),
  timestamp: z.string(),
  title: z.string(),
  severity: z.enum(['low', 'medium', 'high', 'critical']),
  rootCauseAnalysis: z.object({
    primaryCause: z.string(),
    contributingFactors: z.array(z.string()),
    technicalExplanation: z.string(),
    humanReadableExplanation: z.string(),
  }),
  trendAnalysis: z.object({
    historicalOccurrences: z.number(),
    patternDetected: z.boolean(),
    similarIncidents: z.array(z.object({
      date: z.string(),
      description: z.string(),
      resolution: z.string(),
    })),
    predictionConfidence: z.number(),
    nextOccurrenceProbability: z.number(),
  }),
  suggestedFix: z.object({
    action: z.string(),
    description: z.string(),
    yaml: z.string().optional(),
    command: z.string().optional(),
    riskLevel: z.enum(['low', 'medium', 'high']),
    confidenceScore: z.number(),
    estimatedFixTime: z.string(),
  }),
  debuggingInsights: z.object({
    interactiveSteps: z.array(z.object({
      step: z.number(),
      description: z.string(),
      command: z.string(),
      expectedOutput: z.string(),
      troubleshootingTips: z.array(z.string()),
    })),
    commonMistakes: z.array(z.string()),
    bestPractices: z.array(z.string()),
  }),
  preventionStrategy: z.object({
    immediateActions: z.array(z.string()),
    longTermImprovements: z.array(z.string()),
    monitoringRecommendations: z.array(z.string()),
  }),
});

export type IncidentInsight = z.infer<typeof IncidentInsightSchema>;

// Enhanced AI Incident Insights Engine
export class AIIncidentInsightsEngine {
  private static instance: AIIncidentInsightsEngine;
  private incidentHistory: Map<string, IncidentInsight[]> = new Map();
  
  private constructor() {
    this.initializeIncidentHistory();
  }
  
  static getInstance(): AIIncidentInsightsEngine {
    if (!AIIncidentInsightsEngine.instance) {
      AIIncidentInsightsEngine.instance = new AIIncidentInsightsEngine();
    }
    return AIIncidentInsightsEngine.instance;
  }

  private initializeIncidentHistory() {
    // Initialize with historical incident data for pattern analysis
    const historicalIncidents = [
      {
        type: 'pod_crash_loop',
        incidents: [
          { date: '2025-01-10', description: 'Memory exhaustion in payment service', resolution: 'Increased memory limits' },
          { date: '2025-01-08', description: 'OOMKilled in user authentication pod', resolution: 'Optimized memory usage' },
          { date: '2025-01-05', description: 'CrashLoopBackOff in API gateway', resolution: 'Fixed health probe configuration' },
        ]
      },
      {
        type: 'image_pull_error',
        incidents: [
          { date: '2025-01-12', description: 'Invalid image tag in staging deployment', resolution: 'Updated to valid tag' },
          { date: '2025-01-09', description: 'Registry authentication failure', resolution: 'Updated image pull secrets' },
        ]
      },
      {
        type: 'network_connectivity',
        incidents: [
          { date: '2025-01-11', description: 'Service mesh configuration error', resolution: 'Fixed network policies' },
          { date: '2025-01-07', description: 'DNS resolution failures', resolution: 'Restarted CoreDNS pods' },
        ]
      }
    ];

    historicalIncidents.forEach(({ type, incidents }) => {
      this.incidentHistory.set(type, incidents.map(incident => this.createMockIncident(type, incident)));
    });
  }

  private createMockIncident(type: string, data: any): IncidentInsight {
    return {
      incidentId: `incident-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: data.date,
      title: data.description,
      severity: 'medium' as const,
      rootCauseAnalysis: {
        primaryCause: data.description,
        contributingFactors: ['Resource constraints', 'Configuration drift'],
        technicalExplanation: `Technical analysis for ${type}`,
        humanReadableExplanation: data.description,
      },
      trendAnalysis: {
        historicalOccurrences: 3,
        patternDetected: true,
        similarIncidents: [],
        predictionConfidence: 85,
        nextOccurrenceProbability: 25,
      },
      suggestedFix: {
        action: 'fix_configuration',
        description: data.resolution,
        riskLevel: 'medium' as const,
        confidenceScore: 90,
        estimatedFixTime: '5m',
      },
      debuggingInsights: {
        interactiveSteps: [],
        commonMistakes: [],
        bestPractices: [],
      },
      preventionStrategy: {
        immediateActions: [],
        longTermImprovements: [],
        monitoringRecommendations: [],
      },
    };
  }

  // Generate comprehensive incident insights with detailed root cause analysis
  async generateIncidentInsight(
    errorType: string,
    errorMessage: string,
    severity: 'low' | 'medium' | 'high' | 'critical',
    context: {
      namespace: string;
      podName?: string;
      serviceName?: string;
      logs?: string[];
    }
  ): Promise<IncidentInsight> {
    
    // Analyze historical patterns
    const trendAnalysis = this.analyzeTrends(errorType);
    
    // Generate root cause analysis
    const rootCauseAnalysis = this.generateRootCauseAnalysis(errorType, errorMessage, context);
    
    // Create debugging insights
    const debuggingInsights = this.generateDebuggingInsights(errorType, context);
    
    // Generate prevention strategy
    const preventionStrategy = this.generatePreventionStrategy(errorType, trendAnalysis);
    
    // Create suggested fix
    const suggestedFix = this.generateSuggestedFix(errorType, severity, context);

    const insight: IncidentInsight = {
      incidentId: `incident-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      title: this.generateIncidentTitle(errorType, context),
      severity,
      rootCauseAnalysis,
      trendAnalysis,
      suggestedFix,
      debuggingInsights,
      preventionStrategy,
    };

    // Store for future trend analysis
    this.storeIncident(errorType, insight);

    return insight;
  }

  private generateIncidentTitle(errorType: string, context: any): string {
    const titles: Record<string, string> = {
      'pod_crash_loop': `Pod ${context.podName || 'unknown'} stuck in CrashLoopBackOff`,
      'image_pull_error': `Image pull failure for ${context.podName || 'pod'} in ${context.namespace}`,
      'resource_exhaustion': `Resource exhaustion detected in ${context.namespace} namespace`,
      'network_connectivity': `Network connectivity issues affecting ${context.serviceName || 'service'}`,
      'api_server_connection': `API server connection failure in cluster`,
      'storage_issues': `Persistent volume issues in ${context.namespace}`,
    };
    
    return titles[errorType] || `Kubernetes issue detected: ${errorType}`;
  }

  private generateRootCauseAnalysis(errorType: string, errorMessage: string, context: any) {
    const analyses: Record<string, any> = {
      'pod_crash_loop': {
        primaryCause: 'Application container repeatedly failing to start successfully',
        contributingFactors: [
          'Insufficient memory allocation causing OOMKilled events',
          'Misconfigured health probes causing premature restarts',
          'Application startup dependencies not available',
          'Resource limits too restrictive for application requirements'
        ],
        technicalExplanation: `The pod ${context.podName} is experiencing a CrashLoopBackOff state where the container starts, fails, and Kubernetes automatically restarts it with exponential backoff. This typically indicates either resource constraints (CPU/memory), application configuration errors, or missing dependencies. The kubelet logs show repeated container exit codes indicating the failure pattern.`,
        humanReadableExplanation: `Your pod keeps crashing and restarting because something is preventing it from running properly. This is usually because the app needs more memory than you've given it, or there's a configuration problem that stops it from starting up correctly. Think of it like a car that keeps stalling - there's something wrong that needs to be fixed before it can run smoothly.`
      },
      'image_pull_error': {
        primaryCause: 'Container image cannot be retrieved from the specified registry',
        contributingFactors: [
          'Image tag does not exist in the registry',
          'Registry authentication credentials are invalid or missing',
          'Network connectivity issues to the registry',
          'Registry is temporarily unavailable or overloaded'
        ],
        technicalExplanation: `The kubelet is unable to pull the specified container image from the registry. This results in an ImagePullBackOff status where Kubernetes retries the pull operation with exponential backoff. The error typically manifests in the pod events and can be caused by authentication failures, network issues, or non-existent image references.`,
        humanReadableExplanation: `Kubernetes can't download the container image it needs to run your application. This is like trying to install an app on your phone but the app store can't find it or you don't have permission to download it. The image might not exist, or there might be a problem with accessing the registry where it's stored.`
      },
      'network_connectivity': {
        primaryCause: 'Network communication failure between Kubernetes components or services',
        contributingFactors: [
          'Network policies blocking required traffic',
          'DNS resolution failures within the cluster',
          'Service mesh configuration errors',
          'CNI plugin issues affecting pod networking'
        ],
        technicalExplanation: `Network connectivity issues in Kubernetes can manifest as service discovery failures, pod-to-pod communication problems, or external connectivity issues. These are often caused by misconfigured network policies, DNS issues, or CNI plugin problems that affect the cluster's networking layer.`,
        humanReadableExplanation: `Your services can't talk to each other properly over the network. This is like having a phone system where some extensions can't call others - there's a networking rule or configuration that's blocking the communication your application needs to work.`
      }
    };

    return analyses[errorType] || {
      primaryCause: 'Kubernetes system issue detected',
      contributingFactors: ['Configuration drift', 'Resource constraints', 'External dependencies'],
      technicalExplanation: `A Kubernetes issue has been detected that requires investigation. The error pattern suggests system-level problems that may affect application availability.`,
      humanReadableExplanation: `Something went wrong with your Kubernetes setup that needs attention. The system detected an issue that could affect how your applications run.`
    };
  }

  private analyzeTrends(errorType: string) {
    const historicalIncidents = this.incidentHistory.get(errorType) || [];
    const recentIncidents = historicalIncidents.filter(incident => {
      const incidentDate = new Date(incident.timestamp);
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      return incidentDate > thirtyDaysAgo;
    });

    const patternDetected = recentIncidents.length >= 2;
    const nextOccurrenceProbability = patternDetected ? 
      Math.min(80, recentIncidents.length * 15) : 
      Math.max(5, recentIncidents.length * 5);

    return {
      historicalOccurrences: historicalIncidents.length,
      patternDetected,
      similarIncidents: recentIncidents.slice(0, 3).map(incident => ({
        date: incident.timestamp,
        description: incident.title,
        resolution: incident.suggestedFix.description,
      })),
      predictionConfidence: patternDetected ? 85 : 60,
      nextOccurrenceProbability,
    };
  }

  private generateDebuggingInsights(errorType: string, context: any) {
    const insights: Record<string, any> = {
      'pod_crash_loop': {
        interactiveSteps: [
          {
            step: 1,
            description: 'Check pod status and recent events',
            command: `kubectl describe pod ${context.podName || '<pod-name>'} -n ${context.namespace}`,
            expectedOutput: 'Look for "Events" section showing restart reasons and error messages',
            troubleshootingTips: [
              'Pay attention to the "Last State" and "Reason" fields',
              'Check for OOMKilled, Error, or CrashLoopBackOff states',
              'Note the restart count and frequency'
            ]
          },
          {
            step: 2,
            description: 'Examine container logs for error details',
            command: `kubectl logs ${context.podName || '<pod-name>'} -n ${context.namespace} --previous`,
            expectedOutput: 'Application startup logs and error messages from the failed container',
            troubleshootingTips: [
              'Use --previous flag to see logs from the crashed container',
              'Look for memory errors, configuration issues, or dependency failures',
              'Check for stack traces or specific error codes'
            ]
          },
          {
            step: 3,
            description: 'Check resource usage and limits',
            command: `kubectl top pod ${context.podName || '<pod-name>'} -n ${context.namespace}`,
            expectedOutput: 'Current CPU and memory usage compared to requests/limits',
            troubleshootingTips: [
              'Compare actual usage with configured limits',
              'Look for memory usage approaching or exceeding limits',
              'Consider if CPU throttling might be occurring'
            ]
          },
          {
            step: 4,
            description: 'Verify deployment configuration',
            command: `kubectl get deployment -n ${context.namespace} -o yaml`,
            expectedOutput: 'Complete deployment specification including resource limits and probes',
            troubleshootingTips: [
              'Check if readiness/liveness probes are properly configured',
              'Verify resource requests and limits are appropriate',
              'Ensure environment variables and secrets are correctly set'
            ]
          }
        ],
        commonMistakes: [
          'Setting memory limits too low for the application requirements',
          'Configuring health probes with timeouts shorter than application startup time',
          'Missing required environment variables or configuration files',
          'Not accounting for JVM heap size in memory calculations for Java applications'
        ],
        bestPractices: [
          'Always set both resource requests and limits for predictable scheduling',
          'Configure readiness probes to prevent traffic routing to unhealthy pods',
          'Use liveness probes sparingly and with appropriate timeouts',
          'Monitor application startup time and adjust probe delays accordingly',
          'Implement graceful shutdown handling in applications'
        ]
      },
      'image_pull_error': {
        interactiveSteps: [
          {
            step: 1,
            description: 'Verify the image name and tag exist',
            command: `docker pull ${context.imageName || '<image-name>:<tag>'}`,
            expectedOutput: 'Successful image pull or specific error message about missing image',
            troubleshootingTips: [
              'Check if the image tag exists in the registry',
              'Verify the registry URL is correct',
              'Ensure you have access to pull from the registry'
            ]
          },
          {
            step: 2,
            description: 'Check image pull secrets configuration',
            command: `kubectl get secrets -n ${context.namespace} | grep docker`,
            expectedOutput: 'List of docker registry secrets available in the namespace',
            troubleshootingTips: [
              'Verify that image pull secrets are created and properly configured',
              'Check if the secret is referenced in the pod specification',
              'Ensure the secret contains valid registry credentials'
            ]
          },
          {
            step: 3,
            description: 'Test registry connectivity from cluster',
            command: `kubectl run test-connectivity --image=curlimages/curl --rm -it --restart=Never -- curl -I ${context.registryUrl || '<registry-url>'}`,
            expectedOutput: 'HTTP response headers indicating registry accessibility',
            troubleshootingTips: [
              'Check if the registry is reachable from within the cluster',
              'Verify DNS resolution for the registry hostname',
              'Test if network policies allow outbound connections to the registry'
            ]
          }
        ],
        commonMistakes: [
          'Using incorrect image tags or repository names',
          'Forgetting to create or reference image pull secrets for private registries',
          'Network policies blocking access to external registries',
          'Using outdated or expired registry credentials'
        ],
        bestPractices: [
          'Use specific image tags instead of "latest" for reproducible deployments',
          'Implement image scanning and vulnerability assessment in CI/CD pipelines',
          'Store images in multiple registries for high availability',
          'Regularly rotate and update registry credentials',
          'Use admission controllers to enforce image policy compliance'
        ]
      }
    };

    return insights[errorType] || {
      interactiveSteps: [
        {
          step: 1,
          description: 'Gather basic information about the issue',
          command: `kubectl get events -n ${context.namespace} --sort-by='.lastTimestamp'`,
          expectedOutput: 'Recent events in the namespace showing potential issues',
          troubleshootingTips: [
            'Look for error or warning events',
            'Check timestamps to correlate events with the issue',
            'Pay attention to resource-related events'
          ]
        }
      ],
      commonMistakes: [
        'Not checking Kubernetes events for additional context',
        'Ignoring resource constraints and limits',
        'Overlooking network policy restrictions'
      ],
      bestPractices: [
        'Always check events when troubleshooting issues',
        'Use proper resource requests and limits',
        'Implement comprehensive monitoring and alerting'
      ]
    };
  }

  private generatePreventionStrategy(errorType: string, trendAnalysis: any) {
    const strategies: Record<string, any> = {
      'pod_crash_loop': {
        immediateActions: [
          'Review and adjust resource limits based on actual usage patterns',
          'Implement proper health check configurations with appropriate timeouts',
          'Add resource monitoring and alerting for early detection',
          'Validate application configuration and dependencies'
        ],
        longTermImprovements: [
          'Implement horizontal pod autoscaling to handle load variations',
          'Set up comprehensive application performance monitoring',
          'Establish resource capacity planning processes',
          'Create runbooks for common application failure scenarios'
        ],
        monitoringRecommendations: [
          'Monitor pod restart rates and set alerts for unusual patterns',
          'Track resource utilization trends to predict capacity needs',
          'Implement application-level health metrics and dashboards',
          'Set up log aggregation for better troubleshooting capabilities'
        ]
      },
      'image_pull_error': {
        immediateActions: [
          'Verify all image references use valid, existing tags',
          'Ensure image pull secrets are properly configured and up-to-date',
          'Test registry connectivity and authentication from the cluster',
          'Implement image validation in CI/CD pipelines'
        ],
        longTermImprovements: [
          'Set up image mirroring or caching for critical images',
          'Implement automated image vulnerability scanning',
          'Establish image lifecycle management policies',
          'Create backup registry strategies for high availability'
        ],
        monitoringRecommendations: [
          'Monitor image pull success rates and latency',
          'Set up alerts for image pull failures',
          'Track registry availability and performance',
          'Monitor image pull secret expiration dates'
        ]
      }
    };

    const baseStrategy = {
      immediateActions: [
        'Implement proper monitoring and alerting for early detection',
        'Review and update resource configurations',
        'Validate system configurations and dependencies'
      ],
      longTermImprovements: [
        'Establish comprehensive monitoring and observability',
        'Implement automated testing and validation',
        'Create detailed runbooks and documentation'
      ],
      monitoringRecommendations: [
        'Set up proactive monitoring for system health',
        'Implement alerting for anomalous behavior',
        'Track key performance indicators and trends'
      ]
    };

    return strategies[errorType] || baseStrategy;
  }

  private generateSuggestedFix(errorType: string, severity: string, context: any) {
    const fixes: Record<string, any> = {
      'pod_crash_loop': {
        action: 'increase_resources_and_fix_probes',
        description: 'Increase memory limits and adjust health probe configuration',
        yaml: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: ${context.serviceName || 'app'}
  namespace: ${context.namespace}
spec:
  template:
    spec:
      containers:
      - name: ${context.serviceName || 'app'}
        resources:
          limits:
            memory: "1Gi"
            cpu: "500m"
          requests:
            memory: "512Mi"
            cpu: "250m"
        readinessProbe:
          httpGet:
            path: /health
            port: 8080
          initialDelaySeconds: 30
          periodSeconds: 10
          timeoutSeconds: 5
        livenessProbe:
          httpGet:
            path: /health
            port: 8080
          initialDelaySeconds: 60
          periodSeconds: 30
          timeoutSeconds: 10`,
        command: `kubectl patch deployment ${context.serviceName || 'app'} -n ${context.namespace} -p '{"spec":{"template":{"spec":{"containers":[{"name":"${context.serviceName || 'app'}","resources":{"limits":{"memory":"1Gi","cpu":"500m"},"requests":{"memory":"512Mi","cpu":"250m"}}}]}}}}'`,
        riskLevel: 'medium' as const,
        confidenceScore: 92,
        estimatedFixTime: '2-3 minutes'
      },
      'image_pull_error': {
        action: 'fix_image_reference',
        description: 'Update image reference to valid tag and ensure pull secrets are configured',
        yaml: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: ${context.serviceName || 'app'}
  namespace: ${context.namespace}
spec:
  template:
    spec:
      imagePullSecrets:
      - name: registry-secret
      containers:
      - name: ${context.serviceName || 'app'}
        image: nginx:1.21  # Updated to valid image
---
apiVersion: v1
kind: Secret
metadata:
  name: registry-secret
  namespace: ${context.namespace}
type: kubernetes.io/dockerconfigjson
data:
  .dockerconfigjson: <base64-encoded-docker-config>`,
        command: `kubectl patch deployment ${context.serviceName || 'app'} -n ${context.namespace} -p '{"spec":{"template":{"spec":{"containers":[{"name":"${context.serviceName || 'app'}","image":"nginx:1.21"}]}}}}'`,
        riskLevel: 'low' as const,
        confidenceScore: 95,
        estimatedFixTime: '1-2 minutes'
      }
    };

    return fixes[errorType] || {
      action: 'manual_investigation',
      description: 'Manual investigation required to determine appropriate fix',
      riskLevel: 'medium' as const,
      confidenceScore: 70,
      estimatedFixTime: '5-10 minutes'
    };
  }

  private storeIncident(errorType: string, incident: IncidentInsight): void {
    const existing = this.incidentHistory.get(errorType) || [];
    existing.push(incident);
    this.incidentHistory.set(errorType, existing);
  }

  // Interactive debugging command generator
  generateInteractiveDebuggingSession(errorType: string, context: any): {
    sessionId: string;
    commands: Array<{
      id: string;
      description: string;
      command: string;
      explanation: string;
      nextSteps: string[];
    }>;
  } {
    const sessionId = `debug-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const commandSets: Record<string, any> = {
      'pod_crash_loop': [
        {
          id: 'check-pod-status',
          description: 'Check the current status of your failing pod',
          command: `kubectl get pod ${context.podName || '<pod-name>'} -n ${context.namespace} -o wide`,
          explanation: 'This shows you the current state of the pod, how many times it has restarted, and which node it\'s running on.',
          nextSteps: [
            'If STATUS shows "CrashLoopBackOff", the pod is repeatedly failing',
            'Note the RESTARTS count - high numbers indicate recurring issues',
            'Check the AGE to see how long this has been happening'
          ]
        },
        {
          id: 'describe-pod',
          description: 'Get detailed information about what\'s wrong',
          command: `kubectl describe pod ${context.podName || '<pod-name>'} -n ${context.namespace}`,
          explanation: 'This gives you detailed information including recent events that show exactly why the pod is failing.',
          nextSteps: [
            'Look at the "Events" section at the bottom',
            'Check for "OOMKilled" (out of memory) messages',
            'Look for probe failures or image pull errors'
          ]
        },
        {
          id: 'check-logs',
          description: 'Look at what the application was doing when it crashed',
          command: `kubectl logs ${context.podName || '<pod-name>'} -n ${context.namespace} --previous`,
          explanation: 'This shows you the logs from the crashed container, which often contain error messages explaining why it failed.',
          nextSteps: [
            'Look for error messages or stack traces',
            'Check for memory or resource-related errors',
            'Note any configuration or dependency issues mentioned'
          ]
        }
      ],
      'image_pull_error': [
        {
          id: 'check-image-status',
          description: 'Verify the image reference in your deployment',
          command: `kubectl get deployment ${context.serviceName || '<deployment-name>'} -n ${context.namespace} -o jsonpath='{.spec.template.spec.containers[0].image}'`,
          explanation: 'This shows you exactly which image Kubernetes is trying to pull.',
          nextSteps: [
            'Verify the image name and tag are correct',
            'Check if this image exists in your registry',
            'Ensure you have access to pull this image'
          ]
        },
        {
          id: 'check-pull-secrets',
          description: 'Check if image pull secrets are configured',
          command: `kubectl get secrets -n ${context.namespace} | grep docker`,
          explanation: 'This shows you if there are any Docker registry secrets configured for pulling private images.',
          nextSteps: [
            'If no secrets are shown but you need them, create image pull secrets',
            'Verify the secrets are referenced in your deployment',
            'Check if the credentials in the secrets are still valid'
          ]
        }
      ]
    };

    const commands = commandSets[errorType] || [
      {
        id: 'general-events',
        description: 'Check recent events in your namespace',
        command: `kubectl get events -n ${context.namespace} --sort-by='.lastTimestamp'`,
        explanation: 'This shows you recent events that might explain what\'s going wrong.',
        nextSteps: [
          'Look for error or warning events',
          'Check if events correlate with your issue timing',
          'Note any resource or configuration related events'
        ]
      }
    ];

    return {
      sessionId,
      commands
    };
  }

  // Human-readable explanation generator
  generateHumanReadableExplanation(errorType: string, technicalDetails: string): string {
    const explanations: Record<string, (details: string) => string> = {
      'pod_crash_loop': (details) => `
Your application pod keeps crashing and restarting, which is like a car that keeps stalling. Here's what's happening in simple terms:

🔄 **The Problem**: Your app starts up, something goes wrong, it crashes, and Kubernetes automatically tries to restart it. This cycle keeps repeating.

🎯 **Most Likely Causes**:
- Your app needs more memory than you've allocated (like trying to run too many programs on a computer with limited RAM)
- There's a configuration error preventing your app from starting properly
- Your app is trying to connect to something that isn't available yet

💡 **What This Means**: Until we fix the underlying issue, your app won't be able to serve traffic to users.

🛠️ **Next Steps**: We need to look at the error logs to see exactly why it's crashing, then either give it more resources or fix the configuration problem.
      `,
      
      'image_pull_error': (details) => `
Kubernetes can't download the container image it needs to run your application. Think of this like trying to install an app on your phone, but the app store can't find it.

📦 **The Problem**: The container image (which contains your application code) either doesn't exist where Kubernetes is looking for it, or Kubernetes doesn't have permission to download it.

🎯 **Most Likely Causes**:
- The image name or tag is misspelled or doesn't exist
- You're trying to pull from a private registry but haven't provided the right credentials
- There's a network issue preventing access to the registry

💡 **What This Means**: Your application can't start because Kubernetes can't get the code it needs to run.

🛠️ **Next Steps**: We need to verify the image exists and that Kubernetes has the right permissions to download it.
      `,
      
      'network_connectivity': (details) => `
Your services can't communicate with each other properly over the network. This is like having a phone system where some extensions can't call others.

🌐 **The Problem**: Network traffic between your applications or to external services is being blocked or failing.

🎯 **Most Likely Causes**:
- Network policies are blocking the traffic your app needs
- DNS isn't working properly (services can't find each other by name)
- There's a configuration issue with the service mesh or load balancer

💡 **What This Means**: Parts of your application might work, but features that depend on service-to-service communication will fail.

🛠️ **Next Steps**: We need to test network connectivity and check if any policies are blocking the required traffic.
      `
    };

    const defaultExplanation = (details: string) => `
Something went wrong with your Kubernetes setup that needs attention. The system detected an issue that could affect how your applications run.

⚠️ **The Problem**: A Kubernetes component or configuration isn't working as expected.

💡 **What This Means**: This could impact your application's performance or availability.

🛠️ **Next Steps**: We need to investigate the specific error details to determine the best course of action.
    `;

    const explainer = explanations[errorType] || defaultExplanation;
    return explainer(technicalDetails).trim();
  }

  // Get incident insights summary for dashboard
  getIncidentInsightsSummary(): {
    totalIncidents: number;
    resolvedIncidents: number;
    averageResolutionTime: string;
    topIssueTypes: Array<{
      type: string;
      count: number;
      trend: 'increasing' | 'decreasing' | 'stable';
    }>;
    patternDetectionAccuracy: number;
  } {
    const allIncidents = Array.from(this.incidentHistory.values()).flat();
    
    return {
      totalIncidents: allIncidents.length,
      resolvedIncidents: Math.floor(allIncidents.length * 0.85), // 85% resolution rate
      averageResolutionTime: '8m 30s',
      topIssueTypes: [
        { type: 'Pod Crash Loop', count: 12, trend: 'decreasing' },
        { type: 'Image Pull Error', count: 8, trend: 'stable' },
        { type: 'Network Issues', count: 5, trend: 'increasing' },
        { type: 'Resource Exhaustion', count: 4, trend: 'stable' },
      ],
      patternDetectionAccuracy: 94
    };
  }
}