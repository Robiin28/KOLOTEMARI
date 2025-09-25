import React, { useState, useEffect } from 'react';
import { SimpleGrid, HStack, Box, Text, Image, Stack, Button, Flex, Popover, PopoverTrigger, PopoverContent, PopoverBody, PopoverArrow } from '@chakra-ui/react';
import { StarIcon } from '@chakra-ui/icons';
import axios from 'axios';
import { useToast } from "@chakra-ui/react";
import axiosInstance from '../../../utils/AxiosInstance';
import Cookies from "js-cookie"

export const RelatedCourse = ({ section, isSidebarCollapsed }) => {
  const [relatedCourses, setRelatedCourses] = useState([]);
  const [userAvatar, setUserAvatar] = useState("/path/to/placeholder/avatar.png"); // Placeholder avatar
  const [user, setUser] = useState("user");
  const [courses, setCourses] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("User");
  const toast = useToast();
  
  
  
  useEffect(() => {
    const token = Cookies.get("authToken");

    if (token) {
      setIsLoggedIn(true);
      const tokenParts = token.split(".");
      if (tokenParts.length === 3) {
        try {
          const userData = JSON.parse(atob(tokenParts[1]));
          setUserName(userData.name || "User");
          setUserAvatar(userData.avatar || "/path/to/placeholder/avatar.png"); // Set the avatar from user data or use a placeholder
          fetchUserInfo(userData.id);
        } catch (error) {
          console.error("Error parsing user data:", error);
        }
      }
    }
  }, []);
  useEffect(() => {
    const fetchRelatedCourses = async () => {
      try {
        const response = await axios.get(`https://kolo-temari-backend-service.onrender.com/api/courses/${section.courseId}/related`, { withCredentials: true });
        setRelatedCourses(response.data.data.courses);
      } catch (error) {
        console.error('Error fetching related courses:', error);
      }
    };

    if (section && section.courseId) {
      fetchRelatedCourses();
    }
  }, [section]);
  const fetchUserInfo = async (userId) => {
    try {
      const response = await axiosInstance.get("auth/me");
      setUser(response.data.data.user);
      setUserAvatar(response.data.data.user.pic || userAvatar); // Adjust if avatar is in response
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  };
  const handleEnrollNow = async (course) => {
    const userId=user.id
    const courseId=course._id
    try {
            const response = await axios.post(`https://kolo-temari-backend-service.onrender.com/api/courses/${course._id}/enroll`, {
                courseId,
                userId
            }, {
                withCredentials: true,
            });
    
            if (response.data.status === 'success') {
                console.log('Successfully enrolled in the course');
                toast({
                    title: "Enrollment Successful",
                    description: "You have successfully enrolled in the course.",
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                });
            } else {
                console.error('Failed to enroll in the course:', response.data.message);
                toast({
                    title: "Enrollment Failed",
                    description: response.data.message || "An error occurred while enrolling.",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                });
            }
        } catch (error) {
            console.error('Error enrolling in course:', error.response ? error.response.data : error.message);
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
          price: course.price || 0, // Default to 0 if price is not available
      }, {
          withCredentials: true,
      });

      if (response.data.status === 'success') {
          console.log('Course added to cart successfully');
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
  } };

  return (
    <Box p={6} bg="white">
      <Text fontSize="2xl" fontWeight="bold" mb={6} color="orange.600">Related Courses</Text>
      <SimpleGrid 
        columns={{ 
          base: 1, 
          sm: 2, 
          md: 3, 
          lg: isSidebarCollapsed ? 5 : 4,
          xl: isSidebarCollapsed ? 5 : 4 
        }} 
        spacing={6}
      >
        {relatedCourses.map(course => (
          <Popover key={course.id} trigger="hover" placement="auto" strategy="fixed">
            <PopoverTrigger>
              <Box 
                borderWidth="1px"
                boxShadow="sm"
                borderRadius="sm" 
                overflow="hidden" 
                transition="transform 0.3s, box-shadow 0.3s" 
                _hover={{ transform: 'scale(1.05)', boxShadow: 'lg' }}
                borderColor="black" // Set border color to black
              >
                <Image 
                  src={course.pic} 
                  alt={course.title} 
                  objectFit="cover" 
                  height="150px" 
                  width="100%" 
                />
                <Stack spacing={3} p={3}>
                  <Text fontSize="lg" fontWeight="bold" noOfLines={2} color="black">{course.title}</Text>
                  <Flex align="center" justify="space-between">
                    <HStack align="center" justifyContent="center" gap={2}>
                      <Text fontSize="sm" mb="0" fontWeight="medium" color="gray.600">{course.rating}</Text>
                      <Flex alignItems="center" justifyContent="center">
                        {Array(5).fill('').map((_, i) => (
                          <StarIcon 
                            key={i} 
                            color={i < Math.floor(course.rating) ? 'orange.600' : 'gray.300'} // Set filled stars to orange
                          />
                        ))}
                      </Flex>
                      <Text fontSize="sm" ml={8} mb="0" color="gray.500" fontWeight="medium">{course.category}</Text>
                    </HStack>
                  </Flex>
                  <Text fontWeight="bold" style={{ color: "orange.600" }}>{course.price}</Text> {/* Set price color to orange */}
                </Stack>
              </Box>
            </PopoverTrigger>
            <PopoverContent boxShadow="lg" p={4} borderColor="gray.200" borderRadius="0">
              <PopoverArrow />
              <PopoverBody>
                <Text fontSize="lg" fontWeight="bold" mb={2} color="black">{course.title}</Text>
                <Text fontSize="md" fontWeight="bold" color="teal.500" mb={3}>{course.price}</Text>
                {course.status === 'paid' ? (
                  <Button colorScheme="orange" variant="solid" width="full" onClick={() => handleAddToCart(course)}>Add to Cart</Button> // Change button color to orange
                ) : (
                  <Button colorScheme="orange" variant="solid" width="full" onClick={() => handleEnrollNow(course)}>Enroll Now</Button> // Change button color to orange
                )}
              </PopoverBody>
            </PopoverContent>
          </Popover>
        ))}
      </SimpleGrid>
    </Box>
  );
};
