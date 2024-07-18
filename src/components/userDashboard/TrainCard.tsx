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
  train_name: string;
  train_number: string;
  date_of_availability: string;
  route_points: {
    station: string;
    departure_time: string;
    arrival_time: string;
    available_seats: number;
  }[];
  fare: {
    SL: number;
    "3AC": number;
    "2AC": number;
    "1AC": number;
  };
}

interface TrainCardProps {
  train: Train;
}

const TrainCard: React.FC<TrainCardProps> = ({ train }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedClass, setSelectedClass] = useState<string>("");
  const navigate = useNavigate();

  const handleBuyClick = () => {
    setOpenDialog(true);
  };

  const handleClassSelect = (event: SelectChangeEvent<string>) => {
    // Access event.target.value as string (safe for both scenarios)
    setSelectedClass(event.target.value as string);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleConfirmBuy = () => {
    console.log(
      `Buying ${selectedClass} ticket for train ${train.train_number}`
    );
    navigate("/checkout", { state: { train, selectedClass } });
    handleCloseDialog();
  };


  return (
    <Grid item xs={12} sm={6} md={4}>
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            {train.train_name}
          </Typography>
          {train.route_points && train.route_points.length > 0 && (
            <>
              <Typography variant="body2">
                Starting Route Point: {train.route_points[0].station} (
                {train.route_points[0].departure_time})
              </Typography>
              <Typography variant="body2">
                Last Route Point:{" "}
                {train.route_points[train.route_points.length - 1].station} (
                {train.route_points[train.route_points.length - 1].arrival_time}
                )
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                Fare (SL/3AC/2AC/1AC): {train.fare?.SL ?? "-"} /{" "}
                {train.fare?.["3AC"] ?? "-"} / {train.fare?.["2AC"] ?? "-"} /{" "}
                {train.fare?.["1AC"] ?? "-"}
              </Typography>
            </>
          )}
          {train.route_points && (
            <Typography variant="body2">
              Number of Available Seats: {train.route_points[0].available_seats}
            </Typography>
          )}
          <Button variant="contained" onClick={handleBuyClick} sx={{ mt: 2 }}>
            Buy
          </Button>
        </CardContent>
      </Card>
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Select Class</DialogTitle>
        <DialogContent>
          <FormControl fullWidth>
            <InputLabel id="class-select-label">Select Class</InputLabel>
            <Select
              labelId="class-select-label"
              id="class-select"
              value={selectedClass}
              onChange={(event: SelectChangeEvent<string>) =>
                handleClassSelect(event as SelectChangeEvent<string>)
              }
              fullWidth
            >
              <MenuItem value="SL">Sleeper (SL)</MenuItem>
              <MenuItem value="3AC">3 Tier AC (3AC)</MenuItem>
              <MenuItem value="2AC">2 Tier AC (2AC)</MenuItem>
              <MenuItem value="1AC">1 Tier AC (1AC)</MenuItem>
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
