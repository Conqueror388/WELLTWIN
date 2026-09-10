import React, { useState } from 'react';
import { 
  Sparkles, 
  Layers, 
  Activity, 
  TrendingUp, 
  Cpu, 
  Globe, 
  CheckCircle2, 
  ExternalLink,
  Building2,
  Leaf
} from 'lucide-react';

export default function OilIndiaUpgradeHub() {
  const [activePhase, setActivePhase] = useState('all');
  const [selectedPillar, setSelectedPillar] = useState('modernization');

  const architectureLayers = [
    {
      layer: 'CMS & Backend',
      current: 'Drupal 10 (Monolithic SSR, jQuery, legacy Views)',
      pain: 'Slow FCP, render-blocking CSS/JS bundles, heavy server load.',
      upgrade: 'Decoupled Headless Architecture (Next.js/React + GraphQL API Engine)',
      impact: '⚡ 4x Faster Page Loads & Zero Downtime'
    },
    {
      layer: 'Frontend Styling',
      current: 'Bootstrap 4/5 custom stylesheets (style.css, responsive.css)',
      pain: 'Deep 4-tier hover dropdowns impossible to tap cleanly on smartphones.',
      upgrade: 'Modern Tailwind CSS + Componentized Mobile-First Mega-Menu',
      impact: '📱 Flawless Touch & Fluid Responsive Experience'
    },
    {
      layer: 'Performance & Assets',
      current: 'Lozad.js, heavy unoptimized WebM video banner (30MB+)',
      pain: 'Mobile bandwidth throttling and sluggish first contentful paint.',
      upgrade: 'Adaptive HLS/DASH Video Streaming + Next-Gen AVIF/WebP Compression',
      impact: '🚀 85% Reduced Asset Bandwidth & 95+ Core Web Vitals'
    },
    {
      layer: 'Interactive Capabilities',
      current: 'Static tables, buried PDF links, external redirects',
      pain: 'No live data visualizers, zero 3D asset maps, cumbersome disclosures.',
      upgrade: 'Interactive WebGL/3D Field Explorer + Real-Time SCADA/EOR Dashboards',
      impact: '🛢️ World-Class Digital Twin Showcasing'
    },
    {
      layer: 'Accessibility & Compliance',
      current: 'Basic GIGW text scaler & inverted wob toggle',
      pain: 'Missing dynamic ARIA live regions and keyboard accessibility traps.',
      upgrade: 'GIGW 3.0 & WCAG 2.2 AA Engineered Dark/Light High-Contrast Modes',
      impact: '♿ 100% Inclusive Government Accessibility Standard'
    }
  ];

  const roadmapPhases = [
    {
      id: 'phase1',
      phase: 'Phase 1',
      title: 'Quick Wins & Foundations',
      timeline: 'Months 1 – 3',
      color: 'border-amber-500/40 bg-amber-500/10 text-amber-400',
      items: [
        {
          title: 'Unified Mega-Menu & Enterprise Portals Hub',
          desc: 'Consolidates Vendor SRM, Careers, E-Tenders, Ex-Employees, and Vigilance into a single intuitive touch menu.',
          badge: 'UX Navigation'
        },
        {
          title: 'Performance & Mobile Assets Compression',
          desc: 'Adaptive HLS video banner streaming + AVIF/WebP conversion for high mobile speed scores.',
          badge: 'Performance'
        },
        {
          title: 'Live Stock & Financial Visualizer',
          desc: 'Interactive NSE/BSE chart, dividend histories, and one-click financial CSV/Excel data extraction.',
          badge: 'Investor Relations'
        }
      ]
    },
    {
      id: 'phase2',
      phase: 'Phase 2',
      title: 'Operational & Digital Twin Showcases',
      timeline: 'Months 3 – 6',
      color: 'border-amber-400/50 bg-amber-400/10 text-amber-300',
      items: [
        {
          title: '3D Interactive Asset & Subsurface Explorer',
          desc: 'Interactive WebGL showcase of OIL primary basins (Assam, Rajasthan, KG) with pumpjack kinematics & steam cutaways.',
          badge: 'Digital Twin'
        },
        {
          title: 'Live ESG & Net-Zero 2040 Decarbonization Hub',
          desc: 'Transparent live telemetry for flaring reduction, Duliajan green hydrogen, and renewable energy capacities.',
          badge: 'Sustainability'
        },
        {
          title: 'Unified Vendor & Tender Intelligence Center',
          desc: 'Real-time searchable tender tracker with evaluation status pills, GeM links, and bill status lookup.',
          badge: 'Procurement'
        }
      ]
    },
    {
      id: 'phase3',
      phase: 'Phase 3',
      title: 'Digital Transformation & AI Integration',
      timeline: 'Months 6 – 9',
      color: 'border-zinc-400/50 bg-zinc-400/10 text-zinc-200',
      items: [
        {
          title: 'AI Search & Multilingual Chat Assistant',
          desc: 'Vector-indexed instant search across thousands of circulars, filings, policies, and Hindi/English tenders.',
          badge: 'Generative AI'
        },
        {
          title: 'Full Headless Decoupled Micro-Frontends',
          desc: 'Decoupled Drupal CMS backend powering lightning-fast modern micro-frontends with zero monolithic bottlenecks.',
          badge: 'Enterprise Architecture'
        }
      ]
    }
  ];

  const pillars = [
    {
      id: 'modernization',
      label: 'Digital Twin & Field Operations',
      icon: Cpu,
      current: 'Static photos of rigs and oil processing stations.',
      upgrade: 'Embedded WebGL/3D spatial twins featuring live BGW-014 sucker rod pump kinematics, reservoir steam sweep radius, and Arrhenius viscosity decay curves.',
      kpis: ['Subsurface thermal mapping', 'Interactive dyno card analysis', 'Real-time SCADA status telemetry']
    },
    {
      id: 'investor',
      label: 'Interactive Investor Cockpit',
      icon: TrendingUp,
      current: 'Pages filled with static PDF download links for quarterly reports.',
      upgrade: 'Live interactive NSE/BSE ticker, historical share price explorer, interactive dividend yields, and direct CSV/Excel financial statement exports.',
      kpis: ['Interactive EBITDA & Revenue charts', 'Upcoming Earnings webcast countdown', 'One-click regulatory filing dossiers']
    },
    {
      id: 'esg',
      label: 'ESG & Decarbonization Hub',
      icon: Leaf,
      current: 'Standard text writeups and downloadable CSR annual PDF dossiers.',
      upgrade: 'Live dashboard tracking Net-Zero 2040 trajectory, gas flaring reduction milestones, Duliajan 100 kW green hydrogen pilot stats, and afforestation acreage.',
      kpis: ['Flaring intensity reduction counter', 'Renewable solar & wind capacity', 'Water recycling compliance score']
    },
    {
      id: 'vendor',
      label: 'One-Stop Vendor Central',
      icon: Building2,
      current: 'Tenders fragmented across National, Global, Limited, GeM, and legacy SRM.',
      upgrade: 'Consolidated tender portal with live status badges (Active, Technical Evaluation, Awarded), real-time bill tracking, and vendor alerts.',
      kpis: ['Live tender status pills', 'Instant bill tracking with token', 'Automated email/SMS bid updates']
    }
  ];

  const filteredPhases = activePhase === 'all' 
    ? roadmapPhases 
    : roadmapPhases.filter(p => p.id === activePhase);

  return (
    <div className="space-y-8 page-transition-wrap pb-16">
      
      {/* ── 1. Top Executive Banner ── */}
      <div className="glass-panel p-6 sm:p-8 border-amber-500/30 slide-edge-top relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 relative z-10">
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-500/20 text-amber-400 border border-amber-500/40 uppercase">
                STRATEGIC MODERNIZATION ROADMAP
              </span>
              <span className="text-sm font-mono text-zinc-400">Target: oil-india.com</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-heading text-white tracking-wide uppercase">
              Oil India Limited: Modernization & Digital Twin Transformation
            </h2>
            <p className="text-sm sm:text-base text-zinc-200 font-sans mt-2 max-w-3xl leading-relaxed">
              Comprehensive architectural blueprint, technical gap audit, and 3-phase implementation roadmap for elevating OIL's digital presence to world-class energy standards.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            <a 
              href="https://www.oil-india.com/" 
              target="_blank" 
              rel="noreferrer"
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 text-zinc-100 border border-zinc-700 text-sm font-mono font-bold uppercase transition-all shadow-lg hover:border-amber-500/50"
            >
              <Globe className="w-4 h-4 text-amber-400" />
              <span>Visit Live Portal</span>
              <ExternalLink className="w-4 h-4 text-zinc-400" />
            </a>
          </div>
        </div>
      </div>

      {/* ── 2. Visual Architecture Flowchart ── */}
      <div className="glass-panel p-6 sm:p-8 space-y-6 slide-edge-bottom">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-900 pb-5">
          <div>
            <h3 className="text-lg sm:text-xl font-bold font-heading text-white uppercase tracking-wider flex items-center gap-2.5">
              <Layers className="w-5 h-5 text-amber-400" />
              Interactive Transformation Flowchart
            </h3>
            <span className="text-xs sm:text-sm text-zinc-400 font-mono mt-0.5 block">
              3-PHASE EXECUTION MATRIX: FOUNDATION → OPERATIONAL SHOWCASES → DIGITAL TRANSFORMATION
            </span>
          </div>

          {/* Phase Filter Tabs */}
          <div className="flex items-center bg-zinc-950 p-1.5 rounded-xl border border-zinc-800 text-xs sm:text-sm font-mono">
            {[
              { id: 'all', label: 'All Phases' },
              { id: 'phase1', label: 'Phase 1: Quick Wins' },
              { id: 'phase2', label: 'Phase 2: Showcases' },
              { id: 'phase3', label: 'Phase 3: AI & Scale' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActivePhase(tab.id)}
                className={`px-3.5 py-2 rounded-lg font-bold transition-all cursor-pointer ${
                  activePhase === tab.id 
                    ? 'bg-amber-500 text-slate-950 shadow-md font-black' 
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* 3-Column Roadmap Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredPhases.map((phase) => (
            <div 
              key={phase.id}
              className={`rounded-2xl p-6 border flex flex-col justify-between space-y-6 transition-all bg-black/40 ${phase.color.split(' ')[0]}`}
            >
              <div>
                <div className="flex items-center justify-between border-b border-zinc-800 pb-3.5 mb-5">
                  <div>
                    <span className="text-xs font-mono font-bold uppercase text-amber-400 block tracking-wide">{phase.phase}</span>
                    <h4 className="text-base sm:text-lg font-bold text-white font-sans">{phase.title}</h4>
                  </div>
                  <span className="text-xs font-mono px-2.5 py-1 rounded bg-zinc-900 text-zinc-200 border border-zinc-800">
                    {phase.timeline}
                  </span>
                </div>

                <div className="space-y-4">
                  {phase.items.map((item, idx) => (
                    <div 
                      key={idx}
                      className="p-4 rounded-xl bg-zinc-900/60 hover:bg-zinc-900 border border-zinc-800/80 transition-all space-y-2"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <strong className="text-sm font-bold text-white font-sans">{item.title}</strong>
                        <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 whitespace-nowrap">
                          {item.badge}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-sans">
                        {item.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3.5 border-t border-zinc-800/80 flex items-center justify-between text-xs sm:text-sm font-mono text-zinc-300">
                <span>Status: Approved Blueprint</span>
                <CheckCircle2 className="w-5 h-5 text-amber-400" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── 3. Current State vs Proposed Architecture Matrix ── */}
      <div className="glass-panel p-6 sm:p-8 space-y-6">
        <div className="border-b border-zinc-900 pb-4">
          <h3 className="text-lg sm:text-xl font-bold font-heading text-white uppercase tracking-wider flex items-center gap-2.5">
            <Activity className="w-5 h-5 text-amber-400" />
            Current State vs Technical Architecture Overview
          </h3>
          <span className="text-xs sm:text-sm text-zinc-400 font-mono mt-0.5 block">
            DEEP-DIVE COMPARATIVE AUDIT OF OIL'S EXISTING DRUPAL STACK VS MODERN DIGITAL TWIN PLATFORM
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm font-sans border-collapse">
            <thead>
              <tr className="border-b border-zinc-800 text-zinc-300 font-mono uppercase bg-zinc-950/70 text-xs sm:text-sm tracking-wider">
                <th className="py-3.5 px-4">Architecture Layer</th>
                <th className="py-3.5 px-4">Current Implementation</th>
                <th className="py-3.5 px-4">Key Pain Points</th>
                <th className="py-3.5 px-4">Proposed Modernization Upgrade</th>
                <th className="py-3.5 px-4 text-right">Expected Impact</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-900 font-sans">
              {architectureLayers.map((row, idx) => (
                <tr key={idx} className="hover:bg-zinc-900/50 transition-colors">
                  <td className="py-4 px-4 font-bold text-amber-400 font-mono whitespace-nowrap text-sm sm:text-base">{row.layer}</td>
                  <td className="py-4 px-4 text-zinc-300 max-w-[200px] leading-relaxed text-xs sm:text-sm font-mono">{row.current}</td>
                  <td className="py-4 px-4 text-zinc-400 max-w-[220px] leading-relaxed text-xs sm:text-sm">{row.pain}</td>
                  <td className="py-4 px-4 text-white font-medium max-w-[240px] leading-relaxed text-xs sm:text-sm">{row.upgrade}</td>
                  <td className="py-4 px-4 text-right font-bold text-emerald-400 whitespace-nowrap text-xs sm:text-sm font-mono">{row.impact}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── 4. Key Strategic Upgrade Pillars (Interactive Deep Dive) ── */}
      <div className="glass-panel p-6 sm:p-8 space-y-6">
        <div className="border-b border-zinc-900 pb-4">
          <h3 className="text-lg sm:text-xl font-bold font-heading text-white uppercase tracking-wider flex items-center gap-2.5">
            <Sparkles className="w-5 h-5 text-amber-400" />
            High-Impact Strategic Upgrade Pillars
          </h3>
          <span className="text-xs sm:text-sm text-zinc-400 font-mono mt-0.5 block">
            SELECT A DOMAIN TO EXPLORE ACTIONABLE ENHANCEMENTS AND DELIVERABLE KPIS
          </span>
        </div>

        {/* Pillar Switcher */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {pillars.map(p => {
            const Icon = p.icon;
            const isSelected = selectedPillar === p.id;
            return (
              <button
                key={p.id}
                onClick={() => setSelectedPillar(p.id)}
                className={`p-5 rounded-2xl text-left border transition-all flex flex-col justify-between gap-4 cursor-pointer ${
                  isSelected 
                    ? 'bg-amber-500/15 border-amber-500/50 shadow-md ring-1 ring-amber-500/30' 
                    : 'bg-zinc-950/60 hover:bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <Icon className={`w-6 h-6 ${isSelected ? 'text-amber-400' : 'text-zinc-500'}`} />
                  {isSelected && <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />}
                </div>
                <strong className={`text-sm sm:text-base font-bold font-sans ${isSelected ? 'text-white' : 'text-zinc-300'}`}>
                  {p.label}
                </strong>
              </button>
            );
          })}
        </div>

        {/* Selected Pillar Content */}
        {(() => {
          const current = pillars.find(p => p.id === selectedPillar);
          if (!current) return null;
          return (
            <div className="p-6 sm:p-7 rounded-2xl bg-zinc-950/80 border border-zinc-800/80 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-900 pb-4">
                <h4 className="text-base sm:text-lg font-bold text-white font-sans uppercase flex items-center gap-2.5">
                  <current.icon className="w-5 h-5 text-amber-400" />
                  {current.label} Blueprint Details
                </h4>
                <span className="text-xs font-mono px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 font-bold">
                  Ready for Integration
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="p-5 rounded-xl bg-black/40 border border-zinc-900 space-y-2">
                  <span className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider">Existing Baseline on oil-india.com</span>
                  <p className="text-sm sm:text-base text-zinc-300 font-sans leading-relaxed">
                    {current.current}
                  </p>
                </div>

                <div className="p-5 rounded-xl bg-amber-500/5 border border-amber-500/20 space-y-2">
                  <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">Proposed Digital Modernization</span>
                  <p className="text-sm sm:text-base text-zinc-100 font-sans leading-relaxed font-medium">
                    {current.upgrade}
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <span className="text-xs sm:text-sm font-mono font-bold text-zinc-400 uppercase block mb-3">Key Metric Deliverables:</span>
                <div className="flex flex-wrap gap-2.5">
                  {current.kpis.map((kpi, i) => (
                    <span 
                      key={i} 
                      className="px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-mono font-bold bg-zinc-900 text-zinc-100 border border-zinc-800 flex items-center gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4 text-amber-400 flex-shrink-0" />
                      {kpi}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })()}
      </div>

    </div>
  );
}
