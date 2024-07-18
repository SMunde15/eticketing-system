// CustomerLogin.tsx
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';
import ErrorMessage from '../ErrorMessage';

const CustomerLogin: React.FC = () => {
  const { login } = useAuth();
  const [keepSignedIn, setKeepSignedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:3000/users/login', {
        email,
        password,
      }, {
        withCredentials: true,
      });
      if (response.status === 200) {
        const token = response.data.token;
        login(token, 'customer');
        if (keepSignedIn) {
          localStorage.setItem('keepSignedIn', 'true');
          localStorage.setItem('token', token); // Save token in localStorage if keepSignedIn is checked
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
      <h2>Customer Login</h2>
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
      <button onClick={handleLogin}>Login as Customer</button>
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

export default CustomerLogin;