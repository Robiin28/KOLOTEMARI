import React, { useState } from 'react';
import {
  Box,
  Flex,
  Heading,
  Button,
  Tabs,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Input,
  Textarea,
  FormControl,
  FormLabel,
  useDisclosure,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  IconButton,
  VStack,
  HStack,
  Text,
  Spacer,
} from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import {
  FaBook,
  FaChalkboardTeacher,
  FaUsers,
  FaPlusSquare,
  FaTasks,
  FaThList,
  FaListUl,
  FaRegQuestionCircle,
} from 'react-icons/fa';
import AddQuiz from './components/Instructor/AddQuiz'

export const InstructorDashboard = () => {
  const [selectedContent, setSelectedContent] = useState('courses'); // Manage which content is shown
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [courseName, setCourseName] = useState('');
  const [courseDescription, setCourseDescription] = useState('');
  const [lessonName, setLessonName] = useState('');
  const [lessonContent, setLessonContent] = useState('');

  // Handlers for course and lesson forms
  const handleCourseSubmit = () => {
    // Logic for submitting a course
    onClose();
  };

  const handleLessonSubmit = () => {
    // Logic for submitting a lesson
    onClose();
  };

  // Render content dynamically based on selected sidebar option
  const renderContent = () => {
    switch (selectedContent) {
      case 'courses':
        return (
          <>
            <Heading size="lg" mb="6">Manage Your Courses</Heading>
            <Tabs variant="enclosed">
              <TabList>
                <Tab>Courses</Tab>
                <Tab>Lessons</Tab>
              </TabList>
              <TabPanels>
                {/* Courses Panel */}
                <TabPanel>
                  <Button leftIcon={<AddIcon />} colorScheme="orange" onClick={onOpen}>
                    Add New Course
                  </Button>
                  {/* Course Management Content */}
                  {/* Add your course list and management functionality here */}
                </TabPanel>
                {/* Lessons Panel */}
                <TabPanel>
                  <Button leftIcon={<AddIcon />} colorScheme="orange" onClick={onOpen}>
                    Add New Lesson
                  </Button>
                  {/* Lesson Management Content */}
                  {/* Add your lesson list and management functionality here */}
                </TabPanel>
              </TabPanels>
            </Tabs>
          </>
        );
      case 'add-lessons':
        return (
          <>
            <Heading size="lg" mb="6">Add Lessons</Heading>
            {/* Add Lessons Content */}
          </>
        );
      case 'manage-sections':
        return (
          <>
            <Heading size="lg" mb="6">Manage Sections</Heading>
            {/* Manage Sections Content */}
          </>
        );
      case 'view-lessons':
        return (
          <>
            <Heading size="lg" mb="6">View Lessons</Heading>
            {/* View Lessons Content */}
          </>
        );
      case 'add-materials':
        return (
          <>
            <Heading size="lg" mb="6">Add Learning Materials</Heading>
            {/* Add Learning Materials Content */}
          </>
        );
      case 'add-quizzes':
        return (
          <>
            <AddQuiz />
          </>
        );
      default:
        return (
          <Text fontSize="lg">Welcome to the Instructor Dashboard</Text>
        );
    }
  };

  return (
    <Flex direction="column" minHeight="100vh">
      {/* Navbar */}
      <Flex as="nav" bg="black" color="white" px="6" py="4" align="center" justify="space-between">
        <Heading size="md">Instructor Dashboard</Heading>
        <HStack spacing="4">
          <Button variant="ghost" leftIcon={<FaUsers />} colorScheme="orange">
            Students
          </Button>
          <Button variant="ghost" leftIcon={<FaRegQuestionCircle />} colorScheme="orange">
            Help
          </Button>
        </HStack>
      </Flex>

      <Flex flex="1">
        {/* Sidebar */}
        <Box w="250px" p="5" bg="gray.900" color="white" borderRight="1px" borderColor="gray.700">
          <VStack align="start" spacing="4">
            <Button
              leftIcon={<FaBook />}
              colorScheme="orange"
              variant="ghost"
              size="sm"
              width="100%"
              justifyContent="flex-start"
              onClick={() => setSelectedContent('courses')}
            >
              Manage Courses
            </Button>
            <Button
              leftIcon={<FaChalkboardTeacher />}
              colorScheme="orange"
              variant="ghost"
              size="sm"
              width="100%"
              justifyContent="flex-start"
              onClick={() => setSelectedContent('add-lessons')}
            >
              Add Lessons
            </Button>
            <Button
              leftIcon={<FaTasks />}
              colorScheme="orange"
              variant="ghost"
              size="sm"
              width="100%"
              justifyContent="flex-start"
              onClick={() => setSelectedContent('manage-sections')}
            >
              Manage Sections
            </Button>
            <Button
              leftIcon={<FaThList />}
              colorScheme="orange"
              variant="ghost"
              size="sm"
              width="100%"
              justifyContent="flex-start"
              onClick={() => setSelectedContent('view-lessons')}
            >
              View Lessons
            </Button>
            <Button
              leftIcon={<FaPlusSquare />}
              colorScheme="orange"
              variant="ghost"
              size="sm"
              width="100%"
              justifyContent="flex-start"
              onClick={() => setSelectedContent('add-materials')}
            >
              Add Learning Materials
            </Button>
            <Button
              leftIcon={<FaListUl />}
              colorScheme="orange"
              variant="ghost"
              size="sm"
              width="100%"
              justifyContent="flex-start"
              onClick={() => setSelectedContent('add-quizzes')}
            >
              Add Quizzes
            </Button>
          </VStack>
        </Box>

        {/* Main Content */}
        <Box flex="1" p="6">
          {renderContent()}
        </Box>
      </Flex>

      {/* Footer */}
      <Flex as="footer" bg="gray.900" color="white" p="4" justify="center" align="center">
        <Text>© 2024 Instructor Dashboard. All rights reserved.</Text>
      </Flex>

      {/* Drawer for Course/Lesson Form */}
      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay>
          <DrawerContent>
            <DrawerHeader borderBottomWidth="1px">
              {selectedContent === 'courses' ? 'Add New Course' : 'Add New Lesson'}
            </DrawerHeader>
            <DrawerBody>
              {selectedContent === 'courses' ? (
                // Course Form
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
                // Lesson Form
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
              <Button variant="outline" mr={3} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="orange" onClick={selectedContent === 'courses' ? handleCourseSubmit : handleLessonSubmit}>
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
