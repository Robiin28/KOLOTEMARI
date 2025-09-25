import React, { useState, useEffect } from 'react';
import { Box, Heading, Text, Spinner, Button, Flex, Stack } from '@chakra-ui/react';
import axios from 'axios';
import LessonDetails from './LessonDetals';
import AddLessonForm from './AddLessonForm'; // Import your AddLessonForm component

const SectionDetails = ({ section, goBack }) => {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [showAddLessonForm, setShowAddLessonForm] = useState(false); // State to manage lesson form visibility

  // Fetch lessons for the selected section
  const fetchLessons = async () => {
    try {
      const response = await axios.get(`https://kolo-temari-backend-service.onrender.com/api/courses/${section.courseId}/sections/${section._id}/lessons`, { withCredentials: true });
      console.log(response.data); // Log response data to verify structure
      if (response.data.status === 'success') {
        const sortedLessons = response.data.data.lessons.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)); // Sort lessons by createdAt in ascending order
        setLessons(sortedLessons);
      } else {
        setError('Failed to fetch lessons.');
      }
    } catch (error) {
      setError(`Failed to fetch lessons: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLessons();
  }, [section._id, section.courseId]);

  const handleAddLesson = (newLesson) => {
    setLessons((prevLessons) => [...prevLessons, newLesson]); // Add new lesson to the list
    setShowAddLessonForm(false); // Close the form after adding
  };

  if (loading) return <Spinner size="xl" />;

  if (error) return <Text color="red.500">{error}</Text>;

  return (
    <Box p={6}>
      {selectedLesson ? (
        <LessonDetails lesson={selectedLesson} goBack={() => setSelectedLesson(null)} />
      ) : showAddLessonForm ? (
        <AddLessonForm 
          section={section} // Pass the entire section object
          onAddLesson={handleAddLesson} 
          onCancel={() => setShowAddLessonForm(false)} 
        />
      ) : (
        <>
          <Text as="button" mt={4} color="blue.600" fontSize="lg" onClick={goBack} fontWeight="bold">
            ← Back to Course Details
          </Text>

          <Box mt={6} mb={4}>
            <Heading as="h2" fontSize="2xl" color="orange.600">
              Section {section.order}: {section.title}
            </Heading>
            <Text color="gray.600" mt={2}>
              {section.description || 'No description provided for this section.'}
            </Text>
          </Box>

          <Heading as="h3" fontSize="xl" mt={6} color="black">
            Lessons
          </Heading>

          {lessons.length > 0 ? (
            <Stack spacing={4} mt={4}>
              {lessons.map((lesson) => (
                <Box
                  key={lesson._id}
                  p={4}
                  borderWidth={1}
                  borderRadius="md"
                  cursor="pointer"
                  _hover={{ bg: 'gray.50', transform: 'scale(1.02)', transition: '0.2s ease-in-out' }}
                  onClick={() => setSelectedLesson(lesson)}
                  shadow="sm"
                >
                  <Text fontSize="lg" fontWeight="bold" color="black">
                    Lesson: {lesson.title}
                  </Text>
                </Box>
              ))}
            </Stack>
          ) : (
            <Text mt={4} color="gray.600">
              No lessons available in this section.
            </Text>
          )}

          {/* Add Lesson Button */}
          <Flex mt={8} justify="center">
            <Button colorScheme="orange" size="lg" onClick={() => setShowAddLessonForm(true)}>
              Add Lesson
            </Button>
          </Flex>
        </>
      )}
    </Box>
  );
};

export default SectionDetails;
