// AdminLogin.tsx
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';
import ErrorMessage from '../ErrorMessage';

const AdminLogin: React.FC = () => {
  const { login } = useAuth();
  const [keepSignedIn, setKeepSignedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      const response = await axios.post('https://e-ticketing.nexpictora.com/admins/login', {
        email,
        password,
      }, {
        withCredentials: true,
      });
      if (response.status === 200) {
        const token = response.data.token;
        login(token, 'admin');
        if (keepSignedIn) {
          localStorage.setItem('keepSignedIn', 'true');
          localStorage.setItem('token', token); 
        } else {
          localStorage.removeItem('keepSignedIn');
          localStorage.removeItem('token');
        }
      }
    } catch (error) {
      setError('Please enter correct credentials');
    }
  };

  return (
    <div>
      <h2>Admin Login</h2>
      {error && <ErrorMessage message={error} />}
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login as Admin</button>
      <label>
        <input
          type="checkbox"
          checked={keepSignedIn}
          onChange={() => setKeepSignedIn(!keepSignedIn)}
        />
        Keep me signed in
      </label>
    </div>
  );
};

export default AdminLogin;