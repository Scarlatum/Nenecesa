export type Some<T> = T | undefined;

export type Result<T,E extends Error> = {
    value  : [ T, E ],
    unwrap : UnwrapFunc<T>,
}