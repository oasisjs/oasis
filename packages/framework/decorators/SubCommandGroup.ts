import { metadataHelpers, CommandLevel } from './metadata.ts';

export function SubCommandGroup({ dependencies }: { dependencies: [string, string] }): ClassDecorator {
	return function(object) {
		metadataHelpers.setMetadata(object.prototype, "dependencies", dependencies);
		metadataHelpers.setMetadata(object.prototype, "level", CommandLevel.SubCommandGroup);
	};
}