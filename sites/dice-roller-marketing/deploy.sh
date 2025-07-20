#!/bin/bash

# DnD Dice Roller SaaS - Production Deployment Script
# This script automates the deployment process to your VPS

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
VPS_HOST="${VPS_HOST:-145.223.22.9}"
VPS_USER="${VPS_USER:-root}"
DEPLOY_DIR="${DEPLOY_DIR:-/opt/dnddiceroller}"
DOMAIN="${DOMAIN:-dnddiceroller.site}"
DB_PASSWORD="${DB_PASSWORD:-$(openssl rand -base64 32)}"
REDIS_PASSWORD="${REDIS_PASSWORD:-$(openssl rand -base64 32)}"
JWT_SECRET="${JWT_SECRET:-$(openssl rand -base64 64)}"
JWT_REFRESH_SECRET="${JWT_REFRESH_SECRET:-$(openssl rand -base64 64)}"

# Function to print colored output
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

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to generate secure environment file
generate_env_file() {
    print_status "Generating production environment file..."
    
    cat > .env << EOF
# Generated Environment Configuration - $(date)
NODE_ENV=production
PORT=3000
DOMAIN=${DOMAIN}
CLIENT_URL=https://${DOMAIN}
SERVER_URL=https://${DOMAIN}

# Database
DB_HOST=postgres
DB_PORT=5432
DB_NAME=dnddiceroller
DB_USER=dnddiceroller
DB_PASSWORD=${DB_PASSWORD}
DATABASE_URL=postgresql://dnddiceroller:${DB_PASSWORD}@postgres:5432/dnddiceroller

# Redis
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_PASSWORD=${REDIS_PASSWORD}
REDIS_URL=redis://:${REDIS_PASSWORD}@redis:6379

# JWT Secrets
JWT_SECRET=${JWT_SECRET}
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=${JWT_REFRESH_SECRET}
JWT_REFRESH_EXPIRES_IN=30d

# Email (configure with your SMTP settings)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
FROM_EMAIL=noreply@${DOMAIN}

# Stripe (add your keys)
STRIPE_SECRET_KEY=sk_live_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Admin
ADMIN_EMAIL=admin@${DOMAIN}
ADMIN_PASSWORD=$(openssl rand -base64 20)

# Security
BCRYPT_ROUNDS=12
SESSION_SECRET=$(openssl rand -base64 32)

# Features
ENABLE_REAL_TIME=true
ENABLE_ANALYTICS=true
ENABLE_WEBHOOKS=true
LOG_LEVEL=info
EOF

    print_success "Environment file generated with secure random passwords"
    print_warning "Please update Stripe, email, and other service credentials in .env file"
}

# Function to check prerequisites
check_prerequisites() {
    print_status "Checking prerequisites..."
    
    if ! command_exists ssh; then
        print_error "SSH client not found. Please install OpenSSH client."
        exit 1
    fi
    
    if ! command_exists git; then
        print_error "Git not found. Please install Git."
        exit 1
    fi
    
    print_success "Prerequisites check passed"
}

# Function to test VPS connection
test_vps_connection() {
    print_status "Testing VPS connection..."
    
    if ssh -o ConnectTimeout=10 -o BatchMode=yes ${VPS_USER}@${VPS_HOST} echo "Connection test successful" 2>/dev/null; then
        print_success "VPS connection successful"
    else
        print_error "Cannot connect to VPS. Please check:"
        echo "  - VPS IP address: ${VPS_HOST}"
        echo "  - SSH user: ${VPS_USER}"
        echo "  - SSH keys are set up correctly"
        exit 1
    fi
}

# Function to install Docker on VPS
install_docker_on_vps() {
    print_status "Installing Docker and Docker Compose on VPS..."
    
    ssh ${VPS_USER}@${VPS_HOST} << 'EOF'
        # Update system
        apt update && apt upgrade -y
        
        # Install Docker
        curl -fsSL https://get.docker.com -o get-docker.sh
        sh get-docker.sh
        
        # Install Docker Compose
        curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
        chmod +x /usr/local/bin/docker-compose
        
        # Start Docker service
        systemctl start docker
        systemctl enable docker
        
        # Add user to docker group
        usermod -aG docker $USER
        
        # Install other dependencies
        apt install -y nginx certbot python3-certbot-nginx curl
        
        echo "Docker installation completed"
EOF
    
    print_success "Docker installed on VPS"
}

