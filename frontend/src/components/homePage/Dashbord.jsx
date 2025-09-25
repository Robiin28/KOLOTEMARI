import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axiosInstance from '../../utils/AxiosInstance';
import {
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Box,
  Image,
  Select,
  Heading,
  Text,
  IconButton,
  Spinner,
  Button,
} from '@chakra-ui/react';
import { ChevronDownIcon, CalendarIcon, ViewIcon, InfoOutlineIcon } from '@chakra-ui/icons';
import './program.css';

export const Dashboard = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [startDate, setStartDate] = useState(new Date());
  const [userName, setUserName] = useState("User");
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [user, setUser] = useState({});
  const [enrollments, setEnrollments] = useState([]);
  const [instructorCourses, setInstructorCourses] = useState([]); 
  const [isInstructor, setIsInstructor] = useState(false); 
  const [loading, setLoading] = useState(true); 

  const navigate = useNavigate();

  useEffect(() => {
    const token = Cookies.get("authToken");

    if (token) {
      const tokenParts = token.split('.');
      if (tokenParts.length === 3) {
        try {
          const userData = JSON.parse(atob(tokenParts[1]));
          setUserName(userData.name || "User");
          fetchUserInfo(userData.id);
        } catch (error) {
          console.error("Error parsing user data:", error);
        }
      }
    }
  }, []);

  const fetchUserInfo = async (userId) => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`auth/me`);
      setUser(response.data.data.user);
      setIsInstructor(response.data.data.user.role === "instructor");
      await fetchEnrollments(userId);
      if (response.data.data.user.role === "instructor") {
        await fetchInstructorCourses(userId); 
      }
    } catch (error) {
      console.error("Error fetching user info:", error);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 1500);
    }
  };

  const fetchEnrollments = async (userId) => {
    try {
      const response = await axiosInstance.get(`https://kolo-temari-backend-service.onrender.com/api/enrollments/${userId}`);
      setEnrollments(response.data.data.enrollments);
    } catch (error) {
      console.error("Error fetching enrollments:", error);
    }
  };

  const fetchInstructorCourses = async (instructorId) => {
    try {
      const response = await axiosInstance.get(`https://kolo-temari-backend-service.onrender.com/api/courses/instructor/${instructorId}`);
      setInstructorCourses(response.data.data.courses);
    } catch (error) {
      console.error("Error fetching instructor courses:", error);
    }
  };

  const handleTabChange = (index) => {
    setSelectedTab(index);
  };

  const handleButtonClick = (index) => {
    setActiveDropdown(activeDropdown === index ? null : index);
  };

  const handleCourseClick = (enrollment) => {
    navigate('/course-detail', { state: { enrollment } });
  };
  const handleCourseClicked = (enrollment) => {
    navigate('/land/instructor');
  };

  const handleAddCourse = () => {
    navigate('/land/add-course');
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Spinner size="xl" />
      </Box>
    );
  }

  return (
    <Box className="dashboard">
      <Box className="leftCourse">
        <Box className='container'>
          <Box className='headland'>
            <Heading>My Programs</Heading>
          </Box>
          <Tabs index={selectedTab} onChange={handleTabChange}>
            <TabList>
              <Tab>Courses</Tab>
              <Tab>Currently Learning</Tab>
              <Tab>Course Completed</Tab>
              {isInstructor && <Tab>Courses Taught</Tab>}
            </TabList>
            <TabPanels>
              {/* First Tab */}
              <TabPanel>
                <Box className='boxen'>
                  <Box className='all-course'>
                    <Heading size='md'>Hello {user.name}</Heading>
                    <Box className='leftSelect'>
                      <Box className="select-container">
                        <ChevronDownIcon className='select-icon' />
                        <Select className="sortCourse" placeholder='Sort by'>
                          <option>Course Name</option>
                          <option>Date</option>
                        </Select>
                      </Box>
                      <Box className="select-container">
                        <CalendarIcon className='select-icon' />
                        <Select className="viewCourse" placeholder='View as'>
                          <option>Card</option>
                          <option>List</option>
                          <option>Summary</option>
                        </Select>
                      </Box>
                      <Box className="select-container">
                        <ViewIcon className='select-icon' />
                        <Select className='optionSort' placeholder='Filter by'>
                          <option>All (except removed from view)</option>
                          <option>Recently Enrolled</option>
                          <option>In Progress</option>
                          <option>Future</option>
                          <option>Removed from View</option>
                        </Select>
                      </Box>
                    </Box>
                  </Box>
                  <Box className="coursesView">
                    {enrollments.map((enrollment, index) => (
                      <Box 
                        className='boxCourse' 
                        key={index}
                        onClick={() => handleCourseClick(enrollment)}
                        cursor="pointer"
                      >
                        <Box>
                          <Image 
                            src={enrollment.course.pic}  
                            align="center" 
                            width="70%"
                            margin="auto" 
                            height="150px" 
                            alt={enrollment.course.title} 
                            objectFit="cover" 
                            borderRadius="md" 
                          />
                        </Box>
                        <Heading size='sm' mt={3} className="courseName">{enrollment.course.title}</Heading>
                        <Text>{enrollment.course.category}</Text>
                        <Text>Your progress {enrollment.progress}%</Text>
                        <Box className="more-options">
                          <IconButton
                            className="more-options-btn"
                            icon={<InfoOutlineIcon />}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleButtonClick(index);
                            }}
                          />
                          {activeDropdown === index && (
                            <Box className="dropdown-menu">
                              <Text>Proceed</Text>
                              <Text>Remove</Text>
                            </Box>
                          )}
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </Box>
              </TabPanel>

              {/* Second Tab */}
              <TabPanel>
                <Box className='boxen'>
                  <Box className="coursesView">
                    {enrollments
                      .filter(enrollment => enrollment.progress < 100)
                      .map((enrollment, index) => (
                        <Box 
                          className='boxCourse' 
                          key={index}
                          onClick={() => handleCourseClick(enrollment)}
                          cursor="pointer"
                        >
                          <Box>
                            <Image 
                              src={enrollment.course.pic}  
                              align="center" 
                              width="70%"
                              margin="auto" 
                              height="150px" 
                              alt={enrollment.course.title} 
                              objectFit="cover" 
                              borderRadius="md" 
                            />
                          </Box>
                          <Heading size='sm' mt={3} className="courseName">{enrollment.course.title}</Heading>
                          <Text>{enrollment.course.category}</Text>
                          <Text>Your progress {enrollment.progress}%</Text>
                          <Box className="more-options">
                            <IconButton
                              className="more-options-btn"
                              icon={<InfoOutlineIcon />}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleButtonClick(index);
                              }}
                            />
                            {activeDropdown === index && (
                              <Box className="dropdown-menu">
                                <Text>Proceed</Text>
                                <Text>Remove</Text>
                              </Box>
                            )}
                          </Box>
                        </Box>
                      ))}
                    {enrollments.filter(enrollment => enrollment.progress < 100).length === 0 && (
                      <Text>No courses currently being learned.</Text>
                    )}
                  </Box>
                </Box>
              </TabPanel>

              {/* Third Tab */}
              <TabPanel>
                <Box className='course-completed'>
                  <Heading size='lg'>List of Certificates</Heading>
                </Box>
              </TabPanel>

              {/* Courses Taught Tab */}
              {isInstructor && (
                <TabPanel>
                  <Box className='boxen'>
                    <Box className="coursesView">
                      {instructorCourses.map((course, index) => (
                        <Box 
                          className='boxCourse' 
                          key={index}
                          onClick={() => handleCourseClicked(course)}
                          cursor="pointer"
                        >
                          <Box>
                            <Image 
                              src={course.pic} 
                              align="center" 
                              width="100%"
                              margin="auto" 
                              height="150px" 
                              alt={course.title} 
                              objectFit="cover" 
                              borderRadius="md" 
                            />
                          </Box>
                          <Heading size='sm' mt={3} className="courseName">{course.title}</Heading>
                          <Text>{course.category}</Text>
                          <Box className="more-options">
                            <IconButton
                              className="more-options-btn"
                              icon={<InfoOutlineIcon />}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleButtonClick(index);
                              }}
                            />
                            {activeDropdown === index && (
                              <Box className="dropdown-menu">
                                <Text>View Details</Text>
                                <Text>Remove</Text>
                              </Box>
                            )}
                          </Box>
                        </Box>
                      ))}
                      {instructorCourses.length === 0 && (
                        <Text>You have not taught any courses yet.</Text>
                      )}
                      <Box  mt={4}>
                        <Button 
                          bg="orange.900" 
                          onClick={handleAddCourse} 
                          padding="8px 16px" 
                          borderRadius="md" 
                          color="white"
                          fontSize="md" 
                          boxShadow="md" 
                          _hover={{ bg: "orange.400" }} 
                        >
                          Add Course
                        </Button>
                      </Box>
                    </Box>
                  </Box>
                </TabPanel>
              )}
            </TabPanels>
          </Tabs>
        </Box>
      </Box>
      <Box className='rightCourse'>
        <Box className='container'>
          <Box className='boxDashboard'>
            <Heading size='md'>Calendar</Heading>
            <Box className='date'>
              <DatePicker 
                selected={startDate} 
                onChange={(date) => setStartDate(date)} 
                inline 
              />
            </Box>
          </Box>   
          <Box className="boxDashboard">
            <Heading size='md'>Upcoming Deadlines</Heading>
          </Box>
          <Box className="boxDashboard">
            <Heading size='md'>Payments</Heading>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
