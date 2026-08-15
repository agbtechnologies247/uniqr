import React, { useState } from 'react';
import {
  Key,
  Plus,
  Copy,
  Check,
  AlertTriangle,
  RefreshCw,
  Trash2,
  Shield,
  Code2,
  Terminal,
  ExternalLink,
  ChevronRight,
  X,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  Activity,
  Sliders,
  Server
} from 'lucide-react';
import { sound } from '../../services/audio';

interface ApiKeyRecord {
  id: string;
  name: string;
  prefix: string;
  secretMasked: string;
  environment: 'Production' | 'Staging' | 'Development';
  createdAt: string;
  lastUsed: string;
  status: 'Active' | 'Revoked' | 'Expired';
  usageCount: number;
  permissions: {
    qr: { read: boolean; create: boolean; update: boolean; delete: boolean };
    entities: { read: boolean; create: boolean; update: boolean; delete: boolean };
    analytics: { read: boolean };
    reports: { read: boolean };
    billing: boolean;
    admin: boolean;
  };
}

export const DeveloperPortal: React.FC = () => {
  const [keys, setKeys] = useState<ApiKeyRecord[]>([
    {
      id: 'key-1',
      name: 'Production ERP Integration',
      prefix: 'uq_live_',
      secretMasked: 'uq_live_7fa918b2c4e90812df38a7b6e9a',
      environment: 'Production',
      createdAt: '10 Aug 2026',
      lastUsed: '2 min ago',
      status: 'Active',
      usageCount: 42821,
      permissions: {
        qr: { read: true, create: true, update: true, delete: false },
        entities: { read: true, create: true, update: true, delete: false },
        analytics: { read: true },
        reports: { read: true },
        billing: false,
        admin: false,
      }
    },
    {
      id: 'key-2',
      name: 'Development Sandbox & Testing',
      prefix: 'uq_test_',
      secretMasked: 'uq_test_4819dfb892a01ce4892bb8a01',
      environment: 'Development',
      createdAt: '05 Aug 2026',
      lastUsed: '1 hr ago',
      status: 'Active',
      usageCount: 8412,
      permissions: {
        qr: { read: true, create: true, update: true, delete: true },
        entities: { read: true, create: true, update: true, delete: true },
        analytics: { read: true },
        reports: { read: false },
        billing: false,
        admin: false,
      }
    },
    {
      id: 'key-3',
      name: 'CI/CD Automated Testing Pipeline',
      prefix: 'uq_test_',
      secretMasked: 'uq_test_9012bb47e812d091aa4719bb',
      environment: 'Staging',
      createdAt: '22 Jul 2026',
      lastUsed: '4 days ago',
      status: 'Active',
      usageCount: 1204,
      permissions: {
        qr: { read: true, create: false, update: false, delete: false },
        entities: { read: true, create: false, update: false, delete: false },
        analytics: { read: false },
        reports: { read: false },
        billing: false,
        admin: false,
      }
    },
  ]);

  // Modals & Drawer State
  const [selectedKeyForDrawer, setSelectedKeyForDrawer] = useState<ApiKeyRecord | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [newlyCreatedKeySecret, setNewlyCreatedKeySecret] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<boolean>(false);

  // New Key Form State
  const [keyName, setKeyName] = useState<string>('Production Integration');
  const [environment, setEnvironment] = useState<'Development' | 'Staging' | 'Production'>('Production');
  const [expiration, setExpiration] = useState<'Never' | '30' | '90'>('Never');
  const [permQrRead, setPermQrRead] = useState<boolean>(true);
  const [permQrCreate, setPermQrCreate] = useState<boolean>(true);
  const [permQrUpdate, setPermQrUpdate] = useState<boolean>(false);
  const [permQrDelete, setPermQrDelete] = useState<boolean>(false);
  const [permEntityRead, setPermEntityRead] = useState<boolean>(true);
  const [permEntityCreate, setPermEntityCreate] = useState<boolean>(false);
  const [permEntityUpdate, setPermEntityUpdate] = useState<boolean>(false);
  const [permEntityDelete, setPermEntityDelete] = useState<boolean>(false);
  const [permAnalyticsRead, setPermAnalyticsRead] = useState<boolean>(true);
  const [permReportsRead, setPermReportsRead] = useState<boolean>(false);

  // Handle create key
  const handleCreateKey = () => {
    sound.playClick();
    const rawSecret = `${environment === 'Production' ? 'uq_live_' : 'uq_test_'}${Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;
    
    const newRecord: ApiKeyRecord = {
      id: `key-${Date.now().toString().slice(-4)}`,
      name: keyName,
      prefix: environment === 'Production' ? 'uq_live_' : 'uq_test_',
      secretMasked: `${rawSecret.slice(0, 16)}••••••••••••••••`,
      environment,
      createdAt: new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
      lastUsed: 'Never',
      status: 'Active',
      usageCount: 0,
      permissions: {
        qr: { read: permQrRead, create: permQrCreate, update: permQrUpdate, delete: permQrDelete },
        entities: { read: permEntityRead, create: permEntityCreate, update: permEntityUpdate, delete: permEntityDelete },
        analytics: { read: permAnalyticsRead },
        reports: { read: permReportsRead },
        billing: false,
        admin: false,
      }
    };

    setKeys(prev => [newRecord, ...prev]);
    setIsCreateModalOpen(false);
    setNewlyCreatedKeySecret(rawSecret);
    sound.playSuccessChime();
  };

  // Copy secret to clipboard
  const handleCopySecret = (secret: string) => {
    sound.playClick();
    navigator.clipboard.writeText(secret);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  // Rotate Key
  const handleRotateKey = (keyId: string) => {
    sound.playClick();
    if (confirm('Rotating this API key will invalidate the current token immediately. Continue?')) {
      const newSecret = `uq_live_${Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;
      setKeys(prev => prev.map(k => k.id === keyId ? { ...k, secretMasked: `${newSecret.slice(0, 16)}••••••••••••••••`, lastUsed: 'Just rotated' } : k));
      setSelectedKeyForDrawer(null);
      setNewlyCreatedKeySecret(newSecret);
      sound.playSuccessChime();
    }
  };

  // Revoke Key
  const handleRevokeKey = (keyId: string) => {
    sound.playClick();
    if (confirm('Are you sure you want to permanently revoke this API key? Applications using it will receive HTTP 401 Unauthorized.')) {
      setKeys(prev => prev.map(k => k.id === keyId ? { ...k, status: 'Revoked' } : k));
      if (selectedKeyForDrawer?.id === keyId) {
        setSelectedKeyForDrawer(prev => prev ? { ...prev, status: 'Revoked' } : null);
      }
    }
  };

  return (
    <div className="space-y-6 pb-20 md:pb-8 selection:bg-[#1D4533] selection:text-[#F7EAE0]">
      
      {/* ─── 1. DEVELOPER CONSOLE HEADER (COMPACT ON MOBILE) ─── */}
      <div className="bg-white p-3.5 sm:p-6 sm:p-8 rounded-xl sm:rounded-3xl border border-[#F9D2BA] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-[#1D4533] font-extrabold text-[10px] sm:text-xs uppercase tracking-wider mb-0.5 sm:mb-1">
            <Terminal className="w-3.5 h-3.5 text-[#F9D2BA]" />
            <span>Developer Console</span>
          </div>
          <h1 className="text-lg sm:text-3xl font-extrabold text-[#1D4533] tracking-tight">
            API Keys
          </h1>
          <p className="text-[11px] sm:text-sm text-[#5E3122] mt-0.5 font-medium hidden sm:block">
            API keys allow your applications and enterprise services to programmatically communicate with UniQR.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            sound.playClick();
            setIsCreateModalOpen(true);
          }}
          className="px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl bg-[#1D4533] hover:bg-[#5E3122] text-[#F7EAE0] font-extrabold text-xs transition-all shadow-md flex items-center gap-1.5 shrink-0 self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5 text-[#F9D2BA]" />
          <span>Create Key</span>
        </button>
      </div>

      {/* ─── 2. SECURITY WARNING CALLOUT ─── */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#5E3122]/10 border border-[#5E3122]/30 flex items-start gap-3 text-xs">
        <AlertTriangle className="w-5 h-5 text-[#5E3122] shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="font-extrabold text-[#5E3122]">Keep your API keys private and secure</h4>
          <p className="text-[#5E3122] font-medium leading-relaxed">
            Never expose secret keys in client-side applications, public GitHub repositories, or browser code. Use environment variables on your backend servers.
          </p>
        </div>
      </div>

      {/* ─── 3. API KEYS REPOSITORY TABLE ─── */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#F9D2BA] shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-[#F9D2BA] pb-3">
          <h2 className="text-lg font-extrabold text-[#1D4533]">Active API Keys</h2>
          <span className="text-xs font-bold text-[#5E3122]">{keys.length} Registered Keys</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#F9D2BA] text-[#5E3122] font-extrabold uppercase text-[10px] tracking-wider">
                <th className="py-2.5 px-3">Key Name</th>
                <th className="py-2.5 px-3">Environment</th>
                <th className="py-2.5 px-3">Token Prefix</th>
                <th className="py-2.5 px-3">Created</th>
                <th className="py-2.5 px-3">Last Used</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F9D2BA]/40">
              {keys.map((k) => (
                <tr
                  key={k.id}
                  onClick={() => {
                    sound.playClick();
                    setSelectedKeyForDrawer(k);
                  }}
                  className="hover:bg-[#F7EAE0]/40 transition-colors cursor-pointer group"
                >
                  <td className="py-3.5 px-3 font-bold text-[#1D4533] group-hover:text-[#5E3122]">
                    <div className="flex items-center gap-2">
                      <Key className="w-3.5 h-3.5 text-[#5E3122]" />
                      <span>{k.name}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      k.environment === 'Production'
                        ? 'bg-purple-100 text-purple-900 border border-purple-300'
                        : 'bg-blue-100 text-blue-900 border border-blue-300'
                    }`}>
                      {k.environment}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 font-mono text-[11px] text-[#5E3122]">
                    {k.prefix}••••••••
                  </td>
                  <td className="py-3.5 px-3 font-mono text-[#5E3122]">
                    {k.createdAt}
                  </td>
                  <td className="py-3.5 px-3 font-mono text-[#1D4533] font-semibold">
                    {k.lastUsed}
                  </td>
                  <td className="py-3.5 px-3">
                    <span className={`flex items-center gap-1 font-bold ${
                      k.status === 'Active' ? 'text-emerald-700' : 'text-rose-700'
                    }`}>
                      <span className={`w-2 h-2 rounded-full ${k.status === 'Active' ? 'bg-emerald-600' : 'bg-rose-600'}`} />
                      <span>{k.status}</span>
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-right">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        sound.playClick();
                        setSelectedKeyForDrawer(k);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-white border border-[#F9D2BA] text-[#1D4533] hover:bg-[#F9D2BA] font-bold text-xs shadow-xs"
                    >
                      Inspect
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ─── 4. SLIDE-OVER DRAWER FOR API KEY DETAILS ─── */}
      {selectedKeyForDrawer && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md h-full shadow-2xl border-l border-[#F9D2BA] p-6 space-y-6 overflow-y-auto flex flex-col justify-between">
            <div className="space-y-6">
              
              {/* Drawer Header */}
              <div className="flex items-start justify-between border-b border-[#F9D2BA] pb-4">
                <div>
                  <span className="text-[10px] font-extrabold uppercase text-[#5E3122] tracking-wider">
                    API Key Details
                  </span>
                  <h3 className="text-xl font-extrabold text-[#1D4533]">
                    {selectedKeyForDrawer.name}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedKeyForDrawer(null)}
                  className="p-1 rounded-lg text-[#5E3122] hover:bg-[#F7EAE0]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Status & Environment */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-2xl bg-[#F7EAE0]/50 border border-[#F9D2BA]">
                  <span className="text-[10px] text-[#5E3122] font-bold block">Status</span>
                  <span className="text-sm font-extrabold text-emerald-700">● {selectedKeyForDrawer.status}</span>
                </div>
                <div className="p-3 rounded-2xl bg-[#F7EAE0]/50 border border-[#F9D2BA]">
                  <span className="text-[10px] text-[#5E3122] font-bold block">Environment</span>
                  <span className="text-sm font-extrabold text-[#1D4533]">{selectedKeyForDrawer.environment}</span>
                </div>
              </div>

              {/* Timestamps & Usage */}
              <div className="space-y-2 text-xs border-y border-[#F9D2BA] py-3">
                <div className="flex justify-between">
                  <span className="text-[#5E3122] font-medium">Created On</span>
                  <span className="font-mono font-bold text-[#1D4533]">{selectedKeyForDrawer.createdAt}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#5E3122] font-medium">Last Active</span>
                  <span className="font-mono font-bold text-[#1D4533]">{selectedKeyForDrawer.lastUsed}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#5E3122] font-medium">Total API Volume</span>
                  <span className="font-mono font-extrabold text-[#1D4533]">{selectedKeyForDrawer.usageCount.toLocaleString()} requests</span>
                </div>
              </div>

              {/* Permissions Checklist */}
              <div className="space-y-3">
                <h4 className="text-xs font-extrabold text-[#1D4533] uppercase tracking-wider">
                  Granted Scope &amp; Permissions
                </h4>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between p-2 rounded-xl bg-[#F7EAE0]/40">
                    <span className="font-bold text-[#1D4533]">QR Engine (Read &amp; Create)</span>
                    <span className="text-emerald-700 font-extrabold">✓ Allowed</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-xl bg-[#F7EAE0]/40">
                    <span className="font-bold text-[#1D4533]">Entity Twins (Read Access)</span>
                    <span className="text-emerald-700 font-extrabold">✓ Allowed</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-xl bg-[#F7EAE0]/40">
                    <span className="font-bold text-[#1D4533]">Scan Telemetry Stream</span>
                    <span className="text-emerald-700 font-extrabold">✓ Allowed</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-xl bg-[#F7EAE0]/40">
                    <span className="font-bold text-[#5E3122]">Billing &amp; Plan Invoices</span>
                    <span className="text-rose-700 font-bold">✕ Denied</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-xl bg-[#F7EAE0]/40">
                    <span className="font-bold text-[#5E3122]">Platform Administration</span>
                    <span className="text-rose-700 font-bold">✕ Denied</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Actions: Rotate & Revoke */}
            <div className="pt-4 border-t border-[#F9D2BA] space-y-2">
              <button
                type="button"
                onClick={() => handleRotateKey(selectedKeyForDrawer.id)}
                className="w-full py-2.5 rounded-xl bg-[#1D4533] hover:bg-[#5E3122] text-[#F7EAE0] font-extrabold text-xs transition-all flex items-center justify-center gap-1.5 shadow-sm"
              >
                <RefreshCw className="w-3.5 h-3.5 text-[#F9D2BA]" />
                <span>Rotate Secret Key</span>
              </button>

              <button
                type="button"
                onClick={() => handleRevokeKey(selectedKeyForDrawer.id)}
                className="w-full py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-extrabold text-xs transition-all flex items-center justify-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Revoke API Key Permanently</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ─── 5. CREATE API KEY MODAL (DEVELOPER-GRADE SCOPING) ─── */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-3xl border border-[#F9D2BA] shadow-2xl p-6 sm:p-8 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#F9D2BA] pb-3">
              <div className="flex items-center gap-2">
                <Key className="w-5 h-5 text-[#1D4533]" />
                <h3 className="text-lg font-extrabold text-[#1D4533]">Create New API Key</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1 rounded-lg text-[#5E3122] hover:bg-[#F7EAE0]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {/* Name */}
              <div className="space-y-1">
                <label className="font-extrabold text-[#5E3122] uppercase tracking-wider text-[10px]">Key Name *</label>
                <input
                  type="text"
                  value={keyName}
                  onChange={(e) => setKeyName(e.target.value)}
                  placeholder="e.g. Production ERP Integration"
                  className="w-full px-3 py-2 rounded-xl border border-[#F9D2BA] bg-white text-[#1D4533] font-medium text-xs focus:outline-none focus:border-[#1D4533]"
                />
              </div>

              {/* Environment */}
              <div className="space-y-1">
                <label className="font-extrabold text-[#5E3122] uppercase tracking-wider text-[10px]">Environment</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Development', 'Staging', 'Production'] as const).map((env) => (
                    <button
                      key={env}
                      type="button"
                      onClick={() => {
                        sound.playClick();
                        setEnvironment(env);
                      }}
                      className={`p-2.5 rounded-xl font-extrabold text-xs border transition-all ${
                        environment === env
                          ? 'bg-[#1D4533] text-[#F7EAE0] border-[#1D4533] shadow-xs'
                          : 'bg-[#F7EAE0]/50 text-[#5E3122] border-[#F9D2BA] hover:bg-white'
                      }`}
                    >
                      {env}
                    </button>
                  ))}
                </div>
              </div>

              {/* Granular Permissions */}
              <div className="space-y-2 pt-2 border-t border-[#F9D2BA]">
                <label className="font-extrabold text-[#5E3122] uppercase tracking-wider text-[10px]">Permissions Matrix</label>
                
                <div className="space-y-2 p-3 rounded-2xl bg-[#F7EAE0]/50 border border-[#F9D2BA]">
                  {/* QR Permissions */}
                  <div>
                    <span className="font-bold text-[#1D4533] block mb-1">QR Engine</span>
                    <div className="grid grid-cols-4 gap-2">
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input type="checkbox" checked={permQrRead} onChange={e => setPermQrRead(e.target.checked)} className="rounded accent-[#1D4533]" />
                        <span>Read</span>
                      </label>
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input type="checkbox" checked={permQrCreate} onChange={e => setPermQrCreate(e.target.checked)} className="rounded accent-[#1D4533]" />
                        <span>Create</span>
                      </label>
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input type="checkbox" checked={permQrUpdate} onChange={e => setPermQrUpdate(e.target.checked)} className="rounded accent-[#1D4533]" />
                        <span>Update</span>
                      </label>
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input type="checkbox" checked={permQrDelete} onChange={e => setPermQrDelete(e.target.checked)} className="rounded accent-[#1D4533]" />
                        <span>Delete</span>
                      </label>
                    </div>
                  </div>

                  {/* Entities Permissions */}
                  <div className="pt-2 border-t border-[#F9D2BA]/60">
                    <span className="font-bold text-[#1D4533] block mb-1">Entity Twins</span>
                    <div className="grid grid-cols-4 gap-2">
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input type="checkbox" checked={permEntityRead} onChange={e => setPermEntityRead(e.target.checked)} className="rounded accent-[#1D4533]" />
                        <span>Read</span>
                      </label>
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input type="checkbox" checked={permEntityCreate} onChange={e => setPermEntityCreate(e.target.checked)} className="rounded accent-[#1D4533]" />
                        <span>Create</span>
                      </label>
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input type="checkbox" checked={permEntityUpdate} onChange={e => setPermEntityUpdate(e.target.checked)} className="rounded accent-[#1D4533]" />
                        <span>Update</span>
                      </label>
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input type="checkbox" checked={permEntityDelete} onChange={e => setPermEntityDelete(e.target.checked)} className="rounded accent-[#1D4533]" />
                        <span>Delete</span>
                      </label>
                    </div>
                  </div>

                  {/* Analytics & Reports */}
                  <div className="pt-2 border-t border-[#F9D2BA]/60 flex items-center justify-between">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input type="checkbox" checked={permAnalyticsRead} onChange={e => setPermAnalyticsRead(e.target.checked)} className="rounded accent-[#1D4533]" />
                      <span className="font-bold text-[#1D4533]">Analytics (Read)</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input type="checkbox" checked={permReportsRead} onChange={e => setPermReportsRead(e.target.checked)} className="rounded accent-[#1D4533]" />
                      <span className="font-bold text-[#1D4533]">Reports (Read)</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Expiration */}
              <div className="space-y-1">
                <label className="font-extrabold text-[#5E3122] uppercase tracking-wider text-[10px]">Key Expiration</label>
                <div className="flex items-center gap-4">
                  {(['Never', '30', '90'] as const).map((exp) => (
                    <label key={exp} className="flex items-center gap-1.5 cursor-pointer font-medium text-[#1D4533]">
                      <input
                        type="radio"
                        name="expiration"
                        checked={expiration === exp}
                        onChange={() => setExpiration(exp)}
                        className="accent-[#1D4533]"
                      />
                      <span>{exp === 'Never' ? 'Never' : `${exp} Days`}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-4 border-t border-[#F9D2BA]">
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="px-4 py-2.5 rounded-xl border border-[#F9D2BA] text-xs font-bold text-[#5E3122] hover:bg-[#F7EAE0]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCreateKey}
                className="px-5 py-2.5 rounded-xl bg-[#1D4533] hover:bg-[#5E3122] text-[#F7EAE0] font-extrabold text-xs transition-all shadow-md flex items-center gap-1.5"
              >
                <Key className="w-3.5 h-3.5 text-[#F9D2BA]" />
                <span>Create API Key</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── 6. SECRET DISPLAY MODAL (SHOWN ONLY ONCE) ─── */}
      {newlyCreatedKeySecret && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-3xl border border-[#F9D2BA] shadow-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold shrink-0">
                <CheckCircle2 className="w-6 h-6 text-emerald-700" />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-[#1D4533]">API Key Created Successfully</h3>
                <p className="text-xs text-[#5E3122] font-medium">Please store this secret in a secure password manager</p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-medium space-y-1">
              <div className="font-extrabold flex items-center gap-1.5 text-amber-950">
                <AlertTriangle className="w-4 h-4 text-amber-700" />
                <span>This secret will only be shown once</span>
              </div>
              <p>
                If you lose this key, you will have to rotate and generate a new token.
              </p>
            </div>

            {/* Secret Box */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-extrabold text-[#5E3122] uppercase tracking-wider">Generated Token Secret</label>
              <div className="flex items-center gap-2 p-3 bg-[#F7EAE0] rounded-xl border border-[#F9D2BA]">
                <code className="flex-1 font-mono font-bold text-xs text-[#1D4533] break-all select-all">
                  {newlyCreatedKeySecret}
                </code>
                <button
                  type="button"
                  onClick={() => handleCopySecret(newlyCreatedKeySecret)}
                  className="px-3 py-1.5 rounded-lg bg-[#1D4533] hover:bg-[#5E3122] text-[#F7EAE0] font-bold text-xs flex items-center gap-1.5 shadow-xs shrink-0"
                >
                  {copiedKey ? <Check className="w-3.5 h-3.5 text-[#F9D2BA]" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                sound.playClick();
                setNewlyCreatedKeySecret(null);
              }}
              className="w-full py-3 rounded-2xl bg-[#1D4533] hover:bg-[#5E3122] text-[#F7EAE0] font-extrabold text-xs transition-all shadow-md text-center"
            >
              I've Saved My Key
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
