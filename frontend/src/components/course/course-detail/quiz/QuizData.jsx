import React, { useState, useEffect } from "react";
import { FaVolumeUp, FaClock } from "react-icons/fa";
import { FaGraduationCap, FaReadme } from "react-icons/fa6";
import './quiz.css';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

export const Quiz = () => {
  const location = useLocation();
  const { quizId, lessonId } = location.state || {};
  const [quizData, setQuizData] = useState(null);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);

  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        const response = await axios.get(`https://kolo-temari-backend-service.onrender.com/api/course/lesson/${lessonId}/quiz/${quizId}`, {
          withCredentials: true,
        });
        if (response.data.status === 'success') {
          setQuizData(response.data.data.quiz);
        } else {
          console.error('Failed to fetch quiz data');
        }
      } catch (error) {
        console.error(`Error fetching quiz data: ${error.message}`);
      }
    };

    if (quizId && lessonId) {
      fetchQuizData();
    }
  }, [quizId, lessonId]);

  useEffect(() => {
    if (!quizStarted || !quizData) return;

    const durationInMinutes = quizData.durationMinutes || 3;
    const endTime = new Date(Date.now() + durationInMinutes * 60000);

    const timer = setInterval(() => {
      const currentTime = new Date().getTime();
      const remainingTime = Math.floor((endTime.getTime() - currentTime) / 1000);

      if (remainingTime > 0) {
        setTimeLeft(remainingTime);
      } else {
        clearInterval(timer);
        handleTimeUp();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [quizStarted, quizData]);

  const handleOptionClick = (questionId, optionId) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: optionId,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let calculatedScore = 0;
    quizData.questions.forEach((question) => {
      if (answers[question._id] === question.options[question.correctOptionIndex]._id) {
        calculatedScore += 1;
      }
    });
    setScore(calculatedScore);
  };

  const handleTimeUp = () => {
    setScore(0);
    alert("Time's up!");
  };

  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  };

  const handleSpeakClick = (questionText) => {
    speak(questionText);
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  const handleStartQuiz = () => {
    setQuizStarted(true);
  };

  const handleLeaveQuiz = () => {
    setQuizStarted(false);
  };

  if (!quizData) return <p>Loading quiz...</p>;

  return (
    <>
      <div className="container_top">
        <div className="top-card">
          <div className="img">
            <img className="img_1" src="image/kolo.png" alt="kolo" />
            <h2>{quizData.title}</h2>
          </div>
          <div className="span">
            <span><FaReadme /> React</span>
            <span><FaGraduationCap /> Junior Level</span>
          </div>
        </div>
        <div className="quiz_description">
          <p>This quiz is prepared for the course</p>
          <span>Prepared by</span>
          <div className="img2">
            <img className="img_2" src="image/kolo.png" alt="kolo" />
            <h2>Robel BM</h2>
          </div>
        </div>
        <div className="buttons">
          <button className="button but" onClick={handleStartQuiz}>
            Start Quiz
          </button>
          <button className="but" onClick={handleLeaveQuiz}>Leave Quiz</button>
        </div>
      </div>
      
      {quizStarted && (
        <>
          <div className="timer-container">
            <FaClock className="clock-icon" />
            <span className="time-display">{formatTime(timeLeft)}</span>
          </div>
          <div className="quiz-container">
            <form onSubmit={handleSubmit}>
              {quizData.questions.map((question) => (
                <div key={question._id} className="question">
                  <FaVolumeUp
                    className="volume-icon"
                    onClick={() => handleSpeakClick(question.questionText)}
                  />
                  <span className="textVoice" dangerouslySetInnerHTML={{ __html: question.questionText }} />
                  
                  {/* Display the image if fileUrl is present */}
                  {question.fileUrl && (
                    <div className="question-image">
                      <img src={question.fileUrl} alt="Question related visual" />
                    </div>
                  )}
                  
                  <h3>Choose matching term</h3>
                  <div className="options-container">
                    {question.options.map((option) => (
                      <div
                        key={option._id}
                        className={`option-box ${
                          answers[question._id] === option._id ? "selected" : ""
                        }`}
                        onClick={() => handleOptionClick(question._id, option._id)}
                      >
                        <label htmlFor={`${question._id}-${option._id}`}>
                          {option.optionText}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              <button className="quizSubmit" type="submit">
                Submit
              </button>
            </form>
            {score !== null && (
              <div className="score">
                <h2>
                  Your Score: {score} / {quizData.questions.length}
                </h2>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default Quiz;
