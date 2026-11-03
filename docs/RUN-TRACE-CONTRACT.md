# Run trace and live model switch (step 7, for Ani's OK before anything is built)

What changes: every request page gets a **Run** panel that answers the brief's two questions, "what did this cost" and "where was the time spent", from the Workflow's own record of the run. A demo control switches the model the hub uses, live, and a fallback shows up in that panel as it happens. Decided in review log §15.

## 1. The Run panel, on the request page

One panel, under the timeline, for everyone who can see the request. Rows come from the run's event log in Vercel Workflow (`world.events.list` for the request's run id), not from the hub's own events, so the panel shows what the platform recorded.

| Row | Source | Why |
|---|---|---|
| Each step: name, start, duration, attempts, outcome | `step_created`, `step_started`, `step_retrying`, `step_completed` or `step_failed`, named with `parseStepName` and mapped to plain words ("opened the finance ticket", "checked the request again", "sent to the ERP") | Where the working time went, and which step retried |
| Each wait: on finance, on the central team | `hook_created` to `hook_received` for the `finance:` and `review:` hooks | Where the waiting time went. Paused runs cost nothing, and the panel says so next to the wait |
| ERP attempts | The `sent to the ERP` step's attempts, with the hub's recorded reason for each (503, timeout, replayed) | Shows the lost-response retry and the backoff |
| Before submit: the duplicate check | `hub_checks` for this request: route, model asked for, model that served it, every model tried, tokens, cost, latency | The only model call on the request happens in the form, before the run starts |
| Totals | Submitted to number; of which waiting on people; of which working | The one line a customer reads |
| Cost of this request | Model cost (**measured**, from the Gateway's cost field) + Workflow events × $0.02 per 1,000 (**computed** at the on-demand list price, https://vercel.com/docs/workflows/pricing) | "What it cost", with each number labelled |

Two things the panel does not price, and says so in one line: function compute (billed as Active CPU across the project, not attributable to one run from inside the app) and Workflow data written and retained (shown per run in the Vercel dashboard, not exposed to the app).

**When the run record is gone.** Run payloads are kept 7 days on Pro; the panel reads metadata only (`resolveData: 'none'`), which is kept longer. If the read fails or the run predates the record, the panel says "the platform's run record is not available" and the timeline above stays the truth. Seeded requests have no run and show that line.

**First thing built, before the panel:** a check that `getWorld()` answers from a page on the deployed app with the project's own identity. If it does not, I stop and report, rather than rebuild the trace from the hub's events and call it the platform's.

## 2. The model switch

A Vercel Flag, `ai-model`, flipped from the Toolbar by team members, read on the server where the model is called: the form's duplicate check and Ask. It never changes who may do what, and zero data retention stays on for every option.

| Option | Primary | Fallback | What the room sees |
|---|---|---|---|
| As configured (default) | `AI_PRIMARY_MODEL` (the virtual model on staging, served by gpt-4.1-mini) | set on the Gateway | Today's behaviour |
| Haiku first | `anthropic/claude-haiku-4.5` | `openai/gpt-4.1-mini` | A real fallback: the team's free Gateway credits refuse Haiku, so every call falls back. Measured today: `modelAttempts` lists Haiku `success: false`, then gpt-4.1-mini |
| gpt-5-mini | `openai/gpt-5-mini` | `openai/gpt-4.1-mini` | A different, larger model, no redeploy |
| Gemini 2.5 Flash Lite | `google/gemini-2.5-flash-lite` | `openai/gpt-4.1-mini` | A different provider, no redeploy |

Probed today under zero data retention: gpt-4.1-mini, gpt-4.1-nano, gpt-5-mini and gemini-2.5-flash-lite answer; Haiku 4.5 is refused on the free tier.

**An option ships only if it passes the live eval** (E03, E09, E10, E11, three runs each) on that model. A model that fails a case is left out, and the result goes in DECISIONS §6. The validator applies to every model either way, so a weaker model can make a proposal "unsure" but never wrong in a way that reaches the ERP.

The production way to change models is still the virtual model's settings on the Gateway; the flag is the demo's way to show it without a dashboard.

## 3. Data model change (the reason for this note)

`hub_checks` gains two nullable columns:

| Column | Why |
|---|---|
| `ai_attempts jsonb` | Every model the Gateway tried for this proposal, in order, with success. It is the evidence of a fallback on the request, which is the point of the switch |
| `ai_ms int` | How long the proposal took, for "where was the time spent" before submit |

Additive; existing rows read as "not recorded". Nothing else in the schema changes. Ask's answers are not stored, so its details toggle gains the tried models and latency without a table.

## 4. Tests

- **Unit:** the trace builder from a fixture event list (step durations, a retried step, both waits, the totals, the event-based cost); the attempts extractor from a recorded Gateway `routing` block; the flag's options resolving to a model and fallback.
- **Live eval:** the four undecidable cases, 3 runs each, per switchable model.
- **Deployed click-through:** a clean request and an exception, each with the panel read against the Workflow dashboard's run view; the lost-response request shows two ERP attempts; with "Haiku first", a new check shows the fallback in the form, on the request's panel and in Ask's details.

## What I need from Ani

1. **OK on the panel's content and that everyone who can see the request sees it.** The alternative is central team only; I lean to everyone, because the requester asking "why did this take two days" is the panel's best answer ("waiting on finance: 1 day 22 h").
2. **OK on the four options,** and on the rule that only models passing the eval ship.
3. **OK on the two columns.**
