import { User } from "@/types";
import { categories, badgeDefinitions } from "@/data/questions";

interface DashboardProps {
  user: User;
  onStartQuiz: (category: string) => void;
}

const XP_PER_LEVEL = 100;

export const Dashboard = ({ user, onStartQuiz }: DashboardProps) => {
  const level = Math.floor(user.xp / XP_PER_LEVEL) + 1;
  const xpInLevel = user.xp % XP_PER_LEVEL;
  const firstName = user.name.split(" ")[0];

  return (
    <div className="animate-fade-in flex flex-col gap-5 pb-6">
      {/* Greeting */}
      <div className="pt-2">
        <h1 className="font-display font-bold text-3xl" style={{ color: "hsl(var(--foreground))" }}>
          Hey, {firstName} 👋
        </h1>
        <p className="font-body text-sm mt-1" style={{ color: "hsl(var(--muted-foreground))" }}>
          Ready for today's challenge?
        </p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-3">
        <StatCard label="Total XP" value={user.xp} color="rgba(232,98,42,0.1)" textColor="hsl(var(--primary))" icon="⚡" />
        <StatCard label="Quizzes" value={user.quizzesDone} color="rgba(91,141,238,0.1)" textColor="hsl(var(--accent2))" icon="📝" />
        <StatCard label="Streak 🔥" value={user.streak} color="rgba(44,186,126,0.1)" textColor="hsl(var(--accent3))" icon="" />
      </div>

      {/* Level Progress */}
      <div className="card-warm p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="font-display font-semibold text-base" style={{ color: "hsl(var(--foreground))" }}>
            Level {level}
          </span>
          <span className="font-body text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>
            {xpInLevel}/100 XP to next level
          </span>
        </div>
        <div
          style={{
            height: 7,
            background: "rgba(180,130,90,0.15)",
            borderRadius: 8,
            overflow: "hidden",
          }}
        >
          <div
            className="xp-bar-fill"
            style={{ height: "100%", width: `${Math.min(xpInLevel, 100)}%` }}
          />
        </div>
      </div>

      {/* Category Selection */}
      <div>
        <h2 className="font-display font-semibold text-lg mb-3" style={{ color: "hsl(var(--foreground))" }}>
          Pick a Category
        </h2>
        <div className="flex flex-col gap-3">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => onStartQuiz(cat.key)}
              className="card-warm category-card text-left w-full"
              style={{ padding: "16px 18px", background: "hsl(var(--card))" }}
            >
              <div className="flex items-center gap-4">
                <div
                  style={{
                    width: 52, height: 52,
                    borderRadius: 14,
                    background: "rgba(180,130,90,0.08)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 26, flexShrink: 0,
                  }}
                >
                  {cat.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-display font-bold text-base" style={{ color: "hsl(var(--foreground))" }}>
                    {cat.key}
                  </div>
                  <div className="font-body text-xs mt-0.5" style={{ color: "hsl(var(--muted-foreground))" }}>
                    5 questions · 20s each
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span
                    className="font-body text-xs font-semibold"
                    style={{
                      background: "rgba(44,186,126,0.12)",
                      color: "hsl(var(--accent3))",
                      borderRadius: 20,
                      padding: "3px 10px",
                    }}
                  >
                    Up to 90 XP
                  </span>
                  <span style={{ fontSize: 18, color: "hsl(var(--muted-foreground))" }}>›</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Badges */}
      <div>
        <h2 className="font-display font-semibold text-lg mb-3" style={{ color: "hsl(var(--foreground))" }}>
          Badges
        </h2>
        <div className="flex gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: "none" }}>
          {badgeDefinitions.map((badge) => {
            const earned = user.badges.includes(badge.id);
            return (
              <div
                key={badge.id}
                className="card-warm flex-shrink-0 flex flex-col items-center"
                style={{
                  width: 90, padding: "14px 10px",
                  border: earned ? "1.5px solid hsl(var(--gold))" : "1.5px solid rgba(180,130,90,0.15)",
                  opacity: earned ? 1 : 0.45,
                  filter: earned ? "none" : "grayscale(1)",
                  transition: "all 0.2s ease",
                }}
              >
                <div style={{ fontSize: 28, marginBottom: 6 }}>{badge.icon}</div>
                <div
                  className="font-body text-xs font-semibold text-center leading-tight"
                  style={{ color: earned ? "hsl(var(--gold))" : "hsl(var(--muted-foreground))" }}
                >
                  {badge.name}
                </div>
                <div
                  className="font-body text-xs text-center leading-tight mt-1"
                  style={{ color: "hsl(var(--muted-foreground))", fontSize: 10 }}
                >
                  {badge.desc}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const StatCard = ({
  label, value, color, textColor, icon,
}: {
  label: string; value: number; color: string; textColor: string; icon: string;
}) => (
  <div
    className="card-warm flex flex-col items-center py-4 px-2"
    style={{ background: color, border: "none", boxShadow: "none" }}
  >
    <span className="font-display font-black text-2xl" style={{ color: textColor }}>
      {value}
    </span>
    <span className="font-body text-xs mt-0.5 text-center leading-tight" style={{ color: "hsl(var(--muted-foreground))" }}>
      {icon} {label}
    </span>
  </div>
);
