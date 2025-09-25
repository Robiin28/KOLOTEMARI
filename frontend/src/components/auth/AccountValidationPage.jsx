    import React, { useState, useRef } from "react";
    import {
    Button,
    FormControl,
    FormLabel,
    Heading,
    Input,
    Text,
    Stack,
    HStack,
    } from "@chakra-ui/react";

    import { useLocation, useNavigate } from "react-router-dom";
    import axios from "axios";
    const AccountValidationPage = () => {
    const [verificationCode, setVerificationCode] = useState(Array(8).fill(""));
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [isCodeSent, setIsCodeSent] = useState(false);
    const inputRefs = useRef([]);

    const location = useLocation();
    const navigate = useNavigate();
    const formData = location.state; 
    const { email } = formData; // Destructure to get email or other necessary details
    const handleCodeChange = (e, index) => {
        const value = e.target.value;
        if (value.match(/^[0-9]$/)) {
        const newCode = [...verificationCode];
        newCode[index] = value;
        setVerificationCode(newCode);

        // Move focus to the next input box
        if (index < 7 && value) {
            inputRefs.current[index + 1].focus();
        }
        }
    };

    const handleBackspace = (e, index) => {
        if (e.key === "Backspace" && verificationCode[index] === "") {
        if (index > 0) {
            inputRefs.current[index - 1].focus();
        }
        }
    };

    const handleValidation = async (e) => {
        e.preventDefault();
        const code = verificationCode.join(""); // Combine digits into a string
      console.log(code);
        try {
        const response = await axios.post("https://kolo-temari-backend-service.onrender.com/api/auth/validateNow", {
            email:email, 
            validationNumber: code,
        });
        console.log(code);

        if (response.data.status === "success") {
            setSuccess("Account verified successfully!");
            setError(null);
            navigate("/success");
        } else {
            setError("Invalid verification code. Please try again.");
        }
        } catch (err) {
        setError("An error occurred. Please try again.");
        }
    };

    const handleSendCode = async () => {
        try {
        await axios.post("https://kolo-temari-backend-service.onrender.com/api/auth/validate", {
            email: email,
        },{withCredentials:true});
        setIsCodeSent(true);
        setSuccess("Verification code sent to your email.");
        setError(null);
        } catch (err) {
        setError("Failed to send verification code. Please try again.");
        }
    };

    return (
        <Stack spacing={4} maxWidth="400px" mx="auto" mt={8} p={5} boxShadow="lg">
        <Heading as="h3" size="lg" textAlign="center">
            Verify Your Account
        </Heading>

        {!isCodeSent && (
            <Button
            bg="orange.600"
            color="white"
            width="full"
            _hover={{ bg: "black", color: "white" }}
            onClick={handleSendCode}
            >
            Send Verification Code
            </Button>
        )}

        {error && <Text color="red.500">{error}</Text>}
        {success && <Text color="green.500">{success}</Text>}

        {isCodeSent && (
            <FormControl id="verificationCode" isRequired>
            <FormLabel>Enter Verification Code</FormLabel>
            <HStack spacing={2} justify="center">
                    {verificationCode.map((digit, index) => (
                        <Input
                        key={index}
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleCodeChange(e, index)}
                        onKeyDown={(e) => handleBackspace(e, index)}
                        ref={(el) => (inputRefs.current[index] = el)} // Store input refs for navigation
                        textAlign="center"
                        bg="gray.100"
                        fontSize="2xl"
                        width="3rem"
                        padding="0.5rem" // Add padding for better visibility
                        boxShadow="md" // Optional: Add shadow to enhance the input field
                        />
                    ))}
            </HStack>

            </FormControl>
        )}

        {isCodeSent && (
            <Button
            bg="orange.600"
            color="white"
            width="full"
            _hover={{ bg: "black", color: "white" }}
            onClick={handleValidation}
            >
            Verify Account
            </Button>
        )}
        </Stack>
    );
    };

    export default AccountValidationPage;
