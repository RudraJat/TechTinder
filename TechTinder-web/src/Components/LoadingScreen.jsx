import { Code2 } from "lucide-react";

function LoadingScreen() {
  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center gap-5">
      <div className="w-20 h-20 rounded-2xl bg-purple-600 flex items-center justify-center shadow-xl shadow-purple-500/40 animate-pulse">
        <Code2 className="w-10 h-10 text-white" />
      </div>
      <p className="text-slate-400 font-bold uppercase text-xs">
        Loading…
      </p>
      <div className="w-56 flex flex-col gap-3 mt-2">
        {[75, 55, 85, 45].map((w, i) => (
          <div
            key={i}
            className="h-2.5 bg-slate-700 rounded-full animate-pulse"
            style={{ width: `${w}%` }}
          />
        ))}
      </div>
    </div>
  );
}

export default LoadingScreen;
