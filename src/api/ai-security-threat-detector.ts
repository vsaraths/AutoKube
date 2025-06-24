import { z } from 'zod';

// AI Security Threat Detector Schema
export const SecurityThreatSchema = z.object({
  threatId: z.string(),
  timestamp: z.string(),
  threatType: z.string(),
  severity: z.enum(['low', 'medium', 'high', 'critical']),
  description: z.string(),
  source: z.object({
    ip: z.string().optional(),
    user: z.string().optional(),
    namespace: z.string(),
    pod: z.string().optional(),
  }),
  riskScore: z.number().min(0).max(100),
  aiConfidence: z.number().min(0).max(100),
  evidencePatterns: z.array(z.string()),
  mitigationActions: z.array(z.object({
    action: z.string(),
    timestamp: z.string(),
    status: z.enum(['pending', 'executing', 'completed', 'failed']),
    effectiveness: z.number().optional(),
  })),
  forensicData: z.object({
    logEntries: z.array(z.string()),
    networkTraffic: z.array(z.string()),
    systemCalls: z.array(z.string()),
  }),
});

export const AnomalyDetectionSchema = z.object({
  anomalyId: z.string(),
  timestamp: z.string(),
  anomalyType: z.string(),
  deviationScore: z.number(),
  baseline: z.object({
    normalRange: z.string(),
    confidenceInterval: z.number(),
  }),
  currentValue: z.string(),
  predictedThreat: z.object({
    potentialImpact: z.string(),
    likelihood: z.number(),
    timeToEscalation: z.string(),
  }),
});

export const SecurityResponseSchema = z.object({
  responseId: z.string(),
  threatId: z.string(),
  responseType: z.enum(['block', 'isolate', 'quarantine', 'lockdown', 'monitor']),
  executionTime: z.string(),
  effectiveness: z.number(),
  collateralImpact: z.object({
    userImpact: z.string(),
    affectedServices: z.array(z.string()),
  }),
});

export type SecurityThreat = z.infer<typeof SecurityThreatSchema>;
export type AnomalyDetection = z.infer<typeof AnomalyDetectionSchema>;
export type SecurityResponse = z.infer<typeof SecurityResponseSchema>;

// AI Security Threat Detector
export class AISecurityThreatDetector {
  private static instance: AISecurityThreatDetector;
  private activeThreats: Map<string, SecurityThreat> = new Map();
  private detectedAnomalies: Map<string, AnomalyDetection> = new Map();
  private securityResponses: Map<string, SecurityResponse> = new Map();
  private monitoringEnabled: boolean = true;
  private monitoringInterval: NodeJS.Timeout | null = null;
  
  private constructor() {
    this.initializeSampleThreats();
    this.initializeSampleAnomalies();
    this.initializeSampleResponses();
    this.startMonitoring();
  }
  
  static getInstance(): AISecurityThreatDetector {
    if (!AISecurityThreatDetector.instance) {
      AISecurityThreatDetector.instance = new AISecurityThreatDetector();
    }
    return AISecurityThreatDetector.instance;
  }

