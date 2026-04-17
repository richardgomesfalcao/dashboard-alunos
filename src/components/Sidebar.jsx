import { Box, List, ListItemButton, ListItemText } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function Sidebar() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        width: 240,
        height: "100vh",
        backgroundColor: "#111",
        color: "#fff",
        padding: 2,
      }}
    >
      <h2>Menu</h2>

      <List>
        <ListItemButton onClick={() => navigate("/")}>
          <ListItemText primary="Dashboard" />
        </ListItemButton>

        <ListItemButton onClick={() => navigate("/alunos")}>
          <ListItemText primary="Alunos" />
        </ListItemButton>
      </List>
    </Box>
  );
}