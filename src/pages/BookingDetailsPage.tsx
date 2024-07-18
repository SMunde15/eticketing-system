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

type Booking = {
  id: number;
  name: string;
  age: number;
  gender: string;
  train_name: string;
  train_number: string;
  price: number;
};

type Props = {
  totalFare: number;
};

const BookingDetailsPage: React.FC<Props> = ({ totalFare }) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [mobileNumber, setMobileNumber] = useState<string>("");
  const [isMobileDialogOpen, setIsMobileDialogOpen] = useState<boolean>(false);
  const [mobileVerificationError, setMobileVerificationError] = useState<string>("");

useEffect(() => {
  const fetchBookings = async () => {
    try {
      const response = await axios.get<Booking[]>("http://localhost:3000/trains/bookings", {
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
}, []); // Update the dependency array to include any relevant state changes


  const handleCloseMobileDialog = () => {
    setMobileNumber("");
    setIsMobileDialogOpen(false);
    setMobileVerificationError("");
  };

  const handleVerifyMobileNumber = async () => {
    try {
      // Fetch user details for mobile number verification
      const userDetailsResponse = await axios.get("http://localhost:3000/users/details", {
        withCredentials: true,
      });
      const userDetails = userDetailsResponse.data;

      if (userDetails.mobile !== mobileNumber) {
        setMobileVerificationError("Mobile number verification failed. Please enter the correct mobile number.");
        return;
      }

      // Proceed with any other actions after mobile verification
      handleCloseMobileDialog();
    } catch (error) {
      console.error("Error verifying mobile number:", error);
      setMobileVerificationError("Error verifying mobile number. Please try again.");
    }
  };

  const handleDeleteBooking = async (bookingId: number) => {
    try {
      // Send delete request to backend
      await axios.delete(`http://localhost:3000/trains/bookings/${bookingId}`, {
        withCredentials: true
      });
      
      // Remove booking from state
      setBookings((prevBookings) => prevBookings.filter((booking) => booking.id !== bookingId));
    } catch (error) {
      console.error("Error deleting booking:", error);
      setError("Error deleting booking. Please try again.");
    }
  };

  return (
    <>
      <TopNavBar />
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Booking Details
        </Typography>
        {loading ? (
          <Typography variant="body1">Loading...</Typography>
        ) : error ? (
          <Typography variant="body1" color="error">
            {error}
          </Typography>
        ) : bookings.length === 0 ? (
          <Typography variant="body1">No bookings available</Typography>
        ) : (
          <Card sx={{ mb: 2 }}>
            <CardContent>
              {bookings.map((booking) => (
                <div key={booking.id}>
                  <Typography variant="h6" gutterBottom>
                    Passenger: {booking.name}
                  </Typography>
                  <Typography variant="body1">Age: {booking.age}</Typography>
                  <Typography variant="body1">Gender: {booking.gender}</Typography>
                  <Typography variant="body1">Train Name: {booking.train_name}</Typography>
                  <Typography variant="body1">Train Number: {booking.train_number}</Typography>
                  <Typography variant="body1">Price: ₹{booking.price}</Typography>
<Button onClick={() => handleDeleteBooking(booking.id)} color="error" variant="outlined" sx={{ mt: 2 }}>
  Delete Booking
</Button>

                </div>
              ))}
              <Typography variant="body1">Total Fare: ₹{totalFare}</Typography>
            </CardContent>
          </Card>
        )}
      </Container>

      {/* Mobile Number Verification Dialog */}
      <Dialog open={isMobileDialogOpen} onClose={handleCloseMobileDialog}>
        <DialogTitle>Verify Mobile Number</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Mobile Number"
            type="tel"
            fullWidth
            value={mobileNumber}
            onChange={(e) => setMobileNumber(e.target.value)}
          />
          {mobileVerificationError && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {mobileVerificationError}
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseMobileDialog}>Cancel</Button>
          <Button onClick={handleVerifyMobileNumber} color="primary">
            Verify
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default BookingDetailsPage;
