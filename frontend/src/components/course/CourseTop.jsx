import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Image,
  Text,
  Button,
  Flex,
  Heading,
  Stack,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import Cookies from "js-cookie";

export const CourseTop = () => {
  const [courses, setCourses] = useState([]); // Initialize as an empty array
  const [loading, setLoading] = useState(true); // State for loading status
  const [error, setError] = useState(null); // State for error handling
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State for user login status
  const toast = useToast(); // Toast for notifications
  const [user, setUser] = useState(null);
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
  // Fetch courses from the API
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get("https://kolo-temari-backend-service.onrender.com/api/courses");
        if (response.data && response.data.status === 'success') {
          setCourses(response.data.data.courses);
        } else {
          setError('Failed to fetch courses.');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // Check if user is logged in
  useEffect(() => {
    const token = Cookies.get("authToken");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleEnrollNow = async (course) => {
    if (!isLoggedIn) {
      toast({
        title: "Please Login",
        description: "You need to log in first to enroll in this course.",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
      return;
    }
const courseId=course._id;
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
    if (!isLoggedIn) {
      toast({
        title: "Please Login",
        description: "You need to log in first to add this course to your cart.",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

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

  // Render loading state
  if (loading) {
    return <Text color="orange.400" textAlign="center" fontSize="xl">Loading courses...</Text>;
  }

  // Render error state
  if (error) {
    return <Text color="red.500" textAlign="center" fontSize="xl">Error fetching courses: {error}</Text>;
  }

  return (
    <Box className="coursesCard" padding="40px 20px" backgroundColor="#f9f9f9">
      <Grid templateColumns="repeat(3, 1fr)" gap="40px" padding="10vh 0">
        {Array.isArray(courses) && courses.length > 0 ? (
          courses.slice(0, 6).map((val, index) => (
            <Box 
              key={index} 
              borderRadius="10px" 
              boxShadow="0 6px 12px rgba(0, 0, 0, 0.1)" 
              backgroundColor="white" 
              padding="20px" 
              transition="transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out"
              _hover={{ transform: "translateY(-10px)", boxShadow: "0 12px 24px rgba(0, 0, 0, 0.15)" }}
            >
              <Flex marginBottom="20px">
                <Box width="90px" height="90px" overflow="hidden" borderRadius="full" marginRight="20px">
                  <Image src={val.pic || "https://via.placeholder.com/90"} width="100%" height="100%" objectFit="cover" />
                </Box>
                <Stack spacing={2} flexGrow={1}>
                  <Heading as="h2" size="md" color="#333">{val.title}</Heading>
                  <Flex alignItems="center" marginBottom="10px">
                    {Array(5).fill(<i className="fa fa-star" style={{ color: "#ffd700", marginRight: "3px" }} />)}
                    <Text marginLeft="8px" color="#666">(5.0)</Text>
                  </Flex>
                  <Flex alignItems="center" marginBottom="8px">
                    <Box width="40px" height="40px" overflow="hidden" borderRadius="full" marginRight="10px">
                      <Image src="https://via.placeholder.com/40" width="100%" height="100%" objectFit="cover" />
                    </Box>
                    <Text fontSize="14px" color="#333">Instructor Name</Text>
                  </Flex>
                  <Text marginTop="8px" color="#666">Duration: N/A</Text>
                </Stack>
              </Flex>
              <Text textAlign="center" marginTop="auto" marginBottom="10px" fontSize="18px" color="#333">
                {val.status === "free" ? "Free" : val.price}
              </Text>
              <Button 
                variant="outline" 
                width="100%" 
                color="#333" 
                borderColor="#333" 
                padding="12px 24px" 
                _hover={{ backgroundColor: "#333", color: "white", borderColor: "#333" }}
                onClick={val.status === "free" ? () => handleEnrollNow(val) : () => handleAddToCart(val)}
              >
                {val.status === "free" ? "ENROLL NOW!" : "ADD TO CART"}
              </Button>
            </Box>
          ))
        ) : (
          <Text color="#666" textAlign="center">No courses available.</Text>
        )}
      </Grid>
    </Box>
  );
};
