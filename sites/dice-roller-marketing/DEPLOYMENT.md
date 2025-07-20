# Domain Configuration & VPS Deployment Guide

## Domain DNS Configuration (Namecheap)

### 1. Login to Namecheap Dashboard
- Go to your Namecheap account
- Navigate to Domain List > Manage your domain

### 2. DNS Configuration
Set up these DNS records:

**A Records:**
```
Type: A
Host: @
Value: 145.223.22.9
TTL: Automatic
```

```
Type: A  
Host: www
Value: 145.223.22.9
TTL: Automatic
```

**Optional CNAME (if using subdomain):**
```
Type: CNAME
Host: app (or your preferred subdomain)
Value: your-main-domain.com
TTL: Automatic
```

### 3. Wait for DNS Propagation
- DNS changes can take 1-48 hours to propagate
- Use `dig your-domain.com` or online tools to check propagation

## VPS Deployment Instructions (Hostinger VPS 145.223.22.9)

### Prerequisites
- SSH access to VPS (keys already exchanged)
- Docker and Docker Compose installed on VPS

### 1. Connect to VPS
```bash
ssh root@145.223.22.9
# or if using specific user: ssh username@145.223.22.9
```

### 2. Install Docker (if not installed)
```bash
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
```

### 3. Deploy the Site
```bash
# Create deployment directory
mkdir -p /opt/dice-marketing
cd /opt/dice-marketing

# Clone or upload your site files
git clone https://github.com/your-username/dice-roller-marketing-site.git .
# OR upload files via scp from local machine:
# scp -r /path/to/local/site/* root@145.223.22.9:/opt/dice-marketing/

# Update docker-compose.yml with your domain
sed -i 's/your-domain.com/your-actual-domain.com/g' docker-compose.yml

# Build and start the container
docker-compose up -d --build

# Check status
docker-compose ps
docker-compose logs
```

### 4. Configure Nginx (Optional - if using reverse proxy)
If you want to set up SSL/HTTPS or multiple sites:

```bash
# Install Nginx on host
apt install nginx -y

# Create Nginx config
cat > /etc/nginx/sites-available/dice-marketing << 'EOF'
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;
    
    location / {
        proxy_pass http://localhost:80;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF

# Enable site
ln -s /etc/nginx/sites-available/dice-marketing /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx
```

### 5. SSL Setup (Optional - Recommended)
```bash
# Install Certbot
apt install snapd -y
snap install core; snap refresh core
snap install --classic certbot
ln -s /snap/bin/certbot /usr/bin/certbot

# Get SSL certificate
certbot --nginx -d your-domain.com -d www.your-domain.com

# Auto-renewal (should be automatic, but verify)
crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

## Verification Steps

### 1. Test Local Docker Build
```bash
# From your local project directory
docker build -t dice-marketing .
docker run -p 8080:80 dice-marketing
# Visit http://localhost:8080
```

### 2. Test VPS Deployment
```bash
# On VPS
curl http://localhost/health
curl http://your-domain.com/health
```

### 3. Check Logs
```bash
# Container logs
docker-compose logs -f

# Nginx logs (if using)
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

## Troubleshooting

### Common Issues:
1. **Port 80/443 blocked**: Check firewall settings
2. **DNS not resolving**: Wait for propagation or check DNS records
3. **Container won't start**: Check Docker logs
4. **Site not loading**: Verify Nginx config and port forwarding

### Useful Commands:
```bash
# Restart services
docker-compose restart
systemctl restart nginx

# Check port usage
netstat -tulpn | grep :80
netstat -tulpn | grep :443

# Test DNS resolution
dig your-domain.com
nslookup your-domain.com

# Check SSL certificate
openssl s_client -connect your-domain.com:443 -servername your-domain.com
```

## File Structure
```
/opt/dice-marketing/
├── Dockerfile
├── docker-compose.yml
├── index.html
├── styles.css
├── script.js
├── assets/
└── other-site-files...
```