import React, { useState } from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  SelectChangeEvent,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

export interface Train {
  trainName: string;
  trainNumber: string;
  dateOfAvailability: string;
  routePoints: {
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

interface TrainCardProps {
  train: Train;
}

const TrainCard: React.FC<TrainCardProps> = ({ train }) => {
  const [openStationDialog, setOpenStationDialog] = useState(false);
  const [openClassDialog, setOpenClassDialog] = useState(false);
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [selectedDeparture, setSelectedDeparture] = useState<string>("");
  const [selectedArrival, setSelectedArrival] = useState<string>("");
  const navigate = useNavigate();

  const handleBuyClick = () => {
    setOpenStationDialog(true);
  };

  const handleStationSelect = () => {
    setOpenStationDialog(false);
    setOpenClassDialog(true);
  };

  const handleClassSelect = (event: SelectChangeEvent<string>) => {
    setSelectedClass(event.target.value as string);
  };

  const handleCloseDialog = () => {
    setOpenStationDialog(false);
    setOpenClassDialog(false);
  };

  const handleConfirmBuy = () => {
    console.log(
      `Buying ${selectedClass} ticket for train ${train.trainNumber} from ${selectedDeparture} to ${selectedArrival}`
    );
    navigate("/checkout", {
      state: { train, selectedClass, selectedDeparture, selectedArrival },
    });
    handleCloseDialog();
  };

  return (
    <Grid item xs={12} sm={6} md={4}>
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            {train.trainName}
          </Typography>
          {train.routePoints && train.routePoints.length > 0 && (
            <>
              <Typography variant="body2">
                Starting Route Point: {train.routePoints[0].station} (
                {train.routePoints[0].departureTime})
              </Typography>
              <Typography variant="body2">
                Last Route Point:{" "}
                {train.routePoints[train.routePoints.length - 1].station} (
                {train.routePoints[train.routePoints.length - 1].arrivalTime}
                )
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                Fare (SL/3AC/2AC/1AC): {train.fare?.SL ?? "-"} /{" "}
                {train.fare?.AC3 ?? "-"} / {train.fare?.AC2 ?? "-"} /{" "}
                {train.fare?.AC1 ?? "-"}
              </Typography>
            </>
          )}
          {train.routePoints && (
            <Typography variant="body2">
              Number of Available Seats: {train.routePoints[0].availableSeats}
            </Typography>
          )}
          <Button variant="contained" onClick={handleBuyClick} sx={{ mt: 2 }}>
            Buy
          </Button>
        </CardContent>
      </Card>

      <Dialog open={openStationDialog} onClose={handleCloseDialog}>
        <DialogTitle>Select Stations</DialogTitle>
        <DialogContent>
          <FormControl fullWidth>
            <InputLabel id="departure-select-label">Departure Station</InputLabel>
            <Select
              labelId="departure-select-label"
              id="departure-select"
              value={selectedDeparture}
              onChange={(event: SelectChangeEvent<string>) =>
                setSelectedDeparture(event.target.value as string)
              }
              fullWidth
            >
              {train.routePoints.map((point, index) => (
                <MenuItem key={index} value={point.station}>
                  {point.station}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel id="arrival-select-label">Arrival Station</InputLabel>
            <Select
              labelId="arrival-select-label"
              id="arrival-select"
              value={selectedArrival}
              onChange={(event: SelectChangeEvent<string>) =>
                setSelectedArrival(event.target.value as string)
              }
              fullWidth
            >
              {train.routePoints.map((point, index) => (
                <MenuItem key={index} value={point.station}>
                  {point.station}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            onClick={handleStationSelect}
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
            disabled={!selectedDeparture || !selectedArrival}
          >
            Next
          </Button>
        </DialogContent>
      </Dialog>

      <Dialog open={openClassDialog} onClose={handleCloseDialog}>
        <DialogTitle>Select Class</DialogTitle>
        <DialogContent>
          <FormControl fullWidth>
            <InputLabel id="class-select-label">Select Class</InputLabel>
            <Select
              labelId="class-select-label"
              id="class-select"
              value={selectedClass}
              onChange={(event: SelectChangeEvent<string>) =>
                handleClassSelect(event)
              }
              fullWidth
            >
              <MenuItem value="SL">Sleeper (SL)</MenuItem>
              <MenuItem value="AC3">3 Tier AC (AC3)</MenuItem>
              <MenuItem value="AC2">2 Tier AC (AC2)</MenuItem>
              <MenuItem value="AC1">1 Tier AC (AC1)</MenuItem>
            </Select>
          </FormControl>
          {selectedClass &&
            train.fare[selectedClass as keyof typeof train.fare] && (
              <Typography variant="body1" sx={{ mt: 2 }}>
                Fare: ₹{train.fare[selectedClass as keyof typeof train.fare]}
              </Typography>
            )}
          <Button
            onClick={handleConfirmBuy}
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
          >
            Confirm Buy
          </Button>
        </DialogContent>
      </Dialog>
    </Grid>
  );
};

export default TrainCard;
