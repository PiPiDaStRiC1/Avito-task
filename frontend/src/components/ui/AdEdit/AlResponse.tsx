import { RotateCcw } from "lucide-react";

export const AIResponse = () => {
    return (
        <div className="rounded-lg border border-[var(--soft-border)] bg-white px-4 py-3 shadow-lg">
            <p className="text-sm font-semibold text-[var(--text-main)]">Ответ AI:</p>
            <p className="mt-2 text-sm leading-5 text-[var(--text-main)]/90">
                Средняя цена на MacBook Pro 16\" M1 Pro (16/512GB):
                <br />
                • 115 000 - 135 000 ₽ - отличное состояние.
                <br />
                • От 140 000 ₽ - идеал, малый износ АКБ.
                <br />• 90 000 - 110 000 ₽ - срочно или с дефектами.
            </p>

            <div className="mt-3 flex gap-2">
                <button
                    type="button"
                    className="h-8 rounded-md bg-[var(--accent)] px-3 text-sm font-medium text-white"
                >
                    Применить
                </button>
                <button
                    type="button"
                    className="h-8 rounded-md border border-[var(--soft-border)] px-3 text-sm text-[var(--text-main)]"
                >
                    Закрыть
                </button>
            </div>

            <button
                type="button"
                className="mt-3 inline-flex h-8 items-center gap-2 rounded-md bg-[var(--warning-bg)] px-3 text-sm text-[var(--warning-text)]"
            >
                <RotateCcw size={14} />
                Повторить запрос
            </button>
        </div>
    );
};
