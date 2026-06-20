# Architecture & Migration Plan: Multi-Page AI-Native Platform

This document outlines the phased migration plan to rebuild the Carbon Footprint Tracker into a multi-page AI-native platform.

## Phase 1 — Foundation
* **Routing & Shell:** Add React Router DOM to `apps/web`. Create a persistent App Shell with navigation and auth state. Create real routes (even if placeholders) for: `/`, `/login`, `/signup`, `/onboarding`, `/dashboard`, `/log`, `/analytics`, `/simulate`, `/squads`, `/leaderboard`, `/coach`, `/offset`, `/badges`, `/profile`, `/settings`, `/impact`, `/developers`.
* **Auth Integration:** Integrate Firebase Auth (Google Sign-In) into the frontend. Update `apps/api` to verify real Firebase Auth tokens.
* **Backend Persistence:** Connect the frontend to the existing `apps/api` to read/write log data to Firestore securely per user, migrating away from local state.
* **Validation:** Ensure everything builds, tests pass, and auth + routing + persistence work end-to-end.

## Phase 2 — Smart capture (the core differentiator)
* **Primary Path (Receipt Scan):** Implement image upload in `/log`. Integrate **Gemini Vision API** (free tier available) to extract line items from receipts/bills and map them to `emissions-engine` categories. Show a confirmation UI before saving.
* **Secondary Path (Guided Flow):** Build a multi-step sequential wizard for manual entry without a receipt.
* **Tertiary Path (CSV):** Implement a CSV upload parser.
* **Cleanup:** Remove the old flat grid as the primary UI, retaining it only as a manual-edit fallback in the confirmation step.
* **Validation:** Verify receipt upload, parse, confirm, and save flow end-to-end.

## Phase 3 — Real, geographically grounded data
* **Grid Intensity API:** Integrate **Electricity Maps API** free tier (or WattTime if Electricity Maps is restricted) to fetch real-time/regional carbon intensity for energy logging based on user's region.
* **Dynamic Energy Factors:** Update the `emissions-engine` and backend to compute energy emissions dynamically using the local grid data instead of static DEFRA/EPA constants.
* **Validation:** Verify energy logs differ based on user region settings end-to-end.

## Phase 4 — Personal carbon budget, forecasting, simulation
* **Onboarding:** Enhance `/onboarding` to capture household size, region, and personal annual budget goal (defaulted to science-based per-capita).
* **Dashboard Burn-down:** Update `/dashboard` to show budget pace ("on track" / "over budget").
* **Simulator Tool:** Implement `/simulate` with interactive sliders that compute projected footprints live using the `emissions-engine`.
* **Validation:** Verify onboard flow sets settings, dashboard reflects budgets, and simulator runs live.

## Phase 5 — Social: squads and dynamic challenges
* **Squads Backend:** Create Firestore collections and API endpoints for squad creation, joining, and squad leaderboards.
* **Squads Frontend:** Implement `/squads` UI.
* **Dynamic Challenges:** Replace static challenges in `/dashboard` with an algorithmic generation based on the user's recent logs (e.g., if beef is frequently logged, suggest a vegetarian day challenge).
* **Validation:** Verify squad actions and challenge dynamic generation end-to-end.

## Phase 6 — Close the loop: AI coach and offsets
* **AI Coach:** Implement `/coach` chat interface using **Gemini API**, specifically grounding the prompt with the user's stored Firestore data and `emissions-engine` factors to prevent hallucinations.
* **Offsets:** Implement `/offset` integrating a sandbox carbon offset provider (e.g., **Patch.io sandbox**) and **Stripe Test Mode** for checkout.
* **Validation:** Verify coach chat responds contextually and offset sandbox checkout completes successfully.

## Phase 7 — Platform layer
* **Public Impact:** Implement `/impact` to pull aggregated, anonymized statistics (total CO2e avoided, total users) from Firestore and display publicly.
* **Developer Portal:** Implement `/developers` with OpenAPI docs for the platform. Add backend webhooks allowing external apps to push data to the user's log.
* **Validation:** Verify public pages are accessible logged out and webhooks can ingest data.

## Phase 8 — Quality, security, CI/CD, submission polish
* **Testing:** Expand unit tests on `emissions-engine` and `api` to meet >=85% coverage. Add Playwright E2E tests for the new multi-page flows.
* **Security:** Verify `zod` input validation across all endpoints. Ensure rate-limiting and no secrets exposed on the client.
* **Documentation:** Write `ARCHITECTURE.md` recording decisions. Update `README.md` with an architecture diagram, SDG 13 framing, and a demo script.
* **Validation:** Verify CI pipeline builds and tests cleanly. Validate the final repository size < 10MB.
