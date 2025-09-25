const handleAddQuiz = async () => {
  setLoading(true);
  setUploadModalOpen(true);

  try {
    // Prepare form data with quiz details and question structure
    const formData = {
      title: quizTitle,
      lesson: lessonId, // Make sure lessonId is passed correctly
      questions: questions.map((q) => ({
        questionText: q.question,
        options: q.options.map(option => ({ optionText: option })),
        correctOptionIndex: q.correctOption,
      })),
      durationMinutes: quizTime,
    };

    // Send form data to the backend
    const response = await axios.post(`https://kolo-temari-backend-service.onrender.com/api/course/lesson/${lessonId}/quiz`, formData,{withCredentials: true,});

    if (response.data.status === 'success') {
      toast({
        title: 'Quiz added successfully!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      onClose(); // Close the form after success
    } else {
      throw new Error('Failed to add quiz.');
    }
  } catch (error) {
    toast({
      title: 'Error adding quiz',
      description: error.message,
      status: 'error',
      duration: 3000,
      isClosable: true,
    });
  } finally {
    setLoading(false);
    setUploadModalOpen(false);
  }
};
