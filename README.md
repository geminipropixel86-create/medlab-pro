# MedLab Pro 🏥

**Complete Laboratory Management System** — Backend API, Lab Dashboard, Patient Mobile App, and Public Website.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                         MedLab Pro Stack                            │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │
│  │  Flutter App  │  │ Lab Dashboard│  │Public Website│              │
│  │ (Patient)     │  │ (React Admin)│  │  (Next.js)   │              │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘              │
│         │                 │                 │                       │
│  ┌──────┴─────────────────┴─────────────────┴───────┐              │
│  │              Nginx Reverse Proxy                   │              │
│  └──────────────────────┬───────────────────────────┘              │
│                         │                                           │
│  ┌──────────────────────┴───────────────────────────┐              │
│  │           NestJS Backend API (REST)              │              │
│  │    Auth │ Patients │ Tests │ Results │ Billing    │              │
│  └──────┬──────────────┬───────────────────────────┘              │
│         │              │                                           │
│  ┌──────┴──────┐ ┌─────┴──────┐  ┌──────────────┐                │
│  │  PostgreSQL │ │   Redis    │  │   MinIO/S3   │                │
│  │  (Primary)  │ │  (Cache)   │  │  (Storage)   │                │
│  └─────────────┘ └────────────┘  └──────────────┘                │
└─────────────────────────────────────────────────────────────────────┘
```

## Prerequisites

| Tool | Version | Install |
|------|---------|---------|
| Node.js | >= 20 | `nvm install 20` |
| Docker | >= 24 | [docker.com](https://docker.com) |
| Flutter | >= 3.16 | [flutter.dev](https://flutter.dev) |
| PostgreSQL | 16 | Via Docker |
| Redis | 7 | Via Docker |

## Quick Start (5 minutes)

### Prerequisites
```bash
# Install Node.js 20
nvm install 20
nvm use 20

# Install Docker
curl -fsSL https://get.docker.com | sh

# Install Flutter (optional, for mobile)
# Follow: https://docs.flutter.dev/get-started/install
```

### 1. Clone & Setup
```bash
git clone https://github.com/your-org/medlab-pro.git
cd medlab-pro
cp .env.example .env
```

### 2. Start Infrastructure (Docker)
```bash
docker-compose -f infrastructure/docker/docker-compose.yml up -d postgres redis minio
```

### 3. Start Backend API
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your credentials
npm run start:dev
# API: http://localhost:3000/api/v1
# Docs: http://localhost:3000/api/v1/docs
```

### 4. Seed Database
```bash
npm run seed
# Creates admin user & test price items
# Login: admin@medlabpro.com / Admin@123456
```

### 5. Start Lab Dashboard
```bash
cd apps/lab-dashboard
npm install
npm run dev
# Dashboard: http://localhost:5173
```

### 6. Run Mobile App (Optional)
```bash
cd apps/patient-mobile
flutter pub get
flutter run
```

---

## Project Structure

```
medlab-pro/
├── backend/                          # NestJS API Server
│   ├── src/
│   │   ├── main.ts                   # App bootstrap
│   │   ├── app.module.ts             # Root module
│   │   ├── modules/
│   │   │   ├── auth/                 # Auth (JWT, register, login)
│   │   │   ├── patients/             # Patient CRUD
│   │   │   ├── tests/                # Lab test management
│   │   │   ├── results/              # Test result entry & verification
│   │   │   ├── notifications/        # Multi-channel notifications
│   │   │   ├── payments/             # Billing & payments
│   │   │   ├── reports/              # Dashboard & analytics
│   │   │   ├── pricing/              # Price catalog
│   │   │   ├── offers/               # Discounts & coupons
│   │   │   └── content/              # CMS pages
│   │   ├── database/
│   │   │   ├── data-source.ts        # TypeORM config
│   │   │   ├── migrations/           # DB migrations
│   │   │   └── seed.ts               # Demo data seeder
│   │   └── common/                   # Shared guards, filters, interceptors
│   ├── Dockerfile
│   └── package.json
│
├── apps/
│   ├── lab-dashboard/                # React + Vite + Tailwind
│   │   ├── src/
│   │   │   ├── pages/                # Dashboard, Patients, Tests, etc.
│   │   │   ├── components/           # Layout, shared UI
│   │   │   └── store/                # Zustand auth store
│   │   ├── Dockerfile
│   │   └── package.json
│   │
│   ├── patient-mobile/               # Flutter App
│   │   ├── lib/
│   │   │   ├── src/
│   │   │   │   ├── screens/          # Splash, Login, Home, Tests, Profile
│   │   │   │   ├── providers/        # Auth & Test state management
│   │   │   │   ├── models/           # User, TestResult models
│   │   │   │   ├── services/         # API service layer
│   │   │   │   └── l10n/             # Multi-language (en, es, fr, ar)
│   │   │   └── main.dart
│   │   └── pubspec.yaml
│   │
│   └── public-website/               # Next.js Marketing Site
│       ├── pages/
│       │   ├── index.tsx             # Home page
│       │   ├── about.tsx             # About page
│       │   ├── services.tsx          # Services page
│       │   └── contact.tsx           # Contact form
│       ├── components/
│       │   └── Layout.tsx            # Site layout
│       └── package.json
│
├── infrastructure/
│   ├── docker/
│   │   └── docker-compose.yml        # Full stack orchestration
│   ├── nginx/
│   │   └── default.conf              # Reverse proxy config
│   ├── kubernetes/
│   │   ├── namespace.yaml
│   │   ├── deployment.yaml           # API + Dashboard + Ingress
│   │   ├── postgres.yaml             # StatefulSet
│   │   └── redis.yaml                # Deployment
│   └── scripts/
│       ├── deploy.sh                 # Production deploy
│       └── backup.sh                 # Database backup
│
├── .env.example
├── .gitignore
└── README.md
```

