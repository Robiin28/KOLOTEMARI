import React, { useState, useEffect } from 'react';
import {
  Box, Button, Text, Heading, VStack, Divider,
  List, ListItem, ListIcon, Select, useToast,
} from '@chakra-ui/react';
import { CheckCircleIcon } from '@chakra-ui/icons';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

const PaymentPage = () => {
  const location = useLocation();
  const cart = location.state?.cart || {};
  const cartItems = cart.items || [];
  const [currency, setCurrency] = useState('USD');
  const [conversionRates, setConversionRates] = useState({});
  const [totalAmount, setTotalAmount] = useState(0);
  const toast = useToast();
  const navigate = useNavigate();
  const studentId = cart.userId;
  const taxRate = 0.1;
  const serviceFee = 5;

  const subtotal = cartItems.reduce((sum, item) => sum + item.price, 0);
  const tax = subtotal * taxRate;

  useEffect(() => {
    const fetchConversionRates = async () => {
      try {
        const response = await axios.get('https://v6.exchangerate-api.com/v6/2122fbe8c44a46159fdd0ee0/latest/USD');
        setConversionRates(response.data.conversion_rates);
      } catch (error) {
        console.error('Error fetching conversion rates:', error);
        toast({
          title: 'Error',
          description: 'Could not fetch currency conversion rates.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    };

    fetchConversionRates();
  }, []);

  useEffect(() => {
    const rate = conversionRates[currency] || 1; // Default to 1 if the currency is not found
    const total = subtotal + tax + serviceFee;
    setTotalAmount((total * rate).toFixed(2));
  }, [currency, subtotal, tax, conversionRates]);

  const handlePayment = async () => {
    const paymentData = {
      amount: totalAmount,
      currency,
      studentId,
      courses: cartItems.map((item) => item.courseId),
    };

    try {
      const response = await axios.post('https://kolo-temari-backend-service.onrender.com/api/payments', paymentData, {
        withCredentials: true,
      });
      if (response.data.success) {
        navigate('/payment-status', {
          state: {
            checkoutUrl: response.data.checkout_url,
            tx_ref: response.data.tx_ref,
            totalAmount,
          },
        });
      } else {
        toast({
          title: 'Payment Initialization Failed',
          description: 'Please try again later.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Payment initialization error:', error.response?.data || error.message);
      toast({
        title: 'Error',
        description: 'Payment could not be processed. Please try again later.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box p={4} bg="white" minH="100vh" display="flex" alignItems="center" justifyContent="center">
      <Box p={6} minW="500px" borderWidth={1} borderRadius="md" boxShadow="lg" bg="gray.50" color="orange.400" textAlign="center">
        <Heading as="h1" size="lg" mb={6}>Payment Page</Heading>
        <VStack spacing={4} align="stretch">
          <Text fontSize="lg" fontWeight="bold">Cart Summary</Text>
          <Divider borderColor="orange.600" />
          <List spacing={3}>
            {cartItems.map(item => (
              <ListItem key={item.courseId}>
                <ListIcon as={CheckCircleIcon} color="orange.300" />
                {item.name} - ${item.price}
              </ListItem>
            ))}
          </List>
          <Divider borderColor="black" />
          <VStack spacing={2} align="start">
            <Text fontWeight="bold">Subtotal: ${subtotal.toFixed(2)}</Text>
            <Text fontWeight="bold">Tax (10%): ${tax.toFixed(2)}</Text>
            <Text fontWeight="bold">Service Fee: ${serviceFee.toFixed(2)}</Text>
            <Text fontSize="lg" fontWeight="bold">Total Amount: {currency} {totalAmount}</Text>
          </VStack>
          <Select placeholder="Select currency" value={currency} onChange={(e) => setCurrency(e.target.value)} color="black" mt={4} bg="orange.200">
            <option value="USD">USD</option>
            <option value="ETB">ETB</option>
            <option value="EUR">EUR</option>
          </Select>
        </VStack>
        <Button onClick={handlePayment} colorScheme="orange" size="lg" mt={6} w="full" bg="orange.400" _hover={{ bg: 'orange.300' }}>
          Proceed to Payment
        </Button>
      </Box>
    </Box>
  );
};

export default PaymentPage;
