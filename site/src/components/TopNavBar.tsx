interface TopNavBarProps {
  onRefresh?: () => void;
  isLoading?: boolean;
}

export function TopNavBar({ onRefresh, isLoading = false }: TopNavBarProps) {
  return (
    <header className="bg-stone-950/90 backdrop-blur-xl border-b border-stone-800/20 sticky top-0 z-50"
      style={{ boxShadow: '0px 24px 48px -12px rgba(0,0,0,0.4)' }}>
      <div className="flex justify-between items-center px-8 py-4 w-full max-w-[1440px] mx-auto">
        {/* Left: Brand + Nav */}
        <div className="flex items-center gap-8">
          <span className="font-newsreader font-bold text-primary text-2xl tracking-tight italic">
            AI Jobs
          </span>
          <nav className="hidden md:flex items-center gap-6">
            <a
              href="#"
              className="text-stone-400 font-manrope font-medium text-sm hover:text-primary transition-all duration-300"
            >
              Feed
            </a>
            <a
              href="#"
              className="text-stone-400 font-manrope font-medium text-sm hover:text-primary transition-all duration-300"
            >
              Matches
            </a>
            <a
              href="#"
              className="text-stone-400 font-manrope font-medium text-sm hover:text-primary transition-all duration-300"
            >
              Pipeline
            </a>
            <a
              href="#"
              className="text-primary border-b-2 pb-1 font-manrope font-semibold text-sm"
              style={{ borderColor: '#c8863a' }}
            >
              Intelligence
            </a>
          </nav>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          <button
            aria-label="Notifications"
            className="text-stone-400 p-2 hover:bg-stone-800/50 rounded-full transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
          </button>
          <button
            aria-label="Settings"
            className="text-stone-400 p-2 hover:bg-stone-800/50 rounded-full transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3"/>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
            </svg>
          </button>

          {/* Avatar / identity indicator */}
          <div className="h-9 w-9 rounded-full border border-stone-700 bg-stone-800 flex items-center justify-center overflow-hidden">
            <span className="text-xs font-manrope font-bold text-primary">DR</span>
          </div>

          {/* CTA */}
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="hidden lg:flex items-center gap-2 text-white px-5 py-2.5 rounded-xl font-manrope font-semibold text-sm hover:scale-[0.98] active:scale-95 transition-transform disabled:opacity-50"
            style={{
              background: 'linear-gradient(135deg, #d4a574, #b8935f)',
              boxShadow: '0 4px 16px rgba(212,165,116,0.2)',
            }}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                </svg>
                Scanning…
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="23 4 23 10 17 10"/>
                  <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
                </svg>
                Refresh Scan
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
