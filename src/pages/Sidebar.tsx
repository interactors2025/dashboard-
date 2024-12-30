import React, { useState } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Button,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useAuth } from "../context/AuthContext"; // Import the useAuth hook
import { useNavigate } from "react-router-dom"; // Import Link and useNavigate

interface MenuItem {
  name: string;
  route: string;
}

const Sidebar: React.FC = () => {
  const [open, setOpen] = useState(false);
  const { logout } = useAuth(); // Access logout from AuthContext
  const navigate = useNavigate(); // Get the navigate function from react-router-dom

  const toggleSidebar = () => {
    setOpen(!open);
  };

  // Define the menu items and their corresponding routes with proper typing
  const menuItems: MenuItem[] = [
    { name: "Dashboard", route: "/" },
    { name: "Attendance", route: "/attendance" },
    { name: "Events", route: "/events" },
    { name: "Participants", route: "/participants" },
    { name: "Teachers", route: "/teachers" },
  ];

  return (
    <>
      {/* Mobile-Responsive Menu Button */}
      <IconButton
        color="primary"
        aria-label="menu"
        onClick={toggleSidebar}
        sx={{
          display: { sm: "none" },
          position: "absolute",
          top: 16,
          left: 16,
        }}
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
            <ListItem key={index}>
              <Button
                onClick={() => {
                  navigate(item.route);
                  setOpen(false);
                }}
              >
                <ListItemText primary={item.name} />
              </Button>
            </ListItem>
          ))}
        </List>

        {/* Logout Button */}
        <Button
          onClick={() => {
            logout(); // Call logout
            setOpen(false); // Close the sidebar after logout
          }}
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
              backgroundColor: "primary.main", // Ensure primary.main works with your theme
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
