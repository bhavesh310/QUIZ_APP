interface BottomNavProps {
  tab: "home" | "leaderboard" | "profile";
  onTabChange: (tab: "home" | "leaderboard" | "profile") => void;
}

const tabs = [
  { id: "home" as const, label: "Home", icon: "🏠" },
  { id: "leaderboard" as const, label: "Ranks", icon: "🏆" },
  { id: "profile" as const, label: "Profile", icon: "👤" },
];

export const BottomNav = ({ tab, onTabChange }: BottomNavProps) => {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40"
      style={{
        background: "hsl(var(--card))",
        borderTop: "1.5px solid rgba(180,130,90,0.18)",
        boxShadow: "0 -4px 20px rgba(120,80,40,0.08)",
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
      }}
    >
      <div className="flex items-center justify-around max-w-md mx-auto">
        {tabs.map((t) => {
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => onTabChange(t.id)}
              className="flex flex-col items-center gap-0.5 flex-1 font-body"
              style={{
                padding: "10px 0 12px",
                background: active ? "rgba(232,98,42,0.07)" : "transparent",
                border: "none",
                cursor: "pointer",
                color: active ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))",
                fontWeight: active ? 600 : 400,
                fontSize: 11,
                transition: "all 0.18s ease",
                borderRadius: 0,
              }}
            >
              <span style={{ fontSize: 22, lineHeight: 1.1 }}>{t.icon}</span>
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
