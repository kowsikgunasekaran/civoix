# Software Requirements Specification (SRS)
## Civoix — Closed-Loop Citizen Demand-to-Impact Platform

**A Multilingual AI Digital Public Good for Aligning Citizen Voice with National Infrastructure Priorities**

*Submission for BRICS Track 1 — AI for Digital Public Infrastructure & Governance (Theme: Innovation)*

| | |
|---|---|
| **Document version** | 1.0 |
| **Status** | Hackathon build specification |
| **Platform tagline** | *"From the citizen's voice to the built road — and back again."* |
| **Build constraint** | Google-only technology stack |

---

## Table of Contents

1. Introduction
2. Overall Description
3. System Architecture
4. Detailed Module Specifications
5. External Interface Requirements
6. Data Model & Data Requirements
7. Non-Functional Requirements
8. Digital Public Good (DPG) Compliance
9. Federation & BRICS Scale Architecture
10. Explainability & Trust Framework
11. Demo Script (Minute-by-Minute)
12. Implementation Roadmap
13. Risks & Mitigations
14. Appendices

---

## 1. Introduction

### 1.1 Purpose

This document specifies the complete requirements for **Civoix**, a multilingual, AI-powered civic intelligence platform that ingests citizen development requests across voice, text, and messaging channels; fuses them with national demographic, infrastructure-index, and public-investment datasets; produces **explainable, budget-aware project prioritization** for policymakers; and — critically — **closes the loop** by tracking each funded project through delivery and measuring its real impact on citizen sentiment and infrastructure gaps.

The platform is designed from first principles as a **Digital Public Good (DPG)**: open-source, built on open standards, privacy-preserving, and architected for **federated deployment across BRICS nations** without requiring any nation to surrender data sovereignty.

### 1.2 Problem Restatement

Governments cannot reconcile fragmented, multilingual citizen feedback with top-down national infrastructure priorities. The consequences are threefold: **misaligned public spending**, **unaddressed infrastructure gaps**, and **no mechanism to measure whether large-scale Digital Public Infrastructure investments actually worked**. Civoix attacks all three simultaneously.

### 1.3 Scope

**In scope:** omnichannel multilingual intake; AI understanding, classification and geo-tagging; multi-dataset fusion; explainable prioritization against live budget constraints; project lifecycle tracking; closed-loop impact measurement; policymaker decision-support with simulation; citizen feedback notification; federated interoperability layer; integrity/anti-manipulation safeguards; governance and audit.

**Out of scope (for the hackathon MVP, noted as roadmap):** full production-grade federated learning across live national nodes; direct financial disbursement/payment execution; formal integration with each nation's legacy ERP systems.

### 1.4 Intended Audience

Hackathon judges and technical evaluators; policymakers and civic-tech stakeholders; the development team; potential DPG Alliance reviewers; downstream government adopters.

### 1.5 Definitions, Acronyms & Abbreviations

| Term | Meaning |
|---|---|
| **DPG** | Digital Public Good — open-source software meeting the DPG Alliance standard (open licence, open standards, privacy, do-no-harm) |
| **DPI** | Digital Public Infrastructure |
| **Request** | A single citizen-submitted development need (e.g. "we need a streetlight on X road") |
| **Demand cluster / hotspot** | A geographically and semantically grouped set of related requests |
| **Infra-Gap Index** | Sector-specific national indicator of infrastructure deficiency for a geography |
| **Priority Score** | Explainable composite ranking of a candidate project |
| **Impact Score** | Post-delivery measure of whether a funded project satisfied its demand |
| **Sentiment Delta** | Change in citizen sentiment for a locality before vs. after project delivery |
| **Node** | A single nation's sovereign deployment of Civoix within the federation |
| **PHC / Ward / District** | Standard administrative geographic units |
| **IVR** | Interactive Voice Response (phone-based intake) |

---

## 2. Overall Description

### 2.1 Product Perspective

Civoix is a new, self-contained platform (not a module of an existing system). It sits as an intelligence and coordination layer **between citizens and the state's planning/finance apparatus**. It does not replace government financial systems; it feeds them prioritized, evidence-backed recommendations and reads back delivery status to close the loop.

The defining architectural idea is the **loop**, not the pipeline:

```
        ┌──────────────────────────────────────────────────────────┐
        │                                                          │
   [Citizen Voice] → [Understand] → [Fuse Data] → [Prioritize]     │
        ↑                                              │           │
        │                                              ▼           │
   [Measure Impact] ← [Track Delivery] ← [Policymaker Decision] ───┘
   (sentiment delta)     (lifecycle)      (explainable, budget-aware)
```

Most competing systems implement only the top row (intake → dashboard). Civoix's differentiator is the **bottom return path** — delivery tracking and impact measurement that feed back into the next planning cycle.

### 2.2 Product Functions (high-level)

- Accept citizen requests via voice call (IVR), voice note, text, and web across many languages.
- Transcribe, translate, understand, categorize, and geo-tag each request automatically.
- Cluster requests into demand hotspots and quantify demand intensity.
- Fuse citizen demand with demographic, infrastructure-index, and budget datasets.
- Generate **explainable** priority scores for candidate projects, constrained by real budget lines.
- Present policymakers a decision cockpit with interactive re-ranking and what-if simulation.
- Track each approved project through its delivery lifecycle.
- Measure post-delivery impact via demand-satisfaction and sentiment-delta.
- Notify citizens that their voice led to action (closing the trust loop).
- Expose a federated interoperability layer for cross-BRICS model and taxonomy sharing.
- Detect and neutralize coordinated inauthentic demand (astroturfing).

