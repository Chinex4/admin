import { Fragment, useEffect, useMemo, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import axiosInstance from '../../utils/axiosInstance';
import { showError, showSuccess } from '../../utils/toast';
import { toBoolean } from '../../utils/p2p';

const EMPTY_FORM = {
  name: '',
  username: '',
  merchantType: 'individual',
  verified: 'Yes',
  emailVerified: true,
  smsVerified: true,
  idVerified: true,
  topSeller: false,
  asset: '',
  fiatCurrency: '',
  priceType: 'fixed',
  priceValue: '',
  priceMargin: '',
  minLimit: '',
  maxLimit: '',
  availableQuantity: '',
  paymentMethods: [],
  paymentDetails: {
    PayPal: { email: '' },
    'Bank Transfer': { bankName: '', accountName: '', accountNumber: '', routingNumber: '', swift: '', iban: '' },
    'Cash App': { cashtag: '' },
    'Wire Transfer': { bankName: '', accountName: '', accountNumber: '', routingNumber: '', swift: '', iban: '' },
  },
  country: '',
  kycRequired: 'none',
  status: 'Active',
  isOnline: true,
  isHidden: false,
  adType: '',
  terms: '',
  completion: '',
  orders: '',
  quantity: '',
  avgRelease: '',
  avgReleaseMinutes: '15',
  orderTimeLimitMinutes: '15',
  paymentWindow: '15',
  lastActive: '',
};

const PAYMENT_METHODS = ['PayPal', 'Bank Transfer', 'Cash App', 'Wire Transfer'];

const EditP2PTraderModal = ({ trader, onClose, onUpdated }) => {
  const [form, setForm] = useState(EMPTY_FORM);
  const [isSaving, setIsSaving] = useState(false);

  const textFields = useMemo(
    () => [
      { key: 'name', label: 'Name' },
      { key: 'username', label: 'Username' },
      { key: 'asset', label: 'Asset (Coin)' },
      { key: 'fiatCurrency', label: 'Fiat Currency' },
      { key: 'priceValue', label: 'Price Value' },
      { key: 'priceMargin', label: 'Price Margin %' },
      { key: 'minLimit', label: 'Min Limit' },
      { key: 'maxLimit', label: 'Max Limit' },
      { key: 'availableQuantity', label: 'Available Quantity' },
      { key: 'paymentMethods', label: 'Payment Methods (comma separated)' },
      { key: 'payment', label: 'Primary Payment' },
      { key: 'country', label: 'Country' },
      { key: 'adType', label: 'Ad Type (Buy/Sell)' },
      { key: 'terms', label: 'Terms' },
      { key: 'completion', label: 'Completion %' },
      { key: 'orders', label: 'Orders' },
      { key: 'quantity', label: 'Quantity (legacy)' },
      { key: 'avgRelease', label: 'Avg Release' },
      { key: 'avgReleaseMinutes', label: 'Avg Release Minutes' },
      { key: 'orderTimeLimitMinutes', label: 'Order Time Limit (min)' },
      { key: 'paymentWindow', label: 'Payment Window (min)' },
      { key: 'lastActive', label: 'Last Active' },
    ],
    []
  );

  useEffect(() => {
    if (trader) {
      let details = trader.paymentDetails;
      if (typeof details === 'string') {
        try {
          details = JSON.parse(details);
        } catch {
          details = null;
        }
      }
      setForm({
        ...EMPTY_FORM,
        ...trader,
        paymentMethods: Array.isArray(trader.paymentMethods)
          ? trader.paymentMethods
          : String(trader.paymentMethods || '')
              .split(',')
              .map((v) => v.trim())
              .filter(Boolean),
        paymentDetails: {
          ...EMPTY_FORM.paymentDetails,
          ...(details || {}),
        },
        emailVerified: toBoolean(trader.emailVerified),
        smsVerified: toBoolean(trader.smsVerified),
        idVerified: toBoolean(trader.idVerified),
        topSeller: toBoolean(trader.topSeller),
        isOnline: toBoolean(trader.isOnline),
        isHidden: toBoolean(trader.isHidden),
      });
    }
  }, [trader]);

  const handleClose = () => {
    setForm(EMPTY_FORM);
    onClose();
  };

  const parseNumber = (value, fieldLabel, allowEmpty = true) => {
    const trimmed = String(value ?? '').trim();
    if (!trimmed) {
      return allowEmpty ? '' : null;
    }
    const parsed = Number(trimmed);
    if (!Number.isFinite(parsed)) {
      showError(`${fieldLabel} must be a valid number`);
      return null;
    }
    return parsed;
  };

  const handleSubmit = async () => {
    const requiredFields = [
      'name',
      'username',
      'asset',
      'fiatCurrency',
      'priceType',
      'priceValue',
      'minLimit',
      'maxLimit',
      'availableQuantity',
      'paymentMethods',
      'country',
      'status',
      'adType',
    ];
    const missing = requiredFields.filter(
      (field) => String(form[field] ?? '').trim() === ''
    );
    if (missing.length) {
      showError(`Please fill: ${missing.join(', ')}`);
      return;
    }
    if (!Array.isArray(form.paymentMethods) || form.paymentMethods.length === 0) {
      showError('Select at least one payment method');
      return;
    }

    const detailsMissing = form.paymentMethods.some((method) => {
      const details = form.paymentDetails?.[method] || {};
      if (method === 'PayPal') return !String(details.email || '').trim();
      if (method === 'Cash App') return !String(details.cashtag || '').trim();
      if (method === 'Bank Transfer' || method === 'Wire Transfer') {
        return !String(details.bankName || '').trim()
          || !String(details.accountName || '').trim()
          || !String(details.accountNumber || '').trim();
      }
      return false;
    });
    if (detailsMissing) {
      showError('Please fill required payment details for selected methods');
      return;
    }

    const trimmedForm = {
      ...form,
      name: form.name.trim(),
      username: form.username.trim().replace(/^@/, ''),
      asset: form.asset.trim().toUpperCase(),
      fiatCurrency: form.fiatCurrency.trim().toUpperCase(),
      paymentMethods: form.paymentMethods,
      payment: form.paymentMethods.join(', '),
      country: form.country.trim(),
      adType: form.adType.trim(),
      terms: form.terms.trim(),
      completion: form.completion.trim(),
      quantity: form.quantity.trim(),
      avgRelease: form.avgRelease.trim(),
      lastActive: form.lastActive.trim(),
    };

    const numericPayload = {
      orders: parseNumber(trimmedForm.orders, 'Orders'),
      priceValue: parseNumber(trimmedForm.priceValue, 'Price Value', false),
      priceMargin: parseNumber(trimmedForm.priceMargin, 'Price Margin'),
      minLimit: parseNumber(trimmedForm.minLimit, 'Min Limit', false),
      maxLimit: parseNumber(trimmedForm.maxLimit, 'Max Limit', false),
      availableQuantity: parseNumber(
        trimmedForm.availableQuantity,
        'Available Quantity',
        false
      ),
      avgReleaseMinutes: parseNumber(
        trimmedForm.avgReleaseMinutes,
        'Avg Release Minutes',
        false
      ),
      orderTimeLimitMinutes: parseNumber(
        trimmedForm.orderTimeLimitMinutes,
        'Order Time Limit Minutes',
        false
      ),
      paymentWindow: parseNumber(trimmedForm.paymentWindow, 'Payment Window', false),
    };
    if (Object.values(numericPayload).some((v) => v === null)) return;

    const payload = {
      ...trimmedForm,
      ...numericPayload,
      paymentMethods: trimmedForm.paymentMethods,
      paymentDetails: trimmedForm.paymentDetails,
      emailVerified: toBoolean(trimmedForm.emailVerified),
      smsVerified: toBoolean(trimmedForm.smsVerified),
      idVerified: toBoolean(trimmedForm.idVerified),
      topSeller: toBoolean(trimmedForm.topSeller),
      isOnline: toBoolean(trimmedForm.isOnline),
      isHidden: toBoolean(trimmedForm.isHidden),
    };

    try {
      setIsSaving(true);
      await axiosInstance.put(`admin/p2pTraders/${trader.id}`, payload);
      showSuccess('P2P trader updated successfully');
      onUpdated?.({ ...payload, id: trader.id });
      handleClose();
    } catch (error) {
      console.error('Update P2P trader failed:', error);
      showError('Failed to update P2P trader');
    } finally {
      setIsSaving(false);
    }
  };

  const renderYesNoSelect = (fieldKey, label) => (
    <div>
      <label className='block mb-1 text-sm'>{label}</label>
      <select
        value={form[fieldKey] ? 'yes' : 'no'}
        onChange={(e) =>
          setForm((prev) => ({
            ...prev,
            [fieldKey]: e.target.value === 'yes',
          }))
        }
        className='input-dark text-sm'
      >
        <option value='yes'>Yes</option>
        <option value='no'>No</option>
      </select>
    </div>
  );

  const togglePaymentMethod = (method) => {
    setForm((prev) => {
      const exists = prev.paymentMethods.includes(method);
      const next = exists
        ? prev.paymentMethods.filter((m) => m !== method)
        : [...prev.paymentMethods, method];
      return { ...prev, paymentMethods: next };
    });
  };

  const updatePaymentDetail = (method, key, value) => {
    setForm((prev) => ({
      ...prev,
      paymentDetails: {
        ...prev.paymentDetails,
        [method]: { ...(prev.paymentDetails?.[method] || {}), [key]: value },
      },
    }));
  };

  return (
    <Transition appear show={!!trader} as={Fragment}>
      <Dialog as='div' className='relative z-50' onClose={handleClose}>
        <Transition.Child
          as={Fragment}
          enter='ease-out duration-300'
          enterFrom='opacity-0'
          enterTo='opacity-100'
          leave='ease-in duration-200'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'
        >
          <div className='fixed inset-0 bg-black' />
        </Transition.Child>

        <div className='fixed inset-0 overflow-y-auto'>
          <div className='flex min-h-full items-center justify-center p-4'>
            <Transition.Child
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0 scale-95'
              enterTo='opacity-100 scale-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100 scale-100'
              leaveTo='opacity-0 scale-95'
            >
              <Dialog.Panel className='w-full max-w-4xl transform overflow-hidden rounded-xl modal-panel p-6 transition-all'>
                <Dialog.Title className='text-lg font-semibold mb-4'>
                  Edit P2P Trader (V2)
                </Dialog.Title>

                <div className='grid gap-4 md:grid-cols-2'>
                  {textFields.map((field) => (
                    <div key={field.key}>
                      <label className='block mb-1 text-sm'>{field.label}</label>
                      <input
                        type='text'
                        value={form[field.key]}
                        onChange={(e) =>
                          setForm((prev) => ({
                            ...prev,
                            [field.key]: e.target.value,
                          }))
                        }
                        className='input-dark text-sm'
                      />
                    </div>
                  ))}

                  <div className='md:col-span-2'>
                    <label className='block mb-2 text-sm'>Payment Methods</label>
                    <div className='flex flex-wrap gap-3'>
                      {PAYMENT_METHODS.map((method) => (
                        <label key={method} className='flex items-center gap-2 text-sm'>
                          <input
                            type='checkbox'
                            checked={form.paymentMethods.includes(method)}
                            onChange={() => togglePaymentMethod(method)}
                          />
                          {method}
                        </label>
                      ))}
                    </div>
                  </div>

                  {form.paymentMethods.includes('PayPal') && (
                    <div>
                      <label className='block mb-1 text-sm'>PayPal Email</label>
                      <input
                        type='email'
                        value={form.paymentDetails.PayPal.email}
                        onChange={(e) => updatePaymentDetail('PayPal', 'email', e.target.value)}
                        className='input-dark text-sm'
                      />
                    </div>
                  )}

                  {form.paymentMethods.includes('Cash App') && (
                    <div>
                      <label className='block mb-1 text-sm'>Cash App Cashtag</label>
                      <input
                        type='text'
                        value={form.paymentDetails['Cash App'].cashtag}
                        onChange={(e) => updatePaymentDetail('Cash App', 'cashtag', e.target.value)}
                        className='input-dark text-sm'
                      />
                    </div>
                  )}

                  {form.paymentMethods.includes('Bank Transfer') && (
                    <>
                      <div>
                        <label className='block mb-1 text-sm'>Bank Name</label>
                        <input
                          type='text'
                          value={form.paymentDetails['Bank Transfer'].bankName}
                          onChange={(e) => updatePaymentDetail('Bank Transfer', 'bankName', e.target.value)}
                          className='input-dark text-sm'
                        />
                      </div>
                      <div>
                        <label className='block mb-1 text-sm'>Account Name</label>
                        <input
                          type='text'
                          value={form.paymentDetails['Bank Transfer'].accountName}
                          onChange={(e) => updatePaymentDetail('Bank Transfer', 'accountName', e.target.value)}
                          className='input-dark text-sm'
                        />
                      </div>
                      <div>
                        <label className='block mb-1 text-sm'>Account Number</label>
                        <input
                          type='text'
                          value={form.paymentDetails['Bank Transfer'].accountNumber}
                          onChange={(e) => updatePaymentDetail('Bank Transfer', 'accountNumber', e.target.value)}
                          className='input-dark text-sm'
                        />
                      </div>
                      <div>
                        <label className='block mb-1 text-sm'>Routing Number</label>
                        <input
                          type='text'
                          value={form.paymentDetails['Bank Transfer'].routingNumber}
                          onChange={(e) => updatePaymentDetail('Bank Transfer', 'routingNumber', e.target.value)}
                          className='input-dark text-sm'
                        />
                      </div>
                      <div>
                        <label className='block mb-1 text-sm'>SWIFT</label>
                        <input
                          type='text'
                          value={form.paymentDetails['Bank Transfer'].swift}
                          onChange={(e) => updatePaymentDetail('Bank Transfer', 'swift', e.target.value)}
                          className='input-dark text-sm'
                        />
                      </div>
                      <div>
                        <label className='block mb-1 text-sm'>IBAN</label>
                        <input
                          type='text'
                          value={form.paymentDetails['Bank Transfer'].iban}
                          onChange={(e) => updatePaymentDetail('Bank Transfer', 'iban', e.target.value)}
                          className='input-dark text-sm'
                        />
                      </div>
                    </>
                  )}

                  {form.paymentMethods.includes('Wire Transfer') && (
                    <>
                      <div>
                        <label className='block mb-1 text-sm'>Wire Bank Name</label>
                        <input
                          type='text'
                          value={form.paymentDetails['Wire Transfer'].bankName}
                          onChange={(e) => updatePaymentDetail('Wire Transfer', 'bankName', e.target.value)}
                          className='input-dark text-sm'
                        />
                      </div>
                      <div>
                        <label className='block mb-1 text-sm'>Wire Account Name</label>
                        <input
                          type='text'
                          value={form.paymentDetails['Wire Transfer'].accountName}
                          onChange={(e) => updatePaymentDetail('Wire Transfer', 'accountName', e.target.value)}
                          className='input-dark text-sm'
                        />
                      </div>
                      <div>
                        <label className='block mb-1 text-sm'>Wire Account Number</label>
                        <input
                          type='text'
                          value={form.paymentDetails['Wire Transfer'].accountNumber}
                          onChange={(e) => updatePaymentDetail('Wire Transfer', 'accountNumber', e.target.value)}
                          className='input-dark text-sm'
                        />
                      </div>
                      <div>
                        <label className='block mb-1 text-sm'>Wire Routing Number</label>
                        <input
                          type='text'
                          value={form.paymentDetails['Wire Transfer'].routingNumber}
                          onChange={(e) => updatePaymentDetail('Wire Transfer', 'routingNumber', e.target.value)}
                          className='input-dark text-sm'
                        />
                      </div>
                      <div>
                        <label className='block mb-1 text-sm'>Wire SWIFT</label>
                        <input
                          type='text'
                          value={form.paymentDetails['Wire Transfer'].swift}
                          onChange={(e) => updatePaymentDetail('Wire Transfer', 'swift', e.target.value)}
                          className='input-dark text-sm'
                        />
                      </div>
                      <div>
                        <label className='block mb-1 text-sm'>Wire IBAN</label>
                        <input
                          type='text'
                          value={form.paymentDetails['Wire Transfer'].iban}
                          onChange={(e) => updatePaymentDetail('Wire Transfer', 'iban', e.target.value)}
                          className='input-dark text-sm'
                        />
                      </div>
                    </>
                  )}

                  <div>
                    <label className='block mb-1 text-sm'>Merchant Type</label>
                    <select
                      value={form.merchantType}
                      onChange={(e) =>
                        setForm((prev) => ({ ...prev, merchantType: e.target.value }))
                      }
                      className='input-dark text-sm'
                    >
                      <option value='individual'>Individual</option>
                      <option value='merchant'>Merchant</option>
                    </select>
                  </div>
                  <div>
                    <label className='block mb-1 text-sm'>Price Type</label>
                    <select
                      value={form.priceType}
                      onChange={(e) =>
                        setForm((prev) => ({ ...prev, priceType: e.target.value }))
                      }
                      className='input-dark text-sm'
                    >
                      <option value='fixed'>Fixed</option>
                      <option value='floating'>Floating</option>
                    </select>
                  </div>
                  <div>
                    <label className='block mb-1 text-sm'>KYC Required</label>
                    <select
                      value={form.kycRequired}
                      onChange={(e) =>
                        setForm((prev) => ({ ...prev, kycRequired: e.target.value }))
                      }
                      className='input-dark text-sm'
                    >
                      <option value='none'>None</option>
                      <option value='basic'>Basic</option>
                      <option value='advanced'>Advanced</option>
                    </select>
                  </div>
                  <div>
                    <label className='block mb-1 text-sm'>Verified</label>
                    <select
                      value={form.verified}
                      onChange={(e) =>
                        setForm((prev) => ({ ...prev, verified: e.target.value }))
                      }
                      className='input-dark text-sm'
                    >
                      <option value='Yes'>Yes</option>
                      <option value='No'>No</option>
                    </select>
                  </div>
                  <div>
                    <label className='block mb-1 text-sm'>Status</label>
                    <select
                      value={form.status}
                      onChange={(e) =>
                        setForm((prev) => ({ ...prev, status: e.target.value }))
                      }
                      className='input-dark text-sm'
                    >
                      <option value='Active'>Active</option>
                      <option value='Inactive'>Inactive</option>
                      <option value='Paused'>Paused</option>
                    </select>
                  </div>

                  {renderYesNoSelect('emailVerified', 'Email Verified')}
                  {renderYesNoSelect('smsVerified', 'SMS Verified')}
                  {renderYesNoSelect('idVerified', 'ID Verified')}
                  {renderYesNoSelect('topSeller', 'Top Seller')}
                  {renderYesNoSelect('isOnline', 'Online')}
                  {renderYesNoSelect('isHidden', 'Hidden')}
                </div>

                <div className='mt-6 flex justify-end space-x-2'>
                  <button
                    onClick={handleClose}
                    className='button-ghost text-sm'
                    disabled={isSaving}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    className='button-primary text-sm'
                    disabled={isSaving}
                  >
                    {isSaving ? 'Saving...' : 'Save Changes'}
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

export default EditP2PTraderModal;
