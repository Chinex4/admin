import React from 'react'
import DashboardCards from '../../components/dashboard/DashboardCards'
import WalletsTable from '../../components/dashboard/WalletTable'
import { useSelector } from "react-redux";


const WalletPage = () => {
  const { wallets } = useSelector((state) => state.wallets);

  const walletsData = [
    {
      label: "Total Wallets",
      value: wallets.length,
      icon: <i className='bi bi-wallet2 text-3xl' />,
    },
  ];
  return (
    <div>
        <DashboardCards cardData={walletsData} centerSingleCard/>
        <WalletsTable />
    </div>
  )
}

export default WalletPage
