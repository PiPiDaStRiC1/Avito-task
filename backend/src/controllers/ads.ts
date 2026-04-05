import data from "@/data/items.json";
import type { Request, Response } from "express";
import type { Item } from "@shared/types";
import { ZodError } from "zod";
import { doesItemNeedRevision } from "@/utils/utils";
import { getItemsByQuery } from "@/helpers/adsQuery";

export const getAllAds = (req: Request, res: Response) => {
    try {
        const result = getItemsByQuery(data as Item[], req.query);

        new Promise((res) => setTimeout(res, 300 + Math.random() * 700)).then(() => {
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
    const item = (data as Item[]).find((ad) => ad.id === id);

    if (!item) {
        res.status(404).json({ message: "Item not found" });
        return;
    }

    new Promise((res) => setTimeout(res, 300 + Math.random() * 700)).then(() => {
        res.status(200).json({ ...item, needsRevision: doesItemNeedRevision(item) });
    });
};
