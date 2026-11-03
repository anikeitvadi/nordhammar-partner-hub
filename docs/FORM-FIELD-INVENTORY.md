# The request form: every field, who reads it, and what happens to it (step 10, for Ani's OK before anything is built)

Review log §8: derive the form from the data. Every field below is traced to who reads it after the requester types it:
- the three ERPs, through the integration platform's mapping (`apps/erp-stub/src/features/integration/mapping.ts`)
- the duplicate check
- routing
- finance in the service desk
- the central team on an exception
- the golden record the integration platform publishes back

A field nobody reads is cut. Today's form can ask a Brazilian customer for 26 inputs (with the ship-to); the proposal asks for 13.

## 1. Who reads what today

Read from the code, 2026-11-03. "Shown" means a page displays it; nobody decides anything from it.

| Field (form name) | Today | ERP-1 | ERP-2 | ERP-3 | Duplicate check | Finance's ticket | Central team | Golden record |
|---|---|---|---|---|---|---|---|---|
| Region (`region`) | from the menu | routing | routing | routing | scope | yes | yes | yes |
| Country (`country`) | select, EU only has a choice | `CTRY` | address country | | tax-ID rules | yes | yes | yes |
| Legal name (`legalName`) | required | `NAME` (capitals, 40) | `legalName` | `nameLatin` | name match | yes | yes | yes |
| Tax ID (`taxId`) | required | `TAX_NO` | `vat` | `uscc` | exact match, company key, reservation | yes | yes | yes |
| Legal name in Chinese (`localName`) | required for CN | | | `nameLocal` | | | shown | yes |
| Secondary ID: IE, PAN, state tax ID, company no. (`id_*`) | PAN required for IN, others optional | | | | | | | carried, never read |
| DUNS (`duns`) | optional | | | | | | shown | carried; search matches it |
| Type (`typeCode`) | optional select | `ACCT_GROUP` | `category` | `type` | | | shown | yes |
| Industry (`industry`) | optional select | | | | | | shown | carried, shown on the record |
| Payment terms (`paymentTerms`) | optional, "if known" | | | | | | shown as "finance decides" | carried, shown on the record |
| Bill-to / remit-to: street, number | required street | `STREET` | street, houseNumber | `street` | | | shown | yes |
| Bill-to: complement | optional (BR) | | | | | | shown | carried |
| Bill-to: district / bairro / area | required for BR | | | | | | shown | carried |
| Bill-to: city | required | `CITY` | city | `city` | AI hint only | | shown | yes |
| Bill-to: state / UF / province | required for BR, US, IN | `STATE` | | | | | shown | carried |
| Bill-to: postal code (CEP, ZIP, PIN) | optional | | `postalCode` | | | | shown | carried |
| Ship-to address (7 more fields) | optional, "+ Add" | | | | | | shown | carried |
| Contact name, email | optional | | | | | | shown | not carried |
| Reason (`reasonText`) | required | | | | | **not sent** | shown on exceptions | |
| Quote / PO reference (`reasonReference`) | optional | | | | | not sent | shown | |
| Duplicate choice, reason, linked record (`dupChoice`, `dupReason`, `linkedGoldenId`) | set by the check, reason typed when "not related" | | | | the override makes an exception | | shown with the match | |

Five findings the table makes visible:
1. **Finance never sees why.** The ticket the hub opens carries the name, tax ID and country only. Finance approves a new partner without the reason or a contact at the customer. A ticket raised in the desk first does carry the reason.
2. **Four fields have no reader at all:** industry, payment terms, ship-to and the PO reference. Each is typed, hashed, approved and stored, then only displayed. Payment terms are finance's to set in the ERP, as the review page itself says.
3. **PAN is derivable.** An Indian GSTIN contains the PAN (characters 3 to 12), so asking for it again is retyping, the exact pain the brief starts from.
4. **The ERP mapping drops what a real ERP keeps.** ERP-1 holds no postal code and no district, and that is the ERP for Brazil, the US and India. A Brazilian invoice needs the CEP and the bairro. This is the stand-in's gap, not the form's.
5. **"Every field the ERP needs" is not a real check.** `clean.server.ts` hard-codes `missingFields: []`. It holds only because `buildPayload` already refuses an incomplete request. Since step 6, every automatic approval lists a check that cannot fail.

## 2. The proposal

**Step 1, identity.** Region comes from the menu; the country is asked only in the EU. The legal name, the tax ID, and for China the legal name in Chinese. The duplicate check runs on its own once both are filled in (debounced, about half a second after typing stops). Its result is one line under the tax ID:
- "No match in any region you can see."
- "Exists: Aurora Industrial Ltda, ERP-1 110001. Open it."
- the match and its choice, as today

