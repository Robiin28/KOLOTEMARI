import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const CourseForm = ({
    newCourse,
    handleChange,
    handleEditorChange,
    handleFileChange,
    handleAddCourse,
    handleUpdateCourse,
    editingCourse,
    resetForm
}) => (
    <>
        <button onClick={resetForm} className="close-form-button">Close</button>
        <h3>{editingCourse ? 'Update Course' : 'Add New Course'}</h3>
        <div className="course-form">
            <input
                type="text"
                name="title"
                placeholder="Course Title"
                value={newCourse.title}
                onChange={handleChange}
            />
            <ReactQuill
                theme="snow"
                value={newCourse.description}
                onChange={handleEditorChange}
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
                    placeholder="Price"
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
            <button onClick={editingCourse ? handleUpdateCourse : handleAddCourse}>
                {editingCourse ? 'Update Course' : 'Add Course'}
            </button>
        </div>
    </>
);

export default CourseForm;
