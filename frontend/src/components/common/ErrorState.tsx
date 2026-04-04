interface ErrorStateProps {
    title?: string;
    message?: string;
    retryLabel?: string;
    onRetry?: () => void;
}

export const ErrorState = ({
    title = "Не удалось загрузить данные",
    message = "Попробуйте обновить страницу или повторите попытку чуть позже.",
    retryLabel = "Повторить",
    onRetry,
}: ErrorStateProps) => {
    return (
        <section className="rounded-2xl border border-[var(--soft-border)] bg-white p-5 shadow-lg">
            <h2 className="text-xl font-semibold text-[var(--text-main)]">{title}</h2>
            <p className="mt-2 text-sm text-[var(--text-muted)]">{message}</p>

            {onRetry && (
                <button
                    type="button"
                    onClick={onRetry}
                    className="cursor-pointer mt-4 h-9 rounded-lg bg-[var(--accent)] px-4 text-sm font-medium text-white"
                >
                    {retryLabel}
                </button>
            )}
        </section>
    );
};
