# UNIQR – Universal Product QR Platform

### Complete Product & Technical Project Plan (Version 1.0)

---

# 1. Project Overview

**UNIQR** is a cloud-based Progressive Web Application (PWA) that allows businesses to generate globally unique QR codes for physical products.

Each QR acts as a universal identity for a product and becomes a connector between multiple AGB applications.

Instead of being just an image, every QR represents a permanent digital identity.

Example

```
Product
      │
      ▼
Universal QR
      │
      ▼
UNIQR Cloud
      │
      ├── Inventory
      ├── Warranty
      ├── Invoice
      ├── CRM
      ├── Manufacturing
      ├── Product Manual
      ├── Service History
      ├── AI Assistant
      ├── Marketplace
      └── Future Apps
```

---

# 2. Vision

Create one universal QR ecosystem that can be connected to every AGB product without regenerating QR codes.

A QR generated today should still work years later regardless of which application uses it.

---

# 3. Primary Website

```
https://uniqr.agbtechnologies.in
```

Purpose

Marketing website

Pricing

Documentation

About

API

Developer docs

Downloads

Login

Register

PWA install

---

# 4. Application URL

```
https://uniqr.agbtechnologies.in/app
```

Purpose

Actual application

Dashboard

QR Management

Downloads

Analytics

Subscription

Settings

API Keys

---

# 5. User Journey

```
Visit Website

↓

Create Account

↓

Verify Email

↓

Dashboard

↓

Add Product

↓

Generate QR

↓

Download QR

↓

Print

↓

Attach to Product

↓

Track Usage

↓

Connect to Other Apps
```

---

# 6. Core Features

## Product Management

User can create

Product Name

SKU

Product Code

Brand

Manufacturer

Description

Category

HSN

GST

Batch Number

Serial Number

Manufacturing Date

Expiry

Warranty

Custom Fields

Images

Tags

Location

Supplier

Status

---

## QR Generation

Every product gets

```
UNIQR-000000001
```

or

```
UQ-8AF92B7A2
```

Unique forever.

Never reused.

---

# 7. QR Styles

Generate multiple QR styles

Classic Square

Rounded Square

Rounded Modules

Circular Dots

Soft Rounded

Minimal

High Contrast

Dark Mode

Light Mode

Logo in Center

Brand Color

Gradient

Transparent Background

Custom Border

Custom Padding

---

# 8. Download Sizes

Support

```
256 px

512 px

1024 px

2048 px

4096 px

8192 px
```

Custom Size

```
100x100

250x250

500x500

1000x1000

5000x5000

10000x10000
```

---

# 9. Download Formats

Raster

PNG

JPG

JPEG

WEBP

BMP

TIFF

PDF

---

Vector

SVG

EPS

AI (planned)

DXF

PDF Vector

---

Manufacturing

DXF

Gerber (future)

Laser Cutting

Plotter

CNC

---

Printing

CMYK PDF

Print Ready PDF

Sticker Sheet

Label Sheet

Bulk ZIP

---

# 10. QR Metadata

Every QR stores

```
Unique ID

Owner

Company

Created Date

Version

Hash

Checksum

Linked Apps

Public URL

Status

Security Token
```

---

# 11. Public QR Page

Scanning QR opens

```
uniqr.agbtechnologies.in/q/UQ89F92829
```

Shows

Product Name

Image

Manufacturer

Description

Warranty

Manual

Certificates

Support

Downloads

Connected Applications

Owner Verification

---

# 12. Connected Apps

UNIQR becomes identity provider.

Future integrations

GymKeys

BillSoft

PRICE

Travel Platform

Inventory

Manufacturing ERP

Warehouse

CRM

Warranty

Asset Tracking

School ERP

Hospital ERP

IoT

---

# 13. API Platform

REST API

GraphQL

Webhook

SDK

Node

Python

PHP

Java

Flutter

React

---

Authentication

JWT

OAuth

API Keys

Rate Limits

---

# 14. Subscription Plans

## Free

₹0

10 Lifetime QR Codes

Basic Downloads

PNG

SVG

Public URL

---

## Starter

₹99/month

50 QR Daily

Unlimited Product Records

PNG

SVG

JPG

DXF

Analytics

Priority Processing

Email Support

---

## Business

₹399/month

500 QR Daily

Everything Included

Bulk Generator

API Access

Custom Branding

