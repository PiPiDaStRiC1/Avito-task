export type AutoItemParams = {
    brand?: string;
    model?: string;
    yearOfManufacture?: number;
    transmission?: "automatic" | "manual";
    mileage?: number;
    enginePower?: number;
};

export type RealEstateItemParams = {
    type?: "flat" | "house" | "room";
    address?: string;
    area?: number;
    floor?: number;
};

export type ElectronicsItemParams = {
    type?: "phone" | "laptop" | "misc";
    brand?: string;
    model?: string;
    condition?: "new" | "used";
    color?: string;
};
