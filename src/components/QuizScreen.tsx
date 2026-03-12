import { useEffect, useRef } from "react";
import { QuizState } from "@/types";
import { questionBank } from "@/data/questions";

interface QuizScreenProps {
  quizState: QuizState;
  setQuizState: (s: QuizState | ((prev: QuizState) => QuizState)) => void;
  onFinish: (state: QuizState) => void;
}

const LETTERS = ["A", "B", "C", "D"];

export const QuizScreen = ({ quizState, setQuizState, onFinish }: QuizScreenProps) => {
  const qs = quizState;
  const q = qs.questions[qs.current];
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Countdown timer
  useEffect(() => {
    if (qs.answered) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }
    timerRef.current = setInterval(() => {
      setQuizState((prev) => {
        if (prev.answered) { clearInterval(timerRef.current!); return prev; }
        if (prev.timeLeft <= 1) {
          clearInterval(timerRef.current!);
          // Time's up — auto-submit as wrong
          return { ...prev, answered: true, selected: -1, timeLeft: 0 };
        }
        return { ...prev, timeLeft: prev.timeLeft - 1 };
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [qs.current, qs.answered, setQuizState]);

  const handleSelect = (idx: number) => {
    if (qs.answered) return;
    const correct = idx === q.correct;
    const newStreak = correct ? qs.streak + 1 : 0;
    const streakBonus = correct && newStreak > 0 && newStreak % 2 === 0 ? 5 : 0;
    const xpGain = correct ? q.xp + streakBonus : 0;

    setQuizState((prev) => ({
      ...prev,
      selected: idx,
      answered: true,
      score: prev.score + (correct ? 1 : 0),
      xpEarned: prev.xpEarned + xpGain,
      streak: newStreak,
      xpPopup: xpGain > 0 ? xpGain : null,
    }));
  };

  const handleNext = () => {
    const next = qs.current + 1;
    if (next >= qs.questions.length) {
      onFinish(qs);
    } else {
      setQuizState((prev) => ({
        ...prev,
        current: next,
        selected: null,
        answered: false,
        timeLeft: 20,
        xpPopup: null,
      }));
    }
  };

  const progress = ((qs.current) / qs.questions.length) * 100;
  const isUrgent = qs.timeLeft <= 5 && !qs.answered;
  const catEmoji = questionBank[qs.category] ? (qs.category === "Science" ? "🔬" : qs.category === "History" ? "🏛️" : "💻") : "📚";

  return (
    <div className="animate-fade-in flex flex-col gap-4">
      {/* Top bar */}
      <div className="flex items-center gap-3">
        <span className="font-body text-sm font-semibold" style={{ color: "hsl(var(--muted-foreground))" }}>
          Q{qs.current + 1}/{qs.questions.length}
        </span>
        <div className="flex-1" style={{ height: 6, background: "rgba(180,130,90,0.15)", borderRadius: 6, overflow: "hidden" }}>
          <div
            className="xp-bar-fill"
            style={{ width: `${progress + (1 / qs.questions.length) * 100}%`, height: "100%", transition: "width 0.4s ease" }}
          />
        </div>
        {/* Timer */}
        <div
          className={`font-display font-bold text-base ${isUrgent ? "animate-timer-urgent" : ""}`}
          style={{
            minWidth: 36, textAlign: "center",
            color: isUrgent ? "hsl(var(--destructive))" : qs.answered ? "hsl(var(--muted-foreground))" : "hsl(var(--primary))",
            background: isUrgent ? "rgba(217,48,48,0.08)" : "rgba(232,98,42,0.08)",
            borderRadius: 8, padding: "3px 8px",
            fontSize: 15,
            transition: "color 0.3s",
          }}
        >
          {qs.answered ? "✓" : `${qs.timeLeft}s`}
        </div>
      </div>

      {/* Pills row */}
      <div className="flex items-center gap-2 flex-wrap">
        <span
          className="font-body text-xs font-semibold"
          style={{
            background: "rgba(232,98,42,0.12)",
            color: "hsl(var(--primary))",
            borderRadius: 20, padding: "4px 12px",
          }}
        >
          {catEmoji} {qs.category}
        </span>
        {qs.streak >= 2 && (
          <span
            className="font-body text-xs font-semibold"
            style={{
              background: "rgba(91,141,238,0.12)",
              color: "hsl(var(--accent2))",
              borderRadius: 20, padding: "4px 12px",
            }}
          >
            🔥 {qs.streak}x streak!
          </span>
        )}
      </div>

      {/* Question card */}
      <div className="card-warm p-5">
        <p className="font-display font-semibold text-lg leading-snug" style={{ color: "hsl(var(--foreground))" }}>
          {q.text}
        </p>
        {qs.answered && qs.selected === -1 && (
          <p className="font-body text-sm mt-3" style={{ color: "hsl(var(--destructive))" }}>
            ⏱ Time's up!
          </p>
        )}
      </div>

      {/* Answer options */}
      <div className="flex flex-col gap-3">
        {q.options.map((opt, idx) => {
          let borderColor = "rgba(180,130,90,0.18)";
          let bg = "hsl(var(--card))";
          let textColor = "hsl(var(--foreground))";

          if (qs.answered) {
            if (idx === q.correct) {
              borderColor = "hsl(var(--accent3))";
              bg = "rgba(44,186,126,0.08)";
              textColor = "hsl(var(--accent3))";
            } else if (idx === qs.selected && idx !== q.correct) {
              borderColor = "hsl(var(--destructive))";
              bg = "rgba(217,48,48,0.07)";
              textColor = "hsl(var(--destructive))";
            }
          }

          return (
            <button
              key={idx}
              onClick={() => handleSelect(idx)}
              className={`answer-option card-warm text-left w-full flex items-center gap-3 ${qs.answered ? "answered" : ""}`}
              style={{
                padding: "14px 16px",
                border: `1.5px solid ${borderColor}`,
                background: bg,
                cursor: qs.answered ? "default" : "pointer",
                transition: "all 0.15s ease",
              }}
            >
              <div
                style={{
                  width: 32, height: 32, flexShrink: 0,
                  borderRadius: 8,
                  background: qs.answered && idx === q.correct
                    ? "rgba(44,186,126,0.15)"
                    : qs.answered && idx === qs.selected
                    ? "rgba(217,48,48,0.12)"
                    : "rgba(180,130,90,0.1)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontWeight: 700, fontSize: 13,
                  color: textColor,
                  fontFamily: "'Outfit', sans-serif",
                }}
              >
                {LETTERS[idx]}
              </div>
              <span className="font-body text-sm font-medium" style={{ color: textColor }}>
                {opt}
              </span>
              {qs.answered && idx === q.correct && (
                <span className="ml-auto text-lg">✅</span>
              )}
              {qs.answered && idx === qs.selected && idx !== q.correct && (
                <span className="ml-auto text-lg">❌</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Next button */}
      {qs.answered && (
        <button
          onClick={handleNext}
          className="btn-primary animate-fade-in w-full"
          style={{ padding: "14px 0", fontSize: 15, marginTop: 4 }}
        >
          {qs.current + 1 >= qs.questions.length ? "See Results 🏆" : "Next Question →"}
        </button>
      )}

      {/* XP Popup */}
      {qs.xpPopup !== null && (
        <div
          className="animate-xp-popup fixed bottom-24 right-6 pointer-events-none"
          style={{
            fontFamily: "'Fraunces', serif",
            fontWeight: 900,
            fontSize: 22,
            color: "hsl(var(--accent3))",
            textShadow: "0 2px 8px rgba(44,186,126,0.35)",
            zIndex: 50,
          }}
        >
          +{qs.xpPopup} XP
        </div>
      )}
    </div>
  );
};
