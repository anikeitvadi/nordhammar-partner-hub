# Ask: a typed query spec instead of three fixed reports (step 11)

> As built: written before step 11 was built and agreed then; where it and the code differ, the code and DECISIONS.md are current; the `partner` filter was added after (noted below). References to “log §n” point to the review log kept privately during the build; what it decided is in DECISIONS.md.

What changes: Ask today has six tools. Three are lookups of one record (does a group exist, where is a request, why was it flagged) and stay. Three are fixed reports (on hold, intake this month, exposure by group) that answer exactly one question each. They become **one tool, `queryHub`, whose argument is a typed query spec**. The model chooses each part from closed lists; code checks the spec against what the hub has and what the person may see, then runs it from fixed SQL fragments. The model never writes SQL. It never sees a row the pages would not show. Review log §9: real NLQ without text-to-SQL.

## 1. The spec

Every value is from a closed list except two names the code matches: `group` (a group or ultimate parent) and `partner` (one company).

| Part | Values | Why it exists |
|---|---|---|
| `subject` | `partners` (golden records), `requests`, `checks` (the on-entry duplicate checks) | The three things the hub holds |
| `measure` | partners: `count`, `credit_limit` (customers), `spend_ytd` (suppliers). requests: `count`, `median_hours_to_number`. checks: `count`, `stopped_at_entry` | What a person asks about each |
| `filters.region` | any of BR, EU, US, IN, CN | Narrowing; always intersected with the person's regions |
| `filters.domain` | customer, supplier | |
| `filters.status` | partners: active, hold, inactive | "On hold" |
| `filters.erp` | ERP-1, ERP-2, ERP-3 | "In which ERP" |
| `filters.type` | the customer types and supplier categories | |
| `filters.risk` | A, B, C, D | Finance's review grade |
| `filters.state` | requests: the state names (with finance, exception, created, declined, stopped, …) | |
| `filters.source` | requests: hub form, service desk | Which way in |
| `filters.approval` | requests: automatic, central team | Since the service desk |
| `filters.route` | checks: exact match here, exact match elsewhere, same company, name match, clear | |
| `filters.group` | a group or ultimate-parent name, as typed | Matched by code (case-insensitive, contains) against group names and ultimate parents; the group's members are counted or summed. The matched names are echoed back |
| `filters.partner` | one company's legal name, as typed (added 2026-11-03, approved by Ani) | Matched by code (case-insensitive, contains) against the company's own legal and local name; only that company's own record is counted or summed, never the companies under it. Echoed back by name |
| `time` | `this_month`, `last_30_days`, `last_90_days`, `this_year`, `all_time` | Partners by when they joined, requests by when they were submitted, checks by when they ran |
| `groupBy` | partners: region, erp, status, type, domain, ultimate_parent, currency. requests: region, state, domain, source, approval, month. checks: region, route, month | At most one dimension, so every answer is a number, a bar chart or a line |
| `limit` | 1 to 20, default 10 | |

## 2. What code does with it

1. **Checks the combination.** A table lists, per subject, the measures, filters and group-bys that make sense. `credit_limit` is customers only; `spend_ytd` is suppliers only; `median_hours_to_number` counts created requests only; `month` is not a partner dimension. A combination outside the table is refused with one sentence the model must say, e.g. "I can count partners by region, ERP, status, type, domain or ultimate parent". It is never approximated.
2. **Applies scope.**
   - Region filters are intersected with the person's visible regions.
   - Amounts are intersected with their money regions. With none, the answer is the existing note ("not entitled to amounts"), not a number.
   - Grouping by ultimate parent shows a group only if it has a member in a visible region, and sums only visible rows.
   - Partner names other than a group's never appear in an aggregate answer, except a company the person named themselves (`partner`); listing records is what search is for.
   - A named company that exists only in regions the person cannot see gets its name and region and no figure, the same as the presence lookup: "Aurora Nordic AB is a partner in EU, outside the regions you can see." One that is visible but outside the person's amount regions gets the same sentence for amounts.
