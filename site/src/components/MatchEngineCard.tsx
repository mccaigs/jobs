export function MatchEngineCard() {
  const coreStrengths = [
    'LLM Integration',
    'Workflow Automation',
    'Retrieval Pipelines',
    'Backend Systems',
    'SaaS AI Delivery',
    'Python / TypeScript',
  ];

  const preferredRoles = [
    'AI Engineer',
    'AI Architect',
    'AI Consultant',
    'AI Solutions Engineer',
    'Contract AI Delivery',
  ];

  const matchSignals = [
    'Strong fit for execution-heavy AI roles',
    'Strong fit for system design + AI integration',
  ];

  return (
    <div
      className="p-8 rounded-3xl border"
      style={{
        background: 'rgba(28,25,23,0.6)',
        borderColor: 'rgba(255,255,255,0.05)',
      }}
    >
      <h3 className="font-newsreader italic text-2xl text-white mb-6">
        Match Engine Context
      </h3>

      <div className="space-y-6">
        {/* Primary Domain */}
        <div>
          <label className="block font-manrope text-[10px] uppercase font-bold tracking-widest text-stone-500 mb-2">
            Primary Domain
          </label>
          <div className="font-manrope text-stone-200 text-sm font-medium">
            AI Systems Architecture
          </div>
        </div>

        {/* Core Strengths */}
        <div>
          <label className="block font-manrope text-[10px] uppercase font-bold tracking-widest text-stone-500 mb-3">
            Core Strengths
          </label>
          <div className="flex flex-wrap gap-x-1 gap-y-0.5">
            {coreStrengths.map((skill) => (
              <span
                key={skill}
                className="font-manrope text-xs py-1 px-1 text-stone-400 hover:text-primary cursor-default transition-colors duration-200"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Preferred Role Types */}
        <div>
          <label className="block font-manrope text-[10px] uppercase font-bold tracking-widest text-stone-500 mb-3">
            Preferred Role Types
          </label>
          <div className="font-manrope text-stone-400 text-sm leading-relaxed">
            {preferredRoles.join(' · ')}
          </div>
        </div>

        {/* Match Signals */}
        <div>
          <label className="block font-manrope text-[10px] uppercase font-bold tracking-widest text-stone-500 mb-3">
            Match Signals
          </label>
          <div className="space-y-1.5">
            {matchSignals.map((signal) => (
              <div key={signal} className="flex items-start gap-2">
                <div
                  className="w-1 h-1 rounded-full mt-1.5 shrink-0"
                  style={{ background: '#93d2d1' }}
                />
                <span className="font-manrope text-xs text-stone-400 leading-relaxed">
                  {signal}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
