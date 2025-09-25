// CourseDescriptionEditor.js
import React, { useRef, useState, useEffect } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css'; // Import Quill's CSS

const CourseDescriptionEditor = ({ onChange, value }) => {
    const quillRef = useRef(null);
    const [editor, setEditor] = useState(null);

    useEffect(() => {
        if (!quillRef.current) return;

        const quill = new Quill(quillRef.current, {
            theme: 'snow',
            modules: {
                toolbar: [
                    [{ header: [1, 2, false] }],
                    ['bold', 'italic', 'underline'],
                    ['link'],
                    [{ list: 'ordered' }, { list: 'bullet' }],
                    ['clean']
                ]
            }
        });

        setEditor(quill);

        // Set the initial value
        if (value) {
            quill.root.innerHTML = value;
        }

        // Listen for changes in the editor and call the onChange prop
        quill.on('text-change', () => {
            onChange(quill.root.innerHTML);
        });

        return () => {
            // Clean up event listeners
            quill.off('text-change');
        };
    }, [onChange, value]);

    return (
        <div>
            <div ref={quillRef} style={{ height: '200px' }}></div>
        </div>
    );
};

export default CourseDescriptionEditor;
