import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import Module from "node:module";
import { renderToStaticMarkup } from "react-dom/server";
import * as typescript from "typescript";
import { canInquireAboutProduct, productInquiryUrl } from "../lib/product-inquiries.mjs";

const componentUrl = new URL("./ProductCatalog.tsx", import.meta.url);
const componentFilename = fileURLToPath(componentUrl);
const componentSource = await readFile(componentUrl, "utf8");
const compiledComponent = typescript.transpileModule(componentSource, {
  compilerOptions: {
    esModuleInterop: true,
    jsx: typescript.JsxEmit.ReactJSX,
    module: typescript.ModuleKind.CommonJS,
    target: typescript.ScriptTarget.ES2020,
  },
}).outputText;

const componentModule = new Module(componentFilename);
componentModule.filename = componentFilename;
componentModule.paths = Module._nodeModulePaths(dirname(componentFilename));
const componentRequire = componentModule.require.bind(componentModule);
componentModule.require = (specifier) => {
  if (specifier === "../lib/product-inquiries.mjs") {
    return { canInquireAboutProduct, productInquiryUrl };
  }
  return componentRequire(specifier);
};
componentModule._compile(compiledComponent, componentFilename);
const ProductCatalog = componentModule.exports.default;

const fixtureProduct = {
  id: "test-sabonete",
  name: "Sabonete de teste",
  image: "/images/test-fixture.jpg",
  price: "R$ 12,34",
  size: "90 g",
  ingredients: ["ingrediente de teste A", "ingrediente de teste B"],
  availability: "available",
};

function renderCatalog(products) {
  return renderToStaticMarkup(ProductCatalog({ products }));
}

test("renders an empty catalog state without an inquiry action", () => {
  const html = renderCatalog([]);
  assert.match(html, /Estamos atualizando nosso catálogo/);
  assert.match(html, /catalog-surface/);
  assert.doesNotMatch(html, /href="https:\/\/wa\.me\//);
});

test("renders every required product detail and a product-specific inquiry link", () => {
  const html = renderCatalog([fixtureProduct]);
  assert.match(html, /test-fixture\.jpg/);
  assert.match(html, /alt="Sabonete de teste"/);
  assert.match(html, /R\$ 12,34/);
  assert.match(html, /Tamanho: 90 g/);
  assert.match(html, /ingrediente de teste A, ingrediente de teste B/);
  assert.match(html, /Disponível/);
  assert.match(html, new RegExp(`href="${productInquiryUrl(fixtureProduct.name).replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"`));
});

test("shows unavailable products without a WhatsApp inquiry link", () => {
  const unavailableProduct = { ...fixtureProduct, availability: "unavailable" };
  const html = renderCatalog([unavailableProduct]);
  assert.match(html, /Indisponível/);
  assert.match(html, /disabled/);
  assert.match(html, /Indisponível para pedido/);
  assert.doesNotMatch(html, /href="https:\/\/wa\.me\//);
});

function contrastRatio(foreground, background) {
  const luminance = (hex) => {
    const channels = hex.slice(1).match(/../g).map((channel) => parseInt(channel, 16) / 255);
    const linear = channels.map((channel) => channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4);
    return (0.2126 * linear[0]) + (0.7152 * linear[1]) + (0.0722 * linear[2]);
  };
  const values = [luminance(foreground), luminance(background)].sort((a, b) => b - a);
  return (values[0] + 0.05) / (values[1] + 0.05);
}

test("catalog details and statuses meet AA text contrast in light and dark modes", async () => {
  const stylesheet = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");
  const themeBlock = (selector) => {
    const match = stylesheet.match(new RegExp(`${selector}\\s*\\{([^}]+)\\}`));
    assert.ok(match, `expected ${selector} theme tokens`);
    return match[1];
  };
  const readToken = (block, name) => {
    const match = block.match(new RegExp(`${name}:\\s*(#[0-9a-fA-F]{6})`));
    assert.ok(match, `expected ${name} token`);
    return match[1];
  };
  const light = themeBlock(":root");
  const dark = themeBlock("\\.dark");
  for (const [mode, tokens] of [["light", light], ["dark", dark]]) {
    assert.ok(contrastRatio(readToken(tokens, "--catalog-text"), readToken(tokens, "--catalog-surface")) >= 4.5, `${mode} product details`);
    assert.ok(contrastRatio(readToken(tokens, "--catalog-available-text"), readToken(tokens, "--catalog-available-surface")) >= 4.5, `${mode} available status`);
    assert.ok(contrastRatio(readToken(tokens, "--catalog-unavailable-text"), readToken(tokens, "--catalog-unavailable-surface")) >= 4.5, `${mode} unavailable status`);
    assert.ok(contrastRatio(readToken(tokens, "--catalog-action-text"), readToken(tokens, "--catalog-action-surface")) >= 4.5, `${mode} inquiry button`);
  }
});
