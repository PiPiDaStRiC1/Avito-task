import { List, LayoutGrid, Search as SearchIcon } from "lucide-react";

interface SearchParam {
    name: string;
    value: string;
}

const searchParams: SearchParam[] = [
    { name: "По новизне (сначала новые)", value: "new" },
    { name: "По новизне (сначала старые)", value: "old" },
    { name: "По цене (сначала дешевле)", value: "price_low" },
    { name: "По цене (сначала дороже)", value: "price_high" },
    { name: "По названию (А-Я)", value: "name_asc" },
    { name: "По названию (Я-А)", value: "name_desc" },
];

export const Search = () => {
    return (
        <div className="rounded-xl border border-[var(--soft-border)] bg-[var(--panel-bg)] p-3 sm:p-3.5">
            <div className="flex flex-col gap-3 min-[920px]:flex-row min-[920px]:items-center">
                <div className="relative min-w-0 flex-1">
                    <input
                        type="text"
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
                        aria-label="Плитка"
                        className="flex h-8 w-8 items-center justify-center rounded-md border border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent)]"
                    >
                        <LayoutGrid size={15} />
                    </button>
                    <button
                        type="button"
                        aria-label="Список"
                        className="flex h-8 w-8 items-center justify-center rounded-md border border-[var(--soft-border)] bg-white text-[var(--text-muted)]"
                    >
                        <List size={15} />
                    </button>
                </div>

                <select
                    name="search_params"
                    id="search_params"
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
