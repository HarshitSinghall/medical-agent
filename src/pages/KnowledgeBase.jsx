import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { supabase } from '../lib/supabase';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import {
  MapPin,
  Clock,
  Phone,
  Mail,
  Save,
  Building2,
  Globe,
  Truck,
  FileText,
  CheckCircle2,
  Loader2,
  AlertCircle,
} from 'lucide-react';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const BRANCHES = [
  { id: 1, code: 'PMBJKN', label: 'Main Store' },
  { id: 2, code: 'JAB-02', label: 'Main Store' },
  { id: 3, code: 'JAK-02', label: 'Main Store' },
];

const BRANCH_STORAGE_KEY = 'kb:selectedBranchId';

const defaultHours = DAYS.reduce((acc, day) => {
  acc[day] = {
    open: day === 'Sunday' ? '09:00' : '08:00',
    close: day === 'Sunday' ? '18:00' : '22:00',
    closed: false,
  };
  return acc;
}, {});

const emptyData = {
  storeName: '',
  address: '',
  city: '',
  state: '',
  pincode: '',
  phone: '',
  altPhone: '',
  email: '',
  website: '',
  deliveryRadius: '',
  hours: defaultHours,
  additionalNotes: '',
};

/* ─── Supabase helpers ─── */
function toRow(data, branch) {
  return {
    id: branch.id,
    branch_code: branch.code,
    store_name: data.storeName,
    address: data.address,
    city: data.city,
    state: data.state,
    pincode: data.pincode,
    phone: data.phone,
    alt_phone: data.altPhone,
    email: data.email,
    website: data.website,
    delivery_radius: data.deliveryRadius,
    opening_hours: data.hours,
    additional_notes: data.additionalNotes,
    updated_at: new Date().toISOString(),
  };
}

function fromRow(row) {
  return {
    storeName: row.store_name || '',
    address: row.address || '',
    city: row.city || '',
    state: row.state || '',
    pincode: row.pincode || '',
    phone: row.phone || '',
    altPhone: row.alt_phone || '',
    email: row.email || '',
    website: row.website || '',
    deliveryRadius: row.delivery_radius || '',
    hours: row.opening_hours || defaultHours,
    additionalNotes: row.additional_notes || '',
  };
}

