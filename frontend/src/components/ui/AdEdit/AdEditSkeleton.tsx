const SkeletonLine = ({ className }: { className: string }) => (
    <div className={`animate-pulse rounded-lg bg-[var(--soft-border)] ${className}`} />
);

export const AdEditSkeleton = () => {
    return (
        <article className="rounded-2xl border border-[var(--soft-border)] bg-[var(--panel-bg)] px-6 py-5 sm:px-7">
            <SkeletonLine className="h-9 w-72" />

            <div className="mt-6 space-y-6">
                <section className="space-y-4">
                    <div className="space-y-2">
                        <SkeletonLine className="h-4 w-28" />
                        <SkeletonLine className="h-10 w-full" />
                    </div>

                    <div className="h-px w-full bg-[var(--soft-border)]" />

                    <div className="space-y-2">
                        <SkeletonLine className="h-4 w-24" />
                        <SkeletonLine className="h-10 w-full" />
                    </div>

                    <div className="h-px w-full bg-[var(--soft-border)]" />

                    <div className="space-y-2">
                        <SkeletonLine className="h-4 w-20" />
                        <SkeletonLine className="h-10 w-full" />
                    </div>
                </section>

                <div className="h-px w-full bg-[var(--soft-border)]" />

                <section className="space-y-3">
                    <SkeletonLine className="h-8 w-80" />

                    <div className="space-y-3">
                        <div className="space-y-2">
                            <SkeletonLine className="h-4 w-24" />
                            <SkeletonLine className="h-10 w-full" />
                        </div>

                        <div className="space-y-2">
                            <SkeletonLine className="h-4 w-28" />
                            <SkeletonLine className="h-10 w-full" />
                        </div>

                        <div className="space-y-2">
                            <SkeletonLine className="h-4 w-24" />
                            <SkeletonLine className="h-10 w-full" />
                        </div>

                        <div className="space-y-2">
                            <SkeletonLine className="h-4 w-24" />
                            <SkeletonLine className="h-10 w-full" />
                        </div>
                    </div>
                </section>

                <div className="h-px w-full bg-[var(--soft-border)]" />

                <section className="space-y-2">
                    <SkeletonLine className="h-8 w-36" />

                    <div className="space-y-2">
                        <SkeletonLine className="h-28 w-full" />
                        <div className="flex justify-end">
                            <SkeletonLine className="h-4 w-20" />
                        </div>
                    </div>
                </section>

                <div className="flex gap-2 pt-1">
                    <SkeletonLine className="h-10 w-28" />
                    <SkeletonLine className="h-10 w-28" />
                </div>
            </div>
        </article>
    );
};
