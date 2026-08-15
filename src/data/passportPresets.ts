import { PassportConfig, DEFAULT_SECTIONS } from '../types/passport';

// ═══════════════════════════════════════════════════════════════════════════
// 5 Preset Passport Themes — one-click apply in the Passport Builder
// ═══════════════════════════════════════════════════════════════════════════

function makePreset(overrides: Partial<PassportConfig> & { id: string; name: string }): PassportConfig {
  const now = new Date().toISOString();
  return {
    id: overrides.id,
    name: overrides.name,

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
      ...overrides.header,
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
      ...overrides.body,
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
      ...overrides.footer,
    },

    pageBackgroundColor: overrides.pageBackgroundColor || '#F7EAE0',
    maxWidth: overrides.maxWidth || 896,
    borderRadius: overrides.borderRadius || 24,
    showShareButton: overrides.showShareButton ?? true,
    showAiEngineButton: overrides.showAiEngineButton ?? true,
    showLedgerTrailTab: overrides.showLedgerTrailTab ?? true,

    createdAt: now,
    updatedAt: now,
  };
}

// ─── 1. UniQR Classic (current default) ──────────────────────────────────
export const PRESET_CLASSIC = makePreset({
  id: 'preset-classic',
  name: 'UniQR Classic',
  pageBackgroundColor: '#F7EAE0',
  header: {
    showLogo: false, logoUrl: '', logoSize: 48, logoShape: 'rounded',
    brandName: 'UniQR Digital Twin Identity', showBrandName: true,
    brandNameFont: 'Inter', brandNameSize: 18, brandNameColor: '#1D4533',
    tagline: '', showTagline: false, taglineFont: 'Inter', taglineSize: 12, taglineColor: '#5E3122',
    backgroundColor: '#FFFFFF', alignment: 'left',
    padding: { top: 24, right: 24, bottom: 24, left: 24 },
    showVerificationBadge: true, showEntityTypeBadge: true,
  },
  body: {
    backgroundColor: '#FFFFFF',
    cardBackgroundColor: '#F7EAE0', cardBorderColor: '#F9D2BA', cardBorderRadius: 16,
    primaryTextColor: '#1D4533', secondaryTextColor: '#5E3122', accentColor: '#1D4533',
    headingFont: 'Inter', headingSize: 14, bodyFont: 'Inter', bodySize: 13,
    fieldLabelFont: 'Inter', fieldLabelSize: 10, fieldValueFont: 'Inter', fieldValueSize: 12,
    sectionSpacing: 32, fieldSpacing: 12,
    padding: { top: 0, right: 24, bottom: 0, left: 24 },
    sections: [...DEFAULT_SECTIONS],
  },
});

// ─── 2. Corporate Dark ───────────────────────────────────────────────────
export const PRESET_DARK = makePreset({
  id: 'preset-dark',
  name: 'Corporate Dark',
  pageBackgroundColor: '#0F172A',
  borderRadius: 20,
  header: {
    showLogo: false, logoUrl: '', logoSize: 48, logoShape: 'rounded',
    brandName: 'UniQR Digital Twin Identity', showBrandName: true,
    brandNameFont: 'Inter', brandNameSize: 18, brandNameColor: '#E2E8F0',
    tagline: '', showTagline: false, taglineFont: 'Inter', taglineSize: 12, taglineColor: '#94A3B8',
    backgroundColor: '#1E293B', alignment: 'left',
    padding: { top: 24, right: 24, bottom: 24, left: 24 },
    showVerificationBadge: true, showEntityTypeBadge: true,
  },
  body: {
    backgroundColor: '#1E293B',
    cardBackgroundColor: '#334155', cardBorderColor: '#475569', cardBorderRadius: 14,
    primaryTextColor: '#F1F5F9', secondaryTextColor: '#94A3B8', accentColor: '#3B82F6',
    headingFont: 'Inter', headingSize: 14, bodyFont: 'Inter', bodySize: 13,
    fieldLabelFont: 'Inter', fieldLabelSize: 10, fieldValueFont: 'Inter', fieldValueSize: 12,
    sectionSpacing: 32, fieldSpacing: 12,
    padding: { top: 0, right: 24, bottom: 0, left: 24 },
    sections: [...DEFAULT_SECTIONS],
  },
  footer: {
    backgroundColor: '#1E293B', textColor: '#94A3B8', font: 'Inter', fontSize: 12,
    alignment: 'center', padding: { top: 16, right: 24, bottom: 24, left: 24 },
    showActionButtons: true, showBackButton: true,
    customFooterText: '', showCustomFooterText: false,
  },
});

