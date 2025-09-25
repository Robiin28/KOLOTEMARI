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
  Text,
  useToast,
} from '@chakra-ui/react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSearch,
  faPlus,
  faStar,
  faStarHalfAlt,
  faClock,
  faHeart,
  faChevronLeft,
  faChevronRight,
} from '@fortawesome/free-solid-svg-icons';
import axiosInstance from '../../utils/AxiosInstance';
import FeaturedCourses from './FeaturedCourse';

export const CourseTable = () => {
  const [isDisplayCategory, setIsDisplayCategory] = useState(true);
  const [isDisplayStatus, setIsDisplayStatus] = useState(true);
  const [isDisplayLevel, setIsDisplayLevel] = useState(true);
  const [isDisplayRating, setIsDisplayRating] = useState(true);
  const [isDisplayInstructors, setIsDisplayInstructors] = useState(true);
  const [isDisplayPrice, setIsDisplayPrice] = useState(true);
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [showLoader, setShowLoader] = useState(true);
  const [selectedValue, setSelectedValue] = useState('Release date (Newest First)');
  const [currentPage, setCurrentPage] = useState(0);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [showFilteredResults, setShowFilteredResults] = useState(false);
  const itemsPerPage = 6;

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

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const response = await axios.get('https://kolo-temari-backend-service.onrender.com/api/courses', {
          withCredentials: true,
        });

        if (response.data.status === 'success') {
          setCourses(response.data.data.courses);
        } else {
          setError('Failed to fetch courses.');
        }
      } catch (error) {
        setError(`Failed to fetch courses: ${error.response ? error.response.data.message : error.message}`);
      } finally {
        setLoading(false);
        setTimeout(() => {
          setShowLoader(false);
        }, 1500);
      }
    };

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

  return (
    <>
      <FeaturedCourses />
      <Container maxW="container" py={4}>
        <Stack spacing={4}>
          {/* Header Section */}
          <Flex justify="space-between" align="center">
            <Heading as="h1" fontWeight="bold">Course</Heading>
            <Flex align="center">
              <Input placeholder="Search Courses" variant="outline" w="300px" />
              <IconButton
                aria-label="Search"
                icon={<FontAwesomeIcon icon={faSearch} />}
                colorScheme="blue"
                ml={2}
              />
            </Flex>
          </Flex>

          {/* Sort Section */}
          <Flex mb={4}>
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
          </Flex>

          {/* Filter Sections */}
          <Flex spacing={4} ml={8} mr={6}>
            <Stack spacing={4} w="20%" pr={4} borderRightWidth="1px">
              {/* Categories Section */}
              <Box>
                <Button
                  onClick={() => setIsDisplayCategory(prev => !prev)}
                  variant="outline"
                  w="full"
                  justifyContent="space-between"
                >
                  Category
                  <FontAwesomeIcon icon={faPlus} />
                </Button>
                {isDisplayCategory && (
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
                {isDisplayStatus && (
                  <Stack spacing={2} mt={2}>
                    {['Recent', 'New', 'all'].map((status, index) => (
                      <Checkbox key={index} onChange={handleFilterChange('statuses')} value={status}>
                        {status}
                      </Checkbox>
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
                {isDisplayLevel && (
                  <Stack spacing={2} mt={2}>
                    {['Beginner', 'Intermediate', 'Advanced'].map((level, index) => (
                      <Checkbox key={index} onChange={handleFilterChange('levels')} value={level}>
                        {level}
                      </Checkbox>
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
                {isDisplayRating && (
                  <Stack spacing={2} mt={2}>
                    {[4.5, 4.0, 3.5, 3.0].map((rating, index) => (
                      <Checkbox key={index} onChange={handleFilterChange('ratings')} value={rating}>
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
                  Instructors
                  <FontAwesomeIcon icon={faPlus} />
                </Button>
                {isDisplayInstructors && (
                  <Stack spacing={2} mt={2}>
                    {Array.from(new Set(courses.map(course => course.instructor))).map((instructor, index) => (
                      <Checkbox key={index} onChange={handleFilterChange('instructors')} value={instructor}>
                        {instructor}
                      </Checkbox>
                    ))}
                  </Stack>
                )}
              </Box>

              {/* Price Section */}
              <Box>
                <Button
                  onClick={() => setIsDisplayPrice(!isDisplayPrice)}
                  variant="outline"
                  w="full"
                  justifyContent="space-between"
                >
                  Price
                  <FontAwesomeIcon icon={faPlus} />
                </Button>
                {isDisplayPrice && (
                  <Stack spacing={2} mt={2}>
                    {['Free', '$', '$$'].map((price, index) => (
                      <Checkbox key={index} onChange={handleFilterChange('prices')} value={price}>
                        {price}
                      </Checkbox>
                    ))}
                  </Stack>
                )}
              </Box>
            </Stack>

            <Spacer />

            {/* Course Cards Section */}
            <Grid templateColumns="repeat(3, 1fr)" gap={6} w="75%">
              {loading ? (
                <Text>Loading courses...</Text>
              ) : (
                currentCourses.map((course) => (
                  <Box key={course.id} borderWidth="1px" borderRadius="lg" overflow="hidden">
                    <Box p={4}>
                      <Heading as="h2" size="md">{course.title}</Heading>
                      <Text mt={2}>Instructor: {course.instructor}</Text>
                      <Text mt={2}>Rating: {course.rating}</Text>
                      <Text mt={2}>Price: {course.price}</Text>
                      <Button mt={4} colorScheme="blue">View Course</Button>
                    </Box>
                  </Box>
                ))
              )}
            </Grid>
          </Flex>

          {/* Pagination Section */}
          <Flex justify="space-between" mt={4}>
            <Button onClick={handlePrev} isDisabled={currentPage === 0}>
              <FontAwesomeIcon icon={faChevronLeft} />
            </Button>
            <Text>
              Page {currentPage + 1} of {Math.ceil(courses.length / itemsPerPage)}
            </Text>
            <Button onClick={handleNext} isDisabled={currentPage >= Math.ceil(courses.length / itemsPerPage) - 1}>
              <FontAwesomeIcon icon={faChevronRight} />
            </Button>
          </Flex>
        </Stack>
      </Container>
    </>
  );
};

export default CourseTable;
