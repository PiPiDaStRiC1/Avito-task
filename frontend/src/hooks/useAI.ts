import { useEffect, useMemo, useState } from "react";
import { apiClient } from "@/lib/api";

type AiFieldId = "price" | "description";

type AiPayload = {
    category: "auto" | "real_estate" | "electronics";
    title: string;
    description?: string;
    price: number;
    params: Record<string, unknown>;
};

type AiState = {
    loadingField: AiFieldId | null;
    errorByField: Partial<Record<AiFieldId, string>>;
    contentByField: Partial<Record<AiFieldId, string>>;
    suggestedPrice: number | null;
};

type PersistedAiState = {
    contentByField: Partial<Record<AiFieldId, string>>;
    suggestedPrice: number | null;
};

type UseAIOptions = { storageKey?: string | null };

const readPersistedState = (storageKey?: string | null): PersistedAiState => {
    if (!storageKey) {
        return { contentByField: {}, suggestedPrice: null };
    }

    try {
        const raw = localStorage.getItem(storageKey);
        if (!raw) {
            return { contentByField: {}, suggestedPrice: null };
        }

        const parsed = JSON.parse(raw) as PersistedAiState;

        return {
            contentByField: parsed?.contentByField ?? {},
            suggestedPrice:
                typeof parsed?.suggestedPrice === "number" ? parsed.suggestedPrice : null,
        };
    } catch {
        return { contentByField: {}, suggestedPrice: null };
    }
};

export const useAI = ({ storageKey }: UseAIOptions) => {
    const persistedState = useMemo(() => readPersistedState(storageKey), [storageKey]);

    const [activeAiField, setActiveAiField] = useState<AiFieldId | null>(null);
    const [aiState, setAiState] = useState<AiState>({
        loadingField: null,
        errorByField: {},
        contentByField: persistedState.contentByField,
        suggestedPrice: persistedState.suggestedPrice,
    });

    useEffect(() => {
        if (!storageKey) return;

        const dataToPersist: PersistedAiState = {
            contentByField: aiState.contentByField,
            suggestedPrice: aiState.suggestedPrice,
        };

        localStorage.setItem(storageKey, JSON.stringify(dataToPersist));
    }, [storageKey, aiState.contentByField, aiState.suggestedPrice]);

    const requestAiSuggestion = async (fieldId: AiFieldId, payload: AiPayload) => {
        setAiState((current) => ({
            ...current,
            loadingField: fieldId,
            errorByField: { ...current.errorByField, [fieldId]: undefined },
        }));

        try {
            if (fieldId === "description") {
                const response = await apiClient.suggestWithAi("description", payload);

                setAiState((current) => ({
                    ...current,
                    loadingField: null,
                    contentByField: { ...current.contentByField, description: response.content },
                }));
                return;
            }

            const response = await apiClient.suggestWithAi("price", payload);
            const priceText =
                response.reason ??
                (typeof response.price === "number"
                    ? `Рекомендуемая цена: ${response.price} ₽`
                    : "");

            setAiState((current) => ({
                ...current,
                loadingField: null,
                contentByField: { ...current.contentByField, price: priceText || response.content },
                suggestedPrice: typeof response.price === "number" ? response.price : null,
            }));
        } catch (error) {
            const message =
                error instanceof Error && error.message
                    ? error.message
                    : "Не удалось получить ответ от AI";

            setAiState((current) => ({
                ...current,
                loadingField: null,
                errorByField: { ...current.errorByField, [fieldId]: message },
            }));
        }
    };

    const handleToggleAi = (fieldId: AiFieldId, payload: AiPayload) => {
        setActiveAiField((currentField) => {
            const nextField = currentField === fieldId ? null : fieldId;

            if (
                nextField &&
                !aiState.contentByField[nextField] &&
                !aiState.errorByField[nextField]
            ) {
                requestAiSuggestion(nextField, payload);
            }

            return nextField;
        });
    };

    const closeAiPanel = () => setActiveAiField(null);

    return {
        activeAiField,
        aiState,
        requestAiSuggestion,
        handleToggleAi,
        closeAiPanel,
        setActiveAiField,
    };
};
