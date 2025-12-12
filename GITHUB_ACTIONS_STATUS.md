# ⚡ GitHub Actions Status

**Последнее обновление:** 12 декабря 2025

## 🎯 Текущий статус

### ✅ Что сделано

- ✅ **Workflow файлы созданы**
  - `.github/workflows/deploy.yml` - Deploy to Cloud Run
  - `.github/workflows/ci.yml` - Continuous Integration
  
- ✅ **Dockerfile исправлен**
  - Исправлена структура multi-stage build
  - Обновлена версия pnpm до 9.15.0
  
- ✅ **package.json обновлен**
  - Добавлено поле `packageManager: "pnpm@9.15.0"`
  
- ✅ **Документация создана**
  - QUICKSTART_GITHUB_ACTIONS.md - быстрый старт
  - GITHUB_ACTIONS_SETUP.md - полная инструкция
  - README.md обновлен с быстрыми ссылками

### ⏳ Что нужно сделать

- ⏳ **Настроить GitHub репозиторий**
  - Подключить remote к GitHub
  - Отправить код (git push)
  
- ⏳ **Настроить GitHub Secrets**
  - GCP_PROJECT_ID
  - GCP_SA_KEY
  
- ⏳ **Настроить Google Cloud Platform**
  - Создать service account
  - Дать необходимые права
  - Включить API
  - Создать Artifact Registry

## 📋 Быстрая проверка

Выполните эти команды для проверки текущего состояния:

```bash
cd /Users/vs/Projects/TaxDeclaration

# Проверка workflow файлов
echo "=== Workflow файлы ==="
ls -la .github/workflows/*.yml

# Проверка Git
echo -e "\n=== Git remote ==="
git remote -v

# Проверка branch
echo -e "\n=== Текущая ветка ==="
git branch --show-current

# Проверка изменений
echo -e "\n=== Статус Git ==="
git status --short
```

## 🚀 Следующие шаги

### Шаг 1: Отправить код на GitHub

```bash
cd /Users/vs/Projects/TaxDeclaration

# Добавить все изменения
git add .

# Создать коммит
git commit -m "feat: add GitHub Actions workflows and fix deployment issues"

# Если remote еще не настроен:
# git remote add origin https://github.com/YOUR_USERNAME/TaxDeclaration.git

# Отправить на GitHub
git push -u origin main
```

### Шаг 2: Настроить GCP Service Account

```bash
# Установить переменные
export PROJECT_ID="your-gcp-project-id"
export SERVICE_ACCOUNT_NAME="github-actions-deploy"

# Создать service account
gcloud iam service-accounts create $SERVICE_ACCOUNT_NAME \
  --display-name="GitHub Actions Deployment" \
  --project=$PROJECT_ID

# Дать права
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:$SERVICE_ACCOUNT_NAME@$PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/run.admin"

gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:$SERVICE_ACCOUNT_NAME@$PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/storage.admin"

gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:$SERVICE_ACCOUNT_NAME@$PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/artifactregistry.admin"

gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:$SERVICE_ACCOUNT_NAME@$PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/iam.serviceAccountUser"

# Создать ключ
gcloud iam service-accounts keys create key.json \
  --iam-account=$SERVICE_ACCOUNT_NAME@$PROJECT_ID.iam.gserviceaccount.com

# Скопировать содержимое
cat key.json | pbcopy  # macOS
# или
cat key.json  # Linux/Windows - скопируйте вручную
```

### Шаг 3: Настроить GitHub Secrets

1. Откройте ваш репозиторий на GitHub
2. Перейдите в **Settings → Secrets and variables → Actions**
3. Нажмите **New repository secret**
4. Добавьте два секрета:

**GCP_PROJECT_ID:**
- Name: `GCP_PROJECT_ID`
- Secret: ваш GCP project ID

**GCP_SA_KEY:**
- Name: `GCP_SA_KEY`
- Secret: содержимое файла key.json (весь JSON)

