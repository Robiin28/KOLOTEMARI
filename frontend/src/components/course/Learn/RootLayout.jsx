import React, { useState } from 'react';
import { Flex, Box, Text, IconButton } from '@chakra-ui/react';
import { ArrowForwardIcon, ArrowBackIcon } from '@chakra-ui/icons';
import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from './Navbar';
import { SideBar } from './SideBar';
import { Footer } from './Footer';
import LessonContent from './LessonContent'; // Import your LessonContent component
import { RelatedCourse } from './RelatedCourse'; // Import the RelatedCourse component

export const RootLayout = () => {
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  
  // Get the location state to retrieve the section
  const location = useLocation();
  const section = location.state?.section; // Access the passed section data

  return (
    <Flex direction="column" minHeight="100vh">
      <Flex flex="1" direction={{ base: "column", md: "row" }}>
        {!isSidebarCollapsed && (
          <Box
            as="aside"
            width={{ base: "100%", md: "20%" }} // Adjust sidebar width for different screen sizes
            minHeight="100vh"
            p="4"
          >
            <SideBar 
              section={section} // Pass the selected section to SideBar
              onSelectLesson={setSelectedLesson} 
              setIsSidebarCollapsed={setIsSidebarCollapsed} // Pass down setter for sidebar visibility
            />
          </Box>
        )}
        <Flex
          as="main"
          flex="1"
          direction="column"
          p="4"
          transition="all 0.3s"
          ml={{ base: 0, md: isSidebarCollapsed ? 4 : 0 }} // Adjust margin for collapsed sidebar
        >
          <Navbar />
          <Flex
            flex="1"
            direction="column"
            mb="4" // Adjust margin-bottom to reduce space between content and footer
            minHeight="0" // Ensure it can shrink to avoid overflow
          >
            {selectedLesson ? (
              <LessonContent lesson={selectedLesson} />
            ) : (
              <Text textAlign="center" mt={16}>Select a lesson to view details</Text>
            )}
            <Outlet />
          </Flex>
          <RelatedCourse 
          section={section}
          isSidebarCollapsed={isSidebarCollapsed} />
        </Flex>
      </Flex>

      <IconButton
        variant="solid"
        size="lg"
        fontSize="24px"
        icon={isSidebarCollapsed ? <ArrowForwardIcon /> : <ArrowBackIcon />} // Toggle icon
        aria-label="Toggle Sidebar"
        onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        position="fixed"
        top="13.1%"
        left={isSidebarCollapsed ? "10px" : "250px"} // Adjust position based on sidebar state
        zIndex="1000" // Ensure it is above the sidebar
        color="black.300"
        border="2px solid black"
        bg="white" // Background color for visibility
        borderRadius="0" // Make the button round
      />
      <Footer />
    </Flex>
  );
};

export default RootLayout;
