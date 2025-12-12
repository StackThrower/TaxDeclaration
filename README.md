# Monegoo - Tax Declaration System

## 🌍 Multi-Country Tax Forms Platform

Monegoo is an open-source platform for filing tax declarations across multiple countries. The system supports country-specific tax forms with multi-language interfaces.

### Supported Countries & Forms

- 🇺🇦 **Ukraine** - F0100214, F0121214 (Fully Implemented)
- 🇵🇱 **Poland** - PIT-37, PIT-38, PIT-39
- 🇫🇷 **France** - 2042, 2042-C, 2044
- 🇩🇪 **Germany** - EST 1A, Anlage N, Anlage KAP
- 🇵🇹 **Portugal** - IRS Modelo 3, Anexo A, Anexo E
- 🇪🇸 **Spain** - Modelo 100, D-100, 720
- 🇸🇪 **Sweden** - INK1, K4, K10
- 🇬🇧 **UK** - SA100, SA108, SA109
- 🇺🇸 **USA** - Form 1040, Schedule D, Form 8949, Schedule C
- 🇨🇦 **Canada** - T1 General, Schedule 3, T5008

### Supported Languages

- 🇺🇦 Українська
- 🇬🇧 English
- 🇫🇷 Français
- 🇵🇱 Polski
- 🇪🇸 Español
- 🇵🇹 Português
- 🇩🇪 Deutsch

### URL Structure

The application uses locale-based routing: `/{language}-{country}`

Examples:
- `/en-us` - English interface, US tax forms
- `/uk-ua` - Ukrainian interface, Ukraine tax forms
- `/pl-pl` - Polish interface, Poland tax forms
- `/fr-fr` - French interface, France tax forms

## 📚 Documentation

### Core Documentation
- **[LOCALE_ROUTING.md](./LOCALE_ROUTING.md)** - Locale-based routing implementation details
- **[TAX_FORMS.md](./TAX_FORMS.md)** - Complete tax forms reference for all countries
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Deployment and infrastructure guide
- **[SETUP.md](./SETUP.md)** - Development setup instructions

### GitHub Actions & CI/CD
- **[GITHUB_ACTIONS_STATUS.md](./GITHUB_ACTIONS_STATUS.md)** - ⭐ Current setup status and quick start
- **[QUICKSTART_GITHUB_ACTIONS.md](./QUICKSTART_GITHUB_ACTIONS.md)** - 5-minute setup guide
- **[GITHUB_ACTIONS_SETUP.md](./GITHUB_ACTIONS_SETUP.md)** - Detailed configuration guide

## 🚀 Deployment Options

### Option 1: Automatic Deployment (Recommended)

Push to GitHub and let GitHub Actions handle everything automatically.

**Requirements:**
- GitHub repository
- GCP project with billing enabled
- GitHub secrets configured (see DEPLOYMENT.md)

**Steps:**
1. Follow setup in `DEPLOYMENT.md`
2. Push to `main` branch
3. GitHub Actions will deploy automatically

### Option 2: Local Testing

Test the Docker container locally before deploying.

**Quick commands:**
```bash
# Full build and run
./scripts/deploy-local.sh run

# Or use the interactive menu
./scripts/deploy-local.sh

# Stop container
./scripts/deploy-local.sh stop

# View logs
./scripts/deploy-local.sh logs
```

### Option 3: Manual GCP Deployment

Deploy directly to Google Cloud Run.

```bash
# One-time setup
gcloud auth login
gcloud config set project YOUR_PROJECT_ID

# Deploy
gcloud run deploy tax-declaration-app \
    --source . \
    --region us-central1 \
    --allow-unauthenticated
```

## 📁 Important Files

- **`.github/workflows/deploy.yml`** - GitHub Actions CI/CD pipeline
- **`terraform/`** - Infrastructure as Code for GCP
- **`Dockerfile`** - Container configuration
- **`DEPLOYMENT.md`** - Detailed setup guide
- **`scripts/deploy-local.sh`** - Local testing helper

## 🔧 Configuration

### GitHub Secrets
Set these in your GitHub repository:
- `GCP_PROJECT_ID` - Your Google Cloud project ID
- `GCP_SA_KEY` - Service account JSON key

### Terraform Variables
Edit `terraform/terraform.tfvars`:
```hcl
project_id = "your-gcp-project-id"
region     = "us-central1"
```

## 🛠️ Development

```bash
# Install dependencies
pnpm install

# Run dev server
pnpm dev

# Build for production
pnpm build

# Run production build
pnpm start
```

## 📚 Documentation

For detailed instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md)

## 💰 Cost Estimate

With default settings (min_instances=0):
- **Low traffic**: $0-5/month
- **Moderate traffic**: $10-30/month
- **High traffic**: Scale as needed

You only pay for actual usage with Cloud Run.

## 🆘 Need Help?

1. Check [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed setup
2. Review GitHub Actions logs for CI/CD issues
3. Check Cloud Run logs in GCP Console
4. Run `./scripts/deploy-local.sh` to test locally

