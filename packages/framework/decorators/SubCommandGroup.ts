import { metadataHelpers, CommandLevel } from './metadata.ts';

export function SubCommandGroup({ dependencies }: { dependencies: [string, string] }): ClassDecorator {
	return function(object) {
		metadataHelpers.setMetadata(object, "dependencies", dependencies);
		metadataHelpers.setMetadata(object, "level", CommandLevel.SubCommandGroup);
	};
}