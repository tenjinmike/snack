# ONNA / 온나
A Korean-first link-in-bio product for Instagram creators, individuals, shops, and small brands.
The user selected ONNA / 온나 on 2026-11-07. The production domain is https://onna.life. There is no hospitality-only focus.

## v0.2 implemented
- Responsive editor and mobile profile preview
- Up to 30 HTTPS links with add/remove/reorder
- Three themes; local draft storage
- Google / Facebook / Apple social sign-in UI with live provider availability, PKCE, session refresh and logout
- Authenticated profile storage with owner-enforced PostgreSQL RLS
- Explicit public/private switch, unique slug and /u/:slug public profiles
- No service-role or other private API key in frontend
- Advertising, payment, AI, image upload and analytics are not yet implemented

## Run / build
Node 24+, npm ci, npm test, npm run build.
Serve index.html, styles.css and app.js. app.js is the committed build output; source is in src/.
Vercel rewrite configuration supports /u/:slug.

## Data setup
database/schema.sql documents the schema already applied to the connected Supabase project.
Do not rerun it on an existing initialized database. Use tracked migrations for future changes.

## Before inviting external users
Configure Supabase Site URL and allowed redirects to the actual application origin.
Configure verified custom SMTP; the default sender only supports project-team addresses.
Verify confirmation-email delivery and signup in a real browser. Do not disable email confirmation.
Review content moderation, consent/privacy, abuse controls and account recovery.
Use commercial hosting terms appropriate for launch; the current deployment is an owner-review prototype.

## Validation performed
- Node input-validation tests
- Transaction-rolled-back database tests: owner editing, private-page isolation, public read, cross-owner update denial, spoof denial, unsafe-link rejection, anonymous column restrictions
- Supabase security advisors: no reported issues at this implementation checkpoint
- Real signup-email delivery remains to be verified after email/redirect configuration

See product-strategy.md for advertising, Korean/Japanese market validation and grant preparation.

## Codex continuation verification (2026-11-07)
Adopted the latest Work implementation. Corrected Korean account/status messages and ignored stale profile-load/save responses after account changes. Clearing an expired or signed-out session also clears the previous account profile from the editor.
Browser checks passed for live preview, theme changes, draft reload, login dialog, mobile width, and missing public pages against the live Supabase API. Email delivery and a full real-account signup/login flow remain unverified until SMTP and redirect configuration are completed.

## v0.3 creator landing and free service
A new charcoal/lime landing page leads into the existing editor. Theme cards apply actual editor themes, the username CTA carries the selected slug into the editor, and the editor remains usable without an account. The service is free; there is no pricing tier, checkout or card collection. Demo profiles are labelled examples. Local stock images illustrate fictional profiles and are not endorsements.

Validation for v0.3: six Node tests; browser landing-to-studio slug transfer, template application, draft restoration, social-only dialog, live disabled-provider state, responsive widths 390/768/1024, and public page fallback. Mocked OAuth provider-boundary checks verify Google/Facebook/Apple provider selection, S256 PKCE, same-origin callbacks, and draft preservation. Real provider approval and sign-in remain pending owner console configuration.

## ONNA rebrand
All visible branding is ONNA / 온나. The former browser draft key is retained only as a read fallback so existing drafts survive the rename. Infrastructure IDs, Supabase URL and existing public URLs remain stable. Brand selection does not establish trademark clearance or domain ownership.

## Email authentication
Email/password sign-in, confirmation-based signup, resend confirmation and recovery-session password update are implemented. Passwords are cleared after requests and never stored in drafts. Production redirect URLs are configured. Verified SMTP and Google/Facebook/Apple console credentials remain pending. Eight Node tests and mocked auth controller checks pass; real email delivery and provider sign-in remain unverified.


## Korean login providers
Facebook UI replaced with Naver and Kakao. Kakao uses the built-in provider. Naver is mapped to custom:naver and stays disabled until its custom provider configuration and end-to-end callback are verified; custom provider availability is an explicit deployment flag, not assumed from a displayed button. Provider registration and secrets remain pending owner developer-console sign-in. Contact: ceo@blueit.kr.

## Privacy, account controls and locales (2026-11-07)
Public privacy/terms/rights pages, explicit age 14+ and terms acknowledgement, owner-only server timestamped acknowledgement records, data export and authenticated self-deletion are implemented. External fonts removed. Account deletion revokes sessions then deletes only the identity verified by Auth; no body-supplied owner ID is accepted. Frontend has no admin credentials.
Korean/English/Japanese/Simplified Chinese/Thai UI selector preserves user content. Formal legal documents remain Korean with translated summaries. Overseas processing/subprocessor country and retention disclosures still require operator/vendor confirmation; implementation is not a legal compliance certification. SMTP and Naver/Kakao app approval/credential setup remain separate.
