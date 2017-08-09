/**
 * class decorator
 * @see https://stackoverflow.com/questions/13955157/how-to-define-static-property-in-typescript-interface
 */
export function staticImplements<T>() {
    return (_constructor: T) => {}
}
