import React, { useState, useEffect } from "react";
import axios from 'axios';
import Modal from './Modal';

const UserTable = ({ role = 'student', onUpdate, onDelete }) => {
    // useState
    const [data, setData] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoad] = useState(true);
    const [form, setForm] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    const fetchData = async () => {
        try {
            setLoad(true);
            const response = await axios.get(`https://kolo-temari-backend-service.onrender.com/api/auth/users/${role}`,{withCredentials:true});
            if (response.data.status === 'success') {
                setData(response.data.data.users);
            } else {
                setError('Failed to fetch data');
            }
        } catch (error) {
            setError(`Failed to fetch data: ${error.message}`);
        } finally {
            setLoad(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [role]);

    const handleDeleteUser = async (id) => {
        try {
            const response = await axios.delete(`https://kolo-temari-backend-service.onrender.com/api/auth/deleteUser/${id}`,{withCredentials:true});
            if (response.status === 204) {
                fetchData();
                alert('Successfully deleted');
            } else {
                alert('Something happened');
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'An error occurred';
            alert(`Danger: ${errorMessage}`);
        }
    };

    const handleUpdateUser = (user) => {
        setSelectedUser(user);
        setForm(true);
    };

    const closeModal = () => {
        setForm(false);
        setSelectedUser(null);
    };

    // Create dynamic content for the modal
    const getModalContent = () => {
        if (!selectedUser) return null;

        return (
            <div>
                <h2>Update {selectedUser.name} role</h2>
                <form>
                    <div>
                        <label htmlFor="role">Role:</label>
                        <select id="role" defaultValue={selectedUser.role}>
                        <option value="null">Select new role</option>
                            <option value="student">Student</option>
                            <option value="instructor">Instructor</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                    <button type="submit">Save</button>
                </form>
            </div>
        );
    };

    return (
        <>
            {form && <Modal isOpen={form} onClose={closeModal}>{getModalContent()}</Modal>}
            <h2>{role.charAt(0).toUpperCase() + role.slice(1)}s</h2>
            {error && <div className="error-message">{error}</div>}
            {loading ? (
                <div className="loading-spinner-container">
                    <div className="loading-spinner"></div>
                </div>
            ) : (
                <table className="user-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            {role === 'student' ? <th>Enrolled Courses</th> : role === 'instructor' ? <th>Taught Courses</th> : null}
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map(item => (
                            <tr key={item._id}>
                                <td>{item.name}</td>
                                <td>{item.email}</td>
                                {role === 'student' ? <td>No course enrolled</td> : role === "instructor" ? <td>No course taught</td> : null}
                                <td>
                                    <button onClick={() => handleUpdateUser(item)}>Update</button>
                                    <button onClick={() => handleDeleteUser(item._id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </>
    );
};

export default UserTable;
