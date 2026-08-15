I actually think UniQR should **not** feel like a traditional ERP form builder. It should feel like **Notion + Airtable + Product Hunt + Canva**, where the QR is always alive on the right side and the editor is on the left.

The QR should be the "hero" of the application.

---

# Overall Layout

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ Navbar                                               Login   Dashboard      │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Details Form                          │      LIVE QR                        │
│                                        │                                     │
│  Product Name                          │          ███████                    │
│  Description                           │          █ QR █                     │
│  Price                                 │          ███████                    │
│  Warranty                              │                                     │
│                                        │   Unique URL                        │
│  + Add Field                           │   uniqr.app/q/ABCD123              │
│                                        │                                     │
│────────────────────────────────────────│─────────────────────────────────────│
│                                        │                                     │
│ Trail Form                             │   Download QR                       │
│                                        │                                     │
│ Factory                                │   PNG                               │
│ QC                                     │   SVG                               │
│ Warehouse                              │   PDF                               │
│ Dispatch                               │   EPS                               │
│ Delivery                               │                                     │
│                                        │   Size                              │
│ + Add Task                             │   128                               │
│                                        │   256                               │
│ + Custom Section                       │   512                               │
│                                        │   1024                              │
│                                        │                                     │
│ Save                                   │   Share                             │
│ Publish                                │   Update QR                         │
└────────────────────────────────────────┴─────────────────────────────────────┘
```

The QR preview updates instantly as the user edits metadata, while the encoded identifier remains stable.

---

# Builder Philosophy

Instead of fixed forms, everything is composed from reusable sections.

```
Details

Product Information

Pricing

Warranty

Specifications

Documents

Media

Certifications

Custom Section

Trail

Manufacturing

Quality

Warehouse

Shipping

Dealer

Customer

Warranty

Service

Rental

Returns

Custom Section
```

Every section can be reordered, duplicated, collapsed, hidden, or removed (except protected system sections).

---

# Custom Field Builder

Each section exposes an **Add Field** action.

Supported field types include:

* Text
* Long Text
* Number
* Currency
* Percentage
* Date
* Date & Time
* Boolean
* Dropdown
* Multi Select
* Radio Buttons
* Checkbox Group
* Email
* Phone
* URL
* Barcode
* QR Reference
* File Upload
* Image Upload
* Signature
* GPS Location
* JSON
* Rich Text
* Formula
* Lookup
* Relation
* AI Generated
* Hidden/Internal

Every field supports configuration such as:

* Required
* Read Only
* Public / Internal
* Default Value
* Validation Rules
* Placeholder
* Regex
* Help Text
* Conditional Visibility

---

# Validation Builder

Each field should support no-code validation.

Example:

```
Price

✓ Required

Minimum = 0

Maximum = 500000

Currency = INR

Decimal Places = 2
```

For Serial Number:

```
Regex

[A-Z]{3}-[0-9]{8}
```

For Warranty:

```
Cannot exceed

10 years
```

No coding required.

---

# Custom Sections

Users should also be able to define entirely new sections.

Example:

```
Medical Device

Sterilization

Calibration

Compliance

Consumables
```

or

```
Vehicle

Engine

Insurance

Registration

Service Schedule
```

These become reusable templates across products.

---

# Live QR Panel

The right panel should remain sticky while scrolling.

It includes:

```
Live QR

Preview

Short URL

Copy Link

Share

Download

Update QR

Analytics

Last Scan

Total Scans
```

The QR itself never changes identity; "Update QR" republishes the current metadata and invalidates any cached rendering if necessary.

---

# Download Options

Offer multiple output formats:

**Raster**

* PNG
* JPG
* WEBP

**Vector**

* SVG
* PDF
* EPS

Support common sizes:

* 128 px
* 256 px
* 512 px
* 1024 px
* 2048 px
* Print (300 DPI)
* Custom dimensions

Customization options:

* Foreground/background colors
* Rounded modules
* Logo embedding
* Quiet zone
* Error correction level
* Frame and caption
* Transparent background

---

# Sharing

Provide quick actions to:

* Copy QR URL
* Copy QR image
* Native share (mobile)
* Email
* WhatsApp
* LinkedIn
* X
* Embed snippet
* Public landing page

---

# Anonymous Usage

Without an account, a visitor can:

* Create one QR
* Build Details
* Build Trail
* Publish
* Download
* Share

To manage multiple QR codes or edit previously published items, users create an account and sign in.

This gives a frictionless onboarding experience while encouraging registration for ongoing management.

---

# Product Guide

Borrow the onboarding experience rather than copying it.

A contextual guide should:

* Welcome new users with a sample QR
* Walk them through creating their first Details section
* Explain Trail events
* Show where to download and share the QR
* Demonstrate scanning from a phone
* Celebrate the first successful publish

Instead of static tooltips, use an interactive checklist:

```
✓ Create Product

✓ Add Details

✓ Add Trail

✓ Publish

✓ Scan QR

✓ Download

✓ Share

✓ Create Account
```

Completion unlocks advanced features like templates, analytics, team collaboration, API keys, and ERP integrations.

---

# Advanced Features for Logged-In Users

Once authenticated, the platform can expand into a full QR asset management system:

* Dashboard of all QR identities
* Search and filtering
* Tags and folders
* Bulk QR generation
* CSV/Excel import and export
* Team workspaces with role-based permissions
* Version history and rollback
* Scan analytics (location, device, time)
* API keys and webhooks
* Template library
* Neo4j relationship visualization
* ERP integrations (BillSoft, SAP, Oracle, Odoo, ERPNext, etc.)
* Audit logs and change history

## Design Language

The UI should combine the strengths of several modern products while maintaining its own identity:

* **Linear** for clean navigation and polished interactions.
* **Notion** for flexible, block-based editing.
* **Airtable** for dynamic field and schema management.
* **Figma** for spacing, typography, and component consistency.
* **Cred** for premium visuals, subtle gradients, and animations.
* **Product Hunt** for interactive onboarding and product discovery.

The result should feel like a premium product builder rather than an enterprise ERP screen: fast, elegant, highly interactive, and centered around the QR code as the living digital identity of every physical asset.