### 2.3 User Classes & Characteristics

| User class | Characteristics | Primary needs |
|---|---|---|
| **Citizen (literate, smartphone)** | Uses web/app/messaging text | Fast submission, status visibility |
| **Citizen (non-literate / rural / feature-phone)** | Voice-only, minority language, offline-first | IVR/voice-note intake in mother tongue |
| **Field officer / local official** | Verifies and updates project delivery status | Simple lifecycle update tools, mobile |
| **District planner** | Reviews hotspots, drafts proposals | Clustered demand + gap context |
| **Policymaker / ministry** | Allocates budget across competing needs | Explainable prioritization, simulation, budget fit |
| **Auditor / civil society** | Ensures fairness and transparency | Full audit trail, open metrics, exportable data |
| **Federation admin (national)** | Manages the sovereign node & cross-BRICS sharing | Data-residency control, model exchange |

### 2.4 Operating Environment

Cloud-native, serverless-first, deployed on Google Cloud. Web front-end (responsive) for officials and literate citizens; telephony/IVR and voice-note channels for the offline majority; REST/gRPC APIs for interoperability. Target scale: national (state → district → ward), designed to federate across nations.

### 2.5 Design & Implementation Constraints

- **C-1 (hard):** The entire build must use **Google services/products only**. All AI, data, hosting, mapping, telephony-adjacent, auth, and analytics components are mapped to Google offerings (see §5.3 and per-module stack tables).
- **C-2:** Must be releasable as open-source under an OSI-approved licence to qualify as a DPG.
- **C-3:** Must operate multilingually across "diverse linguistic regions" — no hard-coding of a single national language.
- **C-4:** Must not require citizens to have smartphones, literacy, or internet at point of submission (voice/IVR fallback mandatory).
- **C-5:** Data sovereignty — no design may require raw citizen data to leave its nation of origin.
- **C-6 (messaging caveat):** Third-party messaging apps (WhatsApp/Telegram) are **not** Google products. Under C-1, the messaging channel is delivered via Google-native paths (RCS Business Messaging / web chat / voice); if organizers permit third-party channels, they can be added as adapters. *This is flagged explicitly rather than hidden.*

### 2.6 Assumptions & Dependencies

- Open government datasets (census/demographics, sector infrastructure indices, published budget/investment plans) are available or can be represented with realistic synthetic equivalents for the demo.
- Administrative geo-boundary data (ward/district shapefiles) is available.
- For the hackathon, longitudinal "before/after" impact data is seeded synthetically and **clearly labelled as such** — integrity of claims is itself a scoring factor.

---

## 3. System Architecture

### 3.1 Layered View

**Layer 1 — Ingestion (Omnichannel):** voice call/IVR, voice note, SMS/text, web form, RCS chat. Normalizes every input into a canonical `RawRequest`.

**Layer 2 — AI Understanding:** speech-to-text, language detection, translation to a canonical working language, intent/category classification, severity & entity extraction, geo-resolution. Produces a structured `Request`.

**Layer 3 — Aggregation & Fusion:** de-duplication, semantic clustering into demand hotspots, and the join of demand with demographic + infra-index + budget datasets in the analytics warehouse.

**Layer 4 — Intelligence:** explainable prioritization engine, simulation/what-if engine, impact-measurement engine, integrity engine.

**Layer 5 — Experience:** citizen status/notification surface; policymaker decision cockpit; field-officer lifecycle app; auditor/open-data portal.

**Layer 6 — Federation & Governance:** interoperability APIs, shared taxonomy registry, federated model exchange, identity, audit, and data-sovereignty controls.

### 3.2 End-to-End Data Flow

1. Citizen submits a request on any channel → `RawRequest` created.
2. AI layer transcribes/translates/classifies/geo-tags → structured `Request`.
3. Request is de-duplicated and clustered into a `DemandCluster` (hotspot).
4. Clusters are fused with demographic, infra-gap, and budget data → `CandidateProject` set.
5. Prioritization engine scores candidates → explainable ranked list.
6. Policymaker reviews, simulates, and approves → `Project` enters lifecycle.
7. Field officers update delivery milestones → lifecycle state advances.
8. On completion, impact engine computes demand-satisfaction + sentiment-delta → `ImpactScore`.
9. Citizens in the locality are notified; impact feeds the next planning cycle.
10. Anonymized model/taxonomy improvements are optionally shared across the BRICS federation.

### 3.3 Google Stack Mapping (system-wide)

| Concern | Google service |
|---|---|
| Conversational + multimodal AI (transcribe, understand, classify, explain, narrate) | **Gemini API** (Flash for high-volume, Pro for reasoning) via Google AI Studio / **Vertex AI** |
| Dedicated speech transcription (Indian & BRICS languages) | **Cloud Speech-to-Text** |
| Translation to/from canonical language | **Cloud Translation API** |
| Semantic clustering / embeddings & vector search | **Vertex AI Embeddings + Vector Search** |
| Analytics warehouse (fusion, hotspots, longitudinal impact) | **BigQuery** |
| Operational app data & lifecycle state | **Firestore** |
| Object storage (audio, shapefiles, exports) | **Cloud Storage** |
| Maps, geocoding, hotspot heatmaps, simulation view | **Google Maps Platform** |
| Serverless backend / APIs | **Cloud Run** |
| Front-end hosting | **Firebase Hosting** |
| Identity & access | **Firebase Auth / Identity Platform** |
| Event/async pipeline (ingest → process) | **Pub/Sub** |
| Voice/IVR + notifications (Google-native path) | **RCS Business Messaging / Dialogflow CX** for conversational voice/chat |
| Scheduling (impact re-checks, digests) | **Cloud Scheduler** |

