import React, { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Text,
  Stack,
  Heading,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  Link,
} from "@chakra-ui/react";
import axiosInstance from "../../utils/AxiosInstance"; // Your axios instance
import { useNavigate } from "react-router-dom"; // For navigation
import Cookies from "js-cookie"; // Import js-cookie

const SignInModal = ({ isOpen, onClose, onOpenSignin }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState(null);

  // Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // POST request to login endpoint
      const response = await axiosInstance.post("https://kolo-temari-backend-service.onrender.com/api/auth/login", formData);

      if (response.data.status === "success") {
        // On successful login, store tokens in cookies
        Cookies.set("authToken", response.data.token, { expires: 7 }); // 7 days expiration
        Cookies.set("refreshToken", response.data.refreshToken, { expires: 7 }); // 7 days expiration

        // Close the modal
        onClose();

        // Log user info to the console
        const user = response.data.data.user;
        console.log("User logged in successfully:", user);

        // Redirect based on user role
        if (user.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/land");
        }
      } else {
        setError("Login failed. Please try again.");
      }
    } catch (err) {
      // Improved error handling to display the actual error message
      if (err.response && err.response.data) {
        setError(err.response.data.message || "Invalid email or password.");
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size="sm" isCentered>
        <ModalOverlay />
        <ModalContent maxH="100vh" overflowY="auto" borderRadius="0">
          <ModalHeader bg="black" color="white" borderTopRadius="0" textAlign="center">
            <Heading as="h6" size="lg">
              Welcome Back!
            </Heading>
          </ModalHeader>

          <ModalBody bg="white">
            <Box>
              <form onSubmit={handleSubmit}>
                <Stack spacing={4} mt={4}>
                  <FormControl id="email" isRequired>
                    <FormLabel>Email</FormLabel>
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleChange}
                      bg="gray.100"
                    />
                  </FormControl>

                  <FormControl id="password" isRequired>
                    <FormLabel>Password</FormLabel>
                    <Input
                      type="password"
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={handleChange}
                      bg="gray.100"
                    />
                  </FormControl>

                  {error && <Text color="red.500">{error}</Text>}

                  <Link
                    href="/forgot-password"
                    color="blue.500"
                    fontSize="sm"
                    alignSelf="flex-end"
                    _hover={{ textDecoration: "underline" }}
                  >
                    Forgot Password?
                  </Link>

                  <Button
                    type="submit"
                    bg="orange.600"
                    color="white"
                    borderRadius="0"
                    width="full"
                    _hover={{
                      bg: "black",
                      color: "white",
                    }}
                  >
                    Sign In
                  </Button>
                </Stack>
              </form>
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default SignInModal;
