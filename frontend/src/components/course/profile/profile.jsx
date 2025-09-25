import React, { useState, useEffect } from "react";
import { FaUser, FaEnvelope, FaLock, FaCreditCard, FaBell, FaImage, FaShieldAlt } from "react-icons/fa";
import { Avatar, useToast } from "@chakra-ui/react";
import "./profile.css"; // Ensure your CSS is set up to match the design
import { useNavigate } from "react-router-dom";
import axiosInstance from '../../../utils/AxiosInstance';
import axios from "axios";
import Cookies from 'js-cookie';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from '../../../Firebase';

export const Profile = () => {
  const [selectedTab, setSelectedTab] = useState("profile");
  const [image, setImage] = useState("https://via.placeholder.com/150");
  const [filesToUpload, setFilesToUpload] = useState({});
  
  const [user, setUser] = useState({
    name: "User",
    email: "",
    pic: "/path/to/placeholder/avatar.png",
  });

  const [securityDetails, setSecurityDetails] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: "**** **** **** 1234",
    billingAddress: "1234 Elm Street, Springfield, USA",
  });

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    smsNotifications: false,
  });

  const [privacyDetails, setPrivacyDetails] = useState({
    profileVisibility: "Public",
    dataSharing: "Enabled",
  });

  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const token = Cookies.get("authToken");

    if (token) {
      const tokenParts = token.split('.');
      if (tokenParts.length === 3) {
        try {
          const userData = JSON.parse(atob(tokenParts[1]));
          fetchUserInfo(userData.id);
        } catch (error) {
          console.error("Error parsing user data:", error);
        }
      }
    }
  }, []);

  const fetchUserInfo = async (userId) => {
    try {
      const response = await axiosInstance.get(`auth/me`);
      setUser(response.data.data.user);
      setImage(response.data.data.user.pic || image); // Update image with user pic
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  };

  const handleImageUpload = (e) => {
    const { name, files } = e.target;
  
    if (files.length > 0) {
      // Set the file to the correct state
      setFilesToUpload((prev) => ({ ...prev, [name]: files[0] }));
  
      // Display a toast message
      toast({
        title: `${name === 'pic' ? 'Image' : 'Video'} selected.`,
        description: `Selected file: ${files[0].name}`,
        status: 'info',
        duration: 3000,
        isClosable: true,
      });
    } else {
      // No file selected case
      toast({
        title: "No file selected.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
    }
  };
  const handleImageSubmit = async (e) => {
    e.preventDefault();

    const file = filesToUpload.pic;
    if (file) {
        setImage(URL.createObjectURL(file));

        const fileRef = ref(storage, `uploads/${file.name + Date.now()}`);
        const uploadTask = uploadBytesResumable(fileRef, file);

        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log("Upload is " + progress + "% done");
            },
            (error) => {
                console.error("Error uploading file:", error);
                toast({ title: "Image upload failed.", status: "error", duration: 3000 });
            },
            async () => {
                const url = await getDownloadURL(uploadTask.snapshot.ref);

                // Now send a request to update the user's profile pic
                try {
                    const response = await axios.patch(
                        "https://kolo-temari-backend-service.onrender.com/api/auth/updateMe",
                        { pic: url }, // Update the pic field with the new URL
                        { withCredentials: true }
                    );

                    if (response.status === 200) {
                        toast({ title: "Profile picture updated!", status: "success", duration: 3000 });
                        setUser((prevUser) => ({ ...prevUser, pic: url }));
                    }
                } catch (error) {
                    console.error("Error updating profile picture in database:", error);
                    toast({ title: "Failed to update profile picture.", status: "error", duration: 3000 });
                }
            }
        );
    } else {
        toast({ title: "No file selected.", status: "warning", duration: 3000 });
    }
};

  const handleProfileSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.patch("https://kolo-temari-backend-service.onrender.com/api/auth/updateMe", {
        name: user.name,
        email: user.email,
        bio: user.bio,
      }, { withCredentials: true });
      
      if (response.status === 200) {
        toast({
          title: "Profile updated successfully!",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: "Failed to update profile.",
        description: error.response?.data?.message || "An error occurred.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleSecuritySubmit = async (e) => {
    e.preventDefault();

    if (securityDetails.newPassword === securityDetails.confirmPassword) {
      try {
        const response = await axios.patch("https://kolo-temari-backend-service.onrender.com/api/auth/updatePassword", {
          currentPassword: securityDetails.currentPassword,
          confirmPassword: securityDetails.confirmPassword,
          password: securityDetails.newPassword,
        }, { withCredentials: true });
  
        if (response.status === 200) {
          toast({
            title: "Security settings updated!",
            status: "success",
            duration: 3000,
            isClosable: true,
          });
          setSecurityDetails({
            currentPassword: "",
            newPassword: "",
            confirmPassword: ""
          });
        }
      } catch (error) {
        toast({
          title: "Error updating security settings.",
          description: error.response?.data?.message || "An error occurred.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } else {
      toast({
        title: "Passwords do not match!",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    toast({
      title: "Payment settings updated!",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  const handleNotificationSubmit = (e) => {
    e.preventDefault();
    toast({
      title: "Notification settings updated!",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  const handlePrivacySubmit = (e) => {
    e.preventDefault();
    toast({
      title: "Privacy settings updated!",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <div className="profile-wrapper">
      <div className="profile-container">
        <div className="sidebar">
          <div className="profile-image">
            <img src={user.pic} alt="User" />
            <h3>{user.name}</h3>
            <p>{user.email}</p>
          </div>
          <ul className="sidebar-menu">
            <li className={selectedTab === "profile" ? "active" : ""} onClick={() => setSelectedTab("profile")}>
              <FaUser /> Profile
            </li>
            <li className={selectedTab === "security" ? "active" : ""} onClick={() => setSelectedTab("security")}>
              <FaLock /> Security
            </li>
            <li className={selectedTab === "payment" ? "active" : ""} onClick={() => setSelectedTab("payment")}>
              <FaCreditCard /> Payment
            </li>
            <li className={selectedTab === "notification" ? "active" : ""} onClick={() => setSelectedTab("notification")}>
              <FaBell /> Notification
            </li>
            <li className={selectedTab === "view-picture" ? "active" : ""} onClick={() => setSelectedTab("view-picture")}>
              <FaImage /> View Profile Picture
            </li>
            <li className={selectedTab === "privacy" ? "active" : ""} onClick={() => setSelectedTab("privacy")}>
              <FaShieldAlt /> Privacy
            </li>
          </ul>
        </div>
        <div className="content">
          {selectedTab === "profile" && (
            <div className="profile-details">
              <h2>Profile</h2>
              <form onSubmit={handleProfileSubmit}>
                <label>
                  Name:
                  <input type="text" value={user.name} onChange={(e) => setUser({ ...user, name: e.target.value })} />
                </label>
                <label>
                  Email:
                  <input type="email" value={user.email} onChange={(e) => setUser({ ...user, email: e.target.value })} />
                </label>
                <label>
                  Bio:
                  <textarea value={user.bio} onChange={(e) => setUser({ ...user, bio: e.target.value })} />
                </label>
                <button type="submit">Save Changes</button>
              </form>
            </div>
          )}
          {selectedTab === "security" && (
            <div className="profile-details">
              <h2>Security</h2>
              <form onSubmit={handleSecuritySubmit}>
                <label>
                  Current Password:
                  <input
                    type="password"
                    value={securityDetails.currentPassword}
                    onChange={(e) => setSecurityDetails({ ...securityDetails, currentPassword: e.target.value })}
                  />
                </label>
                <label>
                  New Password:
                  <input
                    type="password"
                    value={securityDetails.newPassword}
                    onChange={(e) => setSecurityDetails({ ...securityDetails, newPassword: e.target.value })}
                  />
                </label>
                <label>
                  Confirm New Password:
                  <input
                    type="password"
                    value={securityDetails.confirmPassword}
                    onChange={(e) => setSecurityDetails({ ...securityDetails, confirmPassword: e.target.value })}
                  />
                </label>
                <button type="submit">Update Password</button>
              </form>
            </div>
          )}
          {selectedTab === "payment" && (
            <div className="profile-details">
              <h2>Payment</h2>
              <form onSubmit={handlePaymentSubmit}>
                <label>
                  Card Number:
                  <input
                    type="text"
                    value={paymentDetails.cardNumber}
                    onChange={(e) => setPaymentDetails({ ...paymentDetails, cardNumber: e.target.value })}
                  />
                </label>
                <label>
                  Billing Address:
                  <input
                    type="text"
                    value={paymentDetails.billingAddress}
                    onChange={(e) => setPaymentDetails({ ...paymentDetails, billingAddress: e.target.value })}
                  />
                </label>
                <button type="submit">Update Payment Details</button>
              </form>
            </div>
          )}
          {selectedTab === "notification" && (
            <div className="profile-details">
              <h2>Notification</h2>
              <form onSubmit={handleNotificationSubmit}>
                <label>
                  Email Notifications:
                  <select
                    value={notifications.emailNotifications ? "Enabled" : "Disabled"}
                    onChange={(e) => setNotifications({ ...notifications, emailNotifications: e.target.value === "Enabled" })}
                  >
                    <option value="Enabled">Enabled</option>
                    <option value="Disabled">Disabled</option>
                  </select>
                </label>
                <label>
                  SMS Notifications:
                  <select
                    value={notifications.smsNotifications ? "Enabled" : "Disabled"}
                    onChange={(e) => setNotifications({ ...notifications, smsNotifications: e.target.value === "Enabled" })}
                  >
                    <option value="Enabled">Enabled</option>
                    <option value="Disabled">Disabled</option>
                  </select>
                </label>
                <button type="submit">Save Notification Preferences</button>
              </form>
            </div>
          )}
          {selectedTab === "view-picture" && (
            <div className="profile-details">
              <h2>View Profile Picture</h2>
              <div className="profile-image-large">
                <img src={image} alt="User" />
              </div>
              <form onSubmit={handleImageSubmit}>
                <input type="file" name="pic" accept="image/*" onChange={handleImageUpload} />
                <button type="submit">Upload New Picture</button>
              </form>
            </div>
          )}
          {selectedTab === "privacy" && (
            <div className="profile-details">
              <h2>Privacy</h2>
              <form onSubmit={handlePrivacySubmit}>
                <label>
                  Profile Visibility:
                  <select
                    value={privacyDetails.profileVisibility}
                    onChange={(e) => setPrivacyDetails({ ...privacyDetails, profileVisibility: e.target.value })}
                  >
                    <option value="Public">Public</option>
                    <option value="Private">Private</option>
                  </select>
                </label>
                <label>
                  Data Sharing:
                  <select
                    value={privacyDetails.dataSharing}
                    onChange={(e) => setPrivacyDetails({ ...privacyDetails, dataSharing: e.target.value })}
                  >
                    <option value="Enabled">Enabled</option>
                    <option value="Disabled">Disabled</option>
                  </select>
                </label>
                <button type="submit">Update Privacy Settings</button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
