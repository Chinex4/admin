import React from 'react'
import DashboardCards from '../../components/dashboard/DashboardCards'
import WalletsTable from '../../components/dashboard/WalletTable'
import { useDispatch, useSelector } from "react-redux";
import { Wallet } from 'lucide-react';
import { Users, ArrowDownToLine, ArrowUpToLine } from "lucide-react";


const WalletPage = () => {
  const dispatch = useDispatch();
  const { wallets } = useSelector((state) => state.wallets);

  const walletsData = [
    { label: "Total Wallets", value: wallets.length, icon: <Wallet size={36} /> },
    
  ];
  return (
    <div>
        <DashboardCards cardData={walletsData} centerSingleCard/>
        <WalletsTable />
    </div>
  )
}

export default WalletPage