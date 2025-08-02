import { useState, useEffect } from 'react';
import { 
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Button,
  IconButton,
  Divider
} from '@mui/material';
import { Add, Remove, Delete } from '@mui/icons-material';
import { useNavigate } from 'react-router';
import { cartAPI } from '../services/api';
import { CartSkeleton } from './SkeletonLoader';

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      const response = await cartAPI.get();
      setCart(response.data.items || []);
    } catch (error) {
      console.error('Error loading cart:', error);
      // Fallback to localStorage
      const cartData = JSON.parse(localStorage.getItem('cart') || '[]');
      setCart(cartData);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (id, newQuantity) => {
    if (newQuantity <= 0) {
      removeItem(id);
      return;
    }

    try {
      await cartAPI.update(id, newQuantity);
      const updatedCart = cart.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      );
      setCart(updatedCart);
      localStorage.setItem('cart', JSON.stringify(updatedCart));
    } catch (error) {
      console.error('Error updating cart:', error);
      // Fallback to localStorage only
      const updatedCart = cart.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      );
      setCart(updatedCart);
      localStorage.setItem('cart', JSON.stringify(updatedCart));
    }
  };

  const removeItem = async (id) => {
    try {
      await cartAPI.remove(id);
      const updatedCart = cart.filter(item => item.id !== id);
      setCart(updatedCart);
      localStorage.setItem('cart', JSON.stringify(updatedCart));
    } catch (error) {
      console.error('Error removing item:', error);
      // Fallback to localStorage only
      const updatedCart = cart.filter(item => item.id !== id);
      setCart(updatedCart);
      localStorage.setItem('cart', JSON.stringify(updatedCart));
    }
  };

  const clearCart = async () => {
    try {
      await cartAPI.clear();
      setCart([]);
      localStorage.removeItem('cart');
    } catch (error) {
      console.error('Error clearing cart:', error);
      // Fallback to localStorage only
      setCart([]);
      localStorage.removeItem('cart');
    }
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  if (loading) {
    return <CartSkeleton items={3} />;
  }

  if (cart.length === 0) {
    return (
      <Container maxWidth="md">
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="h4" gutterBottom>
            Your Cart is Empty
          </Typography>
          <Button 
            variant="contained" 
            onClick={() => navigate('/products')}
            sx={{ mt: 2 }}
          >
            Continue Shopping
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" gutterBottom>
          Shopping Cart ({getTotalItems()} items)
        </Typography>

        {cart.map((item) => (
          <Card key={item.id} sx={{ mb: 2 }}>
            <CardContent>
              <Grid container spacing={2} alignItems="center">
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="h6">
                    {item.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    ${item.price} each
                  </Typography>
                </Grid>
                
                <Grid size={{ xs: 12, sm: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <IconButton 
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      size="small"
                    >
                      <Remove />
                    </IconButton>
                    
                    <Typography sx={{ mx: 2 }}>
                      {item.quantity}
                    </Typography>
                    
                    <IconButton 
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      size="small"
                    >
                      <Add />
                    </IconButton>
                  </Box>
                </Grid>
                
                <Grid size={{ xs: 12, sm: 2 }}>
                  <Typography variant="h6">
                    ${(item.price * item.quantity).toFixed(2)}
                  </Typography>
                </Grid>
                
                <Grid size={{ xs: 12, sm: 1 }}>
                  <IconButton 
                    onClick={() => removeItem(item.id)}
                    color="error"
                  >
                    <Delete />
                  </IconButton>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        ))}

        <Divider sx={{ my: 3 }} />
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5">
            Total: ${getTotalPrice().toFixed(2)}
          </Typography>
          
          <Box>
            <Button 
              variant="outlined" 
              onClick={clearCart}
              sx={{ mr: 2 }}
            >
              Clear Cart
            </Button>
            
            <Button 
              variant="contained" 
              onClick={() => navigate('/checkout')}
            >
              Proceed to Checkout
            </Button>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default Cart;