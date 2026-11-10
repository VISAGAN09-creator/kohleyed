# Kohleyed migration and deployment

Kohleyed uses Firebase project `kohleyed-a8060`. Vite/React reads the catalog and website assets from Kohleyed Firestore and Storage. Express handles payments and admin operations; Firebase Functions exports it as `api`. Admin access uses Firebase Authentication and a server-verified `admin` custom claim. Customer carts are stored under `kohleyed.cart` on the current origin.

## Local setup

The ignored `.env` supplies the Kohleyed Firebase web config, Admin SDK credentials and Razorpay credentials. Run `npm ci`, `npm ci --prefix functions`, `npm test`, and `npm run build`. For local development run `npm run dev:all` and open `/kohleyed/`. On PowerShell use `npm.cmd` if script execution blocks `npm`.

The public build variables are `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, `VITE_FIREBASE_PROJECT_ID`, `VITE_FIREBASE_STORAGE_BUCKET`, `VITE_FIREBASE_MESSAGING_SENDER_ID`, and `VITE_FIREBASE_APP_ID`; measurement ID is optional. The backend uses `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY` locally, and Kohleyed Functions credentials in production. Payment uses `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, and `RAZORPAY_WEBHOOK_SECRET`. Email uses `GMAIL_USER` and `GMAIL_APP_PASSWORD`. Optional public contact variables are `VITE_CONTACT_EMAIL`, `VITE_CONTACT_PHONE`, and `VITE_INSTAGRAM_URL`; `SUPPORT_EMAIL` is optional for order emails. `CORS_ALLOWED_ORIGINS` controls cross-origin access. No private key or Razorpay secret belongs in a `VITE_*` variable.

## Firebase and GitHub Actions

The intended existing Kohleyed Auth account was verified by UID and email, granted `admin: true`, and read back successfully. The account must sign in again to refresh its ID token. Browser and backend dashboard access still require a live sign-in check.

The `main` push workflow builds the site, deploys the Kohleyed `api` function, Firestore rules and Storage rules, then deploys Hosting to `kohleyed-a8060`. PRs build and create a Hosting preview. Hosting serves `dist`, with built files under `dist/kohleyed`; API rewrites precede the SPA rewrite. Required GitHub secrets are `FIREBASE_SERVICE_ACCOUNT_KOHLEYED_A8060`, `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, `VITE_FIREBASE_STORAGE_BUCKET`, `VITE_FIREBASE_MESSAGING_SENDER_ID`, and `VITE_FIREBASE_APP_ID`; `VITE_FIREBASE_MEASUREMENT_ID` is optional. GitHub supplies `GITHUB_TOKEN`. Optional contact values are GitHub variables with the names above. Verify the service account belongs to Kohleyed and can deploy Hosting, Functions, Firestore rules and Storage rules. The workflow does not upload local `.env`.

Set the five Functions secrets declared in `functions/index.js` in the Kohleyed Firebase project. Enable Authentication, Firestore and Storage if needed. Grant the existing intended Kohleyed Auth user an `admin` custom claim using `tools/set-admin-claim.cjs <UID> <expected-email> --apply`; omit `--apply` for a read-only identity/claim check. The script checks that UID and email match before changing claims. This script uses only Kohleyed `.env` credentials and preserves unrelated claims. The copied `firestore-upload/serviceAccountKey.json` belongs to the original project and must not be used for Kohleyed. Sign in again after the claim is granted to refresh the ID token. The storefront resolves its logo from `website/kohleyed.png` and sale image from `website/sale.png` in Kohleyed Storage. `assets/website` retains optional `heroVideo` and `heroPoster` paths. Populate the new catalog through the admin interface. Do not import the copied `firestore-upload/products.json` data.

## Payments and parent domain

The existing Razorpay integration may share an account, with credentials in the same Dashboard mode. Kohleyed creates and verifies orders through its own API and stores records in Kohleyed Firestore. Register a separate Kohleyed webhook endpoint at the actual Kohleyed Hosting domain plus `/api/razorpay-webhook`, using its configured `RAZORPAY_WEBHOOK_SECRET`. Leave the original store's webhook unchanged. A real test payment is required after deployment to verify end-to-end operation.

The parent Handle Vercel project is not in this repository. After obtaining the actual Kohleyed Hosting domain, add `/kohleyed` and `/kohleyed/*` rewrites that preserve the `/kohleyed` asset and API paths. Keep `/kohleyed` untouched. Confirm brand assets, contact values, and legal copy before publication. No deployment has been performed by this migration.

