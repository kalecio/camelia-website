import test from "node:test";
import assert from "node:assert/strict";
import { canInquireAboutProduct, productInquiryUrl } from "../src/lib/product-inquiries.mjs";

test("product inquiry pre-fills the existing WhatsApp number with the selected product", () => {
  const url = new URL(productInquiryUrl("Sabonete de teste"));
  assert.equal(url.origin, "https://wa.me");
  assert.equal(url.pathname, "/5581985626046");
  assert.equal(url.searchParams.get("text"), "Olá! Tenho interesse no produto: Sabonete de teste.");
});

test("unavailable products cannot expose an inquiry action", () => {
  assert.equal(canInquireAboutProduct({ availability: "unavailable" }), false);
  assert.equal(canInquireAboutProduct({ availability: "available" }), true);
});
