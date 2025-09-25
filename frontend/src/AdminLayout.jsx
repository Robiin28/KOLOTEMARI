// AdminLayout.js
import React from 'react';
import { Outlet } from 'react-router-dom';

const AdminLayout = () => {
  return (
    <div>
      {/* Render admin-specific components if needed */}
      <Outlet /> {/* Renders nested routes for admin */}
    </div>
  );
};

export default AdminLayout;
