import React, { useEffect, useMemo, useState } from 'react';
import DashboardCards from '../../components/dashboard/DashboardCards';
import axiosInstance from '../../utils/axiosInstance';
import { showError } from '../../utils/toast';

const TABLE_COLUMNS = [
  { key: 'disableId', label: 'Disable ID' },
  { key: 'userId', label: 'User ID' },
  { key: 'uid', label: 'UID' },
  { key: 'email', label: 'Email' },
  { key: 'disabledBy', label: 'Disabled By' },
  { key: 'reason', label: 'Reason' },
  { key: 'status', label: 'Status' },
  { key: 'createdAt', label: 'Created At' },
  { key: 'ipAddress', label: 'IP Address' },
  { key: 'userAgent', label: 'User Agent' },
];

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

const extractDisabledAccountRows = (response) => {
  const payload = response?.data;
  if (Array.isArray(payload?.message)) return payload.message;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.records)) return payload.records;
  if (Array.isArray(payload)) return payload;
  return [];
};

const normalizeRecord = (item = {}, index = 0) => ({
  id: item?.id ?? item?.disableId ?? item?.disable_id ?? `row-${index}`,
  disableId: item?.disableId ?? item?.disable_id ?? '',
  userId: item?.userId ?? item?.user_id ?? '',
  uid: item?.uid ?? '',
  email: item?.email ?? '',
  disabledBy: item?.disabledBy ?? item?.disabled_by ?? '',
  reason: item?.reason ?? '',
  status: item?.status ?? '',
  createdAt: item?.createdAt ?? item?.created_at ?? '',
  ipAddress: item?.ipAddress ?? item?.ip_address ?? '',
  userAgent: item?.userAgent ?? item?.user_agent ?? '',
});

const formatValue = (value) => {
  if (value === null || value === undefined) return '-';
  const text = String(value).trim();
  return text === '' ? '-' : text;
};

const normalizeSortValue = (value) => {
  if (value === null || value === undefined) return '';
  if (typeof value === 'number') return value;
  const text = String(value).trim();
  if (text === '') return '';
  const asNumber = Number(text.replace(/,/g, ''));
  if (Number.isFinite(asNumber) && text !== '') return asNumber;
  const asDate = Date.parse(text);
  if (!Number.isNaN(asDate)) return asDate;
  return text.toLowerCase();
};

const compareSortValues = (a, b, direction) => {
  const left = normalizeSortValue(a);
  const right = normalizeSortValue(b);

  let result = 0;
  if (typeof left === 'number' && typeof right === 'number') {
    result = left - right;
  } else {
    result = String(left).localeCompare(String(right), undefined, {
      numeric: true,
      sensitivity: 'base',
    });
  }

  return direction === 'asc' ? result : -result;
};

const DisabledAccountsPage = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState('desc');
  const [pageSize, setPageSize] = useState(25);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchDisabledAccounts = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await axiosInstance.get('admin/disabledAccounts');
      const rows = extractDisabledAccountRows(response);
      const normalized = rows.map((item, index) => normalizeRecord(item, index));
      setRecords(normalized);
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        'Failed to fetch disabled accounts';
      setError(String(message));
      showError(String(message));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDisabledAccounts();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, sortBy, sortDirection, pageSize]);

  const filteredRecords = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return records;
    return records.filter((row) =>
      TABLE_COLUMNS.some((column) =>
        String(formatValue(row[column.key])).toLowerCase().includes(query)
      )
    );
  }, [records, search]);

  const sortedRecords = useMemo(() => {
    const next = [...filteredRecords];
    next.sort((a, b) => compareSortValues(a?.[sortBy], b?.[sortBy], sortDirection));
    return next;
  }, [filteredRecords, sortBy, sortDirection]);

  const totalPages = Math.max(1, Math.ceil(sortedRecords.length / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * pageSize;
  const paginatedRecords = useMemo(
    () => sortedRecords.slice(startIndex, startIndex + pageSize),
    [sortedRecords, startIndex, pageSize]
  );

  const cards = [
    {
      label: 'Disabled Accounts',
      value: loading ? '...' : records.length,
      icon: <i className="bi bi-person-x text-3xl" />,
    },
  ];

  return (
    <div className="space-y-5">
      <DashboardCards cardData={cards} centerSingleCard />

      <div className="panel panel-pad">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <h2 className="text-xl font-semibold text-white">Disabled Accounts</h2>
          <div className="grid w-full gap-2 sm:grid-cols-2 lg:flex lg:w-auto lg:items-center">
            <input
              type="text"
              placeholder="Search disabled accounts..."
              className="input-dark w-full lg:w-80"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
            <select
              className="select-dark w-full lg:w-44"
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
            >
              {TABLE_COLUMNS.map((column) => (
                <option key={column.key} value={column.key}>
                  Sort: {column.label}
                </option>
              ))}
            </select>
            <button
              type="button"
              className="button-ghost text-xs"
              onClick={() =>
                setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'))
              }
            >
              {sortDirection === 'asc' ? 'Ascending' : 'Descending'}
            </button>
            <select
              className="select-dark w-full lg:w-36"
              value={String(pageSize)}
              onChange={(event) => setPageSize(Number(event.target.value))}
            >
              {PAGE_SIZE_OPTIONS.map((size) => (
                <option key={size} value={size}>
                  Limit: {size}
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <p className="muted-text mt-6">Loading disabled accounts...</p>
        ) : error ? (
          <div className="mt-6 flex items-center justify-between gap-3 text-red-400">
            <p>{error}</p>
            <button className="button-ghost text-xs" onClick={fetchDisabledAccounts}>
              Retry
            </button>
          </div>
        ) : (
          <>
            <div className="mt-6 table-wrap scrollbar-hide max-h-[70vh] overflow-y-auto">
              <table className="table-base">
                <thead className="table-head sticky top-0 z-20 bg-slate-900/80 backdrop-blur">
                  <tr>
                    <th className="px-3 py-2 whitespace-nowrap">No.</th>
                    {TABLE_COLUMNS.map((column) => (
                      <th key={column.key} className="px-3 py-2 whitespace-nowrap">
                        {column.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sortedRecords.length === 0 ? (
                    <tr className="table-row">
                      <td
                        className="px-3 py-3 whitespace-nowrap"
                        colSpan={TABLE_COLUMNS.length + 1}
                      >
                        No disabled account records found.
                      </td>
                    </tr>
                  ) : (
                    paginatedRecords.map((item, index) => (
                      <tr key={item.id} className="table-row">
                        <td className="px-3 py-2 whitespace-nowrap">
                          {startIndex + index + 1}
                        </td>
                        {TABLE_COLUMNS.map((column) => (
                          <td
                            key={`${item.id}-${column.key}`}
                            className="px-3 py-2 whitespace-nowrap"
                          >
                            {formatValue(item[column.key])}
                          </td>
                        ))}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {sortedRecords.length > 0 && (
              <div className="mt-3 flex flex-col gap-2 text-xs text-slate-300 sm:flex-row sm:items-center sm:justify-between">
                <span>
                  Showing {startIndex + 1}-
                  {Math.min(startIndex + pageSize, sortedRecords.length)} of{' '}
                  {sortedRecords.length}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="button-ghost text-xs"
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(1, prev - 1))
                    }
                    disabled={safeCurrentPage === 1}
                  >
                    Prev
                  </button>
                  <span>
                    Page {safeCurrentPage} of {totalPages}
                  </span>
                  <button
                    type="button"
                    className="button-ghost text-xs"
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                    }
                    disabled={safeCurrentPage === totalPages}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default DisabledAccountsPage;
