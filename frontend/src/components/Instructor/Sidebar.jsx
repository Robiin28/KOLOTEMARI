// Sidebar.js
import React from 'react';
import { VStack, Link, Text } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';

const Sidebar = () => {
  return (
    <VStack
      as="nav"
      spacing={4}
      align="start"
      p={5}
      bg="orange.600"
      color="white"
      width="250px"
      height="100vh"
    >
      <Link as={RouterLink} to="manage-courses" _hover={{ color: 'orange.300' }}>
        <Text>Manage Courses</Text>
      </Link>
      <Link as={RouterLink} to="manage-lessons" _hover={{ color: 'orange.300' }}>
        <Text>Manage Lessons</Text>
      </Link>
      <Link as={RouterLink} to="manage-students" _hover={{ color: 'orange.300' }}>
        <Text>Manage Students</Text>
      </Link>
      <Link as={RouterLink} to="add-quiz" _hover={{ color: 'orange.300' }}>
        <Text>Add Quiz</Text>
      </Link>
    </VStack>
  );
};

export default Sidebar;