---

## 4. Detailed Module Specifications

> Each module below is specified with: **Purpose · Inputs · Processing Logic · Outputs · Functional Requirements (FR) · Google Stack · Edge Cases · Demo Relevance.**

---

### Module 1 — Multilingual Omnichannel Ingestion  *(the AwaazFirst voice moment)*

**Purpose.** Capture a development request from *any* citizen — including the offline, non-literate, minority-language speaker on a feature phone — and normalize it into a single canonical record regardless of channel or language.

**Inputs.** Inbound phone call (IVR), voice note, SMS/text, web form submission, RCS chat message. Each carries raw content plus channel metadata (caller region, timestamp, coarse location if available).

**Processing Logic.**
1. Channel adapters receive input and immediately create a `RawRequest` with a channel tag and a stable citizen pseudonymous ID (never a raw phone number in analytics — hashed at the edge, see §7 privacy).
2. Audio inputs are stored to Cloud Storage; a Pub/Sub event triggers downstream processing so ingestion never blocks on AI latency.
3. A lightweight acknowledgement is returned on-channel ("Your request is received; reference #A4213").

**Outputs.** A persisted `RawRequest` and an emitted `request.received` event.

**Functional Requirements.**
- **FR-1.1** The system shall accept requests via voice call/IVR, voice note, text, web, and RCS chat.
- **FR-1.2** The system shall not require literacy, a smartphone, or internet access at submission time (voice/IVR mandatory).
- **FR-1.3** The system shall issue an immediate, human-readable reference ID on every channel.
- **FR-1.4** The system shall pseudonymize citizen identifiers at the edge before any analytics use.
- **FR-1.5** Ingestion shall be non-blocking (async), tolerating AI-layer latency or downtime by queueing.

**Google Stack.** Dialogflow CX / RCS Business Messaging (conversational voice + chat), Cloud Storage (audio), Pub/Sub (event fan-out), Cloud Run (adapters).

**Edge Cases.** Dropped calls mid-request (persist partial, allow resume via reference ID); duplicate submissions from the same citizen (handled downstream in Module 3); poor audio quality (flag for low-confidence handling in Module 2).

**Demo Relevance.** ★★★★★ This is the showstopper. A live spoken grievance in Tamil/Hindi/Portuguese from a phone becoming structured data on stage is the single most memorable moment of the pitch.

---

### Module 2 — AI Understanding & Classification Engine

**Purpose.** Turn messy, multilingual, spoken-or-typed human input into a clean, structured, geo-tagged, categorized `Request`.

**Inputs.** `RawRequest` (audio or text), channel + coarse-location metadata.

**Processing Logic.**
1. **Transcription** — audio → text via Cloud Speech-to-Text (with Gemini as multimodal fallback for low-resource languages).
2. **Language detection & translation** — detect source language; translate to a canonical working language (e.g. English) for uniform processing, while preserving the original text verbatim.
3. **Intent & category classification** — Gemini classifies into a controlled taxonomy (e.g. Water, Sanitation, Roads, Electricity, Health, Education, Drainage, Public Transport…), aligned to the shared BRICS taxonomy (Module 10).
4. **Attribute extraction** — severity/urgency, affected-population hint, named location strings, temporal cues.
5. **Geo-resolution** — resolve mentioned place names + coarse channel location to lat/long and administrative unit (ward/district) via Maps Geocoding.
6. **Confidence scoring** — low-confidence items are routed to a human-in-the-loop review queue rather than silently mis-filed.

**Outputs.** A structured `Request` object: `{original_text, translated_text, language, category, severity, geo{lat,lng,ward,district}, confidence, entities[]}`.

**Functional Requirements.**
- **FR-2.1** The system shall transcribe voice input in all supported languages with a confidence value.
- **FR-2.2** The system shall detect source language automatically and translate to the canonical language while retaining the original.
- **FR-2.3** The system shall classify each request into the controlled, taxonomy-aligned category set.
- **FR-2.4** The system shall extract severity and geo-location and resolve to an administrative unit.
- **FR-2.5** Requests below a confidence threshold shall be routed for human review, never auto-actioned.
- **FR-2.6** The system shall preserve the citizen's original wording for auditability.

**Google Stack.** Cloud Speech-to-Text, Cloud Translation, Gemini (classification + extraction), Maps Geocoding, Vertex AI (embeddings for later clustering).

**Edge Cases.** Code-switching (Tamil-English mix); ambiguous place names ("MG Road" exists in many cities → disambiguate using channel region); sarcasm/noise; multiple distinct requests in one message (split into several `Request`s).

**Demo Relevance.** ★★★★☆ Shows the intelligence pipeline working live; pair with Module 1.

---

### Module 3 — Demand Aggregation, De-duplication & Hotspot Detection

**Purpose.** Convert thousands of individual requests into a smaller set of meaningful, quantified **demand clusters (hotspots)** that a planner can act on.

**Inputs.** Stream of structured `Request` objects with embeddings and geo-tags.

