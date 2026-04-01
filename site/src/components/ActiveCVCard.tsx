export function ActiveCVCard() {
  return (
    <div
      className="p-8 rounded-3xl border group hover:border-primary/30 transition-all duration-300"
      style={{
        background: 'linear-gradient(135deg, rgb(17,15,14), rgb(12,10,9))',
        borderColor: 'rgba(255,255,255,0.06)',
      }}
    >
      <div className="flex justify-between items-center mb-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#d4a574"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
          <line x1="16" y1="13" x2="8" y2="13"/>
          <line x1="16" y1="17" x2="8" y2="17"/>
          <polyline points="10 9 9 9 8 9"/>
        </svg>
        <span className="font-manrope text-[10px] font-bold text-stone-500 uppercase tracking-widest">
          Active CV
        </span>
      </div>

      <h4 className="font-manrope text-white font-bold mb-1 text-sm">
        David_Robertson_AI_CV.pdf
      </h4>
      <p className="font-manrope text-stone-500 text-xs mb-2">
        AI Engineer · AI Systems Architect · Contract Specialist
      </p>
      <p className="font-manrope text-stone-600 text-xs mb-6">
        Edinburgh, UK
      </p>

      <div className="grid grid-cols-2 gap-3">
        <button
          className="flex items-center justify-center gap-2 py-2.5 rounded-xl font-manrope text-stone-300 text-xs font-bold uppercase tracking-wider transition-colors duration-200 hover:text-white"
          style={{ background: 'rgba(255,255,255,0.06)' }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.10)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.06)';
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
            <circle cx="12" cy="12" r="3"/>
          </svg>
          View CV
        </button>
        <button
          className="flex items-center justify-center gap-2 py-2.5 rounded-xl font-manrope text-stone-300 text-xs font-bold uppercase tracking-wider transition-colors duration-200 hover:text-white"
          style={{ background: 'rgba(255,255,255,0.06)' }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.10)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.06)';
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="23 4 23 10 17 10"/>
            <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
          </svg>
          Refresh Match
        </button>
      </div>
    </div>
  );
}
