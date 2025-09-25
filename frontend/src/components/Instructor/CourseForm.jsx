import React, { useState } from 'react';
import {
  Box,Menu,MenuItem,MenuGroup,MenuButton,MenuList, Button, FormControl, FormLabel, Input, Select, Heading, VStack,
  Icon, useToast, Flex, Text, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, Progress, useDisclosure
} from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';

import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { StepIndicator } from './StepIndicator';
import { FaImage, FaVideo } from 'react-icons/fa';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

import axios from 'axios';
import { storage } from '../../Firebase';

const CourseForm = ({ toggleForm, onSubmitSuccess }) => {
  const [courses, setCourses] = useState([]);
  const [step, setStep] = useState(1);
  const [newCourse, setNewCourse] = useState({
    title: '',
    description: '',
    pic: '',
    trailer: '',
    category:'',
    status: 'free',
    price: 0,
    instructor: '',
  });
  const [uploadProgress, setUploadProgress] = useState({ pic: 0, trailer: 0 });
  const [filesToUpload, setFilesToUpload] = useState({});
  const [uploading, setUploading] = useState(false);
  const [editingCourseId, setEditingCourseId] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [uploadTasks, setUploadTasks] = useState({});
  const toast = useToast();

  const handleChange = (e) => {
    setNewCourse({ ...newCourse, [e.target.name]: e.target.value });
  };
  const handleCategorySelect = (category) => {
    setNewCourse((prevCourse) => ({
      ...prevCourse,
      category: category,
    }));
  };
  
  const handleEditorChange = (value) => {
    setNewCourse({ ...newCourse, description: value });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFilesToUpload((prev) => ({ ...prev, [name]: files[0] }));
    toast({
      title: `${name === 'pic' ? 'Image' : 'Video'} selected.`,
      description: `Selected file: ${files[0].name}`,
      status: 'info',
      duration: 3000,
      isClosable: true,
    });
  };

  const uploadFile = (file, type) => {
    const fileRef = ref(storage, `uploads/${file.name + Date.now()}`);
    const uploadTask = uploadBytesResumable(fileRef, file);

    setUploadTasks((prev) => ({ ...prev, [type]: uploadTask }));

    return new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress((prev) => ({ ...prev, [type]: progress }));
          if (type === 'pic') {
            setUploadProgress((prev) => ({ ...prev, trailer: 0 }));
          } else {
            setUploadProgress((prev) => ({ ...prev, pic: 0 }));
          }
        },
        (error) => reject(error),
        async () => {
          const url = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(url);
        }
      );
    });
  };

  const handleCancelUpload = () => {
    Object.values(uploadTasks).forEach((task) => task.cancel());
    setUploading(false);
    setUploadProgress({ pic: 0, trailer: 0 });
    setUploadTasks({});
    onClose();
    toast({
      title: 'Upload Canceled',
      description: 'The upload process has been canceled.',
      status: 'warning',
      duration: 3000,
      isClosable: true,
    });
  };

  const handleAddCourse = async () => {
    if (!newCourse.title || !newCourse.description || !newCourse.instructor) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setUploading(true);
    onOpen();
    try {
      const picUrl = filesToUpload.pic ? await uploadFile(filesToUpload.pic, 'pic') : newCourse.pic;
      const trailerUrl = filesToUpload.trailer ? await uploadFile(filesToUpload.trailer, 'trailer') : newCourse.trailer;

      const courseData = {
        title: newCourse.title,
        description: newCourse.description,
        pic: picUrl,
        category:newCourse.category,
        trailer: trailerUrl,
        status: newCourse.status,
        price: newCourse.status === 'paid' ? parseFloat(newCourse.price) : undefined,
        instructor: newCourse.instructor,
      };

      let response;
      if (editingCourseId) {
        response = await axios.put(`https://kolo-temari-backend-service.onrender.com/api/courses/${editingCourseId}`, courseData,{withCredentials:true});
      } else {
        response = await axios.post('https://kolo-temari-backend-service.onrender.com/api/courses', courseData,{withCredentials:true});
      }

      if (response.status === 200 || response.status === 201) {
        toast({
          title: 'Success',
          description: `Course successfully ${editingCourseId ? 'updated' : 'added'}.`,
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        if (editingCourseId) {
          setCourses((prev) => prev.map(course => (course._id === editingCourseId ? response.data.data.course : course)));
          setEditingCourseId(null);
        } else {
          setCourses((prev) => [...prev, response.data.data.course]);
        }
        resetForm();
        onSubmitSuccess(); // Call the callback function after successful submission
      } else {
        throw new Error(`Failed to ${editingCourseId ? 'update' : 'add'} course. Server responded with status code: ${response.status}`);
      }
    } catch (error) {
      if (error.code === 'storage/canceled') {
        console.log('Upload canceled by user');
      } else {
        toast({
          title: 'Error',
          description: 'Failed to save the course. Check console for details.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    } finally {
      setUploading(false);
      onClose();
    }
  };

  const handleSubmit = () => {
    if (step === 4) {
      handleAddCourse();
    }
  };

  const resetForm = () => {
    setNewCourse({
      title: '',
      description: '',
      category:'',
      pic: '',
      trailer: '',
      status: 'free',
      price: 0,
      instructor: '',
    });
    setFilesToUpload({});
    setStep(1);
  };

  return (
    <Box p={8} borderWidth={1} borderRadius="lg" borderColor="gray.200" width="100%" maxW="1250px" mx="auto" boxShadow="md">
      <Heading size="lg" mb={6}>Course Form</Heading>
      <Button colorScheme="red"  onClick={toggleForm} mt={4} borderRadius={25}>Cancel</Button>
      <StepIndicator
        currentStep={step}
        onStepClick={(num) => setStep(num)}
      />

      <VStack spacing={6} align="stretch">
        {step === 1 && (
          <>
         
            <FormControl>
            
              <FormLabel>Course Title</FormLabel>
              
              <Input
                type="text"
                name="title"
                value={newCourse.title}
                onChange={handleChange}
                placeholder="Enter course title"
                size="lg"
              />
            </FormControl>
            <Button colorScheme="blue" onClick={() => setStep(step + 1)}>Next</Button>
          </>
        )}
        {step === 2 && (
          <>
          <FormControl mt={4}>
  <FormLabel>Category</FormLabel>
  <Menu placement="bottom-start" closeOnSelect={false}>
    <MenuButton
      as={Button}
      rightIcon={<ChevronDownIcon />}
      w="100%"    // Full width for the button
      h="40px"    // Height for the dropdown button
      borderColor="red.300"
      _hover={{ borderColor: "red.300" }}
      _focus={{ borderColor: "red.400", boxShadow: "outline" }}
      textAlign="left"
    >
      {newCourse.category ? newCourse.category : "Select course category"}
    </MenuButton>

    <MenuList maxH="350px" overflowY="auto" w="100%">
      {/* Development */}
      <MenuGroup title="Development">
        <MenuItem onClick={() => handleCategorySelect("Web Development")}>Web Development</MenuItem>
        <MenuItem onClick={() => handleCategorySelect("Mobile Development")}>Mobile Development</MenuItem>
        <MenuItem onClick={() => handleCategorySelect("Game Development")}>Game Development</MenuItem>
        <MenuItem onClick={() => handleCategorySelect("Software Development")}>Software Development</MenuItem>
        <MenuItem onClick={() => handleCategorySelect("DevOps")}>DevOps</MenuItem>
      </MenuGroup>

      {/* IT & Software */}
      <MenuGroup title="IT & Software">
        <MenuItem onClick={() => handleCategorySelect("IT Fundamentals")}>IT Fundamentals</MenuItem>
        <MenuItem onClick={() => handleCategorySelect("Cloud Computing")}>Cloud Computing</MenuItem>
        <MenuItem onClick={() => handleCategorySelect("Cybersecurity")}>Cybersecurity</MenuItem>
        <MenuItem onClick={() => handleCategorySelect("Networking")}>Networking</MenuItem>
        <MenuItem onClick={() => handleCategorySelect("Database Administration")}>Database Administration</MenuItem>
        <MenuItem onClick={() => handleCategorySelect("Operating Systems")}>Operating Systems</MenuItem>
        <MenuItem onClick={() => handleCategorySelect("Blockchain")}>Blockchain</MenuItem>
      </MenuGroup>

      {/* Programming */}
      <MenuGroup title="Programming">
        <MenuItem onClick={() => handleCategorySelect("Programming Languages")}>Programming Languages</MenuItem>
        <MenuItem onClick={() => handleCategorySelect("Data Structures & Algorithms")}>Data Structures & Algorithms</MenuItem>
        <MenuItem onClick={() => handleCategorySelect("Artificial Intelligence")}>Artificial Intelligence</MenuItem>
        <MenuItem onClick={() => handleCategorySelect("Machine Learning")}>Machine Learning</MenuItem>
        <MenuItem onClick={() => handleCategorySelect("Data Science")}>Data Science</MenuItem>
        <MenuItem onClick={() => handleCategorySelect("Big Data")}>Big Data</MenuItem>
        <MenuItem onClick={() => handleCategorySelect("Automation")}>Automation</MenuItem>
      </MenuGroup>

      {/* Design */}
      <MenuGroup title="Design">
        <MenuItem onClick={() => handleCategorySelect("UI/UX Design")}>UI/UX Design</MenuItem>
        <MenuItem onClick={() => handleCategorySelect("Graphic Design")}>Graphic Design</MenuItem>
        <MenuItem onClick={() => handleCategorySelect("Web Design")}>Web Design</MenuItem>
      </MenuGroup>

      {/* Business & Marketing */}
      <MenuGroup title="Business & Marketing">
        <MenuItem onClick={() => handleCategorySelect("Digital Marketing")}>Digital Marketing</MenuItem>
        <MenuItem onClick={() => handleCategorySelect("Product Management")}>Product Management</MenuItem>
        <MenuItem onClick={() => handleCategorySelect("Entrepreneurship")}>Entrepreneurship</MenuItem>
        <MenuItem onClick={() => handleCategorySelect("Business Analytics")}>Business Analytics</MenuItem>
      </MenuGroup>

      {/* Other */}
      <MenuGroup title="Other Topics">
        <MenuItem onClick={() => handleCategorySelect("Project Management")}>Project Management</MenuItem>
        <MenuItem onClick={() => handleCategorySelect("Agile & Scrum")}>Agile & Scrum</MenuItem>
        <MenuItem onClick={() => handleCategorySelect("IT Certification Prep")}>IT Certification Prep</MenuItem>
        <MenuItem onClick={() => handleCategorySelect("Cloud Platforms (AWS, Azure, GCP)")}>
          Cloud Platforms (AWS, Azure, GCP)
        </MenuItem>
        <MenuItem onClick={() => handleCategorySelect("Game Design")}>Game Design</MenuItem>
      </MenuGroup>
    </MenuList>
  </Menu>
</FormControl>


            <FormControl>
              <FormLabel>Course Description</FormLabel>
              <ReactQuill
                theme="snow"
                value={newCourse.description}
                onChange={handleEditorChange}
                placeholder="Enter course description"
                style={{ height: '200px', marginBottom: '20px' }}
              />
            </FormControl>
            <Flex justify="space-between">
              <Button colorScheme="blue" onClick={() => setStep(step - 1)}>Back</Button>
              <Button colorScheme="blue" onClick={() => setStep(step + 1)}>Next</Button>
            </Flex>
          </>
        )}
        {step === 3 && (
          <>
            <FormControl>
              <FormLabel>Course Image <Icon as={FaImage} ml={2} /></FormLabel>
              <Flex alignItems="center" border="2px dashed gray" p={4} borderRadius="md" position="relative">
                <Input
                  type="file"
                  name="pic"
                  accept="image/*"
                  onChange={handleFileChange}
                  height="100px"
                  width="100%"
                  opacity={0}
                  position="absolute"
                  cursor="pointer"
                />
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  flex="1"
                  height="100px"
                  cursor="pointer"
                  color="gray.400"
                >
                  {filesToUpload.pic ? filesToUpload.pic.name : "Click to upload image"}
                </Box>
              </Flex>
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Course Trailer <Icon as={FaVideo} ml={2} /></FormLabel>
              <Flex alignItems="center" border="2px dashed gray" p={4} borderRadius="md" position="relative">
                <Input
                  type="file"
                  name="trailer"
                  accept="video/*"
                  onChange={handleFileChange}
                  height="100px"
                  width="100%"
                  opacity={0}
                  position="absolute"
                  cursor="pointer"
                />
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  flex="1"
                  height="100px"
                  cursor="pointer"
                  color="gray.400"
                >
                  {filesToUpload.trailer ? filesToUpload.trailer.name : "Click to upload video"}
                </Box>
              </Flex>
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Status</FormLabel>
              <Select
                name="status"
                value={newCourse.status}
                onChange={handleChange}
                placeholder="Select status"
                size="lg"
              >
                <option value="free">Free</option>
                <option value="paid">Paid</option>
              </Select>
            </FormControl>

            {newCourse.status === 'paid' && (
              <FormControl mt={4}>
                <FormLabel>Price</FormLabel>
                <Input
                  type="number"
                  name="price"
                  value={newCourse.price}
                  onChange={handleChange}
                  placeholder="Enter course price"
                  size="lg"
                />
              </FormControl>
            )}

            <FormControl mt={4}>
              <FormLabel>Instructor</FormLabel>
              <Input
                type="text"
                name="instructor"
                value={newCourse.instructor}
                onChange={handleChange}
                placeholder="Enter instructor name"
                size="lg"
              />
            </FormControl>

            <Flex justify="space-between" mt={6}>
              <Button colorScheme="blue" onClick={() => setStep(step - 1)}>Back</Button>
              <Button colorScheme="blue" onClick={() => setStep(step + 1)}>Next</Button>
            </Flex>
          </>
        )}
        {step === 4 && (
          <>
            <Flex direction="column" align="center">
              <Button colorScheme="blue" onClick={handleSubmit}>Submit</Button>
            </Flex>
          </>
        )}
      </VStack>

      <Modal isOpen={isOpen} onClose={handleCancelUpload}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Uploading Files</ModalHeader>
          <ModalCloseButton />
          <ModalBody p={8}>
            <Text mb={4}>Uploading files. Please wait...</Text>
            {uploading && (
              <>
              <Text>Image upload: {Math.round(uploadProgress.pic)}%</Text>
                <Progress hasStripe value={uploadProgress.pic} mb={4} colorScheme="teal" />
             <Text>Video upload: {Math.round(uploadProgress.trailer)}%</Text> 
                <Progress hasStripe value={uploadProgress.trailer} mt={4} colorScheme="teal" />
             <Button mt={4} colorScheme="red" onClick={handleCancelUpload}>Cancel</Button> 
               
              </>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default CourseForm;
