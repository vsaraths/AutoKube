from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import random
import time

app = FastAPI(title="AutoKube AI Backend")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class DiagnoseRequest(BaseModel):
    logs: List[str]
    namespace: Optional[str] = "default"
    context: Optional[Dict[str, Any]] = None

class DiagnoseResponse(BaseModel):
    issue: str
    confidence: float
    suggestion: str
    details: Optional[Dict[str, Any]] = None

# Sample issues for mock responses
SAMPLE_ISSUES = [
    {
        "issue": "CrashLoopBackOff",
        "confidence": 0.92,
        "suggestion": "Restart the pod or check livenessProbe configuration",
        "details": {
            "affected_pods": ["frontend-app-7d9f4b8f9c-2x4z5"],
            "root_cause": "Application is failing to start due to missing configuration",
            "severity": "high"
        }
    },
    {
        "issue": "ImagePullBackOff",
        "confidence": 0.89,
        "suggestion": "Verify image name and ensure pull secrets are configured correctly",
        "details": {
            "affected_pods": ["backend-api-5c8d7f6b4d-3y6x7"],
            "root_cause": "Container image not found in registry",
            "severity": "medium"
        }
    },
    {
        "issue": "OOMKilled",
        "confidence": 0.95,
        "suggestion": "Increase memory limits for the container",
        "details": {
            "affected_pods": ["database-0"],
            "root_cause": "Container exceeded memory limits",
            "severity": "critical"
        }
    },
    {
        "issue": "NetworkPolicyBlocked",
        "confidence": 0.87,
        "suggestion": "Update network policy to allow required traffic",
        "details": {
            "affected_pods": ["auth-service-6b9c5d4e3f-4z7x8"],
            "root_cause": "Network policy is blocking required connections",
            "severity": "high"
        }
    },
    {
        "issue": "PodUnschedulable",
        "confidence": 0.91,
        "suggestion": "Check node resources or adjust pod resource requests",
        "details": {
            "affected_pods": ["analytics-job-9e8d7c6b5a"],
            "root_cause": "Insufficient resources available on nodes",
            "severity": "medium"
        }
    }
]

@app.get("/")
async def root():
    return {"message": "AutoKube AI Backend is running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "version": "1.0.0"}

@app.post("/api/diagnose", response_model=DiagnoseResponse)
async def diagnose_issues(request: DiagnoseRequest):
    # Simulate processing time for more realistic API behavior
    time.sleep(0.5)
    
    # Log the request for debugging
    print(f"Received logs for namespace: {request.namespace}")
    print(f"Log count: {len(request.logs)}")
    
    # Simple keyword-based analysis for demo purposes
    if request.logs:
        for log in request.logs:
            if "CrashLoopBackOff" in log:
                return SAMPLE_ISSUES[0]
            elif "ImagePull" in log:
                return SAMPLE_ISSUES[1]
            elif "OOMKilled" in log:
                return SAMPLE_ISSUES[2]
            elif "NetworkPolicy" in log:
                return SAMPLE_ISSUES[3]
            elif "Unschedulable" in log:
                return SAMPLE_ISSUES[4]
    
    # If no specific issue detected, return a random one
    return random.choice(SAMPLE_ISSUES)

@app.get("/api/issues")
async def get_issues():
    """Get a list of recent issues detected by AutoKube AI"""
    return {
        "issues": [
            {
                "id": "issue-001",
                "namespace": "production",
                "resource": "deployment/frontend",
                "issue": "CrashLoopBackOff",
                "detected": "2025-01-15T10:30:15Z",
                "status": "remediated",
                "confidence": 0.92
            },
            {
                "id": "issue-002",
                "namespace": "staging",
                "resource": "pod/backend-api-5c8d7f6b4d-3y6x7",
                "issue": "ImagePullBackOff",
                "detected": "2025-01-15T09:45:22Z",
                "status": "pending",
                "confidence": 0.89
            },
            {
                "id": "issue-003",
                "namespace": "production",
                "resource": "statefulset/database",
                "issue": "OOMKilled",
                "detected": "2025-01-15T08:12:05Z",
                "status": "remediated",
                "confidence": 0.95
            }
        ]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5000)