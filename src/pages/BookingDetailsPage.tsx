import React, { useState, useEffect } from "react";
import {
  Container,
  Card,
  CardContent,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Snackbar,
  Alert,
} from "@mui/material";
import axios from "axios";
import TopNavBar from "../components/TopNavBar";
import { useAuth } from '../contexts/AuthContext'; // Import the useAuth hook

type Booking = {
  bookingId: string;
  name: string;
  age: number;
  gender: string;
  trainName: string;
  trainNumber: string;
  price: number;
  email: string; 
};

type User = {
  email: string;
  name: string;
  age: number;
  mobile: string;
};

const BookingDetailsPage: React.FC = () => {
  const { userRole } = useAuth(); // Use the role from context
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [mobileNumber, setMobileNumber] = useState<string>("");
  const [isMobileDialogOpen, setIsMobileDialogOpen] = useState<boolean>(false);
  const [mobileVerificationError, setMobileVerificationError] = useState<string>("");
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const apiUrl = userRole === 'admin' 
          ? 'https://e-ticketing.nexpictora.com/admin/users/details'
          : 'https://e-ticketing.nexpictora.com/users/details';
        
        const response = await axios.get<User>(apiUrl, {
          withCredentials: true,
        });
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user details:", error);
        setError("Error fetching user details.");
      }
    };

    fetchUserDetails();
  }, [userRole]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const apiUrl = userRole === 'admin' 
          ? 'https://e-ticketing.nexpictora.com/admin/trains/bookings'
          : 'https://e-ticketing.nexpictora.com/trains/bookings';
        
        const response = await axios.get<Booking[]>(apiUrl, {
          withCredentials: true,
        });
        setBookings(response.data);
      } catch (error) {
        setError("Error fetching bookings.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [userRole]);

  const handleCloseMobileDialog = () => {
    setMobileNumber("");
    setIsMobileDialogOpen(false);
    setMobileVerificationError("");
  };

  const handleVerifyMobileNumber = async () => {
    try {
      const apiUrl = userRole === 'admin' 
        ? 'https://e-ticketing.nexpictora.com/admin/users/details'
        : 'https://e-ticketing.nexpictora.com/users/details';
        
      const userDetailsResponse = await axios.get(apiUrl, {
        withCredentials: true,
      });
      const userDetails = userDetailsResponse.data;

      if (userDetails.mobile !== mobileNumber) {
        setMobileVerificationError("Mobile number verification failed. Please enter the correct mobile number.");
        return;
      }

      handleCloseMobileDialog();
    } catch (error) {
      console.error("Error verifying mobile number:", error);
      setMobileVerificationError("Error verifying mobile number. Please try again.");
    }
  };

  const handleDeleteBooking = async (bookingId: string) => {
    try {
      const apiUrl = userRole === 'admin' 
        ? `https://e-ticketing.nexpictora.com/admin/trains/bookings/${bookingId}`
        : `https://e-ticketing.nexpictora.com/trains/bookings/${bookingId}`;

      await axios.delete(apiUrl, {
        withCredentials: true,
      });
      setBookings(bookings.filter((booking) => booking.bookingId !== bookingId));
    } catch (error) {
      setError("Error deleting booking.");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <>
      <TopNavBar />
      <Container>
        <Typography variant="h4" gutterBottom>
          {userRole === 'admin' ? 'Admin Booking Details' : 'Your Booking Details'}
        </Typography>
        {bookings.length > 0 ? (
          bookings.map((booking) => (
            <Card key={booking.bookingId} sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="h6">Train Name: {booking.trainName}</Typography>
                <Typography variant="h6">Train Number: {booking.trainNumber}</Typography>
                <Typography variant="h6">Price: {booking.price}</Typography>
                <Typography variant="h6">Passenger Name: {booking.name}</Typography>
                <Typography variant="h6">Age: {booking.age}</Typography>
                <Typography variant="h6">Gender: {booking.gender}</Typography>
                <Typography variant="h6">Email: {booking.email}</Typography>
                {userRole === 'admin' && (
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => setIsMobileDialogOpen(true)}
                    sx={{ mt: 2 }}
                  >
                    Delete Booking
                  </Button>
                )}
              </CardContent>
            </Card>
          ))
        ) : (
          <Typography variant="h6">No bookings found.</Typography>
        )}
        <Dialog open={isMobileDialogOpen} onClose={handleCloseMobileDialog}>
          <DialogTitle>Verify Mobile Number</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Mobile Number"
              type="text"
              fullWidth
              variant="standard"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
            />
            {mobileVerificationError && <Alert severity="error">{mobileVerificationError}</Alert>}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseMobileDialog}>Cancel</Button>
            <Button onClick={handleVerifyMobileNumber}>Verify</Button>
          </DialogActions>
        </Dialog>
      </Container>
    </>
  );
};

export default BookingDetailsPage;