Priority Queue

Advanced Analytics

CSV Import

Export

---

Enterprise

Custom Pricing

Unlimited

Dedicated VPS

White Label

Custom Domain

Private API

Dedicated Support

---

# 15. Membership Flow

After generating 10 QR

Popup

```
You have reached your free limit.

Upgrade your membership
to continue generating QR codes.

[Upgrade Now]
```

Payment

UPI

Cards

NetBanking

Wallet

Subscriptions

Auto Renewal

---

# 16. QR Analytics

Track

Generated

Downloaded

Scanned

Country

City

Device

Browser

OS

Time

Referral

Application Source

Repeat Scans

---

Charts

Daily

Weekly

Monthly

Yearly

Heatmap

---

# 17. Bulk Operations

CSV Import

Excel Import

Generate Hundreds of QR

ZIP Download

Bulk Delete

Bulk Export

Bulk Update

---

# 18. Mobile PWA

Offline Support

Install Button

Push Notifications

Background Sync

Camera Scanner

QR Preview

Share

Native Feel

Dark Theme

Landscape

Tablet Mode

---

# 19. Security

HTTPS

JWT

Encrypted Tokens

Signed URLs

Rate Limiting

Cloudflare

Audit Logs

API Logs

Session Tracking

2FA

Email Verification

Device Management

---

# 20. Administration Portal

Manage Users

Subscriptions

Payments

Coupons

Products

Generated QR

Reports

API Usage

Announcements

Support Tickets

Feature Flags

System Health

Audit Logs

---

# 21. Database Design

Core Tables

```
users

companies

products

qr_codes

qr_downloads

qr_scans

subscriptions

payments

plans

api_keys

organizations

device_sessions

audit_logs

notifications

connected_apps

exports

bulk_jobs

webhooks
```

---

# 22. QR Storage

Original Vector

SVG

PNG Cache

Thumbnail

Metadata

Download History

Checksum

Version

Backup

---

# 23. Notifications

Email

Push

SMS (Future)

Webhook

WhatsApp (Future)

---

# 24. Future AI Features

AI Product Description

AI Category Detection

Duplicate Product Detection

Image Recognition

Smart QR Suggestions

Auto Tagging

AI Analytics

---

# 25. Recommended Technology Stack

### Frontend

* **React 19 + TypeScript**
* **Vite**
* **Progressive Web App (PWA)**
* **Tailwind CSS 4**
* **shadcn/ui**
* **Motion** (for animations)
* **React Query**
* **React Hook Form**
* **Zod**

### Backend

* **Node.js 22 LTS**
* **NestJS** (preferred for modular architecture)
* **Prisma ORM**
* **PostgreSQL**
* **Redis** (caching, rate limits, queues)
* **BullMQ** (background jobs)

### QR Processing

* QR generation library with SVG and raster output
* **Sharp** for image conversion
* **PDFKit** for printable sheets
* **DXF generation** library for CAD-compatible exports

### Infrastructure

* Docker
* Nginx
* PM2 (or Docker Compose)
* Private VPS
* Object storage (MinIO or S3-compatible) for generated assets
* Daily encrypted backups

---

# 26. Suggested Folder Structure

```
uniqr/

├── apps/
│   ├── website/
│   ├── dashboard/
│   ├── admin/
│   └── api/
│
├── packages/
│   ├── ui/
│   ├── qr-engine/
│   ├── auth/
│   ├── billing/
│   ├── analytics/
│   ├── connectors/
│   ├── storage/
│   └── shared/
│
├── services/
│   ├── image-renderer/
│   ├── export-worker/
│   ├── notification-service/
│   ├── scan-tracker/
│   └── webhook-service/
│
├── infrastructure/
│   ├── docker/
│   ├── nginx/
│   ├── monitoring/
│   └── backups/
│
└── docs/
```

---

# 27. Monetization

* Free tier with 10 lifetime QR codes
* ₹99/month: 50 QR codes per day
* ₹399/month: 500 QR codes per day
* Enterprise licensing
* White-label deployments
* API usage plans
* Custom QR branding services
* Bulk manufacturing integrations

---

# 28. Long-Term Roadmap

**Phase 1**

* PWA application
* Product management
* QR generation
* Downloads
* Membership system

**Phase 2**

* Bulk imports and exports
* API platform
* Webhooks
* Analytics
* Public product pages

**Phase 3**

