// Helper function to convert "min" string to integer minutes
const convertTimeToMinutes = (timeStr) => {
    return parseInt(timeStr.replace("min", ""), 10);
  };
  
  // Helper function to assign a weight to the student level
  const getLevelWeight = (level) => {
    switch (level.toLowerCase()) {
      case "beginner":
        return 1;
      case "intermediate":
        return 2;
      case "pro":
        return 3;
      default:
        return 0;
    }
  };
  
  const analyzeStudentInterest = (data) => {
    // Extract subject data
    const subjects = data.data;
  
    // Calculate subject interest scores based on student level and time spent
    const subjectScores = [];
    subjects.forEach((subject) => {
      const subjectName = subject.subject;
      let totalInterestScore = 0;
  
      subject.chapters.forEach((chapter) => {
        const videoTime = convertTimeToMinutes(chapter.seen_video_time);
        const pdfTime = convertTimeToMinutes(chapter.pdf_read_time);
        const totalTimeSpent = videoTime + pdfTime;
  
        const levelWeight = getLevelWeight(chapter.student_level);
  
        // Interest score for this chapter = levelWeight * totalTimeSpent
        totalInterestScore += levelWeight * totalTimeSpent;
      });
  
      // Add the subject and total interest score to the result
      subjectScores.push({ subject: subjectName, interestScore: totalInterestScore });
    });
  
    // Sort subjects by total interest score in descending order
    subjectScores.sort((a, b) => b.interestScore - a.interestScore);
  
    // Prepare the result in the required format
    const sortedSubjectsJson = { 
      data: subjectScores.map(({ subject, interestScore }) => ({ 
        subject, 
        interestScore 
      })) 
    };
  
    return sortedSubjectsJson;
  };
  
  // Sample student data
  const studentData = {
    data: [
      {
        subject: "DSA",
        chapters: [
          {
            chapter: "array and linklist",
            total_video_time: "90min",
            seen_video_time: "70min",
            pdf_read_time: "20min",
            student_level: "intermediate"
          }
        ]
      },
      {
        subject: "Machine Learning",
        chapters: [
          {
            chapter: "basic python",
            total_video_time: "30min",
            seen_video_time: "15min",
            pdf_read_time: "10min",
            student_level: "pro"
          },
          {
            chapter: "ml algoritham",
            total_video_time: "30min",
            seen_video_time: "15min",
            pdf_read_time: "10min",
            student_level: "pro"
          },
          {
            chapter: "deep larening",
            total_video_time: "30min",
            seen_video_time: "15min",
            pdf_read_time: "10min",
            student_level: "pro"
          }
        ]
      },
      {
        subject: "Statastic and probability",
        chapters: [
          {
            chapter: "linear lineas",
            total_video_time: "30min",
            seen_video_time: "15min",
            pdf_read_time: "10min",
            student_level: "pro"
          },
          {
            chapter: "conditional probability",
            total_video_time: "30min",
            seen_video_time: "15min",
            pdf_read_time: "10min",
            student_level: "pro"
          }
        ]
      },
      {
        subject: "SQL",
        chapters: [
          {
            chapter: "Basic Of SQL",
            total_video_time: "30min",
            seen_video_time: "15min",
            pdf_read_time: "10min",
            student_level: "pro"
          },
          {
            chapter: "All quesry",
            total_video_time: "30min",
            seen_video_time: "15min",
            pdf_read_time: "10min",
            student_level: "pro"
          }
        ]
      }
    ]
  };
  
  // Analyze student data
  const sortedSubjects = analyzeStudentInterest(studentData);
  
  // Print the result
  console.log(JSON.stringify(sortedSubjects, null, 2));
  