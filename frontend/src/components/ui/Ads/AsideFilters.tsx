import { useState } from "react";
import { ArrowUpIcon, ArrowDownIcon } from "lucide-react";

interface Category {
    name: string;
    id: string;
}

const categories: Category[] = [
    { name: "Авто", id: "auto" },
    { name: "Недвижимость", id: "real_estate" },
    { name: "Электроника", id: "electronics" },
];

export const AsideFilters = () => {
    const [toggleFilters, setToggleFilters] = useState(false);

    return (
        <div className="col-span-3 flex flex-col gap-3">
            <div className="bg-white rounded-lg p-3">
                <h2 className="text-lg font-medium">Фильтры</h2>
                <div className="flex flex-col gap-3">
                    <div className="flex justify-between items-center">
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
                                <label key={category.id} className="flex items-center gap-2">
                                    <input type="checkbox" />
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
                    <ArrowDownIcon />
                </div>
            </div>
            <button type="button" className="w-full bg-white p-3 cursor-pointer rounded-md">
                Сбросить фильтр
            </button>
        </div>
    );
};
