import type { AllowedMentions, FileContent } from "../../deps.ts";
import type { MessageEmbed } from "../../builders/mod.ts";
import type { InteractionResponseTypes, MessageComponents } from "../../deps.ts";

/**
 * CreateMessage with improvements
 */
 export interface BaseCreateCommand {
    /** Message content */
    with?: string | MessageEmbed | MessageEmbed[];
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
    embeds: MessageEmbed[];
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
    components: MessageComponents;
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