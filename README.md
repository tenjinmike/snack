# BlueIT Link Platform (working title)

A Korean/Japanese small-business landing-page and customer-conversion product.
Brand and domain are undecided.

## Current implementation
- Dependency-free browser prototype: open `index.html`.
- Edit a business name, introduction, and up to three HTTPS links.
- Live preview, browser-local draft saving, JSON export.
- This prototype has no accounts, cloud database, public-page publishing, AI, analytics, billing, or advertising integration yet.
- Local saves are device/browser-specific. Do not enter confidential customer data.
- No paid services or ad network have been activated.

## Development sequence
1. Validate the page editor and first pilot sector.
2. Add Supabase authentication, tenant ownership policies, page/link storage, and public slugs.
3. Implement consent-aware visit/click events and independently verifiable conversion tracking.
4. Validate Korean/Japanese content and merchant willingness to pay.
5. Add metered AI assistance and subscription billing after unit-economics review.
6. Test optional advertising separately from the merchant's primary conversion path.

## Business design
See [product-strategy.md](product-strategy.md).
All targets in that document are hypotheses, not customer traction or achieved performance.

## Security
Never commit passwords, private keys, service-role keys, real customer records, or environment files.
This repository is currently public.
