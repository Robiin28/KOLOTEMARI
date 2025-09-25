import React from 'react';
import './add.css'; // Make sure to import the CSS
import { Box, Button, Heading, Input, FormControl, FormLabel } from '@chakra-ui/react';

export const SignUpBox = () => {
  return (
    <div className="containers">
      <div className='headSign'>
        <h1>Get your Training <span className='free'>for free</span></h1>
      </div>
      <div className="signBox">
        <Heading as="h1" size="lg" marginBottom="20px">Sign Up Now</Heading>

        <FormControl isRequired position="relative" marginTop="20px">
          <Input 
            type="text" 
            placeholder=" " 
            size="lg" 
            className="floating-input"
          />
          <FormLabel className="floating-label">What's your name...</FormLabel>
        </FormControl>

        <FormControl isRequired position="relative" marginTop="20px">
          <Input 
            type="email" 
            placeholder=" " 
            size="lg" 
            className="floating-input"
          />
          <FormLabel className="floating-label">What's your email...</FormLabel>
        </FormControl>

        <FormControl isRequired position="relative" marginTop="20px">
          <Input 
            type="tel" 
            placeholder=" " 
            size="lg" 
            className="floating-input"
          />
          <FormLabel className="floating-label">What's your phone...</FormLabel>
        </FormControl>

        <Button 
          type="submit" 
          colorScheme="orange" 
          width="100%" 
          marginTop="20px"
          size="lg"
        >
          Get In!
        </Button>
      </div>
      <style jsx>{`
        .floating-label {
          position: absolute;
          left: 15px;
          top: 12px;
          color: #888;
          transition: 0.2s ease all;
          pointer-events: none;
        }

        .floating-input:focus + .floating-label,
        .floating-input:not(:placeholder-shown) + .floating-label {
          top: -10px;
          left: 15px;
          font-size: 12px;
          color: #eb6104;
        }

        .floating-input {
          padding: 24px 15px 10px; /* Adjust padding for label positioning */
          border: 1px solid #201f1f;
          border-radius: 4px;
          transition: border-color 0.3s ease, box-shadow 0.3s ease; /* Transition for border color and shadow */
        }

        .floating-input:focus {
          border-color: #eb6104;
          outline: none;
          box-shadow: 0 0 5px rgba(235, 97, 4, 0.5); /* Subtle shadow on focus */
        }
      `}</style>
    </div>
  );
}
