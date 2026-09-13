# AI Usage Note: AI-Native Trading Research Assistant

This document details the usage of AI coding tools and the human engineering decisions made during the conceptualization and development of the prototype.

---

## 1. AI Tools Utilized

- **AI Tools Used**: Google Antigravity IDE (powered by Google DeepMind Advanced Agentic Coding)
- **Primary Roles**:
  - Full-stack architectural scaffolding (Next.js 14 App Router, TypeScript, Tailwind CSS configuration).
  - Mathematical simulation code generation (Mulberry32 seeded PRNG, Gaussian Box-Muller sampling, rolling volatility calculation).
  - Rapid prototyping of Recharts visualization adapters and responsive layout grids.
  - Browser subagent automation for headless end-to-end regression testing.

---

## 2. Key Human / Engineering Decisions Made

1. **Rejection of Generic Chat UI**:
   - *Decision*: Rejected building a generic conversational chatbot or markdown-streaming chat pane.
   - *Rationale*: Market research requires structured, auditable states, not ephemeral chat bubbles. The `ASK → CLARIFY → DEFINE → TEST → LEARN` stepper establishes an unshakeable quantitative contract with the user.

2. **Strict Provenance Tracking (User vs Inferred vs Assumed)**:
   - *Decision*: Enforced an explicit metadata schema on every extracted parameter.
   - *Rationale*: Prevents the AI from presenting its internal default assumptions as if the user had specified them.

3. **Deterministic Seeded Simulation**:
   - *Decision*: Implemented a pure functional Mulberry32 PRNG with a fixed seed rather than calling unseeded `Math.random()`.
   - *Rationale*: Guarantees that any experiment run with the same parameters yields 100% repeatable, auditable metrics for demo reproducibility.

4. **Epistemic Segregation in the Learn Stage**:
   - *Decision*: Mandated three visually separate cards in the final output (*What the Data Shows*, *What This Might Mean*, *What We Can Reasonably Conclude*).
   - *Rationale*: Directly combats the industry-wide tendency for AI agents to make unjustified claims of profitability based on sparse sample sizes.

---

## 3. AI Suggestions Rejected or Modified

- **AI Suggestion**: Attempting to implement a live external API call to Yahoo Finance or AlphaVantage without API key validation.
  - *Modification*: Replaced with an offline, robust, deterministic synthetic market generator clearly stamped with `DEMO DATA` banners to guarantee reliable local evaluation and zero broken third-party rate limits.
- **AI Suggestion**: Hardcoding final backtest metrics inside React components.
  - *Modification*: Abstracted backtest execution, signals evaluation, and statistical metrics into dedicated, pure TypeScript modules (`lib/backtest/`).

---

## 4. Part of the Solution I Am Most Proud Of

The **Ambiguity & Provenance Architecture**:
The system actively detects missing parameters (e.g., recognizing that "sharp fall" has no standard mathematical definition) and surfaces *why* selecting 1% vs 3% alters the statistical sample. The persistent right-hand context rail allows a researcher or hiring manager to verify the exact lineage of every parameter in the experiment at a glance.
