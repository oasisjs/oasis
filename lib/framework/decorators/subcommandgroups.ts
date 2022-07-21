import { metadataHelpers, CommandLevel } from './helpers.ts';

// deno-lint-ignore no-explicit-any
export function SubCommandGroup(object: any) {
	metadataHelpers.setMetadata(object.prototype, "level", CommandLevel.SubCommandGroup);
}
