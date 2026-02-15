import { Fragment, useMemo, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import axiosInstance from '../../utils/axiosInstance';
import { showError, showSuccess } from '../../utils/toast';

const DEFAULT_FORM = {
  display_name: '',
  username: '',
  avatar_url: '',
  status: 'active',
  kyc_status: 'unverified',
  copiers_count: '',
  aum_usd: '',
  total_return_pct: '',
  roi_30d_pct: '',
  roi_90d_pct: '',
  profit_factor: '',
  total_trades: '',
  max_drawdown_pct: '',
  volatility_30d: '',
  sharpe_ratio: '',
  avg_leverage: '',
  risk_score: '',
  liquidation_events: '',
  win_rate_pct: '',
  profit_share_pct: '',
  management_fee_pct: '',
  min_copy_amount_usd: '',
  max_copiers: '',
  copy_mode: 'proportional',
  slippage_limit_pct: '',
  markets: '',
  instruments: '',
  time_horizon: 'swing',
  strategy_description: '',
  tags: '',
  verified_track_record: false,
  exchange_linked: false,
  warning_flags: '',
  terms_accepted_at: '',
  last_active_at: '',
  created_at: '',
  is_public: true,
};

const AddCopyTradeTraderModal = ({ isOpen, onClose, onCreated }) => {
  const [form, setForm] = useState(DEFAULT_FORM);
  const [avatarFile, setAvatarFile] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const textFields = useMemo(
    () => [
      { key: 'display_name', label: 'Display Name' },
      { key: 'username', label: 'Username' },
      { key: 'copiers_count', label: 'Copiers Count' },
      { key: 'aum_usd', label: 'AUM (USD)' },
      { key: 'total_return_pct', label: 'Total Return (%)' },
      { key: 'roi_30d_pct', label: 'ROI 30D (%)' },
      { key: 'roi_90d_pct', label: 'ROI 90D (%)' },
      { key: 'profit_factor', label: 'Profit Factor' },
      { key: 'total_trades', label: 'Total Trades' },
      { key: 'max_drawdown_pct', label: 'Max Drawdown (%)' },
      { key: 'volatility_30d', label: 'Volatility 30D' },
      { key: 'sharpe_ratio', label: 'Sharpe Ratio' },
      { key: 'avg_leverage', label: 'Average Leverage' },
      { key: 'risk_score', label: 'Risk Score (0-100)' },
      { key: 'liquidation_events', label: 'Liquidation Events' },
      { key: 'win_rate_pct', label: 'Win Rate (%)' },
      { key: 'profit_share_pct', label: 'Profit Share (%)' },
      { key: 'management_fee_pct', label: 'Management Fee (%)' },
      { key: 'min_copy_amount_usd', label: 'Min Copy Amount (USD)' },
      { key: 'max_copiers', label: 'Max Copiers' },
      { key: 'slippage_limit_pct', label: 'Slippage Limit (%)' },
      { key: 'markets', label: 'Markets (comma-separated)' },
      { key: 'instruments', label: 'Instruments (comma-separated)' },
      { key: 'tags', label: 'Tags (comma-separated)' },
      { key: 'warning_flags', label: 'Warning Flags (comma-separated)' },
      { key: 'strategy_description', label: 'Strategy Description' },
      { key: 'terms_accepted_at', label: 'Terms Accepted At (ISO/Datetime)' },
      { key: 'last_active_at', label: 'Last Active At (ISO/Datetime)' },
      { key: 'created_at', label: 'Created At (ISO/Datetime)' },
    ],
    []
  );

  const handleClose = () => {
    if (form.avatar_url?.startsWith('blob:')) {
      URL.revokeObjectURL(form.avatar_url);
    }
    setForm(DEFAULT_FORM);
    setAvatarFile(null);
    onClose();
  };

  const parseNumber = (value, label, allowEmpty = false) => {
    const trimmed = String(value ?? '').trim();
    if (!trimmed) return allowEmpty ? '' : null;
    const parsed = Number(trimmed);
    if (!Number.isFinite(parsed)) {
      showError(`${label} must be a valid number`);
      return null;
    }
    return parsed;
  };

  const parseCsv = (value) =>
    String(value ?? '')
      .split(',')
      .map((v) => v.trim())
      .filter(Boolean);

  const handleAvatarUpload = (file) => {
    if (!file) return;
    if (form.avatar_url?.startsWith('blob:')) {
      URL.revokeObjectURL(form.avatar_url);
    }
    setAvatarFile(file);
    const previewUrl = URL.createObjectURL(file);
    setForm((prev) => ({ ...prev, avatar_url: previewUrl }));
  };

  const handleSubmit = async () => {
    const required = [
      'display_name',
      'username',
      'status',
      'kyc_status',
      'copiers_count',
      'aum_usd',
      'roi_30d_pct',
      'max_drawdown_pct',
      'win_rate_pct',
      'profit_share_pct',
      'min_copy_amount_usd',
      'last_active_at',
      'created_at',
    ];

    const missing = required.filter((key) => String(form[key] ?? '').trim() === '');
    if (missing.length > 0) {
      showError(`Please fill: ${missing.join(', ')}`);
      return;
    }

    const numericPayload = {
      copiers_count: parseNumber(form.copiers_count, 'Copiers Count'),
      aum_usd: parseNumber(form.aum_usd, 'AUM (USD)'),
      total_return_pct: parseNumber(form.total_return_pct, 'Total Return (%)', true),
      roi_30d_pct: parseNumber(form.roi_30d_pct, 'ROI 30D (%)'),
      roi_90d_pct: parseNumber(form.roi_90d_pct, 'ROI 90D (%)', true),
      profit_factor: parseNumber(form.profit_factor, 'Profit Factor', true),
      total_trades: parseNumber(form.total_trades, 'Total Trades', true),
      max_drawdown_pct: parseNumber(form.max_drawdown_pct, 'Max Drawdown (%)'),
      volatility_30d: parseNumber(form.volatility_30d, 'Volatility 30D', true),
      sharpe_ratio: parseNumber(form.sharpe_ratio, 'Sharpe Ratio', true),
      avg_leverage: parseNumber(form.avg_leverage, 'Average Leverage', true),
      risk_score: parseNumber(form.risk_score, 'Risk Score', true),
      liquidation_events: parseNumber(
        form.liquidation_events,
        'Liquidation Events',
        true
      ),
      win_rate_pct: parseNumber(form.win_rate_pct, 'Win Rate (%)'),
      profit_share_pct: parseNumber(form.profit_share_pct, 'Profit Share (%)'),
      management_fee_pct: parseNumber(
        form.management_fee_pct,
        'Management Fee (%)',
        true
      ),
      min_copy_amount_usd: parseNumber(
        form.min_copy_amount_usd,
        'Min Copy Amount (USD)'
      ),
      max_copiers: parseNumber(form.max_copiers, 'Max Copiers', true),
      slippage_limit_pct: parseNumber(
        form.slippage_limit_pct,
        'Slippage Limit (%)',
        true
      ),
    };
    if (Object.values(numericPayload).some((v) => v === null)) return;

    const payload = {
      display_name: form.display_name.trim(),
      username: form.username.trim().replace(/^@/, ''),
      status: form.status,
      kyc_status: form.kyc_status,
      ...numericPayload,
      copy_mode: form.copy_mode,
      markets: parseCsv(form.markets),
      instruments: parseCsv(form.instruments),
      time_horizon: form.time_horizon,
      strategy_description: form.strategy_description.trim(),
      tags: parseCsv(form.tags),
      verified_track_record: Boolean(form.verified_track_record),
      exchange_linked: Boolean(form.exchange_linked),
      warning_flags: parseCsv(form.warning_flags),
      terms_accepted_at: form.terms_accepted_at.trim(),
      last_active_at: form.last_active_at.trim(),
      created_at: form.created_at.trim(),
      is_public: Boolean(form.is_public),
    };

    const formData = new FormData();
    Object.entries(payload).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        formData.append(key, JSON.stringify(value));
        return;
      }
      if (typeof value === 'boolean') {
        formData.append(key, value ? 'true' : 'false');
        return;
      }
      if (value !== null && value !== undefined && value !== '') {
        formData.append(key, String(value));
      }
    });

    if (avatarFile) {
      formData.append('avatar', avatarFile, avatarFile.name);
    }

    try {
      setIsSaving(true);
      const res = await axiosInstance.post('admin/addCopyTrader', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const createdTrader = res?.data?.trader ?? res?.data?.data ?? {};
      const id = createdTrader?.id ?? createdTrader?._id ?? Date.now();
      showSuccess('Copy trader added successfully');
      onCreated?.({
        id,
        ...payload,
        avatar_url: form.avatar_url || createdTrader?.avatar_url || '',
      });
      handleClose();
    } catch (error) {
      console.error('Add copy trader failed:', error);
      showError('Failed to add copy trader');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={handleClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-3xl max-h-[90vh] transform overflow-hidden rounded-xl modal-panel transition-all flex flex-col">
                <div className="overflow-y-auto p-6">
                  <Dialog.Title className="text-lg font-semibold mb-4">
                    Add Copy Trader
                  </Dialog.Title>

                  <div className="grid gap-4 md:grid-cols-2">
                  <div className="md:col-span-2">
                    <label className="block mb-1 text-sm">Avatar Upload</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleAvatarUpload(e.target.files?.[0])}
                      className="input-dark text-sm"
                    />
                    {form.avatar_url && (
                      <div className="mt-2">
                        <img
                          src={form.avatar_url}
                          alt="Avatar preview"
                          className="h-16 w-16 rounded-full object-cover border border-slate-700"
                        />
                      </div>
                    )}
                  </div>

                  {textFields.map((field) => (
                    <div key={field.key}>
                      <label className="block mb-1 text-sm">{field.label}</label>
                      <input
                        type="text"
                        value={form[field.key]}
                        onChange={(e) =>
                          setForm((prev) => ({ ...prev, [field.key]: e.target.value }))
                        }
                        className="input-dark text-sm"
                      />
                    </div>
                  ))}

                  <div>
                    <label className="block mb-1 text-sm">Status</label>
                    <select
                      value={form.status}
                      onChange={(e) =>
                        setForm((prev) => ({ ...prev, status: e.target.value }))
                      }
                      className="input-dark text-sm"
                    >
                      <option value="active">Active</option>
                      <option value="paused">Paused</option>
                      <option value="banned">Banned</option>
                    </select>
                  </div>

                  <div>
                    <label className="block mb-1 text-sm">KYC Status</label>
                    <select
                      value={form.kyc_status}
                      onChange={(e) =>
                        setForm((prev) => ({ ...prev, kyc_status: e.target.value }))
                      }
                      className="input-dark text-sm"
                    >
                      <option value="unverified">Unverified</option>
                      <option value="pending">Pending</option>
                      <option value="verified">Verified</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>

                  <div>
                    <label className="block mb-1 text-sm">Public Profile</label>
                    <select
                      value={form.is_public ? 'yes' : 'no'}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          is_public: e.target.value === 'yes',
                        }))
                      }
                      className="input-dark text-sm"
                    >
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                  </div>

                  <div>
                    <label className="block mb-1 text-sm">Copy Mode</label>
                    <select
                      value={form.copy_mode}
                      onChange={(e) =>
                        setForm((prev) => ({ ...prev, copy_mode: e.target.value }))
                      }
                      className="input-dark text-sm"
                    >
                      <option value="fixed-amount">Fixed Amount</option>
                      <option value="proportional">Proportional</option>
                      <option value="risk-adjusted">Risk Adjusted</option>
                    </select>
                  </div>

                  <div>
                    <label className="block mb-1 text-sm">Time Horizon</label>
                    <select
                      value={form.time_horizon}
                      onChange={(e) =>
                        setForm((prev) => ({ ...prev, time_horizon: e.target.value }))
                      }
                      className="input-dark text-sm"
                    >
                      <option value="scalp">Scalp</option>
                      <option value="intraday">Intraday</option>
                      <option value="swing">Swing</option>
                      <option value="position">Position</option>
                    </select>
                  </div>

                  <div>
                    <label className="block mb-1 text-sm">Verified Track Record</label>
                    <select
                      value={form.verified_track_record ? 'yes' : 'no'}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          verified_track_record: e.target.value === 'yes',
                        }))
                      }
                      className="input-dark text-sm"
                    >
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                  </div>

                  <div>
                    <label className="block mb-1 text-sm">Exchange Linked</label>
                    <select
                      value={form.exchange_linked ? 'yes' : 'no'}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          exchange_linked: e.target.value === 'yes',
                        }))
                      }
                      className="input-dark text-sm"
                    >
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                  </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-2 border-t border-[color:var(--color-stroke)] px-6 py-4 bg-[color:var(--color-surface-1)]">
                  <button
                    onClick={handleClose}
                    className="button-ghost text-sm"
                    disabled={isSaving}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="button-primary text-sm"
                    disabled={isSaving}
                  >
                    {isSaving ? 'Saving...' : 'Save Copy Trader'}
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default AddCopyTradeTraderModal;
