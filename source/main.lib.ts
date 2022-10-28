import type { Some, Result } from '~/utils/common.types'

declare type UnwrapFuncAlias<T> = ( def ?: T ) => NonNullable<T>;

export class Optional<T extends Some<any>> {

    static #DEFAULT_ERROR = Error("");

    #value    : Some<T>;
    #error    : Error;
    #resolve  : boolean = false;

    constructor(value: T, error = Optional.#DEFAULT_ERROR) {
        this.#value   = value;
        this.#error   = error;
        this.#resolve = value ? true : false;
    }

    get is() { return this.#resolve }

    get some() {
        return Optional.container(this.#value, this.#error);
    }

    get error(): Some<Error> {
        return this.is ? undefined : this.#error;
    }

    private static unwrap<
        T extends Some<any>, 
        E extends Error
    >( val: T, error: E, def?: T ): NonNullable<T> {
        
        if ( !val && def ) return def;

        if ( !val ) throw Error("can't to unwrap undefined value because of " + error.message);

        return val;

    }

    private static container<
        T extends Some<any>,
        E extends Error
    >( value: T, error: E ): Result<T,E> {

        const func = (def: T) => Optional.unwrap.apply(null, [ value, error, def ])

        return {
            value  : [ value, error ],
            unwrap : func.bind(null, value),
        }

    }

    public static unwrapRecursive<
        T extends Optional<any>,
        E extends Error,
    >({ some }: Optional<T> ): Result<T,Error> {

        const [ val, error ] = some.value;

        if ( val?.is === false ) return error;

        return val instanceof Optional 
            ? Optional.unwrapRecursive(some.unwrap()) 
            : val;

    }

}