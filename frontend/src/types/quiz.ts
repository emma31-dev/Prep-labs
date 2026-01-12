/**
 * Quiz type definitions for the Quiz Generation feature
 */

// Difficulty levels for quizzes
export type QuizDifficulty = 'easy' | 'medium' | 'hard';

// Individual question within a quiz
export interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

// Main quiz entity matching database schema
export interface Quiz {
  id: string;
  resource_id: string;
  title: string;
  description: string | null;
  difficulty: QuizDifficulty;
  total_questions: number;
  time_limit_minutes: number;
  questions: Question[];
  is_public: boolean;
  tags: string[];
  created_at: string;
  updated_at: string;
}

// Quiz with resource details for display
export interface QuizWithResource extends Quiz {
  resource_title?: string;
  resource_category?: string;
  resource_topic?: string;
}

// Active quiz session for taking a quiz
export interface QuizSession {
  sessionId: string;
  quizId: string;
  questions: Question[];
  startedAt: string;
  timeLimit: number;
}

// Submission payload when completing a quiz
export interface QuizSubmission {
  sessionId: string;
  answers: { questionId: number; selectedAnswer: number | null }[];
  timeTaken: number;
}

// Individual user answer record
export interface UserAnswer {
  question_id: number;
  selected_answer: number | null;
  is_correct: boolean;
  time_spent_seconds: number;
}

// Result after completing a quiz
export interface TestResult {
  id: string;
  user_id: string;
  test_id: string;
  score: number;
  correct_answers: number;
  total_questions: number;
  time_taken_seconds: number;
  answers: UserAnswer[];
  started_at: string;
  completed_at: string;
  status: 'completed';
}

// Input for generating a new quiz
export interface GenerateQuizInput {
  resourceId: string;
  title: string;
  questionCount: number;
  difficulty: QuizDifficulty;
}

// Generation progress tracking
export interface GenerationProgress {
  step: 'extracting' | 'analyzing' | 'generating' | 'complete';
  progress: number;
  message: string;
}
