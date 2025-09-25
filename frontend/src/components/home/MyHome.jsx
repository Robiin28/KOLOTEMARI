import React from "react";
import { Button } from "@chakra-ui/react"; // Import Chakra UI Button
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "./myHome.css";

export const MyHome = () => {
  const navigate = useNavigate(); // Initialize useNavigate

  // Function to handle button click for enrollment
  const handleEnrollNow = () => {
    navigate("/course"); // Navigate to /course
  };

  // Function to handle button click for viewing courses
  const handleViewCourse = () => {
    navigate("/course"); // Navigate to /course
  };

  return (
    <div className="home-container">
      <div className="headHome">
        <h1>BE BETTER <br />LEARN BETTER</h1>
      </div>
      <div className="headImage">
        <img src="/image/real.png" alt="Background" className="background-image" />
        <div className="triangle"></div>
      </div>

      <section className="home">
        <div className="container">
          <div className="row">
            <p></p>
            <div className="button-group">
              <Button 
                onClick={handleEnrollNow} // Set onClick handler
                bg="white" // White background
                color="orange.600" // Orange text color
                size="lg" // Large size
                padding="26px 42px" // Increased padding for larger button
                ml={4} // Left margin for spacing
                borderRadius="10px 0 0 30px" // Curve left side
                rightIcon={<i className="fa fa-long-arrow-alt-right"></i>}
              >
                Enroll Now
              </Button>
              <Button 
                onClick={handleViewCourse} // Set onClick handler
                bg="orange.600" // Orange background
                color="white" // White text color
                size="lg" // Large size
                padding="26px 42px" // Increased padding for larger button
                ml={4} // Left margin for spacing
                borderRadius="0 10px 30px 0" // Curve right side
                rightIcon={<i className="fa fa-long-arrow-alt-right"></i>}
              >
                VIEW COURSE
              </Button>
            </div>
          </div>
        </div>
      </section>
      <div className="margin"></div>
    </div>
  );
};