* Universal connector framework
* Third-party integrations
* Mobile scanner enhancements
* AI-powered product enrichment
* White-label enterprise deployments

## Expected Outcome

UNIQR becomes the **central identity layer** for products across the AGB Technologies ecosystem. Every generated QR code serves as a permanent, globally unique identifier that can seamlessly connect inventory, billing, warranty, CRM, manufacturing, service history, and future applications through a single scan. The platform is designed to scale from individual users on the free plan to enterprise customers requiring branded deployments and high-volume API-driven QR generation.


I would recommend building **UNIQR as a high-performance distributed platform** rather than a traditional CRUD web application. Since you've already been moving toward a Rust-first architecture for your other products, using **Rust + Neo4j** makes UNIQR a strong foundation for an ecosystem-wide identity service.

---

# UNIQR Next Generation Architecture

```
                    Cloudflare
                         │
                    Nginx Reverse Proxy
                         │
        ┌────────────────┼────────────────┐
        │                │                │
        ▼                ▼                ▼
 Website (React)    PWA Dashboard    Admin Portal
                         │
                    REST / GraphQL
                         │
                 Rust API Gateway
                         │
 ┌───────────────┬──────────────┬───────────────┐
 │               │              │               │
 ▼               ▼              ▼               ▼
Auth Engine   QR Engine   Product Engine   Subscription Engine
 │               │              │               │
 └───────────────┴──────────────┴───────────────┘
                         │
                Event Bus (Redis/NATS)
                         │
        ┌────────────────┼────────────────┐
        ▼                ▼                ▼
 Neo4j Graph DB     Object Storage     Redis Cache
        │
        ▼
 Connected Applications
```

---

# Why Rust?

UNIQR will eventually generate millions of QR codes and serve thousands of scans every minute.

Rust provides:

* Near C/C++ performance
* Memory safety
* No garbage collection pauses
* Excellent concurrency
* Low VPS resource usage
* High throughput for QR generation
* Easy deployment as a single binary

It also aligns well with your broader platform strategy around performance-critical services.

---

# Why Neo4j Instead of PostgreSQL?

Most QR systems store simple rows like:

```
QR

↓

Product

↓

Owner
```

But UNIQR is intended to become an ecosystem connector.

Every QR can connect to:

* Product
* Manufacturer
* Customer
* Warranty
* Invoice
* Inventory
* BillSoft
* GymKeys
* PRICE
* AI agents
* Service records
* Manufacturing batches

That is naturally a graph.

Example:

```
(QR)

│

├────────────► Product

│

├────────────► Invoice

│

├────────────► Customer

│

├────────────► Warehouse

│

├────────────► Manufacturer

│

├────────────► Warranty

│

├────────────► BillSoft

│

├────────────► GymKeys

│

└────────────► AI Knowledge Graph
```

Neo4j excels at traversing these relationships efficiently.

---

# Suggested Rust Workspace

```
uniqr-engine/

├── Cargo.toml
│
├── apps/
│   ├── api-server/
│   ├── worker/
│   ├── scheduler/
│   ├── migration/
│   └── cli/
│
├── crates/
│   ├── auth/
│   ├── qr/
│   ├── product/
│   ├── subscription/
│   ├── billing/
│   ├── analytics/
│   ├── graph/
│   ├── search/
│   ├── storage/
│   ├── connector/
│   ├── websocket/
│   ├── notifications/
│   ├── audit/
│   ├── cache/
│   ├── config/
│   ├── common/
│   ├── security/
│   └── sdk/
│
├── infrastructure/
│   ├── docker/
│   ├── nginx/
│   └── monitoring/
│
└── docs/
```

---

# QR Engine

Responsibilities include:

* Generate UUIDs
* Generate QR matrices
* Create SVG
* Create PNG
* Create JPG
* Create WebP
* Create DXF
* Create PDF labels
* Apply logos
* Round corners
* Custom colors
* Batch generation
* Export ZIP archives

This engine should be stateless so multiple instances can run in parallel.

---

# Product Engine

Responsibilities:

* Product CRUD
* Version history
* SKU generation
* Manufacturer details
* Metadata
* Validation
* Import/Export

---

# Graph Engine

This is the key differentiator.

Example node types:

```
Company

Product

QR

Customer

Invoice

Warranty

Warehouse

Supplier

Batch

Asset

Location

Employee

Service

Application
```