---

## API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/v1/auth/register` | Register new user | No |
| POST | `/api/v1/auth/login` | Login | No |
| POST | `/api/v1/auth/refresh` | Refresh token | No |
| GET | `/api/v1/auth/profile` | Get user profile | JWT |
| GET | `/api/v1/patients` | List patients | JWT |
| POST | `/api/v1/patients` | Create patient | JWT |
| GET | `/api/v1/patients/stats` | Patient stats | JWT |
| GET | `/api/v1/tests` | List tests | JWT |
| POST | `/api/v1/tests` | Create test | JWT |
| PUT | `/api/v1/tests/:id/status` | Update test status | JWT |
| POST | `/api/v1/results` | Submit results | JWT |
| GET | `/api/v1/results/test/:testId` | Get result by test | JWT |
| GET | `/api/v1/payments/revenue` | Revenue stats | JWT |
| GET | `/api/v1/reports/dashboard` | Dashboard stats | JWT |
| GET | `/api/v1/pricing` | List price items | No |
| GET | `/api/v1/offers/active` | Active offers | No |

---

## Deployment Options

### Option A: Docker Compose (Recommended)

```bash
# Full stack
docker-compose -f infrastructure/docker/docker-compose.yml up -d

# Or use the deploy script
cd infrastructure/scripts
./deploy.sh production
```

### Option B: Kubernetes (Production)

```bash
kubectl apply -f infrastructure/kubernetes/namespace.yaml
kubectl apply -f infrastructure/kubernetes/

# Create secrets
kubectl create secret generic medlab-secrets \
  --namespace=medlab-pro \
  --from-literal=db-username=medlab_user \
  --from-literal=db-password=medlab_pass_secure \
  --from-literal=jwt-secret=your-strong-secret-here
```

### Option C: Manual Ubuntu Server

```bash
# 1. Install dependencies
sudo apt update && sudo apt install -y nginx postgresql redis-server
sudo systemctl enable postgresql redis-server

# 2. Setup PostgreSQL
sudo -u postgres psql -c "CREATE USER medlab_user WITH PASSWORD 'medlab_pass_secure';"
sudo -u postgres psql -c "CREATE DATABASE medlab_pro OWNER medlab_user;"

# 3. Deploy backend (via PM2)
npm install -g pm2
cd backend
npm install && npm run build
pm2 start dist/main.js --name medlab-api

# 4. Deploy dashboard
cd apps/lab-dashboard
npm install && npm run build
# Serve via nginx from dist/

# 5. Configure nginx
sudo cp infrastructure/nginx/default.conf /etc/nginx/sites-available/medlab
sudo nginx -t && sudo systemctl reload nginx
```

---

## Mobile App Build

### Android (APK)
```bash
cd apps/patient-mobile
flutter build apk --release
# Output: build/app/outputs/flutter-apk/app-release.apk
```

### Android (App Bundle for Play Store)
```bash
flutter build appbundle --release
# Output: build/app/outputs/bundle/release/app-release.aab
```

### iOS
```bash
flutter build ios --release
# Then archive via Xcode
```

---

## Testing

### Unit Tests (Jest)

The backend has **76+ unit tests** across the 4 core modules (auth, patients, tests, results), covering services and controllers.

**Test coverage:**
- **Auth service** — register (duplicate email, password hashing, default role), login (invalid credentials, inactive account, lastLoginAt update), refresh (valid/invalid token, mismatch), profile
- **Auth controller** — delegates to service with correct parameters
- **Patients service** — create (auto ID generation, increment), findAll (pagination, search, status filter), findOne, update, soft delete, stats aggregation
- **Tests service** — create (auto testNumber, default status), findAll (status/patient filters), findOne, update, updateStatus (sample collected date, result date, assignment), stats (completion rate, empty state)
- **Results service** — create (parameters), findByTest, update, verify (sets verifiedById + verifiedAt), getPatientResults
- **E2E integration** — auth guard enforcement, public vs protected endpoints

