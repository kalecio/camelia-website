import assert from "node:assert/strict";
import test from "node:test";
import {
  getMetadataBase,
  getSocialMetadata,
} from "./social-metadata.mjs";

test("Open Graph and Twitter images use the configured public site origin", () => {
  const metadata = getSocialMetadata(
    getMetadataBase({ NEXT_PUBLIC_SITE_URL: "https://preview.example.com" }),
  );

  assert.equal(
    metadata.openGraph.images[0].url,
    "https://preview.example.com/images/og-image.jpg",
  );
  assert.equal(
    metadata.twitter.images[0],
    "https://preview.example.com/images/og-image.jpg",
  );
});

test("Cloudflare preview URL is used when no explicit site URL is configured", () => {
  const metadata = getSocialMetadata(
    getMetadataBase({ CF_PAGES_URL: "https://branch.preview.pages.dev" }),
  );

  assert.equal(metadata.openGraph.images[0].url, "https://branch.preview.pages.dev/images/og-image.jpg");
  assert.equal(metadata.twitter.images[0], "https://branch.preview.pages.dev/images/og-image.jpg");
});

test("invalid or local configured origins fall back to the public Pages origin", () => {
  const metadata = getSocialMetadata(
    getMetadataBase({ NEXT_PUBLIC_SITE_URL: "http://localhost:3000" }),
  );

  assert.equal(metadata.openGraph.images[0].url, "https://camelia-website.pages.dev/images/og-image.jpg");
  assert.equal(metadata.twitter.images[0], "https://camelia-website.pages.dev/images/og-image.jpg");
});

test("IPv6 loopback and all 127.0.0.0/8 IPv4 origins are rejected", () => {
  for (const origin of [
    "http://[::1]:3000",
    "https://127.0.0.0",
    "https://127.0.0.1",
    "https://127.42.99.255",
    "https://127.255.255.255",
  ]) {
    assert.equal(
      getMetadataBase({ NEXT_PUBLIC_SITE_URL: origin }).origin,
      "https://camelia-website.pages.dev",
      `${origin} should be treated as loopback`,
    );
  }
});
