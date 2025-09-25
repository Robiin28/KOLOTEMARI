import React, { useState, useEffect } from 'react';
import { Flex, Text, Box, IconButton, Collapse, useDisclosure, Divider, Menu, MenuButton, MenuList, MenuItem, Spinner } from '@chakra-ui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import { faBook, faVideo, faStickyNote } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

const NavItem = ({ item, icon, title, onClick, isSelected }) => {
  const { isOpen, onToggle } = useDisclosure();

  return (
    <Box mb={2} borderRadius="md" bg={isSelected ? "blue.100" : "white"} boxShadow="sm" p={3}>
      <Flex
        w="full"
        rounded="md"
        py={2}
        px={3}
        color={isSelected ? "blue.600" : "gray.700"}
        fontWeight="medium"
        alignItems="center"
        justifyContent="space-between"
        gap={2}
        _hover={{ bg: "gray.100", cursor: "pointer" }}
        onClick={() => {
          onToggle();
          onClick();
        }}
        transition="all 0.2s"
      >
        <Flex gap={2} alignItems="center">
          <FontAwesomeIcon icon={icon} />
          <Text>{title}</Text>
        </Flex>
        <IconButton
          variant="unstyled"
          size="md"
          fontSize="20px"
          color={isSelected ? "blue.600" : "gray.600"}
          icon={isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
          aria-label="Toggle"
        />
      </Flex>
      <Collapse in={isOpen} animateOpacity>
        <Box pt={2}>
          <Menu>
            <MenuButton as={Text} color="blue.500" cursor="pointer" _hover={{ textDecoration: "underline" }}>
              View Options
            </MenuButton>
            <MenuList>
              <MenuItem icon={<FontAwesomeIcon icon={faVideo} />} onClick={() => alert("View Video")}>
                Video
              </MenuItem>
              <MenuItem icon={<FontAwesomeIcon icon={faStickyNote} />} onClick={() => alert("View Notes")}>
                Notes
              </MenuItem>
            </MenuList>
          </Menu>
          <Divider my={2} borderColor="gray.200" />
        </Box>
      </Collapse>
    </Box>
  );
};

export const SideBar = ({ onSelectLesson, section }) => {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isLoadingVisible, setLoadingVisible] = useState(true);
  const [selectedLesson, setSelectedLesson] = useState(null);
  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const response = await axios.get(`https://kolo-temari-backend-service.onrender.com/api/courses/${section.courseId}/sections/${section._id}/lessons`, {
          withCredentials: true // Include cookies with the request
        });
        setLessons(response.data.data.lessons);
      } catch (error) {
        console.error('Error fetching lessons:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLessons();
  }, []);

  useEffect(() => {
    if (!loading) {
      setLoadingVisible(false);
    }
  }, [loading]);

  const handleLessonClick = (lesson) => {
    setSelectedLesson(lesson);
    onSelectLesson(lesson);
  };

  return (
    <Flex
      as="aside"
      direction="column"
      position="fixed"
      top="38%"
      left={isCollapsed ? "-80px" : "0"}
      width={isCollapsed ? "80px" : "300px"}
      height="50vh"
      color="black"
      p={4}
      overflowY="auto"
      transition="all 0.3s"
      zIndex="1"
      bg="white"
      borderRight="1px solid"
      borderColor="gray.200"
      transform="translateY(-50%)"
      boxShadow="md"
    >
      {!isCollapsed && (
        <>
          <Text fontSize="xl" fontWeight="bold" color="gray.800" mb={4}>
            Learning
          </Text>
          <Box>
            {isLoadingVisible ? (
              <Flex justify="center" align="center" height="full">
                <Spinner size="lg" color="blue.500" />
              </Flex>
            ) : loading ? (
              <Text>Loading...</Text>
            ) : (
              lessons.map((lesson) => (
                <NavItem
                  key={lesson._id}
                  item={lesson.title}
                  icon={faBook}
                  title={lesson.title}
                  isSelected={selectedLesson?._id === lesson._id}
                  onClick={() => handleLessonClick(lesson)}
                />
              ))
            )}
          </Box>
        </>
      )}
    </Flex>
  );
};

export default SideBar;
