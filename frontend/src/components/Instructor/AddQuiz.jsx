import React, { useState } from 'react';
import {
  Box,
  Button,
  Input,
  FormControl,
  FormLabel,
  VStack,
  HStack,
  Text,
  Divider,
  useToast,
  Heading,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Progress,
} from '@chakra-ui/react';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import Quill styles
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from '../../Firebase';

const AddQuiz = ({ lessonId, onClose }) => {
  const [quizTitle, setQuizTitle] = useState('');
  const [quizDescription, setQuizDescription] = useState('');
  const [quizTime, setQuizTime] = useState('');
  const [questions, setQuestions] = useState([{ question: '', options: ['', '', '', ''], correctOption: 0, file: null, fileUrl: '' }]);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [cancelUpload, setCancelUpload] = useState(false);
  const toast = useToast();

  // Handle question and option changes
  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index][field] = value;
    setQuestions(updatedQuestions);
  };

  const handleOptionChange = (questionIndex, optionIndex, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].options[optionIndex] = value;
    setQuestions(updatedQuestions);
  };

  const handleAddQuestion = () => {
    setQuestions([...questions, { question: '', options: ['', '', '', ''], correctOption: 0, file: null, fileUrl: '' }]);
  };

  const handleRemoveQuestion = (index) => {
    const updatedQuestions = questions.filter((_, i) => i !== index);
    setQuestions(updatedQuestions);
  };

  const handleFileChange = (index, event) => {
    const file = event.target.files[0];
    if (file) {
      const updatedQuestions = [...questions];
      updatedQuestions[index].file = file;
      setQuestions(updatedQuestions);
    }
  };

  
  const uploadFileToFirebase = async (file, questionIndex) => {
    const fileRef = ref(storage, `quizzes/${file.name + Date.now()}`);
    const uploadTask = uploadBytesResumable(fileRef, file);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          if (cancelUpload) {
            uploadTask.cancel();
            reject('Upload cancelled');
            return;
          }
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress((prev) => ({ ...prev, [questionIndex]: progress }));
        },
        (error) => reject(error),
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          const updatedQuestions = [...questions];
          updatedQuestions[questionIndex].fileUrl = downloadURL;
          setQuestions(updatedQuestions);

          resolve(downloadURL);
        }
      );
    });
  };
  const handleAddQuiz = async () => {
    setLoading(true);
    setUploadModalOpen(true);
  
    // Upload all files to Firebase before submitting the quiz
    const uploadPromises = questions.map((q, i) => {
      if (q.file) {
        return uploadFileToFirebase(q.file, i);
      }
      return Promise.resolve();
    });
  
    try {
      await Promise.all(uploadPromises); // Wait for all uploads to finish
  
      // Prepare form data with quiz details and question URLs
      const formData = {
        title: quizTitle,
        lesson: lessonId,
        durationMinutes: quizTime,
        questions: questions.map((q, index) => ({
          questionText: q.question,
          options: q.options.map((option, optionIndex) => ({
            optionText: option
         
          })),
          correctOptionIndex: q.correctOption,
          fileUrl: q.fileUrl || ''
          
        })),
      };
      const response = await axios.post(`https://kolo-temari-backend-service.onrender.com/api/course/lesson/${lessonId}/quiz`, formData,{withCredentials: true});
  
      if (response.data.status === 'success') {
        toast({
          title: 'Quiz added successfully!',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        onClose();
      } else {
        throw new Error('Failed to add quiz.');
      }
    } catch (error) {
      toast({
        title: 'Error adding quiz',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
      setUploadModalOpen(false);
    }
  };
  

  return (
    <Box p={6} maxW="1000px" mx="auto" borderWidth={1} borderRadius="md" boxShadow="md">
      
      {/* modal */}
      <Modal isOpen={uploadModalOpen} onClose={() => setUploadModalOpen(false)} size="md">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Uploading Files</ModalHeader>
          <ModalBody>
            <VStack spacing={4} align="stretch">
              {questions.map((q, index) => (
                q.file && (
                  <Box key={index}>
                    <Text>Question {index + 1}: {q.file.name}</Text>
                    <Progress value={uploadProgress[index] || 0} colorScheme="teal" />
                  </Box>
                )
              ))}
              <Text mt={4}>Note: You can cancel the upload if needed.</Text>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="red" onClick={() => setCancelUpload(true)}>
              Cancel Upload
            </Button>
            <Button colorScheme="blue" onClick={() => setUploadModalOpen(false)} ml={3}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/*  */}
      <Box mb={4} p={4} bg="blue.50" borderWidth={1} borderRadius="md" borderColor="blue.300">
          <Text fontSize="lg" fontWeight="bold" color="blue.800" mb={2}>
            Quiz Creation Tips
          </Text>
          <Text fontSize="md" color="blue.700" p={5}>
            <ul>
              <li>Ensure each question has at least one correct answer.</li>
              <li>Provide clear and concise options for each question.</li>
              <li>Attach relevant files if necessary (e.g., images or PDFs).</li>
              <li>Review all questions before submitting the quiz.</li>
            </ul>
          </Text>
        </Box>
      <Box mb={6} p={5} borderWidth={1} borderRadius="md" borderColor="gray.400" bg="gray.100">
        <Text textAlign="center" fontSize={25} color="red.600">Quiz Details Information</Text>
        <FormControl id="quizTitle" mb={4} isRequired>
          <FormLabel>Quiz Title</FormLabel>
          <Input
            value={quizTitle}
            onChange={(e) => setQuizTitle(e.target.value)}
            placeholder="Enter quiz title"
          />
        </FormControl>
        <FormControl id="quizDescription" mb={4} isRequired>
          <FormLabel>Quiz Description</FormLabel>
          <ReactQuill
            value={quizDescription}
            onChange={setQuizDescription}
            placeholder="Enter quiz description"
            theme="snow"
            modules={{
              toolbar: [
                [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
                [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                ['bold', 'italic', 'underline'],
                [{ 'align': [] }],
                ['link'],
                [{ 'color': [] }, { 'background': [] }],
                ['clean']
              ]
            }}
          />
        </FormControl>
        <FormControl id="quizTime" mb={4} isRequired>
          <FormLabel>Quiz Duration (in minutes)</FormLabel>
          <Input
            type="number"
            value={quizTime}
            onChange={(e) => setQuizTime(e.target.value)}
            placeholder="Enter quiz duration in minutes"
          />
        </FormControl>
      </Box>

      <Divider my={6} />

      {/* Questions Container */}
      <Box p={4} borderWidth={1} borderRadius="md" borderColor="gray.200" bg="gray.50">
        <VStack spacing={6} align="stretch">
          {questions.map((q, questionIndex) => (
            <Box key={questionIndex} p={4} borderWidth={1} borderRadius="md" borderColor="gray.300" bg="white">
              <FormControl id={`question-${questionIndex}`} mb={4} isRequired>
                <FormLabel>Question {questionIndex + 1}</FormLabel>
                <ReactQuill
                  value={q.question}
                  onChange={(value) => handleQuestionChange(questionIndex, 'question', value)}
                  placeholder="Enter the question"
                  theme="snow"
                />
              </FormControl>

              <FormControl id={`question-${questionIndex}-file`} mb={4}>
                <FormLabel>Attach Image/PDF (Optional)</FormLabel>
                <Input
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={(e) => handleFileChange(questionIndex, e)}
                />
              </FormControl>

              <FormLabel mb={2}>Options</FormLabel>
              <VStack spacing={4} align="stretch">
                {q.options.map((option, optionIndex) => (
                  <Box
                    key={optionIndex}
                    p={1}
                    borderRadius="md"
                    bg={optionIndex === 0 ? 'blue.50' : optionIndex === 1 ? 'green.50' : optionIndex === 2 ? 'purple.50' : 'red.50'}
                  >
                    <HStack spacing={4} align="center">
                      <FormControl mb={2} w="full">
                        <Input
                          value={option}
                          onChange={(e) => handleOptionChange(questionIndex, optionIndex, e.target.value)}
                          placeholder={`Option ${optionIndex + 1}`}
                        />
                      </FormControl>
                      <Button
                        variant={q.correctOption === optionIndex ? 'solid' : 'outline'}
                        colorScheme={q.correctOption === optionIndex ? 'teal' : 'gray'}
                        onClick={() => handleQuestionChange(questionIndex, 'correctOption', optionIndex)}
                      >
                        Correct
                      </Button>
                    </HStack>
                  </Box>
                ))}
              </VStack>

              <HStack spacing={4} mt={4}>
                <Button colorScheme="teal" onClick={handleAddQuestion}>
                  Add Another Question
                </Button>
                {questions.length > 1 && (
                  <Button colorScheme="red" onClick={() => handleRemoveQuestion(questionIndex)}>
                    Remove Question
                  </Button>
                )}
              </HStack>
            </Box>
          ))}
        </VStack>
      </Box>

      <Divider my={6} />

      <Button
        colorScheme="blue"
        onClick={handleAddQuiz}
        isLoading={loading}
        loadingText="Adding Quiz"
        w="full"
        mt={4}
      >
        Add Quiz
      </Button>
    </Box>
  );
};

export default AddQuiz;
