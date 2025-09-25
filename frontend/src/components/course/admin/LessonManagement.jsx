import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import axios from 'axios';
import './courseManagement.css';
import Modal from './Modal';

const LessonManagement = () => {
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState(null);
  const [formVisible, setFormVisible] = useState(false);
  const [editingCourseId, setEditingCourseId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editSection, SetEditSection] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [modal, showModal] = useState(false);
  const [section, setSection] = useState([]);

  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const response = await axios.get('https://kolo-temari-backend-service.onrender.com/api/courses',{withCredentials:true});
        await new Promise(resolve => setTimeout(resolve, 1000)); // 1-second delay
        if (response.data.status === 'success') {
          setCourses(response.data.data.courses);
          setError(null);
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

  const handleRowSectionClick = (section) => {
    
    navigate(`/admin/lessons/${section._id}`,{state:section.courseId}); // Use navigate to redirect to the LessonTable component with the section ID
  };

  const handleRowClick = async (courseId) => {
    setLoading(true);
    try {
      const fetch = await axios.get(`https://kolo-temari-backend-service.onrender.com/api/course/${courseId}/section`,{withCredentials:true});
      await new Promise(resolve => setTimeout(resolve, 1000));
      if (fetch.data.status === 'success') {
        setSection(fetch.data.data.sections);
        setError(null);
      }
    } catch (error) {
      setError(`failed to fetch: ${error}`);
    } finally {
      setLoading(false);
    }
    // setEditingCourseId(courseId);
    setFormVisible(true);
  };

  const handleEditClick = (section, e) => {
    e.stopPropagation(); // Prevent triggering row click
    setSelectedUser(section);
    showModal(true);
  };

  const closeModal = () => {
    showModal(false);
    setSelectedUser(null);
  };

  const getModalContent = () => {
    return (
      <div>
        <h2>Update Section</h2>
        <form>
          <div>
            <label htmlFor='name'>Section Name</label>
            <input id="name" value={selectedUser.title} name="sectionName" type="text" />
            <label htmlFor='order'>Change the order</label>
            <input type="number" id="order" value={selectedUser.order} />
          </div>
          <button type="submit">Save</button>
        </form>
      </div>
    );
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
          {!formVisible && <h3>Manage lessons</h3>}

          {modal && (
            <Modal isOpen={modal} onClose={closeModal} children={getModalContent()} />
          )}

          {formVisible && (
            <div className="form-container">
              <button
                className="close-form-btn"
                onClick={() => setFormVisible(false)}
              >
                Close
              </button>

              <table className="course-table">
                <thead>
                  <tr>
                    <th>.</th>
                    <th>Title</th>
                    <th>Order</th>
                    <th>Number of lessons</th>
                    <th>Created At</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {section.map((section, index) => (
                    <tr key={section._id} onClick={() => handleRowSectionClick(section)}>
                      <td>Section {index + 1}</td>
                      <td>{section.title}</td>
                      <td>{section.order}</td>
                      <td>{section.lessons.length}</td>
                      <td>{new Date(section.createdAt).toLocaleDateString()}</td>
                      <td>
                        <button
                          className="edit-btn"
                          onClick={(e) => handleEditClick(section, e)}
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {!formVisible && (
            <table className="course-table">
              <thead>
                <tr>
                  <th>.</th>
                  <th>Name</th>
                  <th>Picture</th>
                  <th>Instructor</th>
                  <th>Sections</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((course, index) => (
                  <tr key={course._id} onClick={() => handleRowClick(course._id)}>
                    <td>{index + 1}</td>
                    <td>{course.title}</td>
                    <td>
                      {course.pic && <img src={course.pic} alt={course.title} className="course-image-small" />}
                    </td>
                    <td>{course.instructor}</td>
                    <td>null</td>
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

export default LessonManagement;
