import React from 'react';
import { Box, Heading, Text, Button } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

const PaymentSuccessPage = () => {
  const navigate = useNavigate();

  return (
    <Box textAlign="center" py={10} px={6}>
      <Heading as="h2" size="xl" mt={6} mb={2}>
        Payment Successful!
      </Heading>
      <Text color="gray.500">
        Thank you for your payment. You have been enrolled in the courses.
      </Text>
      <Button
        colorScheme="orange"
        mt={6}
        onClick={() => navigate('/land')} // Redirect to enrolled courses
      >
        Go to My Courses
      </Button>
    </Box>
  );
};

export default PaymentSuccessPage;
