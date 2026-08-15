import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  GripVertical, 
  ChevronDown, 
  ChevronRight, 
  Copy, 
  Shield, 
  Lock, 
  Eye, 
  EyeOff, 
  Sparkles, 
  Settings2,
  Sliders,
  FileText,
  DollarSign,
  Hash,
  Calendar,
  CheckSquare,
  Link,
  QrCode,
  MapPin,
  FileCode,
  Layers,
  Cpu,
  Truck,
  Edit3
} from 'lucide-react';
import { BuilderSection, CustomFieldDef, FieldType, FieldValidationRule } from '../../types';
import { sound } from '../../services/audio';

interface SectionFieldBuilderProps {
  sections: BuilderSection[];
  onChangeSections: (sections: BuilderSection[]) => void;
}

const SUPPORTED_FIELD_TYPES: FieldType[] = [
  'Text',
  'Long Text',
  'Number',
  'Currency',
  'Percentage',
  'Date',
  'Date & Time',
  'Boolean',
  'Dropdown',
  'Multi Select',
  'Radio Buttons',
  'Checkbox Group',
  'Email',
  'Phone',
  'URL',
  'Barcode',
  'QR Reference',
  'File Upload',
  'Image Upload',
  'Signature',
  'GPS Location',
  'JSON',
  'Rich Text',
  'Formula',
  'Lookup',
  'Relation',
  'AI Generated',
  'Hidden/Internal'
];

