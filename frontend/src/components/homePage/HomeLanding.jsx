import React from 'react';

 import { Outlet, useLocation } from 'react-router-dom'; // Import useLocation to check the current path

import { Header } from '../common/head/Header';
import { Dashboard } from './Dashbord';
import Footer from './../course/Learn/Footer';


  // Check if the current path is exactly "/land" to show the Dashboard
 

export const HomeLanding = () => {
  const location = useLocation();

  const showDashboard = location.pathname === "/land";
  return (
    <>
      <Header /> 
      
      {showDashboard && <Dashboard />} 
      <Outlet /> 
      

      <Footer /> {/* Optional: Include footer if necessary */}
    </>
  );
};
