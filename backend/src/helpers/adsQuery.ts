import { ItemsGetInQuerySchema, type ItemsGetInQuery } from "@shared/schemas";
import type { Item } from "@shared/types";
import { doesItemNeedRevision } from "@/utils/utils";

const sortItems = (items: Item[], query: ItemsGetInQuery) => {
    if (!query.sortColumn) {
        return items;
    }

    const sorted = [...items].sort((left, right) => {
        if (query.sortColumn === "price") {
            const leftPrice = left.price ?? 0;
            const rightPrice = right.price ?? 0;

            return leftPrice - rightPrice;
        }

        if (query.sortColumn === "title") {
            return left.title.localeCompare(right.title, "ru");
        }

        return new Date(left.createdAt).getTime() - new Date(right.createdAt).getTime();
    });

    return query.sortDirection === "desc" ? sorted.reverse() : sorted;
};

const withNeedsRevision = (items: Item[]) =>
    items.map((item) => ({ ...item, needsRevision: doesItemNeedRevision(item) }));

export const getItemsByQuery = (items: Item[], rawQuery: unknown) => {
    const query = ItemsGetInQuerySchema.parse(rawQuery);

    const filtered = items.filter((item) => {
        if (query.q && !item.title.toLowerCase().includes(query.q.toLowerCase())) {
            return false;
        }

        if (
            query.categories &&
            query.categories.length > 0 &&
            !query.categories.includes(item.category)
        ) {
            return false;
        }

        if (query.needsRevision && !doesItemNeedRevision(item)) {
            return false;
        }

        return true;
    });

    const sorted = sortItems(filtered, query);
    const total = sorted.length;
    const paginated = sorted.slice(query.skip, query.skip + query.limit);

    return { items: withNeedsRevision(paginated), total };
};
