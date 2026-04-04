import { Router } from "express";
import { getAllAds, getAdById } from "@/controllers";

const adsRouter = Router();

adsRouter.get("/", getAllAds);
adsRouter.get("/:id", getAdById);

export { adsRouter };
