// src/components/Charts.js
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const data = [
    { name: 'Students', value: 1500 },
    { name: 'Instructors', value: 120 },
    { name: 'Courses', value: 45 },
    { name: 'Completed Courses', value: 30 },
    { name: 'Premium Students', value: 300 }
];

const barData = [
    { name: 'Jan', students: 200, instructors: 10, newCourses: 10, lessons: 150 },
    { name: 'Feb', students: 180, instructors: 15, newCourses: 8, lessons: 120 },
    { name: 'Mar', students: 220, instructors: 20, newCourses: 12, lessons: 180 },
    { name: 'Apr', students: 240, instructors: 25, newCourses: 15, lessons: 200 },
    { name: 'May', students: 260, instructors: 30, newCourses: 18, lessons: 220 }
];

const Charts = () => {
    return (
        <section className="charts">
            <div className="chart pie-chart">
                <h2>Enrollment Distribution</h2>
                <div className="chart-container">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                dataKey="value"
                                nameKey="name"
                                outerRadius={140}
                                fill="#8884d8"
                                label
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={['#003f5c', '#58508d', '#bc5090', '#ff6361', '#f7c6c7'][index]} />
                                ))}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
            <div className="chart bar-chart">
                <h2>Monthly Enrollments</h2>
                <div className="chart-container">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={barData}
                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="students" fill="#003f5c" />
                            <Bar dataKey="instructors" fill="#ff6361" />
                            <Bar dataKey="newCourses" fill="#58508d" />
                            <Bar dataKey="lessons" fill="#bc5090" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </section>
    );
};

export default Charts;
