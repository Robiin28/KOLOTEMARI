import React, { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  Text,
  Button,
  VStack,
  Image,
  Spinner,
  Flex,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Input,
  useDisclosure,
  Divider,
} from '@chakra-ui/react';
import axios from 'axios';
import SectionDetails from './SectionDetail'; // Import the SectionDetails component

const CourseDetails = ({ course, goBack }) => {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sectionTitle, setSectionTitle] = useState('');
  const [sectionOrder, setSectionOrder] =useState('');
  const { isOpen, onOpen, onClose } = useDisclosure(); // For Drawer (Add Section)
  const [selectedSection, setSelectedSection] = useState(null); // State to track the selected section
  const [showMore, setShowMore] = useState(false); // For "See More" functionality

  // Fetch sections for the course
  const fetchData = async () => {
    try {
      const response = await axios.get(`https://kolo-temari-backend-service.onrender.com/api/course/${course._id}/section`, { withCredentials: true });
      if (response.data.status === 'success') {
        const sortedSections = (response.data.data.sections || []).sort((a, b) => a.order - b.order);
        setSections(sortedSections); // Ensure sections are always sorted
      } else {
        setError('Failed to fetch sections.');
      }
    } catch (error) {
      setError(`Failed to fetch sections: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [course._id]);

  // Handle Section Click
  const handleSectionClick = (section) => {
    setSelectedSection(section);
  };

  // Handle form submission for adding a new section
  const handleAddSection = async () => {
    try {
      const newSection = {
        title: sectionTitle,
        order: sectionOrder,
        courseId: course._id, // Pass courseId to the section
      };
      const response = await axios.post(`https://kolo-temari-backend-service.onrender.com/api/course/${course._id}/section`, newSection, { withCredentials: true });
      if (response.data.status === 'success') {
        setSections((prevSections) => {
          const updatedSections = [...prevSections, response.data.data];
          return updatedSections.sort((a, b) => a.order - b.order); // Sort by order
        });
        onClose(); // Close the drawer
        setSectionTitle(''); // Reset the section title
        setSectionOrder(''); // Reset the section order
      }
    } catch (error) {
      console.error('Failed to add section:', error.message);
    }
  };

  // Handle back button from section details
  const handleBackToCourse = () => {
    setSelectedSection(null); // Clear the selected section to show the course details again
  };

  // Description toggle logic for "See More" and "See Less"
  const description = course.description || ''; // Default to empty string if description is not available
  const MAX_CHARACTERS = 500; // Limit description to 500 characters initially

  return (
    <Box p={6} maxW="1200px" mx="auto" bg="white" borderRadius="lg" boxShadow="lg">
      {/* If a section is selected, show the SectionDetails component */}
      {selectedSection ? (
        <SectionDetails section={selectedSection} goBack={handleBackToCourse} />
      ) : (
        <>
          <VStack spacing={4} align="start" mb={6}>
            <Button colorScheme="orange" variant="outline" onClick={goBack}>Back to Course List</Button>
          </VStack>
          <Heading textAlign="center" mb={4} color="orange.600">{course.title}</Heading>

          <Flex justify="center" align="center" direction={{ base: 'column', md: 'row' }} spacing={6}>
            <Image 
              width={{ base: '150px', md: '200px' }} 
              height={{ base: '150px', md: '200px' }} 
              src={course.pic} 
              borderRadius="md"
              boxShadow="sm"
              transition="0.3s"
              _hover={{ transform: 'scale(1.05)', boxShadow: 'lg' }} // Image hover effect
            />
            <Box mb={2} mt={5} ml={20}>
              <strong>Description:</strong>
              <Box mt={2}>
                <span
                  dangerouslySetInnerHTML={{
                    __html: showMore
                      ? description
                      : description.length > MAX_CHARACTERS
                      ? description.slice(0, MAX_CHARACTERS) + '...'
                      : description
                  }}
                />
                {description.length > MAX_CHARACTERS && (
                  <Button
                    variant="link"
                    colorScheme="orange"
                    onClick={() => setShowMore(!showMore)} // Toggle between showing more and less
                    mt={2}
                  >
                    {showMore ? 'See Less' : 'See More'}
                  </Button>
                )}
              </Box>
            </Box>
          </Flex>

          <Text textAlign="center" mb={6} color="black"><strong>Instructor:</strong> {course.instructor}</Text>

          <Divider borderColor="orange.300" mb={4} />

          <Heading size="md" textAlign="center" mb={4} color="orange.600">Course Sections</Heading>

          {/* Add Section Button */}
          <Flex justify="center" mb={4}>
            <Button colorScheme="orange" onClick={onOpen}>Add Section</Button>
          </Flex>

          {/* Display sections in a table */}
          {loading ? (
            <Flex justify="center" mt={8}><Spinner size="xl" color="orange.600" /></Flex>
          ) : error ? (
            <Text color="red.500" textAlign="center">{error}</Text>
          ) : sections.length > 0 ? (
            <Table variant="striped" colorScheme="orange" size="md" mx="auto">
              <Thead>
                <Tr>
                  <Th color="white">Order</Th>
                  <Th color="white">Title</Th>
                  <Th color="white">Lessons Count</Th>
                </Tr>
              </Thead>
              <Tbody>
                {sections.map((section) => (
                  <Tr
                    key={section._id}
                    onClick={() => handleSectionClick(section)}
                    cursor="pointer"
                    _hover={{ bg: 'orange.100' }} // Row hover effect
                  >
                    <Td>{section.order}</Td>
                    <Td>{section.title}</Td>
                    <Td>{section.lessons ? section.lessons.length : 0}</Td> {/* Check if lessons is defined */}
                  </Tr>
                ))}
              </Tbody>
            </Table>
          ) : (
            <Text textAlign="center">No sections available for this course.</Text>
          )}

          {/* Drawer for Adding a New Section */}
          <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="sm">
            <DrawerOverlay />
            <DrawerContent>
              <DrawerCloseButton />
              <DrawerHeader color="orange.600">Add a New Section</DrawerHeader>

              <DrawerBody>
                <Text mb={4}>Enter section details below:</Text>
                <Input
                  placeholder="Section Title"
                  value={sectionTitle}
                  onChange={(e) => setSectionTitle(e.target.value)}
                  mb={3}
                />
                <Input
                  placeholder="Order"
                  type="number"
                  value={sectionOrder}
                  onChange={(e) => setSectionOrder(e.target.value)}
                  mb={3}
                />
              </DrawerBody>

              <DrawerFooter>
                <Button variant="outline" colorScheme="orange" mr={3} onClick={onClose}>
                  Cancel
                </Button>
                <Button colorScheme="orange" onClick={handleAddSection}>Save</Button>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        </>
      )}
    </Box>
  );
};

export default CourseDetails;
