import React from 'react';
import { useSelector } from 'react-redux';
import EditWithdrawModal from './EditWithdrawModal';

const WithdrawManager = () => {
  const { withdrawModalType } = useSelector((state) => state.withdrawals);
  return (
    <>
      {withdrawModalType === 'edit' && <EditWithdrawModal />}
    </>
  );
};

export default WithdrawManager;
