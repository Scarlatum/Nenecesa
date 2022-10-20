type Possible<T> = T | undefined;

class Optional<Default,Value extends Possible<Default>> {

    static DEFAULT_ERROR = Error('mismatched or undefined type');

    #def    : Default;
    #value  : Value | Default;
    #err    : Error = Optional.DEFAULT_ERROR;

    constructor(defaultValue: Default, value: Value, error ?: Error) {

        this.#def = defaultValue;
        this.#err = error || Optional.DEFAULT_ERROR;

        this.#value = typeof defaultValue === typeof value
            ? value
            : defaultValue

    }

    get some() {
        return typeof this.#def === typeof this.#value
            ? this.#value
            : this.#def
    }

    get error() {
        return this.#def === this.some
            ? this.#err || Optional.DEFAULT_ERROR
            : null
    }

}

class OptionalSet<Default,Value extends Possible<Default>> {

    #opt: Array<Optional<Default,Value>> = Array(0);

    constructor(opts: Array<Optional<Default,Value>>) {
        this.#opt = opts;
    }

    get values() {
        return this.#opt.filter(({ error }) => !error ).map(({ some }) => some)
    }

    get errors() {
        return this.#opt.filter(({ error }) => error ).map(({ error }) => error)
    }

}