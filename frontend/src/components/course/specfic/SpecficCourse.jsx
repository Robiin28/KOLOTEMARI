import React, { useState } from 'react';
import {
  Tabs, TabList, TabPanels, Tab, TabPanel,
  Box, Flex, Text, Button, Image, Avatar, Divider, VStack, HStack, Card, CardHeader, CardBody, Grid,
  Spacer
} from '@chakra-ui/react';
import { InfoIcon, TimeIcon, StarIcon, ViewIcon, TriangleUpIcon, CheckIcon } from '@chakra-ui/icons';

export const SpecficCourse = () => {
  const [selectedTab, setSelectedTab] = useState(0);

  const handleTabChange = (index) => {
    setSelectedTab(index);
  };

  return (
    <Box p={0}>
      {/* Top section with course details and image */}
      <Grid
  templateColumns={{ base: '1fr', md: '2fr 1fr' }}
  gap={4}
  mb={3}
  p={5}
  bg="orange.500"
  borderRadius="0"
  boxShadow="md"
>
  <Box>
    <Text fontSize={{ base: 'lg', md: 'xl' }} fontWeight="bold" color="teal.500" mb={2}>
      Free
    </Text>
    <Text fontSize={{ base: '2xl', md: '3xl' }} fontWeight="bold" mb={2}>
      Environmental Course
    </Text>
    <Text fontSize={{ base: 'md', md: 'lg' }} color="gray.700" mb={4}>
      Start developing with Large Language Models using Google AI Studio and the Gemini API...
    </Text>
    <Spacer h={8}/>
    <Button
      bg="black"
      color="white"
      size="lg"
      _hover={{ bg: 'gray.800' }}
      alignSelf={{ base: 'center', md: 'start' }}
    >
      Enroll Now!
    </Button>
  </Box>
  <Image
    src="/image/real.png"
    alt="Course Image"
    borderRadius="lg"
    boxShadow="md"
    width="100%"
    maxH="250px"
    objectFit="cover"
  />
</Grid>


      {/* Additional course details */}
      <Box mb={8} p={8} bg="red.500">
        <HStack spacing={6} mb={4}>
          <Text fontWeight="bold" color="teal.600">Beginner</Text>
          <Text fontWeight="bold">55hr</Text>
          <Text fontWeight="bold">Certificate</Text>
          <Text fontWeight="bold">Updated on July</Text>
        </HStack>
        <Box>
          <Text fontWeight="bold" fontSize="lg" mb={2}>Skills you will learn:</Text>
          <Text mb={4} color="gray.700">Large Language Models • Gemini API • Google AI Studio</Text>
          <Text fontWeight="bold" fontSize="lg" mb={2}>Prerequisites:</Text>
          <Text fontSize="md" color="gray.600">Intermediate Python</Text>
        </Box>
      </Box>

      {/* Main content with tabs and sidebar */}
      <Grid templateColumns={{ base: '1fr', md: '3fr 1fr' }} gap={8}>
        {/* Left side with tabs and content */}
        <Box>
          <Text fontSize="4xl" fontWeight="bold" mb={4}>Environmental Science</Text>
          <Box mb={6}>
            <Text fontSize="sm" color="gray.600">Teacher</Text>
            <Text fontSize="lg" fontWeight="bold" mb={2}>Yared Ekubay</Text>
            <Flex align="center" mt={2}>
              <InfoIcon color="teal.500" />
              <Box ml={3}>
                <Text fontSize="sm" color="gray.600">Category</Text>
                <Text>SCIENCE ENVIRONMENTAL</Text>
              </Box>
            </Flex>
          </Box>
          <Tabs index={selectedTab} onChange={handleTabChange} variant="enclosed" colorScheme="teal">
            <TabList>
              <Tab>Description</Tab>
              <Tab>Curriculum</Tab>
              <Tab>Reviews</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <VStack align="start" spacing={6}>
                  <Text color="gray.700">
                    Ce cours explorera le baseball à travers le prisme de la race, du sexe et de la culture...
                  </Text>
                  <Text fontWeight="bold" mb={2}>Course Appendices</Text>
                  <Divider mb={4} />
                  <ul style={{ paddingLeft: '20px', color: 'gray.700' }}>
                    <li>Comprenez comment le baseball éclaire l’histoire des relations raciales.</li>
                    <li>Analysez les défis auxquels sont confrontées les femmes dans le sport et en Amérique.</li>
                    <li>Minez la façon dont le baseball reflète la culture américaine.</li>
                  </ul>
                </VStack>
              </TabPanel>
              <TabPanel>
                <VStack align="start" spacing={6}>
                  <Text fontWeight="bold">Chapter 1: Water Sanitation</Text>
                  <Flex justify="space-between" w="full">
                    <HStack spacing={3}>
                      <Text>1</Text>
                      <InfoIcon color="teal.500" />
                      <Text>Introduction</Text>
                    </HStack>
                    <HStack spacing={3}>
                      <TimeIcon color="teal.500" />
                      <Text>30:00 min</Text>
                    </HStack>
                  </Flex>
                  {/* Add more chapters similarly */}
                </VStack>
              </TabPanel>
              <TabPanel>
                <Text mb={2} color="gray.700">Be the first to add a review.</Text>
                <Text color="gray.600">Please, <a href="#" style={{ color: 'teal.500' }}>login</a> to leave a review.</Text>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>

        {/* Right sidebar with additional info and options */}
        <Box 
          bg="gray.50" 
          p={2} 
          borderRadius="lg" 
          boxShadow="sm" 
          minW="450px" 
          w="full"
        >
          <Box mb={2}>
            <Button 
              leftIcon={<StarIcon />} 
              variant="outline" 
              colorScheme="teal" 
              w="full"
            >
              Add to wishlist
            </Button>
          </Box>
          <Button 
            colorScheme="teal" 
            size="lg" 
            w="full" 
            href="/lesson"
          >
            GET COURSE
          </Button>
          <Box mt={6}>
            <VStack spacing={0} align="start">
              <Flex justify="space-between" w="full">
                <Text fontWeight="bold">Enrolled:</Text>
                <Text>2 students</Text>
                <ViewIcon color="teal.500" />
              </Flex>
              <Divider />
              <Flex justify="space-between" w="full">
                <Text fontWeight="bold">Duration:</Text>
                <Text>1 month</Text>
                <TimeIcon color="teal.500" />
              </Flex>
              <Divider />
              <Flex justify="space-between" w="full">
                <Text fontWeight="bold">Lectures:</Text>
                <Text>11</Text>
                <CheckIcon color="teal.500" />
              </Flex>
              <Divider />
              <Flex justify="space-between" w="full">
                <Text fontWeight="bold">Video:</Text>
                <Text>5:00 min</Text>
                <TriangleUpIcon color="teal.500" />
              </Flex>
              <Divider />
              <Flex justify="space-between" w="full">
                <Text fontWeight="bold">Level:</Text>
                <Text>Beginner</Text>
                <StarIcon color="teal.500" />
              </Flex>
            </VStack>
          </Box>

          <Box mt={2} p={4} maxH="480px" overflow="hidden" borderRadius="md" boxShadow="sm" bg="white">
  {['HTML', 'CSS', 'JavaScript'].map((title, idx) => (
    <Box key={idx} mb={3} borderBottom="1px solid" borderColor="gray.200" pb={3}>
      <Flex align="center" mb={2}>
        <Avatar name={title} size="sm" />
        <Box ml={3} fontSize="sm">
          <Text fontWeight="bold" noOfLines={1}>{title}</Text>
          <Text fontSize="xs" color="gray.500" noOfLines={1}>BY Yared Ekubay</Text>
        </Box>
      </Flex>
      <Button colorScheme="teal" size="sm" w="full" variant="solid" py={1}>
        Free
      </Button>
    </Box>
  ))}
</Box>








          <Box mt={5} p={0}>
            <Text fontWeight="bold" mb={2}>Working Hours</Text>
            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((day) => (
              <Flex key={day} justify="space-between" mb={1}>
                <Text>{day}</Text>
                <Text>9:30 am - 6:00 pm</Text>
              </Flex>
            ))}
            {['Saturday', 'Sunday'].map((day) => (
              <Flex key={day} justify="space-between" mb={1}>
                <Text>{day}</Text>
                <Text color="red.500">Closed</Text>
              </Flex>
            ))}
          </Box>
        </Box>
      </Grid>
    </Box>
  );
};
