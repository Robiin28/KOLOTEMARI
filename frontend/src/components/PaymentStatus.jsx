import React, { useState } from 'react';
import { Box, Button, Heading, Text, Spinner, useToast, Flex } from '@chakra-ui/react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { HiCreditCard } from 'react-icons/hi'; // Payment icon

const PaymentStatus = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { checkoutUrl, totalAmount, tx_ref } = location.state || {};
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleCheckout = () => {
    window.open(checkoutUrl, '_blank');
  };

  const handleVerifyPayment = async () => {
    setLoading(true);
    try {
      const response = await axios.post('https://kolo-temari-backend-service.onrender.com/api/payments/success', {
        tx_ref,
      }, { withCredentials: true });

      if (response.data.success) {
        toast({
          title: 'Payment Verified',
          description: 'Your payment has been successfully verified.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        navigate('/payment-success', {
          state: {
            paymentDetails: response.data.data,
          },
        });
      } else {
        toast({
          title: 'Verification Failed',
          description: 'Unable to verify payment. Please try again.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Error verifying payment:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'An error occurred while verifying the payment.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Flex
      direction="column"
      justify="center"
      align="center"
      minHeight="100vh"
      bg="gray.50"
    >
      <Box
        p={6}
        maxWidth="600px"
        width="100%"
        borderWidth="1px"
        borderRadius="lg"
        boxShadow="lg"
        bg="white"
        textAlign="center"
      >
        <Box 
          fontSize="50px" 
          color="orange.600" 
          mb={4}
        >
          <HiCreditCard />
        </Box>
        <Heading as="h2" size="lg" color="black">Payment Status</Heading>
        <Text fontSize="lg" mt={4} fontWeight="bold" color="black">
          Total Amount: ${totalAmount}
        </Text>
        <Box mt={4}>
          <Button
            colorScheme="orange"
            variant="outline"
            onClick={handleCheckout}
            mr={4}
          >
            Checkout
          </Button>
          <Button
            colorScheme="orange"
            onClick={handleVerifyPayment}
            isLoading={loading}
          >
            Verify Payment
          </Button>
        </Box>
        {loading && <Spinner mt={4} />}
      </Box>
    </Flex>
  );
};

export default PaymentStatus;
