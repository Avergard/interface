import React from 'react';
import { Routes, Route } from 'react-router-dom';
import SignInForm from './components/auth/SignInForm';
import SignUpForm from './components/auth/SignUpForm';
import PrivateRoute from './components/auth/PrivateRoute';
import Dashboard from './components/Dashboard';
import AuthChoice from './components/AuthChoice';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/signin" element={<SignInForm />} />
      <Route path="/signup" element={<SignUpForm />} />
      <Route
        path="/profile"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />
      <Route path="/" element={<AuthChoice />} />
    </Routes>
  );
};

export default AppRoutes; 