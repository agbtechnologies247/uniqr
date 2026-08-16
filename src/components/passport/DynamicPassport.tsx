import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  ExternalLink,
  Layers,
  Award,
  FileText,
  Building2,
  Network,
  Share2,
  History,
  PlusCircle,
  Tag,
  BadgeCheck,
  Image as ImageIcon,
  Link as LinkIcon,
  FileDown,
  Phone,
  Mail,
  Globe
} from 'lucide-react';
import { Product, TamperEvidentTrailEvent, PassportConfig } from '../../types';
import { TrailLedger } from '../../services/trailLedger';
import { AiInsightsModal } from '../ai/AiInsightsModal';

interface DynamicPassportProps {
  product: Product;
  config: PassportConfig;
  entityType?: string;
  onBackToApp: () => void;
  isPreview?: boolean; // When true, disables action callbacks
}

/**
 * DynamicPassport — Config-driven passport renderer
 *
 * Renders the scanned QR passport page using the PassportConfig
 * for layout, colors, fonts, section visibility, and ordering.
 * Replaces the old hardcoded ProductPassport component.
 */
export const DynamicPassport: React.FC<DynamicPassportProps> = ({
  product: initialProduct,
  config,
  entityType = 'product',
  onBackToApp,
  isPreview = false,
}) => {
  const [product, setProduct] = useState<Product>(initialProduct || ({} as any));
  const [viewMode, setViewMode] = useState<'public' | 'trail'>('public');
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);

  React.useEffect(() => {
    if (initialProduct) setProduct(initialProduct);
  }, [initialProduct]);

  const trailEvents = product?.trailEvents || [];
  const chainIntegrity = TrailLedger.verifyChainIntegrity(trailEvents);
  const priceValue = product?.customFields?.['Price (₹)'] || '';

  const { header, body, footer } = config;

  // Sort visible sections by order
  const visibleSections = [...body.sections]
    .filter(s => s.visible)
    .sort((a, b) => a.order - b.order);

  // ─── Inline style builders ──────────────────────────────────────────
  const padStyle = (p: { top: number; right: number; bottom: number; left: number }) =>
    `${p.top}px ${p.right}px ${p.bottom}px ${p.left}px`;

  const headerStyle: React.CSSProperties = {
    backgroundColor: header.backgroundColor,
    padding: padStyle(header.padding),
    textAlign: header.alignment,
    borderBottom: `1px solid ${body.cardBorderColor}`,
  };

  const bodyStyle: React.CSSProperties = {
    backgroundColor: body.backgroundColor,
    padding: padStyle(body.padding),
  };

  const footerStyle: React.CSSProperties = {
    backgroundColor: footer.backgroundColor,
    padding: padStyle(footer.padding),
    textAlign: footer.alignment,
    borderTop: `1px solid ${body.cardBorderColor}`,
  };

  const cardStyle: React.CSSProperties = {
    backgroundColor: body.cardBackgroundColor,
    border: `1px solid ${body.cardBorderColor}`,
    borderRadius: `${body.cardBorderRadius}px`,
    padding: '24px',
  };

  const fieldCardStyle: React.CSSProperties = {
    backgroundColor: body.backgroundColor,
    border: `1px solid ${body.cardBorderColor}`,
    borderRadius: `${Math.max(body.cardBorderRadius - 4, 8)}px`,
    padding: '12px',
  };

  // ─── Section renderers ──────────────────────────────────────────────

  const renderHero = () => (
    <div style={{ ...cardStyle, display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
        {header.showEntityTypeBadge && entityType !== 'product' && entityType !== 'unregistered' && (
          <span style={{
            fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em',
            padding: '2px 10px', borderRadius: '9999px',
            backgroundColor: body.accentColor, color: body.backgroundColor,
            fontFamily: body.headingFont,
          }}>
            {entityType.replace(/_/g, ' ')} Identity
          </span>
        )}
        <span style={{
          fontSize: '10px', fontWeight: 800, textTransform: 'uppercase',
          padding: '2px 10px', borderRadius: '9999px',
          backgroundColor: body.cardBackgroundColor, color: body.primaryTextColor,
          border: `1px solid ${body.cardBorderColor}`,
          fontFamily: body.headingFont,
        }}>
          {product.category || entityType.replace(/_/g, ' ')}
        </span>
        {entityType === 'unregistered' && (
          <span style={{
            fontSize: '10px', fontWeight: 800, textTransform: 'uppercase',
            padding: '2px 10px', borderRadius: '9999px',
            backgroundColor: body.secondaryTextColor, color: body.backgroundColor,
            fontFamily: body.headingFont,
          }}>
            Not Registered
          </span>
        )}
      </div>

      <h1 style={{
        fontSize: '28px', fontWeight: 800,
        color: body.primaryTextColor,
        fontFamily: body.headingFont,
        lineHeight: 1.2, margin: 0,
      }}>
        {product.name || 'Unknown Product'}
      </h1>
    </div>
  );

  const renderPriceBadge = () => {
    if (!priceValue) return null;
    return (
      <div style={{
        ...fieldCardStyle,
        textAlign: 'center', padding: '16px 20px',
        backgroundColor: body.backgroundColor,
        border: `1px solid ${body.cardBorderColor}`,
      }}>
        <div style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', color: body.secondaryTextColor, fontFamily: body.fieldLabelFont, letterSpacing: '0.05em' }}>
          Product Price
        </div>
        <div style={{ fontSize: '24px', fontWeight: 800, color: body.primaryTextColor, fontFamily: body.fieldValueFont, marginTop: '4px' }}>
          {priceValue}
        </div>
        <div style={{ fontSize: '10px', fontWeight: 700, color: body.primaryTextColor, fontFamily: body.fieldLabelFont, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', marginTop: '4px' }}>
          <BadgeCheck style={{ width: 14, height: 14 }} /> Verified Price
        </div>
      </div>
    );
  };

  const renderTags = () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
      {[
        { label: 'Brand', value: product.brand },
        { label: 'Model / SKU', value: product.sku },
        { label: 'Serial', value: product.serialNumber },
      ].map(tag => (
        <span key={tag.label} style={{
          fontSize: `${body.fieldValueSize}px`, fontWeight: 700,
          padding: '4px 12px', borderRadius: `${body.cardBorderRadius}px`,
          backgroundColor: body.backgroundColor,
          border: `1px solid ${body.cardBorderColor}`,
          color: body.primaryTextColor,
          fontFamily: body.fieldValueFont,
        }}>
          {tag.label}: <strong>{tag.value || 'N/A'}</strong>
        </span>
      ))}
    </div>
  );

  const renderDescription = () => {
    if (!product.description) return null;
    return (
      <p style={{
        fontSize: `${body.bodySize}px`, color: body.secondaryTextColor,
        fontFamily: body.bodyFont, lineHeight: 1.6, margin: 0,
        maxWidth: '640px',
      }}>
        {product.description}
      </p>
    );
  };

  const renderMetadataGrid = () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: `${body.fieldSpacing}px` }}>
      {[
        { label: 'Manufacturer', value: product.manufacturer },
        { label: 'Batch & HSN', value: product.batchNumber || 'N/A', sub: `HSN Code: ${product.hsn || 'N/A'}` },
        { label: 'Mfg & Expiry', value: product.mfgDate || 'N/A', sub: `Exp: ${product.expDate || 'N/A'}` },
        { label: 'Warranty Status', value: product.warrantyMonths ? `${product.warrantyMonths} Months Active` : 'N/A', sub: product.warrantyMonths ? '● Verified' : '' },
      ].map(item => (
        <div key={item.label} style={{ ...cardStyle, padding: '16px' }}>
          <span style={{ display: 'block', fontSize: `${body.fieldLabelSize}px`, fontWeight: 700, textTransform: 'uppercase', color: body.secondaryTextColor, fontFamily: body.fieldLabelFont }}>
            {item.label}
          </span>
          <span style={{ display: 'block', fontSize: `${body.fieldValueSize + 2}px`, fontWeight: 800, color: body.primaryTextColor, fontFamily: body.fieldValueFont, marginTop: '4px' }}>
            {item.value || 'N/A'}
          </span>
          {item.sub && (
            <span style={{ display: 'block', fontSize: `${body.fieldLabelSize}px`, color: body.secondaryTextColor, fontFamily: body.fieldLabelFont, marginTop: '2px' }}>
              {item.sub}
            </span>
          )}
        </div>
      ))}
    </div>
  );

  const renderBuilderSections = () => {
    if (!product.builderSections || product.builderSections.length === 0) return null;
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: `${body.fieldSpacing}px` }}>
        <h3 style={{
          fontWeight: 800, fontSize: `${body.headingSize}px`, color: body.primaryTextColor,
          textTransform: 'uppercase', letterSpacing: '0.05em',
          fontFamily: body.headingFont,
          display: 'flex', alignItems: 'center', gap: '8px',
          borderBottom: `1px solid ${body.cardBorderColor}`, paddingBottom: '8px',
          margin: 0,
        }}>
          <Layers style={{ width: 16, height: 16, color: body.primaryTextColor }} />
          Dynamic Block Builder Specifications
        </h3>
        {product.builderSections.map(sec => (
          <div key={sec.id} style={{ ...cardStyle, display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontWeight: 800, fontSize: `${body.fieldValueSize}px`, color: body.primaryTextColor, fontFamily: body.headingFont }}>{sec.title}</span>
                <span style={{
                  padding: '2px 8px', borderRadius: '9999px',
                  backgroundColor: body.backgroundColor, border: `1px solid ${body.cardBorderColor}`,
                  color: body.primaryTextColor, fontSize: '9px', fontWeight: 700, textTransform: 'uppercase',
                  fontFamily: body.fieldLabelFont,
                }}>
                  {sec.category}
                </span>
              </div>
              <span style={{ fontSize: `${body.fieldLabelSize}px`, color: body.secondaryTextColor, fontFamily: body.fieldLabelFont, fontWeight: 600 }}>
                {sec.fields.length} Configured Fields
              </span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: `${body.fieldSpacing}px` }}>
              {sec.fields.map(f => (
                <div key={f.id} style={{ ...fieldCardStyle, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: `${body.fieldLabelSize}px`, fontWeight: 800, textTransform: 'uppercase', color: body.secondaryTextColor, fontFamily: body.fieldLabelFont }}>{f.name}</span>
                    <span style={{ fontSize: '9px', padding: '1px 6px', borderRadius: '4px', backgroundColor: body.cardBackgroundColor, color: body.primaryTextColor, fontWeight: 700, fontFamily: body.fieldLabelFont }}>{f.type}</span>
                  </div>
                  <div style={{ fontWeight: 800, fontSize: `${body.fieldValueSize}px`, color: body.primaryTextColor, fontFamily: body.fieldValueFont, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {typeof f.value === 'boolean' ? (f.value ? '✓ True / Pass' : '✗ False / Fail') : String(f.value || 'N/A')}
                  </div>
                  {f.validation?.isPublic && (
                    <span style={{ fontSize: '9px', color: body.primaryTextColor, fontWeight: 700, fontFamily: body.fieldLabelFont }}>● Public Field</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderCustomFields = () => {
    if (!product.customFields || Object.keys(product.customFields).length === 0) return null;
    return (
      <div style={{ ...cardStyle, display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <h3 style={{
          fontWeight: 800, fontSize: `${body.headingSize}px`, color: body.primaryTextColor,
          textTransform: 'uppercase', letterSpacing: '0.05em', fontFamily: body.headingFont,
          display: 'flex', alignItems: 'center', gap: '8px', margin: 0,
        }}>
          <Tag style={{ width: 16, height: 16, color: body.primaryTextColor }} />
          Custom Dynamic Field Specifications
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: `${body.fieldSpacing}px` }}>
          {Object.entries(product.customFields).map(([key, val]) => (
            <div key={key} style={fieldCardStyle}>
              <span style={{ display: 'block', fontSize: `${body.fieldLabelSize}px`, fontWeight: 700, textTransform: 'uppercase', color: body.secondaryTextColor, fontFamily: body.fieldLabelFont }}>{key}</span>
              <span style={{ display: 'block', fontWeight: 700, fontSize: `${body.fieldValueSize}px`, color: body.primaryTextColor, fontFamily: body.fieldValueFont, marginTop: '4px' }}>{String(val)}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderImages = () => {
    const allImages = [
      ...(product.galleryImages || []),
      ...(product.imageUrl && !(product.galleryImages?.some(g => g.dataUrl === product.imageUrl))
        ? [{ id: 'primary', name: 'Primary Photo', size: 0, dataUrl: product.imageUrl, uploadedAt: '' }]
        : [])
    ];
    if (allImages.length === 0) return null;
    return (
      <div style={{ ...cardStyle, display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <h3 style={{
          fontWeight: 800, fontSize: `${body.headingSize}px`, color: body.primaryTextColor,
          textTransform: 'uppercase', letterSpacing: '0.05em', fontFamily: body.headingFont,
          display: 'flex', alignItems: 'center', gap: '8px', margin: 0,
        }}>
          <ImageIcon style={{ width: 16, height: 16, color: body.primaryTextColor }} />
          Verified Images ({allImages.length})
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: allImages.length === 1 ? '1fr' : 'repeat(2, 1fr)', gap: '10px' }}>
          {allImages.map((img) => (
            <div key={img.id} style={{ borderRadius: `${body.cardBorderRadius}px`, overflow: 'hidden', border: `1px solid ${body.cardBorderColor}`, maxHeight: 220 }}>
              <img
                src={img.dataUrl}
                alt={img.name || product.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderUrls = () => {
    // Official PDF Document
    const hasPdf = Boolean(product.pdfDocument);
    // Contact channels & URL fields
    const urlFields = Object.entries(product.customFields || {}).filter(
      ([, val]) => typeof val === 'string' && (val.startsWith('http://') || val.startsWith('https://'))
    );
    const hasContact = Boolean(product.websiteUrl || product.contactEmail || product.contactPhone || urlFields.length > 0 || hasPdf);
    if (!hasContact) return null;

    return (
      <div style={{ ...cardStyle, display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <h3 style={{
          fontWeight: 800, fontSize: `${body.headingSize}px`, color: body.primaryTextColor,
          textTransform: 'uppercase', letterSpacing: '0.05em', fontFamily: body.headingFont,
          display: 'flex', alignItems: 'center', gap: '8px', margin: 0,
        }}>
          <Globe style={{ width: 16, height: 16, color: body.primaryTextColor }} />
          Verified Documents &amp; External Channels
        </h3>

        {/* PDF Document Download */}
        {product.pdfDocument && (
          <div style={{
            ...fieldCardStyle,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', gap: '12px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <FileText style={{ width: 20, height: 20, color: body.accentColor }} />
              <div>
                <strong style={{ fontSize: `${body.fieldValueSize}px`, color: body.primaryTextColor, fontFamily: body.fieldValueFont }}>
                  {product.pdfDocument.name}
                </strong>
                <span style={{ display: 'block', fontSize: `${body.fieldLabelSize}px`, color: body.secondaryTextColor }}>
                  {(product.pdfDocument.size / (1024 * 1024)).toFixed(2)} MB • Official PDF
                </span>
              </div>
            </div>
            <a
              href={product.pdfDocument.dataUrl}
              download={product.pdfDocument.name}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '8px 14px', borderRadius: '10px',
                backgroundColor: body.accentColor, color: '#fff',
                fontSize: `${body.bodySize}px`, fontWeight: 700, textDecoration: 'none'
              }}
            >
              <FileDown style={{ width: 14, height: 14 }} /> Download
            </a>
          </div>
        )}

        {/* Action buttons for website, email, phone */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '8px' }}>
          {product.websiteUrl && (
            <a
              href={product.websiteUrl.startsWith('http') ? product.websiteUrl : `https://${product.websiteUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                ...fieldCardStyle,
                display: 'flex', alignItems: 'center', gap: '8px',
                color: body.accentColor, fontFamily: body.bodyFont, fontSize: `${body.bodySize}px`,
                fontWeight: 700, textDecoration: 'none',
              }}
            >
              <Globe style={{ width: 14, height: 14 }} />
              Official Portal
            </a>
          )}

          {product.contactEmail && (
            <a
              href={`mailto:${product.contactEmail}`}
              style={{
                ...fieldCardStyle,
                display: 'flex', alignItems: 'center', gap: '8px',
                color: body.accentColor, fontFamily: body.bodyFont, fontSize: `${body.bodySize}px`,
                fontWeight: 700, textDecoration: 'none',
              }}
            >
              <Mail style={{ width: 14, height: 14 }} />
              {product.contactEmail}
            </a>
          )}

          {product.contactPhone && (
            <a
              href={`tel:${product.contactPhone}`}
              style={{
                ...fieldCardStyle,
                display: 'flex', alignItems: 'center', gap: '8px',
                color: body.accentColor, fontFamily: body.bodyFont, fontSize: `${body.bodySize}px`,
                fontWeight: 700, textDecoration: 'none',
              }}
            >
              <Phone style={{ width: 14, height: 14 }} />
              {product.contactPhone}
            </a>
          )}

          {urlFields.map(([key, val]) => (
            <a
              key={key}
              href={val}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                ...fieldCardStyle,
                display: 'flex', alignItems: 'center', gap: '8px',
                color: body.accentColor, fontFamily: body.bodyFont, fontSize: `${body.bodySize}px`,
                fontWeight: 600, textDecoration: 'none',
              }}
            >
              <ExternalLink style={{ width: 14, height: 14 }} />
              {key}
            </a>
          ))}
        </div>
      </div>
    );
  };

  const renderConnectedApps = () => {
    const apps = product.connectedApps || [];
    if (apps.length === 0) return null;
    return (
      <div style={{ ...cardStyle, display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{
            fontWeight: 800, fontSize: `${body.headingSize}px`, color: body.primaryTextColor,
            fontFamily: body.headingFont, display: 'flex', alignItems: 'center', gap: '8px', margin: 0,
          }}>
            <Network style={{ width: 16, height: 16, color: body.primaryTextColor }} />
            Connected Ecosystem Applications
          </h3>
          <span style={{ fontSize: `${body.fieldLabelSize}px`, fontWeight: 700, color: body.secondaryTextColor, fontFamily: body.fieldLabelFont, textTransform: 'uppercase' }}>
            Connected Intelligence Nodes
          </span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: `${body.fieldSpacing}px` }}>
          {apps.map(app => (
            <div key={app} style={{
              ...fieldCardStyle,
              display: 'flex', alignItems: 'center', gap: '8px',
              fontSize: `${body.fieldValueSize}px`, fontWeight: 700,
              color: body.primaryTextColor, fontFamily: body.fieldValueFont,
            }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: body.accentColor, flexShrink: 0 }} />
              {app}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderActions = () => {
    const rawActions = product.scanBehavior?.actions || [];
    if (rawActions.length === 0) return null;
    return (
      <div style={{ ...cardStyle, display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <h3 style={{
          fontWeight: 800, fontSize: `${body.headingSize}px`, color: body.primaryTextColor,
          textTransform: 'uppercase', letterSpacing: '0.05em', fontFamily: body.headingFont,
          display: 'flex', alignItems: 'center', gap: '8px', margin: 0,
        }}>
          <Sparkles style={{ width: 16, height: 16, color: body.primaryTextColor }} />
          Interactive Operations & Actions
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: `${body.fieldSpacing}px` }}>
          {rawActions.map(act => (
            <button
              key={act.id}
              onClick={() => {
                if (isPreview) return;
                alert(`Action triggered: "${act.label}" for entity ${product.name}`);
              }}
              style={{
                ...fieldCardStyle,
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '10px 14px', cursor: 'pointer', textAlign: 'left',
                backgroundColor: body.cardBackgroundColor,
                color: body.primaryTextColor, fontWeight: 700,
                fontSize: `${body.fieldValueSize}px`,
                border: `1px solid ${body.cardBorderColor}`,
                transition: 'all 0.2s',
              }}
            >
              <div style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: body.accentColor, flexShrink: 0 }} />
              <span style={{ flex: 1 }}>{act.label}</span>
            </button>
          ))}
        </div>
      </div>
    );
  };

  const renderRelationships = () => {
    const rels = product.relationships || [];
    if (rels.length === 0) return null;
    return (
      <div style={{ ...cardStyle, display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <h3 style={{
          fontWeight: 800, fontSize: `${body.headingSize}px`, color: body.primaryTextColor,
          textTransform: 'uppercase', letterSpacing: '0.05em', fontFamily: body.headingFont,
          display: 'flex', alignItems: 'center', gap: '8px', margin: 0,
        }}>
          <Network style={{ width: 16, height: 16, color: body.primaryTextColor }} />
          Inter-Entity Graph Relationships
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: `${body.fieldSpacing}px` }}>
          {rels.map(rel => (
            <div key={rel.id} style={fieldCardStyle}>
              <span style={{
                fontSize: '9px', fontWeight: 800, textTransform: 'uppercase',
                padding: '2px 8px', borderRadius: '4px',
                backgroundColor: body.cardBackgroundColor, color: body.primaryTextColor,
                display: 'inline-block', marginBottom: '4px'
              }}>
                {rel.relationType}
              </span>
              <div style={{ fontWeight: 800, fontSize: `${body.fieldValueSize}px`, color: body.primaryTextColor }}>
                {rel.targetEntityName || rel.targetEntityId}
              </div>
              <span style={{ fontSize: '10px', color: body.secondaryTextColor, fontFamily: 'monospace' }}>
                Token: {rel.targetEntityId}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Map section type → renderer
  const sectionRenderers: Record<string, () => React.ReactNode> = {
    hero: renderHero,
    price_badge: renderPriceBadge,
    tags: renderTags,
    description: renderDescription,
    metadata_grid: renderMetadataGrid,
    builder_sections: renderBuilderSections,
    custom_fields: renderCustomFields,
    images: renderImages,
    urls: renderUrls,
    connected_apps: renderConnectedApps,
  };

  // ─── Trail View ─────────────────────────────────────────────────────
  const renderTrailView = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Chain Integrity Banner */}
      <div style={{ ...cardStyle, display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <ShieldCheck style={{ width: 24, height: 24, color: body.primaryTextColor, flexShrink: 0 }} />
          <div>
            <h4 style={{ fontWeight: 800, fontSize: `${body.headingSize}px`, color: body.primaryTextColor, fontFamily: body.headingFont, margin: 0 }}>
              {chainIntegrity.isValid ? 'Tamper-Evident SHA-256 Chain Verified' : 'Cryptographic Chain Error'}
            </h4>
            <p style={{ fontSize: `${body.fieldValueSize}px`, color: body.secondaryTextColor, fontFamily: body.bodyFont, margin: '4px 0 0' }}>
              {chainIntegrity.isValid
                ? 'Append-only ledger contains zero altered or deleted historical records.'
                : `Chain verification failed at index ${chainIntegrity.brokenAtIndex}.`}
            </p>
          </div>
        </div>
      </div>

      {/* Trail Events */}
      {trailEvents.map((evt, idx) => (
        <div key={evt.id} style={{ ...cardStyle, display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{
                width: 24, height: 24, borderRadius: '50%',
                backgroundColor: body.accentColor, color: body.backgroundColor,
                fontFamily: 'monospace', fontWeight: 700, fontSize: '10px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                #{idx + 1}
              </span>
              <span style={{ fontWeight: 800, fontSize: `${body.headingSize}px`, color: body.primaryTextColor, fontFamily: body.headingFont }}>{evt.type}</span>
              <span style={{
                fontSize: '10px', padding: '2px 8px', borderRadius: '9999px',
                backgroundColor: body.backgroundColor, border: `1px solid ${body.cardBorderColor}`,
                color: body.secondaryTextColor, fontWeight: 700, fontFamily: body.fieldLabelFont,
              }}>
                Module: {evt.module}
              </span>
            </div>
            <span style={{ fontSize: '10px', color: body.secondaryTextColor, fontFamily: 'monospace' }}>{evt.timestamp}</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', fontSize: '11px', color: body.secondaryTextColor, fontFamily: body.bodyFont }}>
            <div>Location: <strong style={{ color: body.primaryTextColor }}>{evt.location || 'N/A'}</strong></div>
            <div>User: <strong style={{ color: body.primaryTextColor }}>{evt.user || 'N/A'}</strong></div>
            <div>ERP Task: <strong style={{ color: body.primaryTextColor, fontFamily: 'monospace' }}>{evt.erpTask || 'N/A'}</strong></div>
          </div>

          <div style={{ borderTop: `1px solid ${body.cardBorderColor}`, paddingTop: '8px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '10px', fontFamily: 'monospace', color: body.secondaryTextColor }}>
            <div>Prev Hash: <span style={{ color: body.primaryTextColor }}>{evt.previousHash.slice(0, 24)}...</span></div>
            <div>Current Hash: <span style={{ color: body.primaryTextColor, fontWeight: 700 }}>{evt.currentHash.slice(0, 24)}...</span></div>
          </div>
        </div>
      ))}
    </div>
  );

  // ─── Main Render ────────────────────────────────────────────────────
  return (
    <div style={{
      minHeight: isPreview ? undefined : '100vh',
      backgroundColor: config.pageBackgroundColor,
      padding: isPreview ? '16px' : '16px',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: isPreview ? 'flex-start' : 'center',
      fontFamily: body.bodyFont,
    }}>
      <div style={{
        width: '100%',
        maxWidth: `${config.maxWidth}px`,
        backgroundColor: body.backgroundColor,
        borderRadius: `${config.borderRadius}px`,
        border: `1px solid ${body.cardBorderColor}`,
        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.15)',
        overflow: 'hidden',
        margin: isPreview ? 0 : '24px 0',
      }}>

        {/* ═══ HEADER ═══ */}
        <div style={headerStyle}>
          <div style={{
            display: 'flex',
            flexDirection: header.alignment === 'center' ? 'column' : 'row',
            alignItems: header.alignment === 'center' ? 'center' : 'center',
            justifyContent: header.alignment === 'right' ? 'flex-end' : header.alignment === 'center' ? 'center' : 'flex-start',
            gap: '12px',
            flexWrap: 'wrap',
          }}>
            {/* Logo */}
            {header.showLogo && header.logoUrl && (
              <img
                src={header.logoUrl}
                alt="Brand Logo"
                style={{
                  width: `${header.logoSize}px`,
                  height: `${header.logoSize}px`,
                  objectFit: 'cover',
                  borderRadius: header.logoShape === 'circle' ? '50%' : header.logoShape === 'rounded' ? '12px' : '4px',
                  flexShrink: 0,
                }}
              />
            )}

            {/* Brand info cluster */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', textAlign: header.alignment }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: header.alignment === 'center' ? 'center' : header.alignment === 'right' ? 'flex-end' : 'flex-start', flexWrap: 'wrap' }}>
                {header.showBrandName && (
                  <span style={{
                    fontFamily: header.brandNameFont,
                    fontSize: `${header.brandNameSize}px`,
                    fontWeight: 800,
                    color: header.brandNameColor,
                  }}>
                    {header.brandName}
                  </span>
                )}
                {header.showVerificationBadge && (
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: '4px',
                    padding: '2px 10px', borderRadius: '9999px',
                    backgroundColor: body.accentColor, color: body.backgroundColor,
                    fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em',
                    fontFamily: body.headingFont,
                  }}>
                    <CheckCircle2 style={{ width: 12, height: 12 }} /> Verified Twin
                  </span>
                )}
              </div>

              {header.showTagline && header.tagline && (
                <span style={{
                  fontFamily: header.taglineFont,
                  fontSize: `${header.taglineSize}px`,
                  color: header.taglineColor,
                  fontWeight: 600,
                }}>
                  {header.tagline}
                </span>
              )}

              <p style={{
                fontSize: '11px', color: body.secondaryTextColor,
                fontFamily: 'monospace', fontWeight: 600, margin: '2px 0 0',
              }}>
                Token: {product.uniqrCode || 'UQ-XXXXXXXX'}
              </p>
            </div>
          </div>

          {/* View toggle & action buttons */}
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px', marginTop: '16px', justifyContent: header.alignment === 'center' ? 'center' : header.alignment === 'right' ? 'flex-end' : 'flex-start' }}>
            {config.showLedgerTrailTab && (
              <div style={{
                backgroundColor: body.secondaryTextColor, padding: '4px', borderRadius: '12px',
                display: 'flex', gap: '4px',
              }}>
                <button
                  onClick={() => setViewMode('public')}
                  style={{
                    padding: '6px 12px', borderRadius: '8px', border: 'none', cursor: 'pointer',
                    fontSize: '12px', fontWeight: 800, fontFamily: body.headingFont,
                    backgroundColor: viewMode === 'public' ? body.cardBackgroundColor : 'transparent',
                    color: viewMode === 'public' ? body.primaryTextColor : body.backgroundColor,
                    transition: 'all 0.2s',
                  }}
                >
                  Public Details
                </button>
                <button
                  onClick={() => setViewMode('trail')}
                  style={{
                    padding: '6px 12px', borderRadius: '8px', border: 'none', cursor: 'pointer',
                    fontSize: '12px', fontWeight: 800, fontFamily: body.headingFont,
                    display: 'flex', alignItems: 'center', gap: '4px',
                    backgroundColor: viewMode === 'trail' ? body.cardBackgroundColor : 'transparent',
                    color: viewMode === 'trail' ? body.primaryTextColor : body.backgroundColor,
                    transition: 'all 0.2s',
                  }}
                >
                  <History style={{ width: 14, height: 14 }} /> Ledger Trail
                </button>
              </div>
            )}

            {config.showAiEngineButton && (
              <button
                onClick={() => !isPreview && setIsAiModalOpen(true)}
                style={{
                  padding: '8px 14px', borderRadius: '12px', border: `1px solid ${body.cardBorderColor}40`,
                  backgroundColor: body.accentColor, color: body.backgroundColor,
                  fontSize: '12px', fontWeight: 700, fontFamily: body.headingFont,
                  display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                }}
              >
                <Sparkles style={{ width: 16, height: 16 }} /> AI Engine
              </button>
            )}

            {config.showShareButton && (
              <button
                onClick={() => {
                  if (isPreview) return;
                  if (navigator.share) {
                    navigator.share({ title: product.name, text: `Verified UniQR product card for ${product.name}`, url: window.location.href }).catch(() => {});
                  } else {
                    navigator.clipboard.writeText(window.location.href);
                    alert('UniQR Card link copied to clipboard!');
                  }
                }}
                style={{
                  padding: '8px 14px', borderRadius: '12px', border: 'none',
                  backgroundColor: body.accentColor, color: body.backgroundColor,
                  fontSize: '12px', fontWeight: 700, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: '6px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                }}
              >
                <Share2 style={{ width: 16, height: 16 }} />
              </button>
            )}
          </div>
        </div>

        {/* ═══ BODY ═══ */}
        <div style={{ ...bodyStyle, display: 'flex', flexDirection: 'column', gap: `${body.sectionSpacing}px`, padding: `${body.sectionSpacing}px ${body.padding.right}px ${body.sectionSpacing}px ${body.padding.left}px` }}>
          {viewMode === 'public' ? (
            <>
              {visibleSections.map(sec => {
                const renderer = sectionRenderers[sec.type];
                if (!renderer) return null;
                const content = renderer();
                if (!content) return null;
                return <div key={sec.id}>{content}</div>;
              })}
              {renderActions()}
              {renderRelationships()}
            </>
          ) : (
            renderTrailView()
          )}
        </div>

        {/* ═══ FOOTER ═══ */}
        <div style={footerStyle}>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '12px', marginBottom: '16px' }}>
            {footer.showActionButtons && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                <button
                  onClick={() => !isPreview && alert(`Downloading User Operating Manual PDF for ${product.name}...`)}
                  style={{
                    padding: '8px 16px', borderRadius: '12px',
                    backgroundColor: body.cardBackgroundColor, color: body.primaryTextColor,
                    border: `1px solid ${body.cardBorderColor}`,
                    fontSize: '12px', fontWeight: 700, fontFamily: footer.font,
                    display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer',
                  }}
                >
                  <FileText style={{ width: 16, height: 16, color: body.primaryTextColor }} /> User Manual
                </button>
                <button
                  onClick={() => !isPreview && alert(`Downloading Authenticity Certificate for ${product.name}...`)}
                  style={{
                    padding: '8px 16px', borderRadius: '12px',
                    backgroundColor: body.cardBackgroundColor, color: body.primaryTextColor,
                    border: `1px solid ${body.cardBorderColor}`,
                    fontSize: '12px', fontWeight: 700, fontFamily: footer.font,
                    display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer',
                  }}
                >
                  <Award style={{ width: 16, height: 16, color: body.primaryTextColor }} /> Authenticity Cert
                </button>
              </div>
            )}

            {footer.showBackButton && (
              <button
                onClick={() => !isPreview && onBackToApp()}
                style={{
                  padding: '10px 20px', borderRadius: '12px', border: 'none',
                  backgroundColor: body.accentColor, color: body.backgroundColor,
                  fontSize: '12px', fontWeight: 700, fontFamily: footer.font,
                  cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  transition: 'all 0.2s',
                }}
              >
                Back to Platform Studio
              </button>
            )}
          </div>

          {/* Custom footer text */}
          {footer.showCustomFooterText && footer.customFooterText && (
            <p style={{
              fontSize: `${footer.fontSize}px`, color: footer.textColor,
              fontFamily: footer.font, margin: '0 0 12px', fontWeight: 500,
            }}>
              {footer.customFooterText}
            </p>
          )}

          {/* MANDATORY: Powered by UniQR — always rendered, never removable */}
          <div style={{
            fontSize: '11px', color: footer.textColor, fontFamily: footer.font,
            opacity: 0.85, fontWeight: 600,
            display: 'flex', alignItems: 'center', justifyContent: footer.alignment === 'center' ? 'center' : footer.alignment === 'right' ? 'flex-end' : 'flex-start',
            gap: '4px',
            userSelect: 'none'
          }}>
            <span>Powered by </span>
            <a
              href="https://uniqr.agbtechnologies.in"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: body.accentColor || '#1D4533', fontWeight: 800, textDecoration: 'underline' }}
            >
              UniQR - agbtechnologies.in
            </a>
          </div>
        </div>
      </div>

      {/* AI Modal */}
      {!isPreview && (
        <AiInsightsModal
          isOpen={isAiModalOpen}
          onClose={() => setIsAiModalOpen(false)}
          product={product}
        />
      )}
    </div>
  );
};