There is no "Check the hub" button and no "Continue" button. Step 2 opens as soon as the check allows it.

**Step 2, only what someone reads.**

| Field | Verdict | Who reads it, and why that is enough |
|---|---|---|
| Type (customer type or supplier category) | **Keep, now required** | Every ERP files the partner under it (`ACCT_GROUP`, `category`, `type`). A real ERP will not create a partner without an account group |
| Bill-to / remit-to address, local format | **Keep**; postal code becomes required for BR (CEP), US (ZIP) and IN (PIN); bairro stays required for BR | The ERPs. ERP-1's mapping gains `POSTAL` and `DISTRICT`, because an invoice needs them (finding 4) |
| Complement | **Keep, optional** | Folded into ERP-1's `STREET` line ("Rua X 455, sala 3"); today it is dropped |
| Reason | **Keep, required**; now sent to finance's ticket | Finance, before approving; the central team, on an exception |
| Contact at the customer (name, email) | **Keep, optional**; now sent to finance's ticket | Finance asks the customer for statements or a credit application before setting credit; today it would have to go back to the requester to find out whom to ask |
| Industry | **Cut** | Nobody reads it. If the customer's MDM enriches records (D&B, a registry), industry arrives on the golden record from there, not from a salesperson's guess |
| Payment terms | **Cut** | Finance sets terms in the ERP; the form even says "finance decides" |
| DUNS | **Cut** from the form | No ERP or check reads it. It arrives with enrichment on the golden record, where search still matches it |
| Secondary IDs | **Cut**: PAN derived from the GSTIN; IE, state tax ID and company number dropped | No reader. IE matters for Brazilian invoicing; it joins ERP-1's mapping, with the form field, the day the mapping needs it |
| Ship-to | **Cut** | No ERP mapping reads it. It returns with the first mapping that keeps ship-to partners |
| Quote / PO reference | **Cut** | Nobody reads it; if it matters, it belongs in the reason sentence finance reads |

Result for a Brazilian customer, in two steps:
- Step 1: legal name, CNPJ.
- Step 2: type, then CEP, street, number, complement, bairro, city and UF, then the reason, the contact name and the contact email.

**The "every field" check becomes real.** It moves to `cleanCheck`'s facts, which are gathered from the stored payload against the same per-region list the form uses. A ticket raised in the desk is held to the same list.

**Submit copy** (log §8 point 5): "Goes to finance in the service desk; a ticket opens. If every check passes, the ERP number is assigned without anyone here touching it."

## 3. What it touches

| Piece | Change |
|---|---|
| The form (`intake-form.client.tsx`) | Fields above; the automatic check; no buttons in step 1; copy |
| `buildPayload` | Required type and postal code; the cut fields are no longer read from the form |
| The canonical payload | **Option A (my recommendation): the shape stays.** Cut fields are sent as `null`, so `schemaVersion` stays 2, every hash and replay stays valid, and the stand-in's door does not change. **Option B:** a version 3 without them. The stand-in then accepts both versions until the last version-2 run finishes, and both projects deploy in order, as in step 3 |
| ERP-1 mapping (stand-in) | Adds `POSTAL` and `DISTRICT`; the complement joins `STREET`. Additive; deployed first |
| Finance's ticket | The hub sends the reason and the contact; the desk shows them. Additive on both sides |
| The clean check | `missingFields` computed for real |
| The review and record pages | Rows for cut fields hidden when empty. Seeded records keep theirs, because those came from the ERPs |
| The registry prefill (log §8 point 3) | **Not in this step unless you say so.** A CNPJ lookup that fills the name and address would be a fifth stand-in system (a registry), with fixtures. It is a strong demo moment, but it is another pretend system to explain |

## 4. Tests that prove it

- **Unit:**
  - `buildPayload` per region: required and optional exactly as the table; the cut fields always null.
  - The missing-field check, per region, including a desk ticket without a postal code.
  - ERP-1's mapping with postal code, district and complement.
  - The PAN derived from a GSTIN.
- **Deployed click-through:**
  - a Brazilian customer typed in two steps, with no button pressed before step 2
  - the ticket shows the reason and the contact
  - ERP-1's record has the postal code and the bairro
  - an EU supplier
  - a desk ticket missing a postal code, which becomes an exception named "missing: postal code" instead of passing

## What I need from Ani

1. **OK on the verdicts in §2,** field by field. Each cut is reversible: the column returns the day a reader exists.
2. **Option A or B** for the payload (§3). I recommend A now and B as a named follow-up, because B touches every in-flight run's replay for no visible gain this week.
3. **The registry prefill: yes or not now.** I lean "not now".
