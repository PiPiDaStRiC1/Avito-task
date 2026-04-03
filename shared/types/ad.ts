export interface AdItem {
    id: number;
    category: "Авто" | "Недвижимость" | "Электроника";
    title: string;
    price: number;
    needsRevision: boolean;
}