  private initializeSampleThreats() {
    const sampleThreats: SecurityThreat[] = [
      {
        threatId: 'threat-001',
        timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
        threatType: 'unauthorized-access',
        severity: 'high',
        description: 'Unauthorized access attempt to the Kubernetes API server from an unknown IP address',
        source: {
          ip: '203.0.113.42',
          namespace: 'kube-system',
        },
        riskScore: 85,
        aiConfidence: 92,
        evidencePatterns: [
          'Multiple failed authentication attempts',
          'Access attempts to sensitive endpoints',
          'IP address not in allowed list',
          'Unusual access pattern detected',
        ],
        mitigationActions: [
          {
            action: 'block-ip',
            timestamp: new Date(Date.now() - 14 * 60 * 1000).toISOString(),
            status: 'completed',
            effectiveness: 100,
          },
          {
            action: 'alert-security-team',
            timestamp: new Date(Date.now() - 14 * 60 * 1000).toISOString(),
            status: 'completed',
            effectiveness: 100,
          },
        ],
        forensicData: {
          logEntries: [
            '2025-01-15T10:32:15Z [audit] WARN: Failed authentication attempt from 203.0.113.42',
            '2025-01-15T10:32:18Z [audit] WARN: Failed authentication attempt from 203.0.113.42',
            '2025-01-15T10:32:22Z [audit] WARN: Failed authentication attempt from 203.0.113.42',
            '2025-01-15T10:32:25Z [audit] WARN: Failed authentication attempt from 203.0.113.42',
            '2025-01-15T10:32:30Z [audit] WARN: IP 203.0.113.42 blocked due to multiple failed authentication attempts',
          ],
          networkTraffic: [
            '2025-01-15T10:32:15Z SRC=203.0.113.42 DST=10.0.0.1 PROTO=TCP SPT=52134 DPT=443 FLAGS=S',
            '2025-01-15T10:32:18Z SRC=203.0.113.42 DST=10.0.0.1 PROTO=TCP SPT=52135 DPT=443 FLAGS=S',
            '2025-01-15T10:32:22Z SRC=203.0.113.42 DST=10.0.0.1 PROTO=TCP SPT=52136 DPT=443 FLAGS=S',
          ],
          systemCalls: [
            '2025-01-15T10:32:15Z process(apiserver)[1234]: connect(2, {sa_family=AF_INET, sin_port=htons(443), sin_addr=inet_addr("203.0.113.42")}, 16) = 0',
            '2025-01-15T10:32:15Z process(apiserver)[1234]: read(5, "GET /api/v1/secrets HTTP/1.1\\r\\nHost: kubernetes.default.svc\\r\\n", 8192) = 74',
          ],
        },
      },
      {
        threatId: 'threat-002',
        timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        threatType: 'privilege-escalation',
        severity: 'critical',
        description: 'Potential privilege escalation attempt detected in production namespace',
        source: {
          user: 'service-account-frontend',
          namespace: 'production',
          pod: 'frontend-deployment-abc123',
        },
        riskScore: 92,
        aiConfidence: 88,
        evidencePatterns: [
          'Service account attempting to access resources beyond its RBAC permissions',
          'Multiple permission denied events in short timeframe',
          'Unusual syscall patterns detected',
          'Attempt to mount sensitive host paths',
        ],
        mitigationActions: [
          {
            action: 'isolate-pod',
            timestamp: new Date(Date.now() - 29 * 60 * 1000).toISOString(),
            status: 'completed',
            effectiveness: 100,
          },
          {
            action: 'revoke-service-account-token',
            timestamp: new Date(Date.now() - 28 * 60 * 1000).toISOString(),
            status: 'completed',
            effectiveness: 100,
          },
          {
            action: 'create-forensic-snapshot',
            timestamp: new Date(Date.now() - 27 * 60 * 1000).toISOString(),
            status: 'completed',
            effectiveness: 100,
          },
        ],
        forensicData: {
          logEntries: [
            '2025-01-15T10:15:22Z [audit] WARN: service-account-frontend forbidden access to /api/v1/secrets',
            '2025-01-15T10:15:25Z [audit] WARN: service-account-frontend forbidden access to /api/v1/namespaces/kube-system',
            '2025-01-15T10:15:30Z [audit] WARN: service-account-frontend forbidden access to /api/v1/nodes',
            '2025-01-15T10:15:35Z [kubelet] WARN: Pod frontend-deployment-abc123 attempting to mount hostPath volume',
          ],
          networkTraffic: [
            '2025-01-15T10:15:22Z SRC=10.0.0.15 DST=10.0.0.1 PROTO=TCP SPT=33456 DPT=443 FLAGS=PA',
            '2025-01-15T10:15:25Z SRC=10.0.0.15 DST=10.0.0.1 PROTO=TCP SPT=33456 DPT=443 FLAGS=PA',
            '2025-01-15T10:15:30Z SRC=10.0.0.15 DST=10.0.0.1 PROTO=TCP SPT=33456 DPT=443 FLAGS=PA',
          ],
          systemCalls: [
            '2025-01-15T10:15:40Z process(container)[5678]: mount("/proc/sys", "/host/proc/sys", "none", MS_BIND, NULL) = -1 EPERM (Operation not permitted)',
            '2025-01-15T10:15:45Z process(container)[5678]: capset(cap_set_t) = -1 EPERM (Operation not permitted)',
            '2025-01-15T10:15:50Z process(container)[5678]: ptrace(PTRACE_ATTACH, 1, NULL, NULL) = -1 EPERM (Operation not permitted)',
          ],
        },
      },
    ];

    sampleThreats.forEach(threat => {
      this.activeThreats.set(threat.threatId, threat);
    });
  }

