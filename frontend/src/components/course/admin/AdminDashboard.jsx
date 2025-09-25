import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import DashboardStats from './DashboardStats';
import Charts from './Charts';
import UserTable from './UserTable';
import CourseManagement from './CourseManagement';
import LessonManagement from './LessonManagement';
import { LessonTable } from './LessonTable';
import Broadcast from './Broadcast';
import Settings from './Settings';
import { AdminFooter } from './AdminFooter';
import './Admin.css';
import { FaTachometerAlt, FaUsers, FaBook, FaChalkboardTeacher, FaChartBar, FaBroadcastTower, FaCog, FaSignOutAlt } from 'react-icons/fa';

export const AdminDashboard = () => {
  return (
    <div className="admin-dashboard">
      <aside className="admin-sidebar">
        <h2>Admin Panel</h2>
        <ul>
          <li><Link to=""><FaTachometerAlt /> Dashboard</Link></li>
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
          <Routes>
            <Route path="" element={<><DashboardStats /><Charts /></>} />
            <Route path="users" element={<><UserTable role="student" /><UserTable role="instructor" /></>} />
            <Route path="courses" element={<CourseManagement />} />
            <Route path="lessons" element={<LessonManagement />} />
            <Route path="lessons/:sectionId" element={<LessonTable />} />
            <Route path="reports" element={<Charts />} />
            <Route path="broadcast" element={<Broadcast />} />
            <Route path="settings" element={<Settings />} />
            <Route path="*" element={<h2>Page Not Found</h2>} />
          </Routes>
        </section>
      </div>
    </div>
  );
};

export default AdminDashboard;
