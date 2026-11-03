# Stage set: the integration contract (step 3, for Ani's OK before anything is built)

What changes: the hub stops calling "an ERP". It calls one door, the customer's integration platform, which already owns the ERP connectors (log §16b). Behind that door are three ERP instances, each with its own number series and its own record shape, so the mapping is real. The golden records move to the integration platform's side, and the hub reads them through the same door.

Everything below stays in `apps/erp-stub` (log §17b: extend it, don't add an app). Same deployment, same OIDC check, same ledger rules, same fault switch.

## 1. The three ERPs

| ERP | Regions | Why this split |
|---|---|---|
| ERP-1 | North America (US), Brazil, India | Log §16b. Keeps today's meaning of ERP-1, so no existing BR, US or IN record changes its ERP. |
| ERP-2 | Europe | Keeps today's meaning of ERP-2. |
| ERP-3 | China | New. China was on ERP-1 with a lake copy as its source; it becomes its own instance. |

Names stay generic: no product names, no product field names. The SAP-style names in log §16b (NAME1, STCD1, LAND1) are left out on purpose, because they would identify a real product.

**Number series.** Six digits. The first digit is the ERP and the second is the domain. A person reading a number can tell where it lives, and the three series can never collide.

| ERP | Customers from | Suppliers from |
|---|---|---|
| ERP-1 | 110001 | 150001 |
| ERP-2 | 210001 | 250001 |
| ERP-3 | 310001 | 350001 |

Today's live numbers (26xxx customers, `V-70101` suppliers) and the hub's seeded ones (25002, EU-1034, 12044, 31007, 41003) move to these series when the golden records move (section 4).

## 2. Each ERP's own record shape

The integration layer maps the hub's canonical payload into each shape. The hub never sees these field names. Every field has one consumer.

**ERP-1** (flat, uppercase codes, one address)

| Field | From the payload | Why it exists |
|---|---|---|
| `CUST_NO` / `VEND_NO` | assigned | The number the ERP gives back; customers and suppliers are separate masters |
| `NAME` | legalName, uppercased and cut to 40 | ERP-1 stores names in capitals with a length limit, a real mapping step |
| `TAX_NO` | identity.canonical, digits only | CNPJ, EIN or GSTIN with no punctuation |
| `CTRY` | identity.country | Routing and tax rules |
| `STATE` | main address regionCode | UF or state; required for BR, US and IN |
| `CITY`, `STREET` | main address | Bill-to (customer) or remit-to (supplier) |
| `ACCT_GROUP` | typeCode | Customer type or supplier category |
| `CREATED_ON` | assigned | Shown on the stage-set console |

**ERP-2** (nested camelCase JSON, VAT kept with its country prefix)

| Field | From the payload | Why it exists |
|---|---|---|
| `partnerId` | assigned | The number |
| `kind` | domain | "customer" or "vendor": one master with a kind, unlike ERP-1 |
| `legalName` | legalName, as typed | ERP-2 keeps case and accents |
| `vat` | identity.canonical with the country prefix (`DE512345671`) | The EU VAT form |
| `address { street, houseNumber, postalCode, city, country }` | main address | Postal code is required in Europe |
| `category` | typeCode | Same purpose as ACCT_GROUP |
| `createdAt` | assigned | The console |

**ERP-3** (China: two names, the unified code)

| Field | From the payload | Why it exists |
|---|---|---|
| `code` | assigned | The number. Keys are ASCII so the console and the logs stay readable |
| `nameLocal` | localName | The legal name in Chinese, required for China (the form already requires it) |
| `nameLatin` | legalName | The romanised name used on export documents |
| `uscc` | identity.canonical | The 18-character unified social credit code |
| `city`, `street` | main address | China has no state field in this demo |
| `type` | typeCode | Same purpose |
| `createdAt` | assigned | The console |

## 3. The integration API: the only door

All under `/integration/v1`. Every call carries the app's Vercel OIDC token, verified against Vercel's keys, accepting this project's subjects only (the existing `verify.ts`).

| Call | What it does | Answers |
|---|---|---|
| `POST /integration/v1/partners` with header `Idempotency-Key: <operationKey>` | Body: today's `ErpCreateCommand`. The layer recomputes the payload hash, routes by `payload.destination.region` to ERP-1, ERP-2 or ERP-3, maps the fields, and creates the partner in that ERP's ledger. The header must equal the body's operation key. | 201 `{ erp, number }` created; 200 the same `{ erp, number }` on replay; 409 key reused with a different payload; 422 the ERP refused (definitive); 400 malformed or header mismatch; 401 no valid identity; 503 the fault switch or "not configured" |
| `GET /integration/v1/operations/{key}` | What happened to a key, for reconcile. 404 means not yet, not never. | `{ erp, status, number, reason }` |
| `GET /integration/v1/golden-records?since=<cursor>&limit=<n>` | Golden records changed since the cursor, already cleansed on the customer's side (log §16b: no duplicates in the feed). Paged. | `{ records: [...], next: <cursor> \| null }` |
| `POST /api/demo/faults` | Unchanged: arms the one-shot lost-response fault. Demo only. | as today |

The old routes (`/api/customers`, `/api/suppliers`, `/api/operations/:key`) are removed once the hub uses the new ones, so there is exactly one door.

**Cursor.** It is a timestamp plus golden id, opaque to the hub. It is stable under paging, and "since" means "changed after", so a re-run is safe.

**One golden record in the feed** carries every column the hub's `parties` table holds today. Nothing is added; the shape only moves:
- identity, names, aliases, identifiers, DUNS
- region, country, ERP, ERP number, segment
- type, industry, status, terms, currency, risk
- dates, group, parent and ultimate parent
- addresses
- sources: which ERP record or records it came from, with the load time
- money per region: credit for customers, spend for suppliers

## 4. Where the golden records live

- **In the stage set.** A `golden_records` table holds one document per record, with `updated_at` as the cursor. Its contents are the 37 records seeded into the hub today, renumbered to the series above, with China moved to ERP-3 and its source renamed from `LAKE_CN` to `ERP3_CN`.
- **New partners join the feed.** When the integration layer creates a partner in an ERP, it adds the matching golden record to the feed with `updated_at = now()`. That is the customer's pipeline publishing it, and the next hub load picks it up. In step 4 this replaces today's load, which builds golden records from the hub's own requests.
- **Step 3 keeps the hub filled.** A one-off script copies the feed into the hub, so numbers match on both sides as soon as step 3 ships. Step 4 replaces the script with the Cron load and the hub starts empty.

## 5. What else changes in the hub

- `ERP_BY_REGION`: BR, US and IN go to ERP-1, EU to ERP-2, CN to ERP-3. The contracts enum and the schema check gain ERP-3.
- `erp.server.ts` calls the integration API and nothing else. Its outcome classification is unchanged.
- **The demo request seed is re-run** with the new numbers and ERP-3 for China:
  - `--reset`, then the history, the load and the recent rows.
  - The six live requests are BR and EU, so their payloads and hashes do not change.
- Copy saying "two ERPs" becomes three: the sign-in page, how-it-works and the roadmap. DECISIONS follows in step 5.

## 6. Tests that prove the boundary

- **Ledger rules per ERP:** replay, conflict and rejection. These are the existing tests, run once per ERP.
- **Routing:** each region lands in its ERP, and the number comes from that ERP's series.
- **Mapping:** one payload per ERP produces the expected native record (uppercase and cut for ERP-1, VAT prefix for ERP-2, both names for ERP-3).
- **Rejections at the door:**
  - an `Idempotency-Key` that differs from the body
  - a payload hash that doesn't match the payload
  - a wrong OIDC subject
  - an expired token
- **Feed paging:** a cursor that is stable across pages, and a re-run that returns nothing new.
- **Deployed click-through:**
  - approve a BR, an EU and a CN request on staging and see the numbers in 110001, 210001 and 310001
  - the lost-response replay still returns the same number
  - reconcile by key still works

## What I need from Ani

1. **OK on the three names and the number series** (section 1).
2. **OK on the three record shapes** (section 2). They are deliberately small: each field exists because the mapping or the console uses it.
3. **OK to renumber every golden record now.** That includes Aurora's 25002 and the Vela legacy record's 25010, which the sign-in page and the canned examples mention. Those references get updated in the same step.
