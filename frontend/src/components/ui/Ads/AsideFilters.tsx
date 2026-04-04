import { useState } from "react";
import { ArrowUpIcon, ArrowDownIcon } from "lucide-react";
import type { Item } from "@shared/types";

interface Category {
    name: string;
    id: Item["category"];
}

const categories: Category[] = [
    { name: "Авто", id: "auto" },
    { name: "Недвижимость", id: "real_estate" },
    { name: "Электроника", id: "electronics" },
];

interface AsideFiltersProps {
    selectedCategories: Item["category"][];
    onToggleCategory: (categoryId: Item["category"]) => void;
    onlyNeedsRevision: boolean;
    onToggleNeedsRevision: () => void;
    onReset: () => void;
    hasActiveFilters: boolean;
}

export const AsideFilters = ({
    selectedCategories,
    onToggleCategory,
    onlyNeedsRevision,
    onToggleNeedsRevision,
    onReset,
    hasActiveFilters,
}: AsideFiltersProps) => {
    const [toggleFilters, setToggleFilters] = useState(true);

    return (
        <aside className="w-full max-w-full md:max-w-xs  flex flex-col gap-3">
            <div className="bg-white rounded-lg p-3">
                <h2 className="text-lg font-medium">Фильтры</h2>
                <div className="flex flex-col gap-3">
                    <div className="select-none flex justify-between items-center">
                        <h3>Категория</h3>
                        {toggleFilters ? (
                            <ArrowUpIcon
                                className="cursor-pointer"
                                size={16}
                                onClick={() => setToggleFilters(false)}
                            />
                        ) : (
                            <ArrowDownIcon
                                className="cursor-pointer"
                                size={16}
                                onClick={() => setToggleFilters(true)}
                            />
                        )}
                    </div>
                    {toggleFilters && (
                        <div className="flex flex-col gap-1">
                            {categories.map((category) => (
                                <label
                                    key={category.id}
                                    className="cursor-pointer select-none flex items-center gap-2"
                                >
                                    <input
                                        type="checkbox"
                                        checked={selectedCategories.includes(category.id)}
                                        onChange={() => onToggleCategory(category.id)}
                                    />
                                    <span>{category.name}</span>
                                </label>
                            ))}
                        </div>
                    )}
                </div>
                <div className="w-full h-0.5 my-3 bg-gray-200" />

                <div className="flex justify-between gap-5">
                    <h3 className="text-md max-w-[10rem] font-medium">
                        Только требующие доработок
                    </h3>
                    <button
                        type="button"
                        role="switch"
                        aria-checked={onlyNeedsRevision}
                        onClick={onToggleNeedsRevision}
                        className={`cursor-pointer relative h-[20px] w-[36px] rounded-full transition-colors ${
                            onlyNeedsRevision ? "bg-[var(--accent)]" : "bg-[var(--soft-border)]"
                        }`}
                    >
                        <span
                            className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform ${
                                onlyNeedsRevision ? "translate-x-0.5" : "-translate-x-5"
                            }`}
                        />
                    </button>
                </div>
            </div>
            <button
                type="button"
                onClick={onReset}
                disabled={!hasActiveFilters}
                className={`w-full p-3 rounded-md transition-colors ${
                    hasActiveFilters
                        ? "cursor-pointer bg-white text-[var(--text-main)]"
                        : "cursor-default bg-[var(--soft-border)] text-[var(--text-muted)]"
                }`}
            >
                Сбросить фильтр
            </button>
        </aside>
    );
};
