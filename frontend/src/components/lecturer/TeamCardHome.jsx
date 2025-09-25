import React, { useEffect, useState } from "react";
import axios from "axios";

export const TeamCardHome = () => {
  const [instructors, setInstructors] = useState([]); // State for storing instructors
  const [loading, setLoading] = useState(true); // State for loading status
  const [error, setError] = useState(null); // State for error handling

  // Fetch instructors from the API
  useEffect(() => {
    const fetchInstructors = async () => {
      try {
        const response = await axios.get("https://kolo-temari-backend-service.onrender.com/api/auth/users/instructor"); // Replace with your API endpoint
        if (response.data && response.data.status === 'success') {
          // Filter instructors from the response
          const filteredInstructors = response.data.data.users;
          setInstructors(filteredInstructors); // Update the state with the filtered instructors
        } else {
          setError('Failed to fetch instructors.');
        }
      } catch (err) {
        setError(err.message); // Set error message if API call fails
      } finally {
        setLoading(false); // Set loading to false after API call
      }
    };

    fetchInstructors();
  }, []);

  // Render loading state
  if (loading) {
    return <div>Loading instructors...</div>;
  }

  // Render error state
  if (error) {
    return <div>Error fetching instructors: {error}</div>;
  }

  return (
    <div className="team-container">
      {instructors.length > 0 ? (
        instructors.slice(0, 3).map((val, index) => (
          <div className={`items shadow ${index === 2 ? 'large-item' : ''}`} key={val._id}>
            <div className='img'>
              <img src={val.pic || "https://via.placeholder.com/150"} alt={val.name} />
              <div className='overlays'>
                <a href={`https://facebook.com/${val.socials?.facebook}`} className='fab fa-facebook-f icon'></a>
                <a href={`https://twitter.com/${val.socials?.twitter}`} className='fab fa-twitter icon'></a>
                <a href={`https://instagram.com/${val.socials?.instagram}`} className='fab fa-instagram icon'></a>
                <a href={`https://tiktok.com/@${val.socials?.tiktok}`} className='fab fa-tiktok icon'></a>
              </div>
            </div>
            <div className='details'>
              <h2>{val.name}</h2>
              <p>{val.bio || "Instructor"}</p> {/* Assuming 'work' is the role/title */}
            </div>
          </div>
        ))
      ) : (
        <div>No instructors found.</div>
      )}
    </div>
  );
}

export default TeamCardHome;
