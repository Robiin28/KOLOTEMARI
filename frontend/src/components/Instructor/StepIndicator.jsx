import React from 'react';
import { Box, HStack, Flex } from '@chakra-ui/react';
import { CheckCircleIcon, InfoIcon, StarIcon, AddIcon } from '@chakra-ui/icons';

// Define step icons with smaller sizes
const stepIcons = {
  1: <AddIcon boxSize={3} />,
  2: <InfoIcon boxSize={3} />,
  3: <StarIcon boxSize={3} />,
  4: <CheckCircleIcon boxSize={3} />,
};

export const StepIndicator = ({ currentStep, onStepClick }) => {
  return (
    <Flex justify="center" align="center" width="80%" position="relative" margin="auto" mb={8}>
      {/* Continuous line behind the steps */}
      <Box
        position="absolute"
        top="50%"
        left="10%"
        width="80%"
        height="2px"
        bg="gray.300"
        zIndex={-1}
        transform="translateY(-50%)"
      />
      
      <HStack spacing={8} justify="space-between" align="center" width="100%">
        {[1, 2, 3, 4].map((num) => (
          <Box
            key={num}
            position="relative"
            display="flex"
            alignItems="center"
            justifyContent="center"
            cursor="pointer"
            onClick={() => onStepClick(num)}
          >
            <Box
              width="40px"
              height="40px"
              borderRadius="full"
              display="flex"
              alignItems="center"
              justifyContent="center"
              bg={currentStep === num ? 'blue.500' : 'white'}
              borderWidth={2}
              borderColor={currentStep === num ? 'blue.500' : 'gray.300'}
              color={currentStep === num ? 'white' : 'gray.600'}
              transition="all 0.3s"
              _hover={{ bg: 'blue.100', borderColor: 'blue.400' }}
            >
              {stepIcons[num]}
            </Box>
          </Box>
        ))}
      </HStack>
    </Flex>
  );
};
