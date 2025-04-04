import "./App.css";
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import { Dashboard } from "./pages/dashboard";
import { Auth } from "./pages/auth/indexAuth"; // Keep this import path
import Login from "./pages/auth/login"; // Add this import for the Login component
import { FinancialRecordsProvider } from "./contexts/financial-record-context";
import { AuthProvider, useAuth } from "./contexts/auth-context";
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Container, 
  CssBaseline, 
  ThemeProvider, 
  createTheme,
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  useMediaQuery
} from "@mui/material";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import DashboardIcon from "@mui/icons-material/Dashboard";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import PersonIcon from "@mui/icons-material/Person";
import AssessmentIcon from "@mui/icons-material/Assessment"; // Add this import for the Reports icon
import { useState } from "react";

// Import the Reports component
import Reports from './pages/reports';

// Create a theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#3498db',
      light: '#5dade2',
      dark: '#2980b9',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#2ecc71',
      light: '#55d98d',
      dark: '#27ae60',
      contrastText: '#ffffff',
    },
    background: {
      default: '#f5f5f5',
    },
    error: {
      main: '#e74c3c',
    },
    warning: {
      main: '#f39c12',
    },
    info: {
      main: '#3498db',
    },
    success: {
      main: '#2ecc71',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '8px 16px',
        },
        contained: {
          boxShadow: '0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08)',
          '&:hover': {
            boxShadow: '0 7px 14px rgba(50, 50, 93, 0.1), 0 3px 6px rgba(0, 0, 0, 0.08)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        rounded: {
          borderRadius: 12,
        },
        elevation1: {
          boxShadow: '0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08)',
        },
        elevation2: {
          boxShadow: '0 7px 14px rgba(50, 50, 93, 0.1), 0 3px 6px rgba(0, 0, 0, 0.08)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08)',
        },
      },
    },
  },
});

// Protected route component
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }
  
  return children;
};

// Navigation component with user menu
const Navigation = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  
  const handleLogout = () => {
    logout();
    handleClose();
    setDrawerOpen(false);
  };
  
  const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (
      event.type === 'keydown' &&
      ((event as React.KeyboardEvent).key === 'Tab' ||
        (event as React.KeyboardEvent).key === 'Shift')
    ) {
      return;
    }
    setDrawerOpen(open);
  };
  
  return (
    <>
      <AppBar position="static" color="primary" elevation={0}>
        <Toolbar>
          {isAuthenticated && isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={toggleDrawer(true)}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          
          <AccountBalanceWalletIcon sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Finance Tracker
          </Typography>
          
          {isAuthenticated && !isMobile && (
            <>
              <Button 
                color="inherit" 
                component={Link} 
                to="/"
                startIcon={<DashboardIcon />}
                sx={{ mr: 2 }}
              >
                Dashboard
              </Button>
              <Button 
                color="inherit" 
                component={Link} 
                to="/reports"
                startIcon={<AssessmentIcon />}
                sx={{ mr: 2 }}
              >
                Reports
              </Button>
            </>
          )}
          
          {isAuthenticated ? (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="body2" sx={{ mr: 2, display: { xs: 'none', sm: 'block' } }}>
                {user?.username}
              </Typography>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <Avatar sx={{ width: 32, height: 32, bgcolor: '#2980b9' }}>
                  {user?.username?.charAt(0).toUpperCase() || 'U'}
                </Avatar>
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem disabled>
                  <Typography variant="body2" color="textSecondary">
                    Signed in as <strong>{user?.username}</strong>
                  </Typography>
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleLogout}>
                  <ListItemIcon>
                    <LogoutIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Logout</ListItemText>
                </MenuItem>
              </Menu>
            </Box>
          ) : (
            <Button 
              color="inherit" 
              component={Link} 
              to="/auth"
              variant="outlined"
              sx={{ 
                borderColor: 'rgba(255,255,255,0.5)', 
                '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' } 
              }}
            >
              Login
            </Button>
          )}
        </Toolbar>
      </AppBar>
      
      {/* Mobile Drawer */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
      >
        <Box
          sx={{ width: 250 }}
          role="presentation"
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
        >
          <Box sx={{ p: 2, display: 'flex', alignItems: 'center', bgcolor: '#3498db', color: 'white' }}>
            <AccountBalanceWalletIcon sx={{ mr: 2 }} />
            <Typography variant="h6">Finance Tracker</Typography>
          </Box>
          <Divider />
          <List>
            <ListItem button component={Link} to="/">
              <ListItemIcon>
                <DashboardIcon />
              </ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItem>
            <ListItem button component={Link} to="/reports">
              <ListItemIcon>
                <AssessmentIcon />
              </ListItemIcon>
              <ListItemText primary="Reports" />
            </ListItem>
          </List>
          <Divider />
          <List>
            <ListItem button onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </>
  );
};

function AppContent() {
  return (
    <Router>
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navigation />
        
        <Box sx={{ flexGrow: 1 }}>
          <Routes>
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <FinancialRecordsProvider>
                    <Dashboard />
                  </FinancialRecordsProvider>
                </ProtectedRoute>
              }
            />
            <Route path="/auth" element={<Auth />} />
            <Route path="/login" element={<Login />} />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <FinancialRecordsProvider>
                    <Dashboard />
                  </FinancialRecordsProvider>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/reports" 
              element={
                <ProtectedRoute>
                  <FinancialRecordsProvider>
                    <Reports />
                  </FinancialRecordsProvider>
                </ProtectedRoute>
              } 
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Box>
        
        <Box component="footer" sx={{ py: 3, px: 2, mt: 'auto', bgcolor: '#f8f9fa', borderTop: '1px solid #e9ecef' }}>
          <Container maxWidth="sm">
            <Typography variant="body2" color="text.secondary" align="center">
              © {new Date().getFullYear()} Personal Finance Tracker
            </Typography>
          </Container>
        </Box>
      </Box>
    </Router>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
