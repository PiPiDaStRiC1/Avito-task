import { List, LayoutGrid, Search as SearchIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface SearchParam {
    name: string;
    value: string;
}

interface SearchProps {
    gridLayout: "grid" | "row";
    setGridLayout: (layout: "grid" | "row") => void;
    query: string;
    onQueryChange: (value: string) => void;
    sort: string;
    onSortChange: (value: string) => void;
}

const searchParams: SearchParam[] = [
    { name: "По новизне (сначала новые)", value: "new" },
    { name: "По новизне (сначала старые)", value: "old" },
    { name: "По цене (сначала дешевле)", value: "price_asc" },
    { name: "По цене (сначала дороже)", value: "price_desc" },
    { name: "По названию (А-Я)", value: "name_asc" },
    { name: "По названию (Я-А)", value: "name_desc" },
];

export const Search = ({
    gridLayout,
    setGridLayout,
    onQueryChange,
    query,
    sort,
    onSortChange,
}: SearchProps) => {
    const [localQuery, setLocalQuery] = useState(query);
    const timerIdRef = useRef<null | number>(null);

    useEffect(() => {
        if (localQuery === query) {
            return;
        }

        if (timerIdRef.current) {
            clearTimeout(timerIdRef.current);
        }

        timerIdRef.current = setTimeout(() => {
            onQueryChange(localQuery);
        }, 300);

        return () => {
            if (timerIdRef.current) {
                clearTimeout(timerIdRef.current);
            }
        };
    }, [localQuery, query, onQueryChange]);

    return (
        <div className="rounded-xl border border-[var(--soft-border)] bg-[var(--panel-bg)] p-3 sm:p-3.5">
            <div className="flex flex-col gap-3 min-[920px]:flex-row min-[920px]:items-center">
                <div className="relative min-w-0 flex-1">
                    <input
                        type="text"
                        value={localQuery}
                        onChange={(event) => setLocalQuery(event.target.value)}
                        placeholder="Найти объявление..."
                        className="h-9 w-full rounded-lg border border-[var(--soft-border)] bg-white px-3 pr-10 text-sm text-[var(--text-main)] placeholder:text-[var(--text-muted)] focus:border-[var(--accent)] focus:outline-none"
                    />
                    <SearchIcon
                        size={14}
                        className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-[var(--text-muted)]"
                    />
                </div>

                <div className="flex items-center gap-2 self-end min-[920px]:self-auto">
                    <button
                        type="button"
                        aria-label="grid"
                        onClick={() => setGridLayout("grid")}
                        className={`cursor-pointer flex h-8 w-8 items-center justify-center rounded-md border ${
                            gridLayout === "grid"
                                ? "border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent)]"
                                : "border-[var(--soft-border)] bg-white text-[var(--text-muted)]"
                        }`}
                    >
                        <LayoutGrid size={15} />
                    </button>
                    <button
                        type="button"
                        aria-label="row"
                        onClick={() => setGridLayout("row")}
                        className={`cursor-pointer flex h-8 w-8 items-center justify-center rounded-md border ${
                            gridLayout === "row"
                                ? "border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent)]"
                                : "border-[var(--soft-border)] bg-white text-[var(--text-muted)]"
                        }`}
                    >
                        <List size={15} />
                    </button>
                </div>

                <select
                    name="search_params"
                    id="search_params"
                    value={sort}
                    onChange={(event) => onSortChange(event.target.value)}
                    className="h-9 rounded-lg border border-[var(--soft-border)] bg-white px-3 text-sm text-[var(--text-main)] focus:border-[var(--accent)] focus:outline-none"
                >
                    {searchParams.map((param) => (
                        <option key={param.value} value={param.value}>
                            {param.name}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
};
