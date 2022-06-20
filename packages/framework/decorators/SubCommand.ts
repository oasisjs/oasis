import type { BaseSubCommand } from '../classes/Command.ts';
import { metadataHelpers, CommandLevel } from './metadata.ts';

export function SubCommand(options: { dependencies: [string, string] | [string] }): ClassDecorator {
	return function(object) {
		metadataHelpers.setMetadata(object.prototype, "dependencies", options.dependencies);
		metadataHelpers.setMetadata(object.prototype, "level", CommandLevel.SubCommand);
	};
}