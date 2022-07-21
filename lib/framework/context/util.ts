export type BuilderResolvable<T> = T | {
    toJSON(): T;
};
