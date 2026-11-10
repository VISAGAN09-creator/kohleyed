const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const ts = require('typescript');

function loadSitePaths() {
  const filename = path.join(__dirname, '..', 'src', 'utils', 'sitePaths.ts');
  const source = fs.readFileSync(filename, 'utf8').replace('import.meta.env.BASE_URL', "'/kohleyed'");
  const output = ts.transpileModule(source, {
    compilerOptions: {
      target: ts.ScriptTarget.ES2020,
      module: ts.ModuleKind.CommonJS,
    },
  }).outputText;
  const module = { exports: {} };
  new Function('exports', 'require', 'module', '__filename', '__dirname', output)(
    module.exports,
    require,
    module,
    filename,
    path.dirname(filename),
  );
  return module.exports;
}

const { createSitePaths, mainWebsitePath, mainWebsiteSectionPath, policyPagePath } = loadSitePaths();

test('builds main-storefront fragment URLs without a slash before the hash', () => {
  const paths = createSitePaths('/kohleyed');

  assert.equal(paths.mainWebsitePath, '/kohleyed');
  assert.equal(paths.mainWebsiteSectionPath('#hero'), '/kohleyed#hero');
  assert.equal(paths.mainWebsiteSectionPath('collections'), '/kohleyed#collections');
  assert.notEqual(paths.mainWebsiteSectionPath('#products'), '/kohleyed/#products');
  assert.equal(mainWebsitePath, '/kohleyed');
  assert.equal(mainWebsiteSectionPath('#hero'), '/kohleyed#hero');
  assert.equal(policyPagePath('terms-and-conditions'), '/kohleyed/terms-and-conditions');
});

test('keeps policy page routes under the storefront base path', () => {
  const { policyPagePath } = createSitePaths('/kohleyed');

  assert.equal(policyPagePath('terms-and-conditions'), '/kohleyed/terms-and-conditions');
  assert.equal(policyPagePath('shipping-policy'), '/kohleyed/shipping-policy');
  assert.equal(policyPagePath('refund-policy'), '/kohleyed/refund-policy');
  assert.equal(policyPagePath('privacy-policy'), '/kohleyed/privacy-policy');
});

test('uses root-relative navigation in a root-mounted local development build', () => {
  const paths = createSitePaths('/');

  assert.equal(paths.mainWebsitePath, '/');
  assert.equal(paths.mainWebsiteSectionPath('#hero'), '/#hero');
  assert.equal(paths.policyPagePath('terms-and-conditions'), '/terms-and-conditions');
});
