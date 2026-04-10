import { Link } from 'react-router-dom';

interface TopNavBarProps {
  onRefresh?: () => void;
  isLoading?: boolean;
}

export function TopNavBar({ isLoading = false }: TopNavBarProps) {
  return (
    <header
      className="sticky top-0 z-50 border-b"
      style={{
        background: 'rgba(12,10,9,0.95)',
        backdropFilter: 'blur(12px)',
        borderColor: 'rgba(255,255,255,0.05)',
      }}
    >
      <div className="flex justify-between items-center px-8 py-3.5 w-full max-w-[1440px] mx-auto">
        <div className="flex items-center gap-10">
          <Link to="/" className="font-newsreader italic text-lg tracking-tight" style={{ color: '#d4a574' }}>
            AI Jobs
          </Link>
          <nav className="hidden md:flex items-center gap-7">
            <Link
              to="/"
              className="font-manrope text-xs font-semibold uppercase tracking-[0.12em] transition-colors duration-200"
              style={{ color: '#d4a574' }}
            >
              Intelligence
            </Link>
            <a
              href="https://github.com/mccaigs/jobs"
              target="_blank"
              rel="noopener noreferrer"
              className="font-manrope text-xs font-medium uppercase tracking-[0.12em] text-stone-600 hover:text-stone-400 transition-colors duration-200"
            >
              Source
            </a>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {isLoading && (
            <span className="font-manrope text-[10px] uppercase tracking-widest text-stone-600 animate-pulse">
              Loading…
            </span>
          )}
          <span className="font-manrope text-xs text-stone-600">
            David Robertson
          </span>
        </div>
      </div>
    </header>
  );
}
