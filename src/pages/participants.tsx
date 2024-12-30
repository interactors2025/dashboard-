import React, { useState, useEffect } from "react";

import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  CircularProgress,
  TablePagination,
  Snackbar,
  Alert,
} from "@mui/material";
import axios from "axios";

interface Participant {
  firstName: string;
  lastName: string;
  collegeName: string;
  Token: string;
  mobile: string;
  email: string;
  country: string;
  state: string;
  createdAt: string;
  Image: string;
}

const Participants: React.FC = () => {
  const [participants, setParticipants] = useState<Participant[]>([]); // List of participants
  const [loading, setLoading] = useState<boolean>(false); // Loading state
  const [error, setError] = useState<string>(""); // Error handling
  const [page, setPage] = useState<number>(0); // Pagination: current page
  const [rowsPerPage, setRowsPerPage] = useState<number>(5); // Pagination: rows per page
  const [openImageDialog, setOpenImageDialog] = useState<boolean>(false); // Image dialog state
  const [selectedImage, setSelectedImage] = useState<string>(""); // Selected image URL for popup

  // Fetch participants' data from the backend
  useEffect(() => {
    const fetchParticipants = async () => {
      setLoading(true);
      try {
        const response = await axios.get("https://nci25.moderncollegegk.in/api/v1/users"); // Your backend API to fetch participants
        console.log(response.data.payload.users);
        setParticipants(response.data.payload.users); // Set participants data
      } catch (error) {
        console.error(error);
        const errorMessage =
          "Error fetching participants data. Please try again later.";
        setError(errorMessage); // Show error message
      } finally {
        setLoading(false);
      }
    };
    fetchParticipants();
  }, []);

  // Handle page change in pagination
  const handleChangePage = ( newPage: number) => {
    setPage(newPage);
  };

  // Handle rows per page change in pagination
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10)); // Parsing the value to a number
    setPage(0); // Reset page number to 0 when rows per page changes
  };

  // Open image dialog
  const handleOpenImageDialog = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setOpenImageDialog(true);
  };

  // Close image dialog
  const handleCloseImageDialog = () => {
    setOpenImageDialog(false);
    setSelectedImage("");
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" sx={{ mb: 4, fontWeight: 600 }}>
        Participants List
      </Typography>

      {/* Loading Spinner */}
      {loading && (
        <CircularProgress sx={{ display: "block", margin: "auto" }} />
      )}

      {/* Error Snackbar */}
      <Snackbar open={Boolean(error)} autoHideDuration={6000}>
        <Alert severity="error" sx={{ width: "100%" }}>
          {error}
        </Alert>
      </Snackbar>

      {/* Participants Grid */}
      {!loading && participants.length > 0 && (
        <Grid container spacing={2}>
          {participants
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) // Paginate participants
            .map((participant, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card sx={{ width: "100%" }}>
                  <CardMedia
                    component="img"
                    image={participant.Image} // Assuming Image field contains the image link
                    alt={participant.firstName}
                    sx={{
                      cursor: "pointer",
                      height: 100, // Set the height to a smaller value
                      width: "100%", // Ensure it takes the full width of the card
                      objectFit: "fit", // Ensure image scales down proportionally
                    }}
                    onClick={() => handleOpenImageDialog(participant.Image)} // Open image in dialog
                  />
                  <CardContent>
                    <Typography variant="h6" component="h2">
                      {participant.firstName} {participant.lastName}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      <strong>College:</strong> {participant.collegeName}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      <strong>Token:</strong>{" "}
                      <span className="text-red-500 font-bold">
                        {participant.Token}
                      </span>
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      <strong>Mobile:</strong> {participant.mobile}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      <strong>Email:</strong> {participant.email}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      <strong>Country:</strong> {participant.country}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      <strong>State:</strong> {participant.state}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      <strong>Date:</strong>{" "}
                      <span className="text-green-600">
                        {" "}
                        {participant.createdAt}
                      </span>
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
        </Grid>
      )}

      {/* Pagination */}
      <TablePagination
  rowsPerPageOptions={[5, 10, 25]}
  count={participants.length}
  rowsPerPage={rowsPerPage}
  page={page}
  onPageChange={(event, newPage) => {
    if (event)
      return
    handleChangePage(newPage)
  }} // Handle page change
  onRowsPerPageChange={handleChangeRowsPerPage}
  sx={{
    mt: 2,
    "& .MuiTablePagination-select": {
      fontSize: "14px",
    },
  }}
/>

      {/* Image Dialog */}
      <Dialog open={openImageDialog} onClose={handleCloseImageDialog}>
        <DialogTitle>Participant Image</DialogTitle>
        <DialogContent>
          <img
            src={selectedImage}
            alt="Participant"
            style={{ width: "100%", height: "auto" }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseImageDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Participants;
