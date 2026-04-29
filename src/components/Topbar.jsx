import { Box, Typography, Avatar, TextField } from "@mui/material";

export default function Topbar() {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        mb: 3,
      }}
    >
      <Typography variant="h5">Dashboard</Typography>

      <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
        <TextField
          placeholder="Buscar..."
          size="small"
          sx={{
            input: { color: "#fff" },
            backgroundColor: "#0f172a",
            borderRadius: 2,
          }}
        />

        <Avatar sx={{ bgcolor: "#7c4dff" }}>
          R
        </Avatar>
      </Box>
    </Box>
  );
}