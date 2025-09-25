import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Checkbox,
  Container,
  Divider,
  Flex,
  Grid,
  Heading,
  IconButton,
  Input,
  Select,
  Spacer,
  Stack,
  Text
} from '@chakra-ui/react';
import axiosInstance from '../../utils/AxiosInstance';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faPlus, faStar, faStarHalfAlt, faClock, faList, faHeart, faUnlock, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import Cookies from "js-cookie";
import { useToast } from "@chakra-ui/react";
import FeaturedCourses from './FeaturedCourse';
export const CourseTable = () => {
  const [isDisplayCatagory, setIsDisplayCatagory] = useState(true);
  const [isDisplayStatus, setIsDisplayStatus] = useState(true);
  const [isDisplayLevel, setIsDisplayLevel] = useState(true);
  const [isDisplayRating, setIsDisplayRating] = useState(true);
  const [isDisplayInstructors, setIsDisplayInstructors] = useState(true);
  const [isDisplayPrice, setIsDisplayPrice] = useState(true);
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(''); // State for search query

  const [showLoader, setShowLoader] = useState(true);
  const [selectedValue, setSelectedValue] = useState('Release date (Newest First)');
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("User");
  const [user, setUser] = useState("user");
  const [userAvatar, setUserAvatar] = useState("/path/to/placeholder/avatar.png"); // Placeholder avatar
  const [filteredCourses, setFilteredCourses] = useState([]); // New state for filtered courses
  const [showFilteredResults, setShowFilteredResults] = useState(false); // Track if showing filtered results

 
  useEffect(() => {
    const token = Cookies.get("authToken");

    if (token) {
      setIsLoggedIn(true);
      const tokenParts = token.split(".");
      if (tokenParts.length === 3) {
        try {
          const userData = JSON.parse(atob(tokenParts[1]));
          setUserName(userData.name || "User");
          setUserAvatar(userData.avatar || "/path/to/placeholder/avatar.png"); // Set the avatar from user data or use a placeholder
          fetchUserInfo(userData.id);
        } catch (error) {
          console.error("Error parsing user data:", error);
        }
      }
    }
  }, []);

  
  const fetchUserInfo = async (userId) => {
    try {
      const response = await axiosInstance.get("auth/me");
      setUser(response.data.data.user);
      setUserAvatar(response.data.data.user.pic || userAvatar); // Adjust if avatar is in response
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  };
  const itemsPerPage = 6; // Number of courses to display per page
  const [filters, setFilters] = useState({
    categories: [],
    statuses: [],
    levels: [],
    ratings: [],
    instructors: [],
    prices: [],
  });
  const sortOptions = [
    { value: 'newest', viewValue: 'Release date (Newest First)' },
    { value: 'oldest', viewValue: 'Release date (Oldest First)' },
  ];
  const toast = useToast();
  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await axios.get('https://kolo-temari-backend-service.onrender.com/api/courses', {
        withCredentials: true // This line ensures cookies are sent with the request
      });
      
      if (response.data.status === 'success') {
        setCourses(response.data.data.courses);
      } else {
        setError('Failed to fetch courses.');
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
      setError(`Failed to fetch courses: ${error.response ? error.response.data.message : error.message}`);
    } finally {
      setLoading(false);
      setTimeout(() => {
        setShowLoader(false);
      }, 1500);
    }
  };
  
  

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleNext = () => {
    if (currentPage < Math.ceil(courses.length / itemsPerPage) - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrev = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };
  const handleSearch = () => {
    const results = filterCourses().filter(course =>
      course.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredCourses(results);
    setShowFilteredResults(true);
    setCurrentPage(0);
  };
  
  const addToCart = async (course) => {
    try {
        const response = await axios.post('http://localhost:5000/api/cart/my', {
            courseId: course._id,
            name: course.title,
            price: course.price || 0, // Default to 0 if price is not available
        }, {
            withCredentials: true,
        });

        if (response.data.status === 'success') {
            console.log('Course added to cart successfully');
            toast({
                title: "Success!",
                description: "Course added to cart successfully.",
                status: "success",
                duration: 5000,
                isClosable: true,
            });
        } else {
            toast({
                title: "Error",
                description: response.data.message || "Failed to add course to cart.",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        }
    } catch (error) {
      toast({
            title: "Error",
            description: error.response ? error.response.data.message : "An unexpected error occurred.",
            status: "error",
            duration: 5000,
            isClosable: true,
        });
    }
};
  const handleFilterChange = (filterType) => (e) => {
    const value = e.target.value;
    setFilters((prev) => ({
      ...prev,
      [filterType]: prev[filterType].includes(value)
        ? prev[filterType].filter((v) => v !== value)
        : [...prev[filterType], value],
    }));
  };
  
  const filterCourses = () => {
    return courses.filter((course) => {
      const matchesCategories = filters.categories.length === 0 || filters.categories.includes(course.category);
      const matchesStatuses = filters.statuses.length === 0 || filters.statuses.includes(course.status);
      const matchesLevels = filters.levels.length === 0 || filters.levels.includes(course.level);
      const matchesRatings = filters.ratings.length === 0 || filters.ratings.includes(course.rating);
      const matchesInstructors = filters.instructors.length === 0 || filters.instructors.includes(course.instructor);
      const matchesPrices = filters.prices.length === 0 || filters.prices.includes(course.price);

      return matchesCategories && matchesStatuses && matchesLevels && matchesRatings && matchesInstructors && matchesPrices;
    });
  };
 
  const handleShowResults = () => {
    const results = filterCourses();
    setFilteredCourses(results);
    setShowFilteredResults(true);
    setCurrentPage(0);
  };
  const currentCourses = showFilteredResults
  ? filteredCourses.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage)
  : courses.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

  const filteredCoursesBySearch = () => {
    if (!searchQuery) return currentCourses; // Return current courses if no search query
    return currentCourses.filter(course =>
      course.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };
const enrollCourse = async (course) => {
      
  
  const courseId=course._id;
  const userId=user.id;
  try {
          const response = await axios.post(`http://localhost:5000/api/courses/${course._id}/enroll`, {
              courseId,
              userId
          }, {
              withCredentials: true,
          });
  
          if (response.data.status === 'success') {
              console.log('Successfully enrolled in the course');
              toast({
                  title: "Enrollment Successful",
                  description: "You have successfully enrolled in the course.",
                  status: "success",
                  duration: 5000,
                  isClosable: true,
              });
          } else {
              console.error('Failed to enroll in the course:', response.data.message);
              toast({
                  title: "Enrollment Failed",
                  description: response.data.message || "An error occurred while enrolling.",
                  status: "error",
                  duration: 5000,
                  isClosable: true,
              });
          }
      } catch (error) {
          console.error('Error enrolling in course:', error.response ? error.response.data : error.message);
          toast({
              title: "Error",
              description: error.response ? error.response.data.message : "An unexpected error occurred.",
              status: "error",
              duration: 5000,
              isClosable: true,
          });
      }
  };
  

  return (
    <>
    <FeaturedCourses />
    <Container maxW="container" py={4}>
      <Stack spacing={4}>
       {/* Header Section */}
       <Flex justify="space-between" align="center">
  <Heading as="h1" fontWeight="bold">Course</Heading>
  <Flex align="center">
    <Input 
      placeholder="Search Courses" 
      variant="outline" 
      w="300px" 
      onChange={(e) => setSearchQuery(e.target.value)} // Update search query
    />
    <IconButton
      aria-label="Search"
      icon={<FontAwesomeIcon icon={faSearch} />}
      colorScheme="blue"
      ml={2}
      onClick={handleSearch} // Trigger search on click
    />
  </Flex>
</Flex>

        
        {/* <Flex mb={4}>
          <Text mr={2}>Sort By:</Text>
          <Select
            value={selectedValue}
            onChange={(e) => setSelectedValue(e.target.value)}
            w="auto"
          >
            {sortOptions.map((sort, index) => (
              <option key={index} value={sort.value}>
                {sort.viewValue}
              </option>
            ))}
          </Select>
        </Flex> */}

        {/* Filter Sections and Featured Courses */}
        <Flex spacing={4} ml={8} mr={6}>
          {/* Filter Section */}
          <Stack spacing={4} w="20%" pr={4} borderRightWidth="1px">
            {/* Categories Section */}
            <Box>
              <Button
                onClick={() => setIsDisplayCatagory(prev => !prev)}
                variant="outline"
                w="full"
                justifyContent="space-between"
              >
                Category
                <FontAwesomeIcon icon={faPlus} />
              </Button>
              {isDisplayCatagory && (
                <Stack spacing={2} mt={2}>
                    {Array.from(new Set(courses.map(course => course.category))).map((category, index) => (
                      <Checkbox key={index} onChange={handleFilterChange('categories')} value={category}>
                        {category}
                      </Checkbox>
                    ))}
                  </Stack>
              )}
            </Box>

            {/* Status Section */}
            <Box>
              <Button
                onClick={() => setIsDisplayStatus(!isDisplayStatus)}
                variant="outline"
                w="full"
                justifyContent="space-between"
              >
                Time
                <FontAwesomeIcon icon={faPlus} />
              </Button>
              {!isDisplayStatus && (
                <Stack spacing={2} mt={2}>
                  {['Recent', 'New', 'all'].map((status, index) => (
                    <Checkbox key={index}>{status}</Checkbox>
                  ))}
                </Stack>
              )}
            </Box>

            {/* Level Section */}
            <Box>
              <Button
                onClick={() => setIsDisplayLevel(!isDisplayLevel)}
                variant="outline"
                w="full"
                justifyContent="space-between"
              >
                Level
                <FontAwesomeIcon icon={faPlus} />
              </Button>
              {!isDisplayLevel && (
                <Stack spacing={2} mt={2}>
                  {['Beginner', 'Intermediate', 'Advanced'].map((level, index) => (
                    <Checkbox key={index}>{level}</Checkbox>
                  ))}
                </Stack>
              )}
            </Box>

            {/* Rating Section */}
            <Box>
              <Button
                onClick={() => setIsDisplayRating(!isDisplayRating)}
                variant="outline"
                w="full"
                justifyContent="space-between"
              >
                Rating
                <FontAwesomeIcon icon={faPlus} />
              </Button>
              {!isDisplayRating && (
                <Stack spacing={2} mt={2}>
                  {[4.5, 4.0, 3.5, 3.0].map((rating, index) => (
                    <Checkbox key={index}>
                      <FontAwesomeIcon icon={faStar} />
                      <FontAwesomeIcon icon={faStar} />
                      <FontAwesomeIcon icon={faStar} />
                      <FontAwesomeIcon icon={faStar} />
                      {rating === 4.5 && <FontAwesomeIcon icon={faStarHalfAlt} />}
                      {rating} & up
                    </Checkbox>
                  ))}
                </Stack>
              )}
            </Box>

            {/* Instructors Section */}
            <Box>
              <Button
                onClick={() => setIsDisplayInstructors(!isDisplayInstructors)}
                variant="outline"
                w="full"
                justifyContent="space-between"
              >
                Instructor
                <FontAwesomeIcon icon={faPlus} />
              </Button>
              {!isDisplayInstructors && (
                <Stack spacing={2} mt={2}>
                  {Array.isArray(courses) && courses.length > 0 ? (
                    Array.from(new Set(courses.map(course => course.instructor).filter(category => category))).map((category, index) => (
                      <Checkbox key={index}>{category}</Checkbox>
                    ))
                  ) : (
                    <Text>No categories available</Text>
                  )}
                </Stack>
              )}
            </Box>

            {/* Price Section */}
           {/* Price Section */}
<Box>
  <Button
    onClick={() => setIsDisplayPrice(!isDisplayPrice)}
    variant="outline"
    w="full"
    justifyContent="space-between"
  >
    Price
    
  </Button>
  {isDisplayPrice && (
    <Stack spacing={2} mt={2}>
      {['Free', 'Paid'].map((price, index) => (
        <Checkbox key={index} onChange={handleFilterChange('prices')} value={price}>
          {price}
        </Checkbox>
      ))}
    </Stack>
  )}
</Box>


            {/* Show Results Button */}
            <Flex mt={4} direction="column" align="end">
              <Button color='white' backgroundColor={'orange.500'} onClick={handleShowResults}>
                Show Results
              </Button>
              <Button variant="link" mt={2} color="red.600" mr={5}>Reset all</Button>
            </Flex>
          </Stack>

          {/* Featured Courses Section */}
          <Box w="80%">
            <Box mb={4}>
              <Flex justify="center" align="center">
                <Text fontSize="xl" fontWeight="bold" align="start" ml={5}>FEATURED COURSES</Text>
                <Spacer />
                <Button variant="link" colorScheme="blackAlpha">Show all</Button>
              </Flex>
              <Divider mt={2} />
            </Box>

            <Grid ml={12} mr={12} templateColumns="repeat(auto-fill, minmax(250px, 1fr))" gap={8}>
            {currentCourses.map((course, index) => (
                <Box position="relative" key={course.id} borderWidth="1px" borderRadius="md" overflow="hidden">
                  <img src={course.pic} alt="Course" style={{ width: '100%', height: '150px', objectFit: 'cover' }} />
                  <Box p={4}>
                    <Text fontSize="sm" color="gray.500">{course.title}</Text>
                    <Heading size="md" color="orange.600" textAlign={"end"}>{course.category}</Heading>
                    <Divider my={2} />
                    <Flex justify="space-between" align="center">
                      <Text fontSize="sm">
                        <FontAwesomeIcon icon={faClock} /> {course.duration}
                      </Text>
                      <Text fontSize="sm" color="green.500">{course.status}</Text>
                    </Flex>
                    <Text textAlign="end" fontSize="m" fontWeight="bold" color="red.400">{course.price}</Text>
                  </Box>
                  <Box
                    position="absolute"
                    top={0}
                    left={0}
                    right={0}
                    bottom={0}
                    bg="rgba(216, 85, 9, 0.6)"
                    color="white"
                    p={4}
                    display="flex"
                    flexDirection="column"
                    justifyContent="space-between"
                    opacity={0}
                    _hover={{ opacity: 1 }}
                  >
                    <Stack spacing={2}>
                      <a href="#" style={{ color: 'white' }}>{course.title}</a>
                      <Text fontWeight="bold">Instructor: {course.instructor}</Text>
                      <Text fontSize="sm">
                        <FontAwesomeIcon icon={faStar} />
                        {course.rating}
                      </Text>
                      <Box maxH="18vh" overflowY="scroll" sx={{
                        '&::-webkit-scrollbar': {
                          width: '8px',
                        },
                        '&::-webkit-scrollbar-track': {
                          background: '#f1f1f1',
                        },
                        '&::-webkit-scrollbar-thumb': {
                          background: '#888',
                          borderRadius: '4px',
                        },
                        '&::-webkit-scrollbar-thumb:hover': {
                          background: '#555',
                        },
                      }}>
                        <Text dangerouslySetInnerHTML={{ __html: course.description }} />
                      </Box>
                    </Stack>
                    <Button
    color="white"
    style={{ backgroundColor: "black" }}
    onClick={() => {
        if (course.status.toLowerCase() === "free") {
            enrollCourse(course);
        } else {
            addToCart(course); // This function handles adding the course to the cart
        }
    }}
>
    {course.status.toLowerCase() === "free" ? "Enroll Now" : "Add to Cart"}
</Button>


                  </Box>
                </Box>
              ))}
            </Grid>

            {/* Pagination Buttons */}
            <Flex justify="space-between" mt={4}>
              <Button
                onClick={handlePrev}
                leftIcon={<FontAwesomeIcon icon={faChevronLeft} />}
                isDisabled={currentPage === 0}
              >
                Previous
              </Button>
              <Button
                onClick={handleNext}
                rightIcon={<FontAwesomeIcon icon={faChevronRight} />}
                isDisabled={currentPage >= Math.ceil(courses.length / itemsPerPage) - 1}
              >
                Next
              </Button>
            </Flex>
          </Box>
        </Flex>
      </Stack>
    </Container>
    </>
  );
};
