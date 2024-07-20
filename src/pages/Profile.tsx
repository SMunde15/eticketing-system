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
import { useAuth } from '../contexts/AuthContext'; // Assuming you have an AuthContext

const Profile: React.FC = () => {
  const { userRole } = useAuth();
  const [userData, setUserData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobileNumber: '',
    age: '',
  });
  const [showSnackbar, setShowSnackbar] = useState(false);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const token = Cookies.get('token');
      const response = await axios.get('https://e-ticketing.nexpictora.com/users/details', {
        withCredentials: true,
      });

      const user = response.data.find((user: any) => user.role === userRole);

      if (user) {
        setUserData(user);
        setFormData({
          name: user.name || '',
          email: user.email || '',
          mobileNumber: user.mobile || '',
          age: user.age || '',
        });
      }

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
      await axios.put('https://e-ticketing.nexpictora.com/users/details', formData, {
        withCredentials: true,
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
    <>
      <TopNavBar />
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
                    margin="normal"
                  />
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
                    margin="normal"
                  />
                  <TextField
                    label="Age"
                    name="age"
                    value={formData.age}
                    onChange={handleInputChange}
                    fullWidth
                    margin="normal"
                  />
                  <Button variant="contained" color="primary" onClick={handleSave} sx={{ mt: 2 }}>
                    Save
                  </Button>
                </>
              ) : (
                <>
                  <Typography variant="h6">Name: {userData.name || 'N/A'}</Typography>
                  <Typography variant="h6">Email: {userData.email || 'N/A'}</Typography>
                  <Typography variant="h6">Mobile Number: {userData.mobile || 'N/A'}</Typography>
                  <Typography variant="h6">Age: {userData.age || 'N/A'}</Typography>
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
          message="Details updated"
          ContentProps={{
            sx: { backgroundColor: '#4caf50' },
          }}
        />
      </Container>
    </>
  );
};

export default Profile;
