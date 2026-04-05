import { Router } from "express";
import { suggestWithAi } from "@/controllers/ai";

const aiRouter = Router();

aiRouter.post("/suggest", suggestWithAi);

export { aiRouter };
