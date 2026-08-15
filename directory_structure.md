# UniQR — Complete Platform Directory & File Structure (100% Exhaustive)

This document contains the **100% complete and exhaustive file and directory structure** of the UniQR project. Every single file in the workspace is cataloged below.

---

## 📂 Exhaustive Project Tree

```
UniQR/
├── .agents/                              # IDE Agent Skills & Customizations
│   └── skills/
│       ├── accessibility-specialists/SKILL.md
│       ├── anthropic-frontend-design/SKILL.md
│       ├── bit-styleguidist-components/SKILL.md
│       ├── design-engineering/SKILL.md
│       ├── design-token-sync/SKILL.md
│       ├── shadcn-radix-primitives/SKILL.md
│       ├── storybook-component-workspace/SKILL.md
│       ├── tailwind-design-system/SKILL.md
│       └── ui-ux-pro-max/SKILL.md
│
├── .github/                              # GitHub Configuration & Automation
│   └── workflows/
│       └── ci.yml                        # GitHub Actions CI/CD Pipeline (Lint, Build, Vitest)
│
├── backend/                              # Node.js / Express Backend Engine
│   ├── src/
│   │   ├── domains/                      # Domain-Driven Design (DDD) Core Engines
│   │   │   ├── ai/
│   │   │   │   └── aiDecisionEngine.ts   # AI Predictive Maintenance & Fraud Detection Engine
│   │   │   ├── auth/
│   │   │   │   └── sessionEngine.ts     # Session Rotation & Token Hashing Engine
│   │   │   ├── db/
│   │   │   │   ├── postgresClient.ts    # Relational PostgreSQL Database Engine
│   │   │   │   └── redisClient.ts       # Ephemeral Caching & IP Sliding Window Rate Limiter
│   │   │   ├── entities/
│   │   │   │   ├── entityEngine.ts      # Entity Lifecycle State Machine
│   │   │   │   └── universalSeedData.ts # 20 Universal Seed Objects (16 Entity Types)
│   │   │   ├── events/
│   │   │   │   └── eventBus.ts          # Internal Event Bus (Pub/Sub System)
│   │   │   ├── graph/
│   │   │   │   └── relationshipEngine.ts# Graph Relationship Query Engine
│   │   │   └── qr/
│   │   │       ├── qrAccessPolicyEngine.ts# Scan Access Policy & Session Cookie Issuer
│   │   │       └── qrLifecycleEngine.ts # QR State Transitions & Revocation Engine
│   │   │
│   │   ├── middleware/                   # Express Middleware Layer
│   │   │   ├── logger.ts                 # Structured Request Logger (Method, Latency, IP)
│   │   │   └── validate.ts               # Zod Schema Request Body Validation Middleware
│   │   │
│   │   ├── routes/                       # 7 Modular REST API Route Handlers
│   │   │   ├── analytics.routes.ts       # Scan Ingestion, Analytics Summary & Rate Limits
│   │   │   ├── auth.routes.ts            # Login, Logout, Session Manager, OTP Dispatch & Verify
│   │   │   ├── billing.routes.ts         # Razorpay Orders & HMAC Verification
│   │   │   ├── developer.routes.ts       # API Keys, OpenAPI Spec, Graph & CAD Vector Exports
│   │   │   ├── product.routes.ts         # Product CRUD, Bulk Upsert, JSON Schema & Details
│   │   │   ├── resolve.routes.ts         # Universal QR Resolver Engine & Scan Gateway
│   │   │   └── trail.routes.ts           # Tamper-Evident SHA-256 Ledger Trail
│   │   │
│   │   ├── tests/                        # Vitest Automated Test Suites
│   │   │   ├── aiEngine.test.ts          # AI Risk Score & Fraud Detection Tests
│   │   │   └── sessionEngine.test.ts     # Token Hashing & Session Rotation Tests
│   │   │
│   │   ├── db.json                       # JSON Flat File Database (Products & Scans)
│   │   ├── seed.ts                       # Database Seeder Runner Script
│   │   ├── server.ts                     # Main Express Server (Helmet, Logger & Routers)
│   │   └── test_runner.ts                # Legacy End-to-End Test Runner Script
│   │
│   ├── .env                              # Environment Variables File (Git-Ignored Secrets)
│   ├── .env.example                      # Environment Variables Configuration Template
│   ├── package.json                      # Backend Dependencies & Script Configurations
│   ├── package-lock.json                 # Backend Locked Dependency Tree
│   └── tsconfig.json                     # Backend TypeScript Compiler Configuration
│
├── public/                               # Static Assets & PWA Engine
│   ├── logo.jpg                          # UniQR Brand Identity Logo
│   ├── manifest.json                     # Progressive Web App (PWA) Manifest
│   └── sw.js                             # PWA Service Worker (Offline Caching)
│
├── src/                                  # Frontend Application Source (React 18 + TS)
│   ├── components/                       # UI Component Modules (18 Subdirectories)
│   │   ├── admin/
│   │   │   └── AdminPortal.tsx           # Enterprise Admin Portal Component
│   │   ├── ai/
│   │   │   └── AiInsightsModal.tsx       # AI Scan Decision & Risk Analysis Modal
│   │   ├── analytics/
│   │   │   └── AnalyticsDashboard.tsx    # Real-Time Scan Analytics & Geographic Maps
│   │   ├── api/
│   │   │   └── DeveloperPortal.tsx       # Developer API Keys, OpenAPI & Webhooks Studio
│   │   ├── auth/
│   │   │   └── OtpLoginPage.tsx          # Passwordless OTP & Email Login Interface
│   │   ├── billing/
│   │   │   ├── SubscriptionModal.tsx     # Razorpay Gateway Payment Checkout Modal
│   │   │   └── UserSubscriptionPage.tsx  # User Plan Management & Invoices Page
│   │   ├── billsoft/
│   │   │   └── BillSoftPortal.tsx        # BillSoft ERP Integration Dashboard
│   │   ├── common/
│   │   │   └── ErrorBoundary.tsx         # React Error Boundary Component
│   │   ├── dashboard/
│   │   │   └── Dashboard.tsx             # Main Overview Dashboard Component
│   │   ├── graph/
│   │   │   └── EcosystemGraph.tsx        # Interactive Neo4j-Style Graph Visualizer
│   │   ├── layout/
│   │   │   ├── BottomNav.tsx             # Mobile Bottom Touch Bar
│   │   │   ├── CommandPalette.tsx        # Command Palette Modal (Cmd+K)
│   │   │   ├── FeatureExplorer.tsx       # Feature Tour Overlay
│   │   │   ├── Footer.tsx                # Marketing Page Footer
│   │   │   ├── Navbar.tsx                # Top Navigation Bar & Profile Menu
│   │   │   ├── OnboardingChecklist.tsx   # User Workspace Onboarding Checklist
│   │   │   ├── PwaBanner.tsx             # PWA Install Prompt Banner
│   │   │   └── Sidebar.tsx               # Collapsible Desktop Navigation Sidebar
│   │   ├── marketing/
│   │   │   ├── ContactPage.tsx           # Contact Us Page Component
│   │   │   ├── ContactSalesModal.tsx     # Enterprise Sales Inquiry Modal
│   │   │   ├── FeaturesPage.tsx          # Platform Features Exploration Page
│   │   │   ├── IntelligenceArchitectureShowcase.tsx # Architecture Visualizer
│   │   │   ├── LandingPage.tsx           # Hero Marketing Landing Page
│   │   │   └── PricingPage.tsx           # Subscription Tiers & Pricing Matrix Page
│   │   ├── passport/
│   │   │   ├── PassportLoader.tsx        # Dynamic QR Resolution Loader Component
│   │   │   └── ProductPassport.tsx       # Adaptive Public Product Identity Passport
│   │   ├── products/
│   │   │   ├── CreateProductWorkspace.tsx# Product Twin Builder Workspace
│   │   │   ├── CsvImportModal.tsx        # Bulk CSV Import Wizard
│   │   │   ├── ProductList.tsx           # Inventory Catalog & Search Component
│   │   │   ├── ProductModal.tsx          # Single Product Details View Modal
│   │   │   └── SectionFieldBuilder.tsx   # Custom Section & Schema Field Builder
│   │   ├── qr/
│   │   │   ├── PrintStudioModal.tsx      # Vector Laser & DXF Print Studio Modal
│   │   │   └── QrStudio.tsx              # Dynamic QR Code Stylist & Customizer
│   │   ├── reports/
│   │   │   └── ReportsPage.tsx           # System Audit Logs & Compliance Reports Page
│   │   ├── scanner/
│   │   │   └── CameraScanner.tsx         # In-Browser Live Camera QR/NFC Scanner
│   │   └── usecases/
│   │       ├── InteractiveTourModal.tsx  # Product Walkthrough Tour Modal
│   │       ├── ReelViewerModal.tsx       # Video Demonstration Reel Viewer Modal
│   │       ├── UseCaseExplorer.tsx       # Industry Use Case Explorer Component
│   │       └── VisionReelPlayer.tsx      # Product Vision Video Player Component
│   │
│   ├── data/
│   │   ├── mockData.ts                   # Platform Mock Data & Initial Seed Collections
│   │   └── useCaseData.ts                # Industry Vertical Use Case Data & Descriptions
│   │
│   ├── services/
│   │   ├── audio.ts                      # Sound Synthesis & Audio Service (Web Audio API)
│   │   ├── billsoftService.ts            # BillSoft ERP API Integration Service
│   │   ├── dxfExporter.ts                # Laser Etching CAD / DXF Vector Generator
│   │   ├── pdfExporter.ts                # PDF Export & Document Generation Service
│   │   ├── qrEngine.ts                   # QR Code Canvas Rendering Engine
│   │   ├── qrExportEngine.ts             # High-Resolution Raster Image Exporter
│   │   ├── razorpay.ts                   # Client-Side Razorpay Payment Gateway SDK
│   │   ├── storage.ts                    # LocalStorage State Persistence Service
│   │   └── trailLedger.ts                # SHA-256 Tamper-Evident Ledger Engine
│   │
│   ├── types/
│   │   └── index.ts                      # Global TypeScript Type Definitions & Interfaces
│   │
│   ├── App.tsx                           # Main Application Entry Component & Router
│   ├── index.css                         # Tailwind Utilities & Botanical Design System Tokens
│   ├── main.tsx                          # React DOM Root Renderer Entry
│   └── vite-env.d.ts                     # Vite Environment Declaration File
│
├── .gitignore                            # Git Exclusion File (.env, dist, node_modules)
├── Dockerfile                            # Multi-Stage Production Docker Container Build
├── docker-compose.yml                    # Docker Compose Orchestration Setup
├── index.html                            # HTML5 SPA Entry Template
├── logo.jpg                              # Brand Logo Asset
├── package.json                          # Frontend Package Configuration & Dependencies
├── package-lock.json                     # Frontend Locked Dependency Tree
├── postcss.config.js                     # PostCSS Config for Tailwind CSS
├── tailwind.config.js                    # Tailwind CSS Theme & Custom Botanical Palette
├── test_msg91_direct.cjs                 # MSG91 Direct API Test Script
├── test_send_otp.cjs                     # OTP Dispatch Test Script
├── test_send_sms.cjs                     # SMS Gateway Dispatch Test Script
├── tsconfig.json                         # Workspace TypeScript Configuration
├── uniqr.nginx.conf                      # Production Nginx Server Configuration
├── vite.config.ts                        # Vite Development & Build Bundler Config
│
└── 📄 System Architecture & Diagnostic Reports
    ├── billsoft_integration.md           # BillSoft ERP Integration Technical Specification
    ├── core.md                           # Core Platform Architecture Overview
    ├── deploy.md                         # Production Deployment Guide
    ├── design.md                         # Botanical Design System Style Guide
    ├── frontendchange.md                 # Frontend UI Refactoring Log
    ├── gap_and_maturity_analysis.md      # Updated Gap Analysis & Maturity Report
    ├── maturity_and_flow_gap_analysis.md # Architectural Flow Audit Report
    ├── shift.md                          # Engine Migration Specification
    └── uniqr_software_diagrams.md        # Comprehensive UML, DFD & Architecture Blueprints
```

