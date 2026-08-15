# BillSoft Universal QR Identity System (UQIS)

### QR + Neo4j Integration Architecture Plan

The QR system should **not** simply generate a QR code for printing. It should become the **digital identity** of every object inside BillSoft.

Every business object (product, customer, invoice, warehouse, rental item, warranty card, service ticket, inventory movement, asset, supplier etc.) should have its own globally unique identity.

Neo4j becomes the relationship engine connecting all of these identities.

---

# Overall Architecture

```
                 BillSoft ERP
                      │
        ┌─────────────┼─────────────┐
        │             │             │
 PostgreSQL      Neo4j Graph      File Storage
 Master Data      Relationships      Images/PDF
        │             │
        └─────────────┼──────────────┘
                      │
            Universal QR Engine
                      │
      Every Object gets Global QR Identity
```

---

# Universal QR Identity

Every entity receives

```
UUID
QR ID
Short Public ID
Private Graph ID
```

Example

```
Product

UUID
550e8400-e29b

Public QR

BS-PROD-00001254

Neo4j Node

Product:1254

```

QR stores

```
https://billsoft.agbtechnologies.com/q/BS-PROD-00001254
```

No database IDs should ever be exposed.

---

# Universal QR Engine Module

```
modules/

qr/

    services/
        qrGenerator.ts
        qrScanner.ts
        qrResolver.ts
        qrSecurity.ts
        qrPrint.ts

    controllers/

    api/

    templates/

    graph/

```

---

# QR Table

```
qr_identity

id
uuid
entity_type
entity_id

public_qr_id

encrypted_token

status

created_at

last_scan

scan_count

```

One table for every QR.

---

# QR Types

| Type           | Example      |
| -------------- | ------------ |
| Product        | BS-PROD-1001 |
| Customer       | BS-CUST-145  |
| Invoice        | BS-INV-4001  |
| Rental Asset   | BS-RENT-900  |
| Warehouse      | BS-WH-01     |
| Stock Batch    | BS-BATCH-44  |
| Warranty       | BS-WAR-33    |
| Service Ticket | BS-SRV-77    |
| Purchase       | BS-PO-88     |
| Supplier       | BS-SUP-55    |
| Employee       | BS-EMP-12    |

Everything becomes QR enabled.

---

# Product Form Integration

Current Product Form

```
Name

Category

SKU

Barcode

Price

GST

Images

Inventory
```

New Fields

```
Generate QR

QR Template

Public URL

Warranty Enabled

Rental Enabled

Track Ownership

Serial Tracking

Batch Tracking

Neo4j Node ID

```

Upon Save

```
Product Created

↓

UUID

↓

Neo4j Node

↓

QR Generated

↓

PDF Label Generated

↓

Inventory Node Created

↓

Warehouse Relationship Created
```

---

# Customer Integration

Customer receives

```
Customer QR

Customer Card

Membership QR

Digital Wallet

```

Scanning customer QR

Shows

```
Purchases

Pending Orders

Rental History

Warranty

AMC

Support Tickets

Invoices

Reward Points

```

Neo4j

```
Customer

    BOUGHT

Product

Customer

    HAS_WARRANTY

Warranty

Customer

    RENTED

Rental

```

---

# Inventory Integration

Every inventory movement creates relationships.

```
Warehouse A

↓

Stock Transfer

↓

Warehouse B

↓

Store

↓

Customer

```

Neo4j

```
Warehouse

HAS_PRODUCT

Inventory

MOVED_TO

Warehouse

```

History never disappears.

---

# Warehouse Mapping

Warehouse node

```
Warehouse

Shelf

Rack

Bin

```

QR on each shelf

Example

```
Scan Shelf

↓

Open Inventory

↓

See Products

↓

Stock Count

↓

Transfer

```

---

# Rental Module

Rental Item QR

```
Bike

Laptop

Projector

Machine

Generator

```

Scan

Shows

```
Current Customer

Rental Period

Deposit

Condition

History

Return Date

Late Fees

```

Neo4j

```
Rental Item

RENTED_TO

Customer

```

---

# Warranty Tracking

Warranty QR

Scan

Shows

```
Purchase Date

Warranty Expiry

Service History

Parts Changed

Invoices

```

Neo4j

```
Customer

OWNS

Product

HAS

Warranty

```

---

# Service Center

Scan Product

↓

Open

```
Repair History

Warranty

Parts

Technician

Invoices

Photos

```

Neo4j

```
Product

SERVICED_AT

Service Center

```

---

# Invoice Integration

Invoice QR

Contains

```
Invoice URL

Payment Status

Customer

Products

```

Customer scans

Downloads invoice.

---

# Batch Tracking

Medicine

Food

Manufacturing

QR opens

```
Batch

Expiry

Manufacturing Date

Supplier

Warehouse

```

Neo4j

