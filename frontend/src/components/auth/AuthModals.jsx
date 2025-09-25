import React from "react";
import { Button, useDisclosure } from "@chakra-ui/react";
import SignupModal from "./Signup"; // Assuming this is your sign-up modal
import SignInModal from "./Signin";

const AuthModals = ({ fetchUserInfo, setIsLoggedIn }) => {
  const { isOpen: isSignupOpen, onOpen: onOpenSignup, onClose: onCloseSignup } = useDisclosure();
  const { isOpen: isSignInOpen, onOpen: onOpenSignIn, onClose: onCloseSignIn } = useDisclosure();

  return (
    <>
      <Button 
        onClick={onOpenSignup}
        p={3}
        bg="black"
        color="white"
        borderRadius="0"
        width="full"
        border="2px solid black"
        _hover={{
          bg: "orange.600",
          color: "white",
        }}
      >
        Sign Up
      </Button>

      <Button 
        onClick={onOpenSignIn}
        p={3}
        bg="white"
        color="black"
        borderRadius="0"
        width="full"
        border="2px solid black"
        _hover={{
          bg: "black",
          color: "white",
        }}
      >
        Login
      </Button>

      {/* Sign Up Modal */}
      <SignupModal 
        isOpen={isSignupOpen} 
        onClose={onCloseSignup} 
        onOpenSignin={() => { onCloseSignup(); onOpenSignIn(); }} 
      />

      {/* Sign In Modal */}
      <SignInModal 
        isOpen={isSignInOpen} 
        onClose={onCloseSignIn} 
        fetchUserInfo={fetchUserInfo} 
        setIsLoggedIn={setIsLoggedIn} // Pass setIsLoggedIn here
      />
    </>
  );
};

export default AuthModals;
