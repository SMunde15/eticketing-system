import React, { useState } from "react";
import {
  Container,
  Typography,
  Button,
  Paper,
  TextField,
  Snackbar,
  IconButton,
} from "@mui/material";
import axios from "axios";
import { Train } from "./userDashboard/TrainCard"; 

const AddTrainButtonPage: React.FC = () => {
  const [showAddTrainForm, setShowAddTrainForm] = useState(false);
  const [trainFormData, setTrainFormData] = useState<Partial<Train>>({
    trainName: "",
    trainNumber: "",
    dateOfAvailability: "",
    routePoints: [{ station: "", departureTime: "", arrivalTime: "", availableSeats: 0 }],
    fare: {
      SL: 0,
      AC3: 0,
      AC2: 0,
      AC1: 0,
    },
  });

  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const toggleAddTrainForm = () => {
    setShowAddTrainForm((prev) => !prev);
  };

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (name === "availableSeats") {
      setTrainFormData((prev) => ({
        ...prev,
        routePoints: prev.routePoints && prev.routePoints.length > 0
          ? prev.routePoints.map((point, index) =>
              index === 0
                ? {
                    ...point,
                    availableSeats: Number(value),
                  }
                : point
            )
          : [
              {
                station: "",
                departureTime: "",
                arrivalTime: "",
                availableSeats: Number(value),
              },
            ],
      }));
    } else if (["SL", "AC3", "AC2", "AC1"].includes(name)) {
      setTrainFormData((prev) => ({
        ...prev,
        fare: {
          SL: prev.fare?.SL ?? 0,
          AC3: prev.fare?.AC3 ?? 0,
          AC2: prev.fare?.AC2 ?? 0,
          AC1: prev.fare?.AC1 ?? 0,
          [name]: Number(value),
        },
      }));
    } else {
      setTrainFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleRoutePointsChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const routePoints = e.target.value.split(",").map((point) => point.trim());
    setTrainFormData((prev) => ({
      ...prev,
      routePoints: routePoints.map((station) => ({
        station,
        departureTime: "",
        arrivalTime: "",
        availableSeats: 0,
      })),
    }));
  };

  const handleAddTrain = async () => {
    try {
      const response = await axios.post(
        "https://e-ticketing.nexpictora.com/trains/add",
        trainFormData,
        {
          withCredentials: true,
        }
      );
      console.log("Add Train Response:", response.data);

      setSnackbarOpen(true);
      setShowAddTrainForm(false);
      setTrainFormData({
        trainName: "",
        trainNumber: "",
        dateOfAvailability: "",
        routePoints: [{ station: "", departureTime: "", arrivalTime: "", availableSeats: 0 }],
        fare: {
          SL: 0,
          AC3: 0,
          AC2: 0,
          AC1: 0,
        },
      });
    } catch (error) {
      console.error("Error adding train:", error);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Button variant="contained" onClick={toggleAddTrainForm} sx={{ mb: 2 }}>
        {showAddTrainForm ? "Cancel" : "Add Train"}
      </Button>
      {showAddTrainForm && (
        <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
          <Typography variant="h6" gutterBottom>
            Add Train
          </Typography>
          <TextField
            name="trainName"
            value={trainFormData.trainName}
            onChange={handleFormChange}
            variant="outlined"
            margin="dense"
            required
            fullWidth
            id="trainName"
            label="Train Name"
          />
          <TextField
            name="trainNumber"
            value={trainFormData.trainNumber}
            onChange={handleFormChange}
            variant="outlined"
            margin="dense"
            required
            fullWidth
            id="trainNumber"
            label="Train Number"
          />
          <TextField
            name="dateOfAvailability"
            value={trainFormData.dateOfAvailability}
            onChange={handleFormChange}
            variant="outlined"
            margin="dense"
            required
            fullWidth
            id="dateOfAvailability"
            label="Date of Availability"
          />
          <TextField
            name="routePoints"
            onChange={handleRoutePointsChange}
            variant="outlined"
            margin="dense"
            required
            fullWidth
            id="routePoints"
            label="Route Points (comma separated)"
            helperText="Enter route points separated by commas"
          />
          <TextField
            name="availableSeats"
            value={trainFormData.routePoints?.[0]?.availableSeats || ""}
            onChange={handleFormChange}
            variant="outlined"
            margin="dense"
            required
            fullWidth
            id="availableSeats"
            label="Available Seats"
            type="number"
          />
          <TextField
            name="SL"
            value={trainFormData.fare?.SL || ""}
            onChange={handleFormChange}
            variant="outlined"
            margin="dense"
            required
            fullWidth
            id="fareSL"
            label="Fare (SL)"
            type="number"
          />
          <TextField
            name="AC3"
            value={trainFormData.fare?.AC3 || ""}
            onChange={handleFormChange}
            variant="outlined"
            margin="dense"
            required
            fullWidth
            id="fareAC3"
            label="Fare (3AC)"
            type="number"
          />
          <TextField
            name="AC2"
            value={trainFormData.fare?.AC2 || ""}
            onChange={handleFormChange}
            variant="outlined"
            margin="dense"
            required
            fullWidth
            id="fareAC2"
            label="Fare (2AC)"
            type="number"
          />
          <TextField
            name="AC1"
            value={trainFormData.fare?.AC1 || ""}
            onChange={handleFormChange}
            variant="outlined"
            margin="dense"
            required
            fullWidth
            id="fareAC1"
            label="Fare (1AC)"
            type="number"
          />
          <Button
            variant="contained"
            onClick={handleAddTrain}
            color="primary"
            sx={{ mt: 2 }}
          >
            Add Train
          </Button>
        </Paper>
      )}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message="Train added successfully!"
        action={
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={handleSnackbarClose}
          >
            {/* <CloseIcon fontSize="small" /> */}
          </IconButton>
        }
      />
    </Container>
  );
};

export default AddTrainButtonPage;
