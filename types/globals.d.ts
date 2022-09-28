
declare type EmberPromise<T> = Promise<T> & { content: T | undefined }
