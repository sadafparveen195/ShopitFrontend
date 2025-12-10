import React, { useState, useEffect, useMemo } from 'react';
import {
  Avatar, Button, IconButton, Stack, Typography, Box,
  TextField, CircularProgress, ButtonGroup, Step, StepLabel, Stepper, Fade
} from '@mui/material';
import CameraAlt from '@mui/icons-material/CameraAlt';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { server } from '../constants/config';

const steps = ['Profile Picture', 'Basic Info', 'Contact Info', 'Account Details'];

const RegisterPage = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [contactMethod, setContactMethod] = useState('email');
  const [formData, setFormData] = useState({});
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  // ✅ Dynamic validation schema based on current step
  const getValidationSchema = (step) => {
    switch (step) {
      case 0:
        return yup.object().shape({
          avatar: yup.mixed()
            .required('Avatar is required')
            .test('fileSize', 'File too large', value => value && value.size <= 5_000_000)
            .test('fileType', 'Unsupported file type', value =>
              value && ['image/jpeg', 'image/png', 'image/gif'].includes(value.type)
            ),
        });
      case 1:
        return yup.object().shape({
          fullName: yup.string().required('Full Name is required').max(50),
          about: yup.string().max(200),
        });
      case 2:
        return yup.object().shape({
          email: contactMethod === 'email'
            ? yup.string().email('Invalid email').required('Email is required')
            : yup.string().notRequired(),
          phone: contactMethod === 'phone'
            ? yup.string().matches(/^[0-9]{10}$/, 'Invalid phone number').required('Phone is required')
            : yup.string().notRequired(),
        });
      case 3:
        return yup.object().shape({
          username: yup.string()
            .required('Username is required')
            .min(4, 'Username must be at least 4 characters')
            .max(20, 'Username cannot exceed 20 characters'),
          password: yup.string()
            .required('Password is required')
            .min(8, 'Password must be at least 8 characters'),
          confirmPassword: yup.string()
            .oneOf([yup.ref('password'), null], 'Passwords must match')
            .required('Please confirm your password'),
        });
      default:
        return yup.object().shape({});
    }
  };

  const resolver = useMemo(
    () => yupResolver(getValidationSchema(activeStep)),
    [activeStep, contactMethod]
  );

  const {
    handleSubmit,
    register,
    control,
    formState: { errors },
    trigger,
    reset,
    watch,
    setValue,
    getValues,
  } = useForm({
    resolver,
    mode: 'onBlur',
    defaultValues: {
      avatar: null,
      fullName: '',
      about: '',
      email: '',
      phone: '',
      username: '',
      password: '',
      confirmPassword: '',
    },
  });

  useEffect(() => {
    if (contactMethod === 'email') setValue('phone', '');
    else setValue('email', '');
  }, [contactMethod, setValue]);

  // 🖼 Handle avatar upload preview
  const handleFileChange = (event, field) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result);
      field.onChange(file);
    };
    reader.readAsDataURL(file);
  };

  const handleNext = async () => {
    const valid = await trigger();
    if (!valid) return;
    const currentData = getValues();
    setFormData(prev => ({ ...prev, ...currentData }));
    setActiveStep(prev => Math.min(prev + 1, steps.length - 1));
  };

  const handleBack = () => {
    setActiveStep(prev => Math.max(prev - 1, 0));
  };

  // 🚀 Handle registration
  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const finalData = { ...formData, ...data };
      delete finalData.confirmPassword;

      const formDataObj = new FormData();
      Object.entries(finalData).forEach(([key, value]) => {
        if (!value) return;
        if (key === 'avatar' && value instanceof File) {
          formDataObj.append('avatar', value);
        } else {
          formDataObj.append(key, value);
        }
      });

      await axios.post(`${server}/api/v1/users/register`, formDataObj, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials : true,
      });

      setSuccess(true);
      toast.success('Account created! Please verify your email before logging in.');
      setTimeout(() => navigate('/login'), 3000);
    } catch (error) {
      const message = error?.response?.data?.message || error.message || 'Registration failed';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Success Animation Screen
  if (success) {
    return (
      <Fade in={success}>
        <Box
          sx={{
            minHeight: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            bgcolor: 'background.default',
            gap: 2,
          }}
        >
          <CheckCircleIcon color="success" sx={{ fontSize: 90 }} />
          <Typography variant="h5" color="success.main">
            Verification Email Sent!
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Please check your inbox and verify your email to continue.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Redirecting to login page...
          </Typography>
        </Box>
      </Fade>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        bgcolor: 'background.default',
        p: 2,
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: 600,
          bgcolor: 'background.paper',
          boxShadow: 3,
          borderRadius: 2,
          p: 4,
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
        }}
      >
        <Typography variant="h4" align="center" color="primary" gutterBottom>
          Create Your Account
        </Typography>

        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 3 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
          {/* Step 1: Avatar */}
          {activeStep === 0 && (
            <Stack alignItems="center" spacing={2}>
              <Controller
                name="avatar"
                control={control}
                defaultValue={null}
                render={({ field }) => (
                  <>
                    <Box sx={{ position: 'relative' }}>
                      <Avatar
                        src={avatarPreview}
                        sx={{
                          width: 120,
                          height: 120,
                          border: '3px solid',
                          borderColor: 'primary.main',
                        }}
                      />
                      <IconButton
                        component="label"
                        sx={{
                          position: 'absolute',
                          bottom: 0,
                          right: 0,
                          bgcolor: 'primary.main',
                          color: 'primary.contrastText',
                          '&:hover': { bgcolor: 'primary.dark' },
                        }}
                      >
                        <CameraAlt />
                        <input
                          type="file"
                          accept="image/*"
                          hidden
                          onChange={(e) => handleFileChange(e, field)}
                        />
                      </IconButton>
                    </Box>
                    {errors.avatar && (
                      <Typography color="error" variant="caption">
                        {errors.avatar.message}
                      </Typography>
                    )}
                  </>
                )}
              />
            </Stack>
          )}

          {/* Step 2: Basic Info */}
          {activeStep === 1 && (
            <Stack spacing={2}>
              <TextField
                label="Full Name"
                {...register('fullName')}
                error={!!errors.fullName}
                helperText={errors.fullName?.message}
                fullWidth
              />
              <TextField
                label="Tell us about yourself(optional) "
                {...register('about')}
                error={!!errors.about}
                helperText={errors.about?.message}
                multiline
                rows={3}
                fullWidth
              />
            </Stack>
          )}

          {/* Step 3: Contact Info */}
          {activeStep === 2 && (
            <Stack spacing={2}>
              <ButtonGroup fullWidth>
                <Button
                  variant={contactMethod === 'email' ? 'contained' : 'outlined'}
                  onClick={() => setContactMethod('email')}
                >
                  Email
                </Button>
                <Button
                  variant={contactMethod === 'phone' ? 'contained' : 'outlined'}
                  onClick={() => setContactMethod('phone')}
                >
                  Phone
                </Button>
              </ButtonGroup>

              {contactMethod === 'email' ? (
                <TextField
                  label="Email Address"
                  {...register('email')}
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  fullWidth
                />
              ) : (
                <TextField
                  label="Phone Number"
                  {...register('phone')}
                  error={!!errors.phone}
                  helperText={errors.phone?.message}
                  fullWidth
                />
              )}
            </Stack>
          )}

          {/* Step 4: Account Details */}
          {activeStep === 3 && (
            <Stack spacing={2}>
              <TextField
                label="Username"
                {...register('username')}
                error={!!errors.username}
                helperText={errors.username?.message}
                fullWidth
              />
              <TextField
                label="Password"
                type="password"
                {...register('password')}
                error={!!errors.password}
                helperText={errors.password?.message}
                fullWidth
              />
              <TextField
                label="Confirm Password"
                type="password"
                {...register('confirmPassword')}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword?.message}
                fullWidth
              />
            </Stack>
          )}

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
            <Button
              onClick={handleBack}
              disabled={activeStep === 0 || loading}
              startIcon={<ArrowBackIcon />}
            >
              Back
            </Button>

            {activeStep === steps.length - 1 ? (
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                endIcon={loading ? <CircularProgress size={20} /> : null}
              >
                {loading ? 'Registering...' : 'Register'}
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                variant="contained"
                endIcon={<ArrowForwardIcon />}
              >
                Next
              </Button>
            )}
          </Box>
        </Box>

        <Typography variant="body2" align="center" sx={{ mt: 2 }}>
          Already have an account?{' '}
          <Button
            variant="text"
            size="small"
            onClick={() => navigate('/login')}
            sx={{ textTransform: 'none' }}
          >
            Sign in
          </Button>
        </Typography>
      </Box>
    </Box>
  );
};

export default RegisterPage;
