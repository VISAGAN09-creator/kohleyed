# Kohleyed website assets

The storefront reads `assets/website` from Kohleyed Firestore and resolves Storage paths with the Kohleyed Firebase Storage SDK. The existing field names are `logo`, `sale`, `heroVideo`, and `heroPoster`. For this brand, the logo and sale paths are fixed in the asset loader to the already supplied objects `website/kohleyed.png` and `website/sale.png`. A stale copied Firestore value cannot redirect either asset to the original brand.

`BrandLogo` displays the logo in the desktop and mobile navigation, footer, checkout and payment-return screens. While the image loads, its slot remains reserved; if it fails, no old or text replacement logo is displayed. `Hero` displays the sale image in its existing responsive positions when a hero product is available. The sale badge is hidden if the image cannot load.

`heroVideo` and `heroPoster` still use the existing `assets/website` document fields. Each may be either a Storage path string or an object with `storagePath`. For example:

```json
{
  "logo": { "storagePath": "website/kohleyed.png" },
  "sale": { "storagePath": "website/sale.png" },
  "heroVideo": { "storagePath": "website/your-hero.mp4" },
  "heroPoster": { "storagePath": "website/your-poster.jpg" }
}
```

The first two fields may be kept for compatibility but the loader uses the known Kohleyed paths. Supply the actual hero paths only if those assets exist; do not use copied source-store hero media. `storage.rules` permits public reads of `website/*` and denies client writes there. No Storage object or Firestore document is modified by this local change.
