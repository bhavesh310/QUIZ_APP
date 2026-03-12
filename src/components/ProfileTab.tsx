import { User } from "@/types";
import { badgeDefinitions } from "@/data/questions";

interface ProfileTabProps {
  user: User;
  onSignOut: () => void;
}

const XP_PER_LEVEL = 100;

export const ProfileTab = ({ user, onSignOut }: ProfileTabProps) => {
  const level = Math.floor(user.xp / XP_PER_LEVEL) + 1;
  const initials = user.name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
  const earnedBadges = badgeDefinitions.filter((b) => user.badges.includes(b.id));

  return (
    <div className="animate-fade-in flex flex-col items-center gap-5">
      {/* Avatar */}
      <div className="pt-2 flex flex-col items-center gap-3">
        <div
          style={{
            width: 80, height: 80, borderRadius: "50%",
            background: "linear-gradient(135deg, #e8622a, #f0803d)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 30,
            color: "white",
            boxShadow: "0 8px 28px rgba(232,98,42,0.28)",
          }}
        >
          {initials}
        </div>
        <div className="text-center">
          <h1 className="font-display font-bold text-2xl" style={{ color: "hsl(var(--foreground))" }}>
            {user.name}
          </h1>
          <p className="font-body text-sm mt-0.5" style={{ color: "hsl(var(--muted-foreground))" }}>
            Level {level} · {user.xp} XP
          </p>
        </div>
      </div>

      {/* 3 stat columns */}
      <div className="grid grid-cols-3 gap-3 w-full">
        <ProfileStat label="Quizzes" value={user.quizzesDone} color="hsl(var(--primary))" />
        <ProfileStat label="Badges" value={earnedBadges.length} color="hsl(var(--accent3))" />
        <ProfileStat label="Level" value={level} color="hsl(var(--accent2))" />
      </div>

      {/* Badges earned */}
      <div className="w-full">
        <h2 className="font-display font-semibold text-base mb-3" style={{ color: "hsl(var(--foreground))" }}>
          Your Badges
        </h2>
        {earnedBadges.length === 0 ? (
          <div className="card-warm p-5 text-center">
            <div style={{ fontSize: 30, marginBottom: 8 }}>🔒</div>
            <p className="font-body text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>
              Complete quizzes to earn badges!
            </p>
          </div>
        ) : (
          <div className="flex gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: "none" }}>
            {earnedBadges.map((badge) => (
              <div
                key={badge.id}
                className="card-warm flex-shrink-0 flex flex-col items-center"
                style={{ width: 90, padding: "14px 10px", border: "1.5px solid hsl(var(--gold))" }}
              >
                <div style={{ fontSize: 28, marginBottom: 6 }}>{badge.icon}</div>
                <div
                  className="font-body text-xs font-semibold text-center leading-tight"
                  style={{ color: "hsl(var(--gold))" }}
                >
                  {badge.name}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Sign out */}
      <button
        onClick={onSignOut}
        className="btn-ghost w-full mt-2"
        style={{ padding: "13px 0", fontSize: 15 }}
      >
        Sign Out
      </button>
    </div>
  );
};

const ProfileStat = ({ label, value, color }: { label: string; value: number; color: string }) => (
  <div className="card-warm flex flex-col items-center py-4 px-2">
    <span className="font-display font-black text-2xl" style={{ color }}>
      {value}
    </span>
    <span className="font-body text-xs mt-0.5" style={{ color: "hsl(var(--muted-foreground))" }}>
      {label}
    </span>
  </div>
);
