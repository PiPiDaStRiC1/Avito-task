import type { GetAllAdsOut, ItemListItem } from "@shared/types";
import type { ItemUpdateIn, ItemsGetInQuery } from "@shared/schemas";

type AiMode = "description" | "price";

type AiSuggestResponse = { mode: AiMode; content: string; price?: number | null; reason?: string };

type ApiErrorPayload = { message?: string; details?: string };

export const API_BASE_URL = import.meta.env["VITE_API_BASE_URL"] || "http://localhost:5000/api";

export const apiClient = {
    getAllAds: async (params: ItemsGetInQuery) => {
        try {
            const searchParams = new URLSearchParams();

            if (params.q) searchParams.set("q", params.q);
            if (params.limit) searchParams.set("limit", String(params.limit));
            if (typeof params.skip === "number") searchParams.set("skip", String(params.skip));
            if (params.needsRevision) searchParams.set("needsRevision", "true");
            if (params.categories && params.categories.length > 0) {
                searchParams.set("categories", params.categories.join(","));
            }
            if (params.sortColumn) searchParams.set("sortColumn", params.sortColumn);
            if (params.sortDirection) searchParams.set("sortDirection", params.sortDirection);

            const query = searchParams.toString();
            const response = await fetch(`${API_BASE_URL}/items${query ? `?${query}` : ""}`);

            if (!response.ok) {
                throw new Error("Failed to fetch items");
            }

            const data: GetAllAdsOut = await response.json();

            return data;
        } catch (error) {
            if (error instanceof Error) {
                console.error("Error fetching ads:", error.message);
            }

            throw error;
        }
    },

    getAdById: async (id: number | string) => {
        const response = await fetch(`${API_BASE_URL}/items/${id}`);

        if (!response.ok) {
            throw new Error("Failed to fetch item");
        }

        const data: ItemListItem = await response.json();
        return data;
    },

    updateAd: async (id: number | string, payload: ItemUpdateIn) => {
        const response = await fetch(`${API_BASE_URL}/items/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            let message = "Failed to update item";

            try {
                const data = (await response.json()) as ApiErrorPayload;
                const parts = [data.message, data.details].filter(Boolean);
                if (parts.length > 0) {
                    message = parts.join(": ");
                }
            } catch {
                const text = await response.text();
                if (text.trim()) {
                    message = text;
                }
            }

            throw new Error(message);
        }

        return response.json();
    },

    suggestWithAi: async (
        mode: AiMode,
        item: {
            category: "auto" | "real_estate" | "electronics";
            title: string;
            description?: string;
            price: number;
            params: Record<string, unknown>;
        },
    ) => {
        const response = await fetch(`${API_BASE_URL}/ai/suggest`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ mode, item }),
        });

        if (!response.ok) {
            let message = "Failed to get AI suggestion";

            try {
                const payload = (await response.json()) as ApiErrorPayload;
                const parts = [payload.message, payload.details].filter(Boolean);
                if (parts.length > 0) {
                    message = parts.join(": ");
                }
            } catch {
                const text = await response.text();
                if (text.trim()) {
                    message = text;
                }
            }

            throw new Error(message);
        }

        const data: AiSuggestResponse = await response.json();
        return data;
    },
};
