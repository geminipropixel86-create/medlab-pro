#!/bin/bash
set -euo pipefail

# ─── MedLab Pro Production Deploy Script ─────────────────
# Usage: ./deploy.sh [environment]
#   environment: production | staging (default: production)

ENV="${1:-production}"
COMPOSE_FILE="../docker/docker-compose.yml"
STACK_NAME="medlab-pro"

echo "=== MedLab Pro Deploy: $ENV ==="

# 1. Pull latest code
echo "[1/5] Pulling latest code..."
cd "$(dirname "$0")/../.."
git pull origin main

# 2. Build images
echo "[2/5] Building Docker images..."
docker-compose -f "$COMPOSE_FILE" build --no-cache

# 3. Apply database migrations
echo "[3/5] Running database migrations..."
docker-compose -f "$COMPOSE_FILE" run --rm api npx ts-node -r tsconfig-paths/register src/database/migration-run.ts

# 4. Seed data (if first time)
echo "[4/5] Seeding data..."
docker-compose -f "$COMPOSE_FILE" run --rm api npx ts-node -r tsconfig-paths/register src/database/seed.ts

# 5. Start services
echo "[5/5] Starting services..."
docker-compose -f "$COMPOSE_FILE" up -d --remove-orphans

# Health check
echo "=== Health Check ==="
sleep 5
curl -sf http://localhost:3000/api/v1/reports/dashboard > /dev/null && echo "API: OK" || echo "API: FAILED"
curl -sf http://localhost:5173 > /dev/null && echo "Dashboard: OK" || echo "Dashboard: FAILED"

echo "=== Deploy Complete ==="
echo "API:      http://localhost:3000"
echo "Dashboard: http://localhost:5173"
echo "Database:  postgresql://localhost:5432/medlab_pro"