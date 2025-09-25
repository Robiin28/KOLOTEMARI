import React, { useState } from 'react';
import {
  Box,
  Heading,
  Text,
  Spinner,
  Button,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Input,
  Textarea,
} from '@chakra-ui/react';
import axios from 'axios';
import AddQuiz from './AddQuiz'; // Import the AddQuiz component

const LessonDetails = ({ lesson, goBack }) => {
  const [editLesson, setEditLesson] = useState(false);
  const [updatedTitle, setUpdatedTitle] = useState(lesson.title);
  const [updatedContent, setUpdatedContent] = useState(lesson.content);
  const [loading, setLoading] = useState(false);
  const [showAddQuiz, setShowAddQuiz] = useState(false);

  // Handle CRUD operations
  const handleUpdateLesson = async () => {
    setLoading(true);
    try {
      const response = await axios.put(`https://kolo-temari-backend-service.onrender.com/api/lessons/${lesson._id}`, { 
        title: updatedTitle, 
        content: updatedContent 
      },{withCredentials: true});
      if (response.data.status === 'success') {
        // Handle successful update
        setEditLesson(false);
      } else {
        // Handle error
      }
    } catch (error) {
      // Handle error
    } finally {
      setLoading(false);
    }
  };

  const handleAddQuiz = () => {
    setShowAddQuiz(true);
  };

  if (loading) return <Spinner size="xl" />;

  return (
    <Box p={6} maxW="1200px" mx="auto">
      {/* Show AddQuiz component if showAddQuiz is true */}
      {showAddQuiz ? (
        <AddQuiz lessonId={lesson._id} onClose={() => setShowAddQuiz(false)} />
      ) : (
        <>
          {/* Show lesson details and other elements */}
          <Button colorScheme="blue" onClick={goBack}>Back to Section</Button>
          <Heading mt={4}>{lesson.title}</Heading>
          <div dangerouslySetInnerHTML={{ __html: lesson.content}} />
           

          {/* Tabs for managing lesson */}
          <Tabs mt={6}>
            <TabList>
              <Tab>Details</Tab>
              <Tab>Video</Tab>
              <Tab>Resources</Tab>
              <Tab>Quizzes</Tab>
              <Tab>Students</Tab>
            </TabList>

            <TabPanels>
              <TabPanel>
                <Heading size="md">Lesson Details</Heading>
                <div dangerouslySetInnerHTML={{ __html: lesson.description }} />
                <div dangerouslySetInnerHTML={{ __html: lesson.content }} />
           
                
                {/* Button to open edit modal */}
                <Button mt={4} colorScheme="teal" onClick={() => setEditLesson(true)}>Edit Lesson</Button>

                {/* Edit Lesson Modal */}
                {editLesson && (
                  <Box mt={6} p={4} borderWidth={1} borderRadius="md">
                    <Input
                      placeholder="Title"
                      value={updatedTitle}
                      onChange={(e) => setUpdatedTitle(e.target.value)}
                      mb={3}
                    />
                    <Textarea
                      placeholder="Content"
                      value={updatedContent}
                      onChange={(e) => setUpdatedContent(e.target.value)}
                      mb={3}
                    />
                    <Button colorScheme="teal" onClick={handleUpdateLesson}>Save</Button>
                    <Button ml={3} onClick={() => setEditLesson(false)}>Cancel</Button>
                  </Box>
                )}
              </TabPanel>

              <TabPanel>
                <Heading size="md">Video</Heading>
                <Text mt={2}><strong>Video URLs:</strong> {lesson.videoUrls.join(', ')}</Text>
                <Text mt={2}><strong>Image:</strong></Text>
                <img src={lesson.pic} alt={lesson.title} style={{ maxWidth: '100%', height: 'auto' }} />
              </TabPanel>

              <TabPanel>
                <Heading size="md">Resources</Heading>
                {lesson.resource}
                <Button colorScheme="teal">Add Resource</Button>
              </TabPanel>

              <TabPanel>
                <Heading size="md">Quizzes</Heading>
                <Button colorScheme="teal" onClick={handleAddQuiz}>Add Quiz</Button>
              </TabPanel>

              <TabPanel>
                <Heading size="md">Students</Heading>
                {/* List students */}
                <Text mt={2}>List of students enrolled in this lesson will be displayed here.</Text>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </>
      )}
    </Box>
  );
};

export default LessonDetails;
