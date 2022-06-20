import createMetadataHelpers from '../../misc/metadata/mod.ts';

/** Enum representing command types */
export enum CommandLevel {
    Command,
    SubCommand,
    SubCommandGroup
}

type CommandState = {
    level: CommandLevel.Command;
    /** depends on nothing, contains its options or its sub command groups and grooups */
    dependencies: [];
} | {
    level: CommandLevel.SubCommand;
    /** depends on the main command and its group, contains its options*/
    dependencies: [string, string] | [string];
} | {
    level: CommandLevel.SubCommandGroup;
    /** depends on the main command, contains its sub commands and nothing else */
    dependencies: [string];
};

/** symbol for command management's metadata */
export const sym = Symbol("operatives");

/** helpers to manipulate metadata */
export const metadataHelpers = createMetadataHelpers<CommandState>(sym);