import React from "react";
import { Button, Stack, useToast } from "@chakra-ui/react";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { app } from "../../Firebase";
import { useNavigate } from "react-router-dom";

const GAuth = () => {
  const navigate = useNavigate();
  const toast = useToast();

  const handleGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);

      const result = await signInWithPopup(auth, provider);

      // You can store the user info as needed
      const user = result.user;

      // Example of storing user data locally
      localStorage.setItem("userData", JSON.stringify({
        name: user.displayName,
        email: user.email,
        photo: user.photoURL,
      }));

      // Navigate to the home page after successful sign-in
      navigate("/");
    } catch (error) {
      console.error("Could not sign in with Google", error);
      toast({
        title: "Error",
        description: "Could not sign in with Google. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Stack spacing={4} mt={4}>
      <Button
        onClick={handleGoogleClick}
        colorScheme="orange"
        variant="solid"
        width="full"
        size="lg"
      >
        CONTINUE WITH GOOGLE
      </Button>
    </Stack>
  );
};

export default GAuth;