export default function KnowledgeBase() {
  const [selectedId, setSelectedId] = useState(() => {
    const stored = typeof window !== 'undefined' ? parseInt(localStorage.getItem(BRANCH_STORAGE_KEY), 10) : NaN;
    return BRANCHES.some((b) => b.id === stored) ? stored : BRANCHES[0].id;
  });
  const selectedBranch = BRANCHES.find((b) => b.id === selectedId) || BRANCHES[0];
  const [data, setData] = useState(emptyData);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  /* ── Fetch on branch change ── */
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setSaved(false);
    setLastUpdated(null);
    setData(emptyData);

    (async () => {
      try {
        const { data: row, error } = await supabase
          .from('store_details')
          .select('*')
          .eq('id', selectedId)
          .maybeSingle();

        if (cancelled) return;
        if (error) throw error;
        if (row) {
          setData(fromRow(row));
          setLastUpdated(row.updated_at);
          setSaved(true);
        }
      } catch (err) {
        if (cancelled) return;
        console.error('Failed to load store details:', err);
        toast.error('Failed to load store details');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [selectedId]);

  const handleBranchChange = (id) => {
    setSelectedId(id);
    localStorage.setItem(BRANCH_STORAGE_KEY, String(id));
  };

  const update = (field, value) => {
    setData((prev) => ({ ...prev, [field]: value }));
    setSaved(false);
  };

  const updateHour = (day, field, value) => {
    setData((prev) => ({
      ...prev,
      hours: {
        ...prev.hours,
        [day]: { ...prev.hours[day], [field]: value },
      },
    }));
    setSaved(false);
  };

  /* ── Save / upsert to Supabase ── */
  const handleSave = async () => {
    if (!data.storeName.trim()) {
      toast.error('Store name is required');
      return;
    }

    setSaving(true);
    try {
      const row = toRow(data, selectedBranch);
      const { error } = await supabase
        .from('store_details')
        .upsert(row, { onConflict: 'id' });

      if (error) throw error;

      setSaved(true);
      setLastUpdated(row.updated_at);
      toast.success('Store details saved to database');
    } catch (err) {
      console.error('Save failed:', err);
      toast.error('Failed to save — check console for details');
    } finally {
      setSaving(false);
    }
  };

  const inputCls =
    'w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none transition-all bg-gray-50/50 focus:bg-white';

  /* ── Loading skeleton ── */
  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 size={28} className="animate-spin text-primary-500" />
        <span className="ml-3 text-sm text-gray-500 font-medium">Loading store details…</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 fade-slide-in max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-primary-100 flex items-center justify-center">
              <Building2 size={18} className="text-primary-700" />
            </div>
            Store Details
          </h1>
          <p className="text-sm text-gray-500 mt-1 ml-[46px]">
            Enter your store information — the AI agent will use this to answer customer queries.
          </p>
        </div>
        <div className="hidden sm:flex flex-col items-end gap-1">
          {saved && (
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full">
              <CheckCircle2 size={14} /> Synced
            </span>
          )}
          {lastUpdated && (
            <span className="text-[11px] text-gray-400">
              Last saved: {new Date(lastUpdated).toLocaleString()}
            </span>
          )}
        </div>
      </div>

      {/* ───── Branch Selector ───── */}
      <Card className="p-6">
        <h2 className="text-[15px] font-bold text-gray-900 flex items-center gap-2 mb-3">
          <Building2 size={16} className="text-primary-600" />
          Store Location
        </h2>
        <p className="text-xs text-gray-500 mb-4">
          Select a store ID to view or edit its details. Each ID maps to one branch record in the database.
        </p>

        {/* Dropdown (primary) */}
        <div className="mb-4 max-w-xs">
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">Store ID</label>
          <select
            value={selectedId}
            onChange={(e) => handleBranchChange(parseInt(e.target.value, 10))}
            className={inputCls}
          >
            {BRANCHES.map((b) => (
              <option key={b.id} value={b.id}>
                ID {b.id} — {b.code} ({b.label})
              </option>
            ))}
          </select>
        </div>

        {/* Tile shortcuts */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {BRANCHES.map((b) => {
            const active = b.id === selectedId;
            return (
              <button
                key={b.id}
                type="button"
                onClick={() => handleBranchChange(b.id)}
                className={`rounded-xl border px-4 py-3 text-left transition-all ${
                  active
                    ? 'border-primary-500 bg-primary-50 ring-2 ring-primary-500/20'
                    : 'border-gray-200 bg-white hover:border-primary-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className={`text-sm font-semibold ${active ? 'text-primary-700' : 'text-gray-900'}`}>
                    {b.code}
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      active ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    ID {b.id}
                  </span>
                </div>
                <div className="text-xs text-gray-500 mt-0.5">{b.label}</div>
              </button>
            );
          })}
        </div>
      </Card>

      {/* ───── Location & Contact ───── */}
      <Card className="p-6">
        <h2 className="text-[15px] font-bold text-gray-900 flex items-center gap-2 mb-5">
          <MapPin size={16} className="text-primary-600" />
          Location &amp; Contact
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Store Name */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">
              Store Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={data.storeName}
              onChange={(e) => update('storeName', e.target.value)}
              placeholder="e.g. Healthriver Pharmacy"
              className={inputCls}
            />
          </div>

          {/* Address */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Address</label>
            <input
              type="text"
              value={data.address}
              onChange={(e) => update('address', e.target.value)}
              placeholder="e.g. 123 Health Avenue, Medical District"
              className={inputCls}
            />
          </div>

          {/* City */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">City</label>
            <input
              type="text"
              value={data.city}
              onChange={(e) => update('city', e.target.value)}
              placeholder="e.g. Mumbai"
              className={inputCls}
            />
          </div>

          {/* State */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">State</label>
            <input
              type="text"
              value={data.state}
              onChange={(e) => update('state', e.target.value)}
              placeholder="e.g. Maharashtra"
              className={inputCls}
            />
          </div>

          {/* Pincode */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Pincode</label>
            <input
              type="text"
              value={data.pincode}
              onChange={(e) => update('pincode', e.target.value)}
              placeholder="e.g. 400001"
              className={inputCls}
            />
          </div>

          {/* Delivery Radius */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5 flex items-center gap-1">
              <Truck size={12} className="text-gray-400" /> Delivery Radius
            </label>
            <input
              type="text"
              value={data.deliveryRadius}
              onChange={(e) => update('deliveryRadius', e.target.value)}
              placeholder="e.g. 5 km"
              className={inputCls}
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5 flex items-center gap-1">
              <Phone size={12} className="text-gray-400" /> Phone
            </label>
            <input
              type="tel"
              value={data.phone}
              onChange={(e) => update('phone', e.target.value)}
              placeholder="+91 98765 43210"
              className={inputCls}
            />
          </div>

          {/* Alt Phone */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Alternate Phone</label>
            <input
              type="tel"
              value={data.altPhone}
              onChange={(e) => update('altPhone', e.target.value)}
              placeholder="+91 98765 43211"
              className={inputCls}
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5 flex items-center gap-1">
              <Mail size={12} className="text-gray-400" /> Email
            </label>
            <input
              type="email"
              value={data.email}
              onChange={(e) => update('email', e.target.value)}
              placeholder="contact@Healthriver.in"
              className={inputCls}
            />
          </div>

          {/* Website */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5 flex items-center gap-1">
              <Globe size={12} className="text-gray-400" /> Website
            </label>
            <input
              type="url"
              value={data.website}
              onChange={(e) => update('website', e.target.value)}
              placeholder="https://Healthriver.in"
              className={inputCls}
            />
          </div>
        </div>
      </Card>

      {/* ───── Opening Hours ───── */}
      <Card className="p-6">
        <h2 className="text-[15px] font-bold text-gray-900 flex items-center gap-2 mb-5">
          <Clock size={16} className="text-primary-600" />
          Opening Hours
        </h2>

        <div className="space-y-3">
          {DAYS.map((day) => {
            const h = data.hours[day];
            return (
              <div
                key={day}
                className={`flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 px-4 py-3 rounded-xl border transition-all ${
                  h.closed
                    ? 'bg-gray-50 border-gray-200 opacity-60'
                    : 'bg-white border-gray-100 hover:border-primary-200'
                }`}
              >
                {/* Day name */}
                <span className="w-24 text-sm font-semibold text-gray-700 shrink-0">{day}</span>

                {/* Time pickers */}
                <div className="flex items-center gap-2 flex-1">
                  <input
                    type="time"
                    value={h.open}
                    disabled={h.closed}
                    onChange={(e) => updateHour(day, 'open', e.target.value)}
                    className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 focus:border-primary-500 focus:ring-1 focus:ring-primary-500/20 focus:outline-none disabled:opacity-40 bg-white"
                  />
                  <span className="text-xs text-gray-400 font-medium">to</span>
                  <input
                    type="time"
                    value={h.close}
                    disabled={h.closed}
                    onChange={(e) => updateHour(day, 'close', e.target.value)}
                    className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 focus:border-primary-500 focus:ring-1 focus:ring-primary-500/20 focus:outline-none disabled:opacity-40 bg-white"
                  />
                </div>

                {/* Closed toggle */}
                <label className="inline-flex items-center gap-2 cursor-pointer select-none shrink-0">
                  <input
                    type="checkbox"
                    checked={h.closed}
                    onChange={(e) => updateHour(day, 'closed', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 rounded-full bg-gray-200 peer-checked:bg-red-400 relative transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:w-4 after:h-4 after:rounded-full after:bg-white after:shadow after:transition-transform peer-checked:after:translate-x-4" />
                  <span className="text-xs font-medium text-gray-500">Closed</span>
                </label>
              </div>
            );
          })}
        </div>
      </Card>

      {/* ───── Additional Notes ───── */}
      <Card className="p-6">
        <h2 className="text-[15px] font-bold text-gray-900 flex items-center gap-2 mb-4">
          <FileText size={16} className="text-primary-600" />
          Additional Notes
        </h2>
        <textarea
          value={data.additionalNotes}
          onChange={(e) => update('additionalNotes', e.target.value)}
          rows={4}
          placeholder="Any extra information the AI agent should know (e.g. return policy, delivery charges, special services)..."
          className={`${inputCls} resize-none`}
        />
      </Card>

      {/* ───── Save Button ───── */}
      <div className="flex items-center justify-between pb-4">
        {!saved && (
          <span className="inline-flex items-center gap-1.5 text-xs text-amber-600 font-medium">
            <AlertCircle size={14} /> Unsaved changes
          </span>
        )}
        <div className="flex-1" />
        <Button onClick={handleSave} disabled={saving} className="px-8">
          {saving ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Saving…
            </>
          ) : (
            <>
              <Save size={16} />
              Save Details
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
