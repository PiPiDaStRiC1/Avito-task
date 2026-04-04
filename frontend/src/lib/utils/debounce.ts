export const debounce = <T extends (...args: unknown[]) => void>(cb: T, delay: number) => {
    let timerId: undefined | number = undefined;

    return (...args: Parameters<T>) => {
        clearTimeout(timerId);
        timerId = setTimeout(() => {
            cb(...args);
        }, delay);
    };
};