Relationships:

```
OWNS

GENERATED

SCANNED

MANUFACTURED_BY

BELONGS_TO

CONNECTED_TO

HAS_BATCH

LOCATED_AT

PURCHASED_BY

REGISTERED_TO

LINKED_WITH
```

---

# Example Graph

```
Company

│

OWNS

│

Product

│

HAS

│

QR

│

CONNECTED_TO

│

BillSoft Invoice

│

PURCHASED_BY

│

Customer

│

HAS

│

Warranty

│

HAS

│

Service Record
```

Neo4j can retrieve these connected records with a single traversal.

---

# QR Generation Pipeline

```
Create Product

↓

Generate UUID

↓

Create Neo4j Node

↓

Generate QR Matrix

↓

Render Formats

↓

Store Files

↓

Create Public Link

↓

Emit Event

↓

Analytics
```

---

# Background Workers

Separate Rust workers can handle:

* PNG rendering
* SVG optimization
* PDF creation
* DXF conversion
* Email notifications
* Analytics aggregation
* Scheduled cleanup
* Backup jobs

---

# Recommended Rust Libraries

### Web Framework

* Axum

### Async Runtime

* Tokio

### Serialization

* Serde

### Configuration

* Config

### Environment

* dotenvy

### Logging

* tracing
* tracing-subscriber

### Authentication

* jsonwebtoken
* argon2

### Validation

* validator

### QR Generation

* qrcode
* image

### Image Processing

* image
* resvg
* tiny-skia

### Object Storage

* aws-sdk-s3 (compatible with MinIO)

### Neo4j

* neo4rs

### Redis

* redis

### Background Jobs

* Tokio tasks or NATS-based workers

### Metrics

* Prometheus
* OpenTelemetry

---

# Neo4j Schema

## Nodes

```
Company

User

Subscription

Plan

Product

QR

Download

Scan

Invoice

Warranty

Manufacturer

Supplier

Customer

Application

APIKey

Device
```

---

## Relationships

```
(User)-[:OWNS]->(Company)

(Company)-[:CREATED]->(Product)

(Product)-[:HAS_QR]->(QR)

(QR)-[:SCANNED]->(Device)

(Product)-[:HAS_WARRANTY]->(Warranty)

(Product)-[:PURCHASED_BY]->(Customer)

(Product)-[:CONNECTED_TO]->(Application)

(Product)-[:GENERATED_BY]->(User)

(QR)-[:DOWNLOADED_AS]->(Download)

(User)-[:SUBSCRIBED_TO]->(Plan)
```

---

# Future Ecosystem

UNIQR becomes the identity service for all AGB applications.

```
                 UNIQR Identity Graph

                        │

     ┌──────────────────┼──────────────────┐

     ▼                  ▼                  ▼

 BillSoft          GymKeys            PRICE

     │                  │                  │

     └──────────────────┼──────────────────┘

                        ▼

                 Universal Product

                        │

                        ▼

                    Universal QR

                        │

                        ▼

                  Neo4j Knowledge Graph
```

Instead of every application maintaining its own product identifiers, they all reference the **same UNIQR identity**, enabling cross-application relationships, shared analytics, and a unified digital history for every product. This architecture positions UNIQR as a reusable core platform service rather than just a QR code generator, making it a foundational component of the entire AGB Technologies ecosystem.


Absolutely. I would actually design **UNIQR as a Mobile-First PWA**, with the desktop experience being an extension of the mobile interface—not the other way around. Since users will often be generating, downloading, printing, and scanning QR codes from their phones, the UX should feel like a native Android/iOS application.

---

# UNIQR Platform Architecture

```
uniqr.agbtechnologies.in
│
├── Public Website
│
├── /pricing
├── /docs
├── /download
├── /about
├── /contact
│
└── /app
      │
      ▼
 Progressive Web Application (PWA)
```

---

# Technology Stack

## Frontend

* React 19
* TypeScript
* Vite
* Tailwind CSS 4
* shadcn/ui
* Motion
* React Router
* TanStack Query
* React Hook Form
* Zod
* PWA (Workbox)

---

## Backend

* Rust
* Axum
* Tokio
* Neo4j
* Redis
* Object Storage (MinIO)
* JWT Authentication

---

## Hosting

```
Private VPS

↓

Docker

↓

Nginx

↓

Rust API

↓

Neo4j

↓

Redis

↓

MinIO
```