**Processing Logic.**
1. **De-duplication** — near-duplicate detection via embedding similarity + geo proximity + category match, so 400 people reporting the same broken drain become one weighted cluster, not 400 noise points.
2. **Clustering** — group requests by semantic similarity within geographic bounds into `DemandCluster`s.
3. **Demand-intensity quantification** — each cluster gets an intensity score weighted by: verified request count, recency, average severity, and estimated affected population.
4. **Hotspot surfacing** — clusters are rendered as a heatmap over administrative geographies.

**Outputs.** `DemandCluster` records `{category, centroid_geo, ward, request_count, demand_intensity, severity_avg, recency}` and a heatmap layer.

**Functional Requirements.**
- **FR-3.1** The system shall de-duplicate semantically and geographically similar requests into single weighted clusters.
- **FR-3.2** The system shall compute a demand-intensity score per cluster from count, recency, severity, and affected population.
- **FR-3.3** The system shall render demand hotspots on a map at ward/district resolution.
- **FR-3.4** The system shall preserve traceability from a cluster back to its constituent requests.

**Google Stack.** Vertex AI Vector Search (similarity), BigQuery (aggregation), Maps Platform (heatmap).

**Edge Cases.** Sparse rural areas (avoid under-weighting genuine low-population need — handled via equity weighting in Module 5); a single citizen spamming (integrity engine, Module 12); seasonal demand spikes.

**Demo Relevance.** ★★★★☆ The hotspot map is the visual anchor of the policymaker view.

---

### Module 4 — Data Fusion Layer

**Purpose.** Marry bottom-up citizen demand with top-down state data — demographics, infrastructure-gap indices, and published budget/investment plans — to create decision-ready `CandidateProject`s. **This is where the "alignment" half of the problem statement is solved.**

**Inputs.** `DemandCluster`s; national demographic dataset; sector infrastructure-index dataset; public budget/investment plan dataset; administrative geo-boundaries.

**Processing Logic.**
1. Normalize all external datasets to common administrative keys (ward/district codes).
2. For each demand cluster, attach: local demographic profile (population, vulnerability indicators), the relevant sector infra-gap index, and the applicable budget line and its remaining headroom.
3. Emit a `CandidateProject` = a proposed intervention with all context needed to score it.

**Outputs.** `CandidateProject` `{cluster_ref, category, ward, demand_intensity, infra_gap_index, demographic_profile, budget_line_ref, budget_headroom, est_cost}`.

**Functional Requirements.**
- **FR-4.1** The system shall join citizen demand with demographic, infra-index, and budget datasets on common administrative keys.
- **FR-4.2** The system shall attach the applicable budget line and remaining headroom to each candidate.
- **FR-4.3** The system shall handle missing/partial external data gracefully with explicit "data unavailable" flags rather than silent zeros.
- **FR-4.4** The fusion shall be reproducible and versioned (which dataset vintage produced which candidate).

**Google Stack.** BigQuery (the fusion warehouse and joins), Cloud Storage (source datasets), Cloud Scheduler (refresh).

**Edge Cases.** Mismatched geographic keys across datasets; stale budget data; districts with demand but no matching budget line (surfaced as an "unfunded gap" — a valuable insight in itself).

**Demo Relevance.** ★★★☆☆ Less visual, but this is the substance judges probe in Q&A. Have the join logic ready to explain.

---

### Module 5 — Explainable Prioritization Engine  *(the BudgetBridge core)*

**Purpose.** Produce a transparent, defensible ranking of candidate projects under real budget constraints — and, crucially, **show the reasoning** so policymakers can trust and defend each recommendation. Black-box ranking loses this track; explainability wins it.

**Inputs.** Set of `CandidateProject`s; active budget constraints; configurable policy weights.

**Processing Logic — the Priority Score.** For each candidate project *p*:

```
PriorityScore(p) =  w1 · DemandIntensity(p)
                  + w2 · InfraGapIndex(p)
                  + w3 · EquityWeight(p)
                  + w4 · BudgetFeasibility(p)
                  + w5 · ImpactPotential(p)
                  − w6 · RedundancyPenalty(p)
```

Where each factor is normalized to [0,1] and independently explainable:
- **DemandIntensity** — how loudly citizens are asking (from Module 3).
- **InfraGapIndex** — how objectively deficient the infrastructure is (from Module 4).
- **EquityWeight** — boosts historically under-served / vulnerable populations, so loud wealthy wards don't crowd out quiet poor ones. *This single factor is a strong fairness story for judges.*
- **BudgetFeasibility** — fit against the available budget line; infeasible projects are flagged, not silently dropped.
- **ImpactPotential** — predicted citizens benefited per unit cost.
- **RedundancyPenalty** — reduces score if a similar project is already funded/in-progress.

Weights `w1…w6` are **policy dials** exposed to the policymaker (with sensible defaults and full transparency about who changed what).

**Explanation generation.** For every ranked project, the engine produces a plain-language rationale (Gemini-generated from the structured factor values), e.g.: *"Ranked #2 (score 0.84): 420 verified requests over 3 months, infra-gap index 0.79 (high), serving a high-vulnerability ward, fits the ₹12Cr sanitation line with ₹9Cr headroom, est. 8,000 beneficiaries. No overlapping funded project."* The narration is generated **from** the numbers, never instead of them — numbers remain the source of truth.

**Outputs.** Ranked `CandidateProject` list, each with score, per-factor breakdown, and human-readable rationale.

