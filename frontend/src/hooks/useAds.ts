import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import { useFilters } from "./useFilters";

const ADS_PER_PAGE = 10;

export const useAds = () => {
    const [gridLayout, setGridLayout] = useState<"grid" | "row">("grid");

    const { page, queryParams, setPage, searchProps, asideFiltersProps } = useFilters();

    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: ["ads", queryParams],
        queryFn: () => apiClient.getAllAds(queryParams),
        staleTime: 10 * 60 * 1000,
    });

    const pages = Math.max(1, Math.ceil((data?.total ?? 0) / ADS_PER_PAGE));

    return {
        page,
        pages,
        gridLayout,
        setGridLayout,
        searchProps,
        asideFiltersProps,
        adsResponse: data,
        isLoading,
        isError,
        refetch,
        setPage,
    };
};
