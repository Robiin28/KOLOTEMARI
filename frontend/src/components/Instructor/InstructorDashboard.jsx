import React, { useState } from 'react';
import {
  Box,
  Flex,
  Heading,
  Button,
  Text,
  useDisclosure,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  HStack,
} from '@chakra-ui/react';
import { FaUsers, FaRegQuestionCircle } from 'react-icons/fa';
import AddQuiz from './AddQuiz';
import ManageCourse from './ManageCourse';

export const InstructorDashboard = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [courseName, setCourseName] = useState('');
  const [courseDescription, setCourseDescription] = useState('');
  const [lessonName, setLessonName] = useState('');
  const [lessonContent, setLessonContent] = useState('');

  const handleCourseSubmit = () => {
    // Logic for submitting a course
    onClose();
  };

  const handleLessonSubmit = () => {
    // Logic for submitting a lesson
    onClose();
  };

  return (
    <Flex direction="column" minHeight="100vh" bg="gray.50">
      {/* Navbar */}
      <Flex as="nav" bg="white" color="black" px="6" py="4" align="center" justify="space-between">
        <Heading size="md">Instructor Dashboard</Heading>
        <HStack spacing="4">
          <Button variant="ghost" leftIcon={<FaUsers />} colorScheme="orange">Students</Button>
          <Button variant="ghost" leftIcon={<FaRegQuestionCircle />} colorScheme="orange">Help</Button>
        </HStack>
      </Flex>

      {/* Main Content */}
      <Box flex="1" p="6" bg="white" boxShadow="md" borderRadius="md">
        <ManageCourse />
      </Box>

      {/* Drawer for Course/Lesson Form */}
      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay>
          <DrawerContent>
            <DrawerHeader borderBottomWidth="1px">
              {courseName ? 'Add New Course' : 'Add New Lesson'}
            </DrawerHeader>
            <DrawerBody>
              {courseName ? (
                <Box>
                  <FormControl mb="4">
                    <FormLabel>Course Name</FormLabel>
                    <Input value={courseName} onChange={(e) => setCourseName(e.target.value)} />
                  </FormControl>
                  <FormControl mb="4">
                    <FormLabel>Course Description</FormLabel>
                    <Textarea value={courseDescription} onChange={(e) => setCourseDescription(e.target.value)} />
                  </FormControl>
                </Box>
              ) : (
                <Box>
                  <FormControl mb="4">
                    <FormLabel>Lesson Name</FormLabel>
                    <Input value={lessonName} onChange={(e) => setLessonName(e.target.value)} />
                  </FormControl>
                  <FormControl mb="4">
                    <FormLabel>Lesson Content</FormLabel>
                    <Textarea value={lessonContent} onChange={(e) => setLessonContent(e.target.value)} />
                  </FormControl>
                </Box>
              )}
            </DrawerBody>
            <DrawerFooter>
              <Button variant="outline" mr={3} onClick={onClose}>Cancel</Button>
              <Button colorScheme="orange" onClick={courseName ? handleCourseSubmit : handleLessonSubmit}>
                Save
              </Button>
            </DrawerFooter>
          </DrawerContent>
        </DrawerOverlay>
      </Drawer>
    </Flex>
  );
};

export default InstructorDashboard;
