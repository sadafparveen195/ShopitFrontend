// src/pages/CheckoutPage.jsx
import React, { useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Divider,
  Button,
} from "@mui/material";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const CheckoutPage = () => {
  const { cart } = useCart();
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  // Redirect guest users to login
  useEffect(() => {
    if (!loading && !user) {
      toast.warn("Please log in to proceed with checkout.");
      navigate("/login");
    }
  }, [user, loading, navigate]);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart
    .reduce((sum, item) => sum + item.price * item.quantity, 0)
    .toFixed(2);

  if (!user || cart.length === 0) {
    return (
      <Box
        sx={{
          height: "70vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <Typography variant="h5" sx={{ mb: 2 }}>
          {cart.length === 0
            ? "Your cart is empty 🛒"
            : "Please log in to continue"}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/")}
        >
          Back to Shop
        </Button>
      </Box>
    );
  }

  // “Coming soon” placeholder
  const handlePlaceOrder = () => {
    toast.info("🛍️ This feature is coming soon!");
  };

  return (
    <Container sx={{ py: 5 }}>
      <Typography
        variant="h4"
        align="center"
        sx={{ mb: 4, fontWeight: 700 }}
      >
        Checkout
      </Typography>

      <Grid container spacing={4}>
        {/* User Details */}
        <Grid item xs={12} md={4}>
          <Card sx={{ boxShadow: 4, borderRadius: 3 }}>
            <CardContent>
              <Typography
                variant="h6"
                sx={{ mb: 2, fontWeight: 600 }}
                color="primary"
              >
                User Details
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <Typography>
                <strong>Name:</strong> {user.fullName || user.username}
              </Typography>
              <Typography>
                <strong>Email:</strong> {user.email || "N/A"}
              </Typography>
              <Typography>
                <strong>Phone:</strong> {user.phoneNo || "N/A"}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Order Summary */}
        <Grid item xs={12} md={8}>
          <Card sx={{ boxShadow: 4, borderRadius: 3 }}>
            <CardContent>
              <Typography
                variant="h6"
                sx={{ mb: 2, fontWeight: 600 }}
                color="primary"
              >
                Order Summary
              </Typography>
              <Divider sx={{ mb: 2 }} />

              {cart.map((item) => (
                <Box
                  key={item.id}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    mb: 2,
                  }}
                >
                  <Box>
                    <Typography sx={{ fontWeight: 600 }}>
                      {item.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Quantity: {item.quantity}
                    </Typography>
                  </Box>
                  <Typography sx={{ fontWeight: 500 }}>
                    ${(item.price * item.quantity).toFixed(2)}
                  </Typography>
                </Box>
              ))}

              <Divider sx={{ my: 3 }} />

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontWeight: 700,
                  mb: 1,
                }}
              >
                <Typography>Total Items:</Typography>
                <Typography>{totalItems}</Typography>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontWeight: 700,
                }}
              >
                <Typography>Total Bill:</Typography>
                <Typography>${totalPrice}</Typography>
              </Box>

              <Button
                variant="contained"
                color="success"
                sx={{
                  mt: 4,
                  display: "block",
                  ml: "auto",
                  px: 5,
                  py: 1.2,
                  fontWeight: 600,
                }}
                onClick={handlePlaceOrder}
              >
                Place Order
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CheckoutPage;
