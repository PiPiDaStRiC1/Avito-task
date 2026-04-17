import type { Item } from "./ad";
export type ItemListItem = Item & {
    needsRevision: boolean;
};
export interface GetAllAdsOut {
    items: ItemListItem[];
    total: number;
}
//# sourceMappingURL=api.d.ts.map