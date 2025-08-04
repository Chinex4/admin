import React from 'react';
import DashboardCards from '../../components/dashboard/DashboardCards';
import KycTable from '../../components/dashboard/KYCTable';
import AdvancedKycTable from './../../components/dashboard/AdvancedKYCTable';

const AdvancedKYCPage = () => {
  return (
    <div>
      <DashboardCards />
      <AdvancedKycTable />
    </div>
  );
};

export default AdvancedKYCPage;
