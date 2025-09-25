import React from "react";
import { Box, Heading as ChakraHeading } from "@chakra-ui/react";

const Heading = ({ subtitle, title }) => {
  return (
    <Box id='heading' textAlign="center" marginY="20px">
      <ChakraHeading as="h3" size="lg" color="orange.600">
        {subtitle}
      </ChakraHeading>
      <ChakraHeading as="h1" size="2xl" color="gray.800" marginTop="10px">
        {title}
      </ChakraHeading>
    </Box>
  );
};

export default Heading;
