import React, { useState } from "react";
import { Drawer, List, ListItem, ListItemText, IconButton, Button } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useAuth } from "../context/AuthContext"; // Import the useAuth hook
import { Link, useNavigate } from "react-router-dom"; // Import Link and useNavigate

const Sidebar: React.FC = () => {
  const [open, setOpen] = useState(false);
  const { logout } = useAuth(); // Access logout from AuthContext
  const navigate = useNavigate(); // Get the navigate function from react-router-dom

  const toggleSidebar = () => {
    setOpen(!open);
  };

  // Define the menu items and their corresponding routes
  const menuItems = [
    { name: "Dashboard", route: "/" },
    { name: "Attendance", route: "/attendance" },
    { name: "Events", route: "/events" },
    { name: "participants", route: "/participants" },
    { name: "teachers", route: "/teachers" },
  ];

  return (
    <>
      {/* Mobile-Responsive Menu Button */}
      <IconButton
        color="primary"
        aria-label="menu"
        onClick={toggleSidebar}
        sx={{ display: { sm: "none" }, position: "absolute", top: 16, left: 16 }}
      >
        <MenuIcon />
      </IconButton>

      {/* Sidebar (Drawer) */}
      <Drawer
        open={open}
        onClose={toggleSidebar}
        sx={{
          width: 240,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: 240,
            boxSizing: "border-box",
          },
        }}
      >
        <List>
          {menuItems.map((item, index) => (
            <ListItem button key={index} onClick={() => {
              navigate(item.route)
              setOpen(false);
            }}>
              <ListItemText color="primary" primary={item.name} />
            </ListItem>
          ))}
        </List>
        
        {/* Logout Button */}
        <Button
          onClick={logout}
          sx={{
            position: "absolute",
            bottom: 16,
            left: 0,
            right: 0,
            margin: "auto",
            width: "80%",
            backgroundColor: "red",
            color: "white",
            "&:hover": {
              backgroundColor: "primary.main", 
            },
          }}
        >
          Logout
        </Button>
      </Drawer>
    </>
  );
};

export default Sidebar;
