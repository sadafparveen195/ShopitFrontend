// src/pages/CartPage.jsx
import React, { useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Divider,
  IconButton,
} from "@mui/material";
import { Add, Remove } from "@mui/icons-material";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const CartPage = () => {
  const navigate = useNavigate();
  const { cart, removeFromCart, clearCart, updateQuantity } = useCart();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      toast.warn("Please log in to view your cart.");
      navigate("/login");
    }
  }, [user, loading, navigate]);

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  if (!user && !loading) return null;

  if (cart.length === 0)
    return (
      <Box
        sx={{
          height: "70vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          textAlign: "center",
          px: 2,
        }}
      >
        <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
          Your cart is empty 🛒
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/")}
        >
          Go to Shop
        </Button>
      </Box>
    );

  return (
    <Box sx={{ p: { xs: 2, sm: 4, md: 8 }, mt: 2 }}>
      <Typography
        variant="h4"
        sx={{ fontWeight: 700, mb: 4, textAlign: "center" }}
      >
        Your Cart
      </Typography>

      <Grid container spacing={3}>
        {cart.map((item) => (
          <Grid item xs={12} md={6} key={item.id}>
            <motion.div whileHover={{ scale: 1.02 }}>
              <Card
                sx={{
                  display: "flex",
                  alignItems: "center",
                  p: 2,
                  boxShadow: 3,
                  borderRadius: 3,
                }}
              >
                <CardMedia
                  component="img"
                  image={item.image}
                  alt={item.title}
                  sx={{
                    width: 100,
                    height: 100,
                    objectFit: "contain",
                    mr: 2,
                    borderRadius: 2,
                    bgcolor: "#f5f5f5",
                  }}
                />

                <Box sx={{ flexGrow: 1 }}>
                  <CardContent sx={{ p: 0 }}>
                    <Typography
                      variant="subtitle1"
                      sx={{
                        fontWeight: 600,
                        mb: 0.5,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                      }}
                    >
                      {item.title}
                    </Typography>
                    <Typography color="primary" sx={{ fontWeight: 500 }}>
                      ${Number(item.price).toFixed(2)}
                    </Typography>

                    {/* Quantity controls */}
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        mt: 1,
                        gap: 1,
                      }}
                    >
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        disabled={item.quantity <= 1}
                      >
                        <Remove />
                      </IconButton>

                      <Typography>{item.quantity}</Typography>

                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                      >
                        <Add />
                      </IconButton>
                    </Box>
                  </CardContent>
                </Box>

                <CardActions sx={{ flexDirection: "column", gap: 1 }}>
                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    onClick={() => removeFromCart(item.id)}
                  >
                    Remove
                  </Button>
                </CardActions>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      <Divider sx={{ my: 5 }} />

      <Box
        sx={{
          mt: 4,
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", sm: "center" },
          gap: 2,
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          Total: ${total.toFixed(2)}
        </Typography>

        <Box sx={{ display: "flex", gap: 2 }}>
          <Button variant="outlined" color="error" onClick={clearCart}>
            Clear Cart
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate("/checkout")}
            disabled={!user}
          >
            Checkout
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default CartPage;
