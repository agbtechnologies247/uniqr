import { 
  Factory, Smartphone, Car, Stethoscope, Pill, ShoppingBag, Truck, Hotel, 
  UtensilsCrossed, GraduationCap, Building, HardHat, Sprout, Gem, Key
} from 'lucide-react';

export interface TourStep {
  step: number;
  title: string;
  description: string;
  voiceover: string;
  targetId: string;
  payload: Record<string, any>;
  durationSec: number;
}

export interface ConnectedIntelligenceQA {
  question: string;
  answer: string;
}

export interface GraphRelationship {
  source: string;
  target: string;
  label: string;
}

export interface IndustryUseCase {
  id: string;
  title: string;
  subtitle: string;
  category: 'Industrial' | 'Health & Pharma' | 'Retail & Services' | 'Assets & Spaces';
  icon: any;
  description: string;
  steps: TourStep[];
  intelligenceQA: ConnectedIntelligenceQA[];
  graphRelationships: GraphRelationship[];
}

export const INDUSTRY_USE_CASES: IndustryUseCase[] = [
  // 1. MANUFACTURING
  {
    id: 'manufacturing',
    title: 'Manufacturing',
    subtitle: 'Product Lifecycle QR',
    category: 'Industrial',
    icon: Factory,
    description: 'Attach a permanent UniQR identity to every manufactured product, component, machine or batch.',
    steps: [
      { step: 1, title: 'Product identity creation', description: 'Initialize permanent UniQR cryptographic identity token.', voiceover: 'UniQR assigns a permanent digital twin hash at assembly start.', targetId: 'step-identity', payload: { entity: 'UniQR Identity', token: 'UQ-MFG-9901' }, durationSec: 6 },
      { step: 2, title: 'SKU/model identification', description: 'Bind universal SKU and model specifications.', voiceover: 'SKU and BOM component schemas are linked to the identity.', targetId: 'step-sku', payload: { sku: 'AGB-IND-V8', model: 'HeavyDuty v4' }, durationSec: 6 },
      { step: 3, title: 'Manufacturer identification', description: 'Register certified manufacturing entity details.', voiceover: 'Manufacturer credentials and plant IDs are cryptographically stamped.', targetId: 'step-mfg', payload: { manufacturer: 'AGB Technologies Ltd', plantId: 'Pune Line 1' }, durationSec: 6 },
      { step: 4, title: 'Production plant assignment', description: 'Associate geo-tagged manufacturing plant location.', voiceover: 'Plant location and assembly line telemetry are recorded.', targetId: 'step-plant', payload: { plant: 'Pune Facility', line: 'Line A-1' }, durationSec: 6 },
      { step: 5, title: 'Production batch assignment', description: 'Link production batch and work-order records.', voiceover: 'Batch lot numbers enable instant precision recall capability.', targetId: 'step-batch', payload: { batch: 'BATCH-2026-08A' }, durationSec: 6 },
      { step: 6, title: 'Raw-material relationship mapping', description: 'Map upstream component and raw material origins.', voiceover: 'Raw material certificates and steel heat numbers are mapped.', targetId: 'step-raw', payload: { rawSteel: 'AISI-316L', heatCode: 'HT-8820' }, durationSec: 6 },
      { step: 7, title: 'Production-stage tracking', description: 'Log assembly stage milestones in real-time.', voiceover: 'Assembly milestones update automatically as the unit progresses.', targetId: 'step-stage', payload: { stage: 'Machining Complete', status: 'PASS' }, durationSec: 6 },
      { step: 8, title: 'Quality inspection recording', description: 'Record tolerance, pressure, and electrical test metrics.', voiceover: 'Quality parameters and sensor readings are attached to the twin.', targetId: 'step-qc-record', payload: { tolerance: '±0.01mm', pressure: '450 PSI' }, durationSec: 6 },
      { step: 9, title: 'QC approval/rejection', description: 'Digitally sign QC pass status with auditor identity.', voiceover: 'Auditor digital signature validates quality compliance.', targetId: 'step-qc-pass', payload: { qcResult: 'APPROVED', auditor: 'qa.lead@agb.in' }, durationSec: 6 },
      { step: 10, title: 'Serial-number association', description: 'Assign unique serial number and laser barcode.', voiceover: 'Unique serial number is engraved and linked to the QR code.', targetId: 'step-sn', payload: { serialNumber: 'SN-2026-00492' }, durationSec: 6 },
      { step: 11, title: 'Packaging association', description: 'Bind individual product identity to outer shipping box.', voiceover: 'Product identity nests inside master carton QR hierarchy.', targetId: 'step-[#1D4533]', payload: { masterCarton: 'MC-88192' }, durationSec: 6 },
      { step: 12, title: 'Warehouse entry', description: 'Scan entry event into finished goods inventory.', voiceover: 'Warehouse intake updates ERP stock count instantly.', targetId: 'step-wh', payload: { warehouse: 'Central Depot A', bay: 'B-14' }, durationSec: 6 },
      { step: 13, title: 'Dispatch tracking', description: 'Log dispatch manifest and carrier consignment.', voiceover: 'Dispatch scan notifies logistics tracking network.', targetId: 'step-dispatch', payload: { manifest: 'MAN-9901', carrier: 'AGB Logistics' }, durationSec: 6 },
      { step: 14, title: 'Customer ownership assignment', description: 'Transfer digital identity ownership upon sale.', voiceover: 'Customer purchase registers digital ownership.', targetId: 'step-owner', payload: { customer: 'Metro Infra Corp' }, durationSec: 6 },
      { step: 15, title: 'Warranty activation', description: 'Start automated digital warranty policy clock.', voiceover: 'Warranty activates automatically upon deployment scan.', targetId: 'step-warranty', payload: { warrantyMonths: 36, status: 'Active' }, durationSec: 6 },
      { step: 16, title: 'Service and lifecycle history', description: 'Maintain continuous maintenance and audit trail.', voiceover: 'Complete service history and connected intelligence available on scan.', targetId: 'step-service', payload: { serviceEvents: 3, healthScore: 98 }, durationSec: 6 }
    ],
    intelligenceQA: [
      { question: 'Where was this product manufactured?', answer: 'Pune Plant Line A-1 (AGB Technologies Ltd).' },
      { question: 'Which batch does it belong to?', answer: 'Batch BATCH-2026-08A (Heat HT-8820).' },
      { question: 'Which raw materials were used?', answer: 'AISI-316L Forged Stainless Steel.' },
      { question: 'Was quality inspection completed?', answer: 'Yes, QC Pass signed by qa.lead@agb.in.' },
      { question: 'Who is the current owner?', answer: 'Metro Infra Corp (Assigned Aug 2026).' },
      { question: 'What is the current warranty status?', answer: '36 Months Active Warranty (Expires Aug 2029).' }
    ],
    graphRelationships: [
      { source: 'Product Twin', target: 'Batch Lot', label: 'PRODUCED_IN' },
      { source: 'Batch Lot', target: 'Raw Steel', label: 'SOURCED_FROM' },
      { source: 'Product Twin', target: 'QC Report', label: 'VERIFIED_BY' },
      { source: 'Product Twin', target: 'Customer', label: 'OWNED_BY' }
    ]
  },

  // 2. ELECTRONICS
  {
    id: 'electronics',
    title: 'Electronics',
    subtitle: 'Device Identity & Warranty',
    category: 'Retail & Services',
    icon: Smartphone,
    description: 'Every electronic device receives a digital identity that follows it through sale, ownership, warranty and repair.',
    steps: [
      { step: 1, title: 'Device registration', description: 'Initialize digital twin barcode for electronic hardware.', voiceover: 'Device registration creates a permanent cryptographic record.', targetId: 'step-identity', payload: { device: 'Smart Edge Router', uniqrCode: 'UQ-ELE-8810' }, durationSec: 6 },
      { step: 2, title: 'Model identification', description: 'Store chipset, RAM, and hardware specs.', voiceover: 'Hardware specifications and model variants are cataloged.', targetId: 'step-sku', payload: { model: 'EdgePro 5G', chipset: 'Snapdragon X65' }, durationSec: 6 },
      { step: 3, title: 'Serial-number assignment', description: 'Stamp factory hardware serial number.', voiceover: 'Unique hardware serial number is linked.', targetId: 'step-sn', payload: { serialNumber: 'SN-ELE-99201' }, durationSec: 6 },
      { step: 4, title: 'IMEI/device identifier association', description: 'Bind IMEI, MAC address, and secure chip IDs.', voiceover: 'IMEI and MAC address credentials are bound.', targetId: 'step-imei', payload: { imei: '869102930192847', mac: '4A:89:C2:10:9F:8B' }, durationSec: 6 },
      { step: 5, title: 'Manufacturing batch association', description: 'Link SMT assembly batch and PCB lot.', voiceover: 'PCB assembly lot numbers are recorded.', targetId: 'step-batch', payload: { pcbBatch: 'PCB-2026-V4' }, durationSec: 6 },
      { step: 6, title: 'Production date', description: 'Record factory burn-in test timestamp.', voiceover: 'Production date and burn-in diagnostic logs are stored.', targetId: 'step-mfg-date', payload: { mfgDate: '2026-07-10', burnInStatus: 'PASS' }, durationSec: 6 },
      { step: 7, title: 'Distributor assignment', description: 'Assign regional electronics distributor.', voiceover: 'Regional distributor receipt is logged.', targetId: 'step-distributor', payload: { distributor: 'National Electronics Dist' }, durationSec: 6 },
      { step: 8, title: 'Retailer assignment', description: 'Assign retail store inventory location.', voiceover: 'Retail store stock arrival is confirmed.', targetId: 'step-retailer', payload: { store: 'UniQR MegaStore Flagship' }, durationSec: 6 },
      { step: 9, title: 'Customer registration', description: 'Link customer purchase profile.', voiceover: 'Customer registers ownership via smartphone scan.', targetId: 'step-customer', payload: { customer: 'Anand K.', phone: '+91 9049874780' }, durationSec: 6 },
      { step: 10, title: 'Purchase-date recording', description: 'Store invoice timestamp and store ID.', voiceover: 'Purchase invoice date sets warranty start.', targetId: 'step-purchase', payload: { purchaseDate: '2026-08-01', invoice: 'INV-88192' }, durationSec: 6 },
      { step: 11, title: 'Warranty activation', description: 'Activate 12-month digital hardware warranty.', voiceover: 'Hardware warranty is activated automatically.', targetId: 'step-warranty', payload: { warrantyMonths: 12, validTill: '2027-08-01' }, durationSec: 6 },
      { step: 12, title: 'Warranty verification', description: 'Instantly verify coverage during scan.', voiceover: 'Scanning verifies instant warranty coverage status.', targetId: 'step-verify', payload: { isCovered: true, daysRemaining: 354 }, durationSec: 6 },
      { step: 13, title: 'Service-request creation', description: 'Generate repair ticket with diagnostic logs.', voiceover: 'Service requests create a tamper-evident maintenance event.', targetId: 'step-ticket', payload: { ticketId: 'TKT-9910', issue: 'Display Cable Touch' }, durationSec: 6 },
      { step: 14, title: 'Repair-history recording', description: 'Log authorized service center repair records.', voiceover: 'Authorized repair details are added to history.', targetId: 'step-repair', payload: { center: 'UniQR Care Pune', action: 'Display Replaced' }, durationSec: 6 },
      { step: 15, title: 'Replacement-component tracking', description: 'Track OEM genuine spare parts used.', voiceover: 'OEM replacement spare parts are tracked.', targetId: 'step-[#1D4533]', payload: { replacedPart: 'OLED Panel Gen-3' }, durationSec: 6 },
      { step: 16, title: 'Device lifecycle closure', description: 'Track trade-in, recycling, or decommissioning.', voiceover: 'E-waste recycling or trade-in closes the device lifecycle.', targetId: 'step-recycle', payload: { status: 'Recycled', eWasteCertificate: 'EW-88192' }, durationSec: 6 }
    ],
    intelligenceQA: [
      { question: 'What is this device?', answer: 'EdgePro 5G Smart Router (IMEI: 869102930192847).' },
      { question: 'Who owns this device?', answer: 'Anand K. (Verified Customer).' },
      { question: 'Is it under active warranty?', answer: 'Yes, 354 Days Remaining (Expires Aug 2027).' },
      { question: 'What service happened previously?', answer: 'OLED Display Panel replaced at UniQR Care Pune.' }
    ],
    graphRelationships: [
      { source: 'Device Twin', target: 'IMEI Record', label: 'IDENTIFIED_BY' },
      { source: 'Device Twin', target: 'Warranty Policy', label: 'PROTECTED_BY' },
      { source: 'Device Twin', target: 'Service Ticket', label: 'SERVICED_UNDER' }
    ]
  },

  // 3. AUTOMOTIVE
  {
    id: 'automotive',
    title: 'Automotive',
    subtitle: 'Vehicle & Component Passport',
    category: 'Industrial',
    icon: Car,
    description: 'Create a digital passport for vehicles, engines, batteries, tyres and major components.',
    steps: [
      { step: 1, title: 'Vehicle identity creation', description: 'Initialize digital twin for vehicle chassis.', voiceover: 'Vehicle identity creation initializes the permanent chassis twin.', targetId: 'step-identity', payload: { vehicle: 'EV SUV Pro', uniqrCode: 'UQ-AUTO-7710' }, durationSec: 6 },
      { step: 2, title: 'VIN association', description: 'Bind 17-digit Vehicle Identification Number.', voiceover: '17-digit VIN number is cryptographically bound.', targetId: 'step-vin', payload: { vin: '1HD1AAK12GB019284' }, durationSec: 6 },
      { step: 3, title: 'Model/variant identification', description: 'Store trim level, battery pack, and drivetrain.', voiceover: 'Engine variant and drivetrain specifications are cataloged.', targetId: 'step-model', payload: { variant: 'AWD Dual Motor 82kWh' }, durationSec: 6 },
      { step: 4, title: 'Manufacturing plant mapping', description: 'Record assembly factory location.', voiceover: 'Assembly plant and robotic welding logs are linked.', targetId: 'step-plant', payload: { factory: 'AGB Motors Gigafactory 1' }, durationSec: 6 },
      { step: 5, title: 'Engine association', description: 'Link electric motor serial numbers.', voiceover: 'Front and rear electric motor serials are attached.', targetId: 'step-engine', payload: { motorFront: 'MOT-F-9901', motorRear: 'MOT-R-9902' }, durationSec: 6 },
      { step: 6, title: 'Battery association', description: 'Bind EV high-voltage battery pack serial.', voiceover: 'Battery pack chemistry, SOH, and cell serials are stored.', targetId: 'step-[#1D4533]', payload: { batteryPack: 'BAT-82KWH-9912', SOH: '100%' }, durationSec: 6 },
      { step: 7, title: 'Component mapping', description: 'Map brake calipers, steering rack, and airbags.', voiceover: 'Safety-critical components are mapped in the graph.', targetId: 'step-comp', payload: { airbagECU: 'AIRBAG-v4-991' }, durationSec: 6 },
      { step: 8, title: 'Dealer assignment', description: 'Assign authorized automotive dealership.', voiceover: 'Authorized dealership delivery is logged.', targetId: 'step-dealer', payload: { dealer: 'AGB Auto World Pune' }, durationSec: 6 },
      { step: 9, title: 'Customer ownership', description: 'Register owner vehicle registration certificate.', voiceover: 'Vehicle owner profile and registration certificate are bound.', targetId: 'step-owner', payload: { owner: 'Sunil Rao', regNo: 'MH-12-AB-9901' }, durationSec: 6 },
      { step: 10, title: 'Registration information', description: 'Store RTO registration details.', voiceover: 'Regional transport registration details are attached.', targetId: 'step-rto', payload: { rto: 'MH-12 Pune Central' }, durationSec: 6 },
      { step: 11, title: 'Insurance association', description: 'Bind active vehicle insurance policy.', voiceover: 'Vehicle insurance coverage parameters are stored.', targetId: 'step-insurance', payload: { insurer: 'National Auto Insurance', policy: 'POL-99201' }, durationSec: 6 },
      { step: 12, title: 'Service schedule', description: 'Set automated 10,000 km maintenance alerts.', voiceover: 'Automated maintenance schedules alert owner and dealer.', targetId: 'step-sched', payload: { nextServiceKm: 10000 }, durationSec: 6 },
      { step: 13, title: 'Service-history tracking', description: 'Record oil change, brake pad, and software updates.', voiceover: 'Service center records update odometer and maintenance logs.', targetId: 'step-service-hist', payload: { odo: 15400, lastService: '2026-06-20' }, durationSec: 6 },
      { step: 14, title: 'Parts replacement history', description: 'Track OEM genuine spare parts installed.', voiceover: 'Replaced parts register OEM authenticity.', targetId: 'step-parts', payload: { replaced: 'Brake Pads Front' }, durationSec: 6 },
      { step: 15, title: 'Recall identification', description: 'Instantly check manufacturer safety recalls.', voiceover: 'Instant safety recall checking scans overall fleet safety.', targetId: 'step-recall', payload: { recallStatus: 'NO_ACTIVE_RECALLS' }, durationSec: 6 },
      { step: 16, title: 'Resale/ownership transfer', description: 'Transfer vehicle digital twin to secondary buyer.', voiceover: 'Resale ownership transfer preserves complete vehicle history.', targetId: 'step-resale', payload: { transferDate: '2026-08-10', newOwner: 'Vikram S.' }, durationSec: 6 }
    ],
    intelligenceQA: [
      { question: 'What is the vehicle VIN number?', answer: '1HD1AAK12GB019284 (EV SUV Pro AWD).' },
      { question: 'Which battery pack is installed?', answer: 'BAT-82KWH-9912 (State of Health: 100%).' },
      { question: 'Who is the registered owner?', answer: 'Vikram S. (Transferred Aug 2026).' },
      { question: 'Are there any active safety recalls?', answer: 'No active recalls. Vehicle status CLEAR.' }
    ],
    graphRelationships: [
      { source: 'Vehicle VIN', target: 'Battery Pack', label: 'EQUIPPED_WITH' },
      { source: 'Vehicle VIN', target: 'Owner', label: 'REGISTERED_TO' },
      { source: 'Vehicle VIN', target: 'Dealer', label: 'SOLD_BY' },
      { source: 'Vehicle VIN', target: 'Service Centre', label: 'MAINTAINED_BY' }
    ]
  },

  // 4. HEALTHCARE
  {
    id: 'healthcare',
    title: 'Healthcare',
    subtitle: 'Medical Equipment Passport',
    category: 'Health & Pharma',
    icon: Stethoscope,
    description: 'Give every medical device and equipment item a controlled digital identity.',
    steps: [
      { step: 1, title: 'Equipment registration', description: 'Create ISO 13485 compliant digital twin.', voiceover: 'ISO 13485 compliant digital identity is initialized.', targetId: 'step-identity', payload: { device: 'Ventilator Pro-900', uniqrCode: 'UQ-MED-1002' }, durationSec: 6 },
      { step: 2, title: 'Asset ID generation', description: 'Assign hospital unique asset tag.', voiceover: 'Hospital asset ID and barcode tag are generated.', targetId: 'step-asset', payload: { assetId: 'HOSP-ICU-VENT-04' }, durationSec: 6 },
      { step: 3, title: 'Equipment category', description: 'Classify medical device safety tier (Class IIb).', voiceover: 'FDA/CE medical equipment safety tier is recorded.', targetId: 'step-cat', payload: { class: 'Class IIb Life Support' }, durationSec: 6 },
      { step: 4, title: 'Manufacturer mapping', description: 'Record certified biomedical manufacturer.', voiceover: 'Biomedical manufacturer credentials are bound.', targetId: 'step-mfg', payload: { manufacturer: 'BioMed Precision Systems' }, durationSec: 6 },
      { step: 5, title: 'Model mapping', description: 'Store firmware version and sensor specs.', voiceover: 'Firmware version and oxygen sensor specs are cataloged.', targetId: 'step-model', payload: { firmware: 'v4.1.0-LTS' }, durationSec: 6 },
      { step: 6, title: 'Serial-number recording', description: 'Record factory serial number and FDA UDI.', voiceover: 'FDA UDI code and serial number are recorded.', targetId: 'step-sn', payload: { udi: 'UDI-(01)00850029(17)261231' }, durationSec: 6 },
      { step: 7, title: 'Hospital/department assignment', description: 'Assign hospital unit and ward location.', voiceover: 'Hospital department and ICU room location are assigned.', targetId: 'step-dept', payload: { hospital: 'City Care Hospital', dept: 'ICU Ward 3' }, durationSec: 6 },
      { step: 8, title: 'Location assignment', description: 'Pinpoint precise room bed position.', voiceover: 'Bedside position and power backup outlet are recorded.', targetId: 'step-loc', payload: { bed: 'Bed ICU-04' }, durationSec: 6 },
      { step: 9, title: 'Installation recording', description: 'Log biomedical engineer commissioning pass.', voiceover: 'Commissioning engineer records installation pass.', targetId: 'step-install', payload: { installedBy: 'eng.biomed@citycare.org' }, durationSec: 6 },
      { step: 10, title: 'Calibration schedule', description: 'Set mandatory 180-day calibration timer.', voiceover: 'Mandatory calibration schedule triggers automated alerts.', targetId: 'step-calib', payload: { nextCalibration: '2026-11-15' }, durationSec: 6 },
      { step: 11, title: 'Maintenance schedule', description: 'Schedule preventive maintenance inspections.', voiceover: 'Preventive maintenance schedule is attached.', targetId: 'step-maint', payload: { pmInterval: 'Quarterly' }, durationSec: 6 },
      { step: 12, title: 'Service history', description: 'Log filter replacements and sensor checks.', voiceover: 'Service technician logs sensor zero-point calibration.', targetId: 'step-service-hist', payload: { O2Sensor: 'CALIBRATED_PASS' }, durationSec: 6 },
      { step: 13, title: 'Breakdown recording', description: 'Record equipment fault alert event.', voiceover: 'Breakdown alerts notify biomedical department head immediately.', targetId: 'step-fault', payload: { faultCode: 'ERR-NONE', status: 'READY_FOR_USE' }, durationSec: 6 },
      { step: 14, title: 'Technician assignment', description: 'Assign certified biomedical technician.', voiceover: 'Assigned biomedical engineer badge is stored.', targetId: 'step-tech', payload: { tech: 'Eng. Ramesh Sharma' }, durationSec: 6 },
      { step: 15, title: 'Compliance documentation', description: 'Store NABL & ISO audit compliance certificates.', voiceover: 'NABL calibration certificate PDF is bound to QR scan.', targetId: 'step-compliance', payload: { nablCert: 'NABL-2026-8812' }, durationSec: 6 },
      { step: 16, title: 'Retirement/decommissioning', description: 'Log end-of-life biomedical disposal.', voiceover: 'Controlled decommissioning logs lifecycle completion.', targetId: 'step-retire', payload: { status: 'Active Service' }, durationSec: 6 }
    ],
    intelligenceQA: [
      { question: 'What is the equipment status?', answer: 'READY_FOR_USE (Class IIb Life Support).' },
      { question: 'Which department is it assigned to?', answer: 'City Care Hospital (ICU Ward 3, Bed ICU-04).' },
      { question: 'When is the next calibration due?', answer: 'Nov 15, 2026 (NABL-2026-8812 Certified).' },
      { question: 'Who is the assigned technician?', answer: 'Eng. Ramesh Sharma (Biomedical Lead).' }
    ],
    graphRelationships: [
      { source: 'Medical Device', target: 'Hospital Ward', label: 'DEPLOYED_AT' },
      { source: 'Medical Device', target: 'Calibration Record', label: 'CERTIFIED_BY' },
      { source: 'Medical Device', target: 'Biomedical Tech', label: 'MANAGED_BY' }
    ]
  },

  // 5. PHARMACY
  {
    id: 'pharmacy',
    title: 'Pharmacy',
    subtitle: 'Medicine & Batch Traceability',
    category: 'Health & Pharma',
    icon: Pill,
    description: 'Create intelligent identity for medicine packs, batches and pharmaceutical products.',
    steps: [
      { step: 1, title: 'Medicine identity', description: 'Initialize GS1 DataMatrix 2D barcode identity.', voiceover: 'GS1 compliant pharmaceutical identity token is created.', targetId: 'step-identity', payload: { drug: 'BioInsulin 100IU Injection', uniqrCode: 'UQ-PHARM-881' }, durationSec: 6 },
      { step: 2, title: 'Product/SKU identification', description: 'Bind drug formulation and dosage specs.', voiceover: 'Formulation, dosage, and active ingredients are cataloged.', targetId: 'step-sku', payload: { sku: 'DRUG-INS-100', dosage: '10ml Vial' }, durationSec: 6 },
      { step: 3, title: 'Manufacturer mapping', description: 'Record licensed pharmaceutical lab.', voiceover: 'Licensed pharma manufacturing lab credentials are bound.', targetId: 'step-mfg', payload: { lab: 'BioPharma India Ltd', license: 'FDA-IND-99201' }, durationSec: 6 },
      { step: 4, title: 'Batch creation', description: 'Create manufacturing batch lot record.', voiceover: 'Sterile batch lot creation generates serialization code.', targetId: 'step-batch', payload: { batchNo: 'LOT-INS-2026-09' }, durationSec: 6 },
      { step: 5, title: 'Manufacturing date', description: 'Log sterile filling timestamp.', voiceover: 'Manufacturing timestamp and sterile filling logs are saved.', targetId: 'step-mfg-date', payload: { mfgDate: '2026-07-01' }, durationSec: 6 },
      { step: 6, title: 'Expiry date', description: 'Set mandatory expiry date alerts.', voiceover: 'Expiry date algorithms monitor stock freshness.', targetId: 'step-[#1D4533]', payload: { expDate: '2027-07-01' }, durationSec: 6 },
      { step: 7, title: 'Packaging association', description: 'Bind vial QR to cold-chain box.', voiceover: 'Vial QR links to cold-chain insulated shipper box.', targetId: 'step-pack', payload: { shipperBox: 'SHIP-COLD-991' }, durationSec: 6 },
      { step: 8, title: 'Distribution assignment', description: 'Assign cold-chain logistics vendor.', voiceover: 'Cold-chain distributor receives temperature logger link.', targetId: 'step-dist', payload: { carrier: 'ColdChain Express' }, durationSec: 6 },
      { step: 9, title: 'Warehouse entry', description: 'Log temperature-controlled (-20°C) storage.', voiceover: 'Cold store arrival confirms -20°C environment.', targetId: 'step-wh', payload: { temp: '-18°C (PASS)' }, durationSec: 6 },
      { step: 10, title: 'Stock movement', description: 'Track transit events across distributors.', voiceover: 'Stock movement records continuous custody transfer.', targetId: 'step-[#1D4533]', payload: { status: 'In Transit to Retail Pharmacy' }, durationSec: 6 },
      { step: 11, title: 'Retailer assignment', description: 'Log licensed retail pharmacy intake.', voiceover: 'Retail pharmacy receives verified authentic stock.', targetId: 'step-retail', payload: { pharmacy: 'Apollo Pharmacy Central' }, durationSec: 6 },
      { step: 12, title: 'Sale event', description: 'Register prescription sale to patient.', voiceover: 'Prescription sale locks unit serial against reuse.', targetId: 'step-sale', payload: { saleDate: '2026-08-11', rxNo: 'RX-99012' }, durationSec: 6 },
      { step: 13, title: 'Recall association', description: 'Instant recall lockdown capability.', voiceover: 'UniQR can instantly flag recalled batches across stores.', targetId: 'step-recall', payload: { recallState: 'CLEAR_NO_RECALL' }, durationSec: 6 },
      { step: 14, title: 'Expiry monitoring', description: 'Flag expired stock before dispensing.', voiceover: 'Expiry monitoring prevents dispensing past date.', targetId: 'step-[#1D4533]', payload: { isFresh: true }, durationSec: 6 },
      { step: 15, title: 'Authenticity verification', description: 'Patient scans to verify anti-counterfeit QR.', voiceover: 'Patient scans to confirm 100% genuine medicine.', targetId: 'step-auth', payload: { authStatus: 'GENUINE_ORIGINAL' }, durationSec: 6 },
      { step: 16, title: 'Disposal/closure', description: 'Log medical waste destruction if expired.', voiceover: 'Used vial registration closes pharmaceutical lifecycle.', targetId: 'step-dispose', payload: { status: 'DISPENSED_AND_CLOSED' }, durationSec: 6 }
    ],
    intelligenceQA: [
      { question: 'Is this medicine authentic?', answer: '100% Genuine Original (BioPharma India Ltd).' },
      { question: 'What is the expiry date?', answer: 'July 1, 2027 (Fresh, Active).' },
      { question: 'Was cold chain maintained?', answer: 'Yes, Controlled -18°C Logged.' },
      { question: 'Has this batch been recalled?', answer: 'No, Batch LOT-INS-2026-09 is CLEAR.' }
    ],
    graphRelationships: [
      { source: 'Medicine Pack', target: 'Pharma Batch', label: 'BELONGS_TO' },
      { source: 'Pharma Batch', target: 'Cold Chain Logger', label: 'MONITORED_BY' },
      { source: 'Medicine Pack', target: 'Retail Pharmacy', label: 'DISPENSED_AT' }
    ]
  },

  // 6. RETAIL
  {
    id: 'retail',
    title: 'Retail',
    subtitle: 'Product & Customer Experience',
    category: 'Retail & Services',
    icon: ShoppingBag,
    description: 'QR becomes the bridge between the physical product and the retailer digital ecosystem.',
    steps: [
      { step: 1, title: 'Product creation', description: 'Register consumer retail product twin.', voiceover: 'Retail product identity creates a bridge to e-commerce.', targetId: 'step-identity', payload: { item: 'Luxury Organic Leather Bag', uniqrCode: 'UQ-RET-4001' }, durationSec: 6 },
      { step: 2, title: 'SKU assignment', description: 'Bind retail barcoding and EAN-13.', voiceover: 'EAN-13 barcode and SKU specifications are bound.', targetId: 'step-sku', payload: { ean: '8901234567890', sku: 'LUX-BAG-BRN' }, durationSec: 6 },
      { step: 3, title: 'Category assignment', description: 'Categorize under fashion & accessories.', voiceover: 'Department and product category are assigned.', targetId: 'step-cat', payload: { dept: 'Fashion & Accessories' }, durationSec: 6 },
      { step: 4, title: 'Brand assignment', description: 'Link official brand identity profile.', voiceover: 'Brand story, craftsmanship videos, and sustainability notes link.', targetId: 'step-brand', payload: { brand: 'UniQR Atelier' }, durationSec: 6 },
      { step: 5, title: 'Pricing', description: 'Store MRP and dynamic promotional price.', voiceover: 'Dynamic pricing engines update store shelf prices.', targetId: 'step-price', payload: { mrp: '₹14,999', offerPrice: '₹12,499' }, durationSec: 6 },
      { step: 6, title: 'Inventory assignment', description: 'Allocate stock to warehouse lot.', voiceover: 'Inventory count updates across store channels.', targetId: 'step-inv', payload: { stockQty: 150 }, durationSec: 6 },
      { step: 7, title: 'Warehouse assignment', description: 'Track fulfillment center location.', voiceover: 'Warehouse fulfillment center origin is recorded.', targetId: 'step-wh', payload: { fc: 'Mumbai Central FC' }, durationSec: 6 },
      { step: 8, title: 'Store assignment', description: 'Assign retail store branch.', voiceover: 'Store branch receipt confirms shelf placement.', targetId: 'step-store', payload: { store: 'Phoenix Mall Flagship' }, durationSec: 6 },
      { step: 9, title: 'Shelf/location assignment', description: 'Pinpoint display aisle position.', voiceover: 'Display aisle position is tagged.', targetId: 'step-shelf', payload: { aisle: 'Aisle 3 - Leather Section' }, durationSec: 6 },
      { step: 10, title: 'Customer scan', description: 'Customer scans QR with smartphone.', voiceover: 'Customer scans physical product in store.', targetId: 'step-scan', payload: { scanTime: '14:20:11', userRole: 'Shopper' }, durationSec: 6 },
      { step: 11, title: 'Product information', description: 'Render rich interactive product story.', voiceover: 'Rich product story, material care guide, and videos display.', targetId: 'step-info', payload: { material: '100% Vegetable Tanned Leather' }, durationSec: 6 },
      { step: 12, title: 'Offers/promotions', description: 'Trigger personalized discount coupons.', voiceover: 'Personalized promotional offers engage the shopper.', targetId: 'step-offer', payload: { promo: 'FESTIVE15 (15% OFF)' }, durationSec: 6 },
      { step: 13, title: 'Purchase association', description: 'Link POS bill checkout transaction.', voiceover: 'POS transaction links product QR to customer receipt.', targetId: 'step-purchase', payload: { billNo: 'POS-88192' }, durationSec: 6 },
      { step: 14, title: 'Warranty registration', description: 'Instant 1-click digital warranty registration.', voiceover: 'Shopper registers digital warranty in 1 click.', targetId: 'step-warranty', payload: { warranty: '2 Years Leather Care' }, durationSec: 6 },
      { step: 15, title: 'Customer feedback', description: 'Collect instant product rating.', voiceover: 'Instant customer feedback ratings feed product design.', targetId: 'step-[#1D4533]', payload: { rating: 5, review: 'Exceptional craftsmanship!' }, durationSec: 6 },
      { step: 16, title: 'Repeat engagement', description: 'Send automated VIP loyalty rewards.', voiceover: 'Automated VIP loyalty rewards drive repeat purchases.', targetId: 'step-[#1D4533]', payload: { loyaltyPoints: 250 }, durationSec: 6 }
    ],
    intelligenceQA: [
      { question: 'What materials were used?', answer: '100% Italian Vegetable Tanned Leather.' },
      { question: 'What is the current store price?', answer: '₹12,499 (Special Festive Offer applied).' },
      { question: 'Does it come with a warranty?', answer: 'Yes, 2 Years Manufacturer Warranty.' },
      { question: 'Are there loyalty points available?', answer: '250 VIP Points credited upon registration.' }
    ],
    graphRelationships: [
      { source: 'Retail Item', target: 'Brand Atelier', label: 'DESIGNED_BY' },
      { source: 'Retail Item', target: 'Store Aisle', label: 'DISPLAYED_AT' },
      { source: 'Retail Item', target: 'Customer Profile', label: 'PURCHASED_BY' }
    ]
  },

  // 7. LOGISTICS
  {
    id: 'logistics',
    title: 'Logistics',
    subtitle: 'Shipment & Package Intelligence',
    category: 'Industrial',
    icon: Truck,
    description: 'Every shipment/package/container gets a digital identity.',
    steps: [
      { step: 1, title: 'Shipment creation', description: 'Generate consignment identity twin.', voiceover: 'Shipment identity initializes tracking container.', targetId: 'step-identity', payload: { trackingNo: 'UQ-LOG-8820' }, durationSec: 6 },
      { step: 2, title: 'Package identity', description: 'Attach barcode to package exterior.', voiceover: 'Exterior package QR code is generated.', targetId: 'step-pack', payload: { weightKg: 24.5, dimensions: '40x30x20 cm' }, durationSec: 6 },
      { step: 3, title: 'Order association', description: 'Bind e-commerce order ID.', voiceover: 'E-commerce order ID is associated.', targetId: 'step-order', payload: { orderId: 'ORD-99201' }, durationSec: 6 },
      { step: 4, title: 'Sender association', description: 'Record merchant origin address.', voiceover: 'Merchant origin address and GST details are logged.', targetId: 'step-sender', payload: { sender: 'AGB Tech Warehouse Pune' }, durationSec: 6 },
      { step: 5, title: 'Receiver association', description: 'Record recipient delivery destination.', voiceover: 'Recipient destination address and contact are stored.', targetId: 'step-recv', payload: { receiver: 'Rajesh M., Bengaluru' }, durationSec: 6 },
      { step: 6, title: 'Origin warehouse', description: 'Scan pickup departure at origin FC.', voiceover: 'Origin warehouse pickup scan initiates transit.', targetId: 'step-origin', payload: { originFc: 'Pune Fulfillment Hub' }, durationSec: 6 },
      { step: 7, title: 'Destination warehouse', description: 'Assign target regional hub.', voiceover: 'Target destination hub routing is calculated.', targetId: 'step-dest', payload: { destHub: 'Bengaluru Central Sorting' }, durationSec: 6 },
      { step: 8, title: 'Carrier assignment', description: 'Assign express courier truck route.', voiceover: 'Express courier carrier truck is assigned.', targetId: 'step-carrier', payload: { carrier: 'ExpressCargo Fleet-12' }, durationSec: 6 },
      { step: 9, title: 'Pickup event', description: 'Log driver handover scan.', voiceover: 'Driver handover scan registers custody transfer.', targetId: 'step-pickup', payload: { driver: 'Driver S. Kumar' }, durationSec: 6 },
      { step: 10, title: 'Transit event', description: 'Log GPS waypoint checkpoint.', voiceover: 'Highway toll GPS checkpoint updates location in real-time.', targetId: 'step-[#1D4533]', payload: { waypoint: 'NH-48 Toll Gate', status: 'ON_TIME' }, durationSec: 6 },
      { step: 11, title: 'Hub arrival', description: 'Scan arrival at regional sorting hub.', voiceover: 'Hub arrival scan triggers automated sorter bin.', targetId: 'step-arrival', payload: { hub: 'Bengaluru Sort Facility' }, durationSec: 6 },
      { step: 12, title: 'Hub departure', description: 'Scan dispatch onto last-mile vehicle.', voiceover: 'Last-mile vehicle dispatch scan assigns delivery executive.', targetId: 'step-dept', payload: { lastMileExec: 'Mahesh B.' }, durationSec: 6 },
      { step: 13, title: 'Delivery attempt', description: 'Log OTP verification check at door.', voiceover: 'Delivery executive scans QR at customer doorstep.', targetId: 'step-attempt', payload: { otpStatus: 'VERIFIED' }, durationSec: 6 },
      { step: 14, title: 'Delivery confirmation', description: 'Record digital proof of delivery (POD).', voiceover: 'Proof of delivery signature completes transaction.', targetId: 'step-pod', payload: { podSignature: 'SIG-POD-9912' }, durationSec: 6 },
      { step: 15, title: 'Exception recording', description: 'Log damage, delay, or route deviation.', voiceover: 'Zero exceptions recorded. Transit SLA met.', targetId: 'step-ex', payload: { exceptions: 0 }, durationSec: 6 },
      { step: 16, title: 'Shipment closure', description: 'Close consignment lifecycle.', voiceover: 'Consignment lifecycle closes successfully.', targetId: 'step-close', payload: { status: 'DELIVERED_SUCCESS' }, durationSec: 6 }
    ],
    intelligenceQA: [
      { question: 'Where is the shipment right now?', answer: 'DELIVERED_SUCCESS (Bengaluru).' },
      { question: 'Who handled the last-mile delivery?', answer: 'Mahesh B. (OTP Verified).' },
      { question: 'Were there any transit exceptions or delays?', answer: '0 Exceptions. On-time delivery SLA met.' }
    ],
    graphRelationships: [
      { source: 'Shipment Package', target: 'Origin Hub', label: 'DISPATCHED_FROM' },
      { source: 'Shipment Package', target: 'Transit Truck', label: 'CARRIED_BY' },
      { source: 'Shipment Package', target: 'Recipient', label: 'DELIVERED_TO' }
    ]
  },

  // 8. HOSPITALITY
  {
    id: 'hospitality',
    title: 'Hospitality',
    subtitle: 'Hotel Room Intelligence',
    category: 'Assets & Spaces',
    icon: Hotel,
    description: 'Place UniQR inside rooms to create a dynamic guest-service interface.',
    steps: [
      { step: 1, title: 'Property identification', description: 'Create hotel property digital twin.', voiceover: 'Hotel property identity links rooms to guest PMS.', targetId: 'step-identity', payload: { hotel: 'Grand Palace Resort', uniqrCode: 'UQ-HOTEL-501' }, durationSec: 6 },
      { step: 2, title: 'Building identification', description: 'Map wing and tower structure.', voiceover: 'Building wing and tower layouts are cataloged.', targetId: 'step-bldg', payload: { wing: 'Ocean View Wing B' }, durationSec: 6 },
      { step: 3, title: 'Floor identification', description: 'Map floor layout and fire exits.', voiceover: 'Floor map and emergency evacuation routes are linked.', targetId: 'step-floor', payload: { floor: '5th Floor' }, durationSec: 6 },
      { step: 4, title: 'Room identification', description: 'Register room 504 persistent QR code.', voiceover: 'Room 504 persistent QR code is installed.', targetId: 'step-room', payload: { roomNo: '504', type: 'Deluxe Sea View Suite' }, durationSec: 6 },
      { step: 5, title: 'Room status', description: 'Monitor room occupancy state in real-time.', voiceover: 'Room state updates dynamically from PMS system.', targetId: 'step-state', payload: { state: 'OCCUPIED' }, durationSec: 6 },
      { step: 6, title: 'Guest association', description: 'Bind checked-in guest profile.', voiceover: 'Checked-in guest profile binds securely upon scan.', targetId: 'step-guest', payload: { guest: 'Dr. Meera Patel' }, durationSec: 6 },
      { step: 7, title: 'Check-in association', description: 'Store check-in and departure dates.', voiceover: 'Check-in and checkout timestamps structure guest stay.', targetId: 'step-checkin', payload: { checkIn: '2026-08-11', checkOut: '2026-08-14' }, durationSec: 6 },
      { step: 8, title: 'Room information', description: 'Serve Wi-Fi password, pool hours, and amenities.', voiceover: 'Scanning displays Wi-Fi credentials and resort amenities.', targetId: 'step-info', payload: { wifi: 'PalaceGuest_504', poolHours: '06:00 - 22:00' }, durationSec: 6 },
      { step: 9, title: 'Housekeeping request', description: '1-tap request extra towels or room cleaning.', voiceover: 'Guests order extra towels or room cleaning in 1 tap.', targetId: 'step-hk', payload: { request: 'Extra Pillows', status: 'DISPATCHED' }, durationSec: 6 },
      { step: 10, title: 'Room-service request', description: 'Order in-room dining menu directly.', voiceover: 'In-room dining order sends KOT directly to kitchen.', targetId: 'step-dining', payload: { order: 'Club Sandwich + Espresso' }, durationSec: 6 },
      { step: 11, title: 'Maintenance request', description: 'Report AC or TV issues instantly.', voiceover: 'Maintenance alerts notify staff instantly.', targetId: 'step-maint', payload: { issue: 'AC Temperature Adjustment' }, durationSec: 6 },
      { step: 12, title: 'Amenities request', description: 'Book spa treatments or airport cabs.', voiceover: 'Guests book spa appointments and cabs from room QR.', targetId: 'step-amenity', payload: { spaBooking: '17:00 Swedish Massage' }, durationSec: 6 },
      { step: 13, title: 'Feedback', description: 'Collect mid-stay guest rating.', voiceover: 'Mid-stay ratings alert manager if service scores drop.', targetId: 'step-[#1D4533]', payload: { rating: 5 }, durationSec: 6 },
      { step: 14, title: 'Issue escalation', description: 'Escalate urgent requests to front desk manager.', voiceover: 'Urgent requests escalate directly to Duty Manager.', targetId: 'step-esc', payload: { managerAlert: 'NO_ESCALATIONS' }, durationSec: 6 },
      { step: 15, title: 'Guest checkout', description: '1-click express checkout and folio review.', voiceover: '1-click express checkout reviews room folio bill.', targetId: 'step-checkout', payload: { billTotal: '₹18,500' }, durationSec: 6 },
      { step: 16, title: 'Room reset', description: 'Housekeeping scans to reset room state for next guest.', voiceover: 'Housekeeping scans to confirm room reset for next guest.', targetId: 'step-reset', payload: { roomStatus: 'VACANT_CLEANED' }, durationSec: 6 }
    ],
    intelligenceQA: [
      { question: 'What room is this?', answer: 'Room 504 (Deluxe Sea View Suite).' },
      { question: 'Who is the currently registered guest?', answer: 'Dr. Meera Patel (Checkout: Aug 14).' },
      { question: 'What is the room Wi-Fi network?', answer: 'PalaceGuest_504 (High Speed).' },
      { question: 'What is the housekeeping status?', answer: 'VACANT_CLEANED (Ready for Next Guest).' }
    ],
    graphRelationships: [
      { source: 'Hotel Room 504', target: 'Guest Booking', label: 'OCCUPIED_BY' },
      { source: 'Hotel Room 504', target: 'Housekeeping Task', label: 'SERVICED_BY' },
      { source: 'Hotel Room 504', target: 'Dining Kitchen', label: 'ORDERS_TO' }
    ]
  },

  // 9. RESTAURANT
  {
    id: 'restaurant',
    title: 'Restaurant',
    subtitle: 'Table & Order Intelligence',
    category: 'Retail & Services',
    icon: UtensilsCrossed,
    description: 'UniQR becomes the identity of a table rather than merely a menu link.',
    steps: [
      { step: 1, title: 'Restaurant identity', description: 'Initialize dining establishment QR twin.', voiceover: 'Restaurant identity initializes table intelligence.', targetId: 'step-identity', payload: { restaurant: 'The Olive Bistro', uniqrCode: 'UQ-REST-T04' }, durationSec: 6 },
      { step: 2, title: 'Branch identification', description: 'Assign branch location.', voiceover: 'Branch location and outlet ID are tagged.', targetId: 'step-branch', payload: { branch: 'Koregaon Park Branch' }, durationSec: 6 },
      { step: 3, title: 'Floor identification', description: 'Map rooftop, indoor, or patio section.', voiceover: 'Rooftop vs indoor patio section is identified.', targetId: 'step-floor', payload: { zone: 'Rooftop Garden Patio' }, durationSec: 6 },
      { step: 4, title: 'Table identity', description: 'Bind persistent Table 04 QR code.', voiceover: 'Persistent Table 04 QR code is bound.', targetId: 'step-table', payload: { tableNo: 'Table 04', capacity: '4 Persons' }, durationSec: 6 },
      { step: 5, title: 'Seating state', description: 'Monitor table occupancy status.', voiceover: 'Table occupancy updates on hostess floor plan.', targetId: 'step-state', payload: { status: 'SEATED_OCCUPIED' }, durationSec: 6 },
      { step: 6, title: 'Menu retrieval', description: 'Serve dynamic digital menu with live availability.', voiceover: 'Scanning displays dynamic digital menu with live stock.', targetId: 'step-menu', payload: { menuType: 'Dinner & Cocktails' }, durationSec: 6 },
      { step: 7, title: 'Customer session', description: 'Create joint customer table session.', voiceover: 'Diners join shared table session from their phones.', targetId: 'step-session', payload: { sessionCode: 'SESS-T04-881' }, durationSec: 6 },
      { step: 8, title: 'Menu browsing', description: 'Browse allergen info and chef specials.', voiceover: 'Diners filter dietary preferences and chef specials.', targetId: 'step-[#1D4533]', payload: { filter: 'Gluten-Free Specials' }, durationSec: 6 },
      { step: 9, title: 'Item selection', description: 'Select items with customized spice levels.', voiceover: 'Item customization parameters are selected.', targetId: 'step-[#1D4533]', payload: { item: 'Woodfired Truffle Pizza', spice: 'Medium' }, durationSec: 6 },
      { step: 10, title: 'Customisation', description: 'Add extra topping notes for chef.', voiceover: 'Custom notes feed directly to kitchen display system.', targetId: 'step-custom', payload: { note: 'Extra Fresh Basil & Olive Oil' }, durationSec: 6 },
      { step: 11, title: 'Cart creation', description: 'Build shared group cart at table.', voiceover: 'Group cart aggregates all diner selections.', targetId: 'step-[#1D4533]', payload: { cartTotal: '₹1,850' }, durationSec: 6 },
      { step: 12, title: 'Order creation', description: 'Submit order directly to POS system.', voiceover: 'Order placement sends instant confirmation to diners.', targetId: 'step-order', payload: { orderNo: 'ORD-T04-991' }, durationSec: 6 },
      { step: 13, title: 'KOT generation', description: 'Print Kitchen Order Ticket at station.', voiceover: 'KOT prints automatically at pizza oven station.', targetId: 'step-kot', payload: { station: 'Woodfire Oven Station' }, durationSec: 6 },
      { step: 14, title: 'Kitchen status', description: 'Live order status updates (Preparing -> Served).', voiceover: 'Live cooking progress updates diners in real-time.', targetId: 'step-status', payload: { prepTimeMinutes: 12, status: 'SERVED' }, durationSec: 6 },
      { step: 15, title: 'Billing/payment', description: 'Split bill or pay via UPI directly at table.', voiceover: 'Diners split bill or pay via UPI directly at table.', targetId: 'step-bill', payload: { paidVia: 'UPI Razorpay', billAmount: '₹1,850' }, durationSec: 6 },
      { step: 16, title: 'Table reset', description: 'Busser scans to mark table clean for next guests.', voiceover: 'Busser scans to clear table state for next seating.', targetId: 'step-reset', payload: { tableState: 'CLEARED_AND_SANITIZED' }, durationSec: 6 }
    ],
    intelligenceQA: [
      { question: 'Which table is this?', answer: 'Table 04 (Rooftop Garden Patio, 4 Seats).' },
      { question: 'What is the active order status?', answer: 'SERVED (Order ORD-T04-991).' },
      { question: 'Has the bill been paid?', answer: 'Paid ₹1,850 via UPI Razorpay.' },
      { question: 'What is the current table state?', answer: 'CLEARED_AND_SANITIZED (Ready).' }
    ],
    graphRelationships: [
      { source: 'Table 04', target: 'Active Session', label: 'HOSTS' },
      { source: 'Table 04', target: 'Kitchen KOT', label: 'TRANSMITS_TO' },
      { source: 'Table 04', target: 'POS Bill', label: 'BILLED_BY' }
    ]
  },

  // 10. EDUCATION
  {
    id: 'education',
    title: 'Education',
    subtitle: 'Student / Asset / Classroom QR',
    category: 'Assets & Spaces',
    icon: GraduationCap,
    description: 'UniQR can connect physical educational assets with students, teachers and institutions.',
    steps: [
      { step: 1, title: 'Institution identity', description: 'Register university digital twin campus.', voiceover: 'Educational institution identity maps university assets.', targetId: 'step-identity', payload: { univ: 'National Institute of Tech', uniqrCode: 'UQ-EDU-101' }, durationSec: 6 },
      { step: 2, title: 'Campus identity', description: 'Tag main campus geographic boundaries.', voiceover: 'Main campus location and Wi-Fi fences are set.', targetId: 'step-campus', payload: { campus: 'North Campus Hub' }, durationSec: 6 },
      { step: 3, title: 'Building identity', description: 'Tag Engineering & Science block.', voiceover: 'Academic building blocks are cataloged.', targetId: 'step-bldg', payload: { bldg: 'Computer Science Complex' }, durationSec: 6 },
      { step: 4, title: 'Classroom identity', description: 'Assign Lab 302 persistent QR identity.', voiceover: 'Lab 302 persistent QR code is mounted on door.', targetId: 'step-class', payload: { room: 'Lab 302 - AI & Robotics' }, durationSec: 6 },
      { step: 5, title: 'Student identity', description: 'Bind student ID card barcodes.', voiceover: 'Student ID card credentials bind securely.', targetId: 'step-student', payload: { student: 'Priya Sharma', rollNo: 'CS-2026-042' }, durationSec: 6 },
      { step: 6, title: 'Teacher identity', description: 'Bind professor lecture authorization.', voiceover: 'Professor credentials authorize lecture sessions.', targetId: 'step-prof', payload: { professor: 'Dr. A. K. Deshmukh' }, durationSec: 6 },
      { step: 7, title: 'Course association', description: 'Link CS-401 Machine Learning course.', voiceover: 'Course syllabus and lecture schedules link.', targetId: 'step-course', payload: { course: 'CS-401 Machine Learning' }, durationSec: 6 },
      { step: 8, title: 'Attendance event', description: 'Scan QR to mark geo-fenced lecture attendance.', voiceover: 'Student scan marks geo-fenced lecture attendance.', targetId: 'step-attend', payload: { attendance: 'PRESENT_VERIFIED' }, durationSec: 6 },
      { step: 9, title: 'Learning material', description: 'Access lecture slides and lab code repo.', voiceover: 'Scan unlocks lecture slides and GitHub code repo.', targetId: 'step-[#1D4533]', payload: { repoUrl: 'https://github.com/lab302/ml-2026' }, durationSec: 6 },
      { step: 10, title: 'Assignment access', description: 'Download lab assignment PDF.', voiceover: 'Lab assignment problem statements download directly.', targetId: 'step-assign', payload: { assignment: 'Lab Assignment 4: Neural Nets' }, durationSec: 6 },
      { step: 11, title: 'Classroom issue reporting', description: 'Report projector or AC fault to IT desk.', voiceover: 'Reporting projector fault notifies campus IT desk.', targetId: 'step-issue', payload: { issue: 'Projector HDMI Input Fault' }, durationSec: 6 },
      { step: 12, title: 'Equipment assignment', description: 'Checkout GPU workstation lab hardware.', voiceover: 'Workstation GPU allocation is tagged to student.', targetId: 'step-[#1D4533]', payload: { gpuNode: 'NVIDIA RTX-4090 Node 04' }, durationSec: 6 },
      { step: 13, title: 'Asset usage', description: 'Track lab equipment runtime hours.', voiceover: 'Equipment usage hours are logged.', targetId: 'step-[#1D4533]', payload: { runtimeHours: 3.5 }, durationSec: 6 },
      { step: 14, title: 'Maintenance request', description: 'Schedule lab PC maintenance.', voiceover: 'Campus IT schedules software updates.', targetId: 'step-maint', payload: { status: 'SCHEDULED_TONIGHT' }, durationSec: 6 },
      { step: 15, title: 'Academic event', description: 'Record seminar & hackathon events.', voiceover: 'Department hackathons and workshops log in timeline.', targetId: 'step-event', payload: { event: 'AI Hackathon 2026' }, durationSec: 6 },
      { step: 16, title: 'Historical record', description: 'Maintain permanent academic asset record.', voiceover: 'Permanent academic asset ledger is updated.', targetId: 'step-hist', payload: { totalScans: 4820 }, durationSec: 6 }
    ],
    intelligenceQA: [
      { question: 'Which classroom lab is this?', answer: 'Lab 302 (AI & Robotics Complex).' },
      { question: 'Which course is currently in session?', answer: 'CS-401 Machine Learning (Dr. Deshmukh).' },
      { question: 'How is attendance verified?', answer: 'Geo-fenced QR Scan (PRESENT_VERIFIED).' },
      { question: 'What equipment is assigned?', answer: 'NVIDIA RTX-4090 Node 04.' }
    ],
    graphRelationships: [
      { source: 'Classroom Lab 302', target: 'Course CS-401', label: 'HOSTS_LECTURE' },
      { source: 'Student', target: 'Attendance Record', label: 'REGISTERED_IN' },
      { source: 'Classroom Lab 302', target: 'IT Support', label: 'REPORTED_TO' }
    ]
  },

  // 11. REAL ESTATE
  {
    id: 'real-estate',
    title: 'Real Estate',
    subtitle: 'Property Digital Passport',
    category: 'Assets & Spaces',
    icon: Building,
    description: 'Every property, apartment, commercial unit or building gets a persistent digital identity.',
    steps: [
      { step: 1, title: 'Property creation', description: 'Initialize RERA registered property digital twin.', voiceover: 'Property creation generates a permanent RERA digital twin.', targetId: 'step-identity', payload: { property: 'Skyline Towers Suite 1204', uniqrCode: 'UQ-PROP-1204' }, durationSec: 6 },
      { step: 2, title: 'Property type', description: 'Specify commercial vs residential unit.', voiceover: 'Property category and square footage are registered.', targetId: 'step-type', payload: { type: 'Luxury 3BHK Apartment', areaSqFt: 1850 }, durationSec: 6 },
      { step: 3, title: 'Building association', description: 'Link master high-rise tower identity.', voiceover: 'Master building tower structure and elevators map.', targetId: 'step-bldg', payload: { tower: 'Skyline Tower A' }, durationSec: 6 },
      { step: 4, title: 'Unit association', description: 'Assign door unit number 1204.', voiceover: 'Unit 1204 door plaque receives encrypted QR code.', targetId: 'step-unit', payload: { unitNo: '1204', floor: 12 }, durationSec: 6 },
      { step: 5, title: 'Owner association', description: 'Bind legal title deed owner.', voiceover: 'Property title deed owner identity binds securely.', targetId: 'step-owner', payload: { owner: 'Mr. Vikram Singhania' }, durationSec: 6 },
      { step: 6, title: 'Tenant association', description: 'Bind active lease tenant profile.', voiceover: 'Active lease agreement and tenant profile link.', targetId: 'step-tenant', payload: { tenant: 'Rahul Mehta', leaseTill: '2027-03-31' }, durationSec: 6 },
      { step: 7, title: 'Document association', description: 'Store occupancy certificate (OC) and blueprints.', voiceover: 'Occupancy certificate, floor blueprints, and RERA docs attach.', targetId: 'step-[#1D4533]', payload: { reraNo: 'P52100088921', OCStatus: 'APPROVED' }, durationSec: 6 },
      { step: 8, title: 'Utility association', description: 'Link electricity meter & gas line IDs.', voiceover: 'Electricity meter, water connection, and piped gas IDs map.', targetId: 'step-util', payload: { powerMeter: 'METER-EL-9901', gasId: 'GAS-PN-441' }, durationSec: 6 },
      { step: 9, title: 'Maintenance history', description: 'Track plumbing, painting, and HVAC services.', voiceover: 'Plumbing, HVAC, and waterproofing history log permanently.', targetId: 'step-maint', payload: { hvacServiced: '2026-05-10' }, durationSec: 6 },
      { step: 10, title: 'Complaint history', description: 'Log society maintenance tickets.', voiceover: 'Society maintenance tickets log resolution status.', targetId: 'step-[#1D4533]', payload: { openTickets: 0 }, durationSec: 6 },
      { step: 11, title: 'Inspection history', description: 'Store annual structural audit pass.', voiceover: 'Annual structural safety audit certificate attaches.', targetId: 'step-inspect', payload: { structuralAudit: 'PASS_2026' }, durationSec: 6 },
      { step: 12, title: 'Vendor association', description: 'Link approved society electrician & plumber.', voiceover: 'Approved society electrician and plumber contacts link.', targetId: 'step-vendor', payload: { electrician: 'Rajesh Power Controls' }, durationSec: 6 },
      { step: 13, title: 'Payment relationship', description: 'Track monthly society maintenance dues.', voiceover: 'Monthly maintenance payment dues update status.', targetId: 'step-[#1D4533]', payload: { maintenancePaidTill: '2026-08-31' }, durationSec: 6 },
      { step: 14, title: 'Lease relationship', description: 'Track monthly rent collection status.', voiceover: 'Lease renewal parameters alert owner.', targetId: 'step-lease', payload: { monthlyRent: '₹65,000' }, durationSec: 6 },
      { step: 15, title: 'Ownership transfer', description: 'Transfer property passport upon resale.', voiceover: 'Property passport transfers seamlessly upon resale.', targetId: 'step-transfer', payload: { transferHistory: 2 }, durationSec: 6 },
      { step: 16, title: 'Property closure/archive', description: 'Maintain permanent property history archive.', voiceover: 'Permanent property digital passport remains active forever.', targetId: 'step-archive', payload: { status: 'ACTIVE_VERIFIED' }, durationSec: 6 }
    ],
    intelligenceQA: [
      { question: 'What property is this?', answer: 'Skyline Towers Suite 1204 (1,850 SqFt 3BHK).' },
      { question: 'Is RERA & OC approved?', answer: 'Yes, RERA P52100088921 & OC APPROVED.' },
      { question: 'Who is the owner and tenant?', answer: 'Owner: Vikram Singhania / Tenant: Rahul Mehta.' },
      { question: 'Are maintenance dues current?', answer: 'Paid Up to Date (Valid till Aug 2026).' }
    ],
    graphRelationships: [
      { source: 'Unit 1204', target: 'Title Deed Owner', label: 'OWNED_BY' },
      { source: 'Unit 1204', target: 'Lease Tenant', label: 'LEASED_TO' },
      { source: 'Unit 1204', target: 'Power Meter', label: 'METERED_BY' }
    ]
  },

  // 12. CONSTRUCTION
  {
    id: 'construction',
    title: 'Construction',
    subtitle: 'Material & Site Tracking',
    category: 'Industrial',
    icon: HardHat,
    description: 'Track materials from supplier -> site -> structure -> maintenance.',
    steps: [
      { step: 1, title: 'Project creation', description: 'Initialize mega infrastructure project digital twin.', voiceover: 'Project creation initializes infrastructure identity.', targetId: 'step-identity', payload: { project: 'Metro Flyover Line 3', uniqrCode: 'UQ-CONST-901' }, durationSec: 6 },
      { step: 2, title: 'Site creation', description: 'Tag construction site sector coordinates.', voiceover: 'Construction site sector boundaries are tagged.', targetId: 'step-site', payload: { site: 'Sector 4 Pier Construction' }, durationSec: 6 },
      { step: 3, title: 'Material identity', description: 'Tag structural steel beam / concrete batch.', voiceover: 'Structural steel beam receives laser-engraved QR tag.', targetId: 'step-material', payload: { material: 'I-Beam Steel 12m', grade: 'Fe-550D' }, durationSec: 6 },
      { step: 4, title: 'Supplier assignment', description: 'Link certified steel mill supplier.', voiceover: 'Certified steel mill mill-test certificate attaches.', targetId: 'step-supplier', payload: { supplier: 'Tata Steel Industrial' }, durationSec: 6 },
      { step: 5, title: 'Purchase order', description: 'Bind site purchase order document.', voiceover: 'Purchase order line items map to material twin.', targetId: 'step-po', payload: { poNo: 'PO-CONST-8821' }, durationSec: 6 },
      { step: 6, title: 'Delivery scheduling', description: 'Schedule flatbed truck dispatch.', voiceover: 'Flatbed delivery dispatch schedule is set.', targetId: 'step-[#1D4533]', payload: { etaSite: '2026-08-01' }, durationSec: 6 },
      { step: 7, title: 'Material receipt', description: 'Site engineer scans receipt on arrival.', voiceover: 'Site engineer scans receipt on flatbed arrival.', targetId: 'step-rcpt', payload: { receivedBy: 'eng.site@metro.in' }, durationSec: 6 },
      { step: 8, title: 'Batch identification', description: 'Record steel heat number and test report.', voiceover: 'Steel heat number and tensile yield strength log.', targetId: 'step-batch', payload: { heatNo: 'HEAT-99401', yieldPsi: '78,000 PSI' }, durationSec: 6 },
      { step: 9, title: 'Quality inspection', description: 'Perform ultrasonic weld flaw inspection.', voiceover: 'Ultrasonic weld flaw test passes quality check.', targetId: 'step-qc', payload: { ndtTest: 'ULTRASONIC_PASS' }, durationSec: 6 },
      { step: 10, title: 'Storage location', description: 'Assign site yard holding bay.', voiceover: 'Site yard storage holding bay position is recorded.', targetId: 'step-yard', payload: { yardBay: 'Yard Zone C-2' }, durationSec: 6 },
      { step: 11, title: 'Site movement', description: 'Scan crane hoisting movement to Pier 14.', voiceover: 'Tower crane hoisting movement is logged.', targetId: 'step-crane', payload: { hoistedTo: 'Pier 14 Structural Joint' }, durationSec: 6 },
      { step: 12, title: 'Work-package association', description: 'Link structural installation milestone.', voiceover: 'Structural installation milestone attaches to BIM.', targetId: 'step-[#1D4533]', payload: { bimNode: 'BIM-PIER-14' }, durationSec: 6 },
      { step: 13, title: 'Installation', description: 'Record torque bolt tightening pass.', voiceover: 'Torque wrench tightening pass confirms installation.', targetId: 'step-install', payload: { torqueFtLbs: 450, status: 'LOCKED' }, durationSec: 6 },
      { step: 14, title: 'Inspection', description: 'Third-party structural auditor signoff.', voiceover: 'Third-party structural auditor signs off digitally.', targetId: 'step-signoff', payload: { auditor: 'Bureau Veritas' }, durationSec: 6 },
      { step: 15, title: 'Maintenance relationship', description: 'Schedule 5-year anti-corrosion inspection.', voiceover: 'Scheduled anti-corrosion inspections protect asset.', targetId: 'step-maint', payload: { nextInspectionYear: 2031 }, durationSec: 6 },
      { step: 16, title: 'Project completion', description: 'Incorporate beam into permanent bridge passport.', voiceover: 'Material identity embeds permanently in bridge passport.', targetId: 'step-complete', payload: { bridgeAsset: 'Metro Flyover Pier 14' }, durationSec: 6 }
    ],
    intelligenceQA: [
      { question: 'Which supplier supplied this steel beam?', answer: 'Tata Steel Industrial (Grade Fe-550D).' },
      { question: 'What is the steel heat lot number?', answer: 'HEAT-99401 (78,000 PSI Yield Strength).' },
      { question: 'Where was this beam installed?', answer: 'Metro Flyover Pier 14 (Torque 450 Ft-Lbs Locked).' },
      { question: 'Who performed the quality signoff?', answer: 'Bureau Veritas (Ultrasonic NDT PASS).' }
    ],
    graphRelationships: [
      { source: 'Steel Beam', target: 'Steel Mill', label: 'SUPPLIED_BY' },
      { source: 'Steel Beam', target: 'Pier 14 Joint', label: 'INSTALLED_IN' },
      { source: 'Steel Beam', target: 'NDT Test Report', label: 'VERIFIED_BY' }
    ]
  },

  // 13. AGRICULTURE
  {
    id: 'agriculture',
    title: 'Agriculture',
    subtitle: 'Crop & Farm Passport',
    category: 'Health & Pharma',
    icon: Sprout,
    description: 'Give crops, farm lots, produce batches and agricultural assets digital identities.',
    steps: [
      { step: 1, title: 'Farm identity', description: 'Register certified organic farm digital twin.', voiceover: 'Farm identity registers organic farm credentials.', targetId: 'step-identity', payload: { farm: 'GreenValley Organic Farm', uniqrCode: 'UQ-FARM-301' }, durationSec: 6 },
      { step: 2, title: 'Field identity', description: 'Map GPS plot field boundaries.', voiceover: 'Field plot 4 GPS boundaries and soil pH are mapped.', targetId: 'step-field', payload: { plot: 'Plot 4 North Acres', soilPh: 6.8 }, durationSec: 6 },
      { step: 3, title: 'Crop identification', description: 'Register organic Alphonso Mango crop.', voiceover: 'Crop variety and organic certification details link.', targetId: 'step-crop', payload: { crop: 'Alphonso Mango', cert: 'USDA Organic' }, durationSec: 6 },
      { step: 4, title: 'Seed/batch association', description: 'Bind heirloom seed origin lot.', voiceover: 'Heirloom seed origin and sapling batch are bound.', targetId: 'step-[#1D4533]', payload: { seedLot: 'SEED-ALPH-2024' }, durationSec: 6 },
      { step: 5, title: 'Planting event', description: 'Record planting date and orchard layout.', voiceover: 'Planting date and orchard row numbers are logged.', targetId: 'step-plant', payload: { plantDate: '2024-06-15', rowNo: 'Row 12' }, durationSec: 6 },
      { step: 6, title: 'Growth tracking', description: 'Log bloom, fruit set, and maturity stage.', voiceover: 'Growth tracking logs bloom dates and soil moisture.', targetId: 'step-growth', payload: { stage: 'Full Harvest Maturity' }, durationSec: 6 },
      { step: 7, title: 'Irrigation event', description: 'Record solar drip irrigation logs.', voiceover: 'Solar drip irrigation volume and water purity log.', targetId: 'step-irrig', payload: { type: 'Drip Solar', litersPerDay: 45 }, durationSec: 6 },
      { step: 8, title: 'Fertilisation event', description: 'Log 100% natural bio-compost application.', voiceover: '100% natural bio-compost applications are recorded.', targetId: 'step-[#1D4533]', payload: { compostType: 'VermiCompost Organic' }, durationSec: 6 },
      { step: 9, title: 'Crop inspection', description: 'Log zero chemical pesticide audit pass.', voiceover: 'Pesticide residue lab test returns 0% chemical trace.', targetId: 'step-inspect', payload: { pesticideResidue: '0.00% (CHEMICAL FREE)' }, durationSec: 6 },
      { step: 10, title: 'Harvest event', description: 'Record hand-harvest date.', voiceover: 'Hand-harvest date and Brix sweetness rating log.', targetId: 'step-harvest', payload: { harvestDate: '2026-05-10', brixRating: '18.5 Brix' }, durationSec: 6 },
      { step: 11, title: 'Produce batch', description: 'Create consumer crate batch identity.', voiceover: 'Consumer crate batch identity QR is printed.', targetId: 'step-batch', payload: { crateBatch: 'CRATE-MANGO-881' }, durationSec: 6 },
      { step: 12, title: 'Storage', description: 'Log temperature-controlled ripening chamber.', voiceover: 'Ripening chamber humidity and temp log in real-time.', targetId: 'step-store', payload: { chamberTemp: '14°C' }, durationSec: 6 },
      { step: 13, title: 'Quality grading', description: 'Assign Grade-A Premium export rating.', voiceover: 'Optical sorter assigns Grade-A Premium rating.', targetId: 'step-[#1D4533]', payload: { grade: 'Export Grade A+ Premium' }, durationSec: 6 },
      { step: 14, title: 'Distributor assignment', description: 'Dispatch via cold-chain exporter.', voiceover: 'Cold-chain air freight exporter accepts consignment.', targetId: 'step-dist', payload: { exporter: 'GlobalFresh Cargo' }, durationSec: 6 },
      { step: 15, title: 'Retail/customer relationship', description: 'Shopper scans crate QR at supermarket.', voiceover: 'Shoppers scan produce QR at retail store counter.', targetId: 'step-retail', payload: { retailStore: 'WholeFoods Market' }, durationSec: 6 },
      { step: 16, title: 'Traceability history', description: 'Consumer traces full origin from tree to table.', voiceover: 'Consumers view complete farm-to-table origin story.', targetId: 'step-trace', payload: { farmToTableStatus: 'VERIFIED_ORGANIC' }, durationSec: 6 }
    ],
    intelligenceQA: [
      { question: 'Where was this fruit grown?', answer: 'GreenValley Organic Farm (Plot 4 North Acres).' },
      { question: 'Is it 100% chemical free?', answer: 'Yes, Lab Test 0.00% Chemical Residue (USDA Organic).' },
      { question: 'What is the sweetness Brix rating?', answer: '18.5° Brix (Export Grade A+ Premium).' },
      { question: 'When was it harvested?', answer: 'May 10, 2026 (Hand Picked).' }
    ],
    graphRelationships: [
      { source: 'Mango Produce', target: 'Organic Field', label: 'HARVESTED_FROM' },
      { source: 'Mango Produce', target: 'Residue Lab Report', label: 'CERTIFIED_BY' },
      { source: 'Mango Produce', target: 'Retail Store', label: 'SOLD_AT' }
    ]
  },

  // 14. JEWELLERY
  {
    id: 'jewellery',
    title: 'Jewellery',
    subtitle: 'Product Authenticity & Ownership',
    category: 'Retail & Services',
    icon: Gem,
    description: 'Create a digital certificate and ownership history for jewellery.',
    steps: [
      { step: 1, title: 'Jewellery identity', description: 'Initialize laser-engraved micro QR digital twin.', voiceover: 'Micro QR identity is initialized for luxury jewellery.', targetId: 'step-identity', payload: { item: 'Solitaire Diamond Ring 2.5ct', uniqrCode: 'UQ-JEWEL-9901' }, durationSec: 6 },
      { step: 2, title: 'Product category', description: 'Classify under 18K White Gold Solitaire.', voiceover: 'Category and precious metal hallmarks are cataloged.', targetId: 'step-cat', payload: { category: 'Fine Diamond Ring' }, durationSec: 6 },
      { step: 3, title: 'Manufacturer', description: 'Record master goldsmith atelier.', voiceover: 'Master goldsmith atelier craftsmanship notes bind.', targetId: 'step-mfg', payload: { atelier: 'UniQR Fine Craftsmanship' }, durationSec: 6 },
      { step: 4, title: 'Material details', description: 'Store 18K Hallmarked White Gold specs.', voiceover: '18K White Gold purity and metal weight log.', targetId: 'step-metal', payload: { metal: '18K White Gold', goldGram: 6.8 }, durationSec: 6 },
      { step: 5, title: 'Weight', description: 'Log exact precision gram & carat weight.', voiceover: 'Precision diamond carat and gram weights are stored.', targetId: 'step-[#1D4533]', payload: { diamondCarat: 2.5, totalGram: 7.3 }, durationSec: 6 },
      { step: 6, title: 'Stone details', description: 'Store GIA VVS1 D-Color solitaire metrics.', voiceover: 'GIA VVS1 D-Color clarity and cut metrics are linked.', targetId: 'step-stone', payload: { clarity: 'VVS1', color: 'D (Colorless)', cut: 'Excellent' }, durationSec: 6 },
      { step: 7, title: 'Certification', description: 'Bind GIA / IGI official grading certificate.', voiceover: 'GIA official grading certificate PDF binds securely.', targetId: 'step-cert', payload: { giaReport: 'GIA-220199401' }, durationSec: 6 },
      { step: 8, title: 'Manufacturing batch', description: 'Log artisan bench production lot.', voiceover: 'Artisan bench lot number is recorded.', targetId: 'step-batch', payload: { benchNo: 'BENCH-991' }, durationSec: 6 },
      { step: 9, title: 'Store assignment', description: 'Assign flagship boutique location.', voiceover: 'Flagship boutique inventory arrival is confirmed.', targetId: 'step-store', payload: { boutique: 'UniQR Diamonds Flagship Mumbai' }, durationSec: 6 },
      { step: 10, title: 'Customer purchase', description: 'Record buyer transaction and invoice.', voiceover: 'Customer purchase generates digital title deed.', targetId: 'step-purchase', payload: { price: '₹4,85,000', invNo: 'JEWEL-INV-881' }, durationSec: 6 },
      { step: 11, title: 'Ownership registration', description: 'Register buyer digital title certificate.', voiceover: 'Digital ownership title certificate registers to buyer.', targetId: 'step-owner', payload: { registeredOwner: 'Mrs. S. Kapoor' }, durationSec: 6 },
      { step: 12, title: 'Warranty', description: 'Activate lifetime stone tightening & polish warranty.', voiceover: 'Lifetime diamond tightening and polish warranty activates.', targetId: 'step-warranty', payload: { warranty: 'Lifetime Maintenance' }, durationSec: 6 },
      { step: 13, title: 'Insurance association', description: 'Bind high-value jewellery insurance policy.', voiceover: 'High-value jewellery insurance policy details attach.', targetId: 'step-ins', payload: { insurer: 'TATA AIG Luxury', policyVal: '₹5,00,000' }, durationSec: 6 },
      { step: 14, title: 'Service/repair', description: 'Log annual prong inspection and rhodium plating.', voiceover: 'Authorized service center logs annual prong check.', targetId: 'step-service', payload: { lastRhodium: '2026-06-15' }, durationSec: 6 },
      { step: 15, title: 'Resale/transfer', description: 'Verify authenticity during resale or inheritance.', voiceover: 'Secondary buyer scans to verify GIA certificate authenticity.', targetId: 'step-resale', payload: { resaleVerified: true }, durationSec: 6 },
      { step: 16, title: 'Authenticity verification', description: 'Instant anti-counterfeit GIA verification scan.', voiceover: 'Instant anti-counterfeit scan confirms original item.', targetId: 'step-auth', payload: { authStatus: 'ORIGINAL_GIA_VERIFIED' }, durationSec: 6 }
    ],
    intelligenceQA: [
      { question: 'Is this solitaire diamond authentic?', answer: 'ORIGINAL_GIA_VERIFIED (GIA-220199401).' },
      { question: 'What are the diamond specifications?', answer: '2.50 Carat, D-Color, VVS1 Clarity, Excellent Cut.' },
      { question: 'Who is the registered owner?', answer: 'Mrs. S. Kapoor (Title Deed Registered).' },
      { question: 'Is the item insured?', answer: 'Yes, Insured for ₹5,00,000 (TATA AIG).' }
    ],
    graphRelationships: [
      { source: 'Diamond Ring', target: 'GIA Report', label: 'CERTIFIED_BY' },
      { source: 'Diamond Ring', target: 'Owner Title', label: 'HELD_BY' },
      { source: 'Diamond Ring', target: 'Insurance Policy', label: 'INSURED_UNDER' }
    ]
  },

  // 15. RENTAL & EQUIPMENT
  {
    id: 'rental',
    title: 'Rental & Equipment',
    subtitle: 'Asset Rental Passport',
    category: 'Assets & Spaces',
    icon: Key,
    description: 'Perfect for equipment rental, tools, cameras, machinery, vehicles and other reusable assets.',
    steps: [
      { step: 1, title: 'Asset creation', description: 'Initialize heavy machinery rental digital twin.', voiceover: 'Rental asset creation initializes permanent twin.', targetId: 'step-identity', payload: { asset: 'JCB 4DX Backhoe Loader', uniqrCode: 'UQ-RENT-7701' }, durationSec: 6 },
      { step: 2, title: 'Asset classification', description: 'Classify under Heavy Earthmoving Equipment.', voiceover: 'Equipment category and rental rate card are set.', targetId: 'step-class', payload: { category: 'Earthmoving Machinery', dayRate: '₹8,500/day' }, durationSec: 6 },
      { step: 3, title: 'Serial-number assignment', description: 'Bind engine and chassis serial tags.', voiceover: 'Chassis serial and hydraulic pump numbers bind.', targetId: 'step-sn', payload: { serial: 'JCB-4DX-89102' }, durationSec: 6 },
      { step: 4, title: 'Owner assignment', description: 'Record rental fleet operator company.', voiceover: 'Rental fleet operator company credentials link.', targetId: 'step-owner', payload: { fleetOwner: 'AGB Heavy Equipment Rentals' }, durationSec: 6 },
      { step: 5, title: 'Warehouse assignment', description: 'Assign equipment holding yard.', voiceover: 'Holding yard position is recorded.', targetId: 'step-yard', payload: { yard: 'Pune Heavy Fleet Yard 2' }, durationSec: 6 },
      { step: 6, title: 'Availability state', description: 'Track asset status (Available vs On Rent).', voiceover: 'Real-time availability status updates in portal.', targetId: 'step-avail', payload: { status: 'AVAILABLE_FOR_RENT' }, durationSec: 6 },
      { step: 7, title: 'Customer booking', description: 'Reserve asset for customer contract.', voiceover: 'Customer booking locks rental reservation dates.', targetId: 'step-booking', payload: { renter: 'Skyline Construction', durationDays: 14 }, durationSec: 6 },
      { step: 8, title: 'Rental agreement', description: 'Attach digital rental agreement contract.', voiceover: 'Digital rental agreement and security deposit link.', targetId: 'step-agree', payload: { contractNo: 'AGREE-RENT-9901' }, durationSec: 6 },
      { step: 9, title: 'Pickup', description: 'Handover dispatch scan on trailer truck.', voiceover: 'Trailer truck pickup scan initiates rental period.', targetId: 'step-pickup', payload: { dispatchDate: '2026-08-01' }, durationSec: 6 },
      { step: 10, title: 'Handover inspection', description: 'Record pre-rental video & scratch inspection.', voiceover: 'Pre-rental handover inspection records machine condition.', targetId: 'step-inspect', payload: { preCondition: 'EXCELLENT_NO_DAMAGE' }, durationSec: 6 },
      { step: 11, title: 'Usage tracking', description: 'Track hour-meter operating runtime.', voiceover: 'Engine hour-meter tracks total operating hours.', targetId: 'step-usage', payload: { hourMeter: '1,245 Hours' }, durationSec: 6 },
      { step: 12, title: 'Damage reporting', description: 'Log any mid-rental breakdown or damage.', voiceover: 'Zero damage recorded during rental period.', targetId: 'step-damage', payload: { damageReported: false }, durationSec: 6 },
      { step: 13, title: 'Return request', description: 'Renter triggers return pickup request.', voiceover: 'Renter triggers return pickup request upon job completion.', targetId: 'step-return', payload: { returnDate: '2026-08-15' }, durationSec: 6 },
      { step: 14, title: 'Return inspection', description: 'Post-rental return inspection signoff.', voiceover: 'Post-rental inspection confirms clean return condition.', targetId: 'step-[#1D4533]', payload: { returnCondition: 'CLEAN_PASS' }, durationSec: 6 },
      { step: 15, title: 'Maintenance', description: 'Perform post-rental greasing and oil change.', voiceover: 'Post-rental hydraulic oil check and greasing complete.', targetId: 'step-maint', payload: { servicedBy: 'tech.fleet@agb.in' }, durationSec: 6 },
      { step: 16, title: 'Next-rental readiness', description: 'Mark asset AVAILABLE for next customer.', voiceover: 'Asset marks AVAILABLE for next customer rental.', targetId: 'step-ready', payload: { nextReadyStatus: 'READY_TO_RENT' }, durationSec: 6 }
    ],
    intelligenceQA: [
      { question: 'Who currently has this rental asset?', answer: 'Skyline Construction (Contract AGREE-RENT-9901).' },
      { question: 'What is the asset operating condition?', answer: 'EXCELLENT (Hour Meter: 1,245 Hours).' },
      { question: 'Was there any damage reported?', answer: 'No damage. Post-rental return PASS.' },
      { question: 'Is it ready for next rental?', answer: 'READY_TO_RENT (Fully Serviced).' }
    ],
    graphRelationships: [
      { source: 'Rental Asset', target: 'Rental Fleet', label: 'OWNED_BY' },
      { source: 'Rental Asset', target: 'Renter Contract', label: 'LEASED_UNDER' },
      { source: 'Rental Asset', target: 'Inspection Record', label: 'CHECKED_BY' }
    ]
  }
];
