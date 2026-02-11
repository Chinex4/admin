import React from "react";
import DashboardCards from "../../components/dashboard/DashboardCards";
import ProofOfPaymentTable from "../../components/dashboard/ProofOfPaymentTable";

const proofCardData = [
  {
    label: "Total Proofs",
    value: "578",
    icon: <i className='bi bi-file-earmark-text text-3xl' />,
  },
  {
    label: "Approved Proofs",
    value: "435",
    icon: <i className='bi bi-check-circle text-3xl' />,
  },
  {
    label: "Pending Proofs",
    value: "143",
    icon: <i className='bi bi-clock text-3xl' />,
  },
];

const ProofPage = () => {
  return (
    <div className='space-y-5'>
      <DashboardCards cardData={proofCardData} />
      <ProofOfPaymentTable />
    </div>
  );
};

export default ProofPage;
