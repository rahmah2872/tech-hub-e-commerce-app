import { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  TextField,
  Box,
  Chip,
  Pagination,
  Stack,
} from '@mui/material';
import { Link } from 'react-router-dom';

import { ShoppingCart } from '@mui/icons-material';
import api from '../utils/axios';
import * as React from 'react';
import ViewListIcon from '@mui/icons-material/ViewList';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import ToggleButton from '@mui/material/ToggleButton';




const Products = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(6);
  const [view, setView] = React.useState('list');
  const handleChange = (event, nextView) => {
    setView(nextView);
  };
  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = products.filter(product =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products);
    }
    setCurrentPage(1);
  }, [searchTerm, products]);

  const fetchProducts = async () => {
    try {
      const response = await api.get('/posts');
      const mockProducts = response.data.slice(0, 24).map(post => ({
        id: post.id,
        title: post.title,
        price: Math.floor(Math.random() * 500) + 20,
        category: ['Electronics', 'Clothing', 'Books', 'Home'][Math.floor(Math.random() * 4)],
        image: `https://picsum.photos/300/200?random=${post.id}`,
        description: post.body
      }));
      setProducts(mockProducts);
      setFilteredProducts(mockProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (product) => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = cart.find(item => item.id === product.id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
  };

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  if (loading) {
    return (
      <Container>
        <Typography variant="h6" align="center" sx={{ mt: 4 }}>
          Loading products...
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">

      <Box sx={{ my: 4 }}>
        <Typography variant="h4" gutterBottom>
          Products ({filteredProducts.length} items)


        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
          <TextField
            fullWidth
            label="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ mb: 3 }}
          />
          <ToggleButton sx={{ color: '#729FB8', mb: 3 }} value="view" onClick={() => setView(view === 'list' ? 'module' : 'list')}>
            {view === 'list' ? <ViewModuleIcon /> : <ViewListIcon />}
          </ToggleButton>

        </Box>

        <Grid container spacing={{ xs: 3 }}

        >
          {currentProducts.map((product) => (
            <Grid
              key={product.id}
              size={{ xs: 12, sm: view === 'list' ? 12 : 6, md: view === 'list' ? 12 : 4 }}
            >
              <Card sx={{ height: '100%', display: 'flex', alignItems: "center", flexDirection: view === 'list' ? 'row' : 'column' }}>
                <CardMedia
                  component="img"
                  height="200"

                  sx={{ width: view === 'list' ? 151 : '100%' }}
                  image={product.image}
                  alt={product.title}



                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" gutterBottom>
                    {product.title.length > 50
                      ? `${product.title.substring(0, 50)}...`
                      : product.title
                    }
                  </Typography>

                  <Chip
                    label={product.category}
                    size="small"
                    sx={{ mb: 1 }}
                  />

                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {product.description.length > 100
                      ? `${product.description.substring(0, 100)}...`
                      : product.description
                    }
                  </Typography>

                  <Typography variant="h6" color="#9EC7DE" sx={{ mb: 2 }}>
                    ${product.price}
                  </Typography>


                  <Button
                    variant="contained" color='#9EC7DE'  sx={{mb:2,display:'flex',justifySelf:'flex-end',width:'70'}}

                    component={Link} to={`/products/${product.id}`} >  More..
                  </Button>

                  <Button
                    variant="contained"
                    fullWidth
                    startIcon={<ShoppingCart />}
                    onClick={() => addToCart(product)}
                  >
                    Add to Cart

                  </Button>



                </CardContent>

              </Card>
            </Grid>
          ))}
        </Grid>

        {totalPages > 1 && (
          <Stack spacing={2} alignItems="center" sx={{ mt: 4 }}>
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={handlePageChange}
              color="primary"
              size="large"
              showFirstButton
              showLastButton
            />
            <Typography variant="body2" color="#9EC7DE">
              Showing {indexOfFirstProduct + 1}-{Math.min(indexOfLastProduct, filteredProducts.length)} of {filteredProducts.length} products
            </Typography>
          </Stack>
        )}

        {filteredProducts.length === 0 && (
          <Typography variant="h6" align="center" sx={{ mt: 4 }}>
            No products found
          </Typography>
        )}
      </Box>
    </Container >
  );
};

export default Products;