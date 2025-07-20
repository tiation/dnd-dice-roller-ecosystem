#!/bin/bash

# Database backup script for DnD Dice Roller SaaS
# This script creates automated backups of PostgreSQL database

set -e

# Configuration
DB_HOST="${DB_HOST:-postgres}"
DB_PORT="${DB_PORT:-5432}"
DB_NAME="${DB_NAME:-dnddiceroller}"
DB_USER="${DB_USER:-dnddiceroller}"
BACKUP_DIR="/backups"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="${BACKUP_DIR}/dnddiceroller_backup_${DATE}.sql"
RETENTION_DAYS=${BACKUP_RETENTION_DAYS:-7}

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

# Create backup directory
mkdir -p ${BACKUP_DIR}

print_status "Starting database backup..."
print_status "Database: ${DB_NAME} on ${DB_HOST}:${DB_PORT}"
print_status "Backup file: ${BACKUP_FILE}"

# Perform the backup
if pg_dump -h ${DB_HOST} -p ${DB_PORT} -U ${DB_USER} -d ${DB_NAME} \
    --verbose --clean --if-exists --no-owner --no-privileges \
    --exclude-table-data=api_usage \
    --exclude-table-data=webhook_deliveries \
    > ${BACKUP_FILE}; then
    
    print_status "Database backup completed successfully"
    
    # Compress the backup
    if gzip ${BACKUP_FILE}; then
        BACKUP_FILE="${BACKUP_FILE}.gz"
        print_status "Backup compressed: ${BACKUP_FILE}"
    else
        print_warning "Failed to compress backup, but backup is complete"
    fi
    
    # Get file size
    BACKUP_SIZE=$(du -h ${BACKUP_FILE} | cut -f1)
    print_status "Backup size: ${BACKUP_SIZE}"
    
    # Clean up old backups
    print_status "Cleaning up backups older than ${RETENTION_DAYS} days..."
    find ${BACKUP_DIR} -name "dnddiceroller_backup_*.sql*" -mtime +${RETENTION_DAYS} -delete
    
    # List remaining backups
    print_status "Available backups:"
    ls -lh ${BACKUP_DIR}/dnddiceroller_backup_*.sql* 2>/dev/null || print_status "No previous backups found"
    
    # Upload to S3 if configured
    if [ ! -z "${AWS_ACCESS_KEY_ID}" ] && [ ! -z "${BACKUP_S3_BUCKET}" ]; then
        print_status "Uploading backup to S3..."
        if command -v aws >/dev/null 2>&1; then
            aws s3 cp ${BACKUP_FILE} s3://${BACKUP_S3_BUCKET}/database-backups/$(basename ${BACKUP_FILE})
            print_status "Backup uploaded to S3 successfully"
        else
            print_warning "AWS CLI not found, skipping S3 upload"
        fi
    fi
    
    print_status "Backup process completed successfully"
    
else
    print_error "Database backup failed"
    exit 1
fi