const WHATSAPP_NUMBER = "5581985626046";

/** Build a product-specific WhatsApp inquiry URL. */
export function productInquiryUrl(productName) {
  const message = `Olá! Tenho interesse no produto: ${productName}.`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

/** Unavailable products must never expose an ordering action. */
export function canInquireAboutProduct(product) {
  return product.availability === "available";
}
