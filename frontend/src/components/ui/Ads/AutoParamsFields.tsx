import { FormField, FormInput } from "@/components";
import type { UseFormRegister, UseFormSetValue } from "react-hook-form";
import type { AutoItemParams } from "@shared/types/adParams";
import type { ItemUpdateIn } from "@shared/schemas";

type AutoParamsFieldsProps = {
    register: UseFormRegister<ItemUpdateIn>;
    setValue: UseFormSetValue<ItemUpdateIn>;
    params: Partial<AutoItemParams>;
    paramErrors: Record<string, { message?: string | undefined } | undefined>;
    activeAiField: "price" | "description" | null;
    onToggleAi: (fieldId: "price" | "description") => void;
};

export const AutoParamsFields = ({
    register,
    setValue,
    params,
    paramErrors,
    activeAiField,
    onToggleAi,
}: AutoParamsFieldsProps) => {
    const brandValue = params?.brand;
    const modelValue = params?.model;
    const yearValue = params?.yearOfManufacture;
    const transmissionValue = params?.transmission;
    const mileageValue = params?.mileage;
    const powerValue = params?.enginePower;

    const transmissionRegister = register("params.transmission", {
        setValueAs: (value: string) => (value === "" ? undefined : value),
    });

    return (
        <>
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

            <FormField label="Год выпуска" activeAiField={activeAiField} onToggleAi={onToggleAi}>
                <FormInput
                    registerProps={register("params.yearOfManufacture", {
                        setValueAs: (v: string) => {
                            if (v === "") return undefined;
                            const n = Number(v);
                            return Number.isFinite(n) ? n : undefined;
                        },
                    })}
                    currentValue={typeof yearValue === "number" ? String(yearValue) : ""}
                    onClear={() => {
                        setValue("params.yearOfManufacture", undefined, {
                            shouldDirty: true,
                            shouldValidate: true,
                        });
                    }}
                    type="number"
                    placeholder="Введите год выпуска"
                    className={
                        typeof yearValue === "number"
                            ? ""
                            : "border-orange-400 focus:border-orange-400"
                    }
                    error={paramErrors?.["yearOfManufacture"]?.message}
                />
            </FormField>

            <FormField label="Трансмиссия" activeAiField={activeAiField} onToggleAi={onToggleAi}>
                <select
                    {...transmissionRegister}
                    onChange={transmissionRegister.onChange}
                    className={`h-10 w-full rounded-lg border bg-[var(--card-bg)] px-3 text-sm text-[var(--input-text)] outline-none focus:border-[var(--accent)] ${
                        typeof transmissionValue === "string" && transmissionValue
                            ? "border-[var(--soft-border)]"
                            : "border-orange-400"
                    }`}
                >
                    <option value="">Не выбрано</option>
                    <option value="automatic">Автомат</option>
                    <option value="manual">Механика</option>
                </select>
            </FormField>

            <FormField label="Пробег" activeAiField={activeAiField} onToggleAi={onToggleAi}>
                <FormInput
                    registerProps={register("params.mileage", {
                        setValueAs: (v: string) => {
                            if (v === "") return undefined;
                            const n = Number(v);
                            return Number.isFinite(n) ? n : undefined;
                        },
                    })}
                    currentValue={typeof mileageValue === "number" ? String(mileageValue) : ""}
                    onClear={() => {
                        setValue("params.mileage", undefined, {
                            shouldDirty: true,
                            shouldValidate: true,
                        });
                    }}
                    type="number"
                    placeholder="Введите пробег"
                    className={
                        typeof mileageValue === "number"
                            ? ""
                            : "border-orange-400 focus:border-orange-400"
                    }
                    error={paramErrors?.["mileage"]?.message}
                />
            </FormField>

            <FormField
                label="Мощность двигателя"
                activeAiField={activeAiField}
                onToggleAi={onToggleAi}
            >
                <FormInput
                    registerProps={register("params.enginePower", {
                        setValueAs: (v: string) => {
                            if (v === "") return undefined;
                            const n = Number(v);
                            return Number.isFinite(n) ? n : undefined;
                        },
                    })}
                    currentValue={typeof powerValue === "number" ? String(powerValue) : ""}
                    onClear={() => {
                        setValue("params.enginePower", undefined, {
                            shouldDirty: true,
                            shouldValidate: true,
                        });
                    }}
                    type="number"
                    placeholder="Введите мощность"
                    className={
                        typeof powerValue === "number"
                            ? ""
                            : "border-orange-400 focus:border-orange-400"
                    }
                    error={paramErrors?.["enginePower"]?.message}
                />
            </FormField>
        </>
    );
};