# Function to deploy application to VPS
deploy_to_vps() {
    print_status "Deploying application to VPS..."
    
    # Create deployment directory on VPS
    ssh ${VPS_USER}@${VPS_HOST} "mkdir -p ${DEPLOY_DIR}"
    
    # Copy application files to VPS
    print_status "Copying application files..."
    rsync -avz --exclude 'node_modules' --exclude '.git' --exclude 'logs' \
        ./ ${VPS_USER}@${VPS_HOST}:${DEPLOY_DIR}/
    
    # Set up application on VPS
    ssh ${VPS_USER}@${VPS_HOST} << EOF
        cd ${DEPLOY_DIR}
        
        # Make sure .env file exists
        if [ ! -f .env ]; then
            cp .env.production .env
            echo "Please edit .env file with your actual credentials"
        fi
        
        # Create necessary directories
        mkdir -p logs backups nginx/ssl
        
        # Set permissions
        chmod +x deploy.sh scripts/*.sh
        
        # Build and start services
        docker-compose -f docker-compose.prod.yml down
        docker-compose -f docker-compose.prod.yml build --no-cache
        docker-compose -f docker-compose.prod.yml up -d postgres redis
        
        # Wait for database to be ready
        sleep 10
        
        # Run database migrations
        docker-compose -f docker-compose.prod.yml exec -T postgres sh -c 'PGPASSWORD=${DB_PASSWORD} createdb -h localhost -U dnddiceroller dnddiceroller || true'
        
        # Start main application
        docker-compose -f docker-compose.prod.yml up -d app
        
        echo "Application deployed successfully"
EOF
    
    print_success "Application deployed to VPS"
}

# Function to configure Nginx and SSL
configure_nginx_ssl() {
    print_status "Configuring Nginx and SSL certificate..."
    
    # Create Nginx configuration
    ssh ${VPS_USER}@${VPS_HOST} << EOF
        # Create Nginx configuration
        cat > /etc/nginx/sites-available/dnddiceroller << 'NGINXCONF'
server {
    listen 80;
    server_name ${DOMAIN} www.${DOMAIN};
    return 301 https://\$server_name\$request_uri;
}

server {
    listen 443 ssl http2;
    server_name ${DOMAIN} www.${DOMAIN};

    # SSL configuration will be added by Certbot
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' https://js.stripe.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://api.stripe.com;" always;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;

    # Rate limiting
    limit_req_zone \$binary_remote_addr zone=api:10m rate=10r/s;
    limit_req_zone \$binary_remote_addr zone=login:10m rate=1r/s;

    # Main application proxy
    location / {
        limit_req zone=api burst=20 nodelay;
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        proxy_read_timeout 300s;
        proxy_connect_timeout 75s;
    }

    # API endpoints with stricter rate limiting
    location /api/v1/auth/ {
        limit_req zone=login burst=5 nodelay;
        proxy_pass http://localhost:3000;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    # WebSocket support for real-time features
    location /socket.io/ {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    # Static files caching
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        proxy_pass http://localhost:3000;
    }

    # Health check
    location /health {
        proxy_pass http://localhost:3000;
        access_log off;
    }
}
NGINXCONF

        # Enable the site
        ln -sf /etc/nginx/sites-available/dnddiceroller /etc/nginx/sites-enabled/
        rm -f /etc/nginx/sites-enabled/default
        
        # Test Nginx configuration
        nginx -t
        
        # Reload Nginx
        systemctl reload nginx
        
        # Get SSL certificate
        certbot --nginx -d ${DOMAIN} -d www.${DOMAIN} --non-interactive --agree-tos --email admin@${DOMAIN} --redirect
        
        # Set up auto-renewal
        systemctl enable certbot.timer
        
        echo "Nginx and SSL configured successfully"
EOF
    
    print_success "Nginx and SSL certificate configured"
}

# Function to run database setup
setup_database() {
    print_status "Setting up database..."
    
    ssh ${VPS_USER}@${VPS_HOST} << EOF
        cd ${DEPLOY_DIR}
        
        # Wait for services to be ready
        sleep 15
        
        # Run migrations
        docker-compose -f docker-compose.prod.yml exec -T app npm run migrate
        
        # Seed initial data
        docker-compose -f docker-compose.prod.yml exec -T app npm run seed
        
        echo "Database setup completed"
EOF
    
    print_success "Database setup completed"
}

# Function to show deployment summary
show_deployment_summary() {
    print_success "🎲 DnD Dice Roller SaaS Deployed Successfully! 🎲"
    echo
    echo "==================================="
    echo "DEPLOYMENT SUMMARY"
    echo "==================================="
    echo "Domain: https://${DOMAIN}"
    echo "API: https://${DOMAIN}/api/v1"
    echo "Admin: https://${DOMAIN}/admin"
    echo
    echo "Services:"
    echo "  - Main App: Running on port 3000"
    echo "  - PostgreSQL: Running on port 5432"
    echo "  - Redis: Running on port 6379"
    echo "  - Nginx: Running on ports 80/443"
    echo
    echo "Generated Credentials:"
    echo "  - Database Password: ${DB_PASSWORD}"
    echo "  - Redis Password: ${REDIS_PASSWORD}"
    echo "  - Admin Login: admin@${DOMAIN}"
    echo "  - Admin Password: Check .env file on server"
    echo
    echo "IMPORTANT NEXT STEPS:"
    echo "==================================="
    echo "1. Edit .env file on server with your Stripe keys:"
    echo "   ssh ${VPS_USER}@${VPS_HOST}"
    echo "   cd ${DEPLOY_DIR} && nano .env"
    echo
    echo "2. Configure email SMTP settings in .env"
    echo
    echo "3. Set up your Stripe webhook endpoint:"
    echo "   https://${DOMAIN}/api/v1/webhooks/stripe"
    echo
    echo "4. Update DNS records to point to ${VPS_HOST}"
    echo
    echo "5. Test the application:"
    echo "   https://${DOMAIN}"
    echo
    print_success "Deployment completed successfully! 🚀"
}

# Main deployment function
main() {
    echo "🎲 DnD Dice Roller SaaS - Production Deployment 🎲"
    echo "================================================="
    echo
    echo "VPS: ${VPS_HOST}"
    echo "Domain: ${DOMAIN}"
    echo "Deploy Directory: ${DEPLOY_DIR}"
    echo
    
    read -p "Continue with deployment? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_warning "Deployment cancelled"
        exit 0
    fi
    
    check_prerequisites
    test_vps_connection
    generate_env_file
    
    print_status "Starting deployment process..."
    
    install_docker_on_vps
    deploy_to_vps
    setup_database
    configure_nginx_ssl
    
    show_deployment_summary
}

# Handle command line arguments
case "${1:-deploy}" in
    "deploy")
        main
        ;;
    "update")
        print_status "Updating application..."
        deploy_to_vps
        ssh ${VPS_USER}@${VPS_HOST} "cd ${DEPLOY_DIR} && docker-compose -f docker-compose.prod.yml restart app"
        print_success "Application updated successfully"
        ;;
    "logs")
        ssh ${VPS_USER}@${VPS_HOST} "cd ${DEPLOY_DIR} && docker-compose -f docker-compose.prod.yml logs -f"
        ;;
    "status")
        ssh ${VPS_USER}@${VPS_HOST} "cd ${DEPLOY_DIR} && docker-compose -f docker-compose.prod.yml ps"
        ;;
    "backup")
        ssh ${VPS_USER}@${VPS_HOST} "cd ${DEPLOY_DIR} && docker-compose -f docker-compose.prod.yml --profile backup up db-backup"
        ;;
    *)
        echo "Usage: $0 {deploy|update|logs|status|backup}"
        echo
        echo "Commands:"
        echo "  deploy  - Full deployment (default)"
        echo "  update  - Update application code only"
        echo "  logs    - View application logs"
        echo "  status  - Check service status"
        echo "  backup  - Create database backup"
        exit 1
        ;;
esac