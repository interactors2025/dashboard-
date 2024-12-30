import React, { useState } from "react";
import {
  Container,
  Typography,
  Box,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Snackbar,
  Alert,
  Grid,
} from "@mui/material";
import axios from "axios";
import { Search } from "@mui/icons-material";

const Events: React.FC = () => {
  const events = [
    { name: "National Conference", amount: 100 },
    { name: "Brain Battle (Day1)", amount: 100 },
    { name: "Media Splash(Day1)", amount: 100 },
    { name: "Wisdom War(Day1)", amount: 100 },
    { name: "Hack in the Dark(Day2)", amount: 100 },
    { name: "Spark the Idea(Day2)", amount: 100 },
    { name: "Gold Rush Quest(Day2)", amount: 100 },
  ];

  const [selectedEvent, setSelectedEvent] = useState<string>(""); // Selected event
  const [loading, setLoading] = useState<boolean>(false); // Loading state
  const [error, setError] = useState<string>(""); // Error handling

  const handleEventChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedEvent(event.target.value as string);
  };

  const handleDownloadAll = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "http://localhost:6789/api/v1/export/users/excel", // Backend API to export all users to Excel
        { responseType: "blob" } // Set the response type to blob for downloading
      );

      // Create a link element to download the file
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "users.xlsx"); // Set the filename for the download
      document.body.appendChild(link);
      link.click(); // Trigger the download
      document.body.removeChild(link);
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || "Error downloading all data. Please try again later.";
      setError(errorMessage); // Display backend error message
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadEvent = async () => {
    if (!selectedEvent) {
      setError("Please select an event before downloading.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:6789/api/v1/exportEventToExcel?eventName=${selectedEvent}`, // Backend API to export event-specific users to Excel
        { responseType: "blob" } // Set the response type to blob for downloading
      );

      // Create a link element to download the file
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${selectedEvent.replace(/\s+/g, "_")}_participants.xlsx`); // Set the filename for the download
      document.body.appendChild(link);
      link.click(); // Trigger the download
      document.body.removeChild(link);
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || "Error downloading event data. Please try again later.";
      setError(errorMessage); // Display backend error message
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" sx={{ mb: 4, fontWeight: 600 }}>
        User Data Download
      </Typography>

      {/* Event Dropdown */}
      <Box sx={{ mb: 4, display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
        <FormControl sx={{ width: "100%", mb: 2 }}>
          <InputLabel>Event</InputLabel>
          <Select value={selectedEvent} onChange={handleEventChange} label="Event">
            {events.map((event, index) => (
              <MenuItem key={index} value={event.name}>
                {event.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Button Section */}
        <Grid container spacing={2}>
          {/* Download All Button */}
          <Grid item xs={12} sm={6}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleDownloadAll}
              sx={{ width: "100%" }}
              disabled={loading}
            >
              <Search /> {loading ? "Downloading..." : "Download All Data"}
            </Button>
          </Grid>

          {/* Download Event-wise Button */}
          <Grid item xs={12} sm={6}>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleDownloadEvent}
              sx={{ width: "100%" }}
              disabled={loading || !selectedEvent}
            >
              <Search /> {loading ? "Downloading..." : "Download Event Data"}
            </Button>
          </Grid>
        </Grid>
      </Box>

      {/* Loading Spinner */}
      {loading && <CircularProgress sx={{ mt: 2 }} />}

      {/* Error Snackbar */}
      <Snackbar open={Boolean(error)} autoHideDuration={6000}>
        <Alert severity="error" sx={{ width: "100%" }}>
          {error}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Events;
