import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../../../Firebase';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './courseManagement.css';

const CourseManagement = () => {
    const [courses, setCourses] = useState([]);
    const [newCourse, setNewCourse] = useState({
        title: '',
        description: '',
        pic: '',
        trailer: '',
        status: 'free',
        price: '',
        instructor: '',
    });
    const [filesToUpload, setFilesToUpload] = useState({ pic: null, trailer: null });
    const [uploadProgress, setUploadProgress] = useState({ pic: 0, trailer: 0 });
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);
    const [formVisible, setFormVisible] = useState(false);
    const [editingCourseId, setEditingCourseId] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                setLoading(true);
                const response = await axios.get('https://kolo-temari-backend-service.onrender.com/api/courses',{withCredentials:true});
                await new Promise(resolve => setTimeout(resolve, 1000)); // 1-second delay
                if (response.data.status === 'success') {
                    setCourses(response.data.data.courses);
                } else {
                    setError('Failed to fetch courses.');
                }
            } catch (error) {
                setError(`Failed to fetch courses: ${error.message}`);
            } finally {
                setLoading(false);
            }
        };
        fetchCourses();
    }, []);

    useEffect(() => {
        if (editingCourseId) {
            const courseToEdit = courses.find(course => course._id === editingCourseId);
            if (courseToEdit) {
                setNewCourse({
                    title: courseToEdit.title,
                    description: courseToEdit.description,
                    pic: courseToEdit.pic,
                    trailer: courseToEdit.trailer,
                    status: courseToEdit.status,
                    price: courseToEdit.price || '',
                    instructor: courseToEdit.instructor,
                });
                setFormVisible(true);
            }
        } else {
            resetForm();
            setFormVisible(false);
        }
    }, [editingCourseId, courses]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewCourse((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        if (files.length > 0) {
            setFilesToUpload({ ...filesToUpload, [name]: files[0] });
        }
    };

    const uploadFile = (file, type) => {
        const fileRef = ref(storage, `uploads/${file.name + Date.now()}`);
        const uploadTask = uploadBytesResumable(fileRef, file);

        return new Promise((resolve, reject) => {
            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setUploadProgress((prev) => ({ ...prev, [type]: progress }));
                },
                (error) => reject(error),
                async () => {
                    const url = await getDownloadURL(uploadTask.snapshot.ref);
                    resolve(url);
                }
            );
        });
    };

    const handleAddCourse = async () => {
        if (!newCourse.title || !newCourse.description || !newCourse.instructor) {
            alert('Please fill in all required fields.');
            return;
        }

        setUploading(true);
        try {
            const picUrl = filesToUpload.pic ? await uploadFile(filesToUpload.pic, 'pic') : newCourse.pic;
            const trailerUrl = filesToUpload.trailer ? await uploadFile(filesToUpload.trailer, 'trailer') : newCourse.trailer;

            const courseData = {
                title: newCourse.title,
                description: newCourse.description,
                pic: picUrl,
                trailer: trailerUrl,
                status: newCourse.status,
                price: newCourse.status === 'paid' ? parseFloat(newCourse.price) : undefined,
                instructor: newCourse.instructor,
            };

            if (editingCourseId) {
                const response = await axios.put(`https://kolo-temari-backend-service.onrender.com/api/courses/${editingCourseId}`, courseData,{withCredentials:true});
                if (response.status === 200) {
                    setCourses((prev) => prev.map(course => (course._id === editingCourseId ? response.data.data.course : course)));
                    resetForm();
                    setEditingCourseId(null);
                } else {
                    alert(`Failed to update course. Server responded with status code: ${response.status}`);
                }
            } else {
                const response = await axios.post('https://kolo-temari-backend-service.onrender.com/api/courses', courseData,{withCredentials:true});
                if (response.status === 201) {
                    setCourses((prev) => [...prev, response.data.data.course]);
                    resetForm();
                } else {
                    alert(`Failed to add course. Server responded with status code: ${response.status}`);
                }
            }
        } catch (error) {
            alert(`Failed to ${editingCourseId ? 'update' : 'add'} course. Check console for details.`);
        } finally {
            setUploading(false);
        }
    };

    const resetForm = () => {
        setNewCourse({
            title: '',
            description: '',
            pic: '',
            trailer: '',
            status: 'free',
            price: '',
            instructor: '',
        });
        setFilesToUpload({ pic: null, trailer: null });
        setUploadProgress({ pic: 0, trailer: 0 });
    };

    const handleCancelUpload = () => {
        setUploading(false);
        resetForm();
    };

    const handleRowClick = (courseId) => {
        setEditingCourseId(courseId);
        setFormVisible(true);
    };

    return (
        <>
            {error && <div className="error-message">{error}</div>}
            {loading ? (
                <div className="loading-spinner-container">
                    <div className="loading-spinner"></div>
                </div>
            ) : (
                <>
                    {!formVisible && (
                        <button onClick={() => {
                            resetForm();
                            setEditingCourseId(null);
                            setFormVisible(true);
                        }}>
                            Add Course
                        </button>
                    )}
                    {formVisible && (
                        <div className="form-container">
                            <button
                                className="close-form-btn"
                                onClick={() => setFormVisible(false)}
                            >
                                Close
                            </button>
                            <div className="course-form">
                                <input
                                    type="text"
                                    name="title"
                                    placeholder="Course Title"
                                    value={newCourse.title}
                                    onChange={handleChange}
                                />
                                <ReactQuill
                                    name="description"
                                    value={newCourse.description}
                                    onChange={(value) => setNewCourse((prev) => ({ ...prev, description: value }))}
                                    placeholder="Course Description"
                                />
                                <input
                                    type="file"
                                    name="pic"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                />
                                <input
                                    type="file"
                                    name="trailer"
                                    accept="video/*"
                                    onChange={handleFileChange}
                                />
                                <select
                                    name="status"
                                    value={newCourse.status}
                                    onChange={handleChange}
                                >
                                    <option value="free">Free</option>
                                    <option value="paid">Paid</option>
                                </select>
                                {newCourse.status === 'paid' && (
                                    <input
                                        type="number"
                                        name="price"
                                        placeholder="Course Price"
                                        value={newCourse.price}
                                        onChange={handleChange}
                                    />
                                )}
                                <input
                                    type="text"
                                    name="instructor"
                                    placeholder="Instructor Name"
                                    value={newCourse.instructor}
                                    onChange={handleChange}
                                />
                                <button onClick={handleAddCourse}>
                                    {editingCourseId ? 'Update Course' : 'Add Course'}
                                </button>
                            </div>
                        </div>
                    )}
                    {uploading && (
                        <div className="loading-modal">
                            <p>Uploading image...</p>
                            <div className="progress-bar">
                                <span style={{ width: `${uploadProgress.pic}%` }}></span>
                            </div>
                            <p>Uploading video...</p>
                            <div className="progress-bar video">
                                <span style={{ width: `${uploadProgress.trailer}%` }}></span>
                            </div>
                            <button className="cancel-btn" onClick={handleCancelUpload}>
                                Cancel
                            </button>
                        </div>
                    )}
                    {!formVisible && (
                        <table className="course-table">
                            <thead>
                                <tr>
                                    <th>Image</th>
                                    <th>Title</th>
                                    <th>Instructor</th>
                                    <th>Students Enrolled</th>
                                </tr>
                            </thead>
                            <tbody>
                                {courses.map((course) => (
                                    <tr key={course._id} onClick={() => handleRowClick(course._id)}>
                                        <td>
                                            {course.pic && <img src={course.pic} alt={course.title} className="course-image-small" />}
                                        </td>
                                        <td>{course.title}</td>
                                        <td>{course.instructor}</td>
                                        <td>{course.studentsEnrolled || 0}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </>
            )}
        </>
    );
};

export default CourseManagement;
