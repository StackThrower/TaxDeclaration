# Tax Declaration Application - Deployment Guide

This project is configured to deploy automatically to Google Cloud Run using GitHub Actions and Terraform.

## Prerequisites

1. **Google Cloud Platform Account**
   - Create a GCP project
   - Enable billing for the project

2. **GitHub Repository**
   - Push this code to a GitHub repository
   - Set up GitHub Secrets (see below)

3. **Local Development Tools** (for local testing)
   - Docker
   - Terraform CLI
   - Node.js 20+
   - pnpm

## Setup Instructions

### 1. Google Cloud Setup

#### Create a Service Account

```bash
# Set your project ID
export PROJECT_ID="your-gcp-project-id"

# Create service account
gcloud iam service-accounts create github-actions \
    --display-name="GitHub Actions" \
    --project=$PROJECT_ID

# Grant necessary permissions
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

# Create and download key
gcloud iam service-accounts keys create key.json \
    --iam-account=github-actions@${PROJECT_ID}.iam.gserviceaccount.com
```

### 2. GitHub Secrets Setup

Go to your GitHub repository → Settings → Secrets and variables → Actions

Add the following secrets:

- **`GCP_PROJECT_ID`**: Your GCP project ID
- **`GCP_SA_KEY`**: Contents of the `key.json` file created above

### 3. Terraform Configuration

Copy the example variables file:

```bash
cd terraform
cp terraform.tfvars.example terraform.tfvars
```

Edit `terraform.tfvars` with your project details:

```hcl
project_id = "your-gcp-project-id"
region     = "us-central1"
```

### 4. Initial Terraform Setup (Optional - if deploying manually first)

```bash
cd terraform

# Initialize Terraform
terraform init

# Plan the infrastructure
terraform plan -var="project_id=your-gcp-project-id"

# Apply the infrastructure
terraform apply -var="project_id=your-gcp-project-id"
```

## Deployment

### Automatic Deployment

The application deploys automatically when you:

1. **Push to main branch** - Triggers full deployment
2. **Create a Pull Request** - Runs Terraform plan for preview

### Manual Deployment

If you want to deploy manually:

```bash
# Build and test locally
docker build -t tax-declaration-app .
docker run -p 3000:3000 tax-declaration-app

# Deploy using gcloud
gcloud run deploy tax-declaration-app \
    --source . \
    --region us-central1 \
    --allow-unauthenticated
```

## CI/CD Pipeline

The GitHub Actions workflow (`.github/workflows/deploy.yml`) performs:

1. **Terraform Phase**:
   - Initialize Terraform
   - Plan infrastructure changes (on PR)
   - Apply infrastructure changes (on main branch)

2. **Build Phase**:
   - Install dependencies with pnpm
   - Build Next.js application
   - Create Docker image
   - Push to Google Artifact Registry

3. **Deploy Phase**:
   - Deploy to Cloud Run
   - Output service URL

## Configuration

### Environment Variables

To add environment variables to your Cloud Run service:

1. Edit `terraform/cloud-run.tf`
2. Uncomment and add environment variables in the `env` block:

```hcl
env {
  name  = "NODE_ENV"
  value = "production"
}
```

### Scaling Configuration

Adjust scaling in `terraform/variables.tf`:

- `min_instances`: Minimum number of instances (default: 0)
- `max_instances`: Maximum number of instances (default: 10)
- `memory`: Memory per instance (default: "512Mi")
- `cpu`: CPU per instance (default: "1")

## Costs

Cloud Run pricing is based on:
- Request count
- Compute time (CPU/Memory usage)
- Network egress

With `min_instances = 0`, you're only charged when the service is actively handling requests.

Estimated cost for low traffic: $0-5/month

## Monitoring

View your deployment:

```bash
# Get service URL
gcloud run services describe tax-declaration-app \
    --region=us-central1 \
    --format='value(status.url)'

# View logs
gcloud logs read --service=tax-declaration-app
```

Or use the [Google Cloud Console](https://console.cloud.google.com/run)

## Troubleshooting

### Build Fails

- Check GitHub Actions logs
- Verify all secrets are set correctly
- Ensure service account has proper permissions

### Deployment Fails

- Check Cloud Run logs in GCP Console
- Verify Docker image builds successfully locally
- Check if all required APIs are enabled

### Terraform Errors

- Ensure service account has necessary IAM roles
- Check if state file is locked
- Verify project ID is correct

## Local Development

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build production
pnpm build

# Start production server
pnpm start
```

## Security Notes

- Never commit `key.json` or `terraform.tfvars` to git
- Rotate service account keys regularly
- Review IAM permissions periodically
- Use least privilege principle for service accounts

## Support

For issues related to:
- **Next.js**: Check [Next.js documentation](https://nextjs.org/docs)
- **Cloud Run**: Check [Cloud Run documentation](https://cloud.google.com/run/docs)
- **Terraform**: Check [Terraform GCP documentation](https://registry.terraform.io/providers/hashicorp/google/latest/docs)

