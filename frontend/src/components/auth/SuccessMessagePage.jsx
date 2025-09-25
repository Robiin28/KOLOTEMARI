import React, { useState } from "react";
import { Stack, Heading, Text, Button } from "@chakra-ui/react";
import SignInModal from "./Signin"; // Adjust the path as needed

const SuccessMessagePage = () => {
  const [isSigninOpen, setIsSigninOpen] = useState(false);

  const handleOpenSignin = () => {
    setIsSigninOpen(true);
  };

  const handleCloseSignin = () => {
    setIsSigninOpen(false);
  };

  return (
    <Stack spacing={4} maxWidth="400px" mx="auto" mt={8} p={5} boxShadow="lg">
      <Heading as="h3" size="lg" textAlign="center">
        Registration Successful!
      </Heading>
      <Text textAlign="center" fontSize="lg">
        Your account has been created successfully. You can now log in to your account.
      </Text>
      <Button
        bg="orange.600"
        color="white"
        width="full"
        _hover={{ bg: "black", color: "white" }}
        onClick={handleOpenSignin} // Open the SignInModal when clicked
      >
        Log In
      </Button>

      {/* SignInModal Component */}
      <SignInModal isOpen={isSigninOpen} onClose={handleCloseSignin} />
    </Stack>
  );
};

export default SuccessMessagePage;
