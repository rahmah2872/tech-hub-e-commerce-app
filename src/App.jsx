import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import { ThemeProvider as MUIThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import Navigation from './components/Navigation';
import Login from './components/Login';
import Products from './components/Products';
import Users from './components/Users';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import ErrorBoundary from './components/ErrorBoundary';

const AppContent = () => {
  const { darkMode } = useTheme();

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: '#CCDC28',
        contrastText: '#000000',
      },
      secondary: {
        main: darkMode ? '#CCDC28' : '#1976d2',
      },
      background: {
        default: darkMode ? '#121212' : '#ffffff',
        paper: darkMode ? '#1e1e1e' : '#ffffff',
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          contained: {
            backgroundColor: '#CCDC28',
            color: '#000000',
            '&:hover': {
              backgroundColor: '#b8c424',
            },
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: darkMode ? '#1e1e1e' : '#CCDC28',
            color: darkMode ? '#ffffff' : '#000000',
          },
        },
      },
    },
  });

  return (
    <MUIThemeProvider theme={theme}>
      <CssBaseline />
      <ErrorBoundary fallbackMessage="We're having trouble loading the application. Please refresh the page.">
        <AuthProvider>
          <BrowserRouter>
            <Navigation />
            <Routes>
              <Route 
                path="/login" 
                element={
                  <PublicRoute>
                    <ErrorBoundary fallbackMessage="There was an issue loading the login page.">
                      <Login />
                    </ErrorBoundary>
                  </PublicRoute>
                } 
              />
              <Route 
                path="/*" 
                element={
                  <ProtectedRoute>
                    <Routes>
                      <Route path="/products" element={
                        <ErrorBoundary fallbackMessage="Unable to load products. Please try again.">
                          <Products />
                        </ErrorBoundary>
                      } />
                      <Route path="/users" element={
                        <ErrorBoundary fallbackMessage="Unable to load users. Please try again.">
                          <Users />
                        </ErrorBoundary>
                      } />
                      <Route path="/cart" element={
                        <ErrorBoundary fallbackMessage="Unable to load cart. Please try again.">
                          <Cart />
                        </ErrorBoundary>
                      } />
                      <Route path="/checkout" element={
                        <ErrorBoundary fallbackMessage="Unable to load checkout. Please try again.">
                          <Checkout />
                        </ErrorBoundary>
                      } />
                      <Route path="/" element={<Navigate to="/products" replace />} />
                    </Routes>
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </ErrorBoundary>
    </MUIThemeProvider>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
