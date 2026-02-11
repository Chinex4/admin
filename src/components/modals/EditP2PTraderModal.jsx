import { Fragment, useEffect, useMemo, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import axiosInstance from '../../utils/axiosInstance';
import { showError, showSuccess } from '../../utils/toast';

const EMPTY_FORM = {
  name: '',
  username: '',
  verified: 'Yes',
  emailVerified: true,
  smsVerified: true,
  idVerified: true,
  topSeller: false,
  completion: '',
  orders: '',
  price: '',
  limits: '',
  quantity: '',
  avgRelease: '',
  payment: '',
  country: '',
  status: '',
  lastActive: '',
  adType: '',
};

const EditP2PTraderModal = ({ trader, onClose, onUpdated }) => {
  const [form, setForm] = useState(EMPTY_FORM);
  const [isSaving, setIsSaving] = useState(false);

  const textFields = useMemo(
    () => [
      { key: 'name', label: 'Name' },
      { key: 'username', label: 'Username' },
      { key: 'completion', label: 'Completion' },
      { key: 'orders', label: 'Orders' },
      { key: 'price', label: 'Price' },
      { key: 'limits', label: 'Limits' },
      { key: 'quantity', label: 'Quantity' },
      { key: 'avgRelease', label: 'Avg Release' },
      { key: 'payment', label: 'Payment' },
      { key: 'country', label: 'Country' },
      { key: 'lastActive', label: 'Last Active' },
      { key: 'adType', label: 'Ad Type' },
    ],
    []
  );

  useEffect(() => {
    if (trader) {
      setForm({
        ...EMPTY_FORM,
        ...trader,
      });
    }
  }, [trader]);

  const handleClose = () => {
    setForm(EMPTY_FORM);
    onClose();
  };

  const handleSubmit = async () => {
    const requiredFields = [
      'name',
      'username',
      'price',
      'limits',
      'quantity',
      'payment',
      'country',
      'adType',
    ];
    const missing = requiredFields.filter(
      (field) => String(form[field] ?? '').trim() === ''
    );
    if (missing.length) {
      showError(`Please fill: ${missing.join(', ')}`);
      return;
    }

    const payload = {
      ...form,
      orders: form.orders === '' ? '' : Number(form.orders),
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
      <label className="block mb-1 text-sm">{label}</label>
      <select
        value={form[fieldKey] ? 'yes' : 'no'}
        onChange={(e) =>
          setForm((prev) => ({
            ...prev,
            [fieldKey]: e.target.value === 'yes',
          }))
        }
        className="input-dark text-sm"
      >
        <option value="yes">Yes</option>
        <option value="no">No</option>
      </select>
    </div>
  );

  return (
    <Transition appear show={!!trader} as={Fragment}>
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
              <Dialog.Panel className="w-full max-w-3xl transform overflow-hidden rounded-xl modal-panel p-6 transition-all">
                <Dialog.Title className="text-lg font-semibold mb-4">
                  Edit P2P Trader
                </Dialog.Title>

                <div className="grid gap-4 md:grid-cols-2">
                  {textFields.map((field) => (
                    <div key={field.key}>
                      <label className="block mb-1 text-sm">
                        {field.label}
                      </label>
                      <input
                        type="text"
                        value={form[field.key]}
                        onChange={(e) =>
                          setForm((prev) => ({
                            ...prev,
                            [field.key]: e.target.value,
                          }))
                        }
                        className="input-dark text-sm"
                      />
                    </div>
                  ))}

                  <div>
                    <label className="block mb-1 text-sm">Verified</label>
                    <select
                      value={form.verified}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          verified: e.target.value,
                        }))
                      }
                      className="input-dark text-sm"
                    >
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                  <div>
                    <label className="block mb-1 text-sm">Status</label>
                    <select
                      value={form.status}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          status: e.target.value,
                        }))
                      }
                      className="input-dark text-sm"
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>

                  {renderYesNoSelect('emailVerified', 'Email Verified')}
                  {renderYesNoSelect('smsVerified', 'SMS Verified')}
                  {renderYesNoSelect('idVerified', 'ID Verified')}
                  {renderYesNoSelect('topSeller', 'Top Seller')}
                </div>

                <div className="mt-6 flex justify-end space-x-2">
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