export const SectionFieldBuilder: React.FC<SectionFieldBuilderProps> = ({
  sections,
  onChangeSections
}) => {
  const [activeTab, setActiveTab] = useState<'Details' | 'Trail' | 'Custom'>('Details');
  const [editingFieldModal, setEditingFieldModal] = useState<{ sectionId: string; field: CustomFieldDef } | null>(null);

  // Add new section
  const handleAddSection = (category: 'Details' | 'Trail' | 'Custom', presetTitle?: string) => {
    const title = presetTitle || prompt('Enter New Section Title:', `Custom ${category} Section`);
    if (!title) return;

    const newSection: BuilderSection = {
      id: `sec-${Date.now()}`,
      title,
      category,
      isCollapsed: false,
      fields: [
        {
          id: `f-${Date.now()}-1`,
          name: `${title} Reference Code`,
          type: 'Barcode',
          value: `REF-${Math.floor(Math.random() * 899999 + 100000)}`,
          validation: { required: true, isPublic: category === 'Details' }
        }
      ]
    };

    onChangeSections([...sections, newSection]);
  };

  // Preset Template Loader
  const handleLoadPresetTemplate = (type: 'Medical' | 'Vehicle' | 'Electronics') => {
    if (type === 'Medical') {
      const medicalSections: BuilderSection[] = [
        {
          id: `sec-med-steril-${Date.now()}`,
          title: 'Sterilization & ISO Compliance',
          category: 'Details',
          fields: [
            { id: 'm-steril-batch', name: 'Sterilization Batch ID', type: 'Barcode', value: 'STER-2026-X99', validation: { required: true, isPublic: true } },
            { id: 'm-iso-cert', name: 'ISO 13485 Certification', type: 'URL', value: 'https://cert.iso.org/13485/AGB-991', validation: { isPublic: true } },
            { id: 'm-autoclave-temp', name: 'Autoclave Max Temperature (°C)', type: 'Number', value: 134, validation: { min: 100, max: 200, isPublic: true } }
          ]
        },
        {
          id: `sec-med-calib-${Date.now()}`,
          title: 'Calibration & Maintenance Schedule',
          category: 'Trail',
          fields: [
            { id: 'm-last-calib', name: 'Last Calibration Date', type: 'Date', value: '2026-06-01', validation: { isPublic: false } },
            { id: 'm-next-calib', name: 'Next Due Calibration', type: 'Date', value: '2027-06-01', validation: { isPublic: false } },
            { id: 'm-calib-officer', name: 'Certified Bio-Engineer', type: 'Text', value: 'Dr. A. Kulkarni', validation: { isPublic: false } }
          ]
        }
      ];
      onChangeSections([...sections, ...medicalSections]);
    } else if (type === 'Vehicle') {
      const vehicleSections: BuilderSection[] = [
        {
          id: `sec-veh-eng-${Date.now()}`,
          title: 'Engine & Registration Info',
          category: 'Details',
          fields: [
            { id: 'v-chassis', name: 'Chassis VIN Number', type: 'Text', value: 'MA3EWB1S0009923', validation: { required: true, regex: '^[A-Z0-9]{17}$', regexDescription: '17-character VIN', isPublic: true } },
            { id: 'v-reg', name: 'Registration Plate', type: 'Barcode', value: 'KA-01-MJ-8821', validation: { isPublic: true } },
            { id: 'v-fuel', name: 'Fuel Type', type: 'Dropdown', value: 'Electric', validation: { options: ['Electric', 'Diesel', 'Petrol', 'CNG', 'Hybrid'], isPublic: true } }
          ]
        },
        {
          id: `sec-veh-service-${Date.now()}`,
          title: 'Service & Odometer History',
          category: 'Trail',
          fields: [
            { id: 'v-odo', name: 'Odometer (km)', type: 'Number', value: 14200, validation: { min: 0, isPublic: false } },
            { id: 'v-gps', name: 'GPS Telemetry Node', type: 'GPS Location', value: '12.9716, 77.5946', validation: { isPublic: false } }
          ]
        }
      ];
      onChangeSections([...sections, ...vehicleSections]);
    }
  };

  const handleRemoveSection = (sectionId: string) => {
    sound.playClick();
    onChangeSections(sections.filter(s => s.id !== sectionId));
  };

  const handleSectionTitleChange = (sectionId: string, newTitle: string) => {
    const updated = sections.map(sec => {
      if (sec.id === sectionId) {
        return { ...sec, title: newTitle };
      }
      return sec;
    });
    onChangeSections(updated);
  };

  const handleFieldNameChange = (sectionId: string, fieldId: string, newName: string) => {
    const updated = sections.map(sec => {
      if (sec.id === sectionId) {
        return {
          ...sec,
          fields: sec.fields.map(f => f.id === fieldId ? { ...f, name: newName } : f)
        };
      }
      return sec;
    });
    onChangeSections(updated);
  };

  const handleDuplicateSection = (sec: BuilderSection) => {
    const dup: BuilderSection = {
      ...sec,
      id: `sec-${Date.now()}`,
      title: `${sec.title} (Copy)`,
      fields: sec.fields.map(f => ({ ...f, id: `f-${Date.now()}-${Math.random().toString(36).substr(2, 4)}` }))
    };
    onChangeSections([...sections, dup]);
  };

  const handleAddField = (sectionId: string) => {
    const fieldName = prompt('Enter New Field Name:', 'New Custom Field');
    if (!fieldName) return;

    const newField: CustomFieldDef = {
      id: `f-${Date.now()}`,
      name: fieldName,
      type: 'Text',
      value: '',
      validation: { required: false, isPublic: true }
    };

    const updated = sections.map(sec => {
      if (sec.id === sectionId) {
        return { ...sec, fields: [...sec.fields, newField] };
      }
      return sec;
    });

    onChangeSections(updated);
  };

  const handleRemoveField = (sectionId: string, fieldId: string) => {
    const updated = sections.map(sec => {
      if (sec.id === sectionId) {
        return { ...sec, fields: sec.fields.filter(f => f.id !== fieldId) };
      }
      return sec;
    });
    onChangeSections(updated);
  };

  const handleFieldValueChange = (sectionId: string, fieldId: string, val: any) => {
    const updated = sections.map(sec => {
      if (sec.id === sectionId) {
        const updatedFields = sec.fields.map(f => {
          if (f.id === fieldId) {
            return { ...f, value: val };
          }
          return f;
        });
        return { ...sec, fields: updatedFields };
      }
      return sec;
    });
    onChangeSections(updated);
  };

  const handleSaveFieldValidation = (sectionId: string, updatedField: CustomFieldDef) => {
    const updated = sections.map(sec => {
      if (sec.id === sectionId) {
        const fields = sec.fields.map(f => (f.id === updatedField.id ? updatedField : f));
        return { ...sec, fields };
      }
      return sec;
    });
    onChangeSections(updated);
    setEditingFieldModal(null);
  };

  const filteredSections = sections.filter(s => s.category === activeTab);

  return (
    <div className="space-y-6">
      
      {/* Category Tabs & Template Preset Buttons */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
        
        <div className="flex items-center gap-1.5 bg-[#5E3122] p-1 rounded-xl border border-[#F9D2BA]/30">
          {(['Details', 'Trail', 'Custom'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg font-bold text-xs transition-all ${
                activeTab === tab
                  ? 'bg-[#F9D2BA] text-[#1D4533] shadow-sm'
                  : 'text-[#F7EAE0] hover:bg-[#1D4533]'
              }`}
            >
              {tab === 'Details' && 'Details Sections'}
              {tab === 'Trail' && 'Trail Ledger Sections'}
              {tab === 'Custom' && 'Custom Category Templates'}
            </button>
          ))}
        </div>

      </div>

      {/* Render Filtered Sections */}
      <div className="space-y-4">
        {filteredSections.length === 0 ? (
          <div className="text-center py-10 border border-dashed border-[#F9D2BA] rounded-2xl bg-white">
            <Layers className="w-8 h-8 text-[#5E3122] mx-auto mb-2" />
            <p className="text-xs text-[#5E3122] font-medium">No sections added in {activeTab} category.</p>
            <button
              onClick={() => handleAddSection(activeTab)}
              className="mt-3 px-4 py-2 bg-[#1D4533] text-[#F7EAE0] rounded-xl text-xs font-bold"
            >
              + Create First {activeTab} Section
            </button>
          </div>
        ) : (
          filteredSections.map((sec) => (
            <div
              key={sec.id}
              className="bg-white border border-[#F9D2BA] rounded-2xl overflow-hidden shadow-sm"
            >
              {/* Section Header */}
              <div className="bg-[#1D4533] px-4 py-3 border-b border-[#F9D2BA]/30 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <GripVertical className="w-4 h-4 text-[#F9D2BA] cursor-grab" />
                  {sec.isSystemProtected ? (
                    <span className="font-extrabold text-sm text-[#F7EAE0]">{sec.title}</span>
                  ) : (
                    <div className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 px-2 py-0.5 rounded-lg border border-transparent focus-within:border-[#F9D2BA] focus-within:bg-white transition-colors group/title">
                      <input
                        type="text"
                        value={sec.title}
                        onChange={(e) => handleSectionTitleChange(sec.id, e.target.value)}
                        placeholder="Section Title"
                        className="font-extrabold text-sm text-[#F7EAE0] group-focus-within/title:text-[#1D4533] bg-transparent focus:outline-none max-w-[180px] sm:max-w-xs truncate"
                        title="Click to rename section"
                      />
                      <Edit3 className="w-3 h-3 text-[#F9D2BA] group-focus-within/title:text-[#1D4533] shrink-0" />
                    </div>
                  )}
                  {sec.isSystemProtected && (
                    <span className="text-[10px] bg-[#5E3122] text-[#F9D2BA] px-2 py-0.5 rounded-full flex items-center gap-1 font-bold">
                      <Lock className="w-3 h-3" /> System
                    </span>
                  )}
                  <span className="text-[10px] bg-[#F9D2BA] text-[#1D4533] font-bold px-2 py-0.5 rounded-full">
                    {sec.fields.length} Fields
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleAddField(sec.id)}
                    className="text-xs bg-[#F9D2BA] hover:bg-[#F7EAE0] text-[#1D4533] px-2.5 py-1 rounded-lg font-bold flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Field
                  </button>
                  <button
                    onClick={() => handleDuplicateSection(sec)}
                    className="p-1.5 text-[#F7EAE0] hover:text-[#F9D2BA] rounded-lg"
                    title="Duplicate Section"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                  {!sec.isSystemProtected && (
                    <button
                      onClick={() => handleRemoveSection(sec.id)}
                      className="p-1.5 text-[#F9D2BA] hover:text-red-300 rounded-lg"
                      title="Remove Section"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Section Fields Grid */}
              <div className="p-4 space-y-3 bg-[#FFFFFF]">
                {sec.fields.map((field) => (
                  <div
                    key={field.id}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-[#F7EAE0] p-3 rounded-xl border border-[#F9D2BA]"
                  >
                    <div className="flex items-center gap-3 w-full sm:w-1/3">
                      <GripVertical className="w-3.5 h-3.5 text-[#5E3122] cursor-grab" />
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 bg-white/60 hover:bg-white px-1.5 py-0.5 rounded border border-transparent focus-within:border-[#F9D2BA] transition-colors group/fn">
                          <input
                            type="text"
                            value={field.name}
                            onChange={(e) => handleFieldNameChange(sec.id, field.id, e.target.value)}
                            className="text-xs font-bold text-[#1D4533] bg-transparent focus:outline-none max-w-[150px] truncate"
                            title="Click to rename field"
                          />
                          <Edit3 className="w-3 h-3 text-[#5E3122] opacity-60 group-hover/fn:opacity-100 shrink-0" />
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] text-[#1D4533] font-mono bg-[#F9D2BA] px-1.5 py-0.5 rounded font-bold">
                            {field.type}
                          </span>
                          {field.validation?.required && (
                            <span className="text-[9px] text-red-700 font-bold uppercase">✓ Required</span>
                          )}
                          {field.validation?.isPublic ? (
                            <span className="text-[9px] text-emerald-400 flex items-center gap-0.5">
                              <Eye className="w-2.5 h-2.5" /> Public
                            </span>
                          ) : (
                            <span className="text-[9px] text-amber-400 flex items-center gap-0.5">
                              <EyeOff className="w-2.5 h-2.5" /> Internal
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Field Value Input Preview */}
                    <div className="w-full sm:w-1/2">
                      {field.type === 'Dropdown' ? (
                        <select
                          value={String(field.value)}
                          onChange={(e) => handleFieldValueChange(sec.id, field.id, e.target.value)}
                          className="w-full bg-graphite-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white"
                        >
                          {(field.validation?.options || ['Default Option', 'Option A', 'Option B']).map(opt => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      ) : field.type === 'Boolean' ? (
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={Boolean(field.value)}
                            onChange={(e) => handleFieldValueChange(sec.id, field.id, e.target.checked)}
                            className="rounded border-slate-700 text-electric"
                          />
                          <span className="text-xs text-slate-300">{field.value ? 'Enabled (True)' : 'Disabled (False)'}</span>
                        </label>
                      ) : (
                        <input
                          type={field.type === 'Number' || field.type === 'Currency' ? 'number' : 'text'}
                          value={String(field.value)}
                          onChange={(e) => handleFieldValueChange(sec.id, field.id, e.target.value)}
                          placeholder={field.validation?.placeholder || `Enter ${field.name}`}
                          className="w-full bg-graphite-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:border-electric focus:ring-1 focus:ring-electric"
                        />
                      )}
                    </div>

                    {/* Field Options Actions */}
                    <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                      <button
                        onClick={() => setEditingFieldModal({ sectionId: sec.id, field: { ...field } })}
                        className="text-[#5E3122] hover:text-[#1D4533] p-0.5 rounded transition-colors"
                        title="Configure Validation & Rules"
                      >
                        <Sliders className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleRemoveField(sec.id, field.id)}
                        className="text-[#5E3122] hover:text-red-700 p-0.5 rounded transition-colors"
                        title="Delete Field"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                  </div>
                ))}
              </div>

            </div>
          ))
        )}
      </div>

      {/* Add New Section Button */}
      <button
        onClick={() => handleAddSection(activeTab)}
        className="w-full py-3 border border-dashed border-[#F9D2BA] hover:border-[#1D4533] rounded-2xl bg-[#F7EAE0] hover:bg-[#F9D2BA] text-[#1D4533] font-extrabold text-xs flex items-center justify-center gap-2 transition-all shadow-sm"
      >
        <Plus className="w-4 h-4 text-[#1D4533]" /> Add Custom {activeTab} Section
      </button>

      {/* No-Code Validation Rule Config Modal */}
      {editingFieldModal && (
        <div className="fixed inset-0 z-50 bg-[#5E3122]/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white border border-[#F9D2BA] rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl text-[#5E3122]">
            
            <div className="flex items-center justify-between border-b border-[#F9D2BA] pb-3">
              <h3 className="text-sm font-extrabold text-[#1D4533] flex items-center gap-2">
                <Settings2 className="w-4 h-4 text-[#1D4533]" /> Field Validation &amp; Rules Builder
              </h3>
              <button
                onClick={() => setEditingFieldModal(null)}
                className="text-[#5E3122] hover:bg-[#F7EAE0] p-1 rounded-lg text-xs font-mono"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-xs font-bold text-[#5E3122]">Field Name</label>
                <input
                  type="text"
                  value={editingFieldModal.field.name}
                  onChange={(e) => setEditingFieldModal({
                    ...editingFieldModal,
                    field: { ...editingFieldModal.field, name: e.target.value }
                  })}
                  className="w-full mt-1 bg-[#F7EAE0] border border-[#F9D2BA] rounded-xl p-2.5 text-xs text-[#5E3122] font-bold focus:border-[#1D4533] focus:ring-2 focus:ring-[#1D4533] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#5E3122]">Field Type (28 Supported)</label>
                <select
                  value={editingFieldModal.field.type}
                  onChange={(e) => setEditingFieldModal({
                    ...editingFieldModal,
                    field: { ...editingFieldModal.field, type: e.target.value as FieldType }
                  })}
                  className="w-full mt-1 bg-[#F7EAE0] border border-[#F9D2BA] rounded-xl p-2.5 text-xs text-[#5E3122] font-bold focus:border-[#1D4533] focus:ring-2 focus:ring-[#1D4533] focus:outline-none"
                >
                  {SUPPORTED_FIELD_TYPES.map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <label className="flex items-center gap-2 bg-[#F7EAE0] p-2.5 rounded-xl border border-[#F9D2BA] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(editingFieldModal.field.validation?.required)}
                    onChange={(e) => setEditingFieldModal({
                      ...editingFieldModal,
                      field: {
                        ...editingFieldModal.field,
                        validation: { ...editingFieldModal.field.validation, required: e.target.checked }
                      }
                    })}
                    className="rounded border-[#F9D2BA] bg-white text-[#1D4533] focus:ring-[#1D4533]"
                  />
                  <span className="text-xs text-[#1D4533] font-extrabold">Required Field</span>
                </label>

                <label className="flex items-center gap-2 bg-[#F7EAE0] p-2.5 rounded-xl border border-[#F9D2BA] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(editingFieldModal.field.validation?.isPublic)}
                    onChange={(e) => setEditingFieldModal({
                      ...editingFieldModal,
                      field: {
                        ...editingFieldModal.field,
                        validation: { ...editingFieldModal.field.validation, isPublic: e.target.checked }
                      }
                    })}
                    className="rounded border-[#F9D2BA] bg-white text-[#1D4533] focus:ring-[#1D4533]"
                  />
                  <span className="text-xs text-[#1D4533] font-extrabold">Public View</span>
                </label>
              </div>

              {/* Regex Validation Rule */}
              <div>
                <label className="text-xs font-bold text-[#5E3122]">Regex Validation Pattern</label>
                <input
                  type="text"
                  placeholder="e.g. [A-Z]{3}-[0-9]{8}"
                  value={editingFieldModal.field.validation?.regex || ''}
                  onChange={(e) => setEditingFieldModal({
                    ...editingFieldModal,
                    field: {
                      ...editingFieldModal.field,
                      validation: { ...editingFieldModal.field.validation, regex: e.target.value }
                    }
                  })}
                  className="w-full mt-1 bg-[#F7EAE0] border border-[#F9D2BA] rounded-xl p-2.5 text-xs text-[#5E3122] font-mono font-bold focus:border-[#1D4533] focus:ring-2 focus:ring-[#1D4533] focus:outline-none"
                />
              </div>

              {/* Help Text */}
              <div>
                <label className="text-xs font-bold text-[#5E3122]">Help Text / Tooltip</label>
                <input
                  type="text"
                  placeholder="e.g. Serial number printed on back plate"
                  value={editingFieldModal.field.validation?.helpText || ''}
                  onChange={(e) => setEditingFieldModal({
                    ...editingFieldModal,
                    field: {
                      ...editingFieldModal.field,
                      validation: { ...editingFieldModal.field.validation, helpText: e.target.value }
                    }
                  })}
                  className="w-full mt-1 bg-[#F7EAE0] border border-[#F9D2BA] rounded-xl p-2.5 text-xs text-[#5E3122] font-bold focus:border-[#1D4533] focus:ring-2 focus:ring-[#1D4533] focus:outline-none"
                />
              </div>

            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#F9D2BA]">
              <button
                onClick={() => setEditingFieldModal(null)}
                className="px-4 py-2 text-xs text-[#5E3122] font-bold hover:bg-[#F7EAE0] rounded-xl border border-[#F9D2BA]"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSaveFieldValidation(editingFieldModal.sectionId, editingFieldModal.field)}
                className="px-4 py-2 bg-[#1D4533] hover:bg-[#5E3122] text-[#F7EAE0] font-extrabold text-xs rounded-xl shadow-md transition-all"
              >
                Save Field Rules
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
