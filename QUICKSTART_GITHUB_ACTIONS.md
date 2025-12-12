# 🚀 Быстрый старт GitHub Actions

## Проблема: Workflow не запускается

Если вы видите "0 workflow runs" в GitHub Actions, следуйте этим шагам:

## Шаг 1: Проверьте, что файлы созданы

```bash
cd /Users/vs/Projects/TaxDeclaration
ls -la .github/workflows/
```

Должны быть файлы:
- ✅ `deploy.yml`
- ✅ `ci.yml`

## Шаг 2: Настройте Git репозиторий

### 2.1 Проверьте текущий статус

```bash
git status
git branch --show-current
git remote -v
```

### 2.2 Если репозиторий не подключен к GitHub

**Создайте новый репозиторий на GitHub:**
1. Откройте https://github.com/new
2. Введите имя: `TaxDeclaration`
3. Оставьте приватным или публичным (на ваш выбор)
4. **НЕ** создавайте README, .gitignore или license (они уже есть)
5. Нажмите "Create repository"

**Подключите локальный репозиторий:**

```bash
cd /Users/vs/Projects/TaxDeclaration

# Если Git еще не инициализирован
git init

# Добавьте все файлы
git add .

# Создайте первый коммит
git commit -m "feat: add GitHub Actions workflows for deployment"

# Переименуйте ветку в main (если нужно)
git branch -M main

# Добавьте remote (замените YOUR_USERNAME на ваш GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/TaxDeclaration.git

# Отправьте код на GitHub
git push -u origin main
```

### 2.3 Если репозиторий уже подключен

```bash
cd /Users/vs/Projects/TaxDeclaration

# Добавьте workflow файлы
git add .github/workflows/

# Также добавьте обновленные файлы
git add Dockerfile package.json GITHUB_ACTIONS_SETUP.md

# Создайте коммит
git commit -m "fix: add GitHub Actions workflows and fix Dockerfile"

# Отправьте на GitHub
git push origin main
```

## Шаг 3: Настройте GitHub Secrets

**ВАЖНО:** Без этих секретов workflow не сработает!

Перейдите в настройки репозитория на GitHub:
**Settings → Secrets and variables → Actions → New repository secret**

### 3.1 Добавьте GCP_PROJECT_ID

1. Нажмите "New repository secret"
2. Name: `GCP_PROJECT_ID`
3. Value: ваш GCP project ID (например, `my-tax-app-123456`)
4. Нажмите "Add secret"

### 3.2 Добавьте GCP_SA_KEY

Сначала создайте service account key (если еще не создали):

```bash
# Установите переменные
export PROJECT_ID="your-project-id"
export SERVICE_ACCOUNT_NAME="github-actions-deploy"

# Создайте service account
gcloud iam service-accounts create $SERVICE_ACCOUNT_NAME \
  --display-name="GitHub Actions Deployment" \
  --project=$PROJECT_ID

# Дайте необходимые права
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

# Создайте и скачайте ключ
gcloud iam service-accounts keys create key.json \
  --iam-account=$SERVICE_ACCOUNT_NAME@$PROJECT_ID.iam.gserviceaccount.com

# Скопируйте содержимое (macOS)
cat key.json | pbcopy

# Или просмотрите содержимое (любая ОС)
cat key.json
```

Теперь добавьте secret на GitHub:
1. Нажмите "New repository secret"
2. Name: `GCP_SA_KEY`
3. Value: Вставьте весь JSON из key.json
4. Нажмите "Add secret"

⚠️ **ВАЖНО:** Удалите key.json после добавления в GitHub:
```bash
rm key.json
```

### 3.3 Включите необходимые API в GCP

```bash
gcloud services enable run.googleapis.com \
  artifactregistry.googleapis.com \
  cloudbuild.googleapis.com \
  --project=$PROJECT_ID
```

### 3.4 Создайте Artifact Registry репозиторий

```bash
gcloud artifacts repositories create tax-declaration-app \
  --repository-format=docker \
  --location=us-central1 \
  --description="Docker repository for Tax Declaration App" \
  --project=$PROJECT_ID
```

## Шаг 4: Проверьте запуск Workflow

### 4.1 После push в main

1. Откройте ваш репозиторий на GitHub
2. Перейдите на вкладку **Actions**
3. Вы должны увидеть запущенные workflows:
   - ✅ CI (запускается на всех ветках)
   - ✅ Deploy to Cloud Run (запускается на main)

