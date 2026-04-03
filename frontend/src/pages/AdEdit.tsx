import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { AITip, AIResponse, FormField, FormInput } from "@/components";

type AiFieldId = "price" | "description";

export const AdEdit = () => {
    const { id } = useParams<{ id: string }>();
    const [activeAiField, setActiveAiField] = useState<AiFieldId | null>(null);

    const [category, setCategory] = useState("electronics");
    const [title, setTitle] = useState('MacBook Pro 16"');
    const [price, setPrice] = useState("64000");
    const [type, setType] = useState("laptop");
    const [brand, setBrand] = useState("Apple");
    const [model, setModel] = useState("M1 Pro");
    const [color, setColor] = useState("");
    const [condition, setCondition] = useState("Б/У");
    const [description, setDescription] = useState(
        'Продаю свой MacBook Pro 16" (2021) на чипе M1 Pro. Состояние отличное, работал бережно. Мощности хватает на всё: от сложного монтажа до кода, при этом ноутбук почти не греется.',
    );

    const handleToggleAi = (fieldId: AiFieldId) => {
        setActiveAiField((currentField) => (currentField === fieldId ? null : fieldId));
    };

    return (
        <article className="rounded-2xl border border-[var(--soft-border)] bg-[var(--panel-bg)] px-6 py-5 sm:px-7">
            <h1 className="text-3xl leading-none font-semibold tracking-[-0.03em] text-[var(--text-main)]">
                Редактирование объявления
            </h1>

            <form className="mt-6 space-y-6">
                <div className="space-y-4">
                    <FormField
                        label="Категория"
                        activeAiField={activeAiField}
                        onToggleAi={handleToggleAi}
                    >
                        <select
                            value={category}
                            onChange={(event) => setCategory(event.target.value)}
                            className="h-10 w-full rounded-lg border border-[var(--soft-border)] bg-white px-3 text-sm text-[var(--text-main)] outline-none focus:border-[var(--accent)]"
                        >
                            <option value="electronics">Электроника</option>
                            <option value="auto">Авто</option>
                            <option value="real_estate">Недвижимость</option>
                        </select>
                    </FormField>

                    <div className="h-px w-full bg-[var(--soft-border)]" />

                    <FormField
                        label="Название"
                        required
                        activeAiField={activeAiField}
                        onToggleAi={handleToggleAi}
                    >
                        <FormInput
                            value={title}
                            onChange={setTitle}
                            placeholder="Введите название объявления"
                        />
                    </FormField>

                    <div className="h-px w-full bg-[var(--soft-border)]" />

                    <FormField
                        label="Цена"
                        required
                        aiMessage="Узнать рыночную цену"
                        aiFieldId="price"
                        activeAiField={activeAiField}
                        onToggleAi={handleToggleAi}
                    >
                        <FormInput value={price} onChange={setPrice} placeholder="Введите цену" />
                    </FormField>
                </div>

                <div className="h-px w-full bg-[var(--soft-border)]" />

                <section className="space-y-3">
                    <h2 className="text-2xl leading-none font-semibold tracking-[-0.02em] text-[var(--text-main)]">
                        Характеристики
                    </h2>

                    <div className="space-y-3">
                        <FormField
                            label="Тип"
                            required
                            activeAiField={activeAiField}
                            onToggleAi={handleToggleAi}
                        >
                            <select
                                value={type}
                                onChange={(event) => setType(event.target.value)}
                                className="h-10 w-full rounded-lg border border-[var(--soft-border)] bg-white px-3 text-sm text-[var(--text-main)] outline-none focus:border-[var(--accent)]"
                            >
                                <option value="laptop">Ноутбук</option>
                                <option value="phone">Телефон</option>
                                <option value="misc">Другое</option>
                            </select>
                        </FormField>

                        <FormField
                            label="Бренд"
                            activeAiField={activeAiField}
                            onToggleAi={handleToggleAi}
                        >
                            <FormInput
                                value={brand}
                                onChange={setBrand}
                                placeholder="Введите бренд"
                            />
                        </FormField>

                        <FormField
                            label="Модель"
                            activeAiField={activeAiField}
                            onToggleAi={handleToggleAi}
                        >
                            <FormInput
                                value={model}
                                onChange={setModel}
                                placeholder="Введите модель"
                            />
                        </FormField>

                        <FormField
                            label="Цвет"
                            activeAiField={activeAiField}
                            onToggleAi={handleToggleAi}
                        >
                            <FormInput
                                value={color}
                                onChange={setColor}
                                placeholder="Введите цвет"
                            />
                        </FormField>

                        <FormField
                            label="Состояние"
                            activeAiField={activeAiField}
                            onToggleAi={handleToggleAi}
                        >
                            <FormInput
                                value={condition}
                                onChange={setCondition}
                                placeholder="Введите состояние"
                            />
                        </FormField>
                    </div>
                </section>

                <div className="h-px w-full bg-[var(--soft-border)]" />

                <section className="space-y-2">
                    <h2 className="text-2xl leading-none font-semibold tracking-[-0.02em] text-[var(--text-main)]">
                        Описание
                    </h2>

                    <div className="grid grid-cols-1 lg:grid-cols-2">
                        <div className="col-span-2">
                            <textarea
                                value={description}
                                onChange={(event) => setDescription(event.target.value)}
                                maxLength={1000}
                                rows={4}
                                className="w-full rounded-lg border border-[var(--soft-border)] bg-white px-3 py-2 text-sm text-[var(--text-main)] outline-none focus:border-[var(--accent)]"
                            />
                            <div className="mt-1 flex justify-end">
                                <span className="text-sm text-[var(--text-muted)]">
                                    {description.length} / 1000
                                </span>
                            </div>
                        </div>

                        <div className="w-fit lg:pt-1">
                            <AITip
                                message="Улучшить описание"
                                onClick={() => handleToggleAi("description")}
                                isActive={activeAiField === "description"}
                            />
                            {activeAiField === "description" && (
                                <div className="mt-2">
                                    <AIResponse />
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                <div className="flex gap-2 pt-1">
                    <button
                        type="button"
                        className="cursor-pointer flex justify-center items-center h-10 rounded-lg bg-[var(--accent)] px-5 text-sm font-medium text-white"
                    >
                        Сохранить
                    </button>
                    <Link
                        to={`/ads/${id}`}
                        className="cursor-pointer flex justify-center items-center h-10 rounded-lg border border-[var(--soft-border)] bg-white px-5 text-sm font-medium text-[var(--text-muted)]"
                    >
                        Отменить
                    </Link>
                </div>
            </form>
        </article>
    );
};
