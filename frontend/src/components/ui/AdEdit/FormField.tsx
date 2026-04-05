import { AITip } from "@/components";
import type { ReactNode } from "react";

type AiFieldId = "price" | "description";

interface FormFieldProps {
    label: string;
    required?: boolean;
    aiMessage?: string;
    aiFieldId?: AiFieldId;
    activeAiField: AiFieldId | null;
    onToggleAi: (fieldId: AiFieldId) => void;
    children: ReactNode;
}

export const FormField = ({
    label,
    required = false,
    aiMessage,
    aiFieldId,
    activeAiField,
    onToggleAi,
    children,
}: FormFieldProps) => {
    const isAiOpen = aiFieldId ? activeAiField === aiFieldId : false;

    return (
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2 lg:gap-4">
            <label className="block">
                <span className="mb-1 block text-sm font-medium text-[var(--text-main)]">
                    {required && <span className="mr-1 text-red-500">*</span>}
                    {label}
                </span>
                {children}
            </label>

            {aiFieldId && aiMessage ? (
                <div className="flex flex-col gap-2 lg:pt-6">
                    <div className="relative w-fit">
                        <AITip
                            message={aiMessage}
                            onClick={() => onToggleAi(aiFieldId)}
                            isActive={isAiOpen}
                        />
                    </div>
                </div>
            ) : (
                <div className="hidden lg:block" />
            )}
        </div>
    );
};
