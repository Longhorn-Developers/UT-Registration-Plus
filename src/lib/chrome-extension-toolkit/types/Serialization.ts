type Primitive = string | number | boolean | null | undefined;

/**
 * A type that represents a serialized object. This is a recursive type that will serialize all properties of an object, except for functions which are ignored (and thus not serialized)
 */
export type Serialized<T> = {
    [K in keyof T as T[K] extends Function ? never : K]: Serializable<T[K]>;
};

/**
 * Represents a type that can be serialized to JSON. This could either be a primitive type, an array of serializable types, or a complex object
 * Recursively serializes an object to a JSON-compatible object.
 */
export type Serializable<T> = T extends Primitive
    ? T
    : T extends Array<infer U>
      ? Array<Serializable<U>>
      : T extends object
        ? Serialized<T>
        : T;

/**
 * Serializes a value to a JSON-compatible object (i.e. a Serializable<T>)
 * @returns A JSON-compatible object that represents the value passed in with all functions removed and all objects recursively serialized
 */
export function serialize<T>(value: T): Serializable<T> {
    return JSON.parse(JSON.stringify(value)) as Serializable<T>;
}

// THIS IS FOR TESTINWG THE TYPING

// type Test2 = {
//     test: string;
//     openNewTab: (url: string) => void;
//     url?: URL;
// };

// type Test1 = {
//     openNewTab: (url: string) => void;
//     count: number;
//     url: URL;
//     urls?: URL[];
//     foo: Test2;
//     bar?: Test2;
// };

// let x: Serialized<Test1>;
// //  ^?

// type SerializedData = Serializable<Data>;

// let data: SerializedData = {} as any;

// data.url = undefined;

// data = {
//     a: 'test',
//     b: 1,
//     c: true,
//     d: {
//         e: 'test',
//         t: undefined,
//     },
//     urls: [],
// };

// data.d = {
//     e: 'test',
// };
