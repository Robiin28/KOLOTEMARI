import React from 'react';
import { useLocation } from 'react-router-dom';
import { Box, Heading, Text } from '@chakra-ui/react';

const Title = ({ title }) => {
  const location = useLocation();

  return (
    <>
      <Box className='back' padding="20px" bg="gray.50" borderBottom="1px" borderColor="gray.200">
        <Text fontSize="lg" color="gray.600">
          Home / {location.pathname.split("/")[1]}
        </Text>
        <Heading as="h1" size="xl" color="gray.800" marginTop="10px">
          {title}
        </Heading>
      </Box>
      <Box className='margin' marginY="20px"></Box>
    </>
  );
};

export default Title;
