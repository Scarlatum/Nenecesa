class Optional<DEF, VAL extends DEF | undefined> {

  static DEFAULT_ERROR = Error('mismatched or undefined type');

  #def    : DEF;
  #value  : VAL | DEF;
  #err    : Error = Optional.DEFAULT_ERROR;

  constructor(defaultValue: DEF, value: VAL, error ?: Error) {

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

class OptionalSet<T> {

  #opt: Array<Optional<T,T>> = Array(0);

  constructor(opts: Array<Optional<T,T>>) {
      this.#opt = opts;
  }

  get values() {
      return this.#opt.filter(({ error }) => !error ).map(({ some }) => some)
  }

  get errors() {
      return this.#opt.filter(({ error }) => error ).map(({ error }) => error)
  }

}