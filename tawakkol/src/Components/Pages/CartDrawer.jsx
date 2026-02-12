// src/components/CartDrawer.jsx
import React, { useState, useEffect } from 'react';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Divider,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  TextField,
  Badge,
  Fade,
  Zoom,
  Chip,
  Tooltip,
  Collapse,
  Alert,
} from '@mui/material';
import {
  Close,
  Delete,
  Add,
  Remove,
  ShoppingBag,
  LocalShipping,
  Discount,
  ArrowForward,
  Info,
} from '@mui/icons-material';
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const premiumColors = {
  noir: '#0a0a0a',
  gold: '#d4af37',
  goldLight: '#f4e4a6',
  goldDark: '#b8941f',
  charcoal: '#1a1a1a',
  lightNoir: '#2a2a2a',
  white: '#ffffff',
  success: '#4caf50',
};

const alpha = (color, opacity) => {
  const alphaHex = Math.round(opacity * 255).toString(16).padStart(2, '0');
  return color + alphaHex;
};

const CartDrawer = () => {
  const { cart, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, subtotal, cartCount, shippingCost, total } = useCart();
  const navigate = useNavigate();
  const [promoCode, setPromoCode] = useState('');
  const [showPromo, setShowPromo] = useState(false);
  const [isRemoving, setIsRemoving] = useState(null);

  const handleCheckout = () => {
    setIsCartOpen(false);
    navigate('/checkout');
  };

  const handleQuantityChange = (item, newQuantity) => {
    if (newQuantity < 1) {
      handleRemoveWithAnimation(item);
    } else {
      updateQuantity(item._id, newQuantity, item.selectedSize, item.selectedColor);
    }
  };

  const handleRemoveWithAnimation = (item) => {
    setIsRemoving(`${item._id}-${item.selectedSize || ''}-${item.selectedColor || ''}`);
    setTimeout(() => {
      removeFromCart(item._id, item.selectedSize, item.selectedColor);
      setIsRemoving(null);
    }, 300);
  };

  const getShippingProgress = () => {
    const freeShippingThreshold = 200;
    const progress = Math.min((subtotal / freeShippingThreshold) * 100, 100);
    return {
      progress,
      remaining: Math.max(freeShippingThreshold - subtotal, 0),
      isFree: subtotal >= freeShippingThreshold,
    };
  };

  const shippingProgress = getShippingProgress();

  return (
    <Drawer
      anchor="right"
      open={isCartOpen}
      onClose={() => setIsCartOpen(false)}
      sx={{
        '& .MuiDrawer-paper': {
          width: { xs: '100%', sm: 480 },
          background: `linear-gradient(135deg, ${premiumColors.noir} 0%, ${premiumColors.charcoal} 100%)`,
          color: premiumColors.white,
          borderLeft: `1px solid ${alpha(premiumColors.gold, 0.3)}`,
          backdropFilter: 'blur(10px)',
        },
      }}
      SlideProps={{ timeout: 300 }}
    >
      <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <Box sx={{ p: 3, borderBottom: `1px solid ${alpha(premiumColors.gold, 0.2)}` }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Badge
                badgeContent={cartCount}
                color="primary"
                sx={{
                  '& .MuiBadge-badge': {
                    background: premiumColors.gold,
                    color: premiumColors.noir,
                    fontWeight: 'bold',
                  },
                }}
              >
                <ShoppingBag sx={{ color: premiumColors.gold, fontSize: 28 }} />
              </Badge>
              <Typography
                variant="h5"
                sx={{
                  fontFamily: "'Playfair Display', serif",
                  color: premiumColors.gold,
                  fontWeight: 600,
                }}
              >
                Votre Panier
              </Typography>
            </Box>
            <IconButton
              onClick={() => setIsCartOpen(false)}
              sx={{
                color: premiumColors.gold,
                '&:hover': {
                  background: alpha(premiumColors.gold, 0.1),
                },
              }}
            >
              <Close />
            </IconButton>
          </Box>

          {/* Shipping Progress */}
          {subtotal > 0 && (
            <Fade in={true}>
              <Box sx={{ mt: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="caption" sx={{ color: premiumColors.goldLight }}>
                    {shippingProgress.isFree ? (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <LocalShipping fontSize="small" />
                        Livraison gratuite ✓
                      </Box>
                    ) : (
                      `Plus que ${shippingProgress.remaining} TND pour la livraison gratuite`
                    )}
                  </Typography>
                  <Typography variant="caption" sx={{ color: premiumColors.goldLight }}>
                    {Math.round(shippingProgress.progress)}%
                  </Typography>
                </Box>
                <Box
                  sx={{
                    height: 6,
                    background: alpha(premiumColors.gold, 0.1),
                    borderRadius: 3,
                    overflow: 'hidden',
                  }}
                >
                  <Box
                    sx={{
                      height: '100%',
                      width: `${shippingProgress.progress}%`,
                      background: `linear-gradient(90deg, ${premiumColors.gold}, ${premiumColors.goldDark})`,
                      transition: 'width 0.5s ease',
                    }}
                  />
                </Box>
              </Box>
            </Fade>
          )}
        </Box>

        {/* Empty State */}
        <AnimatePresence>
          {cart.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <Box sx={{ textAlign: 'center', p: 4 }}>
                <ShoppingBag sx={{ fontSize: 80, color: alpha(premiumColors.gold, 0.3), mb: 3 }} />
                <Typography variant="h6" sx={{ color: alpha(premiumColors.white, 0.7), mb: 2 }}>
                  Votre panier est vide
                </Typography>
                <Typography variant="body2" sx={{ color: alpha(premiumColors.white, 0.5), mb: 4 }}>
                  Ajoutez des articles pour commencer votre shopping
                </Typography>
                <Button
                  variant="outlined"
                  sx={{
                    borderColor: premiumColors.gold,
                    color: premiumColors.gold,
                    '&:hover': {
                      borderColor: premiumColors.gold,
                      background: alpha(premiumColors.gold, 0.1),
                    },
                  }}
                  onClick={() => setIsCartOpen(false)}
                >
                  Continuer le shopping
                </Button>
              </Box>
            </motion.div>
          ) : (
            <>
              {/* Cart Items */}
              <List sx={{ flex: 1, overflowY: 'auto', p: 2 }}>
                <AnimatePresence>
                  {cart.map((item) => (
                    <motion.div
                      key={`${item._id}-${item.selectedSize || ''}-${item.selectedColor || ''}`}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ 
                        opacity: isRemoving === `${item._id}-${item.selectedSize || ''}-${item.selectedColor || ''}` ? 0 : 1,
                        y: 0,
                        scale: isRemoving === `${item._id}-${item.selectedSize || ''}-${item.selectedColor || ''}` ? 0.8 : 1
                      }}
                      exit={{ opacity: 0, x: 100 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ListItem
                        sx={{
                          p: 2,
                          mb: 2,
                          background: alpha(premiumColors.gold, 0.03),
                          borderRadius: 2,
                          border: `1px solid ${alpha(premiumColors.gold, 0.1)}`,
                          opacity: isRemoving === `${item._id}-${item.selectedSize || ''}-${item.selectedColor || ''}` ? 0.5 : 1,
                        }}
                      >
                        <ListItemAvatar>
                          <Avatar
                            src={item.mainImage?.url || '/placeholder-product.jpg'}
                            variant="rounded"
                            sx={{
                              width: 90,
                              height: 90,
                              mr: 2,
                              border: `2px solid ${alpha(premiumColors.gold, 0.2)}`,
                            }}
                          />
                        </ListItemAvatar>

                        <ListItemText
                          primary={
                            <Typography
                              sx={{
                                fontWeight: 600,
                                color: premiumColors.white,
                                fontSize: '1rem',
                              }}
                            >
                              {item.name}
                            </Typography>
                          }
                          secondary={
                            <Box sx={{ mt: 1 }}>
                              <Typography variant="body2" sx={{ color: premiumColors.goldLight, fontWeight: 500 }}>
                                {item.price} TND
                              </Typography>
                              {(item.selectedSize || item.selectedColor) && (
                                <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                                  {item.selectedSize && (
                                    <Chip
                                      label={item.selectedSize}
                                      size="small"
                                      sx={{
                                        background: alpha(premiumColors.gold, 0.1),
                                        color: premiumColors.gold,
                                        height: 20,
                                        fontSize: '0.75rem',
                                      }}
                                    />
                                  )}
                                  {item.selectedColor && (
                                    <Chip
                                      label={item.selectedColor}
                                      size="small"
                                      sx={{
                                        background: alpha(premiumColors.gold, 0.1),
                                        color: premiumColors.gold,
                                        height: 20,
                                        fontSize: '0.75rem',
                                      }}
                                    />
                                  )}
                                </Box>
                              )}
                            </Box>
                          }
                        />

                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <IconButton
                              size="small"
                              onClick={() => handleQuantityChange(item, item.quantity - 1)}
                              sx={{
                                color: premiumColors.gold,
                                background: alpha(premiumColors.gold, 0.1),
                                '&:hover': {
                                  background: alpha(premiumColors.gold, 0.2),
                                },
                              }}
                            >
                              <Remove fontSize="small" />
                            </IconButton>
                            
                            <TextField
                              type="number"
                              value={item.quantity}
                              onChange={(e) => {
                                const val = parseInt(e.target.value);
                                if (!isNaN(val)) {
                                  handleQuantityChange(item, val);
                                }
                              }}
                              sx={{
                                width: 60,
                                '& .MuiInputBase-input': {
                                  color: premiumColors.white,
                                  textAlign: 'center',
                                  fontSize: '0.9rem',
                                  padding: '6px',
                                },
                                '& .MuiOutlinedInput-root': {
                                  '& fieldset': {
                                    borderColor: alpha(premiumColors.gold, 0.3),
                                  },
                                },
                              }}
                              inputProps={{ min: 1 }}
                            />
                            
                            <IconButton
                              size="small"
                              onClick={() => handleQuantityChange(item, item.quantity + 1)}
                              sx={{
                                color: premiumColors.gold,
                                background: alpha(premiumColors.gold, 0.1),
                                '&:hover': {
                                  background: alpha(premiumColors.gold, 0.2),
                                },
                              }}
                            >
                              <Add fontSize="small" />
                            </IconButton>
                          </Box>
                          
                          <Typography variant="subtitle1" sx={{ color: premiumColors.gold, fontWeight: 600 }}>
                            {(item.price * item.quantity)} TND
                          </Typography>
                          
                          <Tooltip title="Supprimer">
                            <IconButton
                              size="small"
                              onClick={() => handleRemoveWithAnimation(item)}
                              sx={{
                                color: '#ff4757',
                                '&:hover': {
                                  background: alpha('#ff4757', 0.1),
                                },
                              }}
                            >
                              <Delete fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </ListItem>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </List>

              {/* Footer */}
              <Box sx={{ p: 3, borderTop: `1px solid ${alpha(premiumColors.gold, 0.2)}` }}>
                {/* Promo Code */}
                <Collapse in={showPromo}>
                  <Box sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                      <TextField
                        fullWidth
                        size="small"
                        placeholder="Code promo"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            color: premiumColors.white,
                            '& fieldset': {
                              borderColor: alpha(premiumColors.gold, 0.3),
                            },
                          },
                        }}
                      />
                      <Button
                        variant="contained"
                        sx={{
                          background: alpha(premiumColors.gold, 0.2),
                          color: premiumColors.gold,
                          '&:hover': {
                            background: alpha(premiumColors.gold, 0.3),
                          },
                        }}
                      >
                        Appliquer
                      </Button>
                    </Box>
                    <Alert
                      severity="info"
                      icon={<Discount fontSize="small" />}
                      sx={{
                        background: alpha(premiumColors.gold, 0.05),
                        color: premiumColors.goldLight,
                        '& .MuiAlert-icon': { color: premiumColors.gold },
                      }}
                    >
                      Code promo valide: PREMIUM10 pour 10% de réduction
                    </Alert>
                  </Box>
                </Collapse>

                {/* Summary */}
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" sx={{ color: alpha(premiumColors.white, 0.7) }}>
                      Sous-total ({cartCount} article{cartCount > 1 ? 's' : ''})
                    </Typography>
                    <Typography variant="body2">{subtotal} TND</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" sx={{ color: alpha(premiumColors.white, 0.7) }}>
                      Livraison
                    </Typography>
                    <Typography variant="body2" sx={{ color: shippingCost === 0 ? premiumColors.success : 'inherit' }}>
                      7 TND
                    </Typography>
                  </Box>
                  <Divider sx={{ my: 2, background: alpha(premiumColors.gold, 0.2) }} />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="h6">Total</Typography>
                    <Typography
                      variant="h5"
                      sx={{
                        color: premiumColors.gold,
                        fontFamily: "'Playfair Display', serif",
                      }}
                    >
                      {total} TND
                    </Typography>
                  </Box>
                  
                  {!showPromo && (
                    <Button
                      startIcon={<Discount />}
                      onClick={() => setShowPromo(true)}
                      sx={{
                        color: premiumColors.gold,
                        textTransform: 'none',
                        fontSize: '0.875rem',
                      }}
                    >
                      Ajouter un code promo
                    </Button>
                  )}
                </Box>

                {/* Checkout Button */}
                <Button
                  variant="contained"
                  fullWidth
                  size="large"
                  onClick={handleCheckout}
                  endIcon={<ArrowForward />}
                  sx={{
                    background: `linear-gradient(45deg, ${premiumColors.gold}, ${premiumColors.goldDark})`,
                    color: premiumColors.noir,
                    py: 1.8,
                    fontWeight: 600,
                    fontSize: '1rem',
                    borderRadius: 2,
                    '&:hover': {
                      background: `linear-gradient(45deg, ${premiumColors.goldLight}, ${premiumColors.gold})`,
                      transform: 'translateY(-2px)',
                      boxShadow: `0 12px 30px ${alpha(premiumColors.gold, 0.4)}`,
                    },
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                >
                  Passer la commande
                </Button>

                <Typography
                  variant="caption"
                  sx={{
                    display: 'block',
                    textAlign: 'center',
                    color: alpha(premiumColors.white, 0.5),
                    mt: 2,
                  }}
                >
                  Paiement sécurisé • Retours sous 30 jours
                </Typography>
              </Box>
            </>
          )}
        </AnimatePresence>
      </Box>
    </Drawer>
  );
};

export default CartDrawer;