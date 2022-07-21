import { Reflect } from 'https://deno.land/x/deno_reflect/mod.ts';

export { Reflect };

// @ts-expect-error: node compatibility
globalThis.Reflect = Reflect;
