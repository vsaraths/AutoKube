#!/bin/bash

# AutoKube Installation Script
# This script installs AutoKube on your Kubernetes cluster

set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Default values
NAMESPACE="autokube"
RELEASE_NAME="autokube"
AUTO_REMEDIATION="true"
MONITORING_ENABLED="true"
CHART_PATH="./helm/autokube-core"

# Print banner
echo -e "${BLUE}"
echo "  █████╗ ██╗   ██╗████████╗ ██████╗ ██╗  ██╗██╗   ██╗██████╗ ███████╗"
echo " ██╔══██╗██║   ██║╚══██╔══╝██╔═══██╗██║ ██╔╝██║   ██║██╔══██╗██╔════╝"
echo " ███████║██║   ██║   ██║   ██║   ██║█████╔╝ ██║   ██║██████╔╝█████╗  "
echo " ██╔══██║██║   ██║   ██║   ██║   ██║██╔═██╗ ██║   ██║██╔══██╗██╔══╝  "
echo " ██║  ██║╚██████╔╝   ██║   ╚██████╔╝██║  ██╗╚██████╔╝██████╔╝███████╗"
echo " ╚═╝  ╚═╝ ╚═════╝    ╚═╝    ╚═════╝ ╚═╝  ╚═╝ ╚═════╝ ╚═════╝ ╚══════╝"
echo -e "${NC}"
echo -e "${BLUE}AI-Powered Kubernetes Troubleshooting and Auto-Remediation${NC}"
echo -e "${BLUE}============================================================${NC}\n"

# Parse command line arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    --namespace)
      NAMESPACE="$2"
      shift 2
      ;;
    --release-name)
      RELEASE_NAME="$2"
      shift 2
      ;;
    --auto-remediation)
      AUTO_REMEDIATION="$2"
      shift 2
      ;;
    --monitoring-enabled)
      MONITORING_ENABLED="$2"
      shift 2
      ;;
    --chart-path)
      CHART_PATH="$2"
      shift 2
      ;;
    --help)
      echo "Usage: $0 [options]"
      echo ""
      echo "Options:"
      echo "  --namespace NAME         Kubernetes namespace to install AutoKube (default: autokube)"
      echo "  --release-name NAME      Helm release name (default: autokube)"
      echo "  --auto-remediation BOOL  Enable auto-remediation (default: true)"
      echo "  --monitoring-enabled BOOL Enable monitoring (default: true)"
      echo "  --chart-path PATH        Path to Helm chart (default: ./helm/autokube-core)"
      echo "  --help                   Display this help message"
      exit 0
      ;;
    *)
      echo "Unknown option: $1"
      exit 1
      ;;
  esac
done

# Check if kubectl is installed
if ! command -v kubectl &> /dev/null; then
  echo -e "${RED}Error: kubectl is not installed. Please install kubectl first.${NC}"
  exit 1
fi

# Check if helm is installed
if ! command -v helm &> /dev/null; then
  echo -e "${RED}Error: helm is not installed. Please install Helm first.${NC}"
  exit 1
fi

# Check if connected to a Kubernetes cluster
if ! kubectl cluster-info &> /dev/null; then
  echo -e "${RED}Error: Not connected to a Kubernetes cluster. Please configure kubectl.${NC}"
  exit 1
fi

echo -e "${BLUE}Installing AutoKube...${NC}"
echo -e "${YELLOW}Namespace:${NC} $NAMESPACE"
echo -e "${YELLOW}Release Name:${NC} $RELEASE_NAME"
echo -e "${YELLOW}Auto-Remediation:${NC} $AUTO_REMEDIATION"
echo -e "${YELLOW}Monitoring Enabled:${NC} $MONITORING_ENABLED"
echo -e "${YELLOW}Chart Path:${NC} $CHART_PATH"
echo ""

# Create namespace if it doesn't exist
if ! kubectl get namespace "$NAMESPACE" &> /dev/null; then
  echo -e "${BLUE}Creating namespace $NAMESPACE...${NC}"
  kubectl create namespace "$NAMESPACE"
fi

# Install AutoKube using Helm
echo -e "${BLUE}Installing AutoKube using Helm...${NC}"
helm install "$RELEASE_NAME" "$CHART_PATH" \
  --namespace "$NAMESPACE" \
  --set ai.autoRemediation="$AUTO_REMEDIATION" \
  --set monitoring.enabled="$MONITORING_ENABLED"

# Wait for deployment to be ready
echo -e "${BLUE}Waiting for AutoKube deployment to be ready...${NC}"
kubectl rollout status deployment/"$RELEASE_NAME-autokube-core" -n "$NAMESPACE" --timeout=120s

echo -e "\n${GREEN}AutoKube has been successfully installed!${NC}"
echo -e "${BLUE}To access the AutoKube dashboard, run:${NC}"
echo -e "  kubectl port-forward service/$RELEASE_NAME-autokube-core 8080:8080 -n $NAMESPACE"
echo -e "${BLUE}Then open:${NC} http://localhost:8080"
echo ""
echo -e "${BLUE}To test AutoKube, create a test namespace and apply the example manifests:${NC}"
echo -e "  kubectl create namespace crash-demo"
echo -e "  kubectl apply -f examples/crashloop-sim.yaml"
echo -e "  kubectl autokube detect crash-demo"
echo ""
echo -e "${BLUE}For more information, visit:${NC} https://github.com/your-org/autokube"