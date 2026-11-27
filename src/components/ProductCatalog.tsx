import Image from "next/image";
import { canInquireAboutProduct, productInquiryUrl } from "@/lib/product-inquiries.mjs";
import type { Product } from "@/data/products";

type ProductCatalogProps = {
  products: Product[];
};

export default function ProductCatalog({ products }: ProductCatalogProps) {
  return (
    <section id="catalogo" aria-labelledby="catalog-title" className="py-16 scroll-mt-20">
      <div className="mb-8 max-w-2xl">
        <h2 id="catalog-title" className="text-3xl font-semibold tracking-tight">Catálogo de produtos</h2>
        <p className="mt-3 text-primary">Conheça os produtos disponíveis e consulte cada opção pelo WhatsApp.</p>
      </div>

      {products.length === 0 ? (
        <p className="rounded-lg border border-gray-200 bg-white/60 p-6 text-primary">
          Estamos atualizando nosso catálogo. Em breve, você poderá conferir os produtos disponíveis.
        </p>
      ) : (
        <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => {
            const available = canInquireAboutProduct(product);
            return (
              <li key={product.id} className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                <div className="relative aspect-[4/3] bg-gray-100">
                  <Image src={product.image} alt={product.name} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover" />
                </div>
                <div className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-xl font-semibold">{product.name}</h3>
                    <span className={`shrink-0 rounded-full px-3 py-1 text-sm ${available ? "bg-green-100 text-green-900" : "bg-gray-100 text-gray-700"}`}>
                      {available ? "Disponível" : "Indisponível"}
                    </span>
                  </div>
                  <p className="mt-3 font-medium">{product.price}</p>
                  <p className="mt-1 text-sm text-primary">Tamanho: {product.size}</p>
                  <div className="mt-4">
                    <h4 className="text-sm font-semibold">Ingredientes</h4>
                    <p className="mt-1 text-sm text-primary">{product.ingredients.join(", ")}</p>
                  </div>
                  {available ? (
                    <a
                      href={productInquiryUrl(product.name)}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-5 inline-flex w-full items-center justify-center rounded-md bg-primary px-4 py-3 font-semibold text-background transition hover:brightness-95"
                    >
                      Consultar pelo WhatsApp
                    </a>
                  ) : (
                    <button type="button" disabled className="mt-5 w-full cursor-not-allowed rounded-md bg-gray-200 px-4 py-3 font-semibold text-gray-600" aria-label={`${product.name} indisponível para pedido`}>
                      Indisponível para pedido
                    </button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
