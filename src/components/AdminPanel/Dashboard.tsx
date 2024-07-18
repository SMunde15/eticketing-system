// src/components/AdminPanel/Dashboard.tsx
import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

const AdminDashboard: React.FC = () => {
  const { logout } = useAuth();
  return (
    <div>
      <h2>Admin Dashboard</h2>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

export default AdminDashboard;
