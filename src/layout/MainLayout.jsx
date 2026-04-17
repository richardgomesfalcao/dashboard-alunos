import { Box } from "@mui/material";

export default function MainLayout({ children }) {
  return (
    <Box sx={{ display: "flex", backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
      {children}
    </Box>
  );
}