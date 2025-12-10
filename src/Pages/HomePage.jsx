// src/pages/HomePage.jsx
import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Stack,
  useTheme,
  useMediaQuery,
  Card,
 Grid2,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { styled } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import LoginIcon from "@mui/icons-material/Login";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import ShopPage from "../components/Shop";
import { useAuth } from "../contexts/AuthContext";

import heroImage1 from "../assets/heroImage1.jpg";
import heroImage2 from "../assets/heroImage2.jpg";
import heroImage3 from "../assets/heroImage3.jpg";
import heroImage4 from "../assets/heroImage4.jpg";

const heroImages = [heroImage1, heroImage2, heroImage3, heroImage4];

const StatCard = styled(Card)(({ theme }) => ({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  padding: theme.spacing(4),
  textAlign: "center",
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: theme.shadows[4],
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
  "&:hover": {
    transform: "translateY(-8px)",
    boxShadow: theme.shadows[10],
  },
}));

const HomePage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const { user } = useAuth();

  const [currentImage, setCurrentImage] = useState(0);

  // ✅ Auto-change hero image
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % heroImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const stats = [
    { title: "Total Products", value: "150+", icon: "🛒" },
    { title: "Happy Customers", value: "500+", icon: "😊" },
    { title: "Brands", value: "50+", icon: "🏷️" },
    { title: "Orders Shipped", value: "10K+", icon: "📦" },
  ];

  const handleLogin = () => navigate("/login");
  const handleRegister = () => navigate("/register");

  return (
    <Box sx={{ overflowX: "hidden", backgroundColor: theme.palette.background.default }}>
      {/* ✅ HERO SECTION */}
      <Box
        sx={{
          position: "relative",
          height: { xs: "75vh", md: "85vh" },
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        {/* ✅ Animated Background */}
        <AnimatePresence>
          <motion.div
            key={currentImage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2 }}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundImage: `url(${heroImages[currentImage]})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              filter: "brightness(0.55)",
            }}
          />
        </AnimatePresence>

        {/* ✅ Overlay */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.45)",
          }}
        />

        {/* ✅ Hero Text */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8 }}
          style={{ position: "relative", zIndex: 2, padding: "0 1rem" }}
        >
          <Typography
            variant={isMobile ? "h3" : "h2"}
            sx={{
              color: "#fff",
              fontWeight: 800,
              mb: 2,
              textShadow: "2px 2px 10px rgba(0,0,0,0.6)",
            }}
          >
            Elevate Your Shopping Experience
          </Typography>

          <Typography
            variant={isMobile ? "body1" : "h5"}
            sx={{
              color: "#fff",
              opacity: 0.9,
              mb: user ? 0 : 4,
              maxWidth: 700,
              mx: "auto",
              lineHeight: 1.6,
            }}
          >
            Discover premium products from trusted brands — everything you need,
            in one place, at the best price.
          </Typography>

          {!user && (
            <Stack
              direction={isMobile ? "column" : "row"}
              spacing={2}
              justifyContent="center"
              alignItems="center"
              sx={{ mt: 3 }}
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  startIcon={<LoginIcon />}
                  onClick={handleLogin}
                  sx={{
                    borderRadius: 50,
                    px: 5,
                    py: 1.5,
                    fontWeight: 600,
                    boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
                    minWidth: 180,
                    fontSize: "1rem",
                  }}
                >
                  Login
                </Button>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="outlined"
                  color="secondary"
                  size="large"
                  startIcon={<PersonAddIcon />}
                  onClick={handleRegister}
                  sx={{
                    borderRadius: 50,
                    px: 5,
                    py: 1.5,
                    fontWeight: 600,
                    borderWidth: 2,
                    minWidth: 180,
                    fontSize: "1rem",
                    "&:hover": {
                      backgroundColor: "rgba(255,255,255,0.15)",
                      borderColor: "#fff",
                    },
                  }}
                >
                  Register
                </Button>
              </motion.div>
            </Stack>
          )}
        </motion.div>
      </Box>

      {/* ✅ STATS SECTION */}
      <Container maxWidth="lg" sx={{ py: 10 }}>
        <Typography
          variant="h3"
          align="center"
          sx={{
            mb: 8,
            fontWeight: 800,
            color: theme.palette.primary.main,
            textTransform: "uppercase",
            letterSpacing: 1.2,
          }}
        >
          Our Highlights
        </Typography>

        <Grid2 container spacing={4}>
          {stats.map((stat, index) => (
            <Grid2 xs={12} sm={6} md={3} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15, duration: 0.6 }}
              >
                <StatCard>
                  <Typography variant="h2" sx={{ mb: 1 }}>
                    {stat.icon}
                  </Typography>
                  <Typography variant="h4" color="primary" sx={{ fontWeight: 700 }}>
                    {stat.value}
                  </Typography>
                  <Typography variant="h6" sx={{ mt: 1, color: "text.secondary" }}>
                    {stat.title}
                  </Typography>
                </StatCard>
              </motion.div>
            </Grid2>
          ))}
        </Grid2>
      </Container>

      {/* ✅ SHOP SECTION */}
      <ShopPage />
    </Box>
  );
};

export default HomePage;