### Шаг 4: Включить GCP APIs

```bash
gcloud services enable run.googleapis.com \
  artifactregistry.googleapis.com \
  cloudbuild.googleapis.com \
  --project=$PROJECT_ID
```

### Шаг 5: Создать Artifact Registry

```bash
gcloud artifacts repositories create tax-declaration-app \
  --repository-format=docker \
  --location=us-central1 \
  --description="Docker repository for Tax Declaration App" \
  --project=$PROJECT_ID
```

### Шаг 6: Запустить workflow

После выполнения всех шагов выше:

```bash
# Сделайте тестовый коммит
echo "" >> README.md
git add README.md
git commit -m "test: trigger GitHub Actions"
git push origin main
```

Затем:
1. Откройте GitHub → вкладка **Actions**
2. Вы увидите запущенные workflows
3. Кликните на workflow для просмотра логов

## 📊 Workflow Triggers

### CI Workflow
- ✅ Запускается на **всех ветках**
- ✅ Запускается на **pull requests**
- Включает: lint, build, Docker image test

### Deploy Workflow
- ✅ Запускается на **ветке main**
- ✅ Запускается на **pull requests к main** (только plan)
- ✅ **Ручной запуск** (workflow_dispatch)
- Включает: Terraform, build, push Docker, deploy to Cloud Run

## 🔍 Проверка после деплоя

После успешного деплоя:

```bash
# Получить URL сервиса
gcloud run services describe tax-declaration-app \
  --region=us-central1 \
  --format="value(status.url)"

# Проверить статус
gcloud run services describe tax-declaration-app \
  --region=us-central1 \
  --format="yaml"
```

## 🆘 Troubleshooting

### Workflow не запускается

**Проблема:** "0 workflow runs" на GitHub

**Решение:**
1. Убедитесь, что `.github/workflows/*.yml` закоммичены и отправлены
2. Проверьте, что вы на ветке `main`
3. Проверьте Settings → Actions → General → Actions permissions
4. Попробуйте ручной запуск через GitHub UI

### Secret не найден

**Проблема:** "Error: Secret GCP_SA_KEY not found"

**Решение:**
1. Проверьте название секрета (точно `GCP_SA_KEY`)
2. Проверьте, что JSON ключ корректен и полный
3. Пересоздайте секрет заново

### Permission denied в GCP

**Проблема:** "Permission denied" при деплое

**Решение:**
1. Проверьте роли service account
2. Убедитесь, что APIs включены
3. Проверьте, что service account ключ не истек

### pnpm install failed

**Проблема:** "ERR_PNPM_NO_LOCKFILE"

**Решение:**
1. Убедитесь, что `pnpm-lock.yaml` закоммичен
2. Проверьте версию pnpm в workflow (должна быть 9)
3. Убедитесь, что lockfileVersion: '9.0' в pnpm-lock.yaml

## 📚 Дополнительные ресурсы

- [QUICKSTART_GITHUB_ACTIONS.md](./QUICKSTART_GITHUB_ACTIONS.md) - Быстрый старт
- [GITHUB_ACTIONS_SETUP.md](./GITHUB_ACTIONS_SETUP.md) - Подробная инструкция
- [README.md](./README.md) - Основная документация

## ✅ Контрольный список

Перед первым деплоем убедитесь:

- [ ] Workflow файлы созданы и закоммичены
- [ ] Git remote настроен на GitHub
- [ ] Код отправлен на GitHub (git push)
- [ ] GitHub Secrets настроены (GCP_PROJECT_ID, GCP_SA_KEY)
- [ ] GCP service account создан
- [ ] Service account имеет необходимые роли
- [ ] GCP APIs включены
- [ ] Artifact Registry репозиторий создан
- [ ] GitHub Actions включен в репозитории

## 🎉 Готово!

После выполнения всех шагов ваш проект будет автоматически деплоиться на Cloud Run при каждом push в main!

