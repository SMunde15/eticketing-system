// src/components/Profile/Profile.tsx
import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Snackbar,
} from '@mui/material';
import axios from 'axios';
import Cookies from 'js-cookie';
import TopNavBar from '../components/TopNavBar';

const Profile: React.FC = () => {
  const [userData, setUserData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobileNumber: '',
    dateOfBirth: '',
  });
  const [showSnackbar, setShowSnackbar] = useState(false);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const token = Cookies.get('token');
      const response = await axios.get('http://localhost:3000/users/details', {
        withCredentials: true
      });
      setUserData(response.data);
      setFormData({
        name: response.data.name || '',
        email: response.data.email || '',
        mobileNumber: response.data.mobileNumber || '',
        dateOfBirth: response.data.dateOfBirth || '',
      });
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSave = async () => {
    try {
      const token = Cookies.get('token');
      await axios.put('http://localhost:3000/users/details', formData, {
        withCredentials: true
      });
      setIsEditing(false);
      fetchUserData();
      setShowSnackbar(true); // Show snackbar on success
    } catch (error) {
      console.error('Error updating user data:', error);
    }
  };

  const handleSnackbarClose = () => {
    setShowSnackbar(false);
  };

  if (isLoading) {
    return <CircularProgress />;
  }

  return (
    <><TopNavBar />
    <Container>
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Profile
        </Typography>
        <Card>
          <CardContent>
            {isEditing ? (
              <>
                <TextField
                  label="Name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  fullWidth
                  margin="normal" />
                <TextField
                  label="Email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  fullWidth
                  margin="normal"
                  disabled // Email should typically not be editable
                />
                <TextField
                  label="Mobile Number"
                  name="mobileNumber"
                  value={formData.mobileNumber}
                  onChange={handleInputChange}
                  fullWidth
                  margin="normal" />
                <TextField
                  label="Date of Birth"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  fullWidth
                  margin="normal"
                  type="date"
                  InputLabelProps={{
                    shrink: true,
                  }} />
                <Button variant="contained" color="primary" onClick={handleSave} sx={{ mt: 2 }}>
                  Save
                </Button>
              </>
            ) : (
              <>
                <Typography variant="h6">Name: {userData.name || 'N/A'}</Typography>
                <Typography variant="h6">Email: {userData.email || 'N/A'}</Typography>
                <Typography variant="h6">Mobile Number: {userData.mobileNumber || 'N/A'}</Typography>
                <Typography variant="h6">Date of Birth: {userData.dateOfBirth || 'N/A'}</Typography>
                <Button variant="contained" color="primary" onClick={() => setIsEditing(true)} sx={{ mt: 2 }}>
                  Edit
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </Box>
      <Snackbar
        open={showSnackbar}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message="DETAILS UPDATED"
        ContentProps={{
          sx: { backgroundColor: '#4caf50' },
        }} />
    </Container></>
  );
};

export default Profile;
