import {
  Box,
  List,
  ListItemButton,
  ListItemText,
  Typography
} from "@mui/material";

import { useNavigate, useLocation } from "react-router-dom";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const menu = [
    { label: "Dashboard", path: "/" },
    { label: "Alunos", path: "/alunos" },
  ];

  return (
    <Box
      sx={{
        width: 240,
        minHeight: "100vh",
        background: "linear-gradient(180deg, #020617, #0f172a)",
        p: 2,
      }}
    >
      <Typography variant="h6" sx={{ mb: 3 }}>
        Dashboard
      </Typography>

      <List>
        {menu.map((item) => (
          <ListItemButton
            key={item.path}
            onClick={() => navigate(item.path)}
            sx={{
              borderRadius: 2,
              mb: 1,
              color: "#cbd5f5",
              backgroundColor:
                location.pathname === item.path
                  ? "rgba(124,77,255,0.2)"
                  : "transparent",
            }}
          >
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );
}