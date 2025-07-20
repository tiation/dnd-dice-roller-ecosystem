#!/bin/bash

# Database restore script for DnD Dice Roller SaaS
# This script restores PostgreSQL database from backup

set -e

# Configuration
DB_HOST="${DB_HOST:-postgres}"
DB_PORT="${DB_PORT:-5432}"
DB_NAME="${DB_NAME:-dnddiceroller}"
DB_USER="${DB_USER:-dnddiceroller}"
BACKUP_DIR="/backups"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

print_status() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

print_error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR:${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING:${NC} $1"
}

# Function to show usage
show_usage() {
    echo "Usage: $0 <backup_file>"
    echo
    echo "Available backups:"
    ls -lh ${BACKUP_DIR}/dnddiceroller_backup_*.sql* 2>/dev/null || echo "No backups found"
    echo
    echo "Example:"
    echo "  $0 /backups/dnddiceroller_backup_20241201_120000.sql.gz"
    echo "  $0 latest  # Restore from the most recent backup"
}

# Check if backup file is provided
if [ $# -eq 0 ]; then
    show_usage
    exit 1
fi

BACKUP_FILE="$1"

# Handle 'latest' option
if [ "$BACKUP_FILE" = "latest" ]; then
    BACKUP_FILE=$(ls -t ${BACKUP_DIR}/dnddiceroller_backup_*.sql* 2>/dev/null | head -n1)
    if [ -z "$BACKUP_FILE" ]; then
        print_error "No backup files found in ${BACKUP_DIR}"
        exit 1
    fi
    print_status "Using latest backup: ${BACKUP_FILE}"
fi

# Check if backup file exists
if [ ! -f "$BACKUP_FILE" ]; then
    print_error "Backup file not found: $BACKUP_FILE"
    show_usage
    exit 1
fi

# Confirm restoration
echo -e "${YELLOW}WARNING: This will replace ALL data in the database ${DB_NAME}${NC}"
echo "Backup file: $BACKUP_FILE"
echo "Target database: ${DB_NAME} on ${DB_HOST}:${DB_PORT}"
echo
read -p "Are you sure you want to continue? (yes/no): " -r
if [[ ! $REPLY =~ ^(yes|YES)$ ]]; then
    print_warning "Restoration cancelled"
    exit 0
fi

print_status "Starting database restoration..."

# Check if file is compressed
if [[ "$BACKUP_FILE" == *.gz ]]; then
    print_status "Decompressing backup file..."
    RESTORE_CMD="gunzip -c $BACKUP_FILE | psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME"
else
    RESTORE_CMD="psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f $BACKUP_FILE"
fi

# Stop the application before restore
print_status "Stopping application services..."
if command -v docker-compose >/dev/null 2>&1; then
    cd /opt/dnddiceroller 2>/dev/null || true
    docker-compose -f docker-compose.prod.yml stop app 2>/dev/null || true
fi

# Perform the restoration
print_status "Restoring database from backup..."
if eval $RESTORE_CMD; then
    print_status "Database restoration completed successfully"
    
    # Restart the application
    print_status "Starting application services..."
    if command -v docker-compose >/dev/null 2>&1; then
        cd /opt/dnddiceroller 2>/dev/null || true
        docker-compose -f docker-compose.prod.yml start app 2>/dev/null || true
    fi
    
    print_status "Restoration process completed successfully"
    print_status "Please verify the application is working correctly"
    
else
    print_error "Database restoration failed"
    
    # Try to restart the application anyway
    print_status "Attempting to restart application services..."
    if command -v docker-compose >/dev/null 2>&1; then
        cd /opt/dnddiceroller 2>/dev/null || true
        docker-compose -f docker-compose.prod.yml start app 2>/dev/null || true
    fi
    
    exit 1
fi