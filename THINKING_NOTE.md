# Engineering & Product Thinking Note: AI-Native Trading Research Assistant

## 1. Executive Summary & Philosophy

When retail and professional market participants use generative AI tools, the primary failure mode is **premature certainty**. A user asks:
> *"Does buying NIFTY after a sharp fall work?"*

A conventional LLM chatbot typically produces Python script snippets, invents arbitrary parameters without consent (e.g., choosing a 2% threshold or a 5-day holding period), executes unvalidated calculations, and proclaims whether the strategy is "profitable."

In quantitative finance, this behavior is hazardous. Quantitative analysis is not a conversational opinion; it is a **hypothesis-testing discipline**. 

This assistant treats natural language inquiries as raw scientific inquiries that require:
1. Lexical deconstruction (what did the user actually say?).
2. Ambiguity resolution (what parameters must be quantitatively pinned down?).
3. Assumption transparency (what is the system assuming on the user's behalf?).
4. Controlled experimentation (how does the conditional return compare to the unconditional baseline?).
5. Epistemic segregation (strictly separating empirical observations from speculative interpretations).

---

## 2. Deconstruction: Explicit vs. Inferred vs. Missing

The system's parser evaluates every question against a taxonomy of information states:

| Information State | Definition | Example in Query: *"Does buying NIFTY after a sharp fall work?"* |
| :--- | :--- | :--- |
| **Explicitly Stated** | Tokens that map directly to specific parameters without speculation. | Instrument = `NIFTY 50`; Intent = `Buy (Long)` |
| **Inferred by AI** | Parameters logically derived from market conventions. | Timeframe = `Daily close-to-close` (standard for index inquiries) |
| **Missing / Ambiguous** | Parameters required to formulate a mathematical inequality that are absent. | Definition of *"sharp fall"* (1%? 2%? 3%? 2 $\sigma$?); Holding horizon; Exit condition |
| **Assumed Default** | Sensible baseline defaults applied for demonstration, flagged with high visibility. | Sample period = `5 Years`; Friction = `0 bps` |

By explicitly rendering badges in the UI (**User Said**, **AI Inferred**, **Assumed**, **Missing**), the interface ensures users never mistake a machine-generated default for their own original instructions.

---

## 3. Minimum Necessary Clarification Questions

To maintain a frictionless user experience without abandoning scientific rigor, the system limits clarification to decisions that **materially alter the experiment's empirical outcome**:

1. **Threshold Definition ($T$)**:
   - $\ge 1.0\%$: High frequency ($\sim 120+$ observations in 5 years). Tests frequent dip-buying.
   - $\ge 2.0\%$: Moderate shocks ($\sim 30-45$ observations). Tests panic recovery.
   - $\ge 3.0\%$: Outlier capitulation ($\sim 10-15$ observations). Small sample risk.
   - *Why it matters*: Changes signal frequency and alters statistical degrees of freedom.
2. **Holding Horizon ($H$)**:
   - $1\text{ Day}$: Isolates instantaneous overnight mean reversion.
   - $3\text{ Days}$: Tests multi-session liquidity replenishment.
   - $5\text{ Days}$: Tests multi-day drift versus momentum decay.
3. **Volatility Regime Filter**:
   - All periods vs. High-Volatility ($\ge 75\text{th}$ percentile of 20-day rolling annualized volatility).
   - *Why it matters*: Tests the core market microstructure hypothesis: *Are mean-reversion edges concentrated during market panics, or do they persist in quiet bull markets?*

---

## 4. Quantitative Pitfalls & Bias Mitigation

Any quantitative prototype must explicitly guard against known biases:

### A. Look-Ahead Bias (Execution Feasibility)
- **The Risk**: Evaluating entry at "today's close" when the condition depends on today's close introduces look-ahead bias if orders cannot be filled simultaneously with the closing benchmark.
- **System Defense**: The model defines entry at the official closing print (simulating Market-On-Close facilities) and highlights this latency requirement in the *Institutional Research Warnings* section.

### B. Transaction Costs & Friction Drag
- **The Risk**: A strategy with a positive average return of $+0.15\%$ appears profitable in gross terms, but round-trip brokerage, Securities Transaction Tax (STT), exchange turnover fees, and bid-ask spread crossing can easily exceed $0.20\%$ ($20\text{ bps}$).
- **System Defense**: The assistant incorporates an explicit friction toggle ($0\text{ bps}$ vs. $10\text{ bps}$) and calculates **Net Strategy Return** versus the unconditional baseline.

### C. Overfitting & Data Snooping (Multiple Testing)
- **The Risk**: If a researcher tests $1\%, 1.5\%, 2\%, 2.5\%, 3\%$ iteratively until finding a positive edge, standard $p$-values become invalid due to the multiplicity problem (Harvey, Liu, Zhu 2016).
- **System Defense**: In the *Learn* section, the assistant explicitly notes that testing multiple thresholds without family-wise error rate corrections risks selecting random noise.

### D. Regime Non-Stationarity & Event Clustering
- **The Risk**: Sharp fall events do not occur as independent, identically distributed (i.i.d.) random draws; they cluster during bear markets and macro crises. A strategy may derive its entire 5-year edge from a single 2-week crisis recovery.
- **System Defense**: The assistant provides both an **aggregate return distribution** and a **chronological trade return sequence** chart to visualize return clustering.

---

## 5. Epistemic Segregation in the UI

The defining characteristic of the **LEARN** stage is the structural tripartite separation of knowledge:

```
┌────────────────────────────────────────────────────────┐
│ 01 // WHAT THE DATA SHOWS                             │
│ Descriptive facts: sample size, win rate, mean return  │
├────────────────────────────────────────────────────────┤
│ 02 // WHAT THIS MIGHT MEAN                             │
│ Theoretical interpretation & hypothesis reflection     │
├────────────────────────────────────────────────────────┤
│ 03 // WHAT WE CAN REASONABLY CONCLUDE                 │
│ Methodological caveats, risk disclaimers, limitations  │
└────────────────────────────────────────────────────────┘
```

This deliberate friction prevents researchers and executives from conflating backtest correlation with actionable alpha.
