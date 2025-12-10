import React from "react";
import { Box, useTheme } from "@mui/material";
import Header from "../components/Header";

const MainLayout = ({ children }) => {
  const theme = useTheme();

  return (
    <Box sx={{ overflowX: "hidden" }}>
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          zIndex: 1100,
          boxShadow: theme.shadows[4],
          backgroundColor: theme.palette.background.paper,
        }}
      >
        <Header />
      </Box>

      {/* ✅ Page content below header */}
      <Box sx={{ pt: { xs: 8, sm: 10 } }}>{children}</Box>
    </Box>
  );
};

export default MainLayout;
