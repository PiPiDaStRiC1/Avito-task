export const AdsSkeleton = () => {
    return (
        <div className="space-y-5">
            <div className="grid grid-cols-1 gap-5 min-[860px]:grid-cols-2 min-[1240px]:grid-cols-3 min-[1520px]:grid-cols-5">
                {Array.from({ length: 10 }, (_, index) => (
                    <div
                        key={index}
                        className="overflow-hidden rounded-2xl border border-[var(--soft-border)] bg-white"
                    >
                        <div className="h-[126px] animate-pulse bg-[var(--image-bg)]" />
                        <div className="space-y-2 p-3">
                            <div className="h-5 w-24 animate-pulse rounded-md bg-[var(--chip-bg)]" />
                            <div className="h-5 w-4/5 animate-pulse rounded bg-[var(--soft-border)]" />
                            <div className="h-7 w-2/3 animate-pulse rounded bg-[var(--soft-border)]" />
                            <div className="h-6 w-32 animate-pulse rounded-full bg-[var(--warning-bg)]" />
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex gap-2">
                {Array.from({ length: 6 }, (_, index) => (
                    <div
                        key={index}
                        className="h-8 w-8 animate-pulse rounded-md bg-white border border-[var(--soft-border)]"
                    />
                ))}
            </div>
        </div>
    );
};
