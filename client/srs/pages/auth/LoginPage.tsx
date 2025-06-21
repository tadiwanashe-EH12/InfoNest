import { useState } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, TextField, Box, Typography, Divider, IconButton } from '@mui/material';
import { Fingerprint, Face } from '@mui/icons-material';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const schema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type FormData = z.infer<typeof schema>;

export const LoginPage = () => {
  const router = useRouter();
  const { login } = useAuth();
  const [isBiometricLoading, setIsBiometricLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      await login(data.email, data.password);
      router.push('/dashboard');
    } catch (err) {
      setError('Invalid credentials. Please try again.');
    }
  };

  const handleFingerprintLogin = async () => {
    setIsBiometricLoading(true);
    try {
      // In a real app, this would interface with device biometric API
      const response = await axios.post('/api/auth/biometric', {
        biometricData: 'simulated_fingerprint_data'
      });
      await login(response.data.email, '', true);
      router.push('/dashboard');
    } catch (err) {
      setError('Biometric authentication failed. Please try another method.');
    } finally {
      setIsBiometricLoading(false);
    }
  };

  const handleFacialLogin = async () => {
    setIsBiometricLoading(true);
    try {
      // In a real app, this would interface with device camera API
      const response = await axios.post('/api/auth/biometric', {
        biometricData: 'simulated_facial_data'
      });
      await login(response.data.email, '', true);
      router.push('/dashboard');
    } catch (err) {
      setError('Facial recognition failed. Please try another method.');
    } finally {
      setIsBiometricLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        bgcolor: 'background.default',
        p: 3,
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: 400,
          bgcolor: 'background.paper',
          boxShadow: 3,
          borderRadius: 2,
          p: 4,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        <Typography variant="h4" component="h1" align="center" gutterBottom>
          LibraNexus
        </Typography>
        <Typography variant="subtitle1" align="center" color="text.secondary">
          Next-Gen Library Management
        </Typography>

        {error && (
          <Typography color="error" align="center">
            {error}
          </Typography>
        )}

        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 2 }}
        >
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            {...register('email')}
            error={!!errors.email}
            helperText={errors.email?.message}
          />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            {...register('password')}
            error={!!errors.password}
            helperText={errors.password?.message}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 2 }}
          >
            Sign In
          </Button>
        </Box>

        <Divider sx={{ my: 2 }}>OR</Divider>

        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
          <IconButton
            onClick={handleFingerprintLogin}
            disabled={isBiometricLoading}
            color="primary"
            sx={{ border: 1, borderColor: 'divider' }}
          >
            <Fingerprint fontSize="large" />
          </IconButton>
          <IconButton
            onClick={handleFacialLogin}
            disabled={isBiometricLoading}
            color="primary"
            sx={{ border: 1, borderColor: 'divider' }}
          >
            <Face fontSize="large" />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};