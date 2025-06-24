# AutoKube Deployment Guide

This directory contains scripts and resources for deploying AutoKube to your Kubernetes cluster.

## Prerequisites

Before deploying AutoKube, ensure you have the following:

- A running Kubernetes cluster (local or cloud-based)
- `kubectl` installed and configured to access your cluster
- `helm` v3 installed

## Quick Start

### 1. Install AutoKube

```bash
# Clone the repository (if you haven't already)
git clone https://github.com/your-org/autokube.git
cd autokube

# Make the installation script executable
chmod +x deploy/install.sh

# Install AutoKube with default settings
./deploy/install.sh
```

### 2. Access the Dashboard

```bash
# Forward the service port to your local machine
kubectl port-forward service/autokube-autokube-core 8080:8080 -n autokube
```

Then open your browser and navigate to: http://localhost:8080

### 3. Test AutoKube

```bash
# Create a test namespace
kubectl create namespace crash-demo

# Deploy a pod that will crash
kubectl apply -f examples/crashloop-sim.yaml

# Use the AutoKube CLI to detect issues
kubectl autokube detect crash-demo

# Apply automatic fixes
kubectl autokube fix --auto --namespace=crash-demo
```

## Installation Options

The installation script supports several options:

```bash
./deploy/install.sh --help
```

Options:
- `--namespace NAME`: Kubernetes namespace to install AutoKube (default: autokube)
- `--release-name NAME`: Helm release name (default: autokube)
- `--auto-remediation BOOL`: Enable auto-remediation (default: true)
- `--monitoring-enabled BOOL`: Enable monitoring (default: true)
- `--chart-path PATH`: Path to Helm chart (default: ./helm/autokube-core)

Example with custom options:

```bash
./deploy/install.sh --namespace my-autokube --release-name my-release --auto-remediation false
```

## Uninstalling AutoKube

To uninstall AutoKube:

```bash
# Make the uninstallation script executable
chmod +x deploy/uninstall.sh

# Uninstall AutoKube
./deploy/uninstall.sh
```

Options:
- `--namespace NAME`: Kubernetes namespace where AutoKube is installed (default: autokube)
- `--release-name NAME`: Helm release name (default: autokube)
- `--delete-namespace`: Delete the namespace after uninstalling (default: false)

## Cloud-Specific Deployment

### Amazon EKS

```bash
# Create an EKS cluster (if you don't have one)
eksctl create cluster --name autokube-demo --region us-west-2 --node-type t3.medium --nodes 3

# Update kubeconfig
aws eks update-kubeconfig --region us-west-2 --name autokube-demo

# Install AutoKube
./deploy/install.sh
```

### Google GKE

```bash
# Create a GKE cluster (if you don't have one)
gcloud container clusters create autokube-demo --zone us-central1-a --num-nodes 3

# Get credentials
gcloud container clusters get-credentials autokube-demo --zone us-central1-a

# Install AutoKube
./deploy/install.sh
```

### Microsoft AKS

```bash
# Create an AKS cluster (if you don't have one)
az aks create --resource-group myResourceGroup --name autokube-demo --node-count 3 --enable-addons monitoring

# Get credentials
az aks get-credentials --resource-group myResourceGroup --name autokube-demo

# Install AutoKube
./deploy/install.sh
```

## Troubleshooting

If you encounter issues during installation:

1. Check if the pods are running:
   ```bash
   kubectl get pods -n autokube
   ```

2. Check pod logs:
   ```bash
   kubectl logs -n autokube -l app.kubernetes.io/name=autokube-core
   ```

3. Check Helm release status:
   ```bash
   helm status autokube -n autokube
   ```

For more help, please open an issue on our GitHub repository.