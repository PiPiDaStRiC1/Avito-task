import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Search, AsideFilters, AdCard, AdsSkeleton, ErrorState } from "@/components";
import { useAds } from "@/hooks";

type ThemeMode = "light" | "dark";
const THEME_STORAGE_KEY = "ai-avito-theme";

export const Ads = () => {
    const [theme, setTheme] = useState<ThemeMode>(() => {
        const saved = localStorage.getItem(THEME_STORAGE_KEY);
        return saved === "dark" ? "dark" : "light";
    });

    const {
        page,
        pages,
        gridLayout,
        setGridLayout,
        searchProps,
        asideFiltersProps,
        adsResponse,
        isLoading,
        isError,
        refetch,
        setPage,
    } = useAds();

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem(THEME_STORAGE_KEY, theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme((current) => (current === "light" ? "dark" : "light"));
    };

    return (
        <div className="flex flex-col gap-5">
            <div className="flex items-center justify-between gap-3">
                <h1 className="text-xl font-medium text-[var(--text-main)]">Мои объявления</h1>
                <button
                    type="button"
                    onClick={toggleTheme}
                    className="cursor-pointer rounded-md border border-[var(--soft-border)] bg-[var(--panel-bg)] px-3 py-1.5 text-sm font-medium text-[var(--text-main)]"
                >
                    {theme === "light" ? "Темная тема" : "Светлая тема"}
                </button>
            </div>
            <Search
                gridLayout={gridLayout}
                setGridLayout={setGridLayout}
                query={searchProps.query}
                onQueryChange={searchProps.onQueryChange}
                sort={searchProps.sort}
                onSortChange={searchProps.onSortChange}
            />

            <div className="flex flex-col md:flex-row gap-5">
                <AsideFilters
                    selectedCategories={asideFiltersProps.selectedCategories}
                    onToggleCategory={asideFiltersProps.onToggleCategory}
                    onlyNeedsRevision={asideFiltersProps.onlyNeedsRevision}
                    onToggleNeedsRevision={asideFiltersProps.onToggleNeedsRevision}
                    onReset={asideFiltersProps.onReset}
                    hasActiveFilters={asideFiltersProps.hasActiveFilters}
                />

                <div className="flex flex-col gap-5 flex-1">
                    {isLoading && <AdsSkeleton />}

                    {isError && (
                        <ErrorState
                            title="Ошибка загрузки объявлений"
                            message="Не удалось загрузить объявления. Пожалуйста, попробуйте позже."
                            onRetry={refetch}
                        />
                    )}

                    {!isLoading && !isError && (
                        <>
                            <div
                                className={`w-full min-h-[80%] grid ${gridLayout === "grid" ? "grid-cols-5" : "grid-cols-1"} grid-rows-auto gap-5`}
                            >
                                {!adsResponse || adsResponse.items.length === 0 ? (
                                    <p className="self-center text-center text-[var(--text-muted)] col-span-full">
                                        {adsResponse?.items.length === 0
                                            ? "Объявления не найдены"
                                            : ""}
                                    </p>
                                ) : (
                                    adsResponse.items.map((ad) => (
                                        <div key={ad.id} className="col-span-1">
                                            <AdCard ad={ad} />
                                        </div>
                                    ))
                                )}
                            </div>

                            <div className="grid-cols-full flex gap-2">
                                <button
                                    type="button"
                                    className="disabled:opacity-50 cursor-pointer flex justify-center items-center h-8 w-8 rounded-md border border-[var(--soft-border)] bg-white text-lg leading-none text-[var(--text-muted)]"
                                    aria-label="last page"
                                    onClick={() => setPage(Math.max(page - 1, 1))}
                                    disabled={page === 1}
                                >
                                    <ArrowLeft size={14} />
                                </button>

                                {Array.from({ length: pages }, (_, index) => {
                                    const pageNumber = index + 1;
                                    return (
                                        <button
                                            key={pageNumber}
                                            type="button"
                                            onClick={() => setPage(pageNumber)}
                                            className={`cursor-pointer flex justify-center items-center h-8 w-8 rounded-md bg-white text-lg ${
                                                page === pageNumber
                                                    ? "border-2 border-[var(--accent)] text-[var(--accent)]"
                                                    : "text-[var(--text-muted)]"
                                            }`}
                                            aria-label={`page ${pageNumber}`}
                                        >
                                            {pageNumber}
                                        </button>
                                    );
                                })}

                                <button
                                    type="button"
                                    className="disabled:opacity-50 cursor-pointer flex justify-center items-center h-8 w-8 rounded-md border border-[var(--soft-border)] bg-white text-lg leading-none text-[var(--text-muted)]"
                                    aria-label="next page"
                                    onClick={() => setPage(Math.min(page + 1, pages))}
                                    disabled={page === pages}
                                >
                                    <ArrowRight size={14} />
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};
