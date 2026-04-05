import { FormField, FormInput } from "@/components";
import type { UseFormRegister, UseFormSetValue } from "react-hook-form";
import type { RealEstateItemParams } from "@shared/types/adParams";
import type { ItemUpdateIn } from "@shared/schemas";

type RealEstateParamsFieldsProps = {
    register: UseFormRegister<ItemUpdateIn>;
    setValue: UseFormSetValue<ItemUpdateIn>;
    params: Partial<RealEstateItemParams>;
    paramErrors: Record<string, { message?: string | undefined } | undefined>;
    activeAiField: "price" | "description" | null;
    onToggleAi: (fieldId: "price" | "description") => void;
};

export const RealEstateParamsFields = ({
    register,
    setValue,
    params,
    paramErrors,
    activeAiField,
    onToggleAi,
}: RealEstateParamsFieldsProps) => {
    const typeValue = params?.type;
    const addressValue = params?.address;
    const areaValue = params?.area;
    const floorValue = params?.floor;

    const typeRegister = register("params.type", {
        setValueAs: (value: string) => (value === "" ? undefined : value),
    });

    return (
        <>
            <FormField label="Тип" activeAiField={activeAiField} onToggleAi={onToggleAi}>
                <select
                    {...typeRegister}
                    onChange={typeRegister.onChange}
                    className={`h-10 w-full rounded-lg border bg-[var(--card-bg)] px-3 text-sm text-[var(--input-text)] outline-none focus:border-[var(--accent)] ${
                        typeof typeValue === "string" && typeValue
                            ? "border-[var(--soft-border)]"
                            : "border-orange-400"
                    }`}
                >
                    <option value="">Не выбрано</option>
                    <option value="flat">Квартира</option>
                    <option value="house">Дом</option>
                    <option value="room">Комната</option>
                </select>
            </FormField>

            <FormField label="Адрес" activeAiField={activeAiField} onToggleAi={onToggleAi}>
                <FormInput
                    registerProps={register("params.address", {
                        setValueAs: (v: string) => (v.trim() === "" ? undefined : v.trim()),
                    })}
                    currentValue={typeof addressValue === "string" ? addressValue : ""}
                    onClear={() => {
                        setValue("params.address", undefined, {
                            shouldDirty: true,
                            shouldValidate: true,
                        });
                    }}
                    placeholder="Введите адрес"
                    className={
                        typeof addressValue === "string" && addressValue
                            ? ""
                            : "border-orange-400 focus:border-orange-400"
                    }
                    error={paramErrors?.["address"]?.message}
                />
            </FormField>

            <FormField label="Площадь" activeAiField={activeAiField} onToggleAi={onToggleAi}>
                <FormInput
                    registerProps={register("params.area", {
                        setValueAs: (v: string) => {
                            if (v === "") return undefined;
                            const n = Number(v);
                            return Number.isFinite(n) ? n : undefined;
                        },
                    })}
                    currentValue={typeof areaValue === "number" ? String(areaValue) : ""}
                    onClear={() => {
                        setValue("params.area", undefined, {
                            shouldDirty: true,
                            shouldValidate: true,
                        });
                    }}
                    type="number"
                    placeholder="Введите площадь"
                    className={
                        typeof areaValue === "number"
                            ? ""
                            : "border-orange-400 focus:border-orange-400"
                    }
                    error={paramErrors?.["area"]?.message}
                />
            </FormField>

            <FormField label="Этаж" activeAiField={activeAiField} onToggleAi={onToggleAi}>
                <FormInput
                    registerProps={register("params.floor", {
                        setValueAs: (v: string) => {
                            if (v === "") return undefined;
                            const n = Number(v);
                            return Number.isFinite(n) ? n : undefined;
                        },
                    })}
                    currentValue={typeof floorValue === "number" ? String(floorValue) : ""}
                    onClear={() => {
                        setValue("params.floor", undefined, {
                            shouldDirty: true,
                            shouldValidate: true,
                        });
                    }}
                    type="number"
                    placeholder="Введите этаж"
                    className={
                        typeof floorValue === "number"
                            ? ""
                            : "border-orange-400 focus:border-orange-400"
                    }
                    error={paramErrors?.["floor"]?.message}
                />
            </FormField>
        </>
    );
};
