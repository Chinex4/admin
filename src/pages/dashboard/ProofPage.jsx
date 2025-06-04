import React from "react";
import DashboardCards from "../../components/dashboard/DashboardCards";
import ProofOfPaymentTable from "../../components/dashboard/ProofOfPaymentTable";

import { FileText, CheckCircle, Clock } from "lucide-react";

const proofCardData = [
  { label: "Total Proofs", value: "578", icon: <FileText size={36} /> },
  { label: "Approved Proofs", value: "435", icon: <CheckCircle size={36} /> },
  { label: "Pending Proofs", value: "143", icon: <Clock size={36} /> },
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
