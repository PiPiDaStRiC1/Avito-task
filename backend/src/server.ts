import "dotenv/config";
import express from "express";
import morgan from "morgan";
import cors from "cors";
import { adsRouter, aiRouter } from "@/routes";

const app = express();
const PORT = process.env["PORT"] || 5000;

app.use(morgan("tiny"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: "http://localhost:5173" }));

app.use("/api/items", adsRouter);
app.use("/api/ai", aiRouter);

app.listen(PORT, () => {
    console.log(`Listening server on port: ${PORT}`);
});
