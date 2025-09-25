// src/components/DashboardStats.js
import React from 'react';
import { FaUser, FaChalkboardTeacher, FaBook, FaCheckCircle, FaStar } from 'react-icons/fa'; // Import icons

const DashboardStats = () => {
    return (
        <section className="admin-stats">
            <div className="stat-card">
                <div className="icon-circle">
                    <FaUser />
                </div>
                <h2>1500</h2>
                <p>Students</p>
            </div>
            <div className="stat-card">
                <div className="icon-circle">
                    <FaChalkboardTeacher />
                </div>
                <h2>120</h2>
                <p>Instructors</p>
            </div>
            <div className="stat-card">
                <div className="icon-circle">
                    <FaBook />
                </div>
                <h2>45</h2>
                <p>Courses</p>
            </div>
            <div className="stat-card">
                <div className="icon-circle">
                    <FaCheckCircle />
                </div>
                <h2>30</h2>
                <p>Completed Courses</p>
            </div>
            <div className="stat-card">
                <div className="icon-circle">
                    <FaStar />
                </div>
                <h2>300</h2>
                <p>Premium Students</p>
            </div>
        </section>
    );
};

export default DashboardStats;
