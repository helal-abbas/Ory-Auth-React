import React, { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Registration from './registration/Registration'
import Login from './login/Login'
import Dashboard from './dashboard/Dashboard'
import ForgotPassword from './forgot-password/Forgot-password'
import Settings from './settings/Settings'
import Protected from './protection/Protection'
import VerificationPage from './verifications/VerificationPage'

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/auth/login" />} />
          <Route path="/" element={<Protected />} >
          <Route path="/auth/registration" element={<Registration />} />
          <Route 
            path="/auth/login" 
            element={
              // <Protected>
                <Login />
              // </Protected>
              } 
          />
          <Route path='/auth/verification' element={<VerificationPage />} />
          <Route path="/auth/recovery" element={<ForgotPassword />} />
          <Route path="/auth/settings" element={<Settings />} />
          <Route path="/home" element={<Navigate to="/home/dashboard" />} />
          <Route path='/home/dashboard' element={<Dashboard />} />
          <Route
            path='/home/dashboard'
            element={
              // <Protected>
                <Dashboard />
              // </Protected>
            }
          ></Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
