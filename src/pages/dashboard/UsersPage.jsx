import React from "react";
import DashboardCards from "../../components/dashboard/DashboardCards";
import UsersTable from "../../components/dashboard/UsersTable";
import { Users, ArrowDownToLine, ArrowUpToLine } from "lucide-react";

const usersCardData = [
  { label: "Total Users", value: "1,209", icon: <Users size={36} /> },
  {
    label: "Total Deposits",
    value: "$245,310",
    icon: <ArrowDownToLine size={36} />,
  },
  {
    label: "Total Withdrawals",
    value: "$132,800",
    icon: <ArrowUpToLine size={36} />,
  },
];

const UsersPage = () => {
  return (
    <div className='space-y-5'>
      <DashboardCards cardData={usersCardData} />
      <UsersTable />
    </div>
  );
};

export default UsersPage;
