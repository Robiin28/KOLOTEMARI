import React, { useState } from "react";
import {
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Text,
  Link,
  Stack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  useDisclosure,
} from "@chakra-ui/react";
import axiosInstance from "../../utils/AxiosInstance"; // Your axios instance
import GAuth from "./GAuth"; // Placeholder for your GAuth component
import { useNavigate } from "react-router-dom"; // Import useNavigate from React Router

const SignupModal = ({ isOpen, onClose, onOpenSignin }) => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState(null); // State to hold error messages
  const [success, setSuccess] = useState(null); // State to hold success messages

  const navigate = useNavigate(); // Hook for navigation

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      // POST request to signup endpoint
      const response = await axiosInstance.post("https://kolo-temari-backend-service.onrender.com/api/auth/signup", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        confirmPassword:formData.confirmPassword
      });

      if (response.data.status === "success") {
        setSuccess("Signup successful! You can now log in.");
        setError(null); // Clear any previous errors
        // Redirect to validation page and send form data
        navigate("/validate", {
          state: {
            email: formData.email,
            name: formData.name,
          },
        });
        onClose(); // Close the signup modal
      } else {
        setError("Signup failed. Please try again.");
      }
    } catch (err) {
      // Improved error handling to display the actual error message
      if (err.response && err.response.data) {
        setError(err.response.data.message || "An unexpected error occurred.");
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <ModalOverlay />
      <ModalContent maxH="100vh" overflowY="auto" borderRadius="0">
        <ModalHeader bg="black" color="white" borderRadius="0">
          <Heading as="h6" size="lg" textAlign="center">
            Hi, Welcome Join Us!
          </Heading>
        </ModalHeader>
        <ModalBody bg="white">
          <Stack spacing={3} mt={1}>
            {error && <Text color="red.500">{error}</Text>} {/* Show error message */}
            {success && <Text color="green.500">{success}</Text>} {/* Show success message */}

            <FormControl id="name" isRequired>
              <FormLabel>name</FormLabel>
              <Input
                placeholder="enter your name"
                bg="gray.100"
                onChange={handleChange}
              />
            </FormControl>

            <FormControl id="email" isRequired>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                placeholder="Email"
                bg="gray.100"
                onChange={handleChange}
              />
            </FormControl>

            <FormControl id="password" isRequired>
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                placeholder="Password"
                bg="gray.100"
                onChange={handleChange}
              />
            </FormControl>

            <FormControl id="confirmPassword" isRequired>
              <FormLabel>Confirm Password</FormLabel>
              <Input
                type="password"
                placeholder="Confirm Password"
                bg="gray.100"
                onChange={handleChange}
              />
            </FormControl>

            <Button
              bg="orange.600"
              color="white"
              width="full"
              _hover={{
                bg: "black",
                color: "white",
              }}
              onClick={handleSubmit}
            >
              Sign Up
            </Button>

            <GAuth /> {/* Placeholder for Google Auth component */}

            <Text textAlign="center" mt={3}>
              Already have an account?{" "}
              <Link color="orange.600" onClick={onOpenSignin}>
                Sign In
              </Link>
            </Text>
          </Stack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default SignupModal;
