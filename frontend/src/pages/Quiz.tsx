import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { quizService } from "../services/quizService";
import type { Question, QuizSession, TestResult } from "../types/quiz";

type ViewMode = 'quiz' | 'results' | 'solutions';

const Quiz = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // Quiz state
  const [session, setSession] = useState<QuizSession | null>(null);
  const [quizTitle, setQuizTitle] = useState<string>("");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [viewMode, setViewMode] = useState<ViewMode>('quiz');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [startTime] = useState<number>(Date.now());
  
  // Results state
  const [result, setResult] = useState<(TestResult & { questions: Question[] }) | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Load quiz session on mount
  useEffect(() => {
    const loadQuiz = async () => {
      if (!id) {
        setError("Quiz ID is required");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        // First get quiz details for title
        const quizData = await quizService.getQuiz(id);
        setQuizTitle(quizData.title);
        
        // Start quiz session with randomized questions
        const quizSession = await quizService.startQuiz(id);
        setSession(quizSession);
        setTimeLeft(quizSession.timeLimit * 60); // Convert minutes to seconds
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load quiz");
      } finally {
        setLoading(false);
      }
    };

    loadQuiz();
  }, [id]);

  // Timer countdown
  useEffect(() => {
    if (!loading && viewMode === 'quiz' && timeLeft > 0 && session) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            // Auto-submit when time runs out
            handleFinish();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [loading, viewMode, timeLeft, session]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleSelectAnswer = (optionIndex: number) => {
    setSelectedAnswers({ ...selectedAnswers, [currentQuestion]: optionIndex });
  };

  const handleNext = () => {
    if (session && currentQuestion < session.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleFinish = useCallback(async () => {
    if (!session || !id || submitting) return;

    try {
      setSubmitting(true);
      const timeTaken = Math.floor((Date.now() - startTime) / 1000);
      
      // Build answers array
      const answers = session.questions.map((q, index) => ({
        questionId: q.id,
        selectedAnswer: selectedAnswers[index] ?? null,
      }));

      const submission = {
        sessionId: session.sessionId,
        answers,
        timeTaken,
      };

      const quizResult = await quizService.submitQuiz(id, submission);
      setResult(quizResult);
      setViewMode('results');
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit quiz");
    } finally {
      setSubmitting(false);
    }
  }, [session, id, selectedAnswers, startTime, submitting]);

  const handleReturnHome = () => {
    navigate("/dashboard");
  };

  const handleCheckSolutions = () => {
    setCurrentQuestion(0);
    setViewMode('solutions');
  };

  const handleRetryQuiz = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      setError(null);
      setSelectedAnswers({});
      setCurrentQuestion(0);
      setResult(null);
      
      const quizSession = await quizService.startQuiz(id);
      setSession(quizSession);
      setTimeLeft(quizSession.timeLimit * 60);
      setViewMode('quiz');
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to restart quiz");
    } finally {
      setLoading(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden" style={{ backgroundColor: "#f8fafc" }}>
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

  // Error state
  if (error || !session) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#f8fafc" }}>
        <div className="text-center">
          <p className="text-xl mb-2" style={{ color: "#171717" }}>{error || "Quiz not found"}</p>
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

  const questions = session.questions;

  // Results view
  if (viewMode === 'results' && result) {
    const percentage = Math.round(result.score);
    const performanceMessage = percentage >= 70 ? "Great Job!" : percentage >= 50 ? "Good Effort!" : "Keep Practicing!";

    return (
      <div className="min-h-screen flex items-center justify-center p-4 md:p-8 relative overflow-hidden" style={{ backgroundColor: "#f8fafc" }}>
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
            {performanceMessage}
          </h1>
          <p className="mb-6" style={{ color: "#64748b" }}>
            You scored {result.correct_answers} out of {result.total_questions} questions correctly
          </p>

          <div className="space-y-3 mb-8 max-h-60 overflow-y-auto">
            {result.answers.map((answer, index) => (
              <div
                key={answer.question_id}
                className="flex items-center justify-between p-3 rounded-lg"
                style={{
                  backgroundColor: answer.is_correct ? "#dcfce7" : "#fee2e2",
                }}
              >
                <span className="text-sm" style={{ color: "#171717" }}>
                  Question {index + 1}
                </span>
                <span
                  className="text-sm font-medium"
                  style={{ color: answer.is_correct ? "#16a34a" : "#dc2626" }}
                >
                  {answer.is_correct ? "Correct" : "Incorrect"}
                </span>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleRetryQuiz}
              className="flex-1 py-3 rounded-xl font-semibold border-2 transition-all hover:bg-purple-50"
              style={{ borderColor: "#581c87", color: "#581c87" }}
            >
              Retry Quiz
            </button>
            <button
              onClick={handleReturnHome}
              className="flex-1 py-3 rounded-xl font-semibold text-white shadow-lg transition-all hover:opacity-90"
              style={{ backgroundColor: "#581c87" }}
            >
              Return Home
            </button>
            <button
              onClick={handleCheckSolutions}
              className="flex-1 py-3 rounded-xl font-semibold text-white shadow-lg transition-all hover:opacity-90"
              style={{ backgroundColor: "#ea580c" }}
            >
              Check Solutions
            </button>
          </div>
        </div>
      </div>
    );
  }


  // Solutions view
  if (viewMode === 'solutions' && result) {
    const currentQ = result.questions[currentQuestion];
    const currentAnswer = result.answers[currentQuestion];
    const userSelectedIndex = currentAnswer?.selected_answer;
    const isCorrect = currentAnswer?.is_correct;

    return (
      <div className="min-h-screen flex items-center justify-center p-4 md:p-8 relative overflow-hidden" style={{ backgroundColor: "#f8fafc" }}>
        <div className="fixed -top-20 -left-20 w-[500px] h-[500px] rounded-full opacity-15 blur-[80px]" style={{ backgroundColor: "#581c87" }} />
        <div className="fixed -bottom-20 -right-20 w-[400px] h-[400px] rounded-full opacity-15 blur-[80px]" style={{ backgroundColor: "#581c87" }} />
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full opacity-15 blur-[80px]" style={{ backgroundColor: "#a855f7" }} />

        <div
          className="w-full max-w-4xl rounded-[32px] shadow-2xl overflow-hidden"
          style={{
            background: "rgba(255, 255, 255, 0.7)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(255, 255, 255, 0.4)",
          }}
        >
          {/* Header */}
          <header className="p-4 md:px-8 flex flex-wrap items-center justify-between gap-3 border-b" style={{ borderColor: "rgba(255, 255, 255, 0.2)" }}>
            <div className="flex flex-col">
              <h1 className="text-lg font-bold" style={{ color: "#581c87" }}>{quizTitle} - Solutions</h1>
              <p className="text-xs font-medium uppercase tracking-widest" style={{ color: "#64748b" }}>
                Score: {result.correct_answers}/{result.total_questions} ({Math.round(result.score)}%)
              </p>
            </div>

            {/* Question Navigator */}
            <nav className="flex items-center space-x-1 md:space-x-2">
              <button
                onClick={() => currentQuestion > 0 && setCurrentQuestion(currentQuestion - 1)}
                disabled={currentQuestion === 0}
                className="w-8 h-8 flex items-center justify-center rounded-full transition-colors hover:bg-black/5 disabled:opacity-50"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>
              <div className="flex items-center space-x-1 flex-wrap">
                {result.questions.map((_, index) => {
                  const isCurrentQuestion = currentQuestion === index;
                  const answerData = result.answers[index];
                  const wasCorrect = answerData?.is_correct;
                  
                  return (
                    <button
                      key={index}
                      onClick={() => setCurrentQuestion(index)}
                      className="w-8 h-8 flex items-center justify-center rounded-full text-sm font-semibold transition-all"
                      style={{
                        backgroundColor: isCurrentQuestion 
                          ? "#581c87" 
                          : wasCorrect 
                            ? "#16a34a" 
                            : "#dc2626",
                        color: "#ffffff",
                        boxShadow: isCurrentQuestion ? "0 10px 15px -3px rgba(88, 28, 135, 0.3)" : "none",
                        transform: isCurrentQuestion ? "scale(1.1)" : "scale(1)",
                      }}
                    >
                      {index + 1}
                    </button>
                  );
                })}
              </div>
              <button
                onClick={() => currentQuestion < result.questions.length - 1 && setCurrentQuestion(currentQuestion + 1)}
                disabled={currentQuestion === result.questions.length - 1}
                className="w-8 h-8 flex items-center justify-center rounded-full transition-colors hover:bg-black/5 disabled:opacity-50"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>
            </nav>
          </header>

          {/* Main Content */}
          <main className="p-4 md:p-8">
            <div className="max-w-3xl mx-auto">
              {/* Result indicator */}
              <div 
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mb-4"
                style={{ 
                  backgroundColor: isCorrect ? "#dcfce7" : "#fee2e2",
                  color: isCorrect ? "#16a34a" : "#dc2626"
                }}
              >
                {isCorrect ? "✓ Correct" : "✗ Incorrect"}
              </div>

              <span className="font-bold text-sm tracking-widest uppercase mb-2 block" style={{ color: "#581c87" }}>
                Question {currentQuestion + 1} of {result.questions.length}
              </span>
              <h2 className="text-xl md:text-2xl font-semibold leading-relaxed mb-6" style={{ color: "#1e293b" }}>
                {currentQ.question}
              </h2>

              {/* Options with correct/incorrect styling */}
              <div className="space-y-3 mb-6">
                {currentQ.options.map((option, index) => {
                  const optionLabels = ["A", "B", "C", "D"];
                  const isCorrectAnswer = index === currentQ.correctAnswer;
                  const isUserAnswer = index === userSelectedIndex;
                  const showAsCorrect = isCorrectAnswer;
                  const showAsIncorrect = isUserAnswer && !isCorrectAnswer;

                  return (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 rounded-xl border-2 transition-all"
                      style={{
                        backgroundColor: showAsCorrect 
                          ? "rgba(22, 163, 74, 0.1)" 
                          : showAsIncorrect 
                            ? "rgba(220, 38, 38, 0.1)" 
                            : "rgba(255, 255, 255, 0.7)",
                        borderColor: showAsCorrect 
                          ? "#16a34a" 
                          : showAsIncorrect 
                            ? "#dc2626" 
                            : "#e2e8f0",
                      }}
                    >
                      <div className="flex items-center space-x-3">
                        <span 
                          className="font-semibold text-sm"
                          style={{ 
                            color: showAsCorrect 
                              ? "#16a34a" 
                              : showAsIncorrect 
                                ? "#dc2626" 
                                : "#64748b" 
                          }}
                        >
                          {optionLabels[index]}
                        </span>
                        <span 
                          className="text-sm"
                          style={{ 
                            color: showAsCorrect 
                              ? "#16a34a" 
                              : showAsIncorrect 
                                ? "#dc2626" 
                                : "#475569" 
                          }}
                        >
                          {option}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {isUserAnswer && (
                          <span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: "#f1f5f9", color: "#64748b" }}>
                            Your answer
                          </span>
                        )}
                        {showAsCorrect && (
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2">
                            <path d="M20 6L9 17l-5-5" />
                          </svg>
                        )}
                        {showAsIncorrect && (
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2">
                            <path d="M18 6L6 18M6 6l12 12" />
                          </svg>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Explanation */}
              <div 
                className="p-4 rounded-xl"
                style={{ backgroundColor: "rgba(88, 28, 135, 0.05)", border: "1px solid rgba(88, 28, 135, 0.1)" }}
              >
                <h3 className="font-semibold text-sm mb-2" style={{ color: "#581c87" }}>Explanation</h3>
                <p className="text-sm leading-relaxed" style={{ color: "#475569" }}>
                  {currentQ.explanation}
                </p>
              </div>
            </div>
          </main>

          {/* Footer */}
          <footer
            className="p-4 md:px-8 flex items-center justify-between border-t"
            style={{ backgroundColor: "rgba(255, 255, 255, 0.3)", borderColor: "rgba(255, 255, 255, 0.2)" }}
          >
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
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
                onClick={() => setCurrentQuestion(Math.min(result.questions.length - 1, currentQuestion + 1))}
                disabled={currentQuestion === result.questions.length - 1}
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
              onClick={handleReturnHome}
              className="px-8 py-2 rounded-xl text-white font-bold text-sm shadow-lg transition-all active:scale-95"
              style={{ backgroundColor: "#581c87" }}
            >
              Return Home
            </button>
          </footer>
        </div>
      </div>
    );
  }


  // Quiz taking view (default)
  const question = questions[currentQuestion];

  return (
    <div className="h-screen flex items-center justify-center p-0 lg:p-6 relative overflow-hidden" style={{ backgroundColor: "#f8fafc" }}>
      {/* Background Blobs */}
      <div className="fixed -top-20 -left-20 w-[500px] h-[500px] rounded-full opacity-15 blur-[80px]" style={{ backgroundColor: "#581c87" }} />
      <div className="fixed -bottom-20 -right-20 w-[400px] h-[400px] rounded-full opacity-15 blur-[80px]" style={{ backgroundColor: "#581c87" }} />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full opacity-15 blur-[80px]" style={{ backgroundColor: "#a855f7" }} />

      {/* Main Glass Container */}
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
            <h1 className="text-lg font-bold" style={{ color: "#581c87" }}>{quizTitle}</h1>
            <p className="text-xs font-medium uppercase tracking-widest" style={{ color: "#64748b" }}>
              {questions.length} Questions
            </p>
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
                    className="w-8 h-8 flex items-center justify-center rounded-full text-sm font-semibold transition-all ring-2 ring-purple-900"
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
              <span 
                className="text-base font-bold font-mono"
                style={{ color: timeLeft < 60 ? "#dc2626" : "#171717" }}
              >
                {formatTime(timeLeft)}
              </span>
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
                      <span className="text-sm text-left" style={{ color: isSelected ? "#581c87" : "#475569" }}>{option}</span>
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
            disabled={submitting}
            className="px-8 py-2 rounded-xl text-white font-bold text-sm shadow-lg transition-all active:scale-95 uppercase tracking-wider disabled:opacity-50"
            style={{ backgroundColor: "#ea580c" }}
          >
            {submitting ? "Submitting..." : "Finish"}
          </button>
        </footer>
      </div>
    </div>
  );
};

export default Quiz;
