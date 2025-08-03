import { useState, useEffect } from 'react';
import {
    Container,
    Card,
    CardContent,
    CardMedia,
    Typography,
    Button,
    Chip,
} from '@mui/material';
import { ShoppingCart } from '@mui/icons-material';
import { useParams } from 'react-router-dom';
import api from '../utils/axios';

const ProductsInfo = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [load, setload] = useState(true);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setload(true);
                const response = await api.get(`/posts/${id}`);
                const post = response.data;
                const productData = {
                    title: post.title,
                    price: Math.floor(Math.random() * 500) + 20,
                    category: ['Electronics', 'Clothing', 'Books', 'Home'][Math.floor(Math.random() * 4)],
                    image: `https://picsum.photos/300/200?random=${post.id}`,
                    description: post.body,
                };
                setProduct(productData);
            } catch (error) {
                console.error('Error fetching product:', error);
                setProduct(null);
            } finally {
                setload(false);
            }
        };

        fetchProduct();
    }, [id]);

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



    if (!product) {
        return (
            <Container>
                <Typography align="center" sx={{ mt: 4 }}>
                    <h3>  loading...</h3>
                </Typography>
            </Container>
        );
    }

    return (

        <Container maxWidth="sm" sx={{ my: 4 }}>


            <Card>

                <CardMedia
                    component="img"
                    height="300"
                    image={product.image}
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
                    <Typography variant="h6" color="#9EC7DE" sx={{ mb: 2 }}>
                        ${product.price}
                    </Typography>

                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {product.description.length > 100
                            ? `${product.description.substring(0, 100)}...`
                            : product.description
                        }
                    </Typography>

                    <Button
                        variant="contained"
                        fullWidth
                        startIcon={<ShoppingCart />}
                        onClick={() => addToCart(product)}>

                        Add to Cart

                    </Button>
                </CardContent>
            </Card>
        </Container>
    );
};

export default ProductsInfo;