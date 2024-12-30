import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import {
  Container,
  Typography,
  Grid,
  CircularProgress,
  Box,
  TextField,
  Button,
  Modal,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Snackbar,
  Alert,
} from "@mui/material";
import axios from "axios";
import { EventNote, PeopleAlt, Search } from "@mui/icons-material";

interface User {
  firstName: string;
  lastName: string;
  mobile: string;
  createdAt: string;
}

interface Staff {
  firstName: string;
  lastName: string;
  mobile: string;
  createdAt: string;
}

const Dashboard: React.FC = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [staffCount, setStaffCount] = useState<number>(0);
  const [users, setUsers] = useState<User[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [openSearch, setOpenSearch] = useState<boolean>(false);
  const [searchType, setSearchType] = useState<"student" | "staff">("student");
  const [searchResults, setSearchResults] = useState<User[] | Staff[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [totalParticipants, setTotalParticipants] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const eventResponse = await axios.get(
          "http://localhost:6789/api/v1/count"
        );
        setEvents(eventResponse.data.payload.events);
        setStaffCount(eventResponse.data.payload.staffCount);

        // Calculate total amount and total participants
        const amountResponse = await axios.get(
          "http://localhost:6789/api/v1/amount"
        );

        setTotalAmount(amountResponse.data.payload.totalAmount);
        const totalUserCount = await axios.get(
          "http://localhost:6789/api/v1/user-count"
        );
        setTotalParticipants(totalUserCount.data.payload.totalUserCount);
        // Fetch latest 10 users and staff
        const userResponse = await axios.get(
          "http://localhost:6789/api/v1/latestUsers"
        );
        const staffResponse = await axios.get(
          "http://localhost:6789/api/v1/latestStaff"
        );

        setUsers(userResponse.data.payload.users);
        setStaff(staffResponse.data.payload.staff);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Error fetching data. Please try again later.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearchOpen = () => {
    setOpenSearch(true);
  };

  const handleSearchClose = () => {
    setOpenSearch(false);
  };

  const handleSearchTypeChange = (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    setSearchType(event.target.value as "student" | "staff");
  };
  const handleSnackbarClose = () => {
    setError("");
  };
  const handleSearch = async () => {
    try {
      const endpoint =
        searchType === "student"
          ? "http://localhost:6789/api/v1/searchByMobileUser"
          : "http://localhost:6789/api/v1/searchByMobileStaff";
      const response = await axios.get(`${endpoint}?mobile=${searchQuery}`);

      if (response.data.payload.user) {
        setSearchResults([response.data.payload.user]);
      } else if (response.data.payload.staff) {
        setSearchResults([response.data.payload.staff]);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error("Error fetching search results:", error);
      setError("Error fetching data. Please try again later.");
      setSearchResults([]);
    }
  };

  if (loading) {
    return (
      <Container sx={{ mt: 4, overflow: "hidden" }}>
        <Typography variant="h4" component="h1" sx={{ mt: 4 }}>
          Loading Data...
        </Typography>
        <CircularProgress sx={{ mt: 2 }} />
      </Container>
    );
  }

  return (
    <Container
      sx={{
        mt: 4,
        marginBottom: "20px",
        maxWidth: "430px",
        overflow: "hidden",
      }}
    >
      <Sidebar />
      <Typography variant="h4" component="h1" sx={{ mb: 4, fontWeight: 600 }}>
        Event Dashboard
      </Typography>

      <Grid container spacing={3}>
        {events.map((event, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Box sx={{ boxShadow: 3, padding: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {event.event}
              </Typography>
              <Typography variant="body1" color="textSecondary">
                Participants: {event.participants}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>

      <Box
        sx={{
          mt: 4,
          display: "flex",
          alignItems: "center",
          backgroundColor: "#f5f5f5",
          padding: "16px",
          borderRadius: "8px",
        }}
      >
        <PeopleAlt sx={{ mr: 2, color: "primary.main" }} />
        <Typography variant="h6" component="p" sx={{ fontWeight: 600 }}>
          Total Staff: {staffCount}
        </Typography>
      </Box>

       {/* Total Amount */}
    <Box sx={{ mt: 4, display: "flex", alignItems: "center", backgroundColor: "#f5f5f5", padding: "16px", borderRadius: "8px" }}>
      <EventNote sx={{ mr: 2, color: "primary.main" }} />
      <Typography variant="h6" component="p" sx={{ fontWeight: 600 }}>
        Total Amount: ₹{totalAmount.toFixed(2)}
      </Typography>
    </Box>

    {/* Total Participants */}
    <Box sx={{ mt: 4, display: "flex", alignItems: "center", backgroundColor: "#f5f5f5", padding: "16px", borderRadius: "8px" }}>
      <PeopleAlt sx={{ mr: 2, color: "primary.main" }} />
      <Typography variant="h6" component="p" sx={{ fontWeight: 600 }}>
        Total Participants: {totalParticipants}
      </Typography>
    </Box>


      <Button
        variant="outlined"
        color="primary"
        onClick={handleSearchOpen}
        sx={{ mt: 4 ,marginLeft:'70px'}}
      >
        <Search /> Search Student or Staff
      </Button>

      {/* Search Modal */}
      <Modal open={openSearch} onClose={handleSearchClose}>
        <Box
          sx={{
            maxWidth: 800,
            margin: "auto",
            padding: 4,
            backgroundColor: "white",
            borderRadius: "8px",
            marginTop: "10%",
          }}
        >
          <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
            Search for {searchType === "student" ? "Student" : "Staff"}
          </Typography>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Search Type</InputLabel>
            <Select
              value={searchType}
              onChange={handleSearchTypeChange}
              label="Search Type"
            >
              <MenuItem value="student">Student</MenuItem>
              <MenuItem value="staff">Staff</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Search"
            variant="outlined"
            fullWidth
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleSearch}
            sx={{ mb: 2 }}
          >
            Search
          </Button>

          {/* Display search results in a table */}
          <TableContainer
            component={Paper}
            sx={{ overflowX: "hidden", maxWidth: "500px" }}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Mobile</TableCell>
                  <TableCell>Created At</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Array.isArray(searchResults) && searchResults.length > 0 ? (
                  searchResults.map((result, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        {result.firstName} {result.lastName}
                      </TableCell>
                      <TableCell>{result.mobile}</TableCell>
                      <TableCell>{result.createdAt}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3}>
                      <Typography variant="body2" color="textSecondary">
                        No results found.
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Modal>

      {/* Latest Users Table */}
      <Typography variant="h6" component="h2" sx={{ mt: 4 }}>
        Latest 10 Users
      </Typography>
      <TableContainer
        component={Paper}
        sx={{ mt: 2, overflowX: "scroll", maxWidth: "500px" }}
      >
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Mobile</TableCell>
              <TableCell>Created At</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user, index) => (
              <TableRow key={index}>
                <TableCell>
                  {user.firstName} {user.lastName}
                </TableCell>
                <TableCell>{user.mobile}</TableCell>
                <TableCell>{user.createdAt}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Latest Staff Table */}
      <Typography variant="h6" component="h2" sx={{ mt: 4 }}>
        Latest 10 Staff
      </Typography>
      <TableContainer component={Paper} sx={{ mt: 2, overflowX: "scroll" }}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Mobile</TableCell>
              <TableCell>Created At</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {staff.map((staffMember, index) => (
              <TableRow key={index}>
                <TableCell>
                  {staffMember.firstName} {staffMember.lastName}
                </TableCell>
                <TableCell>{staffMember.mobile}</TableCell>
                <TableCell>{staffMember.createdAt}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Snackbar
        open={Boolean(error)}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="error"
          sx={{ width: "100%" }}
        >
          {error}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Dashboard;
