import { Edit3, ArrowLeft } from "lucide-react";
import PlaceHolder from "@/assets/cover2.png";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import { categoryMap } from "@/lib/constants";
import { AdItemSkeleton, ErrorState } from "@/components";
import type { ItemListItem } from "@shared/types";

const formatDate = (date: string) =>
    new Date(date).toLocaleString("ru-RU", {
        day: "2-digit",
        month: "long",
        hour: "2-digit",
        minute: "2-digit",
    });

const getCharacteristics = (item: ItemListItem) => {
    switch (item.category) {
        case "electronics":
            return [
                { label: "Тип", value: item.params.type },
                { label: "Бренд", value: item.params.brand },
                { label: "Модель", value: item.params.model },
                { label: "Цвет", value: item.params.color },
                { label: "Состояние", value: item.params.condition },
            ];
        case "auto":
            return [
                { label: "Бренд", value: item.params.brand },
                { label: "Модель", value: item.params.model },
                { label: "Год", value: item.params.yearOfManufacture?.toString() },
                { label: "Пробег", value: item.params.mileage?.toString() },
                { label: "КПП", value: item.params.transmission },
            ];
        case "real_estate":
            return [
                { label: "Тип", value: item.params.type },
                { label: "Адрес", value: item.params.address },
                { label: "Площадь", value: item.params.area?.toString() },
                { label: "Этаж", value: item.params.floor?.toString() },
                { label: "Категория", value: categoryMap[item.category] },
            ];
        default:
            return [];
    }
};

export const AdItem = () => {
    const { id } = useParams<{ id: string }>();

    const {
        data: item,
        isLoading,
        isError,
        refetch,
    } = useQuery<ItemListItem>({
        queryKey: ["ad", id],
        queryFn: () => apiClient.getAdById(id!),
        staleTime: 10 * 60 * 1000,
        enabled: Boolean(id),
    });

    if (isLoading) {
        return <AdItemSkeleton />;
    }

    if (isError) {
        return (
            <ErrorState
                title="Ошибка загрузки объявления"
                message="Не получилось получить карточку объявления."
                onRetry={refetch}
            />
        );
    }

    if (!item) {
        return (
            <ErrorState
                title="Объявление не найдено"
                message="Похоже, объявление было удалено или ссылка неверна."
                onRetry={refetch}
            />
        );
    }

    const allCharacteristics = getCharacteristics(item);
    const characteristics = allCharacteristics.filter((entry) => Boolean(entry.value));
    const missingFields = allCharacteristics
        .filter((entry) => !entry.value)
        .map((entry) => entry.label);

    const needsRevision = item.needsRevision;

    return (
        <article className="flex flex-col gap-5 text-[var(--text-main)]">
            <header className="flex flex-col gap-4 border-b border-[var(--soft-border)] pb-5 lg:flex-row lg:items-start lg:justify-between lg:gap-8">
                <div className="space-y-3">
                    <div className="flex items-center justify-center gap-2">
                        <Link
                            to="/ads"
                            className="inline-flex items-center gap-1 text-sm text-[var(--text-muted)]"
                        >
                            <ArrowLeft size={15} />
                        </Link>
                        <h1 className="text-[31px] leading-none font-semibold tracking-[-0.02em]">
                            {item.title}
                        </h1>
                    </div>
                    <Link
                        to={`/ads/${item.id}/edit`}
                        className="cursor-pointer inline-flex h-9 items-center gap-2 rounded-lg bg-[var(--accent)] px-3 text-sm font-medium text-white"
                    >
                        Редактировать
                        <Edit3 size={15} />
                    </Link>
                </div>

                <div className="text-right">
                    <p className="text-[31px] leading-none font-semibold tracking-[-0.02em]">
                        {item.price ?? "—"} ₽
                    </p>
                    <div className="mt-4 space-y-1 text-sm text-[var(--text-muted)]">
                        <p>Опубликовано: {formatDate(item.createdAt)}</p>
                        <p>Отредактировано: {formatDate(item.updatedAt)}</p>
                    </div>
                </div>
            </header>

            <section className="grid grid-cols-1 gap-6 xl:grid-cols-6 xl:items-start">
                <div className="w-full min-h-[320px] overflow-hidden rounded-sm bg-[var(--image-bg)] xl:col-span-2">
                    <img
                        src={PlaceHolder}
                        alt="placeholder"
                        className="h-full w-full object-cover"
                    />
                </div>

                <div className="col-span-2 space-y-6 xl:col-span-4">
                    {needsRevision && (
                        <aside className="max-w-[512px] rounded-lg border border-[#ead7ba] bg-[var(--warning-bg)] px-4 py-3 shadow-lg">
                            <div className="flex items-start gap-3">
                                <span className="mt-0.5 inline-flex h-4 w-4 flex-none items-center justify-center rounded-full bg-[#ffb84d] text-[10px] font-bold text-white">
                                    !
                                </span>
                                <div>
                                    <h2 className="text-sm font-semibold text-[var(--text-main)]">
                                        Требуются доработки
                                    </h2>
                                    <p className="mt-2 text-sm text-[var(--text-main)]/80">
                                        У объявления не заполнены поля:
                                    </p>
                                    <ul className="mt-1.5 list-disc space-y-0.5 pl-5 text-sm text-[var(--text-main)]/80">
                                        {missingFields.map((field) => (
                                            <li key={field}>{field}</li>
                                        ))}
                                        {item.description === "" && <li>Описание</li>}
                                    </ul>
                                </div>
                            </div>
                        </aside>
                    )}

                    <section className="space-y-4">
                        <h2 className="text-[22px] leading-none font-semibold tracking-[-0.01em]">
                            Характеристики
                        </h2>

                        <dl className="grid max-w-[320px] grid-cols-[112px_minmax(0,1fr)] gap-x-6 gap-y-2 text-sm">
                            {characteristics.map((entry) => (
                                <div key={entry.label} className="contents">
                                    <dt className="text-[var(--text-muted)]">{entry.label}</dt>
                                    <dd className="text-[var(--text-main)]">{entry.value}</dd>
                                </div>
                            ))}
                        </dl>
                    </section>
                </div>

                <section className="space-y-3 xl:col-span-2">
                    <h2 className="text-xl leading-none font-semibold tracking-[-0.01em]">
                        Описание
                    </h2>
                    <p className="max-w-[470px] text-sm leading-5 text-[var(--text-main)]/90">
                        {item.description ?? "Описание пока не добавлено."}
                    </p>
                </section>
            </section>
        </article>
    );
};
