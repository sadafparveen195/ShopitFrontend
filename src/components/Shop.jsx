// src/pages/ShopPage.jsx
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Button,
  CircularProgress,
  Chip,
} from "@mui/material";
import { motion } from "framer-motion";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { server } from "../constants/config";

const categories = [
  { key: "men's clothing", label: "Men's Fashion" },
  { key: "women's clothing", label: "Women's Fashion" },
  { key: "electronics", label: "Electronics" },
  { key: "jewelery", label: "Jewelry" },
];

const ShopPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

useEffect(() => {
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");
      console.log("Fetching products from https://fakestoreapi.com/products...");
      const res = await axios.get("https://fakestoreapi.com/products", {
        withCredentials: false, // ❗ important to avoid CORS issues
      });
      console.log("Fetched data:", res.data);
      setProducts(res.data);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Failed to load products. Please try again later.");
    } finally {
      setLoading(false);
    }
  };
  fetchProducts();
}, []);


  const getCategoryProducts = (category) =>
    products.filter((p) => p.category === category);

  const handleProductClick = (id) => {
    navigate(`/product/${id}`);
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "70vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          textAlign: "center",
          mt: 10,
          color: "error.main",
          fontWeight: 600,
        }}
      >
        {error}
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 6 }, mt: 3 }}>
      <Typography
        variant="h4"
        sx={{
          mb: 4,
          fontWeight: 700,
          textAlign: "center",
          color: "primary.main",
        }}
      >
        Shop by Category
      </Typography>

      {categories.map((cat) => {
        const catProducts = getCategoryProducts(cat.key);
        if (catProducts.length === 0) return null;

        return (
          <Box key={cat.key} sx={{ mb: 6 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 2,
              }}
            >
              <Typography
                variant="h5"
                sx={{ fontWeight: 600, color: "text.primary" }}
              >
                {cat.label}
              </Typography>
              <Chip
                label={`${catProducts.length} items`}
                color="primary"
                variant="outlined"
              />
            </Box>

            <Grid container spacing={3}>
              {catProducts.map((product) => (
                <Grid item xs={12} sm={6} md={3} key={product.id}>
                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    transition={{ type: "spring", stiffness: 200 }}
                  >
                    <Card
                      onClick={() => handleProductClick(product.id)}
                      sx={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        boxShadow: 3,
                        borderRadius: 3,
                        overflow: "hidden",
                        cursor: "pointer",
                        "&:hover": { boxShadow: 6 },
                      }}
                    >
                      <CardMedia
                        component="img"
                        image={product.image}
                        alt={product.title}
                        sx={{
                          height: 220,
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
                            height: 48,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {product.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {product.category}
                        </Typography>
                        <Typography
                          variant="h6"
                          sx={{ mt: 1, color: "primary.main" }}
                        >
                          ${product.price.toFixed(2)}
                        </Typography>
                      </CardContent>
                      <CardActions sx={{ justifyContent: "center", pb: 2 }}>
                        <Button variant="contained" color="primary" size="small">
                          View Details
                        </Button>
                      </CardActions>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </Box>
        );
      })}
    </Box>
  );
};

export default ShopPage;
