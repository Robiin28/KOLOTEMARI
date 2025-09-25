import React, { useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import axios from 'axios';

export const LessonTable = () => {
  const { sectionId } = useParams();
  const location = useLocation();
  const data = location.state || {}; // Default to empty object if location.state is undefined

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lessons, setLessons] = useState([]);
  const [tableVisible, setTableVisible] = useState(false);

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`https://kolo-temari-backend-service.onrender.com/api/courses/${data}/${sectionId}/lessons`,{withCredentials:true}); // Adjusted endpoint to use courseId
        // Simulating a delay for demonstration
        await new Promise(resolve => setTimeout(resolve, 1000));
        if (response.data.status === 'success') {
          setLessons(response.data.data.lessons);
          setError(null);
        } else {
          setError('Failed to fetch lessons: Status not success');
        }
      } catch (error) {
        setError(`Failed to fetch: ${error.message}`);
      } finally {
        setLoading(false);
        setTableVisible(true);
      }
    };

    fetchLessons();
  }, [data.courseId, sectionId]); // Added dependencies to useEffect

  return (
    <>
      {error && <div className="error-message">{error}</div>}
      {loading ? (
        <div className="loading-spinner-container">
          <div className="loading-spinner"></div>
        </div>
      ) : (
        tableVisible && (
          <div className='form-container'>
            <button className="close-form-btn" onClick={() => setTableVisible(false)}>Close</button>
            <table className='course-table'>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Title</th>
                  <th>Name</th>
                </tr>
              </thead>
              <tbody>
                {lessons.map((lesson, index) => (
                  <tr key={lesson._id}>
                    <td>Lesson {index + 1}</td>
                    <td>{lesson.title}</td>
                    <td>hello</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      )}
    </>
  );
};
