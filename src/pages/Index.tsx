import { useState, useCallback } from "react";
import { User, QuizState, Result, Screen, Tab } from "@/types";
import { questionBank, badgeDefinitions } from "@/data/questions";
import { AuthScreen } from "@/components/AuthScreen";
import { Dashboard } from "@/components/Dashboard";
import { QuizScreen } from "@/components/QuizScreen";
import { ResultScreen } from "@/components/ResultScreen";
import { LeaderboardTab } from "@/components/LeaderboardTab";
import { ProfileTab } from "@/components/ProfileTab";
import { BottomNav } from "@/components/BottomNav";
import { ToastNotification } from "@/components/ToastNotification";

const XP_PER_LEVEL = 100;

const demoUser: User = {
  name: "Demo User",
  email: "demo",
  password: "demo",
  xp: 45,
  quizzesDone: 3,
  streak: 2,
  badges: ["first_blood"],
};

const defaultQuizState = (category: string): QuizState => ({
  category,
  questions: questionBank[category],
  current: 0,
  selected: null,
  answered: false,
  score: 0,
  xpEarned: 0,
  streak: 0,
  timeLeft: 20,
  xpPopup: null,
});

const Index = () => {
  const [screen, setScreen] = useState<Screen>("auth");
  const [tab, setTab] = useState<Tab>("home");
  const [user, setUser] = useState<User | null>(null);
  const [quizState, setQuizState] = useState<QuizState | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" | "info" } | null>(null);

  const showToast = useCallback(
    (msg: string, type: "success" | "error" | "info" = "info") => {
      setToast({ msg, type });
    },
    []
  );

  const dismissToast = useCallback(() => setToast(null), []);

  // Compute badges for a user state
  const computeBadges = (u: User, perfectScore?: boolean): string[] => {
    const earned = new Set(u.badges);
    badgeDefinitions.forEach((b) => {
      if (b.condition(u)) earned.add(b.id);
    });
    if (perfectScore) earned.add("scholar");
    return Array.from(earned);
  };

  const handleLogin = (loggedIn: User) => {
    setUser(loggedIn);
    setScreen("dashboard");
    setTab("home");
  };

  const handleStartQuiz = (category: string) => {
    setQuizState(defaultQuizState(category));
    setScreen("quiz");
  };

  const handleFinishQuiz = (finalState: QuizState) => {
    if (!user) return;
    const total = finalState.questions.length;
    const correct = finalState.score;
    const wrong = total - correct;
    const accuracy = Math.round((correct / total) * 100);
    const perfectScore = accuracy === 100;

    const updatedUser: User = {
      ...user,
      xp: user.xp + finalState.xpEarned,
      quizzesDone: user.quizzesDone + 1,
      streak: finalState.streak,
    };
    updatedUser.badges = computeBadges(updatedUser, perfectScore);

    setUser(updatedUser);

    const res: Result = {
      category: finalState.category,
      correct,
      wrong,
      xpEarned: finalState.xpEarned,
      accuracy,
    };
    setResult(res);
    setScreen("result");

    // Badge notifications
    const newBadges = updatedUser.badges.filter((b) => !user.badges.includes(b));
    if (newBadges.length > 0) {
      const badgeDef = badgeDefinitions.find((b) => b.id === newBadges[0]);
      if (badgeDef) showToast(`🏅 New badge: ${badgeDef.name}!`, "success");
    }

    // Level up notification
    const oldLevel = Math.floor(user.xp / XP_PER_LEVEL) + 1;
    const newLevel = Math.floor(updatedUser.xp / XP_PER_LEVEL) + 1;
    if (newLevel > oldLevel) {
      setTimeout(() => showToast(`🎉 Level Up! You're now Level ${newLevel}!`, "success"), 800);
    }
  };

  const handleRetry = () => {
    if (result) handleStartQuiz(result.category);
  };

  const handleDashboard = () => {
    setScreen("dashboard");
    setTab("home");
  };

  const handleSignOut = () => {
    setUser(null);
    setScreen("auth");
    setTab("home");
    showToast("Signed out successfully", "info");
  };

  return (
    <>
      <ToastNotification
        message={toast?.msg ?? null}
        type={toast?.type}
        onDismiss={dismissToast}
      />

      {screen === "auth" && (
        <AuthScreen onLogin={handleLogin} showToast={showToast} />
      )}

      {screen === "dashboard" && user && (
        <div className="bg-texture min-h-screen">
          <div
            className="max-w-md mx-auto px-4 pt-6 pb-safe"
            style={{ paddingBottom: "calc(88px + env(safe-area-inset-bottom, 0px))" }}
          >
            {tab === "home" && (
              <Dashboard user={user} onStartQuiz={handleStartQuiz} />
            )}
            {tab === "leaderboard" && (
              <LeaderboardTab user={user} />
            )}
            {tab === "profile" && (
              <ProfileTab user={user} onSignOut={handleSignOut} />
            )}
          </div>
          <BottomNav tab={tab} onTabChange={setTab} />
        </div>
      )}

      {screen === "quiz" && quizState && (
        <div className="bg-texture min-h-screen">
          <div className="max-w-md mx-auto px-4 pt-6 pb-10">
            <button
              onClick={handleDashboard}
              className="btn-ghost mb-4 flex items-center gap-2"
              style={{ padding: "8px 14px", fontSize: 13 }}
            >
              ← Back
            </button>
            <QuizScreen
              quizState={quizState}
              setQuizState={setQuizState as (s: QuizState | ((prev: QuizState) => QuizState)) => void}
              onFinish={handleFinishQuiz}
            />
          </div>
        </div>
      )}

      {screen === "result" && result && (
        <div className="bg-texture min-h-screen">
          <div className="max-w-md mx-auto px-4 pt-6 pb-10">
            <ResultScreen
              result={result}
              onRetry={handleRetry}
              onDashboard={handleDashboard}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default Index;
