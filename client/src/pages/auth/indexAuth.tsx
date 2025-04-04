// indexAuth.tsx
import React, { useState } from "react";
import { useAuth } from "../../contexts/auth-context";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  TextField,
  Button,
  Tabs,
  Tab,
  Alert,
  Stack,
  InputAdornment,
  IconButton,
  useTheme,
  CssBaseline,
  Container
} from "@mui/material";
import { styled } from "@mui/material/styles";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import LoginIcon from "@mui/icons-material/Login";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";

const StyledTabs = styled(Tabs)(({ theme }) => ({
  '& .MuiTab-root': {
    fontWeight: 500,
    fontSize: '0.9rem',
    textTransform: 'none',
  },
}));

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`auth-tabpanel-${index}`}
      aria-labelledby={`auth-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

export const Auth = () => {
  const [tabValue, setTabValue] = useState(0);
  const [loginData, setLoginData] = useState({ username: "", password: "" });
  const [registerData, setRegisterData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { login, register, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    setError(null);
  };

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData({ ...loginData, [name]: value });
  };

  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRegisterData({ ...registerData, [name]: value });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    try {
      await login(loginData.username, loginData.password);
      navigate("/");
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (registerData.password !== registerData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    
    try {
      await register(
        registerData.username,
        registerData.email,
        registerData.password
      );
      navigate("/");
    } catch (err: any) {
      setError(err.message);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <Box sx={{ 
      bgcolor: '#f5f5f5', 
      minHeight: '100dvh', 
      display: 'flex', 
      flexDirection: 'column',
      width: '100vw',
      overflowX: 'hidden'
    }}>
      <CssBaseline />
      
      <Box sx={{ 
        bgcolor: '#3498db', 
        py: 2,
        px: 2,
        width: '100%'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <AccountBalanceWalletIcon sx={{ color: 'white' }} />
          <Typography variant="h6" component="div" sx={{ fontWeight: 500, color: 'white' }}>
            Finance Tracker
          </Typography>
        </Box>
      </Box>
      
      <Container sx={{ 
        py: 4, 
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        maxWidth: '100% !important',
        px: { xs: 2, sm: 4 }
      }}>
        <Box sx={{ 
          width: '100%',
          maxWidth: '400px',
          textAlign: 'center' 
        }}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h5" component="h1" sx={{ fontWeight: 500, color: '#2c3e50', mb: 1 }}>
              Finance Tracker
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Secure financial management platform
            </Typography>
          </Box>
          
          <Box sx={{ 
            bgcolor: 'white', 
            borderRadius: 2, 
            boxShadow: 1,
            width: '100%'
          }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <StyledTabs
                value={tabValue}
                onChange={handleTabChange}
                variant="fullWidth"
              >
                <Tab label="Sign In" />
                <Tab label="Sign Up" />
              </StyledTabs>
            </Box>
            
            {error && (
              <Alert severity="error" sx={{ m: 2 }}>
                {error}
              </Alert>
            )}
            
            <TabPanel value={tabValue} index={0}>
              <Box component="form" onSubmit={handleLogin} sx={{ p: 3 }}>
                <Stack spacing={2.5}>
                  <Box>
                    <Typography variant="body2" component="label" htmlFor="username" sx={{ display: 'block', mb: 0.5, fontWeight: 500 }}>
                      Username
                    </Typography>
                    <TextField
                      id="username"
                      name="username"
                      placeholder="Enter your username"
                      value={loginData.username}
                      onChange={handleLoginChange}
                      fullWidth
                      size="small"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PersonIcon fontSize="small" color="action" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Box>
                  
                  <Box>
                    <Typography variant="body2" component="label" htmlFor="password" sx={{ display: 'block', mb: 0.5, fontWeight: 500 }}>
                      Password
                    </Typography>
                    <TextField
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={loginData.password}
                      onChange={handleLoginChange}
                      fullWidth
                      size="small"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LockIcon fontSize="small" color="action" />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={togglePasswordVisibility}
                              edge="end"
                              size="small"
                            >
                              {showPassword ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Box>
                  
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{
                      mt: 1,
                      bgcolor: '#3498db',
                      textTransform: 'none',
                      py: 1,
                      '&:hover': { bgcolor: '#2980b9' }
                    }}
                  >
                    Sign In
                  </Button>
                </Stack>
              </Box>
            </TabPanel>
            
            <TabPanel value={tabValue} index={1}>
              <Box component="form" onSubmit={handleRegister} sx={{ p: 3 }}>
                <Stack spacing={2.5}>
                  <Box>
                    <Typography variant="body2" component="label" htmlFor="reg-username" sx={{ display: 'block', mb: 0.5, fontWeight: 500 }}>
                      Username
                    </Typography>
                    <TextField
                      id="reg-username"
                      name="username"
                      placeholder="Choose a username"
                      value={registerData.username}
                      onChange={handleRegisterChange}
                      fullWidth
                      size="small"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PersonIcon fontSize="small" color="action" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Box>
                  
                  <Box>
                    <Typography variant="body2" component="label" htmlFor="email" sx={{ display: 'block', mb: 0.5, fontWeight: 500 }}>
                      Email
                    </Typography>
                    <TextField
                      id="email"
                      name="email"
                      type="email"
                      placeholder="your@email.com"
                      value={registerData.email}
                      onChange={handleRegisterChange}
                      fullWidth
                      size="small"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <EmailIcon fontSize="small" color="action" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Box>
                  
                  <Box>
                    <Typography variant="body2" component="label" htmlFor="reg-password" sx={{ display: 'block', mb: 0.5, fontWeight: 500 }}>
                      Password
                    </Typography>
                    <TextField
                      id="reg-password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a password"
                      value={registerData.password}
                      onChange={handleRegisterChange}
                      fullWidth
                      size="small"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LockIcon fontSize="small" color="action" />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={togglePasswordVisibility}
                              edge="end"
                              size="small"
                            >
                              {showPassword ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Box>
                  
                  <Box>
                    <Typography variant="body2" component="label" htmlFor="confirm-password" sx={{ display: 'block', mb: 0.5, fontWeight: 500 }}>
                      Confirm Password
                    </Typography>
                    <TextField
                      id="confirm-password"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      value={registerData.confirmPassword}
                      onChange={handleRegisterChange}
                      fullWidth
                      size="small"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LockIcon fontSize="small" color="action" />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={toggleConfirmPasswordVisibility}
                              edge="end"
                              size="small"
                            >
                              {showConfirmPassword ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Box>
                  
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{
                      mt: 1,
                      bgcolor: '#3498db',
                      textTransform: 'none',
                      py: 1,
                      '&:hover': { bgcolor: '#2980b9' }
                    }}
                  >
                    Create Account
                  </Button>
                </Stack>
              </Box>
            </TabPanel>
          </Box>
          
          <Typography variant="body2" color="text.secondary" sx={{ mt: 3 }}>
            © {new Date().getFullYear()} Finance Tracker
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};