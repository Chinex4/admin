import React from 'react';
import { useSelector } from 'react-redux';
import EditDepositModal from './EditDepositModal';

const DepositsManager = () => {
  const { depositModalType } = useSelector((state) => state.deposits);

  return (
    <>
      {depositModalType === 'edit' && <EditDepositModal />}
    </>
  );
};

export default DepositsManager;




