import { List, AppWindow, Search as SearchIcon } from "lucide-react";
// import Appstore from "@/assets/Appstore.svg";
// import UnorderedList from "@/assets/UnorderedList.svg";

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
        <div className="col-span-full border-2 border-gray-300 rounded-lg p-3 bg-white">
            <div className="flex justify-between item-center gap-7">
                <div className="relative flex-grow">
                    <input
                        type="text"
                        placeholder="Найти объявление..."
                        className="w-full p-1 rounded-md  border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <SearchIcon
                        size={16}
                        className="absolute top-1/2 right-3 transform -translate-y-1/2"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <AppWindow />
                    <List />
                </div>
                <select name="search_params" id="search_params" className="bg-white">
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
