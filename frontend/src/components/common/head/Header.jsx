import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import {
  IconButton,
  useToast,
  Avatar,
  Box,
  HStack,
  Text,
  InputGroup,
  Input,
  InputRightElement,
} from "@chakra-ui/react";
import { GiShoppingCart } from "react-icons/gi";
import { MdLogout } from "react-icons/md";
import axiosInstance from "../../../utils/AxiosInstance";
import Cookies from "js-cookie";
import AuthModals from "../../auth/AuthModals";
import "./header.css";

export const Header = () => {
  const [click, setClick] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("User");
  const [userAvatar, setUserAvatar] = useState("/path/to/placeholder/avatar.png");
  const [user, setUser] = useState(null);
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const token = Cookies.get("authToken");
    if (token) {
      setIsLoggedIn(true);
      const tokenParts = token.split(".");
      if (tokenParts.length === 3) {
        try {
          const userData = JSON.parse(atob(tokenParts[1]));
          setUserName(userData.name || "User");
          setUserAvatar(userData.avatar || "/path/to/placeholder/avatar.png");
          fetchUserInfo(userData.id);
        } catch (error) {
          console.error("Error parsing user data:", error);
        }
      }
    }
  }, []);

  const fetchUserInfo = async (userId) => {
    try {
      const response = await axiosInstance.get("auth/me");
      setUser(response.data.data.user);
      setUserAvatar(response.data.data.user.pic || userAvatar);
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await axiosInstance.post("auth/logout");
      Cookies.remove("authToken");
      setIsLoggedIn(false);
      toast({
        title: "Logged out",
        description: "You have been logged out successfully.",
        status: "info",
        duration: 3000,
        isClosable: true,
      });
      navigate("/");
    } catch (error) {
      toast({
        title: "Logout failed",
        description: error.response?.data?.message || "An error occurred during logout.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const SearchBar = () => (
    <InputGroup
      size="md"
      position="absolute"
      top="15px"
      left={{ base: "4vh", md: "59vh" }}
      width={{ base: "0", md: "auto" }}
      opacity={{ base: 0, md: 1 }}
      transition="opacity 0.3s"
    >
      <Input
        placeholder="Search course"
        borderRadius="18px"
        paddingRight="30px"
        focusBorderColor="#1eb2a6"
      />
      <InputRightElement children={<FaSearch />} />
    </InputGroup>
  );

  return (
    <>
      <section className="head">
        <div className="container flexSB">
          <div className="logo">
            <h1>Kolo Temari</h1>
            <img src="/image/Kolo.png" alt="Background" className="logoImage" />
            <span className="spam">ONLINE EDUCATION & LEARNING</span>
          </div>

          <div className="social">
            <i className="fab fa-facebook-f icon"></i>
            <i className="fab fa-instagram icon"></i>
            <i className="fab fa-twitter icon"></i>
            <i className="fab fa-youtube icon"></i>
          </div>

          <div
            className="action-btn"
            style={{
              position: "absolute",
              right: "20px",
              top: "9px",
              display: "flex",
              alignItems: "center",
            }}
          >
            {isLoggedIn ? (
              <>
                <IconButton
                  icon={<GiShoppingCart />}
                  aria-label="Go to Cart"
                  variant="solid"
                  colorScheme="orange"
                  style={{
                    backgroundColor: "#C65D0D",
                    color: "white",
                    position: "absolute",
                    top: "4px",
                    right: "130px",
                    padding: "10px",
                    fontWeight: "bold",
                    transition: "background-color 0.3s",
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#FFA500")}
                  onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#C65D0D")}
                  onClick={() => navigate("/cart")}
                />
                <IconButton
                  icon={<MdLogout />}
                  aria-label="Logout"
                  variant="solid"
                  colorScheme="white"
                  style={{
                    backgroundColor: "white",
                    color: "black",
                    fontWeight: "bold",
                    position: "absolute",
                    top: "4px",
                    right: "80px",
                    padding: "10px",
                    border: "2px solid black",
                  }}
                  onClick={handleLogout}
                />

                <Box
                  textAlign="center"
                  ml={2}
                  position="relative"
                  style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
                  onClick={() => navigate("/profile")}
                  cursor="pointer"
                >
                  <Avatar name={userName} src={userAvatar} size="sm" />
                  <Text fontSize="sm" color="black" mt={0}>
                    {userName}
                  </Text>
                </Box>
              </>
            ) : (
              <HStack spacing={4}>
                <AuthModals fetchUserInfo={fetchUserInfo} />
              </HStack>
            )}
          </div>
        </div>
      </section>

      <header>
        <nav className="flexSB">
          <div className="start">
            <div className="button">GET CERTIFICATE</div>
          </div>
          <ul className={click ? "mobile-nav" : "flexSB "} onClick={() => setClick(false)}>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/course">All Courses</Link>
            </li>
            <li>
              <Link to="/about">About</Link>
            </li>
            <li>
              <Link to="/team">Team</Link>
            </li>
            <li>
              <Link to="/price">Pricing</Link>
            </li>
            <li>
              <Link to="/land">Learn</Link>
            </li>
            <li>
              <Link to="/contact">Contact</Link>
            </li>
          </ul>

          <button className="toggle" onClick={() => setClick(!click)}>
            {click ? <i className="fa fa-times"></i> : <i className="fa fa-bars"></i>}
          </button>

          <SearchBar />
        </nav>
      </header>
    </>
  );
};
