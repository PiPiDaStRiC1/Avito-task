import { X } from "lucide-react";

interface FormInputProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    type?: string;
    clearable?: boolean;
    className?: string;
}

const baseClassName =
    "h-10 w-full rounded-lg border border-[var(--soft-border)] bg-white px-3 pr-8 text-sm text-[var(--text-main)] outline-none focus:border-[var(--accent)]";

export const FormInput = ({
    value,
    onChange,
    placeholder,
    type = "text",
    clearable = true,
    className,
}: FormInputProps) => {
    return (
        <div className="relative">
            <input
                value={value}
                onChange={(event) => onChange(event.target.value)}
                placeholder={placeholder}
                type={type}
                className={className ? `${baseClassName} ${className}` : baseClassName}
            />

            {clearable && value && (
                <button
                    type="button"
                    aria-label="Очистить поле"
                    onClick={() => onChange("")}
                    className="absolute top-1/2 right-2 flex h-4 w-4 -translate-y-1/2 items-center justify-center rounded-full bg-[var(--bg-gray)] text-white"
                >
                    <X size={10} />
                </button>
            )}
        </div>
    );
};
