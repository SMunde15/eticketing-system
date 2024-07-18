import React, { useEffect, useState } from "react";
import {
  Container,
  Grid,
  Typography,
  TextField,
  IconButton,
  Box,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import axios from "axios";
import TrainCard, { Train } from "./TrainCard";
import TopNavBar from "../TopNavBar";
import AddTrainButtonPage from "../AddTrainButtonPage";
import { useAuth } from "../../contexts/AuthContext";

const Dashboard: React.FC = () => {
  const { userRole } = useAuth();
  const [trains, setTrains] = useState<Train[]>([]);
  const [departure, setDeparture] = useState<string>("");
  const [destination, setDestination] = useState<string>("");

  useEffect(() => {
    fetchTrains();
  }, []);

  const fetchTrains = async () => {
    try {
      const response = await axios.get<Train[]>("http://localhost:3000/trains", {
        withCredentials: true,
      });
      setTrains(response.data);
    } catch (error) {
      console.error("Error fetching trains:", error);
    }
  };

  const handleSearch = () => {
    if (!departure || !destination) {
      return;
    }

    const filteredTrains = trains.filter((train) =>
      train.route_points.some(
        (point) =>
          point.station.toLowerCase() === departure.toLowerCase() &&
          train.route_points.some(
            (point) => point.station.toLowerCase() === destination.toLowerCase()
          )
      )
    );

    setTrains(filteredTrains);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <TopNavBar />
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
          <TextField
            variant="outlined"
            margin="dense"
            required
            fullWidth
            id="departure"
            label="Departure"
            value={departure}
            onChange={(e) => setDeparture(e.target.value)}
          />
          <TextField
            variant="outlined"
            margin="dense"
            required
            fullWidth
            id="destination"
            label="Destination"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            sx={{ ml: 2 }}
          />
          <IconButton color="primary" onClick={handleSearch}>
            <SearchIcon />
          </IconButton>
        </Box>
        {userRole === "admin" && <AddTrainButtonPage />}
        <Grid container spacing={3}>
          {trains.length > 0 ? (
            trains.map((train, index) => (
              <TrainCard key={index} train={train} />
            ))
          ) : (
            <Typography variant="body2">No trains available</Typography>
          )}
        </Grid>
      </Container>
    </Box>
  );
};

export default Dashboard;
