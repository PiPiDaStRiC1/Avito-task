import type { AutoItemParams, ElectronicsItemParams, RealEstateItemParams } from "./adParams";

export type ItemUpdateIn = {
    category: "auto" | "real_estate" | "electronics";
    title: string;
    description?: string;
    price: number;
    params: AutoItemParams | RealEstateItemParams | ElectronicsItemParams;
};
