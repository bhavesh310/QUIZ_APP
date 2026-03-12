import { User } from "@/types";
import { leaderboardData } from "@/data/questions";

interface LeaderboardTabProps {
  user: User;
}

const rankColors = ["hsl(var(--gold))", "#9BA4B5", "#CD7F32"];
const rankLabels = ["🥇", "🥈", "🥉"];

export const LeaderboardTab = ({ user }: LeaderboardTabProps) => {
  const initials = user.name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
  const allPlayers = [...leaderboardData, { name: user.name, xp: user.xp, badge: "🎯" }]
    .sort((a, b) => b.xp - a.xp);
  const yourRank = allPlayers.findIndex((p) => p.name === user.name) + 1;

  return (
    <div className="animate-fade-in flex flex-col gap-4">
      <div>
        <h1 className="font-display font-bold text-3xl" style={{ color: "hsl(var(--foreground))" }}>
          Leaderboard 🏆
        </h1>
        <p className="font-body text-sm mt-1" style={{ color: "hsl(var(--muted-foreground))" }}>
          How do you rank against the best?
        </p>
      </div>

      {/* Your Position */}
      <div
        className="card-warm p-4 flex items-center gap-3"
        style={{ border: "1.5px solid rgba(232,98,42,0.35)", background: "rgba(232,98,42,0.04)" }}
      >
        <div
          style={{
            width: 44, height: 44, borderRadius: "50%",
            background: "linear-gradient(135deg, #e8622a, #f0803d)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 16,
            color: "white", flexShrink: 0,
          }}
        >
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-body font-semibold text-sm" style={{ color: "hsl(var(--foreground))" }}>
              {user.name}
            </span>
            <span
              className="font-body text-xs font-bold"
              style={{
                background: "rgba(232,98,42,0.12)",
                color: "hsl(var(--primary))",
                borderRadius: 20, padding: "1px 8px",
              }}
            >
              You
            </span>
          </div>
          <span className="font-body text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>
            Rank #{yourRank}
          </span>
        </div>
        <span className="font-display font-black text-lg" style={{ color: "hsl(var(--accent3))" }}>
          {user.xp} XP
        </span>
      </div>

      {/* Top players */}
      <div className="flex flex-col gap-2">
        <h2 className="font-display font-semibold text-base" style={{ color: "hsl(var(--foreground))" }}>
          Top Players
        </h2>
        {leaderboardData.map((player, i) => (
          <div key={player.name} className="card-warm p-4 flex items-center gap-3">
            {/* Rank badge */}
            <div
              style={{
                width: 32, height: 32, borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: i < 3 ? 20 : 13,
                fontFamily: "'Outfit', sans-serif", fontWeight: 700,
                color: i < 3 ? rankColors[i] : "hsl(var(--muted-foreground))",
                flexShrink: 0,
              }}
            >
              {i < 3 ? rankLabels[i] : `#${i + 1}`}
            </div>

            {/* Avatar */}
            <div
              style={{
                width: 40, height: 40, borderRadius: "50%",
                background: "linear-gradient(135deg, #e8622a, #f0803d)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 14,
                color: "white", flexShrink: 0,
              }}
            >
              {player.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}
            </div>

            {/* Name + badge */}
            <div className="flex-1 min-w-0">
              <div className="font-body font-semibold text-sm" style={{ color: "hsl(var(--foreground))" }}>
                {player.name} <span>{player.badge}</span>
              </div>
            </div>

            {/* XP */}
            <span className="font-display font-black text-base" style={{ color: "hsl(var(--accent3))" }}>
              {player.xp} XP
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