// ─── 3. Minimal White ────────────────────────────────────────────────────
export const PRESET_MINIMAL = makePreset({
  id: 'preset-minimal',
  name: 'Minimal White',
  pageBackgroundColor: '#FAFAFA',
  borderRadius: 16,
  header: {
    showLogo: false, logoUrl: '', logoSize: 44, logoShape: 'circle',
    brandName: 'UniQR Digital Twin Identity', showBrandName: true,
    brandNameFont: 'Outfit', brandNameSize: 17, brandNameColor: '#111827',
    tagline: '', showTagline: false, taglineFont: 'Outfit', taglineSize: 12, taglineColor: '#6B7280',
    backgroundColor: '#FFFFFF', alignment: 'center',
    padding: { top: 28, right: 28, bottom: 20, left: 28 },
    showVerificationBadge: true, showEntityTypeBadge: false,
  },
  body: {
    backgroundColor: '#FFFFFF',
    cardBackgroundColor: '#F9FAFB', cardBorderColor: '#E5E7EB', cardBorderRadius: 12,
    primaryTextColor: '#111827', secondaryTextColor: '#6B7280', accentColor: '#111827',
    headingFont: 'Outfit', headingSize: 14, bodyFont: 'Outfit', bodySize: 13,
    fieldLabelFont: 'Outfit', fieldLabelSize: 10, fieldValueFont: 'Outfit', fieldValueSize: 12,
    sectionSpacing: 28, fieldSpacing: 10,
    padding: { top: 0, right: 28, bottom: 0, left: 28 },
    sections: [...DEFAULT_SECTIONS],
  },
  footer: {
    backgroundColor: '#FFFFFF', textColor: '#6B7280', font: 'Outfit', fontSize: 12,
    alignment: 'center', padding: { top: 16, right: 28, bottom: 24, left: 28 },
    showActionButtons: true, showBackButton: true,
    customFooterText: '', showCustomFooterText: false,
  },
});

// ─── 4. Vibrant Brand ────────────────────────────────────────────────────
export const PRESET_VIBRANT = makePreset({
  id: 'preset-vibrant',
  name: 'Vibrant Brand',
  pageBackgroundColor: '#FDF2F8',
  borderRadius: 28,
  header: {
    showLogo: false, logoUrl: '', logoSize: 52, logoShape: 'circle',
    brandName: 'UniQR Digital Twin Identity', showBrandName: true,
    brandNameFont: 'Poppins', brandNameSize: 19, brandNameColor: '#831843',
    tagline: '', showTagline: false, taglineFont: 'Poppins', taglineSize: 12, taglineColor: '#BE185D',
    backgroundColor: '#FFFFFF', alignment: 'left',
    padding: { top: 24, right: 24, bottom: 24, left: 24 },
    showVerificationBadge: true, showEntityTypeBadge: true,
  },
  body: {
    backgroundColor: '#FFFFFF',
    cardBackgroundColor: '#FDF2F8', cardBorderColor: '#FBCFE8', cardBorderRadius: 18,
    primaryTextColor: '#831843', secondaryTextColor: '#BE185D', accentColor: '#DB2777',
    headingFont: 'Poppins', headingSize: 14, bodyFont: 'Poppins', bodySize: 13,
    fieldLabelFont: 'Poppins', fieldLabelSize: 10, fieldValueFont: 'Poppins', fieldValueSize: 12,
    sectionSpacing: 32, fieldSpacing: 12,
    padding: { top: 0, right: 24, bottom: 0, left: 24 },
    sections: [...DEFAULT_SECTIONS],
  },
  footer: {
    backgroundColor: '#FFFFFF', textColor: '#BE185D', font: 'Poppins', fontSize: 12,
    alignment: 'center', padding: { top: 16, right: 24, bottom: 24, left: 24 },
    showActionButtons: true, showBackButton: true,
    customFooterText: '', showCustomFooterText: false,
  },
});

// ─── 5. Eco Green ────────────────────────────────────────────────────────
export const PRESET_ECO = makePreset({
  id: 'preset-eco',
  name: 'Eco Green',
  pageBackgroundColor: '#F0FDF4',
  borderRadius: 22,
  header: {
    showLogo: false, logoUrl: '', logoSize: 48, logoShape: 'rounded',
    brandName: 'UniQR Digital Twin Identity', showBrandName: true,
    brandNameFont: 'Nunito Sans', brandNameSize: 18, brandNameColor: '#14532D',
    tagline: '', showTagline: false, taglineFont: 'Nunito Sans', taglineSize: 12, taglineColor: '#166534',
    backgroundColor: '#FFFFFF', alignment: 'left',
    padding: { top: 24, right: 24, bottom: 24, left: 24 },
    showVerificationBadge: true, showEntityTypeBadge: true,
  },
  body: {
    backgroundColor: '#FFFFFF',
    cardBackgroundColor: '#F0FDF4', cardBorderColor: '#BBF7D0', cardBorderRadius: 14,
    primaryTextColor: '#14532D', secondaryTextColor: '#166534', accentColor: '#16A34A',
    headingFont: 'Nunito Sans', headingSize: 14, bodyFont: 'Nunito Sans', bodySize: 13,
    fieldLabelFont: 'Nunito Sans', fieldLabelSize: 10, fieldValueFont: 'Nunito Sans', fieldValueSize: 12,
    sectionSpacing: 30, fieldSpacing: 12,
    padding: { top: 0, right: 24, bottom: 0, left: 24 },
    sections: [...DEFAULT_SECTIONS],
  },
  footer: {
    backgroundColor: '#FFFFFF', textColor: '#166534', font: 'Nunito Sans', fontSize: 12,
    alignment: 'center', padding: { top: 16, right: 24, bottom: 24, left: 24 },
    showActionButtons: true, showBackButton: true,
    customFooterText: '', showCustomFooterText: false,
  },
});

// ═══════════════════════════════════════════════════════════════════════════
// All presets exported as a collection
// ═══════════════════════════════════════════════════════════════════════════

export const PASSPORT_PRESETS: PassportConfig[] = [
  PRESET_CLASSIC,
  PRESET_DARK,
  PRESET_MINIMAL,
  PRESET_VIBRANT,
  PRESET_ECO,
];
