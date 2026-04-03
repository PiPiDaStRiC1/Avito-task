import { useState } from "react";
import { Search, AsideFilters, AdCard } from "@/components";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface AdItem {
    id: number;
    category: "Авто" | "Недвижимость" | "Электроника";
    title: string;
    price: number;
    needsRevision: boolean;
}

const ads: AdItem[] = [
    { id: 1, category: "Электроника", title: "Наушники", price: 2990, needsRevision: false },
    { id: 2, category: "Авто", title: "Volkswagen Polo", price: 1100000, needsRevision: true },
    {
        id: 3,
        category: "Недвижимость",
        title: "Студия, 25м²",
        price: 15000000,
        needsRevision: false,
    },
    { id: 4, category: "Недвижимость", title: "1-кк, 44м²", price: 19000000, needsRevision: true },
    { id: 5, category: "Электроника", title: 'MacBook Pro 16"', price: 64000, needsRevision: true },
    { id: 6, category: "Авто", title: "Omoda C5", price: 2900000, needsRevision: false },
    {
        id: 7,
        category: "Электроника",
        title: "iPad Air 11, 2024 г.",
        price: 37000,
        needsRevision: false,
    },
    { id: 8, category: "Электроника", title: "MAJOR VI", price: 20000, needsRevision: false },
    { id: 9, category: "Авто", title: "Toyota Camry", price: 3900000, needsRevision: true },
    {
        id: 10,
        category: "Электроника",
        title: "iPhone 17 Pro Max",
        price: 107000,
        needsRevision: false,
    },
];

export const Ads = () => {
    const pages = ads.length / 2; // Предполагая, что на странице отображается 10   объявления
    const [activePage, setActivePage] = useState(1);

    return (
        <div className="flex flex-col gap-5">
            <h1 className="text-xl text-black font-medium">Мои объявления</h1>
            <Search />
            <div className="flex gap-5">
                <AsideFilters />
                <div className="flex flex-col gap-5">
                    <div className="w-full grid grid-cols-5 grid-rows-auto gap-5">
                        {ads.map((ad) => (
                            <div key={ad.id} className="col-span-1">
                                <AdCard ad={ad} />
                            </div>
                        ))}
                    </div>
                    <div className="grid-cols-full flex gap-2">
                        <button
                            type="button"
                            className="disabled:opacity-50 flex justify-center items-center h-8 w-8 rounded-md border border-[var(--soft-border)] bg-white text-lg leading-none text-[var(--text-muted)]"
                            aria-label="last page"
                            onClick={() => setActivePage((prev) => Math.max(prev - 1, 1))}
                            disabled={activePage === 1}
                        >
                            <ArrowLeft size={14} />
                        </button>
                        {Array.from({ length: pages }, (_, index) => (
                            <button
                                key={index}
                                type="button"
                                onClick={() => setActivePage(index + 1)}
                                className={`cursor-pointer flex justify-center items-center h-8 w-8 rounded-md bg-white text-lg ${activePage === index + 1 ? "border-2 border-[var(--accent)] text-[var(--accent)]" : "text-[var(--text-muted)]"}`}
                                aria-label={`page ${index + 1}`}
                            >
                                {index + 1}
                            </button>
                        ))}
                        <button
                            type="button"
                            className="disabled:opacity-50 cursor-pointer flex justify-center items-center h-8 w-8 rounded-md border border-[var(--soft-border)] bg-white text-lg leading-none text-[var(--text-muted)]"
                            aria-label="next page"
                            onClick={() => setActivePage((prev) => Math.min(prev + 1, pages))}
                            disabled={activePage === pages}
                        >
                            <ArrowRight size={14} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
