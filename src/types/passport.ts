// ═══════════════════════════════════════════════════════════════════════════
// PassportConfig — Full configuration model for the Digital Passport page
// ═══════════════════════════════════════════════════════════════════════════

export interface PassportPadding {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export interface PassportHeaderConfig {
  showLogo: boolean;
  logoUrl: string;                 // base64 data URL or https URL
  logoSize: number;                // px, 32-80
  logoShape: 'square' | 'rounded' | 'circle';
  brandName: string;
  showBrandName: boolean;
  brandNameFont: string;
  brandNameSize: number;           // px
  brandNameColor: string;          // hex
  tagline: string;
  showTagline: boolean;
  taglineFont: string;
  taglineSize: number;
  taglineColor: string;
  backgroundColor: string;
  alignment: 'left' | 'center' | 'right';
  padding: PassportPadding;
  showVerificationBadge: boolean;
  showEntityTypeBadge: boolean;
}

export interface PassportSectionConfig {
  id: string;
  type: 'hero' | 'metadata_grid' | 'builder_sections' | 'custom_fields' | 'connected_apps' | 'price_badge' | 'tags' | 'description' | 'images' | 'urls';
  label: string;
  visible: boolean;
  order: number;
}

export interface PassportBodyConfig {
  backgroundColor: string;
  cardBackgroundColor: string;
  cardBorderColor: string;
  cardBorderRadius: number;        // px
  primaryTextColor: string;
  secondaryTextColor: string;
  accentColor: string;
  headingFont: string;
  headingSize: number;
  bodyFont: string;
  bodySize: number;
  fieldLabelFont: string;
  fieldLabelSize: number;
  fieldValueFont: string;
  fieldValueSize: number;
  sectionSpacing: number;          // px
  fieldSpacing: number;            // px
  padding: PassportPadding;
  sections: PassportSectionConfig[];
}

export interface PassportFooterConfig {
  backgroundColor: string;
  textColor: string;
  font: string;
  fontSize: number;
  alignment: 'left' | 'center' | 'right';
  padding: PassportPadding;
  showActionButtons: boolean;
  showBackButton: boolean;
  customFooterText: string;
  showCustomFooterText: boolean;
  // "Powered by UniQR — agbtechnologies.com" is ALWAYS rendered (non-configurable)
}

export interface PassportConfig {
  id: string;
  name: string;

  header: PassportHeaderConfig;
  body: PassportBodyConfig;
  footer: PassportFooterConfig;

  // Global page settings
  pageBackgroundColor: string;
  maxWidth: number;                // px, 640-1200
  borderRadius: number;            // outer card radius in px
  showShareButton: boolean;
  showAiEngineButton: boolean;
  showLedgerTrailTab: boolean;

  createdAt: string;
  updatedAt: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// Default section ordering — all sections visible
// ═══════════════════════════════════════════════════════════════════════════

export const DEFAULT_SECTIONS: PassportSectionConfig[] = [
  { id: 'hero', type: 'hero', label: 'Product Name & Identity', visible: true, order: 0 },
  { id: 'price', type: 'price_badge', label: 'Price Badge', visible: true, order: 1 },
  { id: 'tags', type: 'tags', label: 'Brand, Model & Serial Tags', visible: true, order: 2 },
  { id: 'description', type: 'description', label: 'Description', visible: true, order: 3 },
  { id: 'metadata', type: 'metadata_grid', label: 'Metadata Grid (Manufacturer, Batch, Dates, Warranty)', visible: true, order: 4 },
  { id: 'builder', type: 'builder_sections', label: 'Dynamic Block Builder Specifications', visible: true, order: 5 },
  { id: 'custom', type: 'custom_fields', label: 'Custom Dynamic Fields', visible: true, order: 6 },
  { id: 'images', type: 'images', label: 'Product Images', visible: true, order: 7 },
  { id: 'urls', type: 'urls', label: 'External Links & URLs', visible: true, order: 8 },
  { id: 'apps', type: 'connected_apps', label: 'Connected Ecosystem Applications', visible: true, order: 9 },
];

// ═══════════════════════════════════════════════════════════════════════════
// Available Google Fonts (these are preloaded in index.html)
// ═══════════════════════════════════════════════════════════════════════════

export const PASSPORT_FONTS = [
  'Inter',
  'Roboto',
  'Outfit',
  'Poppins',
  'Nunito Sans',
  'DM Sans',
  'Space Grotesk',
  'Playfair Display',
] as const;

export type PassportFont = typeof PASSPORT_FONTS[number];

// ═══════════════════════════════════════════════════════════════════════════
// Default passport config — UniQR Classic theme
// ═══════════════════════════════════════════════════════════════════════════

export const DEFAULT_PASSPORT_CONFIG: PassportConfig = {
  id: 'default',
  name: 'UniQR Classic',

  header: {
    showLogo: false,
    logoUrl: '',
    logoSize: 48,
    logoShape: 'rounded',
    brandName: 'UniQR Digital Twin Identity',
    showBrandName: true,
    brandNameFont: 'Inter',
    brandNameSize: 18,
    brandNameColor: '#1D4533',
    tagline: '',
    showTagline: false,
    taglineFont: 'Inter',
    taglineSize: 12,
    taglineColor: '#5E3122',
    backgroundColor: '#FFFFFF',
    alignment: 'left',
    padding: { top: 24, right: 24, bottom: 24, left: 24 },
    showVerificationBadge: true,
    showEntityTypeBadge: true,
  },

  body: {
    backgroundColor: '#FFFFFF',
    cardBackgroundColor: '#F7EAE0',
    cardBorderColor: '#F9D2BA',
    cardBorderRadius: 16,
    primaryTextColor: '#1D4533',
    secondaryTextColor: '#5E3122',
    accentColor: '#1D4533',
    headingFont: 'Inter',
    headingSize: 14,
    bodyFont: 'Inter',
    bodySize: 13,
    fieldLabelFont: 'Inter',
    fieldLabelSize: 10,
    fieldValueFont: 'Inter',
    fieldValueSize: 12,
    sectionSpacing: 32,
    fieldSpacing: 12,
    padding: { top: 0, right: 24, bottom: 0, left: 24 },
    sections: [...DEFAULT_SECTIONS],
  },

  footer: {
    backgroundColor: '#FFFFFF',
    textColor: '#5E3122',
    font: 'Inter',
    fontSize: 12,
    alignment: 'center',
    padding: { top: 16, right: 24, bottom: 24, left: 24 },
    showActionButtons: true,
    showBackButton: true,
    customFooterText: '',
    showCustomFooterText: false,
  },

  pageBackgroundColor: '#F7EAE0',
  maxWidth: 896,
  borderRadius: 24,
  showShareButton: true,
  showAiEngineButton: true,
  showLedgerTrailTab: true,

  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};
