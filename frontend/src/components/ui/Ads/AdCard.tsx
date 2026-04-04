import PlaceHolder from "@/assets/cover.png";
import { memo } from "react";
import { Link } from "react-router-dom";
import { categoryMap } from "@/lib/constants";
import type { ItemListItem } from "@shared/types";

interface AdCardProps {
    ad: ItemListItem;
}

export const AdCard = memo(({ ad }: AdCardProps) => {
    const { id, category, title, price, needsRevision } = ad;
    const categoryName = categoryMap[category] || "Другое";

    return (
        <Link to={`/ads/${id}`} className="h-full">
            <article className="cursor-pointer flex h-full min-h-[252px] flex-col overflow-hidden rounded-2xl border border-[var(--soft-border)] bg-[var(--card-bg)] transition-shadow duration-200 hover:shadow-lg">
                <div className="flex h-[126px] items-center justify-center">
                    <img
                        src={PlaceHolder}
                        alt="placeholder"
                        className="object-contain opacity-90"
                    />
                </div>

                <div className="z-10 flex flex-1 flex-col gap-2 px-3 pb-3 pt-2.5 -mt-2">
                    <span className="inline-flex w-fit rounded-md border border-[var(--chip-border)] bg-[var(--card-bg)] px-2 py-0.5 text-xs leading-4 text-[var(--text-muted)]">
                        {categoryName}
                    </span>
                    <h3 className="min-h-10 text-[15px] leading-5 font-medium text-[var(--text-main)]">
                        {title}
                    </h3>
                    <p className="text-[22px] leading-none font-semibold text-[var(--text-main)]">
                        {price} ₽
                    </p>

                    <div className="min-h-[26px] pt-1">
                        {needsRevision ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-[var(--warning-bg)] px-2.5 py-1 text-xs font-medium text-[var(--warning-text)]">
                                <span className="h-1.5 w-1.5 rounded-full bg-[var(--warning-text)]" />
                                Требует доработок
                            </span>
                        ) : (
                            <span className="invisible inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium">
                                <span className="h-1.5 w-1.5 rounded-full" />
                                Требует доработок
                            </span>
                        )}
                    </div>
                </div>
            </article>
        </Link>
    );
});
