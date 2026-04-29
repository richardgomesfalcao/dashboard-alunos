import { Box } from "@mui/material";
import Sidebar from "../components/Sidebar";

export default function MainLayout({ children }) {
  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        backgroundColor: "background.default",
      }}
    >
      <Sidebar />

      <Box
        sx={{
          flex: 1,
          p: 3,
          backgroundColor: "background.default",
        }}
      >
        {children}
      </Box>
    </Box>
  );
}