**Functional Requirements.**
- **FR-5.1** The system shall compute a composite Priority Score from the six weighted, normalized factors.
- **FR-5.2** The system shall expose each factor's contribution to every score (no opaque totals).
- **FR-5.3** The system shall generate a plain-language rationale for each ranking, derived from the factor values.
- **FR-5.4** The system shall expose policy weights as adjustable dials and re-rank in real time when they change.
- **FR-5.5** The system shall enforce the active budget constraint and flag infeasible candidates rather than hiding them.
- **FR-5.6** The system shall log every weight change and re-rank for audit (who, when, why).
- **FR-5.7** The equity factor shall ensure low-population high-need areas are not systematically out-ranked by high-population low-need ones.

**Google Stack.** BigQuery (factor computation), Cloud Run (scoring service), Gemini (rationale narration), Firestore (weight profiles & audit).

**Edge Cases.** All-equal ties (deterministic tie-break by equity then recency); a policymaker gaming weights (audit trail + guardrail bounds); budget line exhausted mid-session (live feasibility recompute).

**Demo Relevance.** ★★★★★ The live weight-slider re-ranking with visible reasoning is the second showstopper and the answer to "is your AI a black box?"

---

### Module 6 — Project Lifecycle Tracking  *(the Civoix spine, part 1)*

**Purpose.** Once a policymaker approves a recommendation, follow that project from sanction to completion so impact can later be measured. This is the "outbound" half of the loop that most competitors omit entirely.

**Inputs.** Approved `CandidateProject` → becomes a `Project`; field-officer status updates; milestone evidence (photos, dates).

**Processing Logic.**
1. On approval, instantiate a `Project` with a lifecycle state machine: `Sanctioned → Tendered → In-Progress → Completed → Verified`.
2. Field officers advance states via a simple mobile surface, optionally attaching geo-tagged photo evidence to Cloud Storage.
3. Each transition is timestamped and audited; delays are flagged.
4. On reaching `Completed`, an `impact.check_due` event is scheduled (Module 7).

**Outputs.** Live `Project` records with current state, timeline, and evidence; delivery analytics.

**Functional Requirements.**
- **FR-6.1** The system shall create a tracked Project from every approved recommendation.
- **FR-6.2** The system shall maintain an auditable lifecycle state machine with timestamps per transition.
- **FR-6.3** The system shall let field officers update status and attach geo-tagged evidence from a mobile surface.
- **FR-6.4** The system shall flag projects exceeding expected duration per state.
- **FR-6.5** On completion, the system shall trigger an impact-measurement check.

**Google Stack.** Firestore (state + timeline), Cloud Storage (evidence), Cloud Run (lifecycle API), Firebase Auth (officer identity), Cloud Scheduler (delay + impact triggers).

**Edge Cases.** Officer marks complete without evidence (require verification before `Verified`); abandoned/cancelled projects (explicit terminal state); scope changes mid-project.

**Demo Relevance.** ★★★★☆ Enables the before/after story; show a project moving through states.

---

### Module 7 — Impact Measurement & Sentiment-Delta Engine  *(the Civoix spine, part 2)*

**Purpose.** Answer the question the entire track hinges on and everyone else ignores: **did the money actually work?** Measure whether a completed project satisfied its originating demand and improved citizen sentiment.

**Inputs.** Completed `Project`; the originating `DemandCluster`; new/ongoing requests for the same locality/category post-completion; optional targeted citizen follow-up (voice/RCS "is this fixed?").

**Processing Logic — the Impact Score.** For a completed project:

```
ImpactScore =  a1 · DemandSatisfactionRate
             + a2 · SentimentDelta
             + a3 · UtilizationRate
             + a4 · CostEfficiency
             − a5 · TimeOverrunPenalty
```

- **DemandSatisfactionRate** — drop in related requests for that locality/category after completion (e.g. 300 → 12).
- **SentimentDelta** — shift in citizen sentiment (from follow-ups and organic mentions) before vs. after.
- **UtilizationRate** — evidence the asset is actually used (where measurable).
- **CostEfficiency** — beneficiaries reached per rupee vs. estimate.
- **TimeOverrunPenalty** — delivery delay against plan.

**Outputs.** Per-project `ImpactScore` with factor breakdown; portfolio-level DPI impact analytics; a feedback signal that adjusts future prioritization (e.g. de-prioritize interventions that historically under-delivered).

**Functional Requirements.**
- **FR-7.1** The system shall compute a post-completion Impact Score from demand-satisfaction, sentiment-delta, utilization, and cost-efficiency.
- **FR-7.2** The system shall measure sentiment before and after delivery for the affected locality.
- **FR-7.3** The system shall aggregate impact to portfolio level to quantify overall DPI initiative impact.
- **FR-7.4** The system shall feed impact outcomes back into the prioritization engine as a learning signal.
- **FR-7.5** All impact claims shall cite their evidence basis (and label synthetic/demo data as such).

**Google Stack.** BigQuery (longitudinal before/after analysis), Gemini (sentiment + follow-up understanding), Cloud Scheduler (timed re-checks), Cloud Run.

**Edge Cases.** Confounding (demand dropped for unrelated reasons — report correlation honestly, not causation); no post-data yet (mark "impact pending"); negative impact (surface it — hiding failure destroys trust and the audit).

**Demo Relevance.** ★★★★★ The before/after ward comparison is the emotional climax of the pitch and the direct answer to "measure the impact of DPI."

---

### Module 8 — Policymaker Decision Cockpit & Simulation

