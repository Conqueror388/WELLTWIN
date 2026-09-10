# OIL-TWIN Enterprise Vibe-Coding & Architectural Standards

This document establishes strict architectural constraints and engineering guardrails for all AI-assisted modifications across the Oil India Limited (OIL) CSS-SRP Digital Twin application.

---

## 1. Security & Data Protection Standards
1. **Never Expose Sensitive Keys on the Client**:
   - Do not prefix private keys or sensitive credentials with VITE_.
   - Never commit production passwords, private database connection strings, or internal secrets to client-accessible files.
2. **Strict Client Input Sanitization**:
   - Numerical telemetry inputs must always be validated, clamped, and protected against NaN, Infinity, negative numbers, or out-of-bounds parameters via centralized sanitization routines (e.g. safeClamp).
   - Text inputs (e.g. Employee Badge IDs, search queries, uploaded JSON schemas) must be trimmed, length-capped, and sanitized against regex-based injection, HTML tags, or prototype pollution before state persistence.
3. **No Unsanitized HTML Injections**:
   - Never use dangerouslySetInnerHTML with user-supplied or unescaped strings. Prefer structured React component rendering.

---

## 2. Architecture & Modular Integrity
1. **Single Source of Truth for Physics Models**:
   - All physical calculations (Arrhenius viscosity curves, Marx-Langenheim heat distributions, polished rod load kinematics, and financial models) must reside in src/simulationEngine.js.
   - Do not duplicate mathematical approximations or physics models inside UI components.
2. **Currency & Unit Consistency**:
   - All cost, revenue, and budgetary models must strictly use Indian Rupees (₹ / INR) with Indian numbering formats (en-IN) to reflect Oil India Limited domestic operational accounting.
   - Oil production must standardly denote barrels per day (bl/d or BPD) and temperatures in Celsius (°C).
3. **Preventing Context Drift**:
   - Always reuse existing icon sets from lucide-react. Ensure every imported icon is verified in the component's import header before usage to prevent runtime ReferenceError crashes.

---

## 3. Failure Handling & Resilient Edge Cases
1. **Error Boundaries at Every Boundary**:
   - The primary application viewport and heavyweight visualization engines (Three.js WebGL and Apache ECharts) must be isolated with <TwinErrorBoundary> so that a transient WebGL context loss or data parsing hiccup does not crash the entire application.
2. **Empty & Error State Graceful Recovery**:
   - Every data-fetching or SCADA streaming view must provide clear, actionable empty states and connection timeout fallbacks with explicit retry actions.
3. **Safe Memory & Resource Deallocation**:
   - Whenever object URLs (URL.createObjectURL) are created for report exports or dataset downloads, always invoke URL.revokeObjectURL(url) following execution to prevent memory leaks in long-running SCADA sessions.
   - All Three.js geometries, textures, materials, and requestAnimationFrame loops must register clean disposal hooks on component unmount.

---

## 4. Performance & Scalability
1. **Lazy Loading Heavyweight Runtimes**:
   - Dynamic chart runtimes (Apache ECharts) and 3D scenes must use code splitting (React.lazy and Suspense) to keep initial bundle load times minimal and preserve 95+ Core Web Vitals.
2. **GPU Optimization**:
   - CSS animations must utilize 	ransform: translate3d(...) or 	ranslateZ(0) and will-change properties to enforce hardware acceleration without causing continuous repaints.

---

## 5. Deployment & Configuration Checklist
- [x] Zero hardcoded localhost or 127.0.0.1 endpoints.
- [x] Strict linting passing with 0 errors (
pm run lint).
- [x] Production build passing cleanly (
pm run build).
- [x] Indian Rupee currency standard (₹) applied everywhere.