### 4.2 Если workflow все еще не запускается

Проверьте:

**✅ Файлы находятся в правильном месте:**
```bash
ls -la .github/workflows/deploy.yml
ls -la .github/workflows/ci.yml
```

**✅ Файлы закоммичены и отправлены:**
```bash
git log --oneline -5
git ls-files .github/workflows/
```

**✅ GitHub Actions включен в репозитории:**
1. Settings → Actions → General
2. Убедитесь, что "Actions permissions" установлен на "Allow all actions and reusable workflows"

**✅ Правильная ветка:**
```bash
git branch --show-current  # Должно быть "main"
```

### 4.3 Запустите workflow вручную

Если нужно запустить workflow без push:

1. Откройте **Actions** на GitHub
2. Выберите workflow "Deploy to Cloud Run"
3. Нажмите "Run workflow"
4. Выберите ветку "main"
5. Нажмите "Run workflow"

⚠️ **Примечание:** Для ручного запуска нужно добавить в deploy.yml:

```yaml
on:
  push:
    branches:
      - main
  pull_request:
    branches:
      - main
  workflow_dispatch:  # Добавьте эту строку для ручного запуска
```

## Шаг 5: Мониторинг выполнения

### 5.1 Просмотр логов

1. Откройте **Actions** tab
2. Кликните на запущенный workflow
3. Кликните на джобу (например, "Terraform" или "Build and Deploy")
4. Разверните каждый шаг для просмотра логов

### 5.2 Отладка ошибок

**Ошибка: "Secret not found"**
- Проверьте, что GCP_PROJECT_ID и GCP_SA_KEY добавлены в Secrets

**Ошибка: "Permission denied"**
- Проверьте права service account в GCP
- Убедитесь, что JSON ключ корректен

**Ошибка: "pnpm install failed"**
- Убедитесь, что pnpm-lock.yaml закоммичен
- Проверьте версию pnpm в workflow (должна быть 9)

**Ошибка: "Docker build failed"**
- Проверьте Dockerfile локально: `docker build -t test .`
- Убедитесь, что next.config.mjs имеет `output: 'standalone'`

## Быстрая проверка всех требований

Выполните эту команду для проверки:

```bash
cd /Users/vs/Projects/TaxDeclaration

echo "=== Проверка Git ===" && \
git remote -v && \
echo "" && \
echo "=== Проверка branch ===" && \
git branch --show-current && \
echo "" && \
echo "=== Проверка workflow файлов ===" && \
ls -la .github/workflows/ && \
echo "" && \
echo "=== Проверка важных файлов ===" && \
ls -la Dockerfile package.json pnpm-lock.yaml next.config.mjs
```

## Контрольный список

Перед push убедитесь:
- ✅ Git remote настроен на GitHub
- ✅ Вы на ветке main
- ✅ Файлы .github/workflows/deploy.yml и ci.yml существуют
- ✅ GCP_PROJECT_ID добавлен в GitHub Secrets
- ✅ GCP_SA_KEY добавлен в GitHub Secrets
- ✅ Service account создан и имеет права
- ✅ GCP APIs включены
- ✅ Artifact Registry репозиторий создан
- ✅ Все изменения закоммичены

## Тестовый push

Для проверки работы workflow:

```bash
cd /Users/vs/Projects/TaxDeclaration

# Сделайте небольшое изменение
echo "" >> README.md
echo "<!-- Test GitHub Actions -->" >> README.md

# Закоммитьте и отправьте
git add README.md
git commit -m "test: trigger GitHub Actions"
git push origin main
```

Затем сразу откройте GitHub Actions и наблюдайте за выполнением!

## Помощь

Если ничего не помогает:
1. Проверьте полную инструкцию в `GITHUB_ACTIONS_SETUP.md`
2. Проверьте логи в GitHub Actions
3. Проверьте GCP Cloud Run и Artifact Registry консоль
4. Убедитесь, что у вас есть права на GitHub репозиторий

## Полезные команды

```bash
# Проверить статус workflow через CLI
gh run list --limit 5

# Посмотреть логи последнего запуска
gh run view

# Запустить workflow вручную
gh workflow run deploy.yml

# Проверить secrets
gh secret list
```

