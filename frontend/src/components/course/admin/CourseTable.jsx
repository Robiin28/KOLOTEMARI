import React from 'react';

const CourseTable = ({ courses, handleEditCourse, handleViewStudents }) => (
    <table className="course-table">
        <thead>
            <tr>
                <th>Title</th>
                <th>Description</th>
                <th>Instructor</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            {courses.map((course) => (
                <tr key={course.id}>
                    <td>{course.title}</td>
                    <td>{course.description}</td>
                    <td>{course.instructor}</td>
                    <td>
                        <button onClick={() => handleEditCourse(course)}>Edit</button>
                        <button onClick={() => handleViewStudents(course)}>View Students</button>
                    </td>
                </tr>
            ))}
        </tbody>
    </table>
);

export default CourseTable;
