import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useToast, Spinner, Center } from "@chakra-ui/react";
import axiosInstance from "../utils/AxiosInstance";
import Cookies from "js-cookie"; // ✅ Use cookies since login stores tokens in cookies

const ProtectedRoute = ({ children, requireAdmin }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null); // null = not checked yet
  const [isLoading, setIsLoading] = useState(true);
  const [showRedirect, setShowRedirect] = useState(false);
  const toast = useToast();

  const checkAuth = async () => {
    try {
      // ✅ Get token from cookies
      const token = Cookies.get("authToken");

      if (!token) {
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }

      // ✅ Send request to backend to verify token
      const response = await axiosInstance.get(
        "https://kolo-temari-backend-service.onrender.com/api/auth/check",
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true, // important when using cookies
        }
      );

      if (response.data.status === "success") {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    } catch (error) {
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (isAuthenticated === false) {
      toast({
        title: "Authentication required.",
        description: "Please log in to access this page.",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top",
      });

      const timer = setTimeout(() => {
        setShowRedirect(true);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, toast]);

  if (isLoading) {
    return (
      <Center height="100vh">
        <Spinner size="xl" />
      </Center>
    );
  }

  if (showRedirect) {
    return <Navigate to="/" replace />;
  }

  if (isAuthenticated) {
    // ✅ Get role from cookie instead of localStorage
    const userRole = Cookies.get("userRole");
    if (requireAdmin && userRole !== "admin") {
      return <Navigate to="/" replace />;
    }
    return children;
  }

  return null;
};

export default ProtectedRoute;
