export interface User {
  name: string;
  email: string;
  password: string;
  xp: number;
  quizzesDone: number;
  streak: number;
  badges: string[];
}

export interface Question {
  id: number;
  text: string;
  options: string[];
  correct: number; // index
  xp: number;
}

export interface QuizState {
  category: string;
  questions: Question[];
  current: number;
  selected: number | null;
  answered: boolean;
  score: number;
  xpEarned: number;
  streak: number;
  timeLeft: number;
  xpPopup: number | null;
}

export interface Result {
  category: string;
  correct: number;
  wrong: number;
  xpEarned: number;
  accuracy: number;
}

export type Screen = "auth" | "dashboard" | "quiz" | "result";
export type Tab = "home" | "leaderboard" | "profile";
export type AuthMode = "login" | "register";
