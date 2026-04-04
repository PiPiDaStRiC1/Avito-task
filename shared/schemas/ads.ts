import { z } from "zod";
import { ITEM_CATEGORIES } from "../types/constants";
import type { Item } from "../types";

type ItemSortColumn = Extract<keyof Item, "title" | "createdAt" | "price">;
type SortDirection = "asc" | "desc";

const AutoTransmissionSchema = z.enum(["automatic", "manual"]);
const RealEstateTypeSchema = z.enum(["flat", "house", "room"]);
const ElectronicsTypeSchema = z.enum(["phone", "laptop", "misc"]);
const ElectronicsConditionSchema = z.enum(["new", "used"]);
const CategorySchema = z.enum(Object.values(ITEM_CATEGORIES));

export const AutoItemParamsSchema = z.strictObject({
    brand: z.string().nonempty(),
    model: z.string().nonempty(),
    yearOfManufacture: z.number().int().positive(),
    transmission: AutoTransmissionSchema,
    mileage: z.number().positive(),
    enginePower: z.number().int().positive(),
});

export const RealEstateItemParamsSchema = z.strictObject({
    type: RealEstateTypeSchema,
    address: z.string().nonempty(),
    area: z.number().positive(),
    floor: z.number().int().positive(),
});

export const ElectronicsEstateItemParamsSchema = z.strictObject({
    type: ElectronicsTypeSchema,
    brand: z.string().nonempty(),
    model: z.string().nonempty(),
    condition: ElectronicsConditionSchema,
    color: z.string().nonempty(),
});

export const ItemsGetInQuerySchema = z.object({
    q: z.string().trim().optional().default(""),
    limit: z
        .union([z.string(), z.number()])
        .optional()
        .transform((val: string | number | undefined) => {
            if (typeof val === "number") return val;
            if (typeof val === "string") return Number.parseInt(val, 10);
            return undefined;
        })
        .pipe(z.number().int().positive().optional().default(10)),
    skip: z
        .union([z.string(), z.number()])
        .optional()
        .transform((val: string | number | undefined) => {
            if (typeof val === "number") return val;
            if (typeof val === "string") return Number.parseInt(val, 10);
            return undefined;
        })
        .pipe(z.number().int().min(0).optional().default(0)),
    categories: z
        .union([z.string(), z.array(z.string())])
        .optional()
        .transform((val: string | string[] | undefined) => {
            if (!val) return undefined;
            if (Array.isArray(val)) return val;
            return val.split(",").map((s: string) => s.trim());
        })
        .pipe(z.array(CategorySchema).optional()),
    needsRevision: z
        .union([z.string(), z.boolean()])
        .optional()
        .transform((val: string | boolean | undefined) => {
            if (typeof val === "boolean") return val;
            if (typeof val === "string") return val === "true" || val === "1";
            return undefined;
        })
        .pipe(z.boolean().optional().default(false)),
    sortColumn: z.enum<ItemSortColumn[]>(["title", "createdAt", "price"]).optional(),
    sortDirection: z.enum<SortDirection[]>(["asc", "desc"]).optional(),
});

export const ItemUpdateInSchema = z
    .object({
        category: CategorySchema,
        title: z.string(),
        description: z.string().optional(),
        price: z.number().min(0),
    })
    .and(
        z.discriminatedUnion("category", [
            z.object({
                category: z.literal(ITEM_CATEGORIES.AUTO),
                params: AutoItemParamsSchema.partial(),
            }),
            z.object({
                category: z.literal(ITEM_CATEGORIES.REAL_ESTATE),
                params: RealEstateItemParamsSchema.partial(),
            }),
            z.object({
                category: z.literal(ITEM_CATEGORIES.ELECTRONICS),
                params: ElectronicsEstateItemParamsSchema.partial(),
            }),
        ]),
    );

export type ItemsGetInQuery = z.infer<typeof ItemsGetInQuerySchema>;
export type ItemUpdateIn = z.infer<typeof ItemUpdateInSchema>;
