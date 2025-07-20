#!/bin/bash

# Monitoring setup script for DnD Dice Roller SaaS
# Sets up basic monitoring with logs and health checks

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Create log rotation configuration
setup_log_rotation() {
    print_status "Setting up log rotation..."
    
    cat > /etc/logrotate.d/dnddiceroller << 'EOF'
/opt/dnddiceroller/logs/*.log {
    daily
    missingok
    rotate 14
    compress
    delaycompress
    notifempty
    create 0644 1001 1001
    postrotate
        docker kill -s USR1 dnddiceroller-app 2>/dev/null || true
    endscript
}

/var/log/nginx/*.log {
    daily
    missingok
    rotate 30
    compress
    delaycompress
    notifempty
    create 0644 www-data www-data
    postrotate
        systemctl reload nginx
    endscript
}
EOF
    
    print_success "Log rotation configured"
}

# Create health check script
create_health_check() {
    print_status "Creating health check script..."
    
    cat > /opt/dnddiceroller/scripts/health-check.sh << 'EOF'
#!/bin/bash

# Health check script for DnD Dice Roller SaaS
# Checks various services and sends alerts if needed

DEPLOY_DIR="/opt/dnddiceroller"
ALERT_EMAIL="admin@dnddiceroller.site"
DOMAIN="dnddiceroller.site"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Function to send alert
send_alert() {
    local subject="$1"
    local message="$2"
    
    echo -e "${RED}ALERT: ${subject}${NC}"
    echo -e "${message}"
    
    # Send email if configured
    if command -v mail >/dev/null 2>&1; then
        echo -e "${message}\n\nTime: $(date)\nHost: $(hostname)" | mail -s "${subject}" ${ALERT_EMAIL}
    fi
    
    # Log to syslog
    logger -t "dnddiceroller-health" "${subject}: ${message}"
}

# Check if services are running
check_services() {
    local failed_services=""
    
    cd ${DEPLOY_DIR}
    
    # Check Docker containers
    if ! docker-compose -f docker-compose.prod.yml ps | grep -q "Up"; then
        failed_services="${failed_services}Docker services not running\n"
    fi
    
    # Check main application
    if ! curl -f -s http://localhost:3000/health >/dev/null 2>&1; then
        failed_services="${failed_services}Main application not responding\n"
    fi
    
    # Check database
    if ! docker-compose -f docker-compose.prod.yml exec -T postgres pg_isready >/dev/null 2>&1; then
        failed_services="${failed_services}PostgreSQL database not ready\n"
    fi
    
    # Check Redis
    if ! docker-compose -f docker-compose.prod.yml exec -T redis redis-cli ping >/dev/null 2>&1; then
        failed_services="${failed_services}Redis cache not responding\n"
    fi
    
    # Check Nginx
    if ! systemctl is-active nginx >/dev/null 2>&1; then
        failed_services="${failed_services}Nginx web server not running\n"
    fi
    
    # Check SSL certificate expiry
    if command -v openssl >/dev/null 2>&1; then
        ssl_expiry=$(echo | openssl s_client -servername ${DOMAIN} -connect ${DOMAIN}:443 2>/dev/null | openssl x509 -noout -dates | grep notAfter | cut -d= -f2)
        if [ ! -z "$ssl_expiry" ]; then
            expiry_timestamp=$(date -d "$ssl_expiry" +%s)
            current_timestamp=$(date +%s)
            days_until_expiry=$(( (expiry_timestamp - current_timestamp) / 86400 ))
            
            if [ $days_until_expiry -lt 30 ]; then
                failed_services="${failed_services}SSL certificate expires in ${days_until_expiry} days\n"
            fi
        fi
    fi
    
    if [ ! -z "$failed_services" ]; then
        send_alert "DnD Dice Roller Service Alert" "$failed_services"
        return 1
    else
        echo -e "${GREEN}All services are healthy${NC}"
        return 0
    fi
}

# Check disk space
check_disk_space() {
    local disk_usage=$(df / | awk 'NR==2 {print $5}' | sed 's/%//')
    
    if [ $disk_usage -gt 85 ]; then
        send_alert "Disk Space Warning" "Root filesystem is ${disk_usage}% full"
    fi
    
    # Check specific directories
    local log_usage=$(du -s /opt/dnddiceroller/logs 2>/dev/null | awk '{print $1}' || echo 0)
    if [ $log_usage -gt 1048576 ]; then  # 1GB in KB
        print_warning "Log directory is using $(echo "scale=2; $log_usage/1024/1024" | bc)GB"
    fi
}

# Check memory usage
check_memory() {
    local mem_usage=$(free | grep Mem | awk '{printf "%.0f", $3/$2 * 100}')
    
    if [ $mem_usage -gt 85 ]; then
        send_alert "Memory Usage Warning" "Memory usage is at ${mem_usage}%"
    fi
}

# Check API response times
check_api_performance() {
    local response_time=$(curl -o /dev/null -s -w "%{time_total}" http://localhost:3000/health)
    local slow_threshold="2.0"
    
    if (( $(echo "$response_time > $slow_threshold" | bc -l) )); then
        send_alert "API Performance Warning" "Health check response time: ${response_time}s (threshold: ${slow_threshold}s)"
    fi
}

# Main health check
main() {
    echo "=== DnD Dice Roller Health Check - $(date) ==="
    
    check_services
    check_disk_space
    check_memory
    check_api_performance
    
    echo "=== Health check completed ==="
}

# Run the health check
main
EOF
    
    chmod +x /opt/dnddiceroller/scripts/health-check.sh
    print_success "Health check script created"
}

# Set up monitoring cron jobs
setup_cron_jobs() {
    print_status "Setting up monitoring cron jobs..."
    
    # Create crontab entries
    (crontab -l 2>/dev/null || echo "") | grep -v "dnddiceroller" > /tmp/crontab.tmp
    
    cat >> /tmp/crontab.tmp << 'EOF'
# DnD Dice Roller SaaS Monitoring
*/5 * * * * /opt/dnddiceroller/scripts/health-check.sh >/dev/null 2>&1
0 2 * * * /opt/dnddiceroller/scripts/backup.sh >/var/log/dnddiceroller-backup.log 2>&1
0 3 * * 0 docker system prune -af --volumes >/dev/null 2>&1
*/10 * * * * /usr/bin/certbot renew --quiet --no-self-upgrade
EOF
    
    crontab /tmp/crontab.tmp
    rm /tmp/crontab.tmp
    
    print_success "Monitoring cron jobs configured"
}

