import { useState } from "react";
import { User } from "@/types";

interface AuthScreenProps {
  onLogin: (user: User) => void;
  showToast: (msg: string, type?: "success" | "error" | "info") => void;
}

const demoUser: User = {
  name: "Demo User",
  email: "demo",
  password: "demo",
  xp: 45,
  quizzesDone: 3,
  streak: 2,
  badges: ["first_blood"],
};

export const AuthScreen = ({ onLogin, showToast }: AuthScreenProps) => {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [users, setUsers] = useState<Record<string, User>>({ demo: demoUser });
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [animKey, setAnimKey] = useState(0);

  const switchMode = (m: "login" | "register") => {
    setMode(m);
    setErrors({});
    setName(""); setEmail(""); setPassword("");
    setAnimKey((k) => k + 1);
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (mode === "register" && !name.trim()) e.name = "Full name is required";
    if (!email.trim()) e.email = "Email is required";
    if (!password.trim()) e.password = "Password is required";
    else if (password.length < 4 && !(email === "demo" && password === "demo"))
      e.password = "Password must be at least 4 characters";
    return e;
  };

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    if (mode === "register") {
      if (users[email]) {
        setErrors({ email: "An account with this email already exists" });
        showToast("Email already registered", "error");
        return;
      }
      const newUser: User = { name: name.trim(), email, password, xp: 0, quizzesDone: 0, streak: 0, badges: [] };
      setUsers((u) => ({ ...u, [email]: newUser }));
      showToast("Account created! Welcome 🎉", "success");
      onLogin(newUser);
    } else {
      const found = users[email];
      if (!found || found.password !== password) {
        setErrors({ password: "Incorrect email or password" });
        showToast("Login failed — check your credentials", "error");
        return;
      }
      showToast(`Welcome back, ${found.name.split(" ")[0]}! 👋`, "success");
      onLogin(found);
    }
  };

  return (
    <div className="bg-texture min-h-screen flex flex-col items-center justify-center px-5 py-10">
      {/* Hero */}
      <div className="text-center mb-8 animate-fade-in">
        <div
          style={{
            width: 80, height: 80,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #e8622a, #f0803d)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 38, margin: "0 auto 16px",
            boxShadow: "0 8px 28px rgba(232,98,42,0.32)",
          }}
        >
          🧠
        </div>
        <h1 className="font-display text-4xl font-black" style={{ color: "hsl(var(--foreground))", letterSpacing: "-0.5px" }}>
          QuizMaster
        </h1>
        <p className="font-body mt-2 text-sm font-medium" style={{ color: "hsl(var(--muted-foreground))" }}>
          Level up your knowledge — one quiz at a time
        </p>
      </div>

      {/* Toggle */}
      <div
        className="flex mb-6"
        style={{
          background: "rgba(180,130,90,0.1)",
          borderRadius: 12, padding: 4,
          width: "100%", maxWidth: 360,
        }}
      >
        {(["login", "register"] as const).map((m) => (
          <button
            key={m}
            onClick={() => switchMode(m)}
            className="flex-1 font-body text-sm font-semibold capitalize"
            style={{
              padding: "9px 0",
              borderRadius: 9,
              border: "none",
              cursor: "pointer",
              background: mode === m ? "hsl(var(--card))" : "transparent",
              color: mode === m ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))",
              boxShadow: mode === m ? "0 2px 8px rgba(120,80,40,0.10)" : "none",
              transition: "all 0.2s ease",
            }}
          >
            {m === "login" ? "Log In" : "Register"}
          </button>
        ))}
      </div>

      {/* Form card */}
      <div
        key={animKey}
        className="card-warm animate-fade-in w-full"
        style={{ maxWidth: 360, padding: "28px 24px" }}
      >
        <h2 className="font-display font-bold text-xl mb-5" style={{ color: "hsl(var(--foreground))" }}>
          {mode === "login" ? "Welcome back 👋" : "Create account ✨"}
        </h2>

        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
          {mode === "register" && (
            <Field
              label="Full Name"
              type="text"
              value={name}
              onChange={setName}
              placeholder="Jane Doe"
              error={errors.name}
            />
          )}
          <Field
            label="Email"
            type="email"
            value={email}
            onChange={setEmail}
            placeholder="you@example.com"
            error={errors.email}
          />
          <Field
            label="Password"
            type="password"
            value={password}
            onChange={setPassword}
            placeholder="••••••"
            error={errors.password}
          />

          {mode === "login" && (
            <p className="font-body text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>
              💡 Try demo: email <strong>demo</strong>, password <strong>demo</strong>
            </p>
          )}

          <button type="submit" className="btn-primary w-full mt-1" style={{ padding: "13px 0", fontSize: 15 }}>
            {mode === "login" ? "Log In" : "Create Account"}
          </button>
        </form>

        <p
          className="font-body text-xs text-center mt-4"
          style={{ color: "hsl(var(--muted-foreground))" }}
        >
          {mode === "login" ? "No account? " : "Already registered? "}
          <button
            onClick={() => switchMode(mode === "login" ? "register" : "login")}
            className="font-semibold"
            style={{ background: "none", border: "none", cursor: "pointer", color: "hsl(var(--primary))" }}
          >
            {mode === "login" ? "Register" : "Log In"}
          </button>
        </p>
      </div>
    </div>
  );
};

interface FieldProps {
  label: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  error?: string;
}

const Field = ({ label, type, value, onChange, placeholder, error }: FieldProps) => (
  <div className="flex flex-col gap-1">
    <label className="font-body text-xs font-semibold" style={{ color: "hsl(var(--foreground))", opacity: 0.75 }}>
      {label}
    </label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="font-body text-sm"
      style={{
        padding: "11px 14px",
        borderRadius: 10,
        border: `1.5px solid ${error ? "hsl(var(--destructive))" : "rgba(180,130,90,0.22)"}`,
        outline: "none",
        background: error ? "rgba(217,48,48,0.04)" : "rgba(180,130,90,0.04)",
        color: "hsl(var(--foreground))",
        width: "100%",
        transition: "border-color 0.15s ease",
      }}
      onFocus={(e) => {
        if (!error) e.currentTarget.style.borderColor = "rgba(232,98,42,0.55)";
      }}
      onBlur={(e) => {
        if (!error) e.currentTarget.style.borderColor = "rgba(180,130,90,0.22)";
      }}
    />
    {error && (
      <span className="font-body text-xs" style={{ color: "hsl(var(--destructive))" }}>
        {error}
      </span>
    )}
  </div>
);
