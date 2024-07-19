import React, { useEffect, useState } from "react";
import {
  Container,
  Grid,
  Typography,
  Box,
} from "@mui/material";
import axios from "axios";
import TrainCard, { Train } from "./TrainCard";
import TopNavBar from "../TopNavBar";
import AddTrainButtonPage from "../AddTrainButtonPage";
import { useAuth } from "../../contexts/AuthContext";
import backgroundImage from "../../assets/image1.jpg"; // Make sure the path is correct

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
      const response = await axios.get<Train[]>("https://e-ticketing.nexpictora.com/trains", {
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
      train.routePoints.some(
        (point) =>
          point.station.toLowerCase() === departure.toLowerCase() &&
          train.routePoints.some(
            (point) => point.station.toLowerCase() === destination.toLowerCase()
          )
      )
    );

    setTrains(filteredTrains);
  };

  return (
    <Box
      sx={{
        flexGrow: 1,
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        py: 4,
      }}
    >
      <TopNavBar />
      <Container maxWidth="lg">
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
