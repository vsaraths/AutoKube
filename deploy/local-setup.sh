#!/bin/bash

# AutoKube Local Development Setup Script
# This script sets up a local Kubernetes cluster using KinD for AutoKube development

set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}"
echo "  █████╗ ██╗   ██╗████████╗ ██████╗ ██╗  ██╗██╗   ██╗██████╗ ███████╗"
echo " ██╔══██╗██║   ██║╚══██╔══╝██╔═══██╗██║ ██╔╝██║   ██║██╔══██╗██╔════╝"
echo " ███████║██║   ██║   ██║   ██║   ██║█████╔╝ ██║   ██║██████╔╝█████╗  "
echo " ██╔══██║██║   ██║   ██║   ██║   ██║██╔═██╗ ██║   ██║██╔══██╗██╔══╝  "
echo " ██║  ██║╚██████╔╝   ██║   ╚██████╔╝██║  ██╗╚██████╔╝██████╔╝███████╗"
echo " ╚═╝  ╚═╝ ╚═════╝    ╚═╝    ╚═════╝ ╚═╝  ╚═╝ ╚═════╝ ╚═════╝ ╚══════╝"
echo -e "${NC}"
echo -e "${BLUE}Local Development Environment Setup${NC}"
echo -e "${BLUE}====================================${NC}\n"

# Check if kind is installed
if ! command -v kind &> /dev/null; then
  echo -e "${RED}Error: kind is not installed. Please install kind first.${NC}"
  echo -e "${BLUE}Visit: https://kind.sigs.k8s.io/docs/user/quick-start/#installation${NC}"
  exit 1
fi

# Check if kubectl is installed
if ! command -v kubectl &> /dev/null; then
  echo -e "${RED}Error: kubectl is not installed. Please install kubectl first.${NC}"
  echo -e "${BLUE}Visit: https://kubernetes.io/docs/tasks/tools/install-kubectl/${NC}"
  exit 1
fi

# Check if helm is installed
if ! command -v helm &> /dev/null; then
  echo -e "${RED}Error: helm is not installed. Please install Helm first.${NC}"
  echo -e "${BLUE}Visit: https://helm.sh/docs/intro/install/${NC}"
  exit 1
fi

# Create KinD cluster
echo -e "${BLUE}Creating KinD cluster...${NC}"
if kind get clusters | grep -q "autokube-dev"; then
  echo -e "${YELLOW}Cluster 'autokube-dev' already exists. Skipping creation.${NC}"
else
  kind create cluster --config deploy/kind-config.yaml
  echo -e "${GREEN}KinD cluster 'autokube-dev' created successfully!${NC}"
fi

# Set kubectl context
echo -e "${BLUE}Setting kubectl context to kind-autokube-dev...${NC}"
kubectl cluster-info --context kind-autokube-dev

# Install NGINX Ingress Controller
echo -e "${BLUE}Installing NGINX Ingress Controller...${NC}"
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/main/deploy/static/provider/kind/deploy.yaml

# Wait for ingress controller to be ready
echo -e "${BLUE}Waiting for NGINX Ingress Controller to be ready...${NC}"
kubectl wait --namespace ingress-nginx \
  --for=condition=ready pod \
  --selector=app.kubernetes.io/component=controller \
  --timeout=90s

# Create test namespaces
echo -e "${BLUE}Creating test namespaces...${NC}"
kubectl create namespace crash-demo --dry-run=client -o yaml | kubectl apply -f -
kubectl create namespace network-demo --dry-run=client -o yaml | kubectl apply -f -

# Install AutoKube
echo -e "${BLUE}Installing AutoKube...${NC}"
./deploy/install.sh --namespace autokube --release-name autokube

echo -e "\n${GREEN}Local development environment is ready!${NC}"
echo -e "${BLUE}To access the AutoKube dashboard, run:${NC}"
echo -e "  kubectl port-forward service/autokube-autokube-core 8080:8080 -n autokube"
echo -e "${BLUE}Then open:${NC} http://localhost:8080"
echo ""
echo -e "${BLUE}To test AutoKube with example failures:${NC}"
echo -e "  kubectl apply -f examples/crashloop-sim.yaml"
echo -e "  kubectl apply -f examples/memory-exhaustion.yaml"
echo -e "  kubectl apply -f examples/image-pull-error.yaml"
echo -e "  kubectl apply -f examples/network-policy-block.yaml"
echo ""
echo -e "${BLUE}To clean up the environment:${NC}"
echo -e "  kind delete cluster --name autokube-dev"