interface RightRailProps {
  totalReports: number;
  latestUpdate: Date | null;
}

export function RightRail({ totalReports, latestUpdate }: RightRailProps) {
  const skills = [
    'AI Systems',
    'LLM Integration',
    'Workflow Orchestration',
    'Autonomous Execution',
    'Backend Engineering',
    'Production Deployment'
  ];

  return (
    <aside className="w-96 bg-surface_container h-screen overflow-y-auto scrollbar-thin">
      <div className="p-6 space-y-6">
        {/* Profile Card */}
        <section className="card-premium p-6">
          <div className="flex items-start gap-4 mb-5">
            <div className="w-14 h-14 rounded-full bg-gradient-primary flex items-center justify-center text-surface font-newsreader text-xl font-semibold">
              AI
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-newsreader text-on_surface mb-1 tracking-tight">
                AI Engineer
              </h3>
              <p className="text-xs text-on_surface_dim font-manrope">
                Edinburgh, UK
              </p>
            </div>
          </div>
          
          <div className="space-y-3 mb-5">
            <div>
              <div className="text-[10px] uppercase tracking-widest text-on_surface_dim mb-1.5 font-manrope font-semibold">
                Specialization
              </div>
              <div className="text-sm text-on_surface_variant font-manrope leading-relaxed">
                AI Systems Architect · Contract Specialist
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-outline_variant/10">
            <div className="text-[10px] uppercase tracking-widest text-on_surface_dim mb-3 font-manrope font-semibold">
              Core Expertise
            </div>
            <div className="flex flex-wrap gap-2">
              {skills.map(skill => (
                <span
                  key={skill}
                  className="px-2.5 py-1 bg-surface_container_highest text-on_surface_variant text-xs font-manrope rounded-md"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* System Intelligence Card */}
        <section className="card-premium p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-base font-newsreader text-on_surface tracking-tight">
              System Intelligence
            </h3>
          </div>
          
          <p className="text-sm text-on_surface_variant leading-relaxed mb-4 font-manrope">
            Autonomous AI system scanning Edinburgh's job market daily, filtering signal from noise, and generating structured intelligence reports.
          </p>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-surface_container_high rounded-lg p-3">
              <div className="text-[10px] uppercase tracking-widest text-on_surface_dim mb-1 font-manrope font-semibold">
                Frequency
              </div>
              <div className="text-sm text-on_surface font-manrope font-medium">
                Daily
              </div>
            </div>
            <div className="bg-surface_container_high rounded-lg p-3">
              <div className="text-[10px] uppercase tracking-widest text-on_surface_dim mb-1 font-manrope font-semibold">
                Location
              </div>
              <div className="text-sm text-on_surface font-manrope font-medium">
                Edinburgh
              </div>
            </div>
          </div>
        </section>

        {/* Live Stats Card */}
        <section className="card-premium p-6">
          <h3 className="text-base font-newsreader text-on_surface mb-5 tracking-tight">
            Activity
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-baseline justify-between">
              <span className="text-xs text-on_surface_dim font-manrope uppercase tracking-wider">
                Total Reports
              </span>
              <span className="text-3xl font-newsreader text-primary font-light">
                {totalReports}
              </span>
            </div>
            
            {latestUpdate && (
              <div className="pt-4 border-t border-outline_variant/10">
                <div className="text-[10px] uppercase tracking-widest text-on_surface_dim mb-2 font-manrope font-semibold">
                  Last Updated
                </div>
                <div className="text-sm text-on_surface_variant font-manrope">
                  {latestUpdate.toLocaleDateString('en-GB', { 
                    day: 'numeric', 
                    month: 'long', 
                    year: 'numeric' 
                  })}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Source Link */}
        <section className="card-elevated p-5">
          <a
            href="https://github.com/mccaigs/jobs"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-3 transition-colors-smooth"
          >
            <div className="w-10 h-10 rounded-lg bg-surface_container_highest group-hover:bg-surface_elevated flex items-center justify-center transition-colors-smooth">
              <svg className="w-5 h-5 text-on_surface_dim group-hover:text-on_surface" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="flex-1">
              <div className="text-sm font-manrope text-on_surface group-hover:text-primary transition-colors-smooth">
                View on GitHub
              </div>
              <div className="text-xs text-on_surface_dim font-manrope">
                mccaigs/jobs
              </div>
            </div>
            <svg className="w-4 h-4 text-on_surface_dim group-hover:text-primary transition-colors-smooth" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </section>
      </div>
    </aside>
  );
}