```
Supplier

SUPPLIED

Batch

Batch

USED_IN

Invoice

```

---

# Asset Tracking

Office assets

Printer

Laptop

Monitor

Server

Each gets QR.

Scan

```
Assigned Employee

Maintenance

Location

Warranty

Purchase Invoice

```

---

# Supplier Integration

Supplier QR

```
Orders

Products

Invoices

Payments

Deliveries

```

Neo4j

```
Supplier

SUPPLIES

Product

```

---

# QR Scan Flow

```
Mobile

↓

Camera

↓

QR

↓

Resolver API

↓

Public ID

↓

Authentication

↓

Neo4j

↓

Resolve Node

↓

Load PostgreSQL Data

↓

Return Dashboard
```

---

# Neo4j Graph Example

```
(Customer)

     │BOUGHT

(Product)

     │STORED_IN

(Warehouse)

     │TRANSFERRED_TO

(Warehouse)

     │SOLD_IN

(Invoice)

     │HAS

(Warranty)

     │SERVICED

(Service)

```

One scan can traverse the entire lifecycle of an object.

---

# Printing Engine

Support

```
Single QR

Bulk QR

Product Sheets

Shelf Labels

Asset Stickers

Thermal Labels

PDF Export

```

Templates

```
40x20 mm

50x30 mm

80x50 mm

A4 Grid

A5

Custom

```

---

# Security

Each QR includes

```
Encrypted Token

Checksum

Signature

Expiry (optional)

Access Level

```

Public users cannot enumerate products by guessing IDs.

---

# Analytics

Track

```
Who scanned

When

GPS (optional)

Device

Scan Count

Repeated Visits

Failed Scans

```

Useful for customer engagement and operational audits.

---

# APIs

```
POST /api/qr/generate

GET /api/qr/:id

POST /api/qr/scan

POST /api/qr/verify

GET /api/qr/history

POST /api/qr/print

POST /api/qr/bulk

```

---

# Mobile Integration

The BillSoft PWA should support:

* Native camera QR scanning.
* Offline scan queue with background synchronization.
* Instant navigation to the relevant entity (Product, Customer, Invoice, Asset, etc.).
* Warehouse picking mode with continuous scanning.
* Inventory counting mode with discrepancy detection.
* Bluetooth thermal printer support for on-demand label printing.

---

# Recommended Neo4j Relationship Model

Instead of limiting Neo4j to a few relationships, model the complete business graph:

```
Customer
   ├── PURCHASED → Invoice
   ├── OWNS → Product
   ├── RENTED → RentalItem
   ├── HAS_WARRANTY → Warranty
   └── CREATED_SERVICE_REQUEST → ServiceTicket

Product
   ├── BELONGS_TO → Category
   ├── STORED_IN → WarehouseBin
   ├── SUPPLIED_BY → Supplier
   ├── PART_OF_BATCH → Batch
   ├── COVERED_BY → Warranty
   ├── INCLUDED_IN → Invoice
   └── HAS_SERIAL → SerialNumber

Warehouse
   ├── CONTAINS → Inventory
   ├── TRANSFERRED_TO → Warehouse
   └── HAS_BIN → Bin

Invoice
   ├── SOLD_TO → Customer
   ├── CONTAINS → Product
   └── GENERATED_WARRANTY → Warranty
```

This graph enables advanced capabilities such as full product genealogy, customer lifetime analysis, warehouse movement visualization, recall management by batch, fraud detection, predictive maintenance, and AI-powered recommendations.

# Implementation Roadmap

| Sprint       | Deliverables                                                                                                           |
| ------------ | ---------------------------------------------------------------------------------------------------------------------- |
| **Sprint 1** | Universal QR Identity Service, UUID generation, QR generation, resolver APIs, PostgreSQL `qr_identity` table.          |
| **Sprint 2** | Product, Customer, Supplier, Warehouse, and Inventory form integration with automatic QR generation.                   |
| **Sprint 3** | Neo4j graph synchronization service, node creation, and relationship builders for core entities.                       |
| **Sprint 4** | QR scanning in the BillSoft PWA, resolver dashboard, inventory workflows, warehouse picking, and stock transfer.       |
| **Sprint 5** | Warranty, Rental, Service Center, Asset Tracking, Batch Tracking, Invoice QR, and customer self-service portal.        |
| **Sprint 6** | Bulk label printing, analytics dashboards, scan audit logs, AI-powered graph insights, and predictive recommendations. |

This architecture transforms the QR code from a simple label into the **primary digital identity layer** of BillSoft, with PostgreSQL serving as the transactional system of record and Neo4j maintaining the complete relationship graph across customers, products, inventory, rentals, warranties, warehouses, invoices, suppliers, and future AI features. It also provides a scalable foundation for upcoming modules such as IoT asset monitoring, RFID integration, digital twins, and intelligent supply-chain optimization.
