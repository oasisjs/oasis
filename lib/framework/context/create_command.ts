import type {
    AllowedMentions,
    FileContent,
    InteractionResponseTypes,
    ActionRow,
    DiscordMessageComponents,
    DiscordEmbed,
} from '../../../deps.ts';
import type { EmbedBuilder } from '../../../deps.ts';
import type { BuilderResolvable } from "./util.ts";

/**
 * CreateMessage with improvements
 */
export interface BaseCreateCommand {
    /** Message content */
    with?: string | BuilderResolvable<DiscordEmbed> | BuilderResolvable<DiscordEmbed>[];
    mentions?: AllowedMentions;
}

/**
 * CreateMessage with tts
 */
export interface CreateCommandWithTTS extends BaseCreateCommand {
    tts?: boolean;
}

/**
 * CreateCommand with files
 */
export interface CreateCommandWithFiles extends BaseCreateCommand {
    files: FileContent[];
}

/**
 * CreateCommand with embeds
 */
export interface CreateCommandWithEmbeds extends BaseCreateCommand {
    embeds: EmbedBuilder[];
}

/**
 * CreateCommand with reference
 */
export interface CreateCommandWithReference extends BaseCreateCommand {
    reference: {
        messageId: bigint;
        guildId: bigint;
        channelId: bigint;
        failIfNotExists: boolean;
    };
}

/**
 * CreateCommand with interaction flags
 */
export interface CreateCommandWithFlags extends BaseCreateCommand {
    flags: number;
}

/**
 * CreateCommand with interaction type
 */
export interface CreateCommandWithType extends BaseCreateCommand {
    type: InteractionResponseTypes;
}

/**
 * CreateCommand with modal
 */
export interface CreateCommandWithModal extends BaseCreateCommand {
    modal: {
        title?: string;
        customId?: string;
    };
}

/**
 * CreateCommand with components
 */
export interface CreateCommandWithComponents extends BaseCreateCommand {
    components: BuilderResolvable<DiscordMessageComponents>;
}

/**
 * CreateCommand as private (flags: 64)
 */
export interface CreateCommandWithPrivateModifier extends BaseCreateCommand {
    private: boolean;
}

export type CreateCommand =
    | CreateCommandWithTTS
    | CreateCommandWithFiles
    | CreateCommandWithEmbeds
    | CreateCommandWithReference
    | CreateCommandWithType
    | CreateCommandWithFlags
    | CreateCommandWithModal
    | CreateCommandWithComponents
    | CreateCommandWithPrivateModifier
    | BaseCreateCommand;
