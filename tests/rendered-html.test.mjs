import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);
const read = path => readFile(new URL(path, root), "utf8");

test("ships the TD Danışmanlık product instead of the starter", async () => {
  const [home, layout, manifest] = await Promise.all([
    read("components/PublicHome.tsx"), read("app/layout.tsx"), read("package.json"),
  ]);
  assert.match(home, /TD Danışmanlık/);
  assert.match(home, /ProgramFinder/);
  assert.match(home, /CookieBanner/);
  assert.match(layout, /og\.png/);
  assert.doesNotMatch(layout, /Starter Project|codex-preview/);
  assert.doesNotMatch(manifest, /react-loading-skeleton/);
});

test("keeps sensitive writes behind validation and authorization", async () => {
  const [consultations, admin, auth] = await Promise.all([
    read("app/api/consultations/route.ts"), read("app/api/admin/content/route.ts"), read("lib/admin.ts"),
  ]);
  assert.match(consultations, /rate_limits/);
  assert.match(consultations, /kvkk/);
  assert.match(consultations, /cf-connecting-ip/);
  assert.match(admin, /getAdmin/);
  assert.match(admin, /origin/);
  assert.match(auth, /ADMIN_EMAIL/);
  assert.doesNotMatch(`${consultations}${admin}${auth}`, /Tddanismanlik 7/);
});

test("defines persistent content and lead tables", async () => {
  const [schema, hosting] = await Promise.all([read("db/schema.ts"), read(".openai/hosting.json")]);
  for (const table of ["site_settings", "services", "universities", "programs", "consultation_requests", "audit_logs"]) assert.match(schema, new RegExp(table));
  assert.match(hosting, /"d1": "DB"/);
});
