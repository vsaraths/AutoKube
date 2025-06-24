import { z } from 'zod';

// AI Confidence Scoring Schema
export const AIConfidenceSchema = z.object({
  baseConfidence: z.number().min(0).max(100),
  adjustments: z.object({
    historicalSuccess: z.number(),
    bestPracticeAlignment: z.number(),
    riskFactor: z.number(),
    complexityPenalty: z.number(),
  }),
  finalConfidence: z.number().min(0).max(100),
  autoApprovalEligible: z.boolean(),
});

export const FixEvaluationSchema = z.object({
  issueType: z.string(),
  severity: z.enum(['low', 'medium', 'high', 'critical']),
  suggestedFix: z.object({
    action: z.string(),
    description: z.string(),
    yaml: z.string().optional(),
    command: z.string().optional(),
  }),
  confidence: z.infer<typeof AIConfidenceSchema>,
  riskAssessment: z.object({
    level: z.enum(['low', 'medium', 'high']),
    factors: z.array(z.string()),
  }),
  bestPracticeValidation: z.object({
    score: z.number().min(0).max(100),
    violations: z.array(z.string()),
    recommendations: z.array(z.string()),
  }),
});

export type AIConfidence = z.infer<typeof AIConfidenceSchema>;
export type FixEvaluation = z.infer<typeof FixEvaluationSchema>;

// Enhanced AI Confidence Scoring Engine
export class AIConfidenceScorer {
  private static instance: AIConfidenceScorer;
  private historicalData: Map<string, { attempts: number; successes: number }> = new Map();
  
  private constructor() {
    this.initializeHistoricalData();
  }
  
  static getInstance(): AIConfidenceScorer {
    if (!AIConfidenceScorer.instance) {
      AIConfidenceScorer.instance = new AIConfidenceScorer();
    }
    return AIConfidenceScorer.instance;
  }

  private initializeHistoricalData() {
    // Initialize with mock historical success rates
    this.historicalData.set('pod_crash_loop', { attempts: 50, successes: 47 });
    this.historicalData.set('image_pull_error', { attempts: 30, successes: 29 });
    this.historicalData.set('resource_quota_exceeded', { attempts: 25, successes: 23 });
    this.historicalData.set('node_scheduling_failure', { attempts: 20, successes: 16 });
    this.historicalData.set('api_server_connection_failure', { attempts: 15, successes: 12 });
    this.historicalData.set('metrics_server_failure', { attempts: 35, successes: 33 });
    this.historicalData.set('ip_exhaustion', { attempts: 10, successes: 8 });
  }

  // Calculate AI confidence score based on multiple factors
  calculateConfidence(issueType: string, severity: string, fixComplexity: number): AIConfidence {
    // Base confidence starts at 80%
    let baseConfidence = 80;
    
    // Adjust based on issue type familiarity
    const commonIssues = [
      'pod_crash_loop', 
      'image_pull_error', 
      'resource_quota_exceeded',
      'metrics_server_failure'
    ];
    
    if (commonIssues.includes(issueType)) {
      baseConfidence += 10;
    }
    
    // Historical success rate adjustment
    const historical = this.historicalData.get(issueType);
    let historicalSuccess = 0;
    if (historical && historical.attempts > 5) {
      const successRate = (historical.successes / historical.attempts) * 100;
      historicalSuccess = (successRate - 80) * 0.2; // Scale to ±4 points
    }
    
    // Best practice alignment (simulated)
    const bestPracticeAlignment = this.calculateBestPracticeAlignment(issueType);
    const bestPracticeBonus = (bestPracticeAlignment - 80) * 0.1; // Scale to ±2 points
    
    // Risk factor penalty
    const riskPenalty = this.calculateRiskPenalty(severity, fixComplexity);
    
    // Complexity penalty
    const complexityPenalty = Math.min(fixComplexity * 2, 10); // Max 10 point penalty
    
    // Calculate final confidence
    const finalConfidence = Math.max(0, Math.min(100, 
      baseConfidence + historicalSuccess + bestPracticeBonus - riskPenalty - complexityPenalty
    ));
    
    return {
      baseConfidence,
      adjustments: {
        historicalSuccess,
        bestPracticeAlignment: bestPracticeBonus,
        riskFactor: -riskPenalty,
        complexityPenalty: -complexityPenalty,
      },
      finalConfidence: Math.round(finalConfidence),
      autoApprovalEligible: finalConfidence >= 90
    };
  }

  private calculateBestPracticeAlignment(issueType: string): number {
    // Simulate best practice alignment scoring
    const alignmentScores: Record<string, number> = {
      'pod_crash_loop': 92,
      'image_pull_error': 95,
      'resource_quota_exceeded': 88,
      'node_scheduling_failure': 75,
      'api_server_connection_failure': 70,
      'metrics_server_failure': 90,
      'ip_exhaustion': 85,
    };
    
    return alignmentScores[issueType] || 80;
  }

  private calculateRiskPenalty(severity: string, complexity: number): number {
    let penalty = 0;
    
    // Severity-based penalty
    switch (severity) {
      case 'critical':
        penalty += 8;
        break;
      case 'high':
        penalty += 5;
        break;
      case 'medium':
        penalty += 2;
        break;
      default:
        penalty += 0;
    }
    
    // Complexity-based penalty
    penalty += Math.min(complexity * 1.5, 7);
    
    return penalty;
  }

