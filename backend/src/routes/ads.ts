import { Router } from "express";
import { getAllAds, getAdById, updateAd } from "@/controllers";

const adsRouter = Router();

adsRouter.get("/", getAllAds);
adsRouter.get("/:id", getAdById);
adsRouter.put("/:id", updateAd);

export { adsRouter };
