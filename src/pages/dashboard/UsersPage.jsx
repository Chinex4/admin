import React, { useEffect } from "react";
import DashboardCards from "../../components/dashboard/DashboardCards";
import UsersTable from "../../components/dashboard/UsersTable";
import { Users, ArrowDownToLine, ArrowUpToLine } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers } from "../../slices/fetchSlice";
import { setUsers } from "../../slices/userSlice";

const UsersPage = () => {
  const dispatch = useDispatch();
  const { fetchedUsers } = useSelector((state) => state.data);
  const { users } = useSelector((state) => state.users);
  useEffect(() => {
    dispatch(setUsers(fetchedUsers));
  }, [dispatch, fetchedUsers]);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const usersCardData = [
    { label: "Total Users", value: users.length, icon: <Users size={36} /> },
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

  return (
    <div className='space-y-5'>
      <DashboardCards cardData={usersCardData} />
      <UsersTable />
    </div>
  );
};

export default UsersPage;
