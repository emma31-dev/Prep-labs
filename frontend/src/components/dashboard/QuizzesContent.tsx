import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { quizService } from '../../services/quizService';
import type { QuizWithResource, QuizDifficulty } from '../../types/quiz';

interface QuizzesContentProps {
  searchQuery?: string;
}

// Helper to format date
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

// Helper to get difficulty badge styles
const getDifficultyStyles = (difficulty: QuizDifficulty) => {
  switch (difficulty) {
    case 'easy':
      return { backgroundColor: '#dcfce7', color: '#16a34a' };
    case 'medium':
      return { backgroundColor: '#fef3c7', color: '#d97706' };
    case 'hard':
      return { backgroundColor: '#fee2e2', color: '#dc2626' };
    default:
      return { backgroundColor: '#f5f5f5', color: '#737373' };
  }
};

const QuizzesContent = ({ searchQuery = '' }: QuizzesContentProps) => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading: authLoading, accessToken } = useAuth();
  const [quizzes, setQuizzes] = useState<QuizWithResource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch quizzes
  const fetchQuizzes = useCallback(async () => {
    if (authLoading) return;
    if (!isAuthenticated) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await quizService.getQuizzes(accessToken || undefined);
      setQuizzes(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load quizzes';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [accessToken, authLoading, isAuthenticated]);

  useEffect(() => {
    fetchQuizzes();
  }, [fetchQuizzes]);


  // Handle delete quiz
  const handleDelete = async (quizId: string) => {
    setIsDeleting(true);
    try {
      await quizService.deleteQuiz(quizId, accessToken || undefined);
      setQuizzes((prev) => prev.filter((q) => q.id !== quizId));
      setDeleteConfirm(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete quiz';
      setError(errorMessage);
    } finally {
      setIsDeleting(false);
    }
  };

  // Handle start quiz
  const handleStartQuiz = (quizId: string) => {
    navigate(`/quiz/${quizId}`);
  };

  // Filter quizzes based on search query
  const filteredQuizzes = quizzes.filter((quiz) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      quiz.title.toLowerCase().includes(query) ||
      (quiz.resource_title && quiz.resource_title.toLowerCase().includes(query)) ||
      (quiz.resource_topic && quiz.resource_topic.toLowerCase().includes(query))
    );
  });

  const hasNoResults = filteredQuizzes.length === 0 && quizzes.length > 0 && searchQuery.trim();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold" style={{ color: '#171717' }}>
          My Quizzes
        </h1>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <svg
            className="animate-spin"
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#581c87"
            strokeWidth="2"
          >
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
          </svg>
        </div>
      ) : error ? (
        <div
          className="p-6 rounded-xl text-center"
          style={{ backgroundColor: '#fef2f2' }}
        >
          <p style={{ color: '#dc2626' }}>{error}</p>
          <button
            onClick={fetchQuizzes}
            className="mt-3 px-4 py-2 rounded-lg font-medium text-sm"
            style={{ backgroundColor: '#fee2e2', color: '#dc2626' }}
          >
            Try Again
          </button>
        </div>
      ) : quizzes.length === 0 ? (
        <div
          className="p-12 rounded-2xl text-center"
          style={{ backgroundColor: '#ffffff' }}
        >
          <div
            className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
            style={{ backgroundColor: '#faf5ff' }}
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#581c87" strokeWidth="2">
              <path d="M9 11l3 3L22 4" />
              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
            </svg>
          </div>
          <h3 className="text-lg font-bold mb-2" style={{ color: '#171717' }}>
            No quizzes yet
          </h3>
          <p className="text-sm mb-6" style={{ color: '#737373' }}>
            Generate quizzes from your resources to get started.
          </p>
        </div>
      ) : hasNoResults ? (
        <div
          className="p-12 rounded-2xl text-center"
          style={{ backgroundColor: '#ffffff' }}
        >
          <div
            className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
            style={{ backgroundColor: '#faf5ff' }}
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#581c87" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/>
              <path d="M21 21l-4.35-4.35"/>
            </svg>
          </div>
          <h3 className="text-lg font-bold mb-2" style={{ color: '#171717' }}>
            No results for "{searchQuery}"
          </h3>
          <p className="text-sm" style={{ color: '#737373' }}>
            Try a different search term or clear the search.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredQuizzes.map((quiz) => (
            <div
              key={quiz.id}
              className="rounded-2xl p-5 shadow-sm transition-all hover:shadow-md"
              style={{ backgroundColor: '#ffffff' }}
            >
              {/* Quiz Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <h3
                    className="font-semibold text-lg truncate"
                    style={{ color: '#171717' }}
                    title={quiz.title}
                  >
                    {quiz.title}
                  </h3>
                  {quiz.resource_title && (
                    <p
                      className="text-sm truncate mt-1"
                      style={{ color: '#737373' }}
                      title={quiz.resource_title}
                    >
                      From: {quiz.resource_title}
                    </p>
                  )}
                </div>
                <span
                  className="px-2 py-1 rounded-full text-xs font-medium capitalize ml-2 flex-shrink-0"
                  style={getDifficultyStyles(quiz.difficulty)}
                >
                  {quiz.difficulty}
                </span>
              </div>

              {/* Quiz Info */}
              <div className="flex items-center gap-4 mb-4 text-sm" style={{ color: '#737373' }}>
                <div className="flex items-center gap-1">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                    <line x1="12" y1="17" x2="12.01" y2="17" />
                  </svg>
                  <span>{quiz.total_questions} questions</span>
                </div>
                <div className="flex items-center gap-1">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                  <span>{quiz.time_limit_minutes} min</span>
                </div>
              </div>

              {/* Date */}
              <p className="text-xs mb-4" style={{ color: '#a3a3a3' }}>
                Created {formatDate(quiz.created_at)}
              </p>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleStartQuiz(quiz.id)}
                  className="flex-1 px-4 py-2 rounded-xl font-semibold text-white transition-all hover:opacity-90"
                  style={{ backgroundColor: '#581c87' }}
                >
                  Start Quiz
                </button>
                <button
                  onClick={() => setDeleteConfirm(quiz.id)}
                  className="p-2 rounded-xl transition-all hover:bg-red-50"
                  style={{ color: '#dc2626' }}
                  title="Delete quiz"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    <line x1="10" y1="11" x2="10" y2="17" />
                    <line x1="14" y1="11" x2="14" y2="17" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div
            className="rounded-2xl p-6 max-w-sm w-full mx-4 shadow-xl"
            style={{ backgroundColor: '#ffffff' }}
          >
            <h3 className="text-lg font-bold mb-2" style={{ color: '#171717' }}>
              Delete Quiz?
            </h3>
            <p className="text-sm mb-6" style={{ color: '#737373' }}>
              This action cannot be undone. The quiz and all its questions will be permanently deleted.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                disabled={isDeleting}
                className="flex-1 px-4 py-2 rounded-xl font-semibold transition-all"
                style={{ backgroundColor: '#f5f5f5', color: '#171717' }}
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                disabled={isDeleting}
                className="flex-1 px-4 py-2 rounded-xl font-semibold text-white transition-all hover:opacity-90 flex items-center justify-center gap-2"
                style={{ backgroundColor: '#dc2626' }}
              >
                {isDeleting ? (
                  <>
                    <svg
                      className="animate-spin"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                    </svg>
                    Deleting...
                  </>
                ) : (
                  'Delete'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizzesContent;
