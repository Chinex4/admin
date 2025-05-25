import { useState } from 'react'
import './App.css'
import { Route, Routes } from 'react-router-dom'
import Login from './pages/Login'
import DashboardLayout from './components/DashboardLayout'
import UsersPage from './pages/dashboard/UsersPage'
import PrivateRoute from './components/PrivateRoute'

function App() {

  return (
    <>
      <Routes>
        <Route path='/login' element={<Login />} />

        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route path="users" index element={<UsersPage />} />
            {/* <Route path="transactions" element={<TransactionsPage />} /> */}
            {/* More protected routes */}
          </Route>
        </Route>
      </Routes>
    </>
  )
}

export default App
