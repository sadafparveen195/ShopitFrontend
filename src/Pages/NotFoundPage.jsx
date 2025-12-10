import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const NotFoundPage = () => {
  const navigate = useNavigate();

  // Animation settings for text
  const textVariant = {
    hidden: { opacity: 0, y: -50 },
    visible: { opacity: 1, y: 0, transition: { duration: 1 } },
  };

  // Animation settings for button
  const buttonVariant = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { delay: 1, duration: 1 } },
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        textAlign: 'center',
        flexDirection: 'column',
        bgcolor: '#f5f5f5', // Light gray background
        padding: 2,
      }}
    >
      {/* Animated Text */}
      <motion.div variants={textVariant} initial="hidden" animate="visible">
        <Typography variant="h1" color="primary" gutterBottom>
          404
        </Typography>
        <Typography variant="h4" color="textSecondary" gutterBottom>
          Oops! The page you're looking for doesn't exist.
        </Typography>
      </motion.div>

      {/* Animated Button */}
      <motion.div variants={buttonVariant} initial="hidden" animate="visible">
        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 3 }}
          onClick={() => navigate('/')}
        >
          Go to Homepage
        </Button>
      </motion.div>

      {/* Optional animated image (can be customized) */}
      <motion.img
        src="/path/to/your/404-image.svg"
        alt="Not Found"
        style={{ marginTop: '20px', width: '300px', height: 'auto' }}
        initial={{ scale: 0 }}
        animate={{ scale: 1, transition: { duration: 0.5 } }}
      />
    </Box>
  );
};

export default NotFoundPage;
