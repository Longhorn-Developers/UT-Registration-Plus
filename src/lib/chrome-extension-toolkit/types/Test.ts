type Primitive = string | number | boolean | null | undefined;

type Serialized<T> = {
    [K in keyof T as T[K] extends Function ? never : K]: Serializable<T[K]>;
};

type Serializable<T> = T extends Primitive
    ? T
    : T extends Array<infer U>
      ? Array<Serializable<U>>
      : T extends object
        ? Serialized<T>
        : T;

type Data = {
    a: string;
    b: number;
    c: boolean;
    url?: URL;
    d: {
        e: string;
        t?: URL;
    };
    get: () => void;
    urls: URL[];
};

type SerializedData = Serializable<Data>;

let x: SerializedData = {} as any;

x.url = undefined;

x = {
    a: 'test',
    b: 1,
    c: true,
    d: {
        e: 'test',
        t: undefined,
    },
    urls: [],
};

x.d = {
    e: 'test',
};
