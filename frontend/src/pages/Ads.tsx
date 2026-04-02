import { Search, AsideFilters } from "@/components";

export const Ads = () => {
    return (
        <div className="flex flex-col gap-5">
            <h1 className="text-xl text-black font-medium">Мои объявления</h1>
            <Search />
            <div className="grid grid-cols-12 grid-rows-3">
                <AsideFilters />
            </div>
        </div>
    );
};
