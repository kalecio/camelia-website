/** Only add products here after the business approves every displayed detail. */
export type Product = {
  id: string;
  name: string;
  image: string;
  price: string;
  size: string;
  ingredients: string[];
  availability: "available" | "unavailable";
};

// No owner-approved product records were present when this catalog was added.
export const approvedProducts: Product[] = [];
