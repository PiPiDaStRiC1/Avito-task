import { Edit3 } from "lucide-react";
import PlaceHolder from "@/assets/cover2.png";
import { Link } from "react-router-dom";

const mockedItem = {
    id: "1",
    title: "MacBook Pro 16”",
    price: 64000,
    publishedAt: "10 марта 22:39",
    updatedAt: "10 марта 23:12",
    description:
        'Продаю свой MacBook Pro 16" (2021) на чипе M1 Pro. Состояние отличное, работал бережно. Мощности хватает на всё: от сложного монтажа до кода, при этом ноутбук почти не греется.',
    needsRevision: true,
    missingFields: ["Цвет", "Состояние"],
    characteristics: [
        { label: "Тип", value: "Ноутбук" },
        { label: "Бренд", value: "Apple" },
        { label: "Модель", value: "M1 Pro" },
        { label: "Цвет", value: "Серый" },
        { label: "Состояние", value: "Б/У" },
    ],
};

export const AdItem = () => {
    return (
        <article className="flex flex-col gap-5 text-[var(--text-main)]">
            <header className="flex flex-col gap-4 border-b border-[var(--soft-border)] pb-5 lg:flex-row lg:items-start lg:justify-between lg:gap-8">
                <div className="space-y-3">
                    <h1 className="text-[31px] leading-none font-semibold tracking-[-0.02em]">
                        {mockedItem.title}
                    </h1>
                    <Link
                        to={`/ads/${mockedItem.id}/edit`}
                        className="cursor-pointer inline-flex h-9 items-center gap-2 rounded-lg bg-[var(--accent)] px-3 text-sm font-medium text-white"
                    >
                        Редактировать
                        <Edit3 size={15} />
                    </Link>
                </div>

                <div className="text-right">
                    <p className="text-[31px] leading-none font-semibold tracking-[-0.02em]">
                        {mockedItem.price} ₽
                    </p>
                    <div className="mt-4 space-y-1 text-sm text-[var(--text-muted)]">
                        <p>Опубликовано: {mockedItem.publishedAt}</p>
                        <p>Отредактировано: {mockedItem.updatedAt}</p>
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
                    {mockedItem.needsRevision && (
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
                                        {mockedItem.missingFields.map((field) => (
                                            <li key={field}>{field}</li>
                                        ))}
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
                            {mockedItem.characteristics.map((item) => (
                                <dl key={item.label} className="contents">
                                    <dt className="text-[var(--text-muted)]">{item.label}</dt>
                                    <dd className="text-[var(--text-main)]">{item.value}</dd>
                                </dl>
                            ))}
                        </dl>
                    </section>
                </div>

                <section className="space-y-3 xl:col-span-2">
                    <h2 className="text-[22px] leading-none font-semibold tracking-[-0.01em]">
                        Описание
                    </h2>
                    <p className="max-w-[470px] text-sm leading-5 text-[var(--text-main)]/90">
                        {mockedItem.description}
                    </p>
                </section>
            </section>
        </article>
    );
};
