export function PassportCard({ floating = false }: { floating?: boolean }) {
  return (
    <div
      className={`relative w-full max-w-md mx-auto ${floating ? "float-anim" : ""}`}
      style={{
        background: "linear-gradient(180deg, #0E7C6B 0%, #0a5e51 100%)",
        borderRadius: "16px",
        padding: "28px",
        color: "white",
        boxShadow: "0 1px 0 rgba(255,255,255,0.08) inset",
      }}
    >
      <div className="flex items-start justify-between">
        <div>
          <div className="font-mono-accent text-[10px] uppercase tracking-widest text-white/60">
            Stamped · Travel Passport
          </div>
          <div className="mt-1 font-mono-accent text-xs text-white/70">No. 002412</div>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] font-mono-accent uppercase bg-white/10 px-2 py-1 rounded-full">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <path d="M20 6L9 17l-5-5" />
          </svg>
          Verified
        </div>
      </div>

      <div className="mt-7 flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-white/15 border border-white/20 flex items-center justify-center font-display text-xl">
          AS
        </div>
        <div>
          <div className="font-display text-xl leading-tight">Ananya Sharma</div>
          <div className="text-xs text-white/60 font-mono-accent mt-0.5">Mumbai · Explorer L4</div>
        </div>
      </div>

      <div className="mt-7 grid grid-cols-3 gap-3">
        <Stat n="47" l="trips" />
        <Stat n="18" l="states" />
        <Stat n="6" l="countries" />
      </div>

      <div className="mt-6 pt-5 border-t border-white/10">
        <div className="text-[10px] font-mono-accent uppercase tracking-widest text-white/50 mb-3">
          Recent stamps
        </div>
        <div className="flex flex-wrap gap-2">
          {["DEL", "BOM", "GOA", "JKT", "DXB", "LEH"].map((s) => (
            <span
              key={s}
              className="font-mono-accent text-[11px] px-2.5 py-1 rounded-md bg-white/10 border border-white/15"
            >
              {s}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function Stat({ n, l }: { n: string; l: string }) {
  return (
    <div className="rounded-lg bg-white/5 border border-white/10 px-3 py-2">
      <div className="font-display text-2xl leading-none">{n}</div>
      <div className="text-[10px] font-mono-accent uppercase tracking-widest text-white/55 mt-1">
        {l}
      </div>
    </div>
  );
}
