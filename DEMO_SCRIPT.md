# 2–3 Minute Demo Script: AI-Native Trading Research Assistant

> **Presenter Persona**: Senior Quantitative Product Engineer / Quantitative Researcher  
> **Target Audience**: Hiring Managers, Lead Quantitative Engineers, Product Leaders  
> **Demo Duration**: ~2.5 to 3 minutes  
> **Core Narrative**: *Moving AI from conversational hallucination to disciplined quantitative discovery.*

---

## [0:00 – 0:30] Introduction & Problem Framing

*(Screen shows the home screen at `http://localhost:3000`)*

**Speaker:**
> *"Hello! Today I'm demonstrating the AI-Native Trading Research Assistant.*  
> *Most AI trading assistants make the mistake of acting like generic chatbots—when you ask an ambiguous question like 'Does buying NIFTY after a sharp fall work?', they'll invent parameters out of thin air, generate some unvalidated Python code, and declare that the strategy is profitable.*  
>  
> *In institutional finance, that's unacceptable. This product enforces a disciplined quantitative workflow:*  
> **ASK $\rightarrow$ CLARIFY $\rightarrow$ DEFINE $\rightarrow$ TEST $\rightarrow$ LEARN.**  
>  
> *Notice our interface: it is dark-first, terminal-grade, with persistent provenance tracking on the right, and clearly marked with 'DEMO DATA' so we never confuse synthetic simulation with actual exchange history."*

---

## [0:30 – 1:05] Stage 01 (ASK) to Stage 02 (CLARIFY)

*(Action: Click the prompt chip: `"Does buying NIFTY after a sharp fall work?"`)*

**Speaker:**
> *"I'll click our core question: 'Does buying NIFTY after a sharp fall work?'. When I click **Analyze Question**, the AI doesn't run a backtest yet.*  
>  
> *Instead, it transitions to **STAGE 02: CLARIFY**.*  
> *Look at the top warning: it detected that 'sharp fall' is quantitatively ambiguous. Does it mean a 1% decline, 2%, 3%, or a rolling percentile?*  
>  
> *And notice that each card explains **why** it matters: a 1% threshold gives us over a hundred sample observations, whereas a 3% threshold isolates rare liquidity shocks.*  
> *I'll select a $\ge 1\%$ daily decline with a 1-day holding horizon, and test across all market regimes.*  
> *Notice also the right-hand panel updating with parameter provenance badges: 'User Said', 'Inferred', and 'Assumed'."*

---

## [1:05 – 1:40] Stage 03 (DEFINE) & Formal Hypothesis

*(Action: Click **"Confirm Assumptions & Define"**)*

**Speaker:**
> *"Now we enter **STAGE 03: DEFINE**.*  
> *Here, the assistant constructs a formal experiment specification.*  
>  
> *Observe this side-by-side comparison: on the left is the User's Original Question, and on the right is the AI's Mathematical Interpretation.*  
> *We formulate an explicit null vs. alternative hypothesis: 'Buying NIFTY after a $\ge 1\%$ daily decline produces a positive next-day average excess return over unconditional market drift.'*  
>  
> *We also expose all active assumptions in plain sight with a one-click option to edit them. Nothing is hidden."*

---

## [1:40 – 2:10] Stage 04 (TEST) & Deterministic Execution

*(Action: Click **"Run Experiment"**)*

**Speaker:**
> *"Now let's click **Run Experiment**.*  
> *The system activates our quantitative pipeline: generating seeded deterministic market data, isolating entry signals, calculating event returns, and aggregating statistics.*  
>  
> *And here are our empirical findings:*  
> *Across 1,260 simulated trading sessions, the system identified 127 qualifying entries.*  
> *We see our win rate, our average strategy return versus the unconditional market baseline, and our estimated excess edge.*  
>  
> *We have four professional Recharts visualizations: our cumulative equity curve, our return distribution histogram, individual trade outcomes, and the underlying NIFTY price series."*

---

## [2:10 – 2:50] Stage 05 (LEARN): Epistemic Separation & Follow-Ups

*(Action: Scroll down to "Separating Empirical Data from Interpretation" and click a Next Question)*

**Speaker:**
> *"Finally—and this is the most critical part of the entire product—we arrive at **STAGE 05: LEARN**.*  
> *We deliberately refuse to output a simple verdict like 'Strategy Works'. Instead, we strictly separate three epistemic pillars:*  
>  
> 1. **What the Data Shows**: *Pure descriptive statistics from the trade log.*  
> 2. **What This Might Mean**: *Our hypothesis evaluation and market microstructure interpretation.*  
> 3. **What We Can Reasonably Conclude**: *Our risk-aware caveat explaining why simulated edge does NOT guarantee real-world profitability due to execution latency and slippage.*  
>  
> *Below that, we surface institutional research warnings, and generated follow-up research questions.*  
> *If I click 'Does buying NIFTY after a 1% fall work better during high-volatility periods?', it immediately loads the new question into our research pipeline and restarts the workflow.*  
>  
> *That is the AI-Native Trading Research Assistant: moving from conversational speculation to verifiable quantitative evidence. Thank you!"*
