import React from 'react';
import { Box, Flex, Text, Link, Stack, Divider, useBreakpointValue } from '@chakra-ui/react';

export const Footer = () => {
  const columnSize = useBreakpointValue({ base: "full", md: "1/4" });

  return (
    <Box bg="black" color="white" py={10} px={4}>
      <Stack spacing={10} maxW="1200px" mx="auto" direction={{ base: "column", md: "row" }} align="start">
        {/* Company Info */}
        <Box flex={1}>
          <Text fontSize="lg" fontWeight="bold" mb={4}>
            Company
          </Text>
          <Stack spacing={3}>
            <Link href="#" _hover={{ textDecoration: 'underline' }}>
              About Us
            </Link>
            <Link href="#" _hover={{ textDecoration: 'underline' }}>
              Careers
            </Link>
            <Link href="#" _hover={{ textDecoration: 'underline' }}>
              Press
            </Link>
            <Link href="#" _hover={{ textDecoration: 'underline' }}>
              Blog
            </Link>
          </Stack>
        </Box>

        {/* Support */}
        <Box flex={1}>
          <Text fontSize="lg" fontWeight="bold" mb={4}>
            Support
          </Text>
          <Stack spacing={3}>
            <Link href="#" _hover={{ textDecoration: 'underline' }}>
              Help Center
            </Link>
            <Link href="#" _hover={{ textDecoration: 'underline' }}>
              Contact Us
            </Link>
            <Link href="#" _hover={{ textDecoration: 'underline' }}>
              Terms of Service
            </Link>
            <Link href="#" _hover={{ textDecoration: 'underline' }}>
              Privacy Policy
            </Link>
          </Stack>
        </Box>

        {/* Connect */}
        <Box flex={1}>
          <Text fontSize="lg" fontWeight="bold" mb={4}>
            Connect
          </Text>
          <Stack spacing={3}>
            <Link href="#" _hover={{ textDecoration: 'underline' }}>
              Facebook
            </Link>
            <Link href="#" _hover={{ textDecoration: 'underline' }}>
              Twitter
            </Link>
            <Link href="#" _hover={{ textDecoration: 'underline' }}>
              Instagram
            </Link>
            <Link href="#" _hover={{ textDecoration: 'underline' }}>
              LinkedIn
            </Link>
          </Stack>
        </Box>

        {/* Newsletter */}
        <Box flex={1}>
          <Text fontSize="lg" fontWeight="bold" mb={4}>
            Newsletter
          </Text>
          <Text mb={4}>
            Subscribe to our newsletter for the latest updates and offers.
          </Text>
          <Stack spacing={3}>
            <input 
              type="email" 
              placeholder="Your email address" 
              style={{ 
                padding: '8px', 
                borderRadius: '4px', 
                border: '1px solid gray', 
                width: '100%' 
              }}
            />
            <button 
              style={{ 
                padding: '8px', 
                backgroundColor: '#f68a1f', 
                border: 'none', 
                borderRadius: '4px', 
                color: 'white', 
                cursor: 'pointer',
                width: '100%'
              }}
            >
              Subscribe
            </button>
          </Stack>
        </Box>
      </Stack>

      <Divider my={6} borderColor="gray.600" />

      <Flex direction="column" align="center">
        <Text fontSize="sm" mb={2}>
          © {new Date().getFullYear()}  BM Technology. All rights reserved.
        </Text>
        <Text fontSize="sm">
          Kolo Temari
        </Text>
      </Flex>
    </Box>
  );
};

export default Footer;
