// MainLayout.js
import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './components/common/head/Header';
import Footer from './components/course/Learn/Footer'

const MainLayout = () => {
  return (
    <div>
      <Header /> {/* Always show the Header */}
      {/* Render nested routes */}
      <Outlet />
      <Footer />
    </div>
  );
};

export default MainLayout;
