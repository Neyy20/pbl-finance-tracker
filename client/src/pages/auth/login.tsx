// login.tsx
import React, { useState } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Container, 
  Paper, 
  InputAdornment, 
  IconButton,
  Avatar,
  useTheme
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/auth-context';
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import LoginIcon from '@mui/icons-material/Login';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const theme = useTheme();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials({
      ...credentials,
      [name]: value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(credentials.username, credentials.password);
      navigate('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Box 
      sx={{ 
        minHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100vw',
        backgroundColor: '#f5f5f5',
        overflowX: 'hidden'
      }}
    >
      <Container 
        sx={{ 
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          maxWidth: '100% !important',
          px: { xs: 2, sm: 4 }
        }}
      >
        <Paper 
          sx={{ 
            p: { xs: 2, sm: 3 },
            width: '100%',
            maxWidth: '400px',
            borderRadius: 2,
            boxShadow: 1
          }}
        >
          <Avatar sx={{ 
            m: 'auto', 
            bgcolor: '#3498db', 
            width: 56, 
            height: 56 
          }}>
            <AccountBalanceWalletIcon fontSize="large" />
          </Avatar>
          
          <Typography component="h1" variant="h5" sx={{ 
            mt: 2, 
            mb: 1, 
            fontWeight: 600, 
            textAlign: 'center' 
          }}>
            Finance Tracker
          </Typography>
          
          <Typography component="h2" variant="body1" sx={{ 
            mb: 3, 
            textAlign: 'center', 
            color: 'text.secondary' 
          }}>
            Welcome Back
          </Typography>
          
          <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              autoFocus
              value={credentials.username}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 1,
                },
              }}
            />
            
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? "text" : "password"}
              id="password"
              autoComplete="current-password"
              value={credentials.password}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={togglePasswordVisibility}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 1,
                },
              }}
            />
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ 
                mt: 3, 
                mb: 2, 
                bgcolor: '#3498db', 
                '&:hover': { bgcolor: '#2980b9' },
                py: 1.5,
                borderRadius: 1,
                textTransform: 'none',
                fontWeight: 600,
              }}
            >
              Login
            </Button>
          </Box>
        </Paper>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          © {new Date().getFullYear()} Finance Tracker
        </Typography>
      </Container>
    </Box>
  );
};

export default Login;