import React, { useState } from "react";
import {
  Container,
  Card,
  CardContent,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
  Paper,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  SelectChangeEvent,
  Snackbar,
  Alert,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import TopNavBar from "../components/TopNavBar";

type Passenger = {
  name: string;
  age: number;
  gender: string;
};

export interface Train {
  trainName: string;
  trainNumber: string;
  dateOfAvailability: string;
  routePoints: {
    id: number;
    station: string;
    departureTime: string;
    arrivalTime: string;
    availableSeats: number;
  }[];
  fare: {
    SL: number;
    AC3: number;
    AC2: number;
    AC1: number;
  };
}

const CheckoutPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { train: initialTrain, selectedClass } = location.state || {};
  const [passengers, setPassengers] = useState<Passenger[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newPassenger, setNewPassenger] = useState<Partial<Passenger>>({});
  const [totalFare, setTotalFare] = useState<number>(0);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [mobileNumber, setMobileNumber] = useState<string>("");
  const [bookingSuccess, setBookingSuccess] = useState<boolean>(false);
  const [mobileVerificationError, setMobileVerificationError] = useState<string>("");

  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setNewPassenger({});
  };

  const handleAddPassenger = () => {
    if (newPassenger.name && newPassenger.age && newPassenger.gender) {
      setPassengers([...passengers, newPassenger as Passenger]);
      setTotalFare(totalFare + (initialTrain?.fare[selectedClass] || 0));
      handleCloseDialog();
    }
  };

  const handlePassengerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewPassenger((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePassengerGenderChange = (event: SelectChangeEvent<string>) => {
    const { value } = event.target;
    setNewPassenger((prev) => ({
      ...prev,
      gender: value as string,
    }));
  };

  const handleDeletePassenger = (index: number) => {
    const updatedPassengers = [...passengers];
    updatedPassengers.splice(index, 1);
    setPassengers(updatedPassengers);
    setTotalFare(totalFare - (initialTrain?.fare[selectedClass] || 0));
  };

  const handleConfirmTicket = async () => {
    setIsConfirmDialogOpen(true);
  };

  const clearCheckoutData = () => {
    setPassengers([]);
    setNewPassenger({});
    setTotalFare(0);
    setMobileNumber("");
    setIsConfirmDialogOpen(false);
  };

  const handleVerifyMobileNumber = async () => {
    try {
      // Fetch user details for mobile number verification
      const userDetailsResponse = await axios.get("https://e-ticketing.nexpictora.com/users/details", {
        withCredentials: true,
      });
      const userDetails = userDetailsResponse.data;

      if (userDetails.mobile !== mobileNumber) {
        setMobileVerificationError("Mobile number verification failed. Please enter the correct mobile number.");
        return;
      }

      const response = await axios.post(
        "https://e-ticketing.nexpictora.com/trains/confirm-ticket",
        {
          train_number: initialTrain.trainNumber,
          passengers,
        },
        { withCredentials: true }
      );

      const { bookingId } = response.data;

      console.log("Booking confirmed successfully:", response.data);

      navigate("/bookings", {
        state: {
          passengers,
          totalFare,
          train: initialTrain,
        },
      });

      setBookingSuccess(true);
      clearCheckoutData();
    } catch (error) {
      console.error("Error confirming booking:", error);
      setIsConfirmDialogOpen(false);
      setMobileVerificationError("Failed to confirm booking. Please try again later.");
    }
  };

  if (!initialTrain) {
    return (
      <>
        <TopNavBar />
        <Container maxWidth="md">
          <Typography variant="h5" align="center" mt={4}>
            Please book a train ticket first.
          </Typography>
        </Container>
      </>
    );
  }

  return (
    <>
      <TopNavBar />
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Card>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              Checkout
            </Typography>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
              <Typography variant="body1">Train: {initialTrain.trainName}</Typography>
              <Typography variant="body1">Train Number: {initialTrain.trainNumber}</Typography>
            </Box>
            <Typography variant="body1" gutterBottom>
              Selected Class: {selectedClass}
            </Typography>
            <Typography variant="body1" gutterBottom>
              Fare: ₹{initialTrain.fare[selectedClass as keyof typeof initialTrain.fare]}
            </Typography>
            <Typography variant="body1" gutterBottom>
              Total Fare: ₹{totalFare}
            </Typography>
            <Button variant="contained" onClick={handleOpenDialog}>
              Add Passengers
            </Button>
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6" gutterBottom>
                Passengers:
              </Typography>
              {passengers.length > 0 ? (
                passengers.map((passenger, index) => (
                  <Paper key={index} elevation={2} sx={{ p: 2, mb: 1, position: "relative" }}>
                    <Typography variant="body1">Name: {passenger.name}</Typography>
                    <Typography variant="body1">Age: {passenger.age}</Typography>
                    <Typography variant="body1">Gender: {passenger.gender}</Typography>
                    <Button
                      variant="contained"
                      color="secondary"
                      sx={{ position: "absolute", top: 8, right: 8 }}
                      onClick={() => handleDeletePassenger(index)}
                    >
                      Delete
                    </Button>
                  </Paper>
                ))
              ) : (
                <Typography variant="body2">No passengers added</Typography>
              )}
            </Box>
            <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={handleConfirmTicket}>
              Confirm Ticket
            </Button>
          </CardContent>
        </Card>

        <Dialog open={isDialogOpen} onClose={handleCloseDialog}>
          <DialogTitle>Add Passenger</DialogTitle>
          <DialogContent>
            <TextField
              name="name"
              label="Name"
              fullWidth
              margin="dense"
              variant="outlined"
              value={newPassenger.name || ""}
              onChange={handlePassengerChange}
            />
            <TextField
              name="age"
              label="Age"
              type="number"
              fullWidth
              margin="dense"
              variant="outlined"
              value={newPassenger.age || ""}
              onChange={handlePassengerChange}
            />
            <FormControl fullWidth margin="dense">
              <InputLabel id="gender-select-label">Gender</InputLabel>
              <Select
                labelId="gender-select-label"
                value={newPassenger.gender || ""}
                onChange={handlePassengerGenderChange}
              >
                <MenuItem value="MALE">Male</MenuItem>
                <MenuItem value="FEMALE">Female</MenuItem>
                <MenuItem value="OTHERS">Others</MenuItem>
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button onClick={handleAddPassenger} color="primary" variant="contained">
              Add
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar
          open={bookingSuccess}
          autoHideDuration={6000}
          onClose={() => setBookingSuccess(false)}
          message="Booking successful"
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          sx={{ backgroundColor: "green" }}
        />

        <Snackbar
          open={!!mobileVerificationError}
          autoHideDuration={6000}
          onClose={() => setMobileVerificationError("")}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert onClose={() => setMobileVerificationError("")} severity="error" sx={{ width: '100%' }}>
            {mobileVerificationError}
          </Alert>
        </Snackbar>

        <Dialog open={isConfirmDialogOpen} onClose={() => setIsConfirmDialogOpen(false)}>
          <DialogTitle>Confirm Ticket</DialogTitle>
          <DialogContent>
            <TextField
              name="mobileNumber"
              label="Mobile Number"
              fullWidth
              margin="dense"
              variant="outlined"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsConfirmDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleVerifyMobileNumber} color="primary" variant="contained">
              Verify and Confirm
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </>
  );
};

export default CheckoutPage;
