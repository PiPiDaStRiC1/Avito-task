import data from "@/data/items.json";
import type { Request, Response } from "express";
import type { Item } from "@shared/types";
import { ItemUpdateInSchema } from "@shared/schemas";
import { ZodError } from "zod";
import { doesItemNeedRevision } from "@/utils/utils";
import { getItemsByQuery } from "@/helpers/adsQuery";

const BASE_ITEMS = data as Item[];
const sessionOverrides = new Map<number, Item>();

const getAllItemsForSession = () => BASE_ITEMS.map((item) => sessionOverrides.get(item.id) ?? item);

const findItemForSession = (id: number) =>
    sessionOverrides.get(id) ?? BASE_ITEMS.find((item) => item.id === id);

const withDelay = <T>(callback: () => T | void, ms = 300 + Math.random() * 700) => {
    new Promise((resolve) => setTimeout(resolve, ms)).then(() => {
        callback();
    });
};

export const getAllAds = (req: Request, res: Response) => {
    try {
        const result = getItemsByQuery(getAllItemsForSession(), req.query);

        withDelay(() => {
            res.status(200).json(result);
        });
    } catch (error) {
        if (error instanceof ZodError) {
            res.status(400).json({ message: "Invalid query parameters", issues: error.issues });
            return;
        }

        res.status(500).json({ message: "Internal server error" });
    }
};

export const getAdById = (req: Request<{ id: string }>, res: Response) => {
    const id = Number.parseInt(req.params["id"] ?? "", 10);
    const item = findItemForSession(id);

    if (!item) {
        res.status(404).json({ message: "Item not found" });
        return;
    }

    withDelay(() => {
        res.status(200).json({ ...item, needsRevision: doesItemNeedRevision(item) });
    });
};

export const updateAd = (req: Request<{ id: string }>, res: Response) => {
    const id = Number.parseInt(req.params["id"] ?? "", 10);

    if (!Number.isFinite(id)) {
        res.status(400).json({ message: "Item ID path param should be a number" });
        return;
    }

    const currentItem = findItemForSession(id);

    if (!currentItem) {
        res.status(404).json({ message: "Item not found" });
        return;
    }

    try {
        const parsed = ItemUpdateInSchema.parse({
            category: currentItem.category,
            ...(req.body as Record<string, unknown>),
        });

        const nextItemBase = {
            id: currentItem.id,
            createdAt: currentItem.createdAt,
            updatedAt: new Date().toISOString(),
            category: currentItem.category,
            title: parsed.title,
            price: parsed.price,
            params: { ...currentItem.params, ...parsed.params },
        };

        const nextItem: Item =
            parsed.description === undefined
                ? (nextItemBase as Item)
                : ({ ...nextItemBase, description: parsed.description } as Item);

        sessionOverrides.set(id, nextItem);

        withDelay(() => {
            res.status(200).json({
                success: true,
                item: { ...nextItem, needsRevision: doesItemNeedRevision(nextItem) },
            });
        });
    } catch (error) {
        if (error instanceof ZodError) {
            res.status(400).json({ message: "Invalid body parameters", issues: error.issues });
            return;
        }

        res.status(500).json({ message: "Internal server error" });
    }
};
