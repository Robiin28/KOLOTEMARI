import React, { useState } from 'react';
import VideoPlayer from './VideoPlayer';
import './lecture.css';
import { FaPlay } from 'react-icons/fa';

const sections = [
  { id: '1', title: 'Introduction', videoSrc: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8' },
  { id: '2', title: 'Video Lecture', videoSrc: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8' },
  // Add more sections as needed
];

export const Lecture = () => {
  const [selectedPart, setSelectedPart] = useState('1');
  const [videoSrc, setVideoSrc] = useState(sections[0].videoSrc);

  const handlePartClick = (partId) => {
    const selectedPart = sections.find(part => part.id === partId);
    setSelectedPart(partId);
    setVideoSrc(selectedPart?.videoSrc || '');
  };

  const videoJsOptions = {
    controls: true,
    responsive: true,
    fluid: true,
    sources: [{ src: videoSrc, type: 'application/x-mpegURL' }],
    playbackRates: [0.5, 1, 1.5, 2],
  };

  return (
    <div className="lecture-container">
      <aside className="sidebar">
        <h2>Sections</h2>
        <ul className="section-parts">
          {sections.map((part) => (
            <li
              key={part.id}
              className={`section-part ${part.id === selectedPart ? 'active' : ''}`}
              onClick={() => handlePartClick(part.id)}
            >
              <span>
                <FaPlay />
                {part.title}
              </span>
            </li>
          ))}
        </ul>
      </aside>
      <main className="main-content">
        <div className="video-container">
          <VideoPlayer options={videoJsOptions} />
        </div>
      </main>
    </div>
  );
};

export default Lecture;
