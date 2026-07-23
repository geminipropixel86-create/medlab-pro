#!/bin/bash
set -euo pipefail

# ─── MedLab Pro Database Backup Script ───────────────────
# Usage: ./backup.sh
# Output: ./backups/medlab-pro-YYYY-MM-DD-HHMMSS.sql.gz

BACKUP_DIR="$(dirname "$0")/../backups"
mkdir -p "$BACKUP_DIR"

TIMESTAMP=$(date +"%Y-%m-%d-%H%M%S")
BACKUP_FILE="$BACKUP_DIR/medlab-pro-$TIMESTAMP.sql.gz"
DB_CONTAINER="medlab-postgres"

echo "=== Database Backup ==="
echo "Backing up to: $BACKUP_FILE"

docker exec "$DB_CONTAINER" pg_dump \
    -U medlab_user \
    -d medlab_pro \
    --no-owner \
    --clean \
    --if-exists \
    | gzip > "$BACKUP_FILE"

echo "Backup size: $(du -h "$BACKUP_FILE" | cut -f1)"
echo "=== Backup Complete ==="

# Keep last 30 days, remove older
find "$BACKUP_DIR" -name "medlab-pro-*.sql.gz" -mtime +30 -delete