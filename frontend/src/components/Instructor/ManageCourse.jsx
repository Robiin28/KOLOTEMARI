import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Button,
  Heading,
  Text,
  VStack,
  Spinner,
  Alert,
  AlertIcon,
  Flex,
  Image,
  useToast,
  SimpleGrid,
  Card,
  CardBody,
  CardFooter,
} from '@chakra-ui/react';
import { AddIcon, EditIcon, DeleteIcon } from '@chakra-ui/icons';
import CourseForm from './CourseForm';
import CourseDetails from './CourseDetails.';

const ManageCourses = () => {
  const [showCourseForm, setShowCourseForm] = useState(false);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showLoader, setShowLoader] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const toast = useToast();

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await axios.get('https://kolo-temari-backend-service.onrender.com/api/courses', { withCredentials: true });
      if (response.data.status === 'success') {
        setCourses(response.data.data.courses);
      } else {
        setError('Failed to fetch courses.');
      }
    } catch (error) {
      setError(`Failed to fetch courses: ${error.message}`);
    } finally {
      setLoading(false);
      setShowLoader(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const toggleForm = () => {
    setShowCourseForm((prev) => !prev);
    setSelectedCourse(null);
  };

  const handleFormSubmit = () => {
    toggleForm();
    fetchCourses();
    toast({
      title: "Course saved.",
      description: "Your course has been successfully saved.",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  const handleEditClick = (course) => {
    setSelectedCourse(course);
    toggleForm();
  };

  const handleCourseClick = (course) => {
    setSelectedCourse(course);
    setShowDetails(true);
  };

  const handleGoBack = () => {
    setShowDetails(false);
    setSelectedCourse(null);
  };

  return (
    <Box p={4} bg="gray.100" borderRadius="md" boxShadow="lg" minHeight="100vh">
      {showCourseForm ? (
        <CourseForm
          toggleForm={toggleForm}
          onSubmitSuccess={handleFormSubmit}
          initialData={selectedCourse}
        />
      ) : showDetails && selectedCourse ? (
        <CourseDetails course={selectedCourse} goBack={handleGoBack} />
      ) : (
        <>
          <Heading mb={4} textAlign="center" color="orange.700">Manage Courses</Heading>
          <Text mb={4} fontSize="lg" color="gray.600" textAlign="center">Manage all your courses here.</Text>
          <Button
            leftIcon={<AddIcon />}
            colorScheme="orange"
            onClick={toggleForm}
            mb={4}
            size="lg"
            display="block"
            mx="auto"
            _hover={{ bg: "orange.600" }}
          >
            Add New Course
          </Button>

          {showLoader ? (
            <Flex
              height="100vh"
              width="100%"
              align="center"
              justify="center"
              position="absolute"
              top={0}
              left={0}
              bg="rgba(255, 255, 255, 0.8)"
              zIndex={10}
            >
              <Spinner size="lg" color="blue.500" />
            </Flex>
          ) : (
            <>
              {error && (
                <Alert status="error" mb={4}>
                  <AlertIcon />
                  {error}
                </Alert>
              )}

              <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={4}>
                {courses.map((course) => (
                  <Card
                    key={course.id}
                    borderWidth={1}
                    borderRadius="md"
                    boxShadow="md"
                    bg="white"
                    transition="transform 0.3s ease, box-shadow 0.3s ease"
                    _hover={{
                      boxShadow: "xl",
                      transform: "scale(1.05)",
                      bg: "orange.50",
                    }}
                    cursor="pointer"
                    onClick={() => handleCourseClick(course)} // Make card clickable to show details
                  >
                    <Image
                      src={course.pic}
                      alt={course.title}
                      borderTopRadius="md"
                      height="200px" // Increased image size
                      objectFit="cover"
                    />
                    <CardBody p={4}>
                      <VStack align="start" spacing={1}>
                        <Heading size="md" fontSize="lg" color="orange.700">{course.title}</Heading>
                        <Text fontSize="sm" color="gray.700">Instructor: {course.instructor}</Text>
                        <Text fontSize="sm" color="gray.600">Lessons: {course.lessonsCount}</Text>
                      </VStack>
                    </CardBody>
                    <CardFooter justifyContent="space-between" p={4}>
                      <Button
                        colorScheme="orange"
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent click on card
                          handleEditClick(course);
                        }}
                        leftIcon={<EditIcon />}
                        size="sm"
                        _hover={{ bg: "orange.600" }}
                      >
                        Edit
                      </Button>
                      <Button
                        colorScheme="red"
                        leftIcon={<DeleteIcon />}
                        size="sm"
                        _hover={{ bg: "red.400" }}
                      >
                        Delete
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </SimpleGrid>
            </>
          )}
        </>
      )}
    </Box>
  );
};

export default ManageCourses;
