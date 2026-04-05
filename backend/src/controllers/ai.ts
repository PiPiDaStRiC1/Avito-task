import type { Request, Response } from "express";
import OpenAI from "openai";
import { z } from "zod";

const SuggestBodySchema = z.object({
    mode: z.enum(["description", "price"]),
    item: z.object({
        category: z.enum(["auto", "real_estate", "electronics"]),
        title: z.string(),
        description: z.string().optional(),
        price: z.number(),
        params: z.record(z.string(), z.unknown()),
    }),
});

type AiMode = "description" | "price";
type SuggestItem = z.infer<typeof SuggestBodySchema>["item"];

const openRouterApiKey = process.env["OPENROUTER_API_KEY"];
const openRouterBaseUrl = process.env["OPENROUTER_BASE_URL"] || "https://openrouter.ai/api/v1";
const normalizeOpenRouterModel = (modelId: string) => {
    const normalized = modelId.trim();

    if (normalized === "deepseek-chat") return "deepseek/deepseek-chat";
    if (normalized === "deepseek-reasoner") return "deepseek/deepseek-reasoner";

    return normalized;
};

const configuredModelId =
    process.env["OPENROUTER_MODEL"] || process.env["DEEPSEEK_MODEL"] || "deepseek/deepseek-chat";
const openRouterModel = normalizeOpenRouterModel(configuredModelId);
const openRouterReferer = process.env["OPENROUTER_HTTP_REFERER"] || "http://localhost:5173";
const openRouterTitle = process.env["OPENROUTER_APP_TITLE"] || "AI Avito";

const getOpenRouterClient = () => {
    if (!openRouterApiKey) {
        throw new Error("OPENROUTER_API_KEY is not configured");
    }

    return new OpenAI({
        baseURL: openRouterBaseUrl,
        apiKey: openRouterApiKey,
        defaultHeaders: {
            "HTTP-Referer": openRouterReferer,
            "X-OpenRouter-Title": openRouterTitle,
        },
    });
};

const getSystemPrompt = (mode: AiMode) => {
    if (mode === "price") {
        return [
            "Ты ассистент Авито для оценки цены.",
            "Верни только JSON формата:",
            '{"price": <number>, "reason": "<краткое объяснение до 220 символов>"}',
            "Без markdown и без лишнего текста.",
        ].join(" ");
    }

    return [
        "Ты ассистент Авито для улучшения описания объявлений.",
        "Сформируй лаконичное продающее описание на русском.",
        "Тон: нейтрально-дружелюбный, без кликбейта.",
        "Длина: 350-700 символов.",
        "Никакого markdown.",
    ].join(" ");
};

const unwrapJsonFromText = (rawText: string) => {
    const trimmed = rawText.trim();
    const fencedMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);

    if (fencedMatch?.[1]) {
        return fencedMatch[1].trim();
    }

    return trimmed;
};

const parsePriceResponse = (rawText: string) => {
    const text = unwrapJsonFromText(rawText);

    try {
        const parsed = JSON.parse(text) as { price?: unknown; reason?: unknown };
        if (typeof parsed.price === "number" && Number.isFinite(parsed.price)) {
            return {
                price: Math.max(0, Math.round(parsed.price)),
                reason:
                    typeof parsed.reason === "string" && parsed.reason.trim()
                        ? parsed.reason.trim()
                        : "Оценка сформирована на основе параметров объявления",
            };
        }
    } catch {
        // ignore, fallback below
    }

    const numberMatch = text.match(/\d(?:[\d\s,.]{1,}\d)?/);
    const fallbackRaw = numberMatch?.[0] ?? "";
    const fallbackPrice = Number(fallbackRaw.replace(/\s+/g, "").replace(/,/g, "."));

    return {
        price: Number.isFinite(fallbackPrice) && fallbackPrice != null ? fallbackPrice : null,
        reason: text.trim().slice(0, 220),
    };
};

const parseDescriptionResponse = (rawText: string) => {
    const text = unwrapJsonFromText(rawText);

    try {
        const parsed = JSON.parse(text) as {
            description?: unknown;
            content?: unknown;
            text?: unknown;
        };

        const candidate = [parsed.description, parsed.content, parsed.text].find(
            (value) => typeof value === "string" && value.trim(),
        );

        if (typeof candidate === "string") {
            return candidate.trim();
        }
    } catch {
        // ignore and return raw text
    }

    return text;
};

const buildUserPayload = (mode: AiMode, item: SuggestItem) =>
    JSON.stringify(
        {
            task: mode,
            item,
            hint:
                mode === "price"
                    ? "Оцени рыночную цену в рублях"
                    : "Улучши описание с учетом категории и характеристик",
        },
        null,
        2,
    );

const requestOpenRouter = async (mode: AiMode, item: SuggestItem) => {
    try {
        const openai = getOpenRouterClient();

        const completion = await openai.chat.completions.create({
            model: openRouterModel,
            temperature: mode === "price" ? 0.2 : 0.6,
            messages: [
                { role: "system", content: getSystemPrompt(mode) },
                { role: "user", content: buildUserPayload(mode, item) },
            ],
            stream: false,
        });

        const content = completion.choices[0]?.message?.content;
        return typeof content === "string" ? content.trim() : "";
    } catch (error) {
        if (error instanceof OpenAI.APIError) {
            throw new Error(`OpenRouter request failed: ${error.message}`);
        }

        throw error;
    }
};

export const suggestWithAi = async (req: Request, res: Response) => {
    const parsedBody = SuggestBodySchema.safeParse(req.body);

    if (!parsedBody.success) {
        res.status(400).json({ message: "Invalid payload", issues: parsedBody.error.issues });
        return;
    }

    const { mode, item } = parsedBody.data;

    try {
        const content = await requestOpenRouter(mode, item);

        if (!content) {
            res.status(502).json({ message: "Empty response from LLM" });
            return;
        }

        if (mode === "description") {
            res.status(200).json({ mode, content: parseDescriptionResponse(content) });
            return;
        }

        const priceResult = parsePriceResponse(content);
        res.status(200).json({ mode, content, ...priceResult });
    } catch (error) {
        res.status(500).json({
            message: "Internal AI error",
            details: error instanceof Error ? error.message : "Unknown error",
        });
    }
};
