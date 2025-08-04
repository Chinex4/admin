import React from 'react';
import DashboardCards from '../../components/dashboard/DashboardCards';
import KycTable from '../../components/dashboard/KYCTable';
import InstitutionalVerificationTable from './../../components/dashboard/InstitutionalVerificationTable';

const InstitutionalVerificationPage = () => {
  return (
    <div>
      <DashboardCards />
      <InstitutionalVerificationTable />
    </div>
  );
};

export default InstitutionalVerificationPage;
