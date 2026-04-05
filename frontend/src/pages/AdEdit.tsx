import { useEffect, useRef, type ChangeEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AITip, AIResponse, AdEditSkeleton, ErrorState, FormField, FormInput } from "@/components";
import { apiClient } from "@/lib/api";
import { ItemUpdateInSchema, type ItemUpdateIn } from "@shared/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { AutoParamsFields, ElectronicsParamsFields, RealEstateParamsFields } from "@/components/ui";
import { useAI } from "@/hooks";
import toast from "react-hot-toast";
import type { ItemListItem } from "@shared/types";
import type {
    AutoItemParams,
    ElectronicsItemParams,
    RealEstateItemParams,
} from "@shared/types/adParams";

type Category = ItemListItem["category"];

type CategoryMeta = { heading: string };

const CATEGORY_META: Record<Category, CategoryMeta> = {
    electronics: { heading: "Характеристики электроники" },
    auto: { heading: "Характеристики автомобиля" },
    real_estate: { heading: "Характеристики недвижимости" },
};

export const AdEdit = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const isDraftHydratedRef = useRef(false);

    const {
        formState: { errors, isValid, isSubmitting },
        handleSubmit,
        register,
        setValue,
        reset,
        control,
    } = useForm<ItemUpdateIn>({ resolver: zodResolver(ItemUpdateInSchema), mode: "onChange" });

    const {
        data: item,
        isLoading,
        isError,
        refetch,
    } = useQuery<ItemListItem>({
        queryKey: ["ad", id, "edit"],
        queryFn: () => apiClient.getAdById(id!),
        staleTime: 10 * 60 * 1000,
        enabled: Boolean(id),
    });

    const formValues = useWatch({ control });

    const draftKey = id ? `ad-edit-draft:${id}` : null;
    const aiStorageKey = id ? `ad-edit-ai-state:${id}` : null;
    const currentCategory = formValues.category ?? item?.category ?? "electronics";
    const categoryMeta = CATEGORY_META[currentCategory];

    const toAiPayload = () => ({
        category: currentCategory,
        title: formValues.title ?? "",
        description: formValues.description ?? "",
        price: formValues.price ?? 0,
        params: (formValues.params as Record<string, unknown> | undefined) ?? {},
    });

    const { activeAiField, aiState, requestAiSuggestion, handleToggleAi, closeAiPanel } = useAI({
        storageKey: aiStorageKey,
    });

    useEffect(() => {
        if (!item || !draftKey) return;

        const savedDraft = localStorage.getItem(draftKey);
        if (savedDraft) {
            try {
                const parsedJson = JSON.parse(savedDraft);
                const parsed = ItemUpdateInSchema.safeParse(parsedJson);
                if (parsed.success) {
                    reset(parsed.data);
                    isDraftHydratedRef.current = true;
                    return;
                }
            } catch {
                localStorage.removeItem(draftKey);
            }
        }

        const rawParams =
            item.params && typeof item.params === "object"
                ? (item.params as Record<string, unknown>)
                : {};

        const readText = (key: string) => {
            const value = rawParams[key];
            if (typeof value !== "string") return undefined;
            const normalized = value.trim();
            return normalized === "" ? undefined : normalized;
        };

        const readNumber = (key: string) => {
            const value = rawParams[key];
            if (typeof value === "number") return value;
            if (typeof value === "string" && value.trim()) {
                const parsed = Number(value);
                return isFinite(parsed) ? parsed : undefined;
            }
            return undefined;
        };

        let normalizedParams: ItemUpdateIn["params"] = {};

        if (item.category === "electronics") {
            normalizedParams = {
                type: readText("type") as ElectronicsItemParams["type"],
                brand: readText("brand"),
                model: readText("model"),
                condition: readText("condition") as ElectronicsItemParams["condition"],
                color: readText("color"),
            };
        }

        if (item.category === "auto") {
            normalizedParams = {
                brand: readText("brand"),
                model: readText("model"),
                yearOfManufacture: readNumber("yearOfManufacture"),
                transmission: readText("transmission") as AutoItemParams["transmission"],
                mileage: readNumber("mileage"),
                enginePower: readNumber("enginePower"),
            };
        }

        if (item.category === "real_estate") {
            normalizedParams = {
                type: readText("type") as RealEstateItemParams["type"],
                address: readText("address"),
                area: readNumber("area"),
                floor: readNumber("floor"),
            };
        }

        const mapped = ItemUpdateInSchema.parse({
            category: item.category,
            title: item.title ?? "",
            price: item.price ?? 0,
            description: item.description ?? "",
            params: normalizedParams,
        });
        reset(mapped);
        isDraftHydratedRef.current = true;
    }, [item, draftKey, reset]);

    useEffect(() => {
        if (!isDraftHydratedRef.current || !draftKey) return;
        localStorage.setItem(draftKey, JSON.stringify(formValues));
    }, [draftKey, formValues]);

    const handleCategoryChange = (event: ChangeEvent<HTMLSelectElement>) => {
        const nextCategory = event.target.value as Category;
        setValue("category", nextCategory, { shouldDirty: true, shouldValidate: true });
        setValue("params", {}, { shouldDirty: true, shouldValidate: true });
    };

    const onSubmit = async (values: ItemUpdateIn) => {
        try {
            if (!id) return;

            await apiClient.updateAd(id, values);

            // Invalidate all related queries to load fresh data
            await Promise.all([
                queryClient.invalidateQueries({ queryKey: ["ad", id] }),
                queryClient.invalidateQueries({ queryKey: ["ad", id, "edit"] }),
                queryClient.invalidateQueries({ queryKey: ["ads"] }),
            ]);

            if (draftKey) {
                localStorage.removeItem(draftKey);
            }

            toast.success("Изменения сохранены");
            navigate(`/ads/${id}`);
            
        // eslint-disable-next-line
        } catch (_error) {
            toast.error(
                "При попытке сохранить изменения произошла ошибка. Попробуйте ещё раз или зайдите позже.",
            );
        }
    };

    if (isLoading) {
        return <AdEditSkeleton />;
    }

    if (isError) {
        return (
            <ErrorState
                title="Ошибка загрузки объявления"
                message="Не удалось получить данные для редактирования."
                onRetry={refetch}
            />
        );
    }

    const titleRegister = register("title");
    const priceRegister = register("price", {
        setValueAs: (value: unknown) => {
            if (value === "" || value === null || value === undefined) return undefined;
            const parsed = Number(value);
            return isFinite(parsed) ? parsed : undefined;
        },
    });
    const descriptionRegister = register("description");
    const categoryError = errors.category?.message;
    const titleError = errors.title?.message;
    const priceError = errors.price?.message;
    const paramsErrors = (errors.params ?? {}) as Record<
        string,
        { message?: string | undefined } | undefined
    >;

    return (
        <article className="rounded-2xl border border-[var(--soft-border)] bg-[var(--panel-bg)] px-6 py-5 sm:px-7">
            <div className="flex gap-2 justify-start items-center">
                <Link
                    to={`/ads/${id}`}
                    className="inline-flex items-center gap-1 text-sm text-[var(--text-muted)]"
                >
                    <ArrowLeft size={15} />
                </Link>
                <h1 className="text-3xl leading-none font-semibold tracking-[-0.03em] text-[var(--text-main)]">
                    Редактирование объявления
                </h1>
            </div>

            <form className="mt-6 space-y-6" onSubmit={handleSubmit(onSubmit)}>
                <div className="space-y-4">
                    <FormField
                        label="Категория"
                        activeAiField={activeAiField}
                        onToggleAi={(fieldId) => handleToggleAi(fieldId, toAiPayload())}
                    >
                        <select
                            value={currentCategory}
                            onChange={handleCategoryChange}
                            className="h-10 w-full rounded-lg border border-[var(--soft-border)] bg-[var(--card-bg)] px-3 text-sm text-[var(--input-text)] outline-none focus:border-[var(--accent)]"
                        >
                            <option value="electronics">Электроника</option>
                            <option value="auto">Авто</option>
                            <option value="real_estate">Недвижимость</option>
                        </select>
                        {categoryError && (
                            <p className="mt-1 text-sm text-red-500">{categoryError}</p>
                        )}
                    </FormField>

                    <div className="h-px w-full bg-[var(--soft-border)]" />

                    <FormField
                        label="Название"
                        required
                        activeAiField={activeAiField}
                        onToggleAi={(fieldId) => handleToggleAi(fieldId, toAiPayload())}
                    >
                        <FormInput
                            registerProps={titleRegister}
                            currentValue={formValues.title ?? ""}
                            onClear={() => {
                                setValue("title", "", { shouldDirty: true, shouldValidate: true });
                            }}
                            placeholder="Введите название объявления"
                            error={titleError}
                        />
                    </FormField>

                    <div className="h-px w-full bg-[var(--soft-border)]" />

                    <FormField
                        label="Цена"
                        required
                        aiMessage="Узнать рыночную цену"
                        aiFieldId="price"
                        activeAiField={activeAiField}
                        onToggleAi={(fieldId) => handleToggleAi(fieldId, toAiPayload())}
                    >
                        <FormInput
                            registerProps={priceRegister}
                            currentValue={formValues.price == null ? "" : String(formValues.price)}
                            onClear={() => {
                                setValue("price", 0, { shouldDirty: true, shouldValidate: true });
                            }}
                            type="number"
                            placeholder="Введите цену"
                            error={priceError}
                        />

                        {activeAiField === "price" && (
                            <div className="mt-2">
                                <AIResponse
                                    title="Рекомендация по цене"
                                    status={
                                        aiState.loadingField === "price"
                                            ? "loading"
                                            : aiState.errorByField.price
                                              ? "error"
                                              : aiState.contentByField.price
                                                ? "success"
                                                : "idle"
                                    }
                                    content={aiState.contentByField.price ?? ""}
                                    error={aiState.errorByField.price ?? null}
                                    onRetry={() => requestAiSuggestion("price", toAiPayload())}
                                    onClose={closeAiPanel}
                                    onApply={() => {
                                        if (typeof aiState.suggestedPrice !== "number") return;
                                        setValue("price", aiState.suggestedPrice, {
                                            shouldDirty: true,
                                            shouldValidate: true,
                                        });
                                        closeAiPanel();
                                    }}
                                />
                            </div>
                        )}
                    </FormField>
                </div>

                <div className="h-px w-full bg-[var(--soft-border)]" />

                <section className="space-y-3">
                    <div className="flex items-end justify-between gap-3">
                        <h2 className="text-2xl leading-none font-semibold tracking-[-0.02em] text-[var(--text-main)]">
                            {categoryMeta.heading}
                        </h2>
                    </div>

                    <div className="space-y-3">
                        {currentCategory === "electronics" && (
                            <ElectronicsParamsFields
                                register={register}
                                setValue={setValue}
                                params={
                                    (formValues?.params as
                                        | Partial<ElectronicsItemParams>
                                        | undefined) ?? {}
                                }
                                paramErrors={paramsErrors}
                                activeAiField={activeAiField}
                                onToggleAi={(fieldId) => handleToggleAi(fieldId, toAiPayload())}
                            />
                        )}

                        {currentCategory === "auto" && (
                            <AutoParamsFields
                                register={register}
                                setValue={setValue}
                                params={
                                    (formValues?.params as Partial<AutoItemParams> | undefined) ??
                                    {}
                                }
                                paramErrors={paramsErrors}
                                activeAiField={activeAiField}
                                onToggleAi={(fieldId) => handleToggleAi(fieldId, toAiPayload())}
                            />
                        )}

                        {currentCategory === "real_estate" && (
                            <RealEstateParamsFields
                                register={register}
                                setValue={setValue}
                                params={
                                    (formValues?.params as
                                        | Partial<RealEstateItemParams>
                                        | undefined) ?? {}
                                }
                                paramErrors={paramsErrors}
                                activeAiField={activeAiField}
                                onToggleAi={(fieldId) => handleToggleAi(fieldId, toAiPayload())}
                            />
                        )}
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
                                {...descriptionRegister}
                                value={formValues.description ?? ""}
                                onChange={descriptionRegister.onChange}
                                maxLength={1000}
                                rows={4}
                                className="w-full rounded-lg border border-[var(--soft-border)] bg-[var(--card-bg)] px-3 py-2 text-sm text-[var(--input-text)] placeholder:text-[var(--text-muted)] outline-none focus:border-[var(--accent)]"
                            />
                            <div className="mt-1 flex justify-end">
                                <span className="text-sm text-[var(--text-muted)]">
                                    {(formValues.description ?? "").length} / 1000
                                </span>
                            </div>
                        </div>

                        <div className="w-fit lg:pt-1">
                            <AITip
                                message="Улучшить описание"
                                onClick={() => handleToggleAi("description", toAiPayload())}
                                isActive={activeAiField === "description"}
                            />
                            {activeAiField === "description" && (
                                <div className="mt-2">
                                    <AIResponse
                                        title="Улучшенное описание"
                                        status={
                                            aiState.loadingField === "description"
                                                ? "loading"
                                                : aiState.errorByField.description
                                                  ? "error"
                                                  : aiState.contentByField.description
                                                    ? "success"
                                                    : "idle"
                                        }
                                        content={aiState.contentByField.description ?? ""}
                                        error={aiState.errorByField.description ?? null}
                                        onRetry={() =>
                                            requestAiSuggestion("description", toAiPayload())
                                        }
                                        onClose={closeAiPanel}
                                        onApply={() => {
                                            const nextDescription =
                                                aiState.contentByField.description;
                                            if (!nextDescription) return;

                                            setValue("description", nextDescription, {
                                                shouldDirty: true,
                                                shouldValidate: true,
                                            });
                                            closeAiPanel();
                                        }}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                <div className="flex gap-2 pt-1">
                    <button
                        type="submit"
                        disabled={!isValid || isSubmitting}
                        className="disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer flex justify-center items-center h-10 rounded-lg bg-[var(--accent)] px-5 text-sm font-medium text-white"
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