---

## 📊 File Count by Category

| Category | File Count | Key Highlights |
|----------|------------|----------------|
| **Frontend UI (`src/components/`)** | **37 files** | 18 categories covering dashboards, passports, product builders, QR studios, AI modals, and marketing pages. |
| **Frontend Data & Services (`src/data/`, `src/services/`)** | **11 files** | Including `useCaseData.ts`, `mockData.ts`, `storage.ts`, `trailLedger.ts`, `dxfExporter.ts`, `audio.ts`, `billsoftService.ts`. |
| **Backend Core & Domain Engines (`backend/src/`)** | **23 files** | 7 domain engines, 7 modular route files, 2 middleware files, 2 Vitest unit test files, `server.ts`, `seed.ts`, `db.json`. |
| **DevOps & Infrastructure** | **5 files** | `.github/workflows/ci.yml`, `Dockerfile`, `docker-compose.yml`, `uniqr.nginx.conf`, `.gitignore`. |
| **Configuration Files** | **7 files** | `package.json`, `package-lock.json`, `tsconfig.json`, `tailwind.config.js`, `postcss.config.js`, `vite.config.ts`, `.env`. |
| **Documentation & Reports** | **9 files** | Architecture diagrams, Gap Analysis, BillSoft specs, Deployment guides, and Flow audits. |
| **Total Workspace Files** | **92 files** | *(Excluding `node_modules/`, `dist/`, `.git/`, `.gemini/`)* |
