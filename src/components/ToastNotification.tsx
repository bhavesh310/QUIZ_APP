import { useEffect } from "react";

interface ToastProps {
  message: string | null;
  type?: "success" | "error" | "info";
  onDismiss: () => void;
}

export const ToastNotification = ({ message, type = "info", onDismiss }: ToastProps) => {
  useEffect(() => {
    if (!message) return;
    const t = setTimeout(onDismiss, 2200);
    return () => clearTimeout(t);
  }, [message, onDismiss]);

  if (!message) return null;

  const icon = type === "success" ? "✅" : type === "error" ? "❌" : "ℹ️";
  const borderColor =
    type === "success"
      ? "rgba(31,158,104,0.35)"
      : type === "error"
      ? "rgba(217,48,48,0.35)"
      : "rgba(180,130,90,0.22)";

  return (
    <div
      className="animate-slide-down fixed top-4 left-1/2 -translate-x-1/2 z-50 max-w-xs w-[92vw]"
      style={{
        background: "hsl(var(--card))",
        border: `1.5px solid ${borderColor}`,
        borderRadius: 14,
        boxShadow: "0 8px 32px rgba(120,80,40,0.13)",
        padding: "14px 18px",
        display: "flex",
        alignItems: "center",
        gap: 10,
      }}
    >
      <span style={{ fontSize: 18 }}>{icon}</span>
      <span
        className="font-body text-sm font-medium"
        style={{ color: "hsl(var(--foreground))" }}
      >
        {message}
      </span>
      <button
        onClick={onDismiss}
        style={{
          marginLeft: "auto",
          background: "none",
          border: "none",
          cursor: "pointer",
          color: "hsl(var(--muted-foreground))",
          fontSize: 16,
          lineHeight: 1,
        }}
      >
        ×
      </button>
    </div>
  );
};
