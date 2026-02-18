import React from 'react';
import { useSelector } from 'react-redux';
import WinTradeModal from './WinTradeModal';
import LoseTradeModal from './LoseTradeModal';
import EditTradeModal from './EditTradeModal';

const TradeModalsManager = () => {
	const { tradeModalType } = useSelector((state) => state.trades);

	return (
		<>
			{tradeModalType === 'win' && <WinTradeModal />}
			{tradeModalType === 'loss' && <LoseTradeModal />}
			{tradeModalType === 'edit' && <EditTradeModal />}
		</>
	);
};

export default TradeModalsManager;




