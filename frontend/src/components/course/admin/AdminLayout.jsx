import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { FaTachometerAlt, FaUsers, FaBook, FaChalkboardTeacher, FaChartBar, FaBroadcastTower, FaCog, FaSignOutAlt } from 'react-icons/fa';
import './Admin.css';
import { AdminFooter } from './AdminFooter';

const AdminLayout = () => {
  return (
    <div className="admin-dashboard">
      <aside className="admin-sidebar">
        <h2>Admin Panel</h2>
        <ul>
          <li><Link to="dashboard"><FaTachometerAlt /> Dashboard</Link></li>
          <li><Link to="users"><FaUsers /> Users</Link></li>
          <li><Link to="courses"><FaBook /> Courses</Link></li>
          <li><Link to="reports"><FaChartBar /> Reports</Link></li>
          <li><Link to="broadcast"><FaBroadcastTower /> Broadcast</Link></li>
          <li><Link to="settings"><FaCog /> Settings</Link></li>
        </ul>
        <div className="logout">
          <a href="/"><FaSignOutAlt /> Log Out</a>
        </div>
      </aside>
      <div className="admin-content">
        <header className="admin-header">
          <h1>Admin Dashboard</h1>
        </header>
        <section className="contentss">
          <Outlet /> {/* Render nested routes here */}
        </section>
      </div>
      <AdminFooter />
    </div>
  );
};

export default AdminLayout;
