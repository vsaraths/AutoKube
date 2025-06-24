#!/bin/bash

# AutoKube Uninstallation Script
# This script uninstalls AutoKube from your Kubernetes cluster

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
DELETE_NAMESPACE="false"

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
    --delete-namespace)
      DELETE_NAMESPACE="true"
      shift
      ;;
    --help)
      echo "Usage: $0 [options]"
      echo ""
      echo "Options:"
      echo "  --namespace NAME         Kubernetes namespace where AutoKube is installed (default: autokube)"
      echo "  --release-name NAME      Helm release name (default: autokube)"
      echo "  --delete-namespace       Delete the namespace after uninstalling (default: false)"
      echo "  --help                   Display this help message"
      exit 0
      ;;
    *)
      echo "Unknown option: $1"
      exit 1
      ;;
  esac
done

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

# Check if the release exists
if ! helm status "$RELEASE_NAME" -n "$NAMESPACE" &> /dev/null; then
  echo -e "${RED}Error: Helm release '$RELEASE_NAME' not found in namespace '$NAMESPACE'.${NC}"
  exit 1
fi

echo -e "${YELLOW}WARNING: This will uninstall AutoKube from your cluster.${NC}"
echo -e "${YELLOW}Namespace:${NC} $NAMESPACE"
echo -e "${YELLOW}Release Name:${NC} $RELEASE_NAME"
echo -e "${YELLOW}Delete Namespace:${NC} $DELETE_NAMESPACE"
echo ""

# Confirm uninstallation
read -p "Are you sure you want to continue? (y/n) " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  echo -e "${BLUE}Uninstallation cancelled.${NC}"
  exit 0
fi

# Uninstall AutoKube using Helm
echo -e "${BLUE}Uninstalling AutoKube...${NC}"
helm uninstall "$RELEASE_NAME" -n "$NAMESPACE"

# Delete namespace if requested
if [ "$DELETE_NAMESPACE" = "true" ]; then
  echo -e "${BLUE}Deleting namespace $NAMESPACE...${NC}"
  kubectl delete namespace "$NAMESPACE"
fi

echo -e "\n${GREEN}AutoKube has been successfully uninstalled!${NC}"