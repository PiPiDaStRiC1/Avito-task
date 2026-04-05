import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import type { Item } from "@shared/types";

const ADS_PER_PAGE = 10;

type SortValue = "new" | "old" | "price_asc" | "price_desc" | "name_asc" | "name_desc";

const sortToApi: Record<
    SortValue,
    { sortColumn: "title" | "createdAt" | "price"; sortDirection: "asc" | "desc" }
> = {
    new: { sortColumn: "createdAt", sortDirection: "desc" },
    old: { sortColumn: "createdAt", sortDirection: "asc" },
    price_asc: { sortColumn: "price", sortDirection: "asc" },
    price_desc: { sortColumn: "price", sortDirection: "desc" },
    name_asc: { sortColumn: "title", sortDirection: "asc" },
    name_desc: { sortColumn: "title", sortDirection: "desc" },
};

const parsePage = (value: string | null) => {
    const page = parseInt(value ?? "1", 10);
    return !isNaN(page) && page > 0 ? page : 1;
};

export const useFilters = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    const page = parsePage(searchParams.get("page"));
    const q = searchParams.get("q") ?? "";
    const sort = (searchParams.get("sort") as SortValue | null) ?? "new";
    const categories = (searchParams.get("categories") ?? "")
        .split(",")
        .map((value) => value.trim())
        .filter(Boolean) as Item["category"][];
    const onlyNeedsRevision = searchParams.get("needsRevision") === "true";
    const hasActiveFilters =
        q.length > 0 || categories.length > 0 || onlyNeedsRevision || sort !== "new";

    const updateParams = useCallback(
        (updates: Record<string, string | null>) => {
            const next = new URLSearchParams(searchParams);

            Object.entries(updates).forEach(([key, value]) => {
                if (!value || value === "1" || value === "new") {
                    next.delete(key);
                } else {
                    next.set(key, value);
                }
            });

            setSearchParams(next);
        },
        [searchParams, setSearchParams],
    );

    const queryParams = useMemo(() => {
        const skip = (page - 1) * ADS_PER_PAGE;
        const sortParams = sortToApi[sort] ?? sortToApi.new;

        return {
            q,
            limit: ADS_PER_PAGE,
            skip,
            needsRevision: onlyNeedsRevision,
            categories,
            sortColumn: sortParams.sortColumn,
            sortDirection: sortParams.sortDirection,
        };
    }, [q, sort, categories, onlyNeedsRevision, page]);

    const setPage = (nextPage: number) => updateParams({ page: String(nextPage) });

    const onQueryChange = useCallback(
        (value: string) => updateParams({ q: value || null, page: "1" }),
        [updateParams],
    );

    const onSortChange = (value: string) => updateParams({ sort: value, page: "1" });

    const onToggleCategory = (categoryId: Item["category"]) => {
        const nextCategories = categories.includes(categoryId)
            ? categories.filter((category) => category !== categoryId)
            : [...categories, categoryId];

        updateParams({
            categories: nextCategories.length > 0 ? nextCategories.join(",") : null,
            page: "1",
        });
    };

    const onToggleNeedsRevision = () => {
        updateParams({ needsRevision: onlyNeedsRevision ? null : "true", page: "1" });
    };

    const onReset = () => {
        updateParams({ q: null, categories: null, sort: null, needsRevision: null, page: "1" });
    };

    return {
        page,
        queryParams,
        setPage,
        searchProps: { query: q, sort, onQueryChange, onSortChange },
        asideFiltersProps: {
            selectedCategories: categories,
            onlyNeedsRevision,
            onToggleCategory,
            onToggleNeedsRevision,
            onReset,
            hasActiveFilters,
        },
    };
};