  private initializeSampleAnomalies() {
    const sampleAnomalies: AnomalyDetection[] = [
      {
        anomalyId: 'anomaly-001',
        timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
        anomalyType: 'unusual-login',
        deviationScore: 3.8,
        baseline: {
          normalRange: '5-10 logins per hour',
          confidenceInterval: 95,
        },
        currentValue: '35 logins in last hour',
        predictedThreat: {
          potentialImpact: 'Credential theft or brute force attack',
          likelihood: 75,
          timeToEscalation: '30-60 minutes',
        },
      },
      {
        anomalyId: 'anomaly-002',
        timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
        anomalyType: 'api-abuse',
        deviationScore: 4.2,
        baseline: {
          normalRange: '100-200 API calls per minute',
          confidenceInterval: 90,
        },
        currentValue: '850 API calls per minute',
        predictedThreat: {
          potentialImpact: 'API abuse or denial of service',
          likelihood: 85,
          timeToEscalation: '15-30 minutes',
        },
      },
      {
        anomalyId: 'anomaly-003',
        timestamp: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
        anomalyType: 'data-exfiltration',
        deviationScore: 5.1,
        baseline: {
          normalRange: '50-100 MB outbound traffic per hour',
          confidenceInterval: 95,
        },
        currentValue: '1.2 GB outbound traffic in last hour',
        predictedThreat: {
          potentialImpact: 'Data theft or unauthorized data transfer',
          likelihood: 90,
          timeToEscalation: 'Immediate',
        },
      },
    ];

    sampleAnomalies.forEach(anomaly => {
      this.detectedAnomalies.set(anomaly.anomalyId, anomaly);
    });
  }

  private initializeSampleResponses() {
    const sampleResponses: SecurityResponse[] = [
      {
        responseId: 'response-001',
        threatId: 'threat-001',
        responseType: 'block',
        executionTime: new Date(Date.now() - 14 * 60 * 1000).toISOString(),
        effectiveness: 100,
        collateralImpact: {
          userImpact: 'None - blocked malicious IP only',
          affectedServices: [],
        },
      },
      {
        responseId: 'response-002',
        threatId: 'threat-002',
        responseType: 'isolate',
        executionTime: new Date(Date.now() - 29 * 60 * 1000).toISOString(),
        effectiveness: 100,
        collateralImpact: {
          userImpact: 'Minimal - isolated pod temporarily unavailable',
          affectedServices: ['frontend'],
        },
      },
      {
        responseId: 'response-003',
        threatId: 'threat-002',
        responseType: 'quarantine',
        executionTime: new Date(Date.now() - 28 * 60 * 1000).toISOString(),
        effectiveness: 95,
        collateralImpact: {
          userImpact: 'Minimal - service account permissions reduced',
          affectedServices: ['frontend'],
        },
      },
    ];

    sampleResponses.forEach(response => {
      this.securityResponses.set(response.responseId, response);
    });
  }

  private startMonitoring() {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }
    
