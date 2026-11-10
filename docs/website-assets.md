# Kohleyed website assets

The storefront reads `assets/website` from Kohleyed Firestore and resolves Storage paths with the Kohleyed Firebase Storage SDK. The existing field names are `logo`, `sale`, `heroVideo`, and `heroPoster`. The logo, sale image, and hero video use the fixed Kohleyed Storage paths `website/kohleyed.png`, `website/sale.png`, and `website/herovideo.mp4`.

`BrandLogo` displays the logo in the desktop and mobile navigation, footer, checkout and payment-return screens. While the image loads, its slot remains reserved; if it fails, no old or text replacement logo is displayed. `Hero` displays the sale image in its existing responsive positions when a hero product is available. The sale badge is hidden if the image cannot load.

`heroPoster` still uses the existing `assets/website` document field. It may be either a Storage path string or an object with `storagePath`. For example:

```json
{
  "logo": { "storagePath": "website/kohleyed.png" },
  "sale": { "storagePath": "website/sale.png" },
  "heroPoster": { "storagePath": "website/your-poster.jpg" }
}
```

The fixed paths take precedence over any matching fields in this document. The hero video plays muted and inline on mobile, with the poster shown when playback is unavailable, reduced motion is requested, or data saver is enabled. `storage.rules` permits public reads of `website/*` and denies client writes there.