**Purpose.** Give decision-makers a single cockpit to see demand hotspots, review explainable rankings, run what-if simulations, and approve projects — turning the platform from a report into a planning brain.

**Inputs.** Hotspots, ranked candidates + rationales, budget state, impact history.

**Processing Logic.**
1. Map-centric view of demand hotspots with drill-down to clusters and constituent requests.
2. Ranked recommendation panel with per-factor explanations and adjustable policy weights (Module 5).
3. **Simulation:** "allocate ₹X to sector Y in geography Z" → predicted effect on hotspots and infra-gap indices, with confidence bands (the NeetiSim what-if).
4. One-click approval → hands off to lifecycle (Module 6).

**Outputs.** Interactive dashboard; simulation results; approval events.

**Functional Requirements.**
- **FR-8.1** The system shall present demand hotspots on an interactive map with drill-down to source requests.
- **FR-8.2** The system shall display ranked recommendations with visible factor breakdowns and rationales.
- **FR-8.3** The system shall let policymakers adjust weights and see live re-ranking.
- **FR-8.4** The system shall simulate the projected impact of a hypothetical allocation before approval.
- **FR-8.5** The system shall support one-click approval that initiates project tracking.
- **FR-8.6** All actions shall be role-restricted and audited.

**Google Stack.** Firebase Hosting + Maps Platform (front-end), Cloud Run (APIs), Gemini (simulation narration), BigQuery (simulation model), Identity Platform (roles).

**Edge Cases.** Over-trust in simulation (always show confidence + assumptions); concurrent editors (optimistic locking); accessibility for low-vision officials.

**Demo Relevance.** ★★★★★ This is the screen you present from; it stitches every module into one narrative.

---

### Module 9 — Citizen Feedback & Trust Loop

**Purpose.** Tell citizens their voice led to action. Closing this human loop is what converts a data platform into a trust-building DPG and sustains participation.

**Inputs.** Project state changes; completion + impact events; citizen reference IDs (pseudonymous).

**Processing Logic.**
1. On meaningful milestones (sanctioned, completed), notify affected citizens on their original channel in their original language ("The drainage you reported on MG Road is now completed. Is it working? Press 1 for yes.").
2. Their reply feeds sentiment-delta (Module 7) — the loop literally closes here.
3. A public status page shows locality-level progress transparently.

**Outputs.** Multichannel notifications; citizen confirmation signals; public transparency page.

**Functional Requirements.**
- **FR-9.1** The system shall notify affected citizens of project progress on their original channel and language.
- **FR-9.2** The system shall collect citizen confirmation of resolution and feed it to impact measurement.
- **FR-9.3** The system shall publish a locality-level public progress view.
- **FR-9.4** Notifications shall respect consent and language preference.

**Google Stack.** Dialogflow CX / RCS (outbound voice+chat), Cloud Translation (localized messages), Firestore, Cloud Run.

**Edge Cases.** Citizen changed number; notification fatigue (rate-limit + digest); opt-out handling.

**Demo Relevance.** ★★★★☆ Demonstrates the loop closing back to the human — powerful narrative beat.

---

### Module 10 — Federation & Interoperability Layer  *(the DPG / BRICS scale story)*

**Purpose.** Let each nation run a sovereign node while sharing what's safe to share — a common demand taxonomy and improved predictive models — **without moving raw citizen data across borders.** This is the "across BRICS nations" + "Innovation" hook.

**Inputs.** Local node models & taxonomy; federation registry; peer-node metadata.

**Processing Logic.**
1. A **shared open taxonomy registry** defines common demand categories and data schemas so nodes speak the same language.
2. **Federated model exchange:** nodes share *model improvements / aggregated parameters or embeddings*, never raw records — India's rural-road patterns can sharpen Brazil's predictions with zero raw-data transfer.
3. Open, versioned REST/gRPC APIs and open schemas make the platform interoperable and forkable.

**Outputs.** Cross-node improved models; shared taxonomy; interoperability APIs.

**Functional Requirements.**
- **FR-10.1** The system shall support sovereign per-nation deployment with data residency guaranteed.
- **FR-10.2** The system shall share models/aggregates across nodes without transferring raw citizen data.
- **FR-10.3** The system shall maintain a shared, versioned open taxonomy and data schema.
- **FR-10.4** The system shall expose open, documented interoperability APIs.

**Google Stack.** Vertex AI (model registry/exchange), Cloud Run nodes, published OpenAPI schemas, Cloud Storage (taxonomy artifacts).

**Edge Cases.** Divergent national taxonomies (map to shared core + national extensions); model-poisoning from a bad node (validation + provenance); version skew across nodes.

**Demo Relevance.** ★★★★☆ Present as the architecture/scale slide with the "0 raw records transferred" counter — it's what makes this national-and-beyond, not a toy.

---

### Module 11 — Identity, Access, Governance & Audit

**Purpose.** Ensure every actor is authenticated, every action authorized, and every decision auditable — non-negotiable for a government DPG.

**Processing Logic.** Role-based access (citizen, officer, planner, policymaker, auditor, federation admin); immutable audit log of every classification override, weight change, approval, and status update; exportable open metrics for civil-society oversight.

**Functional Requirements.**
- **FR-11.1** The system shall authenticate all official users and authorize by role.
- **FR-11.2** The system shall maintain an immutable, queryable audit trail of all consequential actions.
- **FR-11.3** The system shall provide auditors read access to decisions, evidence, and metrics.
- **FR-11.4** The system shall export open, anonymized metrics for public accountability.

