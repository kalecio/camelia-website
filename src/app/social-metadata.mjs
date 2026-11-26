const DEFAULT_SITE_ORIGIN = "https://camelia-website.pages.dev";
const SOCIAL_IMAGE_PATH = "/images/og-image.jpg";

function isPublicHttpUrl(value) {
  try {
    const url = new URL(value);
    return (
      (url.protocol === "https:" || url.protocol === "http:") &&
      !url.username &&
      !url.password &&
      !["localhost", "127.0.0.1", "::1"].includes(url.hostname) &&
      !url.hostname.endsWith(".localhost")
    );
  } catch {
    return false;
  }
}

export function getMetadataBase(env = process.env) {
  const candidate = env.NEXT_PUBLIC_SITE_URL || env.CF_PAGES_URL;
  return new URL(isPublicHttpUrl(candidate) ? candidate : DEFAULT_SITE_ORIGIN);
}

export function getSocialImageUrl(metadataBase = getMetadataBase()) {
  return new URL(SOCIAL_IMAGE_PATH, metadataBase).toString();
}

export function getSocialMetadata(metadataBase = getMetadataBase()) {
  const image = {
    url: getSocialImageUrl(metadataBase),
    width: 1800,
    height: 1800,
    alt: "Camélia Saboaria Artesanal - Sabonetes Naturais",
  };

  return {
    metadataBase,
    openGraph: {
      type: "website",
      countryName: "Brazil",
      locale: "pt-BR",
      title: "Camélia Saboaria Artesanal",
      description:
        "Sabonetes e cuidados naturais feitos à mão, unindo beleza, bem-estar e respeito ao meio ambiente.",
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      images: [image.url],
    },
  };
}
