// src/pages/ProductDetailPage.jsx
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Grid,
  Card,
  CardMedia,
  CardContent,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [suggested, setSuggested] = useState([]);
  const [loading, setLoading] = useState(true);

 // ✅ Fetch main product
useEffect(() => {
  const fetchProduct = async () => {
    setLoading(true);
    try {
      console.log(`Fetching https://fakestoreapi.com/products/${id}...`);
      const res = await axios.get(`https://fakestoreapi.com/products/${id}`, {
        withCredentials: false, // important
      });
      setProduct(res.data);
    } catch (error) {
      console.error("Error fetching product:", error);
      toast.error("Failed to fetch product details.");
    } finally {
      setLoading(false);
    }
  };
  fetchProduct();
}, [id]);

// ✅ Fetch suggested products
useEffect(() => {
  const fetchSuggestions = async () => {
    if (!product?.category) return;
    try {
      console.log(
        `Fetching https://fakestoreapi.com/products/category/${product.category}`
      );
      const res = await axios.get(
        `https://fakestoreapi.com/products/category/${product.category}`,
        { withCredentials: false }
      );
      const filtered = res.data.filter((p) => p.id !== Number(id));
      setSuggested(filtered.slice(0, 4));
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
  };
  fetchSuggestions();
}, [product, id]);


  // ✅ Handlers
  const handleAddToCart = () => {
    if (!user) {
      toast.warning("Please login to add items to your cart.");
      navigate("/login");
      return;
    }
    addToCart(product);
    toast.success("Added to cart!");
  };

  const handleBuyNow = () => {
    if (!user) {
      toast.warning("Please login before purchasing.");
      navigate("/login");
      return;
    }
    addToCart(product);
    navigate("/cart");
    toast.info("Redirecting to cart...");
  };

  const handleProductClick = (pid) => {
    navigate(`/product/${pid}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ✅ Loading Spinner
  if (loading || !product)
    return (
      <Box
        sx={{
          height: "70vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );

  return (
    <Box sx={{ p: { xs: 2, md: 6 }, mt: 2 }}>
      {/* ✅ Product Detail Section */}
      <Grid container spacing={6} alignItems="center">
        {/* Image */}
        <Grid item xs={12} md={5}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Card sx={{ boxShadow: 4, borderRadius: 3 }}>
              <CardMedia
                component="img"
                image={product.image}
                alt={product.title}
                sx={{
                  width: "100%",
                  height: { xs: 280, md: 400 },
                  objectFit: "contain",
                  backgroundColor: "#fafafa",
                }}
              />
            </Card>
          </motion.div>
        </Grid>

        {/* Info */}
        <Grid item xs={12} md={7}>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
            {product.title}
          </Typography>

          <Typography
            variant="h5"
            color="primary"
            sx={{ mb: 2, fontWeight: 600 }}
          >
            ${product.price.toFixed(2)}
          </Typography>

          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ mb: 3, lineHeight: 1.6 }}
          >
            {product.description}
          </Typography>

          <Typography
            variant="body2"
            sx={{
              color: "text.secondary",
              fontStyle: "italic",
              mb: 3,
            }}
          >
            Category: {product.category}
          </Typography>

          {/* ✅ Buttons */}
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              sx={{
                borderRadius: 50,
                px: 4,
                py: 1.2,
                fontWeight: 600,
                textTransform: "none",
              }}
              onClick={handleAddToCart}
            >
              Add to Cart
            </Button>

            <Button
              variant="outlined"
              color="secondary"
              size="large"
              sx={{
                borderRadius: 50,
                px: 4,
                py: 1.2,
                fontWeight: 600,
                textTransform: "none",
                borderWidth: 2,
                "&:hover": { borderWidth: 2 },
              }}
              onClick={handleBuyNow}
            >
              Buy Now
            </Button>
          </Box>
        </Grid>
      </Grid>

      {/* ✅ Suggested Products */}
      {suggested.length > 0 && (
        <Box sx={{ mt: 10 }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              mb: 4,
              color: "primary.main",
              textAlign: "center",
            }}
          >
            You May Also Like
          </Typography>

          <Grid container spacing={3}>
            {suggested.map((item) => (
              <Grid item xs={12} sm={6} md={3} key={item.id}>
                <motion.div whileHover={{ scale: 1.03 }}>
                  <Card
                    onClick={() => handleProductClick(item.id)}
                    sx={{
                      cursor: "pointer",
                      borderRadius: 3,
                      boxShadow: 3,
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      "&:hover": { boxShadow: 6 },
                    }}
                  >
                    <CardMedia
                      component="img"
                      image={item.image}
                      alt={item.title}
                      sx={{
                        height: 200,
                        objectFit: "contain",
                        backgroundColor: "#f9f9f9",
                      }}
                    />
                    <CardContent>
                      <Typography
                        variant="subtitle1"
                        sx={{
                          fontWeight: 600,
                          mb: 1,
                          height: 40,
                          overflow: "hidden",
                        }}
                      >
                        {item.title}
                      </Typography>
                      <Typography variant="h6" color="primary">
                        ${item.price.toFixed(2)}
                      </Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Box>
  );
};

export default ProductDetailPage;
