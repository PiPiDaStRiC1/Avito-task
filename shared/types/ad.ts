import type { AutoItemParams, ElectronicsItemParams, RealEstateItemParams } from "./index";

export type Item = {
    id: number;
    title: string;
    description?: string;
    price: number | null;
    createdAt: string;
    updatedAt: string;
} & (
    | { category: "auto"; params: AutoItemParams }
    | { category: "real_estate"; params: RealEstateItemParams }
    | { category: "electronics"; params: ElectronicsItemParams }
);
