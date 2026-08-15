I think this is the right abstraction. The QR code should **not** simply point to a product record—it should represent the **digital identity (Digital Twin)** of that physical item throughout its lifecycle.

## UniQR Architecture

```
                   Physical Product
                         │
                  Laser/Sticker QR
                         │
                  Scan QR Code
                         │
        ┌────────────────┴─────────────────┐
        │                                  │
   Public API                         Internal API
   /details                           /trail
        │                                  │
 Product Information              Supply Chain History
 Marketing Info                   ERP Tasks
 User Manual                      Manufacturing
 Warranty                          QC
 MRP                              Inventory
 Specifications                   Warehouse
 Certifications                   Dispatch
 Images                           Retail
                                   Customer
```

---

# QR Code = Live Product Identifier

Unlike a normal barcode,

**QR = Product Identity**

The QR itself never changes.

Everything behind it changes.

```
QR ID
UNIQR-6A72D18E-2026

↓

Current Product

↓

Current Warranty

↓

Current Owner

↓

Current ERP Status

↓

Current Inventory Location

↓

Current Rental Status

↓

Current Service History
```

This becomes the **single source of truth**.

---

# API 1 — Details API (Public)

Purpose:

Everything the customer is allowed to know.

Example

```
GET

/api/v1/details/{qr}
```

Response

```json
{
  "qr":"UNIQR-6A72D18E",
  "product":"Industrial Water Pump",
  "description":"2HP Stainless Steel Pump",
  "brand":"ABC Industries",
  "category":"Pump",
  "model":"WP-200",
  "serial":"SN2947234",
  "mfg_date":"2026-01-10",
  "expiry":null,
  "warranty":"3 Years",
  "unit":"Nos",
  "mrp":12000,
  "currency":"INR",
  "manual":"...",
  "datasheet":"...",
  "images":[...],
  "certifications":[...]
}
```

Only public information.

No ERP.

No internal IDs.

No supplier details.

---

# API 2 — Trail API (Internal)

Purpose:

Everything that happened to this physical product.

```
GET

/api/v1/trail/{qr}
```

Response

```json
{
  "qr":"UNIQR-6A72D18E",

  "events":[

    {
      "type":"Manufactured",
      "time":"2026-01-10",
      "factory":"Pune Plant"
    },

    {
      "type":"Quality Check",
      "status":"Passed"
    },

    {
      "type":"Packed"
    },

    {
      "type":"Warehouse Entry"
    },

    {
      "type":"Dispatched"
    },

    {
      "type":"Dealer Received"
    },

    {
      "type":"Sold"
    },

    {
      "type":"Warranty Activated"
    }

  ]
}
```

This API is ERP-facing and requires authentication.

---

# Trail as a Blockchain-Style Ledger

The Trail should be **append-only**.

Events are **never updated**.

Only new events are appended.

```
Manufactured

↓

QC Passed

↓

Packed

↓

Warehouse

↓

Shipment

↓

Dealer

↓

Customer

↓

Warranty

↓

Service

↓

Repair

↓

Replacement

↓

Disposed
```

No record should ever be deleted.

This creates a verifiable audit history similar to a blockchain ledger, even if implemented on a conventional database.

Each event should include:

```
Event ID

QR ID

Timestamp

ERP Task

Department

User

Location

Digital Signature

Hash of Previous Event

Hash of Current Event
```

Adding `previous_hash` and `current_hash` creates a tamper-evident chain without requiring a decentralized blockchain.

---

# Every ERP Module Writes to the Trail

Instead of integrating modules directly with each other:

```
Inventory

Warehouse

Manufacturing

Sales

Rental

Warranty

AMC

Service

Returns

Quality

Production

Purchase
```

Each module simply appends an event:

```
Trail.append(
    qr,
    module,
    action,
    metadata
)
```

This produces a complete lifecycle automatically.

---

# Suggested Event Types

| Module        | Example Events                                |
| ------------- | --------------------------------------------- |
| Manufacturing | Product Created, Assembly Completed           |
| BOM           | Component Added, Component Replaced           |
| Quality       | Inspection Started, Passed, Failed            |
| Packaging     | Packed, Label Printed                         |
| Inventory     | Stock In, Stock Out                           |
| Warehouse     | Rack Assigned, Picked                         |
| Logistics     | Loaded, In Transit, Delivered                 |
| Dealer        | Received, Displayed                           |
| Customer      | Sold, Activated                               |
| Warranty      | Registered, Extended, Expired                 |
| Rental        | Issued, Returned                              |
| Service       | Complaint Logged, Engineer Assigned, Repaired |
| Recall        | Recall Issued, Recall Completed               |
| Disposal      | Recycled, Destroyed                           |

---

# Entity Relationships

```
Product
   │
   ├── Details
   │
   ├── Components (BOM)
   │
   ├── Documents
   │
   ├── Warranty
   │
   ├── Images
   │
   ├── Certifications
   │
   └── Trail
           │
           ├── Manufacturing
           ├── Inventory
           ├── Warehouse
           ├── Sales
           ├── Rentals
           ├── Service
           ├── Ownership
           └── Disposal
```

---

# Neo4j Representation

The QR node becomes the central node connecting the entire ecosystem.

```
(:QR)

   │

   ├──[:IDENTIFIES]────────►(:Product)

   ├──[:HAS_BOM]───────────►(:Component)

   ├──[:HAS_EVENT]─────────►(:TrailEvent)

   ├──[:OWNED_BY]──────────►(:Customer)

   ├──[:LOCATED_AT]────────►(:Warehouse)

   ├──[:UNDER_WARRANTY]────►(:Warranty)

   ├──[:RENTED_TO]─────────►(:Rental)

   ├──[:SERVICED_BY]───────►(:Engineer)

   └──[:PRODUCED_IN]───────►(:Factory)
```

This graph makes it easy to answer questions such as:

* Which customers own products containing a recalled component?
* Where are all products from a specific manufacturing batch?
* Which warehouse currently holds a given QR?
* What service history exists for a particular serial number?
* Which supplier's component appears in products with repeated failures?

---

## Long-Term Vision

UniQR should evolve into an **Identity Layer for Physical Assets**, where every QR represents a persistent digital identity rather than a static label. The two APIs naturally separate responsibilities:

* **Details API**: Public, customer-facing product information.
* **Trail API**: Secure, append-only operational history used by ERP systems and authorized users.

This separation keeps customer information simple while allowing the Trail API to become the authoritative lifecycle ledger for manufacturing, logistics, inventory, rentals, warranty, servicing, and eventual disposal. It also provides a clean foundation for integrating Neo4j, analytics, AI agents, and future blockchain anchoring if immutability beyond organizational boundaries is ever required.
