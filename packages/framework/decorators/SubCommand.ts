import type { BaseSubCommand } from '../classes/Command.ts';
import { metadataHelpers, CommandLevel } from './metadata.ts';

export function SubCommand({ dependencies }: { dependencies: [string] }): ClassDecorator {
	return function(object) {
		metadataHelpers.setMetadata(object.prototype, "dependencies", dependencies);
		metadataHelpers.setMetadata(object.prototype, "level", CommandLevel.SubCommand);
	};
}