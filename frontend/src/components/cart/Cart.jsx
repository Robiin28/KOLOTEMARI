import React, { useState, useEffect } from 'react';
import './cart.css';
import { FaStar, FaDollarSign } from 'react-icons/fa';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

export const Cart = () => {
  const [cart, setCart] = useState(null); // Store the entire cart object
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Initialize useNavigate

  const handleRemoveItem = (id) => {
    if (cart) {
      setCart({
        ...cart,
        items: cart.items.filter(item => item._id !== id),
      });
    }
  };

  const handleCheckout = () => {
    // Navigate to payment page and pass the entire cart as state
    if (cart) {
      navigate('/pay', { state: { cart } }); // Pass the whole cart
    }
  };

  const totalPrice = cart ? cart.items.reduce((total, item) => total + item.price, 0) : 0;

  useEffect(() => {
    const fetchCartData = async () => {
      try {
        const response = await axios.get('https://kolo-temari-backend-service.onrender.com/api/cart/my', {
          withCredentials: true
        });
        setCart(response.data.data.cart); // Set the whole cart
      } catch (err) {
        setError('Failed to fetch cart data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCartData();
  }, []);

  if (loading) {
    return <p>Loading your cart...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!cart || cart.items.length === 0) {
    return <p>Your cart is empty.</p>;
  }

  return (
    <div className="cart-page">
      <h1>Your Shopping Cart</h1>
      <div className="cart-content">
        <div className="cart-items">
          {cart.items.map((item) => (
            <div key={item._id} className="cart-item">
              <img src={item.courseId.pic} alt={item.name} className="item-image" />
              <div className="item-details">
                <h2 className="item-title">{item.name}</h2>
                <p className="item-description">{item.courseId.instructor}</p>
                <div className="item-info">
                  <span className="item-rating">
                    {[...Array(5)].map((_, i) => (
                      <FaStar
                        key={i}
                        className={i < Math.round(item.rating) ? 'star-filled' : 'star-empty'}
                      />
                    ))}
                    {item.rating}
                  </span>
                </div>
                <div className="item-price-actions">
                  <div className="item-price">
                    <FaDollarSign className="price-icon" />
                    ${item.price.toFixed(2)}
                  </div>
                  <div className="item-actions">
                    <a
                      href="#remove"
                      className="remove-link"
                      onClick={(e) => {
                        e.preventDefault();
                        handleRemoveItem(item._id);
                      }}
                    >
                      Remove from Cart
                    </a>
                    <a href="#watch" className="watch-link">Watch it for Later</a>
                  </div>
                </div>
                <div className="item-details-bottom">
                  <div className="item-bottom-info">
                    <span className="item-hours">Hours: {item.courseId.hours}</span>
                    <span className="item-level">Level: {item.courseId.level}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="cart-summary">
          <div className="cart-summary-content">
            <div>
              <h2>Total</h2>
              <p className="total-price">${totalPrice.toFixed(2)}</p>
            </div>
            <button className="payment-button" onClick={handleCheckout}>
              CheckOut
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
