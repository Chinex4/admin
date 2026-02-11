import React from 'react';
import { useSelector } from 'react-redux';
import EditUserModal from './EditUserModal';
import ChangeSignalModal from './ChangeSignalModal';
import FundUserModal from './FundUserModal';
import AddProfitModal from './AddProfitModal';
import AddLossModal from './AddLossModal';
import EditWalletModal from './EditWalletModal';

const ModalsManager = () => {
	const { modalType } = useSelector((state) => state.users);

	return (
		<>
			{modalType === 'edit' && <EditUserModal />}
			{modalType === 'signal' && <ChangeSignalModal />}
			{modalType === 'fund' && <FundUserModal />}
			{modalType === 'profit' && <AddProfitModal />}
			{modalType === 'loss' && <AddLossModal />}
			{modalType === 'editWallet' && <EditWalletModal />}
		</>
	);
};

export default ModalsManager;




