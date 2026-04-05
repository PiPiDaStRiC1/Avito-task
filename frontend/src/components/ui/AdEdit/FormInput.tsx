import { X } from "lucide-react";
import type { UseFormRegisterReturn } from "react-hook-form";

interface FormInputProps {
    registerProps: UseFormRegisterReturn;
    currentValue: string;
    onClear: () => void;
    onValueChange?: (value: string) => void;
    placeholder?: string;
    type?: string;
    clearable?: boolean;
    className?: string;
    error?: string | undefined;
}

const baseClassName =
    "h-10 w-full rounded-lg border bg-white px-3 pr-8 text-sm text-[var(--text-main)] outline-none focus:border-[var(--accent)]";

export const FormInput = ({
    registerProps,
    currentValue,
    onClear,
    onValueChange,
    placeholder,
    type = "text",
    clearable = true,
    className,
    error,
}: FormInputProps) => {
    const borderClassName = error
        ? "border-red-500 focus:border-red-500"
        : "border-[var(--soft-border)]";

    return (
        <div className="relative">
            <input
                {...registerProps}
                onChange={(event) => {
                    registerProps.onChange(event);
                    onValueChange?.(event.target.value);
                }}
                placeholder={placeholder}
                type={type}
                aria-invalid={Boolean(error)}
                className={
                    className
                        ? `${baseClassName} ${borderClassName} ${className}`
                        : `${baseClassName} ${borderClassName}`
                }
            />

            {clearable && currentValue && (
                <button
                    type="button"
                    aria-label="Очистить поле"
                    onClick={onClear}
                    className="absolute top-1/2 right-2 flex h-4 w-4 -translate-y-1/2 items-center justify-center rounded-full bg-[var(--bg-gray)] text-white"
                >
                    <X size={10} />
                </button>
            )}

            {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
        </div>
    );
};