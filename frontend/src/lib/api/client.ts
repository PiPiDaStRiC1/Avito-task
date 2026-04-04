import type { GetAllAdsOut, ItemListItem } from "@shared/types";
import type { ItemsGetInQuery } from "@shared/schemas";

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
};
