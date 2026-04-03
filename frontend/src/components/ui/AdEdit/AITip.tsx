import { Lightbulb } from "lucide-react";

interface AITipProps {
    message?: string;
    onClick?: () => void;
    isActive?: boolean;
}

export const AITip = ({
    message = "Узнать рыночную стоимость",
    onClick,
    isActive = false,
}: AITipProps) => {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`cursor-pointer flex items-center justify-center gap-3 rounded-lg px-3 py-2 shadow-lg transition-colors ${
                isActive
                    ? "bg-[#ffe8c5] ring-1 ring-[var(--warning-border)]"
                    : "bg-[var(--warning-bg)]"
            }`}
        >
            <Lightbulb size={15} className="text-[var(--warning-text)]" />
            <p className="text-sm text-[var(--warning-text)]/90 font-medium">{message}</p>
        </button>
    );
};
