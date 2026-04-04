export const AdItemSkeleton = () => {
    return (
        <article className="space-y-5">
            <header className="flex flex-col gap-4 border-b border-[var(--soft-border)] pb-5 lg:flex-row lg:justify-between">
                <div className="space-y-3">
                    <div className="h-10 w-72 animate-pulse rounded bg-[var(--soft-border)]" />
                    <div className="h-9 w-36 animate-pulse rounded-lg bg-[var(--accent-soft)]" />
                </div>
                <div className="space-y-2 lg:text-right">
                    <div className="h-10 w-36 animate-pulse rounded bg-[var(--soft-border)] lg:ml-auto" />
                    <div className="h-4 w-44 animate-pulse rounded bg-[var(--soft-border)] lg:ml-auto" />
                    <div className="h-4 w-44 animate-pulse rounded bg-[var(--soft-border)] lg:ml-auto" />
                </div>
            </header>

            <section className="grid grid-cols-1 gap-6 xl:grid-cols-6">
                <div className="min-h-[320px] animate-pulse rounded-sm bg-[var(--image-bg)] xl:col-span-2" />
                <div className="space-y-6 xl:col-span-4">
                    <div className="h-28 w-full max-w-[512px] animate-pulse rounded-lg bg-[var(--warning-bg)]" />
                    <div className="space-y-3">
                        <div className="h-8 w-52 animate-pulse rounded bg-[var(--soft-border)]" />
                        <div className="h-24 w-full max-w-[340px] animate-pulse rounded bg-[var(--soft-border)]" />
                    </div>
                </div>
                <div className="space-y-3 xl:col-span-2">
                    <div className="h-8 w-40 animate-pulse rounded bg-[var(--soft-border)]" />
                    <div className="h-28 w-full max-w-[470px] animate-pulse rounded bg-[var(--soft-border)]" />
                </div>
            </section>
        </article>
    );
};
