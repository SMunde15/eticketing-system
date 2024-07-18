import React, { useState } from "react";
import { Container, Typography, Button, Paper, TextField, Snackbar, IconButton } from "@mui/material";
import axios from "axios";
import { Train } from "./userDashboard/TrainCard"; // Import Train type

const AddTrainButtonPage: React.FC = () => {
  const [showAddTrainForm, setShowAddTrainForm] = useState(false);
  const [trainFormData, setTrainFormData] = useState<Partial<Train>>({
    train_name: "",
    train_number: "",
    date_of_availability: "",
    route_points: [{ station: "", departure_time: "", arrival_time: "", available_seats: 0 }],
    fare: {
      SL: 0,
      "3AC": 0,
      "2AC": 0,
      "1AC": 0,
    },
  });

  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const toggleAddTrainForm = () => {
    setShowAddTrainForm((prev) => !prev);
  };

 const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    if (name === "available_seats") {
      setTrainFormData((prev) => ({
        ...prev,
        route_points: prev.route_points && prev.route_points.length > 0
          ? prev.route_points.map((point, index) =>
              index === 0
                ? {
                    ...point,
                    available_seats: Number(value),
                  }
                : point
            )
          : [
              {
                station: "",
                departure_time: "",
                arrival_time: "",
                available_seats: Number(value),
              },
            ],
      }));
    } else if (["SL", "3AC", "2AC", "1AC"].includes(name)) {
      setTrainFormData((prev) => ({
        ...prev,
        fare: {
          SL: prev.fare?.SL ?? 0,
          "3AC": prev.fare?.["3AC"] ?? 0,
          "2AC": prev.fare?.["2AC"] ?? 0,
          "1AC": prev.fare?.["1AC"] ?? 0,
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

  const handleRoutePointsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const routePoints = e.target.value.split(",").map((point) => point.trim());
    setTrainFormData((prev) => ({
      ...prev,
      route_points: routePoints.map((station) => ({
        station,
        departure_time: "",
        arrival_time: "",
        available_seats: 0,
      })),
    }));
  };

  const handleAddTrain = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3000/trains/add",
        trainFormData,
        {
          withCredentials: true,
        }
      );
      console.log("Add Train Response:", response.data);

      setSnackbarOpen(true);
      setShowAddTrainForm(false);
      setTrainFormData({
        train_name: "",
        train_number: "",
        date_of_availability: "",
        route_points: [{ station: "", departure_time: "", arrival_time: "", available_seats: 0 }],
        fare: {
          SL: 0,
          "3AC": 0,
          "2AC": 0,
          "1AC": 0,
        },
      });
      // fetchTrains(); // Call the function to fetch updated trains
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
            name="train_name"
            value={trainFormData.train_name}
            onChange={handleFormChange}
            variant="outlined"
            margin="dense"
            required
            fullWidth
            id="train_name"
            label="Train Name"
          />
          <TextField
            name="train_number"
            value={trainFormData.train_number}
            onChange={handleFormChange}
            variant="outlined"
            margin="dense"
            required
            fullWidth
            id="train_number"
            label="Train Number"
          />
          <TextField
            name="date_of_availability"
            value={trainFormData.date_of_availability}
            onChange={handleFormChange}
            variant="outlined"
            margin="dense"
            required
            fullWidth
            id="date_of_availability"
            label="Date of Availability"
          />
          <TextField
            name="route_points"
            onChange={handleRoutePointsChange}
            variant="outlined"
            margin="dense"
            required
            fullWidth
            id="route_points"
            label="Route Points (comma separated)"
            helperText="Enter route points separated by commas"
          />
          <TextField
            name="available_seats"
            value={trainFormData.route_points?.[0]?.available_seats || ""}
            onChange={handleFormChange}
            variant="outlined"
            margin="dense"
            required
            fullWidth
            id="available_seats"
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
            id="fare_sl"
            label="Fare (SL)"
            type="number"
          />
          <TextField
            name="3AC"
            value={trainFormData.fare?.["3AC"] || ""}
            onChange={handleFormChange}
            variant="outlined"
            margin="dense"
            required
            fullWidth
            id="fare_3ac"
            label="Fare (3AC)"
            type="number"
          />
          <TextField
            name="2AC"
            value={trainFormData.fare?.["2AC"] || ""}
            onChange={handleFormChange}
            variant="outlined"
            margin="dense"
            required
            fullWidth
            id="fare_2ac"
            label="Fare (2AC)"
            type="number"
          />
          <TextField
            name="1AC"
            value={trainFormData.fare?.["1AC"] || ""}
            onChange={handleFormChange}
            variant="outlined"
            margin="dense"
            required
            fullWidth
            id="fare_1ac"
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
