import createMetadataHelpers from '../../misc/metadata/mod.ts';

export enum CommandLevel {
    Command,
    SubCommand,
    SubCommandGroup
}

type CommandState = {
    level: CommandLevel.Command;
    dependencies: [];
} | {
    level: CommandLevel.SubCommand;
    dependencies: [string];
} | {
    level: CommandLevel.SubCommandGroup;
    dependencies: [string, string];
};

export const sym = Symbol("operatives");

export const metadataHelpers = createMetadataHelpers<CommandState>(sym);