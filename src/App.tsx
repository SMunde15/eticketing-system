// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignupPage from './pages/SignupPage';
import { AuthProvider } from './contexts/AuthContext';
import LoginPage from './components/Auth/LoginPage';
import Dashboard from './components/userDashboard/Dashboard';
import Profile from './pages/Profile';
import CheckoutPage from './pages/CheckOutPage';
import BookingDetailsPage from './pages/BookingDetailsPage';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path ='/dashboard' element={<Dashboard />} />
          <Route path ='/checkout' element={<CheckoutPage />} />
          <Route path ='/bookings' element={<BookingDetailsPage totalFare={0}   />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
