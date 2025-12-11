# Deployment Summary

## ✅ What Was Added

### 1. GitHub Actions CI/CD Pipeline
**File:** `.github/workflows/deploy.yml`

Automated workflow that:
- Runs on push to `main` or pull requests
- Provisions infrastructure with Terraform
- Builds Next.js application
- Creates Docker image
- Deploys to Google Cloud Run

### 2. Terraform Infrastructure
**Directory:** `terraform/`

Files:
- `main.tf` - Provider configuration
- `variables.tf` - Configurable parameters
- `cloud-run.tf` - Cloud Run service & Artifact Registry
- `outputs.tf` - Deployment information
- `terraform.tfvars.example` - Configuration template

Manages:
- Google Cloud APIs (Cloud Run, Artifact Registry, Cloud Build)
- Artifact Registry repository for Docker images
- Cloud Run service with autoscaling
- IAM permissions for public access

### 3. Docker Configuration
**Files:** `Dockerfile`, `.dockerignore`

Multi-stage Docker build:
- Dependencies stage (pnpm install)
- Builder stage (Next.js build)
- Production stage (optimized runtime)

Configured for Next.js standalone output.

### 4. Configuration Updates
- **`next.config.mjs`** - Added `output: 'standalone'` for Docker
- **`.gitignore`** - Added Terraform patterns

### 5. Documentation
- **`DEPLOYMENT.md`** - Comprehensive setup guide
- **`README.md`** - Quick start reference
- **`SETUP.md`** (this file) - Summary of changes

### 6. Helper Scripts
**File:** `scripts/deploy-local.sh`

Interactive script for local testing and deployment.

## 🎯 Next Steps

### 1. Set Up Google Cloud (5-10 minutes)

```bash
# Set project ID
export PROJECT_ID="your-project-id"

# Create service account
gcloud iam service-accounts create github-actions \
    --display-name="GitHub Actions" \
    --project=$PROJECT_ID

# Grant permissions (run each command)
gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:github-actions@${PROJECT_ID}.iam.gserviceaccount.com" \
    --role="roles/run.admin"

gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:github-actions@${PROJECT_ID}.iam.gserviceaccount.com" \
    --role="roles/artifactregistry.admin"

gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:github-actions@${PROJECT_ID}.iam.gserviceaccount.com" \
    --role="roles/iam.serviceAccountUser"

gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:github-actions@${PROJECT_ID}.iam.gserviceaccount.com" \
    --role="roles/serviceusage.serviceUsageAdmin"

# Create key
gcloud iam service-accounts keys create key.json \
    --iam-account=github-actions@${PROJECT_ID}.iam.gserviceaccount.com
```

### 2. Configure GitHub Secrets (2 minutes)

Go to: Repository → Settings → Secrets and variables → Actions

Add:
- **`GCP_PROJECT_ID`**: Your GCP project ID
- **`GCP_SA_KEY`**: Contents of `key.json` file

### 3. Deploy (Automatic)

```bash
git add .
git commit -m "Add deployment configuration"
git push origin main
```

GitHub Actions will automatically:
1. Set up infrastructure with Terraform
2. Build and deploy your application
3. Output the Cloud Run service URL

## 🔍 Monitoring Deployment

### GitHub Actions
Watch progress: Repository → Actions → Latest workflow run

### Google Cloud Console
- **Cloud Run**: https://console.cloud.google.com/run
- **Artifact Registry**: https://console.cloud.google.com/artifacts
- **Logs**: https://console.cloud.google.com/logs

### Command Line
```bash
# Get service URL
gcloud run services describe tax-declaration-app \
    --region=us-central1 \
    --format='value(status.url)'

# Stream logs
gcloud logs tail --service=tax-declaration-app --follow
```

## 🧪 Local Testing

Before pushing to GitHub:

```bash
# Interactive menu
./scripts/deploy-local.sh

# Or quick run
./scripts/deploy-local.sh run

# View at http://localhost:3000
```

## 📊 Infrastructure Details

### Cloud Run Configuration
- **Service Name**: `tax-declaration-app`
- **Region**: `us-central1` (configurable)
- **Port**: 3000
- **Memory**: 512Mi (configurable)
- **CPU**: 1 (configurable)
- **Min Instances**: 0 (scales to zero)
- **Max Instances**: 10 (configurable)
- **Access**: Public (unauthenticated)

### Artifact Registry
- **Repository**: `tax-declaration-app`
- **Format**: Docker
- **Location**: Same as Cloud Run region

### APIs Enabled
- Cloud Run API
- Artifact Registry API
- Cloud Build API

## 💡 Tips

1. **First Deploy**: Takes 5-10 minutes for Terraform to set up infrastructure
2. **Subsequent Deploys**: 2-3 minutes for build and deploy
3. **Pull Requests**: Shows Terraform plan without deploying
4. **Environment Variables**: Add them in `terraform/cloud-run.tf`
5. **Scaling**: Adjust in `terraform/variables.tf`

## 🔐 Security Checklist

- [ ] Service account key stored in GitHub Secrets (not committed)
- [ ] `terraform.tfvars` added to `.gitignore`
- [ ] Service account has minimum required permissions
- [ ] Consider adding custom domain with SSL
- [ ] Review Cloud Run IAM settings if app needs authentication

## 📝 Customization

### Change Region
Edit `.github/workflows/deploy.yml`:
```yaml
env:
  REGION: europe-west1  # Change here
```

And `terraform/variables.tf`:
```hcl
variable "region" {
  default = "europe-west1"  # Change here
}
```

### Add Environment Variables
Edit `terraform/cloud-run.tf`:
```hcl
env {
  name  = "YOUR_ENV_VAR"
  value = "your_value"
}
```

### Adjust Scaling
Edit `terraform/variables.tf`:
```hcl
variable "max_instances" {
  default     = 50  # Increase for more traffic
}

variable "min_instances" {
  default     = 1   # Keep 1+ instance warm
}
```

## 🎉 Success Indicators

After deployment completes:

✅ GitHub Actions workflow shows green check
✅ Terraform outputs service URL
✅ Cloud Run service shows "Healthy" status
✅ Application accessible at Cloud Run URL
✅ Logs show successful requests

## 🆘 Troubleshooting

### Build Fails
- Check GitHub Actions logs
- Test Docker build locally: `docker build -t test .`
- Verify `pnpm-lock.yaml` is committed

### Terraform Errors
- Verify GCP project ID is correct
- Check service account permissions
- Ensure billing is enabled on GCP project

### Deploy Fails
- Check Cloud Run quotas in GCP
- Verify container port matches (3000)
- Check if Docker image was pushed successfully

### Application Not Loading
- Check Cloud Run logs: `gcloud logs read --service=tax-declaration-app`
- Verify environment variables are set correctly
- Test locally with Docker first

## 📞 Support Resources

- **Next.js**: https://nextjs.org/docs
- **Cloud Run**: https://cloud.google.com/run/docs
- **Terraform**: https://registry.terraform.io/providers/hashicorp/google/latest/docs
- **GitHub Actions**: https://docs.github.com/en/actions

---

**Ready to deploy?** Follow the "Next Steps" section above!

