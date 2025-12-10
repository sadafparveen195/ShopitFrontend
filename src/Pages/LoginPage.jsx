import React, { useState, useContext } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Stack,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../contexts/AuthContext";


import logo from "../assets/logo.png";
import "react-toastify/dist/ReactToastify.css";

// ✅ Form Validation Schema
const schema = yup.object({
  username: yup.string().required("Username is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth(); // ✅ from AuthContext

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  // ✅ Redirect to previous page or home after login
  const from = location.state?.from?.pathname || "/";

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await login({
        username: data.username,
        password: data.password,
      });
      toast.success("Login successful! Redirecting...", {
        position: "top-center",
      });
      navigate(from, { replace: true });
    } catch (error) {
      console.error("Login error:", error);
      // toast handled by AuthContext already
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        height: "100vh",
        background: "linear-gradient(135deg, #e3f2fd, #bbdefb)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 2,
      }}
    >
      {/* ✅ Logo */}
    


      {/* ✅ Login Form */}
      <Box
        sx={{
          bgcolor: "background.paper",
          width: "100%",
          maxWidth: 400,
          p: 4,
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        <Typography variant="h4" align="center" gutterBottom>
          Login
        </Typography>

        <Stack component="form" onSubmit={handleSubmit(onSubmit)} spacing={2}>
          <TextField
            label="Username"
            size="small"
            {...register("username")}
            error={!!errors.username}
            helperText={errors.username?.message}
            disabled={loading}
            fullWidth
          />

          <TextField
            label="Password"
            type="password"
            size="small"
            {...register("password")}
            error={!!errors.password}
            helperText={errors.password?.message}
            disabled={loading}
            fullWidth
          />

          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            fullWidth
            sx={{ height: 40 }}
          >
            {loading ? <CircularProgress size={24} /> : "Login"}
          </Button>

          <Button
            onClick={() => navigate("/register")}
            variant="text"
            size="small"
            fullWidth
            sx={{ mt: 1 }}
          >
            Create a new Account
          </Button>
          <Button
            onClick={() => navigate("/")}
            className="text-gray-600 hover:text-blue-600 text-sm normal-case shadow-none bg-transparent hover:bg-transparent"
          >
            ← Back to Home
          </Button>

        </Stack>
      </Box>
    </Box>
  );
};

export default LoginPage;
