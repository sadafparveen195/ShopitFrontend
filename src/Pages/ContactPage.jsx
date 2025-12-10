import React from "react";
import {
  Box,
  Container,
  Typography,
  Stack,
  Card,
  CardContent,
  Button,
} from "@mui/material";
import { motion } from "framer-motion";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import LinkedInIcon from "@mui/icons-material/LinkedIn";

const ContactPage = () => {
  return (
    <Container maxWidth="md" sx={{ py: 10 }}>
      {/* Page Title */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Typography
          variant="h3"
          align="center"
          sx={{
            fontWeight: 700,
            color: "primary.main",
            mb: 6,
          }}
        >
          Contact Me
        </Typography>
      </motion.div>

      {/* Contact Info Card */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Card
          elevation={6}
          sx={{
            borderRadius: 4,
            textAlign: "center",
            p: 4,
            background: "linear-gradient(135deg, #ffffff, #f7f9fc)",
          }}
        >
          <CardContent>
            <Stack spacing={4} alignItems="center">
              {/* Phone */}
              <Stack direction="row" alignItems="center" spacing={2}>
                <PhoneIcon color="primary" fontSize="large" />
                <Typography variant="h6" color="text.primary">
                  +91 7906797095
                </Typography>
              </Stack>

              {/* Email */}
              <Stack direction="row" alignItems="center" spacing={2}>
                <EmailIcon color="primary" fontSize="large" />
                <Typography variant="h6" color="text.primary">
                  sadafparveen0906@gmail.com
                </Typography>
              </Stack>

              {/* LinkedIn */}
              <Stack direction="row" alignItems="center" spacing={2}>
                <LinkedInIcon color="primary" fontSize="large" />
                <Button
                  variant="outlined"
                  color="primary"
                  href=""
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    textTransform: "none",
                    fontWeight: 600,
                    borderRadius: 3,
                  }}
                >
                  View LinkedIn Profile
                </Button>
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      </motion.div>
    </Container>
  );
};

export default ContactPage;
