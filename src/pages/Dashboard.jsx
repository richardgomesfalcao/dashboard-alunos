import { Box, Typography, Paper } from "@mui/material";

export default function Dashboard() {
  return (
    <Box sx={{ flex: 1, padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>

      <Box sx={{ display: "flex", gap: 2 }}>
        <Paper sx={{ padding: 3, width: 220 }}>
          <Typography variant="h6">Alunos</Typography>
          <Typography variant="h4">--</Typography>
        </Paper>

        <Paper sx={{ padding: 3, width: 220 }}>
          <Typography variant="h6">Receita</Typography>
          <Typography variant="h4">R$ --</Typography>
        </Paper>
      </Box>
    </Box>
  );
}