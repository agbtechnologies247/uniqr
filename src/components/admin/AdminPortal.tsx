import React, { useState } from 'react';
import {
  Shield,
  Users,
  Building2,
  Lock,
  Sliders,
  Database,
  Globe,
  Bell,
  HardDrive,
  FileCheck,
  CheckCircle2,
  AlertTriangle,
  Search,
  Plus,
  ArrowRight,
  MoreVertical,
  Check,
  X,
  ChevronRight,
  Sparkles,
  Key,
  Layers,
  Wrench,
  Activity,
  QrCode
} from 'lucide-react';
import { sound } from '../../services/audio';

export const AdminPortal: React.FC = () => {
  // Navigation active tab
  const [activeCategory, setActiveCategory] = useState<string>('overview');

  // Users state
  const [users, setUsers] = useState([
    { id: 'usr-1', name: 'Admin (AGB Principal)', email: 'admin@agbtechnologies.com', role: 'Owner', team: 'Management', status: 'Active', mfa: true },
    { id: 'usr-2', name: 'John Doe', email: 'john@agbtechnologies.com', role: 'Manager', team: 'Operations', status: 'Active', mfa: true },
    { id: 'usr-3', name: 'Sarah Connor', email: 'sarah@agbtechnologies.com', role: 'Inspector', team: 'Quality Assurance', status: 'Active', mfa: true },
    { id: 'usr-4', name: 'Amit Patel', email: 'amit@agbtechnologies.com', role: 'Viewer', team: 'Customer Support', status: 'Active', mfa: false },
  ]);

  // Invite user modal state
  const [isInviteModalOpen, setIsInviteModalOpen] = useState<boolean>(false);
  const [inviteName, setInviteName] = useState<string>('');
  const [inviteEmail, setInviteEmail] = useState<string>('');
  const [inviteRole, setInviteRole] = useState<string>('Inspector');
  const [inviteTeam, setInviteTeam] = useState<string>('Operations');

  // Selected Role Inspector
  const [selectedRole, setSelectedRole] = useState<string>('Inspector');

  // Entity configuration state
  const [selectedEntityType, setSelectedEntityType] = useState<string>('Product');
  const [customEntityTypes, setCustomEntityTypes] = useState([
    'Product', 'Customer', 'Asset', 'Machine', 'Location', 'Document', 'Transaction', 'Work Order', 'Process', 'Batch', 'Shipment'
  ]);

  // QR Policies state
  const [qrTypeDefault, setQrTypeDefault] = useState<'Dynamic' | 'Static'>('Dynamic');
  const [publicAccess, setPublicAccess] = useState<boolean>(true);
  const [scanAnalytics, setScanAnalytics] = useState<boolean>(true);
  const [locationCollection, setLocationCollection] = useState<boolean>(false);
  const [deviceInfoCollection, setDeviceInfoCollection] = useState<boolean>(true);
  const [qrDomain, setQrDomain] = useState<string>('uqr.to');

  // Audit Logs
  const auditLogs = [
    { time: '14:02', user: 'Admin (Owner)', action: 'Created Dynamic QR', resource: 'QR-18292 (XR-7000 Sensor)' },
    { time: '13:47', user: 'Sarah Connor', action: 'Updated Asset Maintenance', resource: 'AST-1821 (CAT-320)' },
    { time: '12:32', user: 'John Doe', action: 'Exported Compliance Report', resource: 'REP-182 (EU DPP Certificate)' },
    { time: '11:18', user: 'Admin (Owner)', action: 'Modified Role Permission', resource: 'Inspector Scope' },
    { time: '09:40', user: 'System Worker', action: 'Cron Dispatched Telemetry', resource: 'Daily Digest' },
  ];

  // Secondary sidebar navigation structure
  const adminNavSections = [
    {
      title: 'ORGANIZATION',
      items: [
        { id: 'overview', label: 'Overview', icon: Building2 },
        { id: 'profile', label: 'Org Profile', icon: Shield },
        { id: 'branding', label: 'White-Label Branding', icon: Sparkles },
      ]
    },
    {
      title: 'USERS & ACCESS',
      items: [
        { id: 'users', label: 'Users & Directory', icon: Users },
        { id: 'roles', label: 'Roles & Permissions', icon: Lock },
      ]
    },
    {
      title: 'QR & ENTITY ENGINE',
      items: [
        { id: 'qr-policies', label: 'QR Policies & Defaults', icon: QrCode },
        { id: 'entities', label: 'Entity Configuration', icon: Layers },
      ]
    },
    {
      title: 'SECURITY & GOVERNANCE',
      items: [
        { id: 'security', label: 'Security & MFA', icon: Lock },
        { id: 'audit-logs', label: 'Audit Logs', icon: FileCheck },
      ]
    },
    {
      title: 'SYSTEM SETTINGS',
      items: [
        { id: 'system', label: 'System Settings', icon: Sliders },
      ]
    }
  ];

  const handleInviteUser = () => {
    sound.playClick();
    if (!inviteEmail) return;
    const newUser = {
      id: `usr-${Date.now().toString().slice(-4)}`,
      name: inviteName || inviteEmail.split('@')[0],
      email: inviteEmail,
      role: inviteRole,
      team: inviteTeam,
      status: 'Active',
      mfa: false,
    };
    setUsers(prev => [newUser, ...prev]);
    setIsInviteModalOpen(false);
    setInviteName('');
    setInviteEmail('');
    sound.playSuccessChime();
  };

  return (
    <div className="space-y-6 pb-20 md:pb-8 selection:bg-[#1D4533] selection:text-[#F7EAE0]">
      
      {/* ─── 1. ADMINISTRATION HEADER (COMPACT ON MOBILE) ─── */}
      <div className="bg-white p-3.5 sm:p-6 sm:p-8 rounded-xl sm:rounded-3xl border border-[#F9D2BA] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-[#1D4533] font-extrabold text-[10px] sm:text-xs uppercase tracking-wider mb-0.5 sm:mb-1">
            <Shield className="w-3.5 h-3.5 text-[#F9D2BA]" />
            <span>Governance &amp; Control</span>
          </div>
          <h1 className="text-lg sm:text-3xl font-extrabold text-[#1D4533] tracking-tight">
            Admin
          </h1>
          <p className="text-[11px] sm:text-sm text-[#5E3122] mt-0.5 font-medium hidden sm:block">
            Manage your organization, team users, security policies and universal entity platform
          </p>
        </div>

        <div className="p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-[#F7EAE0] border border-[#F9D2BA] text-[11px] sm:text-xs font-bold text-[#1D4533] shrink-0">
          <span className="text-[9px] sm:text-[10px] uppercase text-[#5E3122] block font-extrabold">Organization</span>
          <span>AGB Technologies Pvt. Ltd.</span>
        </div>
      </div>

      {/* ─── 2. SPLIT-SCREEN ADMIN WORKSPACE: SIDEBAR + ACTIVE VIEW ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Secondary Admin Navigation (3.5 cols) */}
        <div className="lg:col-span-3 bg-white p-4 rounded-3xl border border-[#F9D2BA] shadow-sm space-y-6">
          {adminNavSections.map((sec) => (
            <div key={sec.title} className="space-y-1.5">
              <h4 className="text-[10px] uppercase font-extrabold tracking-widest text-[#5E3122] px-3">
                {sec.title}
              </h4>
              <div className="space-y-1">
                {sec.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeCategory === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        sound.playClick();
                        setActiveCategory(item.id);
                      }}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-all text-left ${
                        isActive
                          ? 'bg-[#1D4533] text-[#F7EAE0] shadow-sm'
                          : 'text-[#1D4533] hover:bg-[#F7EAE0]'
                      }`}
                    >
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#F9D2BA]' : 'text-[#5E3122]'}`} />
                      <span className="truncate">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Right Active Admin Category Content (8.5 cols) */}
        <div className="lg:col-span-9 space-y-6">
          
          {/* ════ VIEW A: OVERVIEW / CONTROL DASHBOARD ════ */}
          {activeCategory === 'overview' && (
            <div className="space-y-6">
              
              {/* 4 Control KPI Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-3xl border border-[#F9D2BA] shadow-sm space-y-1">
                  <span className="text-[10px] font-extrabold uppercase text-[#5E3122]">Active Users</span>
                  <div className="text-3xl font-black text-[#1D4533]">{users.length}</div>
                  <span className="text-[10px] text-emerald-700 font-bold">100% Verified</span>
                </div>
                <div className="bg-white p-5 rounded-3xl border border-[#F9D2BA] shadow-sm space-y-1">
                  <span className="text-[10px] font-extrabold uppercase text-[#5E3122]">Assigned Teams</span>
                  <div className="text-3xl font-black text-[#1D4533]">4</div>
                  <span className="text-[10px] text-[#5E3122] font-semibold">Ops, QA, Support</span>
                </div>
                <div className="bg-white p-5 rounded-3xl border border-[#F9D2BA] shadow-sm space-y-1">
                  <span className="text-[10px] font-extrabold uppercase text-[#5E3122]">Active Roles</span>
                  <div className="text-3xl font-black text-[#1D4533]">8</div>
                  <span className="text-[10px] text-[#1D4533] font-bold">Granular RBAC</span>
                </div>
                <div className="bg-white p-5 rounded-3xl border border-[#F9D2BA] shadow-sm space-y-1">
                  <span className="text-[10px] font-extrabold uppercase text-[#5E3122]">API Keys</span>
                  <div className="text-3xl font-black text-[#1D4533]">6</div>
                  <span className="text-[10px] text-emerald-700 font-bold">0 Leaks Flagged</span>
                </div>
              </div>

              {/* Security Health Score Card */}
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#F9D2BA] shadow-sm space-y-5">
                <div className="flex items-center justify-between border-b border-[#F9D2BA] pb-3">
                  <div className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-[#1D4533]" />
                    <h3 className="text-base font-extrabold text-[#1D4533]">Organization Security Posture</h3>
                  </div>
                  <span className="text-sm font-black text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-300">
                    96 / 100 Score
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1.5">
                    <div className="flex justify-between font-bold text-[#1D4533]">
                      <span>MFA Adoption Rate</span>
                      <span className="font-mono">91%</span>
                    </div>
                    <div className="w-full h-2.5 bg-[#F7EAE0] rounded-full overflow-hidden border border-[#F9D2BA]">
                      <div className="h-full bg-[#1D4533] rounded-full" style={{ width: '91%' }} />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between font-bold text-[#1D4533]">
                      <span>Active Sessions Authenticity</span>
                      <span className="font-mono">98%</span>
                    </div>
                    <div className="w-full h-2.5 bg-[#F7EAE0] rounded-full overflow-hidden border border-[#F9D2BA]">
                      <div className="h-full bg-[#1D4533] rounded-full" style={{ width: '98%' }} />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between font-bold text-[#1D4533]">
                      <span>API Key Rotation Adherence</span>
                      <span className="font-mono">72%</span>
                    </div>
                    <div className="w-full h-2.5 bg-[#F7EAE0] rounded-full overflow-hidden border border-[#F9D2BA]">
                      <div className="h-full bg-[#5E3122] rounded-full" style={{ width: '72%' }} />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between font-bold text-[#1D4533]">
                      <span>Suspicious Scan Anomaly Shield</span>
                      <span className="font-mono">99%</span>
                    </div>
                    <div className="w-full h-2.5 bg-[#F7EAE0] rounded-full overflow-hidden border border-[#F9D2BA]">
                      <div className="h-full bg-[#1D4533] rounded-full" style={{ width: '99%' }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Administrative Activity */}
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#F9D2BA] shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-[#F9D2BA] pb-3">
                  <h3 className="text-base font-extrabold text-[#1D4533]">Recent Administrative Audit Stream</h3>
                  <span className="text-xs font-mono font-bold text-[#5E3122]">Live Security Log</span>
                </div>

                <div className="space-y-2 text-xs">
                  {auditLogs.map((log, idx) => (
                    <div key={idx} className="p-3 rounded-2xl bg-[#F7EAE0]/50 border border-[#F9D2BA] flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <span className="font-mono font-bold text-[#1D4533]">{log.time}</span>
                        <span className="font-extrabold text-[#1D4533]">{log.user}:</span>
                        <span className="text-[#5E3122] font-medium">{log.action}</span>
                      </div>
                      <span className="font-mono font-bold text-[11px] text-[#1D4533] bg-white px-2 py-0.5 rounded border border-[#F9D2BA]">
                        {log.resource}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* ════ VIEW B: USERS & DIRECTORY ════ */}
          {(activeCategory === 'users' || activeCategory === 'profile') && (
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#F9D2BA] shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#F9D2BA] pb-4">
                <div>
                  <h2 className="text-xl font-extrabold text-[#1D4533]">Organization Users</h2>
                  <p className="text-xs text-[#5E3122] font-medium mt-0.5">
                    Manage team member invitations, roles, and MFA authentication status
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setIsInviteModalOpen(true);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-[#1D4533] hover:bg-[#5E3122] text-[#F7EAE0] font-extrabold text-xs transition-all shadow-sm flex items-center gap-1.5 shrink-0"
                >
                  <Plus className="w-4 h-4 text-[#F9D2BA]" />
                  <span>+ Invite User</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-[#F9D2BA] text-[#5E3122] font-extrabold uppercase text-[10px] tracking-wider">
                      <th className="py-2.5 px-3">User</th>
                      <th className="py-2.5 px-3">Role</th>
                      <th className="py-2.5 px-3">Team</th>
                      <th className="py-2.5 px-3">MFA</th>
                      <th className="py-2.5 px-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F9D2BA]/40">
                    {users.map((u) => (
                      <tr key={u.id} className="hover:bg-[#F7EAE0]/30 transition-colors">
                        <td className="py-3 px-3">
                          <div className="font-bold text-[#1D4533]">{u.name}</div>
                          <div className="text-[11px] text-[#5E3122] font-mono">{u.email}</div>
                        </td>
                        <td className="py-3 px-3">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-[#F7EAE0] text-[#1D4533] border border-[#F9D2BA]">
                            {u.role}
                          </span>
                        </td>
                        <td className="py-3 px-3 font-semibold text-[#5E3122]">
                          {u.team}
                        </td>
                        <td className="py-3 px-3">
                          <span className={`text-[11px] font-bold ${u.mfa ? 'text-emerald-700' : 'text-amber-700'}`}>
                            {u.mfa ? '✓ Enforced' : 'Optional'}
                          </span>
                        </td>
                        <td className="py-3 px-3 font-bold text-emerald-700">
                          ● {u.status}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ════ VIEW C: ROLES & PERMISSIONS ════ */}
          {activeCategory === 'roles' && (
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#F9D2BA] shadow-sm space-y-6">
              <div className="border-b border-[#F9D2BA] pb-4">
                <h2 className="text-xl font-extrabold text-[#1D4533]">Role Permission Inspector</h2>
                <p className="text-xs text-[#5E3122] font-medium mt-0.5">
                  Configure role-based access control across QR codes, entities, reports, and governance
                </p>
              </div>

              {/* Role Select Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {['Owner', 'Manager', 'Inspector', 'Viewer'].map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => {
                      sound.playClick();
                      setSelectedRole(role);
                    }}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      selectedRole === role
                        ? 'bg-[#1D4533] text-[#F7EAE0] shadow-sm'
                        : 'bg-[#F7EAE0]/50 border border-[#F9D2BA] text-[#5E3122] hover:bg-white'
                    }`}
                  >
                    Role: {role}
                  </button>
                ))}
              </div>

              {/* Scope Checklist for Selected Role */}
              <div className="p-5 rounded-2xl bg-[#F7EAE0]/40 border border-[#F9D2BA] space-y-4">
                <div className="font-extrabold text-sm text-[#1D4533] flex items-center justify-between">
                  <span>Scope Matrix: {selectedRole}</span>
                  <span className="text-xs text-[#5E3122] font-mono">Role ID: role_{selectedRole.toLowerCase()}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-3 bg-white rounded-xl border border-[#F9D2BA] space-y-2">
                    <span className="font-extrabold text-[#1D4533] block uppercase text-[10px]">Entities &amp; Twins</span>
                    <div className="space-y-1 text-[#5E3122]">
                      <div className="flex justify-between"><span>View Entities</span><span className="text-emerald-700 font-bold">✓ Yes</span></div>
                      <div className="flex justify-between"><span>Create New Twins</span><span className={selectedRole === 'Viewer' ? 'text-rose-700 font-bold' : 'text-emerald-700 font-bold'}>{selectedRole === 'Viewer' ? '✕ No' : '✓ Yes'}</span></div>
                      <div className="flex justify-between"><span>Delete Records</span><span className={selectedRole === 'Owner' ? 'text-emerald-700 font-bold' : 'text-rose-700 font-bold'}>{selectedRole === 'Owner' ? '✓ Yes' : '✕ No'}</span></div>
                    </div>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-[#F9D2BA] space-y-2">
                    <span className="font-extrabold text-[#1D4533] block uppercase text-[10px]">QR Generation &amp; Policies</span>
                    <div className="space-y-1 text-[#5E3122]">
                      <div className="flex justify-between"><span>Scan &amp; Verify</span><span className="text-emerald-700 font-bold">✓ Yes</span></div>
                      <div className="flex justify-between"><span>Generate Custom QR</span><span className={selectedRole === 'Viewer' ? 'text-rose-700 font-bold' : 'text-emerald-700 font-bold'}>{selectedRole === 'Viewer' ? '✕ No' : '✓ Yes'}</span></div>
                      <div className="flex justify-between"><span>Modify QR Policies</span><span className={selectedRole === 'Owner' ? 'text-emerald-700 font-bold' : 'text-rose-700 font-bold'}>{selectedRole === 'Owner' ? '✓ Yes' : '✕ No'}</span></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ════ VIEW D: ENTITY CONFIGURATION ════ */}
          {activeCategory === 'entities' && (
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#F9D2BA] shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#F9D2BA] pb-4">
                <div>
                  <h2 className="text-xl font-extrabold text-[#1D4533]">Universal Entity Configuration</h2>
                  <p className="text-xs text-[#5E3122] font-medium mt-0.5">
                    Configure entity schemas, custom fields, and digital twin attributes
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    const newType = prompt('Enter new entity type name (e.g. Warranty Token, Vehicle, Tool):');
                    if (newType) {
                      setCustomEntityTypes(prev => [...prev, newType]);
                      setSelectedEntityType(newType);
                      sound.playSuccessChime();
                    }
                  }}
                  className="px-4 py-2 rounded-xl bg-[#1D4533] hover:bg-[#5E3122] text-[#F7EAE0] font-extrabold text-xs transition-all shadow-sm flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5 text-[#F9D2BA]" />
                  <span>+ Create Custom Entity Type</span>
                </button>
              </div>

              {/* Entity Types Pills */}
              <div className="flex flex-wrap items-center gap-2">
                {customEntityTypes.map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => {
                      sound.playClick();
                      setSelectedEntityType(type);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      selectedEntityType === type
                        ? 'bg-[#1D4533] text-[#F7EAE0] shadow-xs'
                        : 'bg-[#F7EAE0]/50 border border-[#F9D2BA] text-[#5E3122] hover:bg-white'
                    }`}
                  >
                    ✓ {type}
                  </button>
                ))}
              </div>

              {/* Fields Table for Selected Entity */}
              <div className="p-5 rounded-2xl bg-[#F7EAE0]/30 border border-[#F9D2BA] space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-extrabold text-[#1D4533]">Configured Schema Fields: {selectedEntityType}</h3>
                  <button
                    type="button"
                    onClick={() => {
                      sound.playClick();
                      alert(`Added dynamic field schema to ${selectedEntityType}`);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-white border border-[#F9D2BA] hover:bg-[#F9D2BA] text-[#1D4533] font-bold text-xs shadow-xs"
                  >
                    + Add Field
                  </button>
                </div>

                <div className="divide-y divide-[#F9D2BA]/60 text-xs">
                  <div className="py-2.5 flex justify-between"><span>Name / Identifier</span><span className="font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">Required</span></div>
                  <div className="py-2.5 flex justify-between"><span>SKU / Serial Number</span><span className="font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">Required</span></div>
                  <div className="py-2.5 flex justify-between"><span>Brand / Manufacturer</span><span className="font-mono text-[#5E3122]">Optional</span></div>
                  <div className="py-2.5 flex justify-between"><span>HSN / Tariff Code</span><span className="font-mono text-[#5E3122]">Optional</span></div>
                  <div className="py-2.5 flex justify-between"><span>Warranty Period</span><span className="font-mono text-[#5E3122]">Optional</span></div>
                  <div className="py-2.5 flex justify-between"><span>Description &amp; Specifications</span><span className="font-mono text-[#5E3122]">Optional</span></div>
                </div>
              </div>
            </div>
          )}

          {/* ════ VIEW E: QR POLICIES & DEFAULTS ════ */}
          {activeCategory === 'qr-policies' && (
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#F9D2BA] shadow-sm space-y-6">
              <div className="border-b border-[#F9D2BA] pb-4">
                <h2 className="text-xl font-extrabold text-[#1D4533]">Organization QR Policies</h2>
                <p className="text-xs text-[#5E3122] font-medium mt-0.5">
                  Set default scanning rules, public access domains, and data collection parameters
                </p>
              </div>

              <div className="space-y-4 text-xs">
                {/* Default QR Type */}
                <div className="p-4 rounded-2xl bg-[#F7EAE0]/50 border border-[#F9D2BA] flex items-center justify-between">
                  <div>
                    <h4 className="font-extrabold text-[#1D4533]">Default QR Token Type</h4>
                    <p className="text-[11px] text-[#5E3122]">Dynamic QRs allow updating target passports in real time without reprinting labels.</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setQrTypeDefault('Dynamic')}
                      className={`px-3 py-1.5 rounded-xl font-bold ${qrTypeDefault === 'Dynamic' ? 'bg-[#1D4533] text-[#F7EAE0]' : 'bg-white text-[#5E3122]'}`}
                    >
                      ● Dynamic
                    </button>
                    <button
                      type="button"
                      onClick={() => setQrTypeDefault('Static')}
                      className={`px-3 py-1.5 rounded-xl font-bold ${qrTypeDefault === 'Static' ? 'bg-[#1D4533] text-[#F7EAE0]' : 'bg-white text-[#5E3122]'}`}
                    >
                      Static
                    </button>
                  </div>
                </div>

                {/* Public Access */}
                <div className="p-4 rounded-2xl bg-[#F7EAE0]/50 border border-[#F9D2BA] flex items-center justify-between">
                  <div>
                    <h4 className="font-extrabold text-[#1D4533]">Public Passport Access</h4>
                    <p className="text-[11px] text-[#5E3122]">Allow consumers and clients to scan without logging into the UniQR platform.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setPublicAccess(!publicAccess)}
                    className={`px-3 py-1.5 rounded-xl font-bold ${publicAccess ? 'bg-emerald-700 text-white' : 'bg-rose-700 text-white'}`}
                  >
                    {publicAccess ? '● Enabled' : 'Disabled'}
                  </button>
                </div>

                {/* Scan Analytics */}
                <div className="p-4 rounded-2xl bg-[#F7EAE0]/50 border border-[#F9D2BA] flex items-center justify-between">
                  <div>
                    <h4 className="font-extrabold text-[#1D4533]">Scan Telemetry Analytics</h4>
                    <p className="text-[11px] text-[#5E3122]">Record client scan timestamps, device operating systems, and response latencies.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setScanAnalytics(!scanAnalytics)}
                    className={`px-3 py-1.5 rounded-xl font-bold ${scanAnalytics ? 'bg-emerald-700 text-white' : 'bg-rose-700 text-white'}`}
                  >
                    {scanAnalytics ? '● Enabled' : 'Disabled'}
                  </button>
                </div>

                {/* Public URL Domain */}
                <div className="p-4 rounded-2xl bg-[#F7EAE0]/50 border border-[#F9D2BA] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h4 className="font-extrabold text-[#1D4533]">Public Redirection Domain</h4>
                    <p className="text-[11px] text-[#5E3122]">Custom short URL prefix stamped onto physical laser/printed labels.</p>
                  </div>
                  <input
                    type="text"
                    value={qrDomain}
                    onChange={(e) => setQrDomain(e.target.value)}
                    className="px-3 py-1.5 rounded-xl border border-[#F9D2BA] bg-white font-mono text-xs font-bold text-[#1D4533] focus:outline-none"
                  />
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      sound.playSuccessChime();
                      alert('Organization QR policies saved successfully!');
                    }}
                    className="px-5 py-2.5 rounded-xl bg-[#1D4533] hover:bg-[#5E3122] text-[#F7EAE0] font-extrabold text-xs transition-all shadow-md"
                  >
                    Save QR Policies
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ════ VIEW F: AUDIT LOGS & GOVERNANCE ════ */}
          {(activeCategory === 'audit-logs' || activeCategory === 'security' || activeCategory === 'system' || activeCategory === 'branding') && (
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#F9D2BA] shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-[#F9D2BA] pb-4">
                <div>
                  <h2 className="text-xl font-extrabold text-[#1D4533]">System Audit Logs</h2>
                  <p className="text-xs text-[#5E3122] font-medium mt-0.5">
                    Immutable security trail of all administrative and policy actions
                  </p>
                </div>
                <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  Cryptographically Sealed
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-[#F9D2BA] text-[#5E3122] font-extrabold uppercase text-[10px] tracking-wider">
                      <th className="py-2.5 px-3">Time</th>
                      <th className="py-2.5 px-3">User</th>
                      <th className="py-2.5 px-3">Action</th>
                      <th className="py-2.5 px-3">Resource Target</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F9D2BA]/40">
                    {auditLogs.map((log, idx) => (
                      <tr key={idx} className="hover:bg-[#F7EAE0]/30 transition-colors">
                        <td className="py-3 px-3 font-mono font-bold text-[#1D4533]">{log.time}</td>
                        <td className="py-3 px-3 font-bold text-[#1D4533]">{log.user}</td>
                        <td className="py-3 px-3 text-[#5E3122] font-semibold">{log.action}</td>
                        <td className="py-3 px-3 font-mono text-[11px] text-[#1D4533]">{log.resource}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>

      </div>

      {/* ─── 3. INVITE USER MODAL ─── */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-3xl border border-[#F9D2BA] shadow-2xl p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-[#F9D2BA] pb-3">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-[#1D4533]" />
                <h3 className="text-lg font-extrabold text-[#1D4533]">Invite Organization User</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsInviteModalOpen(false)}
                className="p-1 rounded-lg text-[#5E3122] hover:bg-[#F7EAE0]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-extrabold text-[#5E3122] uppercase tracking-wider text-[10px]">Full Name</label>
                <input
                  type="text"
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  placeholder="e.g. Ramesh Kulkarni"
                  className="w-full px-3 py-2 rounded-xl border border-[#F9D2BA] bg-white text-[#1D4533] font-medium text-xs focus:outline-none focus:border-[#1D4533]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-extrabold text-[#5E3122] uppercase tracking-wider text-[10px]">Work Email *</label>
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full px-3 py-2 rounded-xl border border-[#F9D2BA] bg-white text-[#1D4533] font-medium text-xs focus:outline-none focus:border-[#1D4533]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-extrabold text-[#5E3122] uppercase tracking-wider text-[10px]">Assigned Role</label>
                  <select
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#F9D2BA] bg-white text-[#1D4533] font-bold text-xs focus:outline-none"
                  >
                    <option value="Manager">Manager</option>
                    <option value="Inspector">Inspector</option>
                    <option value="Viewer">Viewer</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-extrabold text-[#5E3122] uppercase tracking-wider text-[10px]">Team</label>
                  <select
                    value={inviteTeam}
                    onChange={(e) => setInviteTeam(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#F9D2BA] bg-white text-[#1D4533] font-bold text-xs focus:outline-none"
                  >
                    <option value="Operations">Operations</option>
                    <option value="Quality Assurance">Quality Assurance</option>
                    <option value="Customer Support">Customer Support</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#F9D2BA]">
              <button
                type="button"
                onClick={() => setIsInviteModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-[#F9D2BA] text-xs font-bold text-[#5E3122] hover:bg-[#F7EAE0]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleInviteUser}
                className="px-5 py-2 rounded-xl bg-[#1D4533] hover:bg-[#5E3122] text-[#F7EAE0] font-extrabold text-xs transition-all shadow-md"
              >
                Send Invite
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
