# AutoKube - AI-Powered Kubernetes Troubleshooter

An intelligent Kubernetes troubleshooting and auto-remediation tool that uses AI to detect, analyze, and fix cluster issues automatically.

## 🚀 Features

- **AI-Powered Issue Detection**: Automatically detects and classifies Kubernetes issues
- **Auto-Remediation**: Intelligently fixes common problems without manual intervention
- **GitOps Integration**: Monitors ArgoCD sync status and Helm deployments
- **Interactive CLI**: kubectl plugin for command-line troubleshooting
- **Web Dashboard**: Real-time cluster monitoring and issue visualization
- **Predictive Analytics**: Forecasts potential infrastructure failures
- **Multi-Language Support**: Global accessibility for international teams

## 📦 Installation

### Using Helm (Recommended)

```bash
# Add the Helm repository
helm repo add autokube https://charts.autokube.io
helm repo update

# Install AutoKube
helm install autokube autokube/autokube \
  --namespace autokube \
  --create-namespace \
  --set ai.autoRemediation=true \
  --set monitoring.enabled=true
```

### Install kubectl Plugin

```bash
# Download the CLI plugin
curl -L https://github.com/your-org/autokube/releases/latest/download/kubectl-autokube -o kubectl-autokube

# Make it executable and move to PATH
chmod +x kubectl-autokube
sudo mv kubectl-autokube /usr/local/bin/
```

## 🛠 Usage

### CLI Commands

```bash
# Detect issues in a namespace
kubectl autokube detect production

# Auto-fix detected issues
kubectl autokube fix --auto --namespace=staging

# Check AutoKube status
kubectl autokube status

# View logs
kubectl autokube logs -f --lines=50
```

### Web Dashboard

Access the web dashboard by port-forwarding:

```bash
kubectl port-forward service/autokube 8080:8080 -n autokube
```

Then open http://localhost:8080 in your browser.

## 🤖 AI Capabilities

### Issue Detection
- Pod failures (CrashLoopBackOff, ImagePullBackOff)
- Resource exhaustion (CPU, Memory, Storage)
- Network connectivity issues
- Configuration errors
- Security policy violations

### Auto-Remediation
- Automatic pod restarts
- Resource scaling recommendations
- Configuration fixes
- Helm rollbacks
- ArgoCD sync corrections

### Predictive Analytics
- Forecasts resource exhaustion
- Predicts pod failures
- Identifies configuration drift
- Recommends optimization strategies

## 🔧 Configuration

### Helm Values

```yaml
# values.yaml
ai:
  enabled: true
  autoRemediation: true
  logLevel: "info"

monitoring:
  enabled: true
  prometheus:
    enabled: true

gitops:
  enabled: true
  argocd:
    enabled: true
    namespace: "argocd"
```

### Environment Variables

- `AI_ENABLED`: Enable AI-powered analysis (default: true)
- `AUTO_REMEDIATION`: Enable automatic fixes (default: false)
- `LOG_LEVEL`: Logging level (debug, info, warn, error)

## 🏗 Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Web Dashboard │    │   kubectl CLI   │    │   Helm Charts   │
└─────────┬───────┘    └─────────┬───────┘    └─────────┬───────┘
          │                      │                      │
          └──────────────────────┼──────────────────────┘
                                 │
                    ┌─────────────▼───────────────┐
                    │        AutoKube            │
                    │        Core Engine         │
                    └─────────────┬───────────────┘
                                  │
          ┌───────────────────────┼───────────────────────┐
          │                       │                       │
    ┌─────▼─────┐         ┌───────▼───────┐       ┌───────▼───────┐
    │    AI     │         │  Kubernetes   │       │    GitOps     │
    │  Engine   │         │     API       │       │  Integration  │
    └───────────┘         └───────────────┘       └───────────────┘
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- 📖 [Documentation](https://docs.autokube.io)
- 💬 [Discord Community](https://discord.gg/autokube)
- 🐛 [Issue Tracker](https://github.com/your-org/autokube/issues)
- 📧 [Email Support](mailto:support@autokube.io)

## 🏆 Hackathon Project

This project was created for the Bolt AI Hackathon 2025. It demonstrates the power of AI-driven automation in Kubernetes operations and aims to make cluster management more accessible and reliable for DevOps teams worldwide.

---

Made with ❤️ by the AutoKube Team