**Google Stack.** Firebase Auth / Identity Platform, Firestore/BigQuery (audit), Cloud Logging.

**Demo Relevance.** ★★★☆☆ Mention as the trust backbone; show the audit trail if time allows.

---

### Module 12 — Integrity & Anti-Astroturfing Engine

**Purpose.** Guarantee that hotspots reflect *genuine* need, not coordinated manipulation — a sophistication signal that shows the team anticipated failure modes.

**Processing Logic.** Detect coordinated inauthentic demand via patterns (bursty identical submissions, implausible velocity, device/channel anomalies, template-identical text). Suspicious demand is quarantined and weighted down, not silently deleted, and flagged for review.

**Functional Requirements.**
- **FR-12.1** The system shall detect and down-weight coordinated inauthentic request patterns.
- **FR-12.2** The system shall quarantine (not delete) suspicious demand and surface it for human review.
- **FR-12.3** Integrity actions shall be auditable and reversible.

**Google Stack.** BigQuery (pattern analysis), Gemini (template/anomaly detection), Firestore.

**Demo Relevance.** ★★★☆☆ A single slide on this earns credibility in Q&A ("how do you stop it being gamed?").

---

## 5. External Interface Requirements

### 5.1 User Interfaces
- **Citizen voice/IVR:** menu-light, language-first conversational flow; immediate reference ID.
- **Citizen web/status:** minimal, mobile-first, localized; submit + track.
- **Field-officer app:** lifecycle update + photo evidence; works on low-end devices.
- **Policymaker cockpit:** map-centric, explainable rankings, weight dials, simulation.
- **Auditor/open-data portal:** decisions, metrics, exports.

### 5.2 Hardware Interfaces
Feature phones (voice/IVR), smartphones, standard officer/policymaker workstations. No special hardware required.

### 5.3 Software Interfaces (Google-only)
Gemini API, Vertex AI, Cloud Speech-to-Text, Cloud Translation, BigQuery, Firestore, Cloud Storage, Maps Platform, Cloud Run, Firebase (Hosting/Auth), Pub/Sub, Dialogflow CX / RCS, Cloud Scheduler, Cloud Logging.

### 5.4 Communication Interfaces
HTTPS REST + gRPC internally and for federation; async messaging via Pub/Sub; voice/telephony and RCS for citizen channels; all inter-service traffic authenticated and encrypted in transit.

---

## 6. Data Model & Data Requirements

**Core entities.**
- `RawRequest` — channel, raw content, pseudonymous citizen ref, timestamp, coarse geo.
- `Request` — original + translated text, language, category, severity, resolved geo (ward/district), confidence, entities.
- `DemandCluster` — category, centroid, ward, request_count, demand_intensity, severity_avg, recency, constituent request refs.
- `CandidateProject` — cluster ref, category, ward, demand_intensity, infra_gap_index, demographic_profile, budget_line ref, headroom, est_cost.
- `Project` — approved candidate + lifecycle state, timeline, evidence, assigned officer.
- `ImpactRecord` — project ref, impact_score, factor breakdown, evidence basis, data_provenance (real/synthetic).
- `BudgetLine` — sector, geography, allocated, spent, headroom, vintage.
- `PolicyWeightProfile` — weight set, author, timestamp (audited).
- `AuditEvent` — actor, action, target, timestamp, before/after.

**External datasets.** Demographic/census; sector infrastructure indices; public budget/investment plans; administrative geo-boundaries. (Realistic synthetic equivalents for the demo, explicitly labelled.)

**Storage split.** Operational + lifecycle state in **Firestore**; analytics, fusion, longitudinal impact in **BigQuery**; binary evidence/audio in **Cloud Storage**.

---

## 7. Non-Functional Requirements

- **NFR-1 Multilingual:** support diverse languages end-to-end (intake → notification) with no single-language hard-coding.
- **NFR-2 Accessibility:** usable by non-literate, offline, feature-phone citizens; WCAG-aligned official UIs.
- **NFR-3 Scalability:** serverless, horizontally scalable to national request volumes; async pipeline absorbs bursts.
- **NFR-4 Performance:** live demo path (speak → structured on map) target under ~10 seconds; dashboard interactions responsive.
- **NFR-5 Privacy:** edge pseudonymization; data minimization; consent-based notifications; no raw PII in analytics.
- **NFR-6 Security:** RBAC, encryption in transit and at rest, least-privilege service accounts, full audit.
- **NFR-7 Availability:** ingestion resilient to AI-layer downtime via queueing; graceful degradation.
- **NFR-8 Data sovereignty:** raw citizen data never leaves its nation of origin.
- **NFR-9 Interoperability:** open schemas + documented APIs; forkable.
- **NFR-10 Transparency:** every recommendation explainable; open metrics exportable.
- **NFR-11 Maintainability:** modular services, versioned datasets and models, reproducible pipelines.
- **NFR-12 Cost:** runs within Google free tier + trial credit for the hackathon (Gemini Flash, BigQuery free query allowance, Maps India free caps).

---

## 8. Digital Public Good (DPG) Compliance

- **Open source:** released under an OSI-approved licence.
- **Open standards:** open data schemas, OpenAPI-documented interfaces, standard geo formats.
- **Open data:** anonymized, aggregated demand and impact metrics published for public accountability.
- **Privacy & do-no-harm:** pseudonymization, data minimization, consent, auditability, anti-manipulation safeguards, equity weighting to protect the under-served.
- **Platform independence:** while built on Google services for the hackathon, the architecture is expressed in portable patterns (containers, standard APIs) so it is not irreversibly locked.
- **Relevance to SDGs:** supports SDG 9 (infrastructure), SDG 11 (sustainable communities), SDG 16 (accountable institutions).

