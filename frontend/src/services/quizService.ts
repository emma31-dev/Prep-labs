import type {
  Quiz,
  QuizWithResource,
  QuizSession,
  QuizSubmission,
  TestResult,
  GenerateQuizInput,
  Question,
} from '../types/quiz';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

/**
 * Helper to get stored access token from localStorage
 * Jotai atomWithStorage stores the auth state directly
 */
const getStoredAccessToken = (): string | null => {
  try {
    const authData = localStorage.getItem('auth');
    if (authData) {
      const parsed = JSON.parse(authData);
      return parsed.accessToken || null;
    }
  } catch {
    // Ignore parse errors
  }
  return null;
};

/**
 * Generate a new quiz from a resource using Gemini AI
 */
export const generateQuiz = async (
  input: GenerateQuizInput,
  accessToken?: string
): Promise<Quiz> => {
  const token = accessToken || getStoredAccessToken();

  if (!token) {
    throw new Error('Authentication required. Please ensure you are logged in.');
  }

  const response = await fetch(`${API_URL}/quizzes/generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      resourceId: input.resourceId,
      title: input.title,
      questionCount: input.questionCount,
      difficulty: input.difficulty,
    }),
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || 'Failed to generate quiz');
  }

  return data.quiz as Quiz;
};

/**
 * Fetch all quizzes for the authenticated user
 */
export const getQuizzes = async (
  accessToken?: string
): Promise<QuizWithResource[]> => {
  const token = accessToken || getStoredAccessToken();

  if (!token) {
    return [];
  }

  const response = await fetch(`${API_URL}/quizzes`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || 'Failed to fetch quizzes');
  }

  return data.quizzes as QuizWithResource[];
};

/**
 * Get a single quiz by ID
 */
export const getQuiz = async (
  quizId: string,
  accessToken?: string
): Promise<QuizWithResource> => {
  const token = accessToken || getStoredAccessToken();

  if (!token) {
    throw new Error('Session expired. Please login again.');
  }

  const response = await fetch(`${API_URL}/quizzes/${quizId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || 'Failed to fetch quiz');
  }

  return data.quiz as QuizWithResource;
};

/**
 * Start a quiz session with randomized questions
 */
export const startQuiz = async (
  quizId: string,
  accessToken?: string
): Promise<QuizSession> => {
  const token = accessToken || getStoredAccessToken();

  if (!token) {
    throw new Error('Session expired. Please login again.');
  }

  const response = await fetch(`${API_URL}/quizzes/${quizId}/start`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || 'Failed to start quiz');
  }

  return data.session as QuizSession;
};

/**
 * Submit quiz answers and get results
 */
export const submitQuiz = async (
  quizId: string,
  submission: QuizSubmission,
  accessToken?: string
): Promise<TestResult & { questions: Question[] }> => {
  const token = accessToken || getStoredAccessToken();

  if (!token) {
    throw new Error('Session expired. Please login again.');
  }

  const response = await fetch(`${API_URL}/quizzes/${quizId}/submit`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(submission),
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || 'Failed to submit quiz');
  }

  return data.result as TestResult & { questions: Question[] };
};

/**
 * Delete a quiz by ID
 */
export const deleteQuiz = async (
  quizId: string,
  accessToken?: string
): Promise<void> => {
  const token = accessToken || getStoredAccessToken();

  if (!token) {
    throw new Error('Session expired. Please login again.');
  }

  const response = await fetch(`${API_URL}/quizzes/${quizId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || 'Failed to delete quiz');
  }
};

/**
 * Quiz service object for convenient imports
 */
export const quizService = {
  generateQuiz,
  getQuizzes,
  getQuiz,
  startQuiz,
  submitQuiz,
  deleteQuiz,
};
