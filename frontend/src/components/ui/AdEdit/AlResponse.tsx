import { RotateCcw } from "lucide-react";

type AIResponseStatus = "idle" | "loading" | "success" | "error";

type AIResponseProps = {
    title?: string;
    content?: string;
    status?: AIResponseStatus;
    error?: string | null;
    onApply?: () => void;
    onClose?: () => void;
    onRetry?: () => void;
};

export const AIResponse = ({
    title = "Ответ AI",
    content,
    status = "idle",
    error,
    onApply,
    onClose,
    onRetry,
}: AIResponseProps) => {
    const isLoading = status === "loading";
    const isSuccess = status === "success";
    const isError = status === "error";

    return (
        <div className="rounded-lg border border-[var(--soft-border)] bg-white px-4 py-3 shadow-lg">
            <p className="text-sm font-semibold text-[var(--text-main)]">{title}:</p>

            {isLoading && (
                <p className="mt-2 text-sm leading-5 text-[var(--text-main)]/90">
                    Генерирую ответ...
                </p>
            )}

            {status === "idle" && (
                <p className="mt-2 text-sm leading-5 text-[var(--text-main)]/90">
                    Запрос будет отправлен сразу после открытия блока.
                </p>
            )}

            {!isLoading && isError && (
                <p className="mt-2 text-sm leading-5 text-red-600">{error}</p>
            )}

            {!isLoading && isSuccess && (
                <p className="mt-2 whitespace-pre-wrap text-sm leading-5 text-black">
                    {content || "Пока нет ответа"}
                </p>
            )}

            <div className="mt-3 flex gap-2">
                <button
                    type="button"
                    onClick={onApply}
                    disabled={!onApply || isLoading || isError || !content}
                    className="cursor-pointer h-8 rounded-md bg-[var(--accent)] px-3 text-sm font-medium text-white"
                >
                    Применить
                </button>
                <button
                    type="button"
                    onClick={onClose}
                    className="cursor-pointer h-8 rounded-md border border-[var(--soft-border)] px-3 text-sm text-[var(--text-main)]"
                >
                    Закрыть
                </button>
            </div>

            <button
                type="button"
                onClick={onRetry}
                disabled={isLoading || status === "idle"}
                className="cursor-pointer mt-3 inline-flex h-8 items-center gap-2 rounded-md bg-[var(--warning-bg)] px-3 text-sm text-[var(--warning-text)]"
            >
                <RotateCcw size={14} />
                Повторить запрос
            </button>
        </div>
    );
};
