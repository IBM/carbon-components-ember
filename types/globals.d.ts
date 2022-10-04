
// eslint-disable-next-line no-unused-vars
declare type EmberPromise<T> = Promise<T> & { content: T | undefined }

type UnionKeys<T> = T extends T ? keyof T : never;

// Improve intellisense
type Expand<T> = T extends T ? { [K in keyof T]: T[K] } : never;

// eslint-disable-next-line no-unused-vars
type OneOf<T extends {}[]> = {
  [K in keyof T]: Expand<T[K] & Partial<Record<Exclude<UnionKeys<T[number]>, keyof T[K]>, never>>>;
}[number];
