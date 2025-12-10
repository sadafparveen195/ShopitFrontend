// src/pages/ProfilePage.jsx
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Avatar,
  CircularProgress,
  Card,
  CardContent,
  Button,
  Divider,
  Stack,
} from "@mui/material";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import { server } from "../constants/config";
import { toast } from "react-toastify";

const ProfilePage = () => {
  const { user, loading } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${server}/api/v1/users/me`, {
          withCredentials: true,
        });
        setProfile(res.data.data);
      } catch (error) {
        toast.error("Failed to fetch user profile");
      } finally {
        setLoadingProfile(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading || loadingProfile) {
    return (
      <Box
        sx={{
          height: "70vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!profile) {
    return (
      <Box
        sx={{
          textAlign: "center",
          mt: 10,
        }}
      >
        <Typography variant="h6" color="text.secondary">
          No profile data available. Please log in again.
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "80vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "background.default",
        py: 4,
      }}
    >
      <Card
        sx={{
          maxWidth: 500,
          width: "90%",
          boxShadow: 3,
          borderRadius: 3,
          p: 3,
        }}
      >
        <CardContent>
          <Stack spacing={2} alignItems="center">
            <Avatar
              src={profile.avatar}
              alt={profile.fullName}
              sx={{ width: 100, height: 100 }}
            />
            <Typography variant="h5" fontWeight={600}>
              {profile.fullName}
            </Typography>
            <Typography color="text.secondary">@{profile.username}</Typography>

            <Divider sx={{ my: 2, width: "100%" }} />

            {profile.email && (
              <Typography>
                <strong>Email:</strong> {profile.email}
              </Typography>
            )}
            {profile.phoneNo && (
              <Typography>
                <strong>Phone:</strong> {profile.phoneNo}
              </Typography>
            )}
            {profile.about && (
              <Typography sx={{ textAlign: "center", color: "text.secondary" }}>
                {profile.about}
              </Typography>
            )}

            <Divider sx={{ my: 2, width: "100%" }} />

            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={() => toast.info("Edit Profile Coming Soon!")}
            >
              Edit Profile
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ProfilePage;
