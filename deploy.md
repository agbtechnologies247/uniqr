UNIQR Production Deployment Plan

Target Environment: Production VPS

Deployment Objectives

Deploy the UNIQR Production Platform safely on the existing VPS without affecting any existing applications.

This deployment should:

Never modify existing projects
Never overwrite existing Docker containers
Never modify existing Nginx configurations
Never change existing SSL certificates
Never interfere with existing services
Be completely isolated inside its own directory
Infrastructure
VPS
IP Address
82.29.164.106

SSH Access

Already configured.

Domain
uniqr.agbtechnologies.in

DNS

Already points to VPS.

Git Repository
https://github.com/agbtechnologies247/uniqr

Production Branch

main
Deployment Philosophy

Everything related to UNIQR lives in one isolated directory.

Never touch

/var/www

/opt

/home/*/other-projects

existing docker compose files

existing nginx sites

existing applications

Instead create

/opt/uniqr

Everything belongs inside this folder.

Folder Structure
/opt

└── uniqr
    │
    ├── app/
    ├── backend/
    ├── nginx/
    ├── docker/
    ├── logs/
    ├── backups/
    ├── storage/
    ├── uploads/
    ├── ssl/
    ├── scripts/
    ├── monitoring/
    ├── configs/
    ├── releases/
    └── .env

No files should exist outside this hierarchy except the Nginx site configuration and optional systemd service if used.

Repository Layout
uniqr/

frontend/

backend/

docker/

nginx/

scripts/

docs/

Cargo.toml

docker-compose.prod.yml

README.md
Deployment Workflow
GitHub

↓

git clone

↓

Build Containers

↓

Start Services

↓

Health Check

↓

Nginx

↓

SSL

↓

Production
Services
Frontend

React PWA

Port

3000
Backend

Rust API

Port

8080
Neo4j

Bolt

7687

HTTP

7474

Should remain internal and not be exposed publicly.

Redis

Port

6379

Internal only.

MinIO

API

9000

Console

9001

Internal only (or restricted to trusted IPs/VPN).

Docker Network

Dedicated bridge network:

uniqr-network

No container should join existing application networks unless intentionally required.

Docker Compose Services
frontend

backend

neo4j

redis

minio

nginx (optional)
Environment Variables

Keep production secrets in:

/opt/uniqr/.env

Never commit secrets to Git.

Variables include:

JWT secrets
Neo4j credentials
Redis configuration
MinIO keys
SMTP credentials
Payment gateway keys
Analytics configuration
Git Deployment

Initial deployment:

git clone https://github.com/agbtechnologies247/uniqr

Future updates:

git pull origin main

Then rebuild only affected services.

Build Pipeline
Pull

↓

Install Dependencies

↓

Build React

↓

Build Rust

↓

Build Docker Images

↓

Start Containers

↓

Health Check

↓

Reload Nginx
Nginx Configuration

Create a dedicated site configuration for:

uniqr.agbtechnologies.in

Responsibilities:

Reverse proxy to the frontend.
Proxy /api to the Rust backend.
Serve PWA assets with appropriate cache headers.
Enable gzip/Brotli.
Support WebSockets if introduced later.
Add common security headers (HSTS, X-Frame-Options, etc.).

Do not modify existing virtual hosts.

SSL

Use Let's Encrypt for:

uniqr.agbtechnologies.in

Automatic renewal should be enabled.

Storage

Persistent volumes:

Neo4j Data

Redis

MinIO

Logs

Uploads

Backups

Containers should remain stateless where possible.

Backup Strategy

Daily backups:

Neo4j database
Uploaded files
MinIO bucket
Environment file (encrypted)
Configuration files

Suggested retention:

Daily: 7 days
Weekly: 4 weeks
Monthly: 12 months
Logging

Store logs under:

/opt/uniqr/logs

Include:

API logs
Nginx access/error logs
Worker logs
Audit logs

Implement log rotation to avoid disk growth.

Monitoring

Monitor:

CPU
RAM
Disk usage
Container health
Rust API health
Neo4j status
Redis status
SSL certificate expiry

Expose a simple /health endpoint for readiness/liveness checks.

Security
SSH key authentication only.
Disable root SSH login (if not already).
Restrict firewall to required ports (80/443 and SSH).
Keep Neo4j, Redis, and MinIO inaccessible from the public internet.
Run containers as non-root users where practical.
Store secrets outside the repository.
Apply rate limiting on public endpoints.
Release Strategy

Use timestamped releases:

releases/

2026-08-02/

2026-08-15/

2026-09-01/

Maintain a current symlink to simplify rollbacks.

Rollback

If a deployment fails:

Stop updated services.
Point current back to the previous release.
Restart services.
Verify health checks.

This enables quick recovery without affecting other applications.

CI/CD (Future)

Recommended GitHub Actions workflow:

Push to main

↓

Run Tests

↓

Build Rust

↓

Build React

↓

Create Docker Images

↓

Deploy to VPS

↓

Run Database Migrations

↓

Health Checks

↓

Success Notification
Production Readiness Checklist
Infrastructure
 SSH access verified.
 /opt/uniqr created.
 Existing VPS projects confirmed untouched.
Source
 Repository cloned.
 Production branch checked out.
 .env created from template.
Containers
 Rust API running.
 React PWA running.
 Neo4j healthy.
 Redis healthy.
 MinIO healthy.
Networking
 Dedicated Docker network created.
 Internal ports not publicly exposed.
Web
 Nginx site enabled.
 HTTPS active.
 HTTP → HTTPS redirect working.
 PWA manifest served correctly.
 Service worker registered.
Verification
 https://uniqr.agbtechnologies.in loads successfully.
 https://uniqr.agbtechnologies.in/app launches the PWA.
 API endpoints respond correctly.
 QR generation works.
 Neo4j persists data after container restart.
 File downloads function correctly.
 Logs and backups verified.
Final Deployment Principle

The deployment must be fully self-contained. Every UNIQR component—including application code, containers, configuration, storage, logs, and backups—should live under /opt/uniqr (with only the necessary Nginx site configuration and SSL integration outside that directory). This guarantees that UNIQR can be upgraded, rolled back, or even removed without impacting any other applications currently hosted on the VPS.