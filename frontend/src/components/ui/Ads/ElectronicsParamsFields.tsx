import { FormField, FormInput } from "@/components";
import type { UseFormRegister, UseFormSetValue } from "react-hook-form";
import type { ElectronicsItemParams } from "@shared/types/adParams";
import type { ItemUpdateIn } from "@shared/schemas";

type ElectronicsParamsFieldsProps = {
    register: UseFormRegister<ItemUpdateIn>;
    setValue: UseFormSetValue<ItemUpdateIn>;
    params: Partial<ElectronicsItemParams>;
    paramErrors: Record<string, { message?: string | undefined } | undefined>;
    activeAiField: "price" | "description" | null;
    onToggleAi: (fieldId: "price" | "description") => void;
};

export const ElectronicsParamsFields = ({
    register,
    setValue,
    params,
    paramErrors,
    activeAiField,
    onToggleAi,
}: ElectronicsParamsFieldsProps) => {
    const typeValue = params?.type;
    const brandValue = params?.brand;
    const modelValue = params?.model;
    const conditionValue = params?.condition;
    const colorValue = params?.color;

    const typeRegister = register("params.type", {
        setValueAs: (value: string) => (value === "" ? undefined : value),
    });
    const conditionRegister = register("params.condition", {
        setValueAs: (value: string) => (value === "" ? undefined : value),
    });

    return (
        <>
            <FormField label="Тип" activeAiField={activeAiField} onToggleAi={onToggleAi}>
                <select
                    {...typeRegister}
                    onChange={typeRegister.onChange}
                    className={`h-10 w-full rounded-lg border bg-white px-3 text-sm text-[var(--text-main)] outline-none focus:border-[var(--accent)] ${
                        typeof typeValue === "string" && typeValue
                            ? "border-[var(--soft-border)]"
                            : "border-orange-400"
                    }`}
                >
                    <option value="">Не выбрано</option>
                    <option value="phone">Телефон</option>
                    <option value="laptop">Ноутбук</option>
                    <option value="misc">Другое</option>
                </select>
            </FormField>

            <FormField label="Бренд" activeAiField={activeAiField} onToggleAi={onToggleAi}>
                <FormInput
                    registerProps={register("params.brand", {
                        setValueAs: (v: string) => (v.trim() === "" ? undefined : v.trim()),
                    })}
                    currentValue={typeof brandValue === "string" ? brandValue : ""}
                    onClear={() => {
                        setValue("params.brand", undefined, {
                            shouldDirty: true,
                            shouldValidate: true,
                        });
                    }}
                    placeholder="Введите бренд"
                    className={
                        typeof brandValue === "string" && brandValue
                            ? ""
                            : "border-orange-400 focus:border-orange-400"
                    }
                    error={paramErrors?.["brand"]?.message}
                />
            </FormField>

            <FormField label="Модель" activeAiField={activeAiField} onToggleAi={onToggleAi}>
                <FormInput
                    registerProps={register("params.model", {
                        setValueAs: (v: string) => (v.trim() === "" ? undefined : v.trim()),
                    })}
                    currentValue={typeof modelValue === "string" ? modelValue : ""}
                    onClear={() => {
                        setValue("params.model", undefined, {
                            shouldDirty: true,
                            shouldValidate: true,
                        });
                    }}
                    placeholder="Введите модель"
                    className={
                        typeof modelValue === "string" && modelValue
                            ? ""
                            : "border-orange-400 focus:border-orange-400"
                    }
                    error={paramErrors?.["model"]?.message}
                />
            </FormField>

            <FormField label="Состояние" activeAiField={activeAiField} onToggleAi={onToggleAi}>
                <select
                    {...conditionRegister}
                    onChange={conditionRegister.onChange}
                    className={`h-10 w-full rounded-lg border bg-white px-3 text-sm text-[var(--text-main)] outline-none focus:border-[var(--accent)] ${
                        typeof conditionValue === "string" && conditionValue
                            ? "border-[var(--soft-border)]"
                            : "border-orange-400"
                    }`}
                >
                    <option value="">Не выбрано</option>
                    <option value="new">Новый</option>
                    <option value="used">Б/У</option>
                </select>
            </FormField>

            <FormField label="Цвет" activeAiField={activeAiField} onToggleAi={onToggleAi}>
                <FormInput
                    registerProps={register("params.color", {
                        setValueAs: (v: string) => (v.trim() === "" ? undefined : v.trim()),
                    })}
                    currentValue={typeof colorValue === "string" ? colorValue : ""}
                    onClear={() => {
                        setValue("params.color", undefined, {
                            shouldDirty: true,
                            shouldValidate: true,
                        });
                    }}
                    placeholder="Введите цвет"
                    className={
                        typeof colorValue === "string" && colorValue
                            ? ""
                            : "border-orange-400 focus:border-orange-400"
                    }
                    error={paramErrors?.["color"]?.message}
                />
            </FormField>
        </>
    );
};
