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


interface teachers{
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

const Teachers: React.FC = () => {
  const [teachers, setTeachers] = useState<teachers[]>([]); // List of teachers
  const [loading, setLoading] = useState<boolean>(false); // Loading state
  const [error, setError] = useState<string>(""); // Error handling
  const [page, setPage] = useState<number>(0); // Pagination: current page
  const [rowsPerPage, setRowsPerPage] = useState<number>(5); // Pagination: rows per page
  const [openImageDialog, setOpenImageDialog] = useState<boolean>(false); // Image dialog state
  const [selectedImage, setSelectedImage] = useState<string>(""); // Selected image URL for popup

  // Fetch teachers' data from the backend
  useEffect(() => {
    const fetchTeachers = async () => {
      setLoading(true);
      try {
        const response = await axios.get("http://localhost:6789/api/v1/staff"); // Your backend API to fetch teachers
       
        setTeachers(response.data.payload.Staff); // Set teachers data
      } catch (error) {
        console.log(error);
        const errorMessage = "Error fetching teachers data. Please try again later.";
        setError(errorMessage); // Show error message
      } finally {
        setLoading(false);
      }
    };
    fetchTeachers();
  }, []);

  // Handle page change in pagination
  const handleChangePage = ( newPage: number) => {
    setPage(newPage);
  };

  // Handle rows per page change in pagination
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
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
        Teachers List
      </Typography>

      {/* Loading Spinner */}
      {loading && <CircularProgress sx={{ display: "block", margin: "auto" }} />}

      {/* Error Snackbar */}
      <Snackbar open={Boolean(error)} autoHideDuration={6000}>
        <Alert severity="error" sx={{ width: "100%" }}>
          {error}
        </Alert>
      </Snackbar>

      {/* Teachers Grid */}
      {!loading && teachers.length > 0 && (
        <Grid container spacing={2}>
          {teachers
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) // Paginate teachers
            .map((teacher, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card sx={{ width: "100%" }}>
                <CardMedia
  component="img"
  image={teacher.Image} // Assuming Image field contains the image link
  alt={teacher.firstName}
  sx={{
    cursor: "pointer",
    height: 100, // Set the height to a smaller value
    width: "100%", // Ensure it takes the full width of the card
    objectFit: "fit", // Ensure image scales down proportionally
  }}
  onClick={() => handleOpenImageDialog(teacher.Image)} // Open image in dialog
/>
                  <CardContent>
                    <Typography variant="h6" component="h2">
                      {teacher.firstName} {teacher.lastName}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      <strong>Token:</strong> <span className="text-red-500 font-bold">{teacher.Token}</span>
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      <strong>College:</strong> {teacher.collegeName}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      <strong>Mobile:</strong> {teacher.mobile}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      <strong>Email:</strong> {teacher.email}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      <strong>Country:</strong> {teacher.country}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      <strong>State:</strong> {teacher.state}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      <strong>Date:</strong> <span className="text-green-600"> {teacher.createdAt}</span>
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
  count={teachers.length}
  rowsPerPage={rowsPerPage}
  page={page}
  onPageChange={(event, newPage) => {
    if (event)
      return
    handleChangePage(newPage)
  }} // Use onPageChange instead of onChangePage
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
        <DialogTitle>Teacher Image</DialogTitle>
        <DialogContent>
          <img src={selectedImage} alt="Teacher" style={{ width: "100%", height: "auto" }} />
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

export default Teachers;
