export declare type EmberPromise<T> = Promise<T> & { content: T | undefined };

export type UnionKeys<T> = T extends T ? keyof T : never;

// Improve intellisense
export type Expand<T> = T extends T ? { [K in keyof T]: T[K] } : never;

// eslint-disable-next-line no-unused-vars
export type OneOf<T extends object[]> = {
  [K in keyof T]: Expand<
    T[K] & Partial<Record<Exclude<UnionKeys<T[number]>, keyof T[K]>, never>>
  >;
}[number];

// eslint-disable-next-line no-unused-vars
export type WithRequired<T, K extends keyof T> = T & { [P in K]-?: T[P] };

export type Only<T, U> = {
  [P in keyof T]: T[P];
} & {
  [P in keyof U]?: never;
};

export type Either<T, U> = Only<T, U> | Only<U, T>;
