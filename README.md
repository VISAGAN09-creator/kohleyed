# Kohleyed

Kohleyed is a Vite/React storefront with a Firestore catalog, Firebase Storage website and product assets, an Express payment/admin API deployed as a Firebase Cloud Function, and Razorpay Checkout. The independent Firebase project is `kohleyed-a8060`.

The storefront retains the copied site's navigation, catalog, cart, checkout, order return flow and admin portal. Firebase Auth with an `admin` custom claim protects privileged API routes; customer checkout is anonymous. The Kohleyed catalog, Auth users, orders and assets must be created in its own Firebase project.

See [migration and deployment](docs/kohleyed-migration.md) for required environment variable names, local setup, GitHub Actions, Functions secrets, the Razorpay webhook and remaining manual setup. See [architecture](docs/architecture.md) and [website assets](docs/website-assets.md) for underlying implementation details; older sections in those documents describe the copied source site and are marked as historical.

Local checks: `npm ci`, `npm ci --prefix functions`, `npm test`, and `npm run build`. On Windows PowerShell, use `npm.cmd` if script execution blocks `npm`. Local development: `npm run dev:all`, then visit `/kohleyed/`.
