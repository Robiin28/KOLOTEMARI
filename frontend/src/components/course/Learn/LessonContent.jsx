import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Text, 
  Image, 
  Tabs, 
  TabList, 
  TabPanels, 
  Tab, 
  TabPanel, 
  Input, 
  Flex, 
  Spinner, 
  Link 
} from '@chakra-ui/react';
import { SearchIcon, AttachmentIcon } from '@chakra-ui/icons'; 
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const LessonContent = ({ lesson }) => {
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [sections, setSections] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingQuizzes, setLoadingQuizzes] = useState(false);
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    if (!lesson) return;

    const fetchSections = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`https://kolo-temari-backend-service.onrender.com/api/course/${lesson.courseId}/section`, {
          withCredentials: true,
        });
        await new Promise(resolve => setTimeout(resolve, 1000));
        if (response.data.status === 'success') {
          setSections(response.data.data.sections);
        } else {
          setError('Failed to fetch sections.');
        }
      } catch (error) {
        setError(`Failed to fetch sections: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    const fetchQuizzes = async () => {
      try {
        setLoadingQuizzes(true);
        const response = await axios.get(`https://kolo-temari-backend-service.onrender.com/api/course/lesson/${lesson._id}/quiz`, {
          withCredentials: true,
        });
        if (response.data.status === 'success') {
          setQuizzes(response.data.data.quizzes);
        } else {
          setError('Failed to fetch quizzes.');
        }
      } catch (error) {
        setError(`Failed to fetch quizzes: ${error.message}`);
      } finally {
        setLoadingQuizzes(false);
      }
    };

    fetchSections();
    fetchQuizzes();
  }, [lesson]);

  const handleQuizClick = (quiz) => {
    navigate('/quiz', { state: { quizId: quiz._id, lessonId: lesson._id } });
};



  if (!lesson) {
    return null;
  }

  return (
    <Box 
      p={{ base: 2, md: 4 }} 
      bg="gray.50" 
      borderRadius="md" 
      boxShadow="md" 
      mt={{ base: 6, md: 12 }} 
      maxW="full"
    >
      <Text fontSize={{ base: "xl", md: "3xl" }} fontWeight="bold" mb={6} color="gray.900" textAlign="center">
        {lesson.title}
      </Text>

      <Tabs variant="unstyled">
        <TabList borderBottom="1px solid" borderColor="gray.300">
          <Tab {...tabStyles}>Search</Tab>
          <Tab {...tabStyles}>Overview</Tab>
          <Tab {...tabStyles}>Description</Tab>
          <Tab {...tabStyles}>Videos</Tab>
          <Tab {...tabStyles}>Resources</Tab>
          <Tab {...tabStyles}>Announcements</Tab>
          <Tab {...tabStyles}>Reviews</Tab>
          <Tab {...tabStyles}>Project</Tab>
          <Tab {...tabStyles}>Quizzes</Tab>
        </TabList>

        <TabPanels>
          {/* Search Tab */}
          <TabPanel>
            <Flex 
              direction={{ base: "column", sm: "row" }} 
              mb={4} 
              align="center" 
              justify="center"
            >
              <SearchIcon mr={2} color="gray.500" />
              <Input 
                placeholder="Search lesson content..." 
                variant="outline" 
                width={{ base: "full", sm: "300px" }} 
              />
            </Flex>
          </TabPanel>

          {/* Overview Tab */}
          <TabPanel>
          <div dangerouslySetInnerHTML={{ __html: lesson.content }} />

          </TabPanel>

          {/* Description Tab */}
          <TabPanel>
            <Box mb={6}>
            <div dangerouslySetInnerHTML={{ __html: lesson.description}} />

              {lesson.pic && (
                <Image 
                  src={lesson.pic} 
                  alt={lesson.title} 
                  borderRadius="md" 
                  boxShadow="md"
                  m="auto"
                  mb={6}
                  maxW={{ base: "60%", md: "20%" }} 
                  height="auto"
                />
              )}
            </Box>
          </TabPanel>
          <TabPanel>
            {lesson.videoUrls && lesson.videoUrls.length > 0 ? (
              <Box>
                <Box mb={4}>
                  {lesson.videoUrls.map((url, index) => (
                    <Link 
                      key={index} 
                      onClick={() => setSelectedVideo(url)} 
                      fontSize={{ base: "sm", md: "md" }} 
                      color="blue.500" 
                      _hover={{ textDecoration: 'underline' }}
                      display="block"
                      mb={2}
                    >
                      Part {index + 1}
                    </Link>
                  ))}
                </Box>
                {selectedVideo && (
                  <Box 
                    borderRadius="md" 
                    overflow="hidden" 
                    boxShadow="md" 
                    mt={8}
                    display="flex"
                    justifyContent="center"
                  >
                    <video
                      controls
                      preload="auto"
                      width={{ base: "100%", md: "80%" }}
                      height="auto"
                      style={{ borderRadius: '8px', maxHeight: '500px' }}
                    >
                      <source src={selectedVideo} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </Box>
                )}
              </Box>
            ) : (
              <Text color="gray.600">No videos available.</Text>
            )}
          </TabPanel>

          {/* Resources Tab */}
          <TabPanel>
            {lesson.resources && lesson.resources.length > 0 ? (
              lesson.resources.map((resource, index) => (
                <Box key={index} mb={4}>
                  <Link href={resource} target="_blank" rel="noopener noreferrer" display="flex" alignItems="center">
                    <AttachmentIcon boxSize={5} color="blue.500" mr={2} />
                    <Text color="blue.500" _hover={{ textDecoration: 'underline' }}>
                      Resource {index + 1}
                    </Text>
                  </Link>
                </Box>
              ))
            ) : (
              <Text color="gray.600">No resources available.</Text>
            )}
          </TabPanel>

          {/* Announcements Tab */}
          <TabPanel>
            <Text color="gray.600">Announcements content goes here...</Text>
          </TabPanel>

          {/* Reviews Tab */}
          <TabPanel>
            <Text color="gray.600">Reviews content goes here...</Text>
          </TabPanel>
          <TabPanel>
            <Text color="gray.600" >you assignmnet content goest here</Text>
          </TabPanel>

          {/* Quizzes Tab */}
          <TabPanel>
            {loadingQuizzes ? (
              <Flex justify="center" align="center">
                <Spinner size="lg" color="blue.500" />
              </Flex>
            ) : quizzes.length > 0 ? (
              quizzes.map((quiz, index) => (
                <Box key={index} mb={4}>
                  <Text 
                    color="blue.500" 
                    _hover={{ textDecoration: 'underline', cursor: 'pointer' }} 
                    onClick={() => handleQuizClick(quiz)} // Call handleQuizClick on click
                  >
                    Quiz {index + 1}
                  </Text>
                </Box>
              ))
            ) : (
              <Text color="gray.600">No quizzes available.</Text>
            )}
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

// Common tab styles
const tabStyles = {
  fontSize: { base: "sm", md: "md" },
  px: 4,
  py: 2,
  _selected: { borderBottom: "2px solid gray", color: "gray.800" },
  _focus: { outline: "none" },
  _hover: { background: "transparent", color: "gray.800" },
  borderRadius: "0",
};

export default LessonContent;