  // Update historical data based on fix outcomes
  updateHistoricalData(issueType: string, success: boolean): void {
    const current = this.historicalData.get(issueType) || { attempts: 0, successes: 0 };
    current.attempts += 1;
    if (success) {
      current.successes += 1;
    }
    this.historicalData.set(issueType, current);
  }

  // Evaluate a complete fix proposal
  evaluateFix(
    issueType: string, 
    severity: 'low' | 'medium' | 'high' | 'critical',
    suggestedFix: {
      action: string;
      description: string;
      yaml?: string;
      command?: string;
    }
  ): FixEvaluation {
    // Calculate fix complexity based on action type
    const complexityMap: Record<string, number> = {
      'restart_pod': 1,
      'scale_deployment': 2,
      'update_image': 2,
      'increase_resources': 3,
      'modify_config': 4,
      'network_policy_update': 5,
      'cluster_scaling': 6,
    };
    
    const complexity = complexityMap[suggestedFix.action] || 3;
    const confidence = this.calculateConfidence(issueType, severity, complexity);
    
    // Risk assessment
    const riskLevel = this.assessRiskLevel(severity, complexity, confidence.finalConfidence);
    const riskFactors = this.identifyRiskFactors(issueType, suggestedFix.action);
    
    // Best practice validation
    const bestPracticeValidation = this.validateBestPractices(issueType, suggestedFix);
    
    return {
      issueType,
      severity,
      suggestedFix,
      confidence,
      riskAssessment: {
        level: riskLevel,
        factors: riskFactors,
      },
      bestPracticeValidation,
    };
  }

  private assessRiskLevel(
    severity: string, 
    complexity: number, 
    confidence: number
  ): 'low' | 'medium' | 'high' {
    if (severity === 'critical' || complexity >= 5 || confidence < 80) {
      return 'high';
    }
    if (severity === 'high' || complexity >= 3 || confidence < 90) {
      return 'medium';
    }
    return 'low';
  }

  private identifyRiskFactors(issueType: string, action: string): string[] {
    const factors: string[] = [];
    
    // Production environment risks
    factors.push('Production environment impact');
    
    // Action-specific risks
    if (action.includes('scale') || action.includes('resource')) {
      factors.push('Resource modification required');
    }
    
    if (action.includes('network') || action.includes('policy')) {
      factors.push('Network connectivity changes');
    }
    
    if (action.includes('restart') || action.includes('rollback')) {
      factors.push('Service availability during fix');
    }
    
    // Issue-specific risks
    if (issueType.includes('cluster') || issueType.includes('node')) {
      factors.push('Cluster-wide impact possible');
    }
    
    return factors;
  }

  private validateBestPractices(
    issueType: string, 
    suggestedFix: { action: string; description: string; yaml?: string; command?: string }
  ): { score: number; violations: string[]; recommendations: string[] } {
    const violations: string[] = [];
    const recommendations: string[] = [];
    let score = 100;
    
    // Check for resource limits in YAML
    if (suggestedFix.yaml && !suggestedFix.yaml.includes('limits:')) {
      violations.push('Missing resource limits in deployment');
      recommendations.push('Add CPU and memory limits to prevent resource exhaustion');
      score -= 10;
    }
    
    // Check for health probes
    if (suggestedFix.yaml && !suggestedFix.yaml.includes('Probe')) {
      violations.push('Missing health probes');
      recommendations.push('Add readiness and liveness probes for better reliability');
      score -= 8;
    }
    
    // Check for security context
    if (suggestedFix.yaml && !suggestedFix.yaml.includes('securityContext')) {
      violations.push('Missing security context');
      recommendations.push('Add security context to follow security best practices');
      score -= 5;
    }
    
    // Validate command safety
    if (suggestedFix.command && suggestedFix.command.includes('--force')) {
      violations.push('Using --force flag in command');
      recommendations.push('Consider safer alternatives to --force operations');
      score -= 15;
    }
    
    return {
      score: Math.max(0, score),
      violations,
      recommendations,
    };
  }

  // Get confidence threshold recommendations
  getConfidenceThresholds(): {
    autoApply: number;
    manualReview: number;
    requireApproval: number;
  } {
    return {
      autoApply: 95,      // 95%+ confidence → auto-apply
      manualReview: 80,   // 80-95% confidence → manual review
      requireApproval: 80 // Below 80% → requires approval
    };
  }

  // Generate confidence report
  generateConfidenceReport(): {
    totalFixes: number;
    averageConfidence: number;
    autoApprovalRate: number;
    successRate: number;
    topPerformingIssues: Array<{ issueType: string; successRate: number }>;
  } {
    const totalAttempts = Array.from(this.historicalData.values())
      .reduce((sum, data) => sum + data.attempts, 0);
    
    const totalSuccesses = Array.from(this.historicalData.values())
      .reduce((sum, data) => sum + data.successes, 0);
    
    const topPerforming = Array.from(this.historicalData.entries())
      .map(([issueType, data]) => ({
        issueType,
        successRate: data.attempts > 0 ? (data.successes / data.attempts) * 100 : 0
      }))
      .sort((a, b) => b.successRate - a.successRate)
      .slice(0, 5);
    
    return {
      totalFixes: totalAttempts,
      averageConfidence: 87, // Simulated average
      autoApprovalRate: 65,  // Simulated auto-approval rate
      successRate: totalAttempts > 0 ? (totalSuccesses / totalAttempts) * 100 : 0,
      topPerformingIssues: topPerforming,
    };
  }
}