# Create system monitoring dashboard
create_monitoring_dashboard() {
    print_status "Creating monitoring dashboard script..."
    
    cat > /opt/dnddiceroller/scripts/status.sh << 'EOF'
#!/bin/bash

# System status dashboard for DnD Dice Roller SaaS

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

clear
echo -e "${CYAN}╔══════════════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║               DnD Dice Roller SaaS Status                ║${NC}"
echo -e "${CYAN}╚══════════════════════════════════════════════════════════╝${NC}"
echo

# System Information
echo -e "${BLUE}System Information:${NC}"
echo "Hostname: $(hostname)"
echo "Uptime: $(uptime -p)"
echo "Load: $(uptime | cut -d',' -f3-5)"
echo "Memory: $(free -h | awk 'NR==2{printf "%s/%s (%.1f%%)", $3,$2,$3*100/$2 }')"
echo "Disk: $(df -h / | awk 'NR==2{printf "%s/%s (%s)", $3,$2,$5}')"
echo

# Docker Services
echo -e "${BLUE}Docker Services:${NC}"
cd /opt/dnddiceroller
docker-compose -f docker-compose.prod.yml ps
echo

# Application Health
echo -e "${BLUE}Application Health:${NC}"
if curl -f -s http://localhost:3000/health >/dev/null 2>&1; then
    echo -e "API Health: ${GREEN}✓ Healthy${NC}"
else
    echo -e "API Health: ${RED}✗ Unhealthy${NC}"
fi

if systemctl is-active nginx >/dev/null 2>&1; then
    echo -e "Nginx: ${GREEN}✓ Running${NC}"
else
    echo -e "Nginx: ${RED}✗ Stopped${NC}"
fi

# SSL Certificate
echo -e "${BLUE}SSL Certificate:${NC}"
if command -v openssl >/dev/null 2>&1; then
    ssl_info=$(echo | openssl s_client -servername dnddiceroller.site -connect dnddiceroller.site:443 2>/dev/null | openssl x509 -noout -dates 2>/dev/null)
    if [ ! -z "$ssl_info" ]; then
        expiry_date=$(echo "$ssl_info" | grep notAfter | cut -d= -f2)
        echo "Expires: $expiry_date"
        
        expiry_timestamp=$(date -d "$expiry_date" +%s)
        current_timestamp=$(date +%s)
        days_until_expiry=$(( (expiry_timestamp - current_timestamp) / 86400 ))
        
        if [ $days_until_expiry -gt 30 ]; then
            echo -e "Status: ${GREEN}✓ Valid ($days_until_expiry days remaining)${NC}"
        elif [ $days_until_expiry -gt 7 ]; then
            echo -e "Status: ${YELLOW}⚠ Expiring Soon ($days_until_expiry days remaining)${NC}"
        else
            echo -e "Status: ${RED}✗ Expiring ($days_until_expiry days remaining)${NC}"
        fi
    else
        echo -e "Status: ${RED}✗ Certificate check failed${NC}"
    fi
else
    echo "OpenSSL not available for certificate check"
fi

# Recent Logs
echo
echo -e "${BLUE}Recent Application Logs (last 10 lines):${NC}"
docker-compose -f docker-compose.prod.yml logs --tail=10 app 2>/dev/null || echo "No logs available"
echo

echo -e "${CYAN}Use 'docker-compose -f docker-compose.prod.yml logs -f' to follow logs${NC}"
echo -e "${CYAN}Use '/opt/dnddiceroller/scripts/health-check.sh' for detailed health check${NC}"
EOF
    
    chmod +x /opt/dnddiceroller/scripts/status.sh
    print_success "Monitoring dashboard created"
}

# Install additional monitoring tools
install_monitoring_tools() {
    print_status "Installing additional monitoring tools..."
    
    # Install htop, iotop, and other useful tools
    apt update >/dev/null 2>&1
    apt install -y htop iotop nethogs mailutils bc >/dev/null 2>&1
    
    print_success "Monitoring tools installed"
}

# Main setup function
main() {
    echo "🔍 Setting up monitoring for DnD Dice Roller SaaS..."
    echo
    
    install_monitoring_tools
    setup_log_rotation
    create_health_check
    create_monitoring_dashboard
    setup_cron_jobs
    
    print_success "Monitoring setup completed!"
    echo
    echo "Available monitoring commands:"
    echo "  /opt/dnddiceroller/scripts/status.sh     - System status dashboard"
    echo "  /opt/dnddiceroller/scripts/health-check.sh - Detailed health check"
    echo "  docker-compose -f /opt/dnddiceroller/docker-compose.prod.yml logs -f"
    echo
    echo "Automated monitoring:"
    echo "  - Health checks every 5 minutes"
    echo "  - Database backups daily at 2 AM"
    echo "  - SSL certificate auto-renewal"
    echo "  - Docker cleanup weekly"
}

# Run setup
main