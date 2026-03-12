import { Question } from "@/types";

export const questionBank: Record<string, Question[]> = {
  Science: [
    {
      id: 1,
      text: "What is the powerhouse of the cell?",
      options: ["Nucleus", "Mitochondria", "Ribosome", "Golgi Apparatus"],
      correct: 1,
      xp: 10,
    },
    {
      id: 2,
      text: "What is the chemical symbol for gold?",
      options: ["Go", "Gd", "Au", "Ag"],
      correct: 2,
      xp: 10,
    },
    {
      id: 3,
      text: "How many bones are in the adult human body?",
      options: ["196", "206", "216", "226"],
      correct: 1,
      xp: 15,
    },
    {
      id: 4,
      text: "What planet is known as the Red Planet?",
      options: ["Venus", "Jupiter", "Mars", "Saturn"],
      correct: 2,
      xp: 10,
    },
    {
      id: 5,
      text: "At what temperature does water boil at sea level (°C)?",
      options: ["90", "95", "100", "105"],
      correct: 2,
      xp: 10,
    },
  ],
  History: [
    {
      id: 6,
      text: "In what year did World War II end?",
      options: ["1943", "1944", "1945", "1946"],
      correct: 2,
      xp: 10,
    },
    {
      id: 7,
      text: "Who was the first President of the United States?",
      options: ["John Adams", "Thomas Jefferson", "Benjamin Franklin", "George Washington"],
      correct: 3,
      xp: 10,
    },
    {
      id: 8,
      text: "The Great Wall of China was primarily built during which dynasty?",
      options: ["Han Dynasty", "Ming Dynasty", "Qin Dynasty", "Tang Dynasty"],
      correct: 1,
      xp: 15,
    },
    {
      id: 9,
      text: "Which ancient wonder was located in Alexandria, Egypt?",
      options: ["Colossus of Rhodes", "Lighthouse of Alexandria", "Temple of Artemis", "Hanging Gardens"],
      correct: 1,
      xp: 15,
    },
    {
      id: 10,
      text: "The Renaissance period began in which country?",
      options: ["France", "Germany", "Italy", "Spain"],
      correct: 2,
      xp: 10,
    },
  ],
  Technology: [
    {
      id: 11,
      text: "What does 'CPU' stand for?",
      options: ["Central Processing Unit", "Computer Power Unit", "Core Processing Utility", "Central Program Unit"],
      correct: 0,
      xp: 10,
    },
    {
      id: 12,
      text: "Which company created the Python programming language?",
      options: ["Google", "Microsoft", "None — it's open source", "Guido van Rossum created it"],
      correct: 3,
      xp: 15,
    },
    {
      id: 13,
      text: "What does 'HTTP' stand for?",
      options: [
        "HyperText Transfer Protocol",
        "High Transfer Text Protocol",
        "HyperText Transmission Process",
        "Hyper Transfer Technology Protocol",
      ],
      correct: 0,
      xp: 10,
    },
    {
      id: 14,
      text: "Which programming language is primarily used for web styling?",
      options: ["HTML", "JavaScript", "CSS", "Python"],
      correct: 2,
      xp: 10,
    },
    {
      id: 15,
      text: "What year was the first iPhone released?",
      options: ["2005", "2006", "2007", "2008"],
      correct: 2,
      xp: 15,
    },
  ],
};

export const categories = [
  { key: "Science", emoji: "🔬", color: "coral" },
  { key: "History", emoji: "🏛️", color: "blue" },
  { key: "Technology", emoji: "💻", color: "green" },
];

export const leaderboardData = [
  { name: "Aria Storm", xp: 1240, badge: "👑" },
  { name: "Neo Rynx", xp: 980, badge: "🔥" },
  { name: "Zara Voss", xp: 870, badge: "🎓" },
  { name: "Kai Nexus", xp: 760, badge: "⚡" },
  { name: "Luna Drift", xp: 640, badge: "⚡" },
];

export const badgeDefinitions = [
  { id: "first_blood", icon: "⚡", name: "First Blood", desc: "Complete 1 quiz", condition: (u: { quizzesDone: number; xp: number }) => u.quizzesDone >= 1 },
  { id: "scholar", icon: "🎓", name: "Scholar", desc: "Score 100% on any quiz", condition: (_u: { quizzesDone: number; xp: number }) => false }, // handled manually
  { id: "grinder", icon: "🔥", name: "Grinder", desc: "Earn 100 XP total", condition: (u: { quizzesDone: number; xp: number }) => u.xp >= 100 },
  { id: "legend", icon: "👑", name: "Legend", desc: "Earn 250 XP total", condition: (u: { quizzesDone: number; xp: number }) => u.xp >= 250 },
];
