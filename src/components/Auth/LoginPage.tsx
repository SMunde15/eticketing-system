import React, { useState } from 'react';
import {
  Container,
  CssBaseline,
  Box,
  Avatar,
  Typography,
  TextField,
  FormControlLabel,
  Checkbox,
  Button,
  Grid,
  Tabs,
  Tab,
  Paper,
  Alert,
  IconButton,
  InputAdornment,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useAuth } from '../../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import axios for making API calls

const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const [keepSignedIn, setKeepSignedIn] = useState(false);
  const [userType, setUserType] = useState<'admin' | 'customer'>('customer');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const [error, setError] = useState('');
  const navigate = useNavigate();

const handleLogin = async (event: React.FormEvent) => {
  event.preventDefault(); // Prevent default form submission behavior

    try {
      const response = await axios.post(`http://localhost:3000/${userType === 'admin' ? 'admins' : 'users'}/login`, {
        email,
        password,
      }, {
        withCredentials: true, // Ensure cookies are sent with the request
      });

      if (response.status === 200) {
        const { token } = response.data;

        // Save the token and role in your AuthContext
        login(token, userType);

        // Save token in cookies
        document.cookie = `token=${token};max-age=${keepSignedIn ? 86400 * 7 : 1800};path=/`; 


        localStorage.setItem('userEmail', email); // Save userEmail in localStorage
        navigate('/dashboard'); // Navigate to dashboard after successful login
      }
    } catch (error) {
      console.error("Login failed:", error);
      setError('Please enter correct credentials'); // Set error state if login fails
    }
  };


  const handleTabChange = (event: React.SyntheticEvent, newValue: 'admin' | 'customer') => {
    setUserType(newValue);
    setError(''); // Clear the error message when changing tabs
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

   return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Paper elevation={3} sx={{ padding: 4, mt: 8 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            {userType === 'admin' ? 'Admin Login' : 'User Login'}
          </Typography>
          <Tabs
            value={userType}
            onChange={handleTabChange}
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
          >
            <Tab label="User" value="customer" />
            <Tab label="Admin" value="admin" />
          </Tabs>
          <Box component="form" onSubmit={handleLogin} sx={{ mt: 3 }}>
            {error && (
              <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
                {error}
              </Alert>
            )}
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <FormControlLabel
              control={
                <Checkbox
                  value="remember"
                  color="primary"
                  checked={keepSignedIn}
                  onChange={() => setKeepSignedIn(!keepSignedIn)}
                />
              }
              label="Keep me signed in"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item>
                {userType === 'customer' && (
                  <Typography variant="body2">
                    Don't have an account?{' '}
                    <Link to="/signup" style={{ textDecoration: 'underline', color: 'blue' }}>
                      Sign Up
                    </Link>
                  </Typography>
                )}
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default LoginPage;