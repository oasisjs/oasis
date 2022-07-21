import type { BaseSubCommand } from '../ambient/commands.ts';
import { metadataHelpers, CommandLevel } from './helpers.ts';

export function SubCommand(options: { dependencies: [string, string] | [string] }): ClassDecorator {
	return function(object) {
		metadataHelpers.setMetadata(object.prototype, "dependencies", options.dependencies);
		metadataHelpers.setMetadata(object.prototype, "level", CommandLevel.SubCommand);
	};
}
