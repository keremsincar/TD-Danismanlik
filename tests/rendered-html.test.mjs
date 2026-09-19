import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);
const read = path => readFile(new URL(path, root), "utf8");

test("ships the TD Danışmanlık product instead of the starter", async () => {
  const [home, listings, layout, manifest] = await Promise.all([
    read("components/PublicHome.tsx"), read("app/[locale]/[slug]/page.tsx"), read("app/layout.tsx"), read("package.json"),
  ]);
  assert.match(home, /TD Danışmanlık/);
  assert.match(home, /\/universiteler/);
  assert.match(listings, /ProgramFinder|UniversityCatalog/);
  assert.match(home, /CookieBanner/);
  assert.match(layout, /og\.png/);
  assert.doesNotMatch(layout, /Starter Project|codex-preview/);
  assert.doesNotMatch(manifest, /react-loading-skeleton/);
});

test("keeps sensitive writes behind validation and authorization", async () => {
  const [consultations, admin, auth, login] = await Promise.all([
    read("app/api/consultations/route.ts"), read("app/api/admin/content/route.ts"), read("lib/admin.ts"), read("app/api/admin/auth/login/route.ts"),
  ]);
  assert.match(consultations, /rate_limits/);
  assert.match(consultations, /kvkk/);
  assert.match(consultations, /cf-connecting-ip/);
  assert.match(admin, /getAdmin/);
  assert.match(admin, /origin/);
  assert.match(auth, /PBKDF2/);
  assert.match(auth, /admin_sessions/);
  assert.match(login, /httpOnly|adminCookieOptions/);
  assert.doesNotMatch(`${consultations}${admin}${auth}${login}`, /Tddanismanlik 7/);
});

test("defines persistent content and lead tables", async () => {
  const [schema, hosting] = await Promise.all([read("db/schema.ts"), read(".openai/hosting.json")]);
  for (const table of ["site_settings", "services", "universities", "programs", "consultation_requests", "audit_logs", "admin_users", "admin_sessions"]) assert.match(schema, new RegExp(table));
  assert.match(hosting, /"d1": "DB"/);
  assert.match(hosting, /"r2": "MEDIA"/);
});

test("routes menus to separate pages and protects media uploads", async () => {
  const [header, catalog, media, reviews] = await Promise.all([
    read("components/SiteHeader.tsx"), read("components/UniversityCatalog.tsx"), read("app/api/admin/media/route.ts"), read("lib/content.ts"),
  ]);
  for (const path of ["hizmetler", "universiteler", "surec", "sss"]) assert.match(header, new RegExp(`\\$\\{home\\}/${path}`));
  assert.match(catalog, /PAGE_SIZE=12/);
  assert.match(catalog, /\?page=\$\{/);
  assert.match(catalog, /universite-listesi/);
  assert.match(media, /getAdmin/);
  assert.match(media, /8_000_000/);
  assert.match(reviews, /is_example=0/);
  assert.match(reviews, /Mohamed A\./);
});
