import React, { useEffect, useState, Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
// import { setAdvancedKycs } from '../../slices/kycSlice'; // Optional if you want to store manually
import { Popover, Transition } from "@headlessui/react";
import { EllipsisVertical } from "lucide-react";
import {
  approveKycAsync,
  disapproveKycAsync,
  deleteKycAsync,
  // fetchAdvancedKycs,
  updateAdvancedKycAsync,
} from "../../slices/kycSlice";
import EditAdvancedKycModal from "../modals/EditAdvancedKycModal";
import ImageViewerModal from "../modals/ImageViewerModal";

const dummyAdvancedKycs = [
  {
    id: 1,
    kycId: "KYC001",
    userId: "USR001",
    proofOfAddress: "https://via.placeholder.com/150",
    createdAt: "2025-08-01",
    updatedAt: "2025-08-02",
    ipAddress: "192.168.1.1",
    status: "Pending",
    reviewedAt: "",
    rejectionReason: "",
    attempts: 1,
  },
  {
    id: 2,
    kycId: "KYC002",
    userId: "USR002",
    proofOfAddress: "https://via.placeholder.com/150",
    createdAt: "2025-08-03",
    updatedAt: "",
    ipAddress: "192.168.1.2",
    status: "Rejected",
    reviewedAt: "2025-08-04",
    rejectionReason: "Invalid document format",
    attempts: 2,
  },
];

const AdvancedKycTable = () => {
  const dispatch = useDispatch();

  // const advancedKycs = useSelector((state) => state.kyc.advancedKycs);
  const [advancedKycs, setAdvancedKycs] = useState(dummyAdvancedKycs); // use dummy for now

  const [search, setSearch] = useState("");
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedKyc, setSelectedKyc] = useState(null);

  const [showImageModal, setShowImageModal] = useState(false);
  const [activeImageUrl, setActiveImageUrl] = useState("");

  useEffect(() => {
    // dispatch(fetchAdvancedKycs()); // REAL API call
  }, [dispatch]);

  const filtered = advancedKycs.filter((kyc) =>
    Object.values(kyc).some((val) =>
      String(val).toLowerCase().includes(search.toLowerCase())
    )
  );

  const directActions = [
    {
      label: "Edit KYC",
      action: (id) => {
        const kyc = advancedKycs.find((k) => k.id === id);
        setSelectedKyc(kyc);
        setEditModalOpen(true);
      },
    },
    { label: "Approve KYC", action: (id) => dispatch(approveKycAsync(id)) },
    {
      label: "Disapprove KYC",
      action: (id) => dispatch(disapproveKycAsync(id)),
    },
    { label: "Delete KYC", action: (id) => dispatch(deleteKycAsync(id)) },
  ];

  return (
    <>
      <div className="mt-6 bg-[#1f1f1f] rounded-xl p-6">
        <h2 className="text-xl font-semibold text-white mb-4">
          Advanced KYC Submissions
        </h2>
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full mb-4 px-4 py-2 rounded-md bg-[#111] text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-lime-400"
        />
        <div className="overflow-x-auto rounded-xl scrollbar-hide">
          <table className="table-auto text-sm text-left text-white w-full">
            <thead className="bg-[#121212] text-gray-300">
              <tr>
                <th className="px-3 py-2">#</th>
                <th className="px-3 py-2">KYC ID</th>
                <th className="px-3 py-2">User ID</th>
                <th className="px-3 py-2">Proof of Address</th>
                <th className="px-3 py-2">Created At</th>
                <th className="px-3 py-2">Updated At</th>
                <th className="px-3 py-2">IP Address</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2">Reviewed At</th>
                <th className="px-3 py-2">Rejection Reason</th>
                <th className="px-3 py-2">Attempts</th>
                <th className="px-3 py-2">Action</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((kyc, idx) => (
                <tr
                  key={kyc.id}
                  className="border-b border-gray-800 hover:bg-[#2a2a2a]"
                >
                  <td className="px-3 py-2">{idx + 1}</td>
                  <td className="px-3 py-2">{kyc.kycId}</td>
                  <td className="px-3 py-2">{kyc.userId}</td>
                   <td className="px-3 py-2">
                    {kyc.proofOfAddress ? (
                      <img
                        src={kyc.proofOfAddress}
                        alt="proof of address"
                        className="w-16 h-16 object-cover rounded hover:opacity-90 transition duration-150 cursor-pointer"
                        onClick={() => {
                          setActiveImageUrl(kyc.proofOfAddress);
                          setShowImageModal(true);
                        }}
                      />
                    ) : (
                      "N/A"
                    )}
                  </td>
                  <td className="px-3 py-2">{kyc.createdAt}</td>
                  <td className="px-3 py-2">{kyc.updatedAt || "—"}</td>
                  <td className="px-3 py-2">{kyc.ipAddress}</td>
                  <td className="px-3 py-2">{kyc.status}</td>
                  <td className="px-3 py-2">{kyc.reviewedAt || "—"}</td>
                  <td className="px-3 py-2">{kyc.rejectionReason || "—"}</td>
                  <td className="px-3 py-2">{kyc.attempts}</td>

                  <td className="px-3 py-2 relative z-50">
                    <Popover className="relative z-50">
                      <>
                        <Popover.Button className="text-white hover:text-gray-300">
                          <EllipsisVertical className="w-5 h-5" />
                        </Popover.Button>

                        <Transition
                          as={Fragment}
                          enter="transition ease-out duration-200"
                          enterFrom="opacity-0 scale-95"
                          enterTo="opacity-100 scale-100"
                          leave="transition ease-in duration-150"
                          leaveFrom="opacity-100 scale-100"
                          leaveTo="opacity-0 scale-95"
                        >
                          <Popover.Panel
                            static
                            className="fixed top-[63%] left-[43%] lg:left-[85%] transform -translate-x-1/2 -translate-y-1/2 z-50 bg-[#111] text-white shadow-md rounded-md border border-gray-700 p-2 w-64 space-y-1 text-sm"
                          >
                            <p className="text-gray-400 text-xs mb-1">
                              Direct Actions
                            </p>
                            {directActions.map(({ label, action }, i) => (
                              <button
                                key={i}
                                onClick={() => action(kyc.id)}
                                className="w-full text-left px-2 py-1 hover:bg-[#222] rounded"
                              >
                                {label}
                              </button>
                            ))}
                          </Popover.Panel>
                        </Transition>
                      </>
                    </Popover>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <EditAdvancedKycModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        kyc={selectedKyc}
        onSave={(updates) =>
          dispatch(updateAdvancedKycAsync({ id: selectedKyc.id, updates }))
        }
      />
      <ImageViewerModal
        isOpen={showImageModal}
        onClose={() => setShowImageModal(false)}
        imageUrl={activeImageUrl}
      />
    </>
  );
};

export default AdvancedKycTable;
