import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Flex,
  Heading,
  Text,
  AspectRatio,
  IconButton,
  Badge,
  useToast,
} from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import axios from 'axios';
import Cookies from "js-cookie";

const FeaturedCourses = ({ section }) => {
  const [courses, setCourses] = useState([]);
  const [currentCourseIndex, setCurrentCourseIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const toast = useToast();
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = Cookies.get("authToken");
    
    if (token) {
      setIsLoggedIn(true);
      const tokenParts = token.split(".");
      if (tokenParts.length === 3) {
        try {
          const userData = JSON.parse(atob(tokenParts[1]));
          setUser(userData);
        } catch (error) {
          console.error("Error parsing user data:", error);
        }
      }
    }
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await axios.get('https://kolo-temari-backend-service.onrender.com/api/courses', {
        withCredentials: true,
      });

      if (response.data.status === 'success') {
        setCourses(response.data.data.courses);
      } else {
        setError('Failed to fetch courses.');
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
      setError(`Failed to fetch courses: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleEnrollNow = async (course) => {
    const courseId=course._id
    try {
      const response = await axios.post(`https://kolo-temari-backend-service.onrender.com/api/courses/${course._id}/enroll`, {
        courseId,
        userId: user.id,
      }, {
        withCredentials: true,
      });

      if (response.data.status === 'success') {
        toast({
          title: "Enrollment Successful",
          description: "You have successfully enrolled in the course.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      } else {
        toast({
          title: "Enrollment Failed",
          description: response.data.message || "An error occurred while enrolling.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.response ? error.response.data.message : "An unexpected error occurred.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleAddToCart = async (course) => {
    try {
      const response = await axios.post('https://kolo-temari-backend-service.onrender.com/api/cart/my', {
        courseId: course._id,
        name: course.title,
        price: course.price || 0,
      }, {
        withCredentials: true,
      });

      if (response.data.status === 'success') {
        toast({
          title: "Success!",
          description: "Course added to cart successfully.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      } else {
        toast({
          title: "Error",
          description: response.data.message || "Failed to add course to cart.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.response ? error.response.data.message : "An unexpected error occurred.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (error) {
    return <Text color="red.500">{error}</Text>;
  }

  const handleNext = () => {
    setCurrentCourseIndex((prevIndex) => (prevIndex + 1) % courses.length);
  };

  const handlePrev = () => {
    setCurrentCourseIndex((prevIndex) =>
      (prevIndex - 1 + courses.length) % courses.length
    );
  };

  return (
    <Box
      bg="white"
      borderRadius="md"
      boxShadow="lg"
      overflow="hidden"
      mt={0}
      mb={4}
      p={4}
    >
      <Flex direction="row" align="center" justify="space-between">
        <IconButton
          icon={<ChevronLeftIcon />}
          aria-label="Previous Course"
          onClick={handlePrev}
          isDisabled={courses.length === 0}
          mr={2}
          variant="outline"
          colorScheme="teal"
        />

        <Flex direction="row" flex="1" align="stretch" mx={4}>
          <Box flex="1" pr={4}>
            <AspectRatio ratio={16 / 9} width="100%">
              <iframe
                title="Course Trailer"
                src={courses[currentCourseIndex].trailer}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </AspectRatio>
          </Box>

          <Flex direction="column" flex="1" pl={4} justify="space-between">
            <Heading as="h3" size="lg" mb={2}>
              {courses[currentCourseIndex].title}
            </Heading>

            <Badge colorScheme={courses[currentCourseIndex].status === "free" ? "green" : "red"}  p={3} mb={2}>
              {courses[currentCourseIndex].status.toUpperCase()}
            </Badge>

            <Box 
              maxHeight="100px" // Set max height
              overflowY="auto"   // Enable vertical scrolling
              mb={4}            // Margin bottom
            >
              <div dangerouslySetInnerHTML={{ __html: courses[currentCourseIndex].description }} />
            </Box>

            <Text fontWeight="bold" fontSize="xl" color="orange.500" mb={4}>
              {courses[currentCourseIndex].status === "free" ? "FREE" : `$${courses[currentCourseIndex].price}`}
            </Text>

            <Button
              colorScheme="orange"
              size="lg"
              onClick={courses[currentCourseIndex].status === "free" ? () => handleEnrollNow(courses[currentCourseIndex]) : () => handleAddToCart(courses[currentCourseIndex])}
              bg="orange.400"
              color="white"
              _hover={{ bg: "orange.300" }}
              mt="auto"
            >
              {courses[currentCourseIndex].status === "free" ? "Enroll Now" : "Add to Cart"}
            </Button>
          </Flex>
        </Flex>

        <IconButton
          icon={<ChevronRightIcon />}
          aria-label="Next Course"
          onClick={handleNext}
          isDisabled={courses.length === 0}
          ml={2}
          variant="outline"
          colorScheme="teal"
        />
      </Flex>
    </Box>
  );
};

export default FeaturedCourses;
