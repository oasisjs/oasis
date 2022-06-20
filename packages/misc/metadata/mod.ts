// deno-lint-ignore-file no-explicit-any
/// <reference-types = '../../../reflect-metadata.ts'/>

import '../../../reflect-metadata.ts';

type MetadataHelpers<T> = {
    ensureMetadata: (target: any) => T;
    setMetadata: (target: any, key: keyof T, value: any) => void;
    getOwnMetadata: (target: any) => T;
    hasOwnMetadata: (target: any) => boolean;
    pushMetadata: (target: any, key: keyof T, value: any) => void;
}

export function createMetadataHelpers<T>(metadataKey: symbol)/*: MetadataHelpers<T>*/ {
	const output: MetadataHelpers<T> = {
		getOwnMetadata(target): T {
			// @ts-ignore: compat
			return Reflect.getOwnMetadata(metadataKey, target);
		},
		hasOwnMetadata(target): boolean {
			// @ts-ignore: compat
			return Reflect.hasOwnMetadata(metadataKey, target);
		},
		ensureMetadata(target) {
			if (!this.hasOwnMetadata(target)) {
				// @ts-ignore: compat
            	Reflect.defineMetadata(metadataKey, {}, target);
            }

        	return this.getOwnMetadata(target);
        },
		setMetadata(target, key, value) {
			const metadata = this.ensureMetadata(target);
			metadata[key] = value;
		},
	    pushMetadata(target, key, value) {
	        const metadata = this.ensureMetadata(target);

	        if (!metadata[key]) {
	            this.setMetadata(target, key, []);
	        }

	        (metadata[key] as any).push(value);
	    },
	};

	return output;
}

export default createMetadataHelpers;