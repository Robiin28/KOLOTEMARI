import React, { useState, useEffect } from "react";
import {
  Box,
  Heading,
  Text,
  Image,
  VStack,
  HStack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Badge,
  Divider,
  Icon,
} from "@chakra-ui/react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { CheckCircleIcon } from "@chakra-ui/icons";

const CourseDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { enrollment } = location.state;

  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const courseId = enrollment.course._id;

  // Fetch sections from the API
  useEffect(() => {
    const fetchSections = async () => {
      try {
        const response = await axios.get(`https://kolo-temari-backend-service.onrender.com/api/course/${courseId}/section`, { withCredentials: true });
        
        if (response.data.status === "success") {
          setSections(response.data.data.sections);
        } else {
          setError("Failed to fetch course sections.");
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Error fetching sections:", error);
        setError("Failed to fetch course sections.");
        setLoading(false);
      }
    };

    fetchSections();
  }, [courseId]);

  if (!enrollment) {
    return <Text>No enrollment data available.</Text>;
  }

  // Navigate to the learn page with lesson and section data
  const handleLessonClick = (lesson, section) => {
    navigate('/learn', { state: { section } });
  };

  return (
    <Box maxW="1200px" mx="auto" p={6} bg="white" color="black">
      {/* Course Header */}
      <Box bg="orange.200" p={6} borderRadius="md">
        <HStack spacing={6}>
          <Image
            boxSize="150px"
            borderRadius="full"
            src={enrollment.course.pic}
            alt={"Course Image"}
          />
          <VStack align="start">
            <Heading size="lg">{enrollment.course.title}</Heading>
            <Text fontSize="md">
              <strong>Instructor:</strong> {enrollment.course.instructor || "N/A"}
            </Text>
          </VStack>
        </HStack>
        <HStack spacing={4} mt={4}>
          <Badge colorScheme="blue">Level</Badge>
          <Text>
            <strong>Duration:</strong> {enrollment.course.duration || "N/A"}
          </Text>
        </HStack>
      </Box>

      {/* Course Description */}
      <Box mt={6} bg="white" p={6} borderRadius="md" shadow="md">
        <Heading size="md" mb={4}>
          Course Description
        </Heading>
        <Text dangerouslySetInnerHTML={{ __html: enrollment.course.description }}></Text>
      </Box>

      {/* Course Syllabus */}
      <Box mt={8}>
        <Heading size="lg" mb={4}>
          Course Content
        </Heading>
        {loading ? (
          <Text>Loading sections...</Text>
        ) : error ? (
          <Text color="red.500">{error}</Text>
        ) : (
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Chapter</Th>
                <Th>Lesson</Th>
                <Th>Status</Th>
              </Tr>
            </Thead>
            <Tbody>
              {sections
                .sort((a, b) => a.order - b.order) // Sort sections by order
                .map((section) => (
                  <Tr key={section._id}>
                    <Td>{section.title}</Td>
                    <Td>
                      {section.lessons && section.lessons.length > 0 ? (
                        <Text
                          cursor="pointer"
                          color="blue.500"
                          onClick={() => handleLessonClick(section.lessons[0], section)}
                        >
                          {section.lessons.length} Lessons
                        </Text>
                      ) : (
                        'No Lessons Available'
                      )}
                    </Td>
                    <Td>
                      {section.lessons && section.lessons.length > 0 ? (
                        <Badge colorScheme="green">Lessons Available</Badge>
                      ) : (
                        <Badge colorScheme="red">Not Available</Badge>
                      )}
                    </Td>
                  </Tr>
                ))}
            </Tbody>
          </Table>
        )}

        {/* Start/Continue Button */}
        <Button
          colorScheme="orange"
          mt={4}
          onClick={() => handleLessonClick(sections[0].lessons[0], sections[0])} // Start from the first section and lesson
          width="full"
        >
          Start/Continue Course
        </Button>
      </Box>

      {/* Additional Resources */}
      <Box mt={8}>
        <Heading size="lg" mb={4}>
          Give Us Feedback
        </Heading>
        <VStack align="start">
          {/* Add feedback form or resources here */}
        </VStack>
      </Box>

      {/* Feedback Section */}
      <Divider my={8} />
      <Box>
        <Heading size="md" mb={4}>
          List of Certificates
        </Heading>
        <Text>
          <strong>Certificate:</strong>{" "}    
        </Text>
        <Text mt={2}>
          <strong>Achievements:</strong>{" "}
        </Text>
      </Box>
    </Box>
  );
};

export default CourseDetail;
