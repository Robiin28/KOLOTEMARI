import React, { useState } from 'react';
import { Box, Button, Input, VStack, FormControl, FormLabel, useToast, HStack, IconButton, Text } from '@chakra-ui/react';
import { ArrowBackIcon, ArrowForwardIcon, AddIcon, MinusIcon } from '@chakra-ui/icons';
import { FaImage, FaVideo } from 'react-icons/fa';
import { storage } from '../../Firebase'; // Import Firebase storage
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import React Quill's styles

const AddLessonForm = ({ section, onAddLesson, onCancel }) => {
  const [step, setStep] = useState(1);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [description, setDescription] = useState('');
  const [videoFiles, setVideoFiles] = useState([null]);
  const [resourceFiles, setResourceFiles] = useState([null]);
  const [picFiles, setPicFiles] = useState([null]);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  // Handle file input changes
  const handleFileChange = (index, event, type) => {
    const setFiles = {
      video: setVideoFiles,
      resource: setResourceFiles,
      pic: setPicFiles,
    }[type];

    const files = {
      video: videoFiles,
      resource: resourceFiles,
      pic: picFiles,
    }[type];

    const newFiles = [...files];
    newFiles[index] = event.target.files[0];
    setFiles(newFiles);
  };

  // Add a new file input
  const addField = (type) => {
    const setFiles = {
      video: setVideoFiles,
      resource: setResourceFiles,
      pic: setPicFiles,
    }[type];

    const files = {
      video: videoFiles,
      resource: resourceFiles,
      pic: picFiles,
    }[type];

    setFiles([...files, null]);
  };

  // Remove a file input
  const removeField = (index, type) => {
    const setFiles = {
      video: setVideoFiles,
      resource: setResourceFiles,
      pic: setPicFiles,
    }[type];

    const files = {
      video: videoFiles,
      resource: resourceFiles,
      pic: picFiles,
    }[type];

    setFiles(files.filter((_, i) => i !== index));
  };

  // Upload files to Firebase
  const uploadFilesToFirebase = async () => {
    setLoading(true);
    try {
      // Upload videos
      const videoPromises = videoFiles.map(async (file) => {
        if (!file) return ''; // Skip empty inputs
        const videoRef = ref(storage, `videos/${file.name}`);
        await uploadBytes(videoRef, file);
        return await getDownloadURL(videoRef);
      });
      const videoUrls = await Promise.all(videoPromises);

      // Upload resources
      const resourcePromises = resourceFiles.map(async (file) => {
        if (!file) return ''; // Skip empty inputs
        const resourceRef = ref(storage, `resources/${file.name}`);
        await uploadBytes(resourceRef, file);
        return await getDownloadURL(resourceRef);
      });
      const resourceUrls = await Promise.all(resourcePromises);

      // Upload pictures
      const picPromises = picFiles.map(async (file) => {
        if (!file) return ''; // Skip empty inputs
        const picRef = ref(storage, `images/${file.name}`);
        await uploadBytes(picRef, file);
        return await getDownloadURL(picRef);
      });
      const picUrls = await Promise.all(picPromises);

      return { videoUrls, resourceUrls, picUrls };
    } catch (error) {
      toast({ title: 'Upload failed', description: error.message, status: 'error' });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      const { videoUrls: uploadedVideoUrls, resourceUrls: uploadedResourceUrls, picUrls: uploadedPicUrls } = await uploadFilesToFirebase();
      
      const lessonData = {
        courseId: section.courseId,
        sectionId: section._id,
        title,
        content,
        description,
        videoUrls: uploadedVideoUrls,
        pic: uploadedPicUrls[0], // Use the first picture URL
        resources: uploadedResourceUrls,
      };

      // Log the lesson data before sending
      console.log("Lesson Data to be submitted:", lessonData);
  
      // Submit lesson data
      const response = await axios.post(`https://kolo-temari-backend-service.onrender.com/api/courses/${section.courseId}/sections/${section._id}/lessons`, lessonData, { withCredentials: true });
      if (response.data.status === 'success') {
        toast({ title: 'Lesson added successfully', status: 'success' });
        onAddLesson(response.data.data.lesson);
      } else {
        throw new Error('Failed to add lesson');
      }
    } catch (error) {
      toast({ title: 'Failed to add lesson', description: error.message, status: 'error' });
    }
  };

  return (
    <Box p={6} borderWidth={1} borderRadius="md" boxShadow="md" maxW="1200px" mx="auto">
      <Text fontSize="lg" mb={4} fontWeight="bold">Step {step} of 6</Text>

      {step === 1 && (
        <VStack spacing={4} align="stretch">
          <FormControl id="title" isRequired>
            <FormLabel>Title</FormLabel>
            <Input 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              placeholder="Enter lesson title"
            />
          </FormControl>
          <HStack spacing={4}>
            <Button colorScheme="teal" onClick={() => setStep(2)}>Next</Button>
            <Button variant="outline" onClick={onCancel}>Cancel</Button>
          </HStack>
        </VStack>
      )}

      {/* Step 2: Description */}
      {step === 2 && (
        <VStack spacing={4} align="stretch">
          <FormControl id="description" isRequired>
            <FormLabel>Description</FormLabel>
            <ReactQuill 
              value={description} 
              onChange={setDescription} 
              placeholder="Enter lesson description"
            />
          </FormControl>
          <HStack spacing={4}>
            <Button leftIcon={<ArrowBackIcon />} onClick={() => setStep(1)}>Back</Button>
            <Button colorScheme="teal" onClick={() => setStep(3)}>Next</Button>
          </HStack>
        </VStack>
      )}

      {/* Step 3: Content */}
      {step === 3 && (
        <VStack spacing={4} align="stretch">
          <FormControl id="content" isRequired>
            <FormLabel>Content</FormLabel>
            <ReactQuill 
              value={content} 
              onChange={setContent} 
              placeholder="Enter lesson content"
            />
          </FormControl>
          <HStack spacing={4}>
            <Button leftIcon={<ArrowBackIcon />} onClick={() => setStep(2)}>Back</Button>
            <Button colorScheme="teal" onClick={() => setStep(4)}>Next</Button>
          </HStack>
        </VStack>
      )}

      {/* Step 4: Video Upload */}
      {step === 4 && (
        <VStack spacing={4} align="stretch">
          <FormControl id="videoFiles">
            <FormLabel>
              Upload Video
              <FaVideo style={{ marginLeft: '8px' }} />
            </FormLabel>
            {videoFiles.map((videoFile, index) => (
              <HStack spacing={4} key={index} mb={2}>
                <label style={{ display: 'flex', alignItems: 'center', background: '#f0f0f0', border: '1px solid #ccc', borderRadius: '4px', padding: '8px', cursor: 'pointer', width: '100%', height: '40px', fontSize: '16px' }}>
                  <Input
                    type="file"
                    accept="video/*"
                    height="40px"
                    width="100%"
                    onChange={(event) => handleFileChange(index, event, 'video')}
                    style={{ display: 'none' }} // Hide default file input
                  />
                  <Text as="span">Choose Video {index + 1}</Text>
                </label>
                {index > 0 && (
                  <IconButton
                    aria-label="Remove video"
                    icon={<MinusIcon />}
                    onClick={() => removeField(index, 'video')}
                    variant="outline"
                  />
                )}
                {index === videoFiles.length - 1 && (
                  <IconButton
                    aria-label="Add another video"
                    icon={<AddIcon />}
                    onClick={() => addField('video')}
                    variant="outline"
                  />
                )}
              </HStack>
            ))}
          </FormControl>
          <HStack spacing={4}>
            <Button leftIcon={<ArrowBackIcon />} onClick={() => setStep(3)}>Back</Button>
            <Button colorScheme="teal" onClick={() => setStep(5)}>Next</Button>
          </HStack>
        </VStack>
      )}

      {/* Step 5: Resource Upload */}
      {step === 5 && (
        <VStack spacing={4} align="stretch">
          <FormControl id="resourceFiles">
            <FormLabel>
              Upload Resource
            </FormLabel>
            {resourceFiles.map((resourceFile, index) => (
              <HStack spacing={4} key={index} mb={2}>
                <label style={{ display: 'flex', alignItems: 'center', background: '#f0f0f0', border: '1px solid #ccc', borderRadius: '4px', padding: '8px', cursor: 'pointer', width: '100%', height: '40px', fontSize: '16px' }}>
                  <Input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    height="40px"
                    width="100%"
                    onChange={(event) => handleFileChange(index, event, 'resource')}
                    style={{ display: 'none' }} // Hide default file input
                  />
                  <Text as="span">Choose Resource {index + 1}</Text>
                </label>
                {index > 0 && (
                  <IconButton
                    aria-label="Remove resource"
                    icon={<MinusIcon />}
                    onClick={() => removeField(index, 'resource')}
                    variant="outline"
                  />
                )}
                {index === resourceFiles.length - 1 && (
                  <IconButton
                    aria-label="Add another resource"
                    icon={<AddIcon />}
                    onClick={() => addField('resource')}
                    variant="outline"
                  />
                )}
              </HStack>
            ))}
          </FormControl>
          <HStack spacing={4}>
            <Button leftIcon={<ArrowBackIcon />} onClick={() => setStep(4)}>Back</Button>
            <Button colorScheme="teal" onClick={() => setStep(6)}>Next</Button>
          </HStack>
        </VStack>
      )}

      {/* Step 6: Picture Upload */}
      {step === 6 && (
        <VStack spacing={4} align="stretch">
          <FormControl id="picFiles">
            <FormLabel>
              Upload Picture
              <FaImage style={{ marginLeft: '8px' }} />
            </FormLabel>
            {picFiles.map((picFile, index) => (
              <HStack spacing={4} key={index} mb={2}>
                <label style={{ display: 'flex', alignItems: 'center', background: '#f0f0f0', border: '1px solid #ccc', borderRadius: '4px', padding: '8px', cursor: 'pointer', width: '100%', height: '40px', fontSize: '16px' }}>
                  <Input
                    type="file"
                    accept="image/*"
                    height="40px"
                    width="100%"
                    onChange={(event) => handleFileChange(index, event, 'pic')}
                    style={{ display: 'none' }} // Hide default file input
                  />
                  <Text as="span">Choose Picture {index + 1}</Text>
                </label>
                {index > 0 && (
                  <IconButton
                    aria-label="Remove picture"
                    icon={<MinusIcon />}
                    onClick={() => removeField(index, 'pic')}
                    variant="outline"
                  />
                )}
                {index === picFiles.length - 1 && (
                  <IconButton
                    aria-label="Add another picture"
                    icon={<AddIcon />}
                    onClick={() => addField('pic')}
                    variant="outline"
                  />
                )}
              </HStack>
            ))}
          </FormControl>
          <HStack spacing={4}>
            <Button leftIcon={<ArrowBackIcon />} onClick={() => setStep(5)}>Back</Button>
            <Button colorScheme="teal" onClick={handleSubmit} isLoading={loading}>Submit</Button>
          </HStack>
        </VStack>
      )}
    </Box>
  );
};

export default AddLessonForm;
