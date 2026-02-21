import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import DSATracker from './pages/DSATracker';
import CompanyPatterns from './pages/CompanyPatterns';

import ProblemSolve from './pages/ProblemSolve';

import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import PrivateRoute from './components/layout/PrivateRoute';
import ResumeATS from './pages/ResumeATS';
import MockInterview from './pages/MockInterview';
import AIInterview from './pages/AIInterview';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:resettoken" element={<ResetPassword />} />
        
        <Route element={<PrivateRoute />}>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="dsa" element={<DSATracker />} />
            <Route path="patterns" element={<CompanyPatterns />} />
            <Route path="resume" element={<ResumeATS />} />
            <Route path="interview" element={<MockInterview />} />
            <Route path="ai-interview" element={<AIInterview />} />
            <Route path="solve/:id" element={<ProblemSolve />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