*Positioning: Civoix is designed to be submittable to the DPG Alliance registry, not merely to invoke the term.*

---

## 9. Federation & BRICS Scale Architecture

Each nation runs a sovereign node (its own data, its own residency). A thin federation fabric shares only (a) a common open **taxonomy/schema** and (b) **model improvements / aggregated parameters** — never raw records. New nations onboard by deploying a node and mapping their local taxonomy to the shared core. This gives the "shared predictive modelling across BRICS nations" the brief asks for while respecting the political reality that no nation will export raw citizen data. The federation is the scale slide, not an MVP requirement — but the architecture makes it credible.

---

## 10. Explainability & Trust Framework

Explainability is treated as a first-class feature, not a nicety, because policymakers must *defend* every allocation publicly:
- Every Priority Score and Impact Score exposes its full factor breakdown.
- Natural-language rationales are generated **from** structured numbers (Gemini narrates; numbers govern).
- Every weight change, override, and approval is audited (who/when/why).
- Failures and negative impacts are surfaced, never hidden.
- Synthetic/demo data is always labelled as such.

This directly answers the inevitable judge question: *"Is your AI just a black box telling governments where to spend?"* — No, and here's the receipt for every number.

---

## 11. Demo Script (Minute-by-Minute) — ~6 minutes

**0:00–0:30 — The gap.** One line: "80% of civic platforms collect complaints. None prove the money worked. We close that loop." Show the loop diagram.

**0:30–1:45 — The voice moment (Module 1+2).** Live: speak a grievance into a phone in Tamil/Hindi/Portuguese. On screen, watch it transcribe → translate → classify → geo-tag → land as a pin on the map in under 10 seconds. (Have a recorded fallback ready.)

**1:45–2:45 — Hotspots (Module 3).** Zoom out: thousands of seeded requests resolve into a clean demand heatmap. Drill into one hotspot → see the constituent requests and demand intensity.

**2:45–4:00 — Explainable prioritization (Module 5+8).** Show the ranked recommendations, each with its factor breakdown and plain-language rationale. Then drag the budget slider from ₹100Cr to ₹50Cr → watch the list re-rank live, reasoning updating in real time. This is the "not a black box" beat.

**4:00–5:00 — The loop closes (Module 6+7+9).** Approve a project → it moves through lifecycle → jump to a completed project's **before/after** ward view: 300 requests → 12, sentiment red → green, Impact Score with its breakdown. Show the citizen getting notified "your drain is fixed."

**5:00–5:45 — Scale & trust (Module 10+12).** One slide: federated BRICS nodes, "0 raw records transferred," shared taxonomy; one line on anti-astroturfing and DPG credentials.

**5:45–6:00 — Close.** "Citizen voice in, proven impact out, every rupee explainable — built entirely on Google, open-sourced as a Digital Public Good, ready to federate across BRICS."

---

## 12. Implementation Roadmap

**Hackathon MVP (build these to win):** Modules 1, 2, 3, 5, 6, 7, 8 — the full loop with the voice moment and explainable re-ranking and the before/after. Modules 4 (fusion) and 9 (notification) in slim form. Modules 10, 11, 12 as architecture + one slide each.

**Phase 2 (post-hackathon):** hardened fusion with real government datasets; full lifecycle/officer app; production notifications.

**Phase 3 (scale):** real federated model exchange across nodes; DPG Alliance submission; pilot with one district.

**Prioritization for the 48 hours:** the two showstoppers (voice-to-map, and slider re-ranking with reasoning) plus the before/after are non-negotiable — they carry 70% of the score. Everything else supports them.

---

## 13. Risks & Mitigations

| Risk | Mitigation |
|---|---|
| Live audio demo fails on stage | Pre-recorded fallback; test on the venue network |
| Judges see "another complaint dashboard" | Lead with the loop + before/after, not the map |
| "Is it a black box?" | Explainability framework (§10) — show every factor |
| "Where's the real data?" | Label synthetic clearly; explain the fusion join honestly |
| Google-only vs. WhatsApp | Flag upfront; use RCS/voice; add adapters only if permitted |
| Federation looks fake | Present as architecture/scale, be explicit about MVP vs. vision |
| Over-claiming impact causality | Report correlation honestly, show confidence bands |
| Free-tier limits during demo | Use Gemini Flash, set budget alerts, pre-warm caches |

---

## 14. Appendices

**A. Priority Score reference** — see Module 5. Weights default to a balanced profile; equity weight non-zero by default to protect under-served areas.

**B. Impact Score reference** — see Module 7. Impact feeds back as a learning signal to prioritization.

**C. Google service → cost posture** — Gemini Flash (free tier), BigQuery (1 TB/mo free), Maps (India ~70k loads/mo free), Cloud Run (2M req/mo free), Firestore/Storage/Firebase (free tiers), $300 trial credit covers Vertex/Speech overage. Net demo cost target: ₹0.

**D. Traceability** — every functional requirement (FR-x.y) maps to exactly one module; every module maps to at least one clause of the problem statement (intake, alignment, or impact-measurement).

**E. Naming** — *Civ* (progress) + *Loop* (the closed feedback cycle). The name is the thesis.

---

*End of SRS v1.0.*