    if (this.monitoringEnabled) {
      this.monitoringInterval = setInterval(() => {
        this.simulateSecurityMonitoring();
      }, 60000); // Check every minute
    }
  }

  private simulateSecurityMonitoring() {
    // Simulate new threats occasionally
    if (Math.random() > 0.7) {
      this.simulateNewThreat();
    }
    
    // Simulate new anomalies occasionally
    if (Math.random() > 0.6) {
      this.simulateNewAnomaly();
    }
    
    // Update existing threats
    this.activeThreats.forEach(threat => {
      // Occasionally resolve threats
      if (Math.random() > 0.9) {
        this.activeThreats.delete(threat.threatId);
      }
    });
  }

  private simulateNewThreat() {
    const threatTypes = [
      'unauthorized-access',
      'privilege-escalation',
      'data-exfiltration',
      'malware-detected',
      'container-escape',
      'crypto-mining',
      'lateral-movement',
    ];
    
    const namespaces = ['production', 'development', 'kube-system', 'monitoring', 'default'];
    
    const threatType = threatTypes[Math.floor(Math.random() * threatTypes.length)];
    const namespace = namespaces[Math.floor(Math.random() * namespaces.length)];
    const severity = Math.random() > 0.7 ? 'high' : Math.random() > 0.4 ? 'medium' : 'low';
    
    const newThreat: SecurityThreat = {
      threatId: `threat-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      timestamp: new Date().toISOString(),
      threatType,
      severity: severity as 'low' | 'medium' | 'high' | 'critical',
      description: this.getThreatDescription(threatType),
      source: {
        ip: Math.random() > 0.5 ? `203.0.113.${Math.floor(Math.random() * 255)}` : undefined,
        user: Math.random() > 0.5 ? `user-${Math.floor(Math.random() * 100)}` : undefined,
        namespace,
        pod: Math.random() > 0.5 ? `${namespace}-pod-${Math.floor(Math.random() * 100)}` : undefined,
      },
      riskScore: Math.floor(Math.random() * 30) + 70, // 70-100
      aiConfidence: Math.floor(Math.random() * 20) + 80, // 80-100
      evidencePatterns: this.getEvidencePatterns(threatType),
      mitigationActions: [],
      forensicData: {
        logEntries: this.generateLogEntries(threatType),
        networkTraffic: this.generateNetworkTraffic(threatType),
        systemCalls: this.generateSystemCalls(threatType),
      },
    };
    
    // Add automatic mitigation if enabled
    if (this.monitoringEnabled && severity !== 'low') {
      const mitigationAction = this.getMitigationAction(threatType);
      newThreat.mitigationActions.push({
        action: mitigationAction,
        timestamp: new Date().toISOString(),
        status: 'completed',
        effectiveness: Math.floor(Math.random() * 20) + 80, // 80-100
      });
      
      // Add security response
      const responseType = this.getResponseType(threatType);
      const newResponse: SecurityResponse = {
        responseId: `response-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        threatId: newThreat.threatId,
        responseType,
        executionTime: new Date().toISOString(),
        effectiveness: Math.floor(Math.random() * 20) + 80, // 80-100
        collateralImpact: {
          userImpact: this.getUserImpact(responseType),
          affectedServices: [],
        },
      };
      
      this.securityResponses.set(newResponse.responseId, newResponse);
    }
    
    this.activeThreats.set(newThreat.threatId, newThreat);
  }

  private simulateNewAnomaly() {
    const anomalyTypes = [
      'unusual-login',
      'api-abuse',
      'data-exfiltration',
      'resource-spike',
      'network-scan',
    ];
    
    const anomalyType = anomalyTypes[Math.floor(Math.random() * anomalyTypes.length)];
    const deviationScore = Math.random() * 5 + 2; // 2-7
    
    const newAnomaly: AnomalyDetection = {
      anomalyId: `anomaly-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      timestamp: new Date().toISOString(),
      anomalyType,
      deviationScore,
      baseline: {
        normalRange: this.getBaselineRange(anomalyType),
        confidenceInterval: 95,
      },
      currentValue: this.getCurrentValue(anomalyType),
      predictedThreat: {
        potentialImpact: this.getPotentialImpact(anomalyType),
        likelihood: Math.floor(Math.random() * 30) + 70, // 70-100
        timeToEscalation: this.getTimeToEscalation(anomalyType),
      },
    };
    
    this.detectedAnomalies.set(newAnomaly.anomalyId, newAnomaly);
  }

  private getThreatDescription(threatType: string): string {
    const descriptions: Record<string, string> = {
      'unauthorized-access': 'Unauthorized access attempt to the Kubernetes API server detected',
      'privilege-escalation': 'Potential privilege escalation attempt detected in container',
      'data-exfiltration': 'Unusual data transfer pattern detected, possible data exfiltration',
      'malware-detected': 'Malware signature detected in container image or running container',
      'container-escape': 'Potential container escape attempt detected',
      'crypto-mining': 'Cryptocurrency mining activity detected in cluster',
      'lateral-movement': 'Signs of lateral movement between pods detected',
    };
    
    return descriptions[threatType] || 'Unknown security threat detected';
  }

  private getEvidencePatterns(threatType: string): string[] {
    const evidencePatterns: Record<string, string[]> = {
      'unauthorized-access': [
        'Multiple failed authentication attempts',
        'Access attempts to sensitive endpoints',
        'IP address not in allowed list',
        'Unusual access pattern detected',
      ],
      'privilege-escalation': [
        'Service account attempting to access resources beyond its RBAC permissions',
        'Multiple permission denied events in short timeframe',
        'Unusual syscall patterns detected',
        'Attempt to mount sensitive host paths',
      ],
      'data-exfiltration': [
        'Unusual outbound network traffic volume',
        'Sensitive data access followed by external communication',
        'Unusual destination for outbound traffic',
        'Encrypted channel established to unknown endpoint',
      ],
      'malware-detected': [
        'Known malware signature detected',
        'Unusual file system activity',
        'Suspicious process execution',
        'Connection to known malicious IP addresses',
      ],
      'container-escape': [
        'Attempts to access host namespace',
        'Privileged container operations',
        'Modification of host system files',
        'Unusual syscall patterns indicative of escape attempts',
      ],
      'crypto-mining': [
        'High CPU utilization with specific patterns',
        'Known mining pool connections',
        'Cryptocurrency wallet addresses in network traffic',
        'Mining process signatures detected',
      ],
      'lateral-movement': [
        'Pod-to-pod connections outside normal patterns',
        'Credential access attempts across multiple pods',
        'Network scanning activity within cluster',
        'Unusual service account token usage',
      ],
    };
    
    return evidencePatterns[threatType] || ['Suspicious activity detected', 'Unusual patterns identified'];
  }

  private getMitigationAction(threatType: string): string {
    const actions: Record<string, string> = {
      'unauthorized-access': 'block-ip',
      'privilege-escalation': 'isolate-pod',
      'data-exfiltration': 'block-egress',
      'malware-detected': 'quarantine-pod',
      'container-escape': 'terminate-pod',
      'crypto-mining': 'terminate-pod',
      'lateral-movement': 'network-isolation',
    };
    
    return actions[threatType] || 'alert-security-team';
  }

  private getResponseType(threatType: string): 'block' | 'isolate' | 'quarantine' | 'lockdown' | 'monitor' {
    const responseTypes: Record<string, 'block' | 'isolate' | 'quarantine' | 'lockdown' | 'monitor'> = {
      'unauthorized-access': 'block',
      'privilege-escalation': 'isolate',
      'data-exfiltration': 'block',
      'malware-detected': 'quarantine',
      'container-escape': 'lockdown',
      'crypto-mining': 'quarantine',
      'lateral-movement': 'isolate',
    };
    
    return responseTypes[threatType] || 'monitor';
  }

  private getUserImpact(responseType: string): string {
    const impacts: Record<string, string> = {
      'block': 'None - blocked malicious activity only',
      'isolate': 'Minimal - isolated resources temporarily unavailable',
      'quarantine': 'Low - quarantined resources have limited functionality',
      'lockdown': 'Medium - some services may be temporarily unavailable',
      'monitor': 'None - monitoring only',
    };
    
    return impacts[responseType] || 'Unknown impact';
  }

  private generateLogEntries(threatType: string): string[] {
    const timestamp = new Date().toISOString();
    const logEntries: Record<string, string[]> = {
      'unauthorized-access': [
        `${timestamp} [audit] WARN: Failed authentication attempt from 203.0.113.42`,
        `${timestamp} [audit] WARN: Failed authentication attempt from 203.0.113.42`,
        `${timestamp} [audit] WARN: Failed authentication attempt from 203.0.113.42`,
        `${timestamp} [audit] WARN: IP 203.0.113.42 blocked due to multiple failed authentication attempts`,
      ],
      'privilege-escalation': [
        `${timestamp} [audit] WARN: service-account-frontend forbidden access to /api/v1/secrets`,
        `${timestamp} [audit] WARN: service-account-frontend forbidden access to /api/v1/namespaces/kube-system`,
        `${timestamp} [audit] WARN: service-account-frontend forbidden access to /api/v1/nodes`,
        `${timestamp} [kubelet] WARN: Pod frontend-deployment-abc123 attempting to mount hostPath volume`,
      ],
      'data-exfiltration': [
        `${timestamp} [audit] INFO: Large data transfer from pod database-backup-job-xyz789`,
        `${timestamp} [audit] INFO: Unusual destination IP for outbound traffic: 198.51.100.234`,
        `${timestamp} [audit] WARN: Sensitive data access followed by external communication`,
      ],
    };
    
    return logEntries[threatType] || [
      `${timestamp} [audit] WARN: Suspicious activity detected`,
      `${timestamp} [audit] WARN: Potential security threat identified`,
    ];
  }

  private generateNetworkTraffic(threatType: string): string[] {
    const timestamp = new Date().toISOString();
    const networkTraffic: Record<string, string[]> = {
      'unauthorized-access': [
        `${timestamp} SRC=203.0.113.42 DST=10.0.0.1 PROTO=TCP SPT=52134 DPT=443 FLAGS=S`,
        `${timestamp} SRC=203.0.113.42 DST=10.0.0.1 PROTO=TCP SPT=52135 DPT=443 FLAGS=S`,
        `${timestamp} SRC=203.0.113.42 DST=10.0.0.1 PROTO=TCP SPT=52136 DPT=443 FLAGS=S`,
      ],
      'privilege-escalation': [
        `${timestamp} SRC=10.0.0.15 DST=10.0.0.1 PROTO=TCP SPT=33456 DPT=443 FLAGS=PA`,
        `${timestamp} SRC=10.0.0.15 DST=10.0.0.1 PROTO=TCP SPT=33456 DPT=443 FLAGS=PA`,
        `${timestamp} SRC=10.0.0.15 DST=10.0.0.1 PROTO=TCP SPT=33456 DPT=443 FLAGS=PA`,
      ],
      'data-exfiltration': [
        `${timestamp} SRC=10.0.0.25 DST=198.51.100.234 PROTO=TCP SPT=45678 DPT=443 FLAGS=PA LEN=65535`,
        `${timestamp} SRC=10.0.0.25 DST=198.51.100.234 PROTO=TCP SPT=45678 DPT=443 FLAGS=PA LEN=65535`,
        `${timestamp} SRC=10.0.0.25 DST=198.51.100.234 PROTO=TCP SPT=45678 DPT=443 FLAGS=PA LEN=65535`,
      ],
    };
    
    return networkTraffic[threatType] || [
      `${timestamp} SRC=10.0.0.100 DST=10.0.0.200 PROTO=TCP SPT=12345 DPT=443 FLAGS=PA`,
      `${timestamp} SRC=10.0.0.100 DST=10.0.0.200 PROTO=TCP SPT=12345 DPT=443 FLAGS=PA`,
    ];
  }

  private generateSystemCalls(threatType: string): string[] {
    const timestamp = new Date().toISOString();
    const systemCalls: Record<string, string[]> = {
      'unauthorized-access': [
        `${timestamp} process(apiserver)[1234]: connect(2, {sa_family=AF_INET, sin_port=htons(443), sin_addr=inet_addr("203.0.113.42")}, 16) = 0`,
        `${timestamp} process(apiserver)[1234]: read(5, "GET /api/v1/secrets HTTP/1.1\\r\\nHost: kubernetes.default.svc\\r\\n", 8192) = 74`,
      ],
      'privilege-escalation': [
        `${timestamp} process(container)[5678]: mount("/proc/sys", "/host/proc/sys", "none", MS_BIND, NULL) = -1 EPERM (Operation not permitted)`,
        `${timestamp} process(container)[5678]: capset(cap_set_t) = -1 EPERM (Operation not permitted)`,
        `${timestamp} process(container)[5678]: ptrace(PTRACE_ATTACH, 1, NULL, NULL) = -1 EPERM (Operation not permitted)`,
      ],
      'container-escape': [
        `${timestamp} process(container)[9012]: unshare(CLONE_NEWNS) = 0`,
        `${timestamp} process(container)[9012]: mount("/proc", "/host/proc", "none", MS_BIND, NULL) = 0`,
        `${timestamp} process(container)[9012]: chroot("/host") = 0`,
      ],
    };
    
    return systemCalls[threatType] || [
      `${timestamp} process(container)[1234]: read(5, "data", 4096) = 4`,
      `${timestamp} process(container)[1234]: write(6, "data", 4) = 4`,
    ];
  }

  private getBaselineRange(anomalyType: string): string {
    const ranges: Record<string, string> = {
      'unusual-login': '5-10 logins per hour',
      'api-abuse': '100-200 API calls per minute',
      'data-exfiltration': '50-100 MB outbound traffic per hour',
      'resource-spike': '40-60% CPU utilization',
      'network-scan': '10-20 unique connection attempts per minute',
    };
    
    return ranges[anomalyType] || 'Normal operational range';
  }

  private getCurrentValue(anomalyType: string): string {
    const values: Record<string, string> = {
      'unusual-login': `${Math.floor(Math.random() * 30) + 20} logins in last hour`,
      'api-abuse': `${Math.floor(Math.random() * 500) + 500} API calls per minute`,
      'data-exfiltration': `${(Math.random() * 1.5 + 0.5).toFixed(1)} GB outbound traffic in last hour`,
      'resource-spike': `${Math.floor(Math.random() * 30) + 70}% CPU utilization`,
      'network-scan': `${Math.floor(Math.random() * 50) + 50} unique connection attempts per minute`,
    };
    
    return values[anomalyType] || 'Abnormal value detected';
  }

  private getPotentialImpact(anomalyType: string): string {
    const impacts: Record<string, string> = {
      'unusual-login': 'Credential theft or brute force attack',
      'api-abuse': 'API abuse or denial of service',
      'data-exfiltration': 'Data theft or unauthorized data transfer',
      'resource-spike': 'Resource exhaustion or denial of service',
      'network-scan': 'Reconnaissance for lateral movement',
    };
    
    return impacts[anomalyType] || 'Potential security breach';
  }

  private getTimeToEscalation(anomalyType: string): string {
    const times: Record<string, string> = {
      'unusual-login': '30-60 minutes',
      'api-abuse': '15-30 minutes',
      'data-exfiltration': 'Immediate',
      'resource-spike': '5-15 minutes',
      'network-scan': '1-2 hours',
    };
    
    return times[anomalyType] || 'Unknown';
  }

  // Public API Methods
  async getActiveThreats(): Promise<SecurityThreat[]> {
    return Array.from(this.activeThreats.values());
  }

  async getThreatById(threatId: string): Promise<SecurityThreat | null> {
    return this.activeThreats.get(threatId) || null;
  }

  async detectAnomalousActivity(): Promise<AnomalyDetection[]> {
    return Array.from(this.detectedAnomalies.values());
  }

  async getAnomalyById(anomalyId: string): Promise<AnomalyDetection | null> {
    return this.detectedAnomalies.get(anomalyId) || null;
  }

  async getSecurityResponses(): Promise<SecurityResponse[]> {
    return Array.from(this.securityResponses.values());
  }

  async getResponseById(responseId: string): Promise<SecurityResponse | null> {
    return this.securityResponses.get(responseId) || null;
  }

  async enableThreatMonitoring(): Promise<boolean> {
    this.monitoringEnabled = true;
    this.startMonitoring();
    return true;
  }

  async disableThreatMonitoring(): Promise<boolean> {
    this.monitoringEnabled = false;
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }
    return true;
  }

  async respondToThreat(threatId: string, responseType: 'block' | 'isolate' | 'quarantine' | 'lockdown' | 'monitor'): Promise<SecurityResponse | null> {
    const threat = this.activeThreats.get(threatId);
    if (!threat) return null;
    
    const newResponse: SecurityResponse = {
      responseId: `response-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      threatId,
      responseType,
      executionTime: new Date().toISOString(),
      effectiveness: Math.floor(Math.random() * 20) + 80, // 80-100
      collateralImpact: {
        userImpact: this.getUserImpact(responseType),
        affectedServices: [],
      },
    };
    
    // Add mitigation action to threat
    threat.mitigationActions.push({
      action: `${responseType}-threat`,
      timestamp: new Date().toISOString(),
      status: 'completed',
      effectiveness: newResponse.effectiveness,
    });
    
    this.activeThreats.set(threatId, threat);
    this.securityResponses.set(newResponse.responseId, newResponse);
    
    return newResponse;
  }

  // Generate security report
  generateSecurityReport(): {
    summary: {
      totalThreats: number;
      criticalThreats: number;
      highThreats: number;
      autoResponsesTriggered: number;
      averageResponseTime: string;
    };
    threatBreakdown: Record<string, number>;
    responseEffectiveness: number;
    recommendations: string[];
  } {
    const threats = Array.from(this.activeThreats.values());
    const responses = Array.from(this.securityResponses.values());
    
    const criticalThreats = threats.filter(t => t.severity === 'critical').length;
    const highThreats = threats.filter(t => t.severity === 'high').length;
    
    // Calculate threat breakdown
    const threatBreakdown: Record<string, number> = {};
    threats.forEach(threat => {
      threatBreakdown[threat.threatType] = (threatBreakdown[threat.threatType] || 0) + 1;
    });
    
    // Calculate response effectiveness
    const responseEffectiveness = responses.length > 0
      ? responses.reduce((sum, r) => sum + r.effectiveness, 0) / responses.length
      : 0;
    
    // Calculate average response time
    let avgResponseTime = 'N/A';
    if (responses.length > 0) {
      const responseTimes = responses.map(r => {
        const threatTime = new Date(this.activeThreats.get(r.threatId)?.timestamp || 0).getTime();
        const responseTime = new Date(r.executionTime).getTime();
        return (responseTime - threatTime) / 1000; // seconds
      });
      
      const avgSeconds = responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length;
      avgResponseTime = avgSeconds < 60 
        ? `${Math.round(avgSeconds)}s` 
        : `${Math.floor(avgSeconds / 60)}m ${Math.round(avgSeconds % 60)}s`;
    }
    
    // Generate recommendations
    const recommendations: string[] = [];
    
    if (criticalThreats > 0) {
      recommendations.push('Immediate attention required for critical security threats');
    }
    
    if (highThreats > 0) {
      recommendations.push('Review and address high severity security threats');
    }
    
    if (Object.keys(threatBreakdown).includes('unauthorized-access') && threatBreakdown['unauthorized-access'] > 1) {
      recommendations.push('Multiple unauthorized access attempts detected - review authentication policies');
    }
    
    if (Object.keys(threatBreakdown).includes('privilege-escalation')) {
      recommendations.push('Privilege escalation attempts detected - review RBAC permissions and Pod Security Policies');
    }
    
    if (Object.keys(threatBreakdown).includes('data-exfiltration')) {
      recommendations.push('Potential data exfiltration detected - implement network policies to restrict egress traffic');
    }
    
    if (responseEffectiveness < 90) {
      recommendations.push('Security response effectiveness below threshold - review and improve response mechanisms');
    }
    
    return {
      summary: {
        totalThreats: threats.length,
        criticalThreats,
        highThreats,
        autoResponsesTriggered: responses.length,
        averageResponseTime: avgResponseTime,
      },
      threatBreakdown,
      responseEffectiveness: Math.round(responseEffectiveness),
      recommendations,
    };
  }
}