---

# Mobile-First Design

The application should be designed around a **390px-wide mobile viewport first**, then progressively enhance for tablets and desktops.

Target devices:

* Android phones
* iPhones
* Tablets
* Desktop browsers

---

# Native App Feel

The PWA should provide:

* Full-screen mode
* Splash screen
* Install prompt
* Offline support
* Native transitions
* Push notifications
* Background sync
* App shortcuts
* Home screen icon
* Camera access
* File sharing
* Share Target API
* Web Share API

Users should be able to install it directly from:

```
uniqr.agbtechnologies.in/app
```

without going through the Play Store.

---

# Bottom Navigation

The mobile interface should use a persistent bottom navigation bar with five primary sections:

```
🏠
Home

📦
Products

➕

Generate

📷
Scanner

👤
Account
```

This keeps the most common actions within thumb reach.

---

# Home Dashboard

The landing dashboard can include:

* Greeting
* QR codes generated today
* Remaining daily quota
* Subscription status
* Recent products
* Recent downloads
* Recent scans
* Quick actions

Quick action cards:

* Generate QR
* Scan QR
* Add Product
* Bulk Upload
* Download History
* Analytics

---

# Generate QR Flow

A simplified flow:

```
Product Name

↓

Category

↓

SKU

↓

Generate

↓

Preview

↓

Download
```

No unnecessary screens or complexity.

---

# Product Card

Each product card should display:

* Product image
* Product name
* SKU
* QR preview
* Last updated
* Status
* Download button
* Share button
* More options

---

# QR Preview Screen

The preview should support:

* Pinch-to-zoom
* Dark mode preview
* Light mode preview
* Rounded modules
* Square modules
* Logo preview
* Color picker
* Background transparency

---

# Download Screen

Users can choose:

### Format

* PNG
* JPG
* SVG
* PDF
* DXF
* WebP

### Size

* Small
* Medium
* Large
* Print
* Custom

### Style

* Square
* Rounded
* Circular
* Custom colors

Downloads can be saved directly to the device or shared using the native share sheet.

---

# QR Scanner

Built-in camera scanner for:

* UNIQR codes
* Standard QR codes
* Product lookup
* Ownership verification
* Connected application links

Future enhancements could include barcode support for UPC, EAN, and Code128.

---

# Offline Capability

When offline, users can:

* View previously generated QR codes
* Browse products
* Access download history
* Queue new product entries for synchronization when connectivity returns

---

# Tablet Layout

On tablets, the UI can expand to two panes:

* Left: Product list
* Right: QR preview and details

This improves productivity without changing the interaction model.

---

# Desktop Layout

Desktop users benefit from:

* Multi-column dashboards
* Drag-and-drop CSV import
* Bulk QR generation
* Large analytics charts
* Side navigation
* Keyboard shortcuts

The functionality remains consistent with the mobile app.

---

# Theme

A clean, minimal design inspired by **Frappe** with subtle influences from **Linear**, **Notion**, and **Stripe**:

* Rounded corners (12–16px)
* Soft shadows
* Spacious layouts
* Smooth animations
* Minimal borders
* Responsive cards
* Glass accents where appropriate

Dark mode should be available from day one.

---

# Performance Goals

* Initial page load under 2 seconds
* Lighthouse PWA score above 95
* Lighthouse Performance above 95
* Lighthouse Accessibility above 95
* Lighthouse Best Practices above 95
* API response times below 100ms for common operations
* QR generation under 50ms per code
* Installable PWA with offline support

---

## Suggested Future Features

To make UNIQR stand out beyond basic QR generators, I'd include these capabilities in the roadmap:

* **Bulk QR generation** from CSV or Excel files.
* **Batch printing** with Avery and custom label templates.
* **White-label branding** for business customers.
* **Organization workspaces** with role-based access (Owner, Admin, Staff).
* **Public verification pages** for authenticity and anti-counterfeit use cases.
* **Developer API** for automatic QR creation from ERP, CRM, or manufacturing systems.
* **Universal Connector Framework**, allowing every QR to act as the shared identity across products like BillSoft, GymKeys, PRICE, and future AGB applications.

This approach turns UNIQR into a **mobile-first identity platform** rather than simply a QR code generator, while keeping the experience fast, installable, and intuitive on phones, tablets, and desktops.