### Running Tests

```bash
cd backend

# Run all unit tests with watch mode
npm run test:watch

# Run all unit tests once
npm test

# Run with coverage report
npm run test:cov

# Run e2e integration tests
npm run test:e2e
```

### Test Structure

```
backend/
├── src/
│   └── modules/
│       ├── auth/
│       │   ├── auth.service.spec.ts      # 15+ tests: register, login, refresh, profile
│       │   └── auth.controller.spec.ts   # 4 tests: each endpoint delegates correctly
│       ├── patients/
│       │   ├── patients.service.spec.ts  # 12+ tests: CRUD, search, stats, edge cases
│       │   └── patients.controller.spec.ts # 6 tests: all endpoints
│       ├── tests/
│       │   ├── tests.service.spec.ts     # 14+ tests: CRUD, status transitions, stats
│       │   └── tests.controller.spec.ts  # 7 tests: all endpoints
│       └── results/
│           ├── results.service.spec.ts   # 10+ tests: CRUD, verify, patient queries
│           └── results.controller.spec.ts # 5 tests: all endpoints
├── test/
│   ├── helpers/
│   │   └── mock-factory.ts              # Type-safe mock Repository, JwtService, entity builders
│   └── e2e/
│       └── auth.e2e-spec.ts             # Full HTTP pipeline: auth guards, public endpoints
```

### Test Approach

- **Unit tests** use `@nestjs/testing` with mocked TypeORM repositories (`jest.fn()` on every query method). No database connection needed.
- **Controller tests** verify that HTTP handlers delegate to the service with the correct arguments (including `req.user.id` from the auth guard).
- **Mock factories** in `test/helpers/mock-factory.ts` provide reusable builders for entities and type-safe mock repositories.
- **E2E tests** use `supertest` against the full NestJS app. They validate the auth guard pipeline (401 without token) and public endpoint access.

### Coverage Thresholds

| Metric | Target |
|--------|--------|
| Lines | 80% |
| Functions | 80% |
| Branches | 70% |
| Statements | 80% |

---

## Firebase Setup (Push Notifications)

1. Create project at [console.firebase.google.com](https://console.firebase.google.com)
2. Add Android app (package: `com.medlab.patient`)
3. Download `google-services.json` → `apps/patient-mobile/android/app/`
4. Enable Cloud Messaging
5. Copy server key to backend `.env` as `FIREBASE_SERVER_KEY`

---

## Environment Variables Reference

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `NODE_ENV` | No | `development` | Environment |
| `PORT` | No | `3000` | API port |
| `DB_HOST` | Yes | `localhost` | PostgreSQL host |
| `DB_PORT` | No | `5432` | PostgreSQL port |
| `DB_USERNAME` | Yes | `medlab_user` | DB user |
| `DB_PASSWORD` | Yes | - | DB password |
| `DB_DATABASE` | Yes | `medlab_pro` | DB name |
| `REDIS_HOST` | No | `localhost` | Redis host |
| `JWT_SECRET` | Yes | - | JWT signing key (min 32 chars) |
| `JWT_EXPIRES_IN` | No | `7d` | Token expiry |
| `CORS_ORIGINS` | No | `http://localhost:5173` | Allowed origins |
| `STORAGE_TYPE` | No | `local` | `local`, `s3`, or `minio` |
| `SMTP_HOST` | For email | - | SMTP server |

---

## Features

- **Patient Management** — Register, search, and manage patient records with unique IDs
- **Test Management** — Order tests, track status (pending → collected → in progress → completed)
- **Result Entry** — Enter structured results with parameter-level flags (normal/high/low)
- **Multi-channel Notifications** — WhatsApp, SMS, Email, Push (with cron-based dispatch)
- **Billing & Payments** — Invoice generation, payment tracking, revenue analytics
- **Pricing Catalog** — Manage test prices, categories, and preparation instructions
- **Offers & Discounts** — Time-bound offers with coupon codes
- **Dashboard Analytics** — Real-time stats, trends, revenue reports
- **Patient Mobile App** — Flutter app with test tracking, results, multi-language
- **Role-based Access** — Super admin, lab admin, technician, receptionist, patient
- **API Documentation** — Auto-generated Swagger docs at `/api/v1/docs`
- **Docker Ready** — Full Docker Compose stack for instant deployment
- **Kubernetes Support** — Production-grade K8s manifests
- **Multi-language** — Mobile app supports English, Spanish, French, Arabic