import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
}

// Mock quiz data - simulating API response
const mockQuizData: Record<string, { title: string; session: string; questions: Question[] }> = {
  "1": {
    title: "MCT Mock Tests",
    session: "Session 1",
    questions: [
      {
        id: 1,
        question: "The Indian Contract Act 1872 came into force on...",
        options: ["1st September 1872", "1st April 1872", "1st January 1872", "1st July 1872"],
        correctAnswer: 0,
      },
      {
        id: 2,
        question: "Which section of the Indian Contract Act defines 'Contract'?",
        options: ["Section 2(a)", "Section 2(h)", "Section 2(e)", "Section 10"],
        correctAnswer: 1,
      },
      {
        id: 3,
        question: "A contract without consideration is...",
        options: ["Valid", "Void", "Voidable", "Illegal"],
        correctAnswer: 1,
      },
      {
        id: 4,
        question: "The age of majority in India is...",
        options: ["16 years", "18 years", "21 years", "25 years"],
        correctAnswer: 1,
      },
      {
        id: 5,
        question: "An agreement enforceable by law is a...",
        options: ["Promise", "Contract", "Offer", "Acceptance"],
        correctAnswer: 1,
      },
    ],
  },
};

const Quiz = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [quiz, setQuiz] = useState<{ title: string; session: string; questions: Question[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(30 * 60); // 30 minutes in seconds

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const quizData = mockQuizData[id || "1"] || mockQuizData["1"];
      setQuiz(quizData);
      setLoading(false);
    }, 500);
  }, [id]);

  // Timer countdown
  useEffect(() => {
    if (!loading && !showResults && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [loading, showResults, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden" style={{ backgroundColor: "#f8fafc" }}>
        {/* Background Blobs */}
        <div className="fixed -top-20 -left-20 w-[500px] h-[500px] rounded-full opacity-15 blur-[80px]" style={{ backgroundColor: "#581c87" }} />
        <div className="fixed -bottom-20 -right-20 w-[400px] h-[400px] rounded-full opacity-15 blur-[80px]" style={{ backgroundColor: "#581c87" }} />
        <div className="text-center">
          <div
            className="w-12 h-12 border-4 border-t-transparent rounded-full animate-spin mx-auto mb-4"
            style={{ borderColor: "#581c87", borderTopColor: "transparent" }}
          />
          <p style={{ color: "#737373" }}>Loading quiz...</p>
        </div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#f8fafc" }}>
        <div className="text-center">
          <p className="text-xl" style={{ color: "#171717" }}>Quiz not found</p>
          <button
            onClick={() => navigate("/dashboard")}
            className="mt-4 px-6 py-2 rounded-lg text-white"
            style={{ backgroundColor: "#581c87" }}
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const questions = quiz.questions;
  const question = questions[currentQuestion];

  const handleSelectAnswer = (optionIndex: number) => {
    setSelectedAnswers({ ...selectedAnswers, [currentQuestion]: optionIndex });
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleFinish = () => {
    setShowResults(true);
  };

  const calculateScore = () => {
    let correct = 0;
    questions.forEach((q, index) => {
      if (selectedAnswers[index] === q.correctAnswer) {
        correct++;
      }
    });
    return correct;
  };

  if (showResults) {
    const score = calculateScore();
    const percentage = Math.round((score / questions.length) * 100);

    return (
      <div className="min-h-screen flex items-center justify-center p-4 md:p-8 relative overflow-hidden" style={{ backgroundColor: "#f8fafc" }}>
        {/* Background Blobs */}
        <div className="fixed -top-20 -left-20 w-[500px] h-[500px] rounded-full opacity-15 blur-[80px]" style={{ backgroundColor: "#581c87" }} />
        <div className="fixed -bottom-20 -right-20 w-[400px] h-[400px] rounded-full opacity-15 blur-[80px]" style={{ backgroundColor: "#581c87" }} />
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full opacity-15 blur-[80px]" style={{ backgroundColor: "#a855f7" }} />

        <div
          className="w-full max-w-2xl rounded-[32px] shadow-2xl p-8 text-center"
          style={{
            background: "rgba(255, 255, 255, 0.7)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(255, 255, 255, 0.4)",
          }}
        >
          <div
            className="w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center"
            style={{ backgroundColor: percentage >= 70 ? "#dcfce7" : percentage >= 50 ? "#fef3c7" : "#fee2e2" }}
          >
            <span
              className="text-3xl font-bold"
              style={{ color: percentage >= 70 ? "#16a34a" : percentage >= 50 ? "#d97706" : "#dc2626" }}
            >
              {percentage}%
            </span>
          </div>

          <h1 className="text-2xl font-bold mb-2" style={{ color: "#171717" }}>
            {percentage >= 70 ? "Great Job!" : percentage >= 50 ? "Good Effort!" : "Keep Practicing!"}
          </h1>
          <p className="mb-6" style={{ color: "#64748b" }}>
            You scored {score} out of {questions.length} questions correctly
          </p>

          <div className="space-y-3 mb-8 max-h-60 overflow-y-auto">
            {questions.map((q, index) => (
              <div
                key={q.id}
                className="flex items-center justify-between p-3 rounded-lg"
                style={{
                  backgroundColor: selectedAnswers[index] === q.correctAnswer ? "#dcfce7" : "#fee2e2",
                }}
              >
                <span className="text-sm" style={{ color: "#171717" }}>
                  Question {index + 1}
                </span>
                <span
                  className="text-sm font-medium"
                  style={{ color: selectedAnswers[index] === q.correctAnswer ? "#16a34a" : "#dc2626" }}
                >
                  {selectedAnswers[index] === q.correctAnswer ? "Correct" : "Incorrect"}
                </span>
              </div>
            ))}
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => {
                setShowResults(false);
                setCurrentQuestion(0);
                setSelectedAnswers({});
                setTimeLeft(30 * 60);
              }}
              className="flex-1 py-3 rounded-xl font-semibold border-2 transition-all"
              style={{ borderColor: "#581c87", color: "#581c87" }}
            >
              Retry Quiz
            </button>
            <button
              onClick={() => navigate("/dashboard")}
              className="flex-1 py-3 rounded-xl font-semibold text-white shadow-lg transition-all"
              style={{ backgroundColor: "#ea580c" }}
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex items-center justify-center p-0 lg:p-6 relative overflow-hidden" style={{ backgroundColor: "#f8fafc" }}>
      {/* Background Blobs */}
      <div className="fixed -top-20 -left-20 w-[500px] h-[500px] rounded-full opacity-15 blur-[80px]" style={{ backgroundColor: "#581c87" }} />
      <div className="fixed -bottom-20 -right-20 w-[400px] h-[400px] rounded-full opacity-15 blur-[80px]" style={{ backgroundColor: "#581c87" }} />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full opacity-15 blur-[80px]" style={{ backgroundColor: "#a855f7" }} />

      {/* Main Glass Container - Full screen on mobile, modal on lg+ */}
      <div
        className="w-full h-full lg:max-w-6xl lg:h-auto lg:max-h-[calc(100vh-3rem)] lg:rounded-[32px] shadow-2xl flex flex-col overflow-hidden relative"
        style={{
          background: "rgba(255, 255, 255, 0.7)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(255, 255, 255, 0.4)",
        }}
      >
        {/* Header */}
        <header className="p-4 md:px-8 flex flex-wrap items-center justify-between gap-3 border-b shrink-0" style={{ borderColor: "rgba(255, 255, 255, 0.2)" }}>
          <div className="flex flex-col">
            <h1 className="text-lg font-bold" style={{ color: "#581c87" }}>{quiz.title}</h1>
            <p className="text-xs font-medium uppercase tracking-widest" style={{ color: "#64748b" }}>{quiz.session}</p>
          </div>

          {/* Question Navigator */}
          <nav className="flex items-center space-x-1 md:space-x-2">
            <button
              onClick={() => currentQuestion > 0 && setCurrentQuestion(currentQuestion - 1)}
              className="w-8 h-8 flex items-center justify-center rounded-full transition-colors hover:bg-black/5"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <div className="flex items-center space-x-1">
              {questions.map((_, index) => {
                const isCurrentQuestion = currentQuestion === index;
                const isAnswered = selectedAnswers[index] !== undefined;
                
                return (
                  <button
                    key={index}
                    onClick={() => setCurrentQuestion(index)}
                    className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-semibold transition-all ring-2 ring-purple-900`}
                    style={{
                      backgroundColor: isCurrentQuestion ? "#581c87" : isAnswered ? "#ea580c" : "transparent",
                      color: isCurrentQuestion || isAnswered ? "#ffffff" : "#171717",
                      boxShadow: isCurrentQuestion ? "0 10px 15px -3px rgba(88, 28, 135, 0.3)" : "none",
                    }}
                  >
                    {index + 1}
                  </button>
                );
              })}
            </div>
            <button
              onClick={() => currentQuestion < questions.length - 1 && setCurrentQuestion(currentQuestion + 1)}
              className="w-8 h-8 flex items-center justify-center rounded-full transition-colors hover:bg-black/5"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </nav>

          {/* Timer */}
          <div
            className="flex items-center space-x-2 py-1.5 px-3 rounded-full"
            style={{ backgroundColor: "rgba(255, 255, 255, 0.4)", border: "1px solid rgba(255, 255, 255, 0.2)" }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#581c87" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12,6 12,12 16,14" />
            </svg>
            <div className="flex flex-col leading-none">
              <span className="text-base font-bold font-mono">{formatTime(timeLeft)}</span>
              <span className="text-[9px] uppercase font-bold tracking-tighter" style={{ color: "#94a3b8" }}>Time Left</span>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          <div className="max-w-4xl mx-auto h-full flex flex-col">
            <span className="font-bold text-sm tracking-widest uppercase mb-2 block" style={{ color: "#581c87" }}>
              Question {currentQuestion + 1}
            </span>
            <h2 className="text-xl md:text-2xl font-semibold leading-relaxed mb-6" style={{ color: "#1e293b" }}>
              {question.question}
            </h2>

            {/* Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 flex-1">
              {question.options.map((option, index) => {
                const isSelected = selectedAnswers[currentQuestion] === index;
                const optionLabels = ["A", "B", "C", "D"];

                return (
                  <button
                    key={index}
                    onClick={() => handleSelectAnswer(index)}
                    className="group flex items-center justify-between p-4 rounded-xl border-2 transition-all duration-300"
                    style={{
                      background: isSelected ? "rgba(88, 28, 135, 0.05)" : "rgba(255, 255, 255, 0.7)",
                      backdropFilter: "blur(12px)",
                      borderColor: isSelected ? "#581c87" : "#e2e8f0",
                      boxShadow: isSelected ? "0 10px 15px -3px rgba(88, 28, 135, 0.1)" : "none",
                    }}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="font-semibold text-sm" style={{ color: isSelected ? "#581c87" : "#64748b" }}>
                        {optionLabels[index]}
                      </span>
                      <span className="text-sm" style={{ color: isSelected ? "#581c87" : "#475569" }}>{option}</span>
                    </div>
                    <div
                      className="w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors shrink-0"
                      style={{
                        borderColor: isSelected ? "#581c87" : "#cbd5e1",
                        backgroundColor: isSelected ? "#581c87" : "transparent",
                      }}
                    >
                      {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer
          className="p-4 md:px-8 flex items-center justify-between border-t shrink-0"
          style={{ backgroundColor: "rgba(255, 255, 255, 0.3)", borderColor: "rgba(255, 255, 255, 0.2)" }}
        >
          <div className="flex items-center space-x-3">
            <button
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className="flex items-center space-x-2 px-4 py-2 rounded-xl font-semibold text-sm transition-all disabled:opacity-50"
              style={{ backgroundColor: "rgba(148, 163, 184, 0.2)" }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              <span>Previous</span>
            </button>
            <button
              onClick={handleNext}
              disabled={currentQuestion === questions.length - 1}
              className="flex items-center space-x-2 px-4 py-2 rounded-xl font-semibold text-sm transition-all disabled:opacity-50"
              style={{ backgroundColor: "rgba(148, 163, 184, 0.2)" }}
            >
              <span>Next</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>
          <button
            onClick={handleFinish}
            className="px-8 py-2 rounded-xl text-white font-bold text-sm shadow-lg transition-all active:scale-95 uppercase tracking-wider"
            style={{ backgroundColor: "#ea580c" }}
          >
            Finish
          </button>
        </footer>
      </div>
    </div>
  );
};

export default Quiz;
