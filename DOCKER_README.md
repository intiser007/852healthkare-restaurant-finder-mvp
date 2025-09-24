# 🐳 HealthKare Restaurant Finder - Docker Setup

A containerized restaurant recommendation system that provides personalized suggestions based on health profiles and location.

## 🚀 Quick Start

### Prerequisites
- [Docker](https://docs.docker.com/get-docker/) (20.10+)
- [Docker Compose](https://docs.docker.com/compose/install/) (2.0+)

### 1. Clone and Setup
```bash
# Clone the repository
git clone <your-repo-url>
cd 852-HealthKare

# Copy environment template
cp env.template .env
```

### 2. Configure API Keys
Edit the `.env` file and add your API keys:

```bash
# Required: Get from https://developer.foursquare.com/
FOURSQUARE_API_KEY=your_foursquare_api_key_here

# Optional: Get from https://makersuite.google.com/app/apikey
GEMINI_API_KEY=your_gemini_api_key_here
```

### 3. Run the Application
```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### 4. Access the Application
- **Frontend**: http://localhost
- **Backend API**: http://localhost:3000
- **Health Check**: http://localhost/health

## 📋 Services Overview

| Service | Port | Description |
|---------|------|-------------|
| Frontend | 80 | Vue.js UI with Nginx |
| Backend | 3000 | Node.js API server |

## 🔧 Configuration

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `FOURSQUARE_API_KEY` | ✅ Yes | Foursquare API key for restaurant data |
| `GEMINI_API_KEY` | ❌ No | Google Gemini API key for AI recommendations |
| `NODE_ENV` | ❌ No | Environment (default: production) |
| `PORT` | ❌ No | Backend port (default: 3000) |

### API Keys Setup

#### Foursquare API (Required)
1. Visit [Foursquare Developer](https://developer.foursquare.com/)
2. Sign up for a free account
3. Create a new project
4. Copy your API key
5. Add it to your `.env` file

#### Google Gemini API (Optional)
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with Google account
3. Create a new API key
4. Add it to your `.env` file

## 🛠️ Development

### Local Development
```bash
# Backend development
cd restaurant-finder-api
npm install
npm run dev

# Frontend development
cd restaurant-finder-ui
npm install
npm run dev
```

### Docker Development
```bash
# Build and run in development mode
docker-compose -f docker-compose.dev.yml up --build

# Rebuild specific service
docker-compose build backend
docker-compose up -d backend
```

## 📊 Monitoring

### Health Checks
```bash
# Check service health
docker-compose ps

# View service logs
docker-compose logs backend
docker-compose logs frontend

# Check resource usage
docker stats
```

### Logs
```bash
# Follow all logs
docker-compose logs -f

# Follow specific service
docker-compose logs -f backend
docker-compose logs -f frontend

# View last 100 lines
docker-compose logs --tail=100
```

## 🔍 Troubleshooting

### Common Issues

#### 1. Port Already in Use
```bash
# Check what's using the port
lsof -i :80
lsof -i :3000

# Stop conflicting services
sudo systemctl stop nginx  # if nginx is running
```

#### 2. API Key Issues
```bash
# Check environment variables
docker-compose exec backend env | grep API_KEY

# Restart with new environment
docker-compose down
docker-compose up -d
```

#### 3. Build Failures
```bash
# Clean build
docker-compose down
docker system prune -f
docker-compose build --no-cache
docker-compose up -d
```

#### 4. Permission Issues
```bash
# Fix file permissions
sudo chown -R $USER:$USER .
chmod -R 755 .
```

### Debug Commands
```bash
# Enter container shell
docker-compose exec backend sh
docker-compose exec frontend sh

# Check container status
docker-compose ps

# View detailed logs
docker-compose logs --details
```

## 🚀 Production Deployment

### Production Setup
```bash
# Use production compose file
docker-compose -f docker-compose.prod.yml up -d

# Set production environment
export NODE_ENV=production
docker-compose up -d
```

### Security Considerations
- Change default ports in production
- Use HTTPS with SSL certificates
- Set up proper firewall rules
- Regular security updates
- Monitor resource usage

## 📁 Project Structure
```
852-HealthKare/
├── docker-compose.yml          # Main orchestration file
├── env.template               # Environment template
├── DOCKER_README.md           # This file
├── restaurant-finder-api/     # Backend service
│   ├── Dockerfile
│   ├── src/
│   └── package.json
└── restaurant-finder-ui/      # Frontend service
    ├── Dockerfile
    ├── nginx.conf
    ├── src/
    └── package.json
```

## 🤝 Support

### Getting Help
1. Check the logs: `docker-compose logs`
2. Verify API keys in `.env` file
3. Ensure Docker is running: `docker --version`
4. Check port availability: `netstat -tulpn | grep :80`

### Useful Commands
```bash
# Quick status check
docker-compose ps

# Restart all services
docker-compose restart

# Update and restart
docker-compose pull && docker-compose up -d

# Clean up
docker-compose down -v
docker system prune -f
```

## 🎉 Success!

Once everything is running, you should see:
- ✅ Frontend accessible at http://localhost
- ✅ Backend API at http://localhost:3000
- ✅ Health checks passing
- ✅ Restaurant recommendations working

**Enjoy your containerized HealthKare Restaurant Finder!** 🍽️✨
