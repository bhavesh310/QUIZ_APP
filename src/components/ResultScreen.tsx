import { Result } from "@/types";

interface ResultScreenProps {
  result: Result;
  onRetry: () => void;
  onDashboard: () => void;
}

export const ResultScreen = ({ result, onRetry, onDashboard }: ResultScreenProps) => {
  const { accuracy, correct, wrong, xpEarned, category } = result;

  const emoji = accuracy === 100 ? "🏆" : accuracy >= 60 ? "⭐" : "💪";
  const title = accuracy === 100 ? "Perfect Score!" : accuracy >= 60 ? "Great Job!" : "Keep Going!";

  return (
    <div className="animate-fade-in flex flex-col items-center gap-5 pt-4">
      {/* Hero emoji */}
      <div
        style={{
          width: 88, height: 88, borderRadius: "50%",
          background: "linear-gradient(135deg, rgba(232,98,42,0.12), rgba(240,128,61,0.08))",
          border: "2px solid rgba(232,98,42,0.2)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 46,
        }}
      >
        {emoji}
      </div>

      <div className="text-center">
        <h1 className="font-display font-black text-3xl" style={{ color: "hsl(var(--foreground))" }}>
          {title}
        </h1>
        <p className="font-body text-sm mt-1" style={{ color: "hsl(var(--muted-foreground))" }}>
          {category} Quiz Complete
        </p>
      </div>

      {/* Big accuracy */}
      <div
        className="font-display font-black"
        style={{
          fontSize: 72,
          background: "linear-gradient(135deg, #e8622a, #f0803d)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          lineHeight: 1,
        }}
      >
        {accuracy}%
      </div>

      {/* 3 stats */}
      <div className="grid grid-cols-3 gap-3 w-full">
        <ResultStat label="Correct" value={correct} color="rgba(44,186,126,0.1)" textColor="hsl(var(--accent3))" icon="✅" />
        <ResultStat label="Wrong" value={wrong} color="rgba(217,48,48,0.08)" textColor="hsl(var(--destructive))" icon="❌" />
        <ResultStat label="XP Earned" value={`+${xpEarned}`} color="rgba(44,186,126,0.1)" textColor="hsl(var(--accent3))" icon="⚡" />
      </div>

      {/* Buttons */}
      <div className="flex flex-col gap-3 w-full mt-2">
        <button
          onClick={onRetry}
          className="btn-primary w-full"
          style={{ padding: "14px 0", fontSize: 15 }}
        >
          Retry Quiz 🔄
        </button>
        <button
          onClick={onDashboard}
          className="btn-ghost w-full"
          style={{ padding: "13px 0", fontSize: 15 }}
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

const ResultStat = ({
  label, value, color, textColor, icon,
}: {
  label: string; value: number | string; color: string; textColor: string; icon: string;
}) => (
  <div
    className="card-warm flex flex-col items-center py-4 px-2"
    style={{ background: color, border: "none", boxShadow: "none" }}
  >
    <span className="text-lg mb-1">{icon}</span>
    <span className="font-display font-black text-xl" style={{ color: textColor }}>
      {value}
    </span>
    <span className="font-body text-xs mt-0.5 text-center" style={{ color: "hsl(var(--muted-foreground))" }}>
      {label}
    </span>
  </div>
);