3. **Runs it.** One parameterised query is built from fixed fragments, one per allowed part. No string from the model reaches SQL except the two names, as bound parameters.
4. **Says what ran.** Code, not the model, writes the query in words under the answer: "Partners on hold, by region, all time, in BR, EU (your regions)". A wrong reading by the model shows up there.

## 3. How an answer looks

The shape decides it, in code:

| Shape | Shown as |
|---|---|
| No `groupBy` | One big number, with its unit (partners, BRL, hours) |
| `groupBy: month` | A small line of the months, with values |
| Any other `groupBy`, 8 groups or fewer | Horizontal bars |
| More than 8 groups | A table, sorted by value |

Every answer has three more parts:
- The model's one sentence, checked against the result as today, streamed as in step 8.
- A link to the records where one exists, for example on-hold partners in BR → `/customers?region=BR&status=hold`. The Customers table keeps its filter in browser state today, so this step adds reading `region`, `status` and `erp` from the URL as its starting filter.
- The query in words (§2.4).

Charts are plain HTML and CSS bars, in the app's own tokens and in light and dark: no chart library for four shapes.

**Money is never summed across currencies.** Each currency is its own series, as the exposure tile does today.

## 4. Suggested questions come from the data

The chips under the box are built by code from what the person can see, at page load:
- the group with the most members in their regions
- a region with partners on hold
- this month's request states
- for a money-entitled person, the largest exposure

A person with no holds in their regions is never offered "who is on hold".

## 5. What stays out, on purpose

- Free text in SQL, and any join not in the table.
- Listing individual partners. That is search, with its own authorization and its own page.
- Two group-bys at once ("by region and by ERP"): refused with a sentence. Add it the day someone needs it.
- Writes. No tool writes, as today.

## 6. Tests that prove it

- **Unit:**
  - Spec validation, per subject: every allowed combination builds; each refused one gives its sentence.
  - The SQL builder: only fixed fragments plus parameters, and the region parameter is always the intersection.
  - Scope: Ana's BR-only view of a two-region group sums BR only; a person with no money regions gets the note.
  - The chart choice per shape.
- **Live eval (Ask), extended:**
  - each of today's reporting questions now graded on the spec it produces (subject, measure, filters, group-by)
  - "Partners on hold by ERP", "requests created by month this year", "how many duplicate checks stopped someone this month"
  - an unsupported question ("spend by industry"): the refusal
  - the two existing leakage cases
  - an injected instruction to group by tax ID
  - Graded in code, 3 runs each, on gpt-4.1-mini.
- **Deployed click-through:** Ana and Priya ask the same question and get different, correctly scoped answers. Each of the four shapes renders. The query-in-words line matches the spec.

## 7. Data model

None. No tables or columns change. The tool list changes from 6 to 4. The eval fixtures change with it.

## What I need from Ani

1. **OK on the spec (§1) and the refusal rule (§2.1).** The lists are deliberately short; each value exists because a question in the review log or the brief asks for it.
2. **Plain HTML charts** (my recommendation), not a chart library, for four shapes.
3. **The name.** The review log has "Ask the hub" as open: "Ask", "Insights", or folded into the ⌘K bar. I lean **"Ask"**: short, says what you do, and the page title can carry the rest.

## Change, 2026-11-03: one company is not a group

Found on the step 11 canary. "What is the credit limit of Aurora Nordic AB?" had only `group` to say "Aurora Nordic AB", and Aurora Nordic AB is the ultimate parent of two Brazilian companies. The answer was their total (R$650,000) under Nordic's name; Ana, who may not see EU, was told it was Nordic's limit. Nordic's own limit is SEK 900,000, in EU.

- `partner` is one company's own record. `group` is a group or a parent and everything under it, as approved.
- The model is told: a company's legal name ("the limit of Aurora Nordic AB") is `partner`; a group, a parent "and its subsidiaries", or "exposure to the X group" is `group`.
- A07 now grades the returned figure, not only the spec, and a new case asks it as Ana.
