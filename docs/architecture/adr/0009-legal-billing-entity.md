# ADR-0009 — Legal entity & billing

- Status: **proposed** (decision by Jean Balin)
- Date: 2026-11-10
- **Business decision owned by the maintainer — this ADR is a question skeleton only; no option is recommended and nothing here is legal or tax advice.**

## Context
Needed before paid tiers (Team Cloud / partner-hosted), app-store publishing, and contracts with public-sector customers. Open source MIT core is unaffected.

## Questions
1. Which legal entity (or none yet: individual/sole proprietor)? Who owns trademark, domain, signing keys, store accounts?
2. Which country of incorporation/residence (home country, OHADA zone, Nigeria, Kenya, EU/France, Delaware, Mauritius/Rwanda hubs)? Tax, data-protection (NDPR, Kenya DPA, GDPR, Senegal law 2008-12) implications.
3. Who is the merchant of record? Own entity vs MoR (Paddle, Lemon Squeezy, etc.) handling VAT/sales tax.
4. Currencies to price and bill: XOF (CFA), NGN, KES, EUR, USD; FX risk, pricing parity, local-currency invoices.
5. Payment rails: cards (Stripe availability by country), **mobile money** (Orange Money, MTN MoMo, M-Pesa, Wave), bank transfer/invoice for governments, aggregators (Flutterwave, Paystack, CinetPay, PawaPay…). Fees, settlement currency, repatriation.
6. Invoicing/compliance: e-invoicing mandates, withholding tax, purchase-order flow for public buyers.
7. Funding/governance: foundation/association for the OSS project vs commercial entity (open-core boundaries), sponsorship (GitHub Sponsors, Open Collective), grants.
8. Store accounts (Apple/Google/Huawei developer fees, D-U-N-S) and which entity holds them (ties to ADR-0008).

## Options (unranked)
| Option | Notes |
|---|---|
| Single commercial entity in one country | simplest; local-currency access limited |
| OSS foundation/association + commercial subsidiary | clear MIT stewardship; more setup |
| Partner/reseller-led billing in each country | local rails, partner margin; contract overhead |
| MoR platform for global cards + local aggregator for mobile money | faster launch; fees |
| Defer: donations/sponsorship only until traction | zero legal overhead now |

## Decision
_pending — to be decided by Jean Balin (business)._

## Consequences
Blocks: paid-tier launch, store publishing under an entity, public-sector contracts. Does not block S0–S2 engineering.
