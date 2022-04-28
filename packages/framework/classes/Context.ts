import type { Bot, Interaction, Message } from '../../deps.ts';
import type { OasisCommandInteractionOption } from './CommandInteractionOptionResolver.ts';
import type { CreateCommand } from './CreateCommand.ts';
import {
    CommandInteractionOptionResolver,
    transformInteractionDataOption,
} from './CommandInteractionOptionResolver.ts';
import { MessageContext } from './MessageContext.ts';
import { InteractionContext } from './InteractionContext.ts';
import { InteractionResponseTypes } from '../../deps.ts';

export type RespondFunction = (options: CreateCommand) => Promise<Message | undefined>;
export type RespondPrivatelyFunction = (options: CreateCommand) => Promise<Message | undefined>;

/**
 * Utility functions to respond to a message or interaction
 */
export interface ContextFunctions {
    respond: RespondFunction;
    respondPrivately: RespondPrivatelyFunction;
}

/**
 * The Oasis Context class
 */
export class Context<T extends Bot = Bot> implements ContextFunctions {
    public readonly prefix: string;

    /**
     * The bot can be modified with a middleware before passing it to the Context class
     * So Context.bot is generic but readonly
     */
    public readonly bot: T;

    /**
     * The guild the command has been triggered on
     */
    public readonly guildId?: bigint;

    /**
     * Whoever ran the command
     */
    public readonly userId?: bigint;

    /**
     * If the one who ran the command is a bot
     */
    public readonly isBot: boolean;

    /**
     * The channel the command has been triggered on
     */
    public readonly channelId?: bigint;

    /**
     * The options handler with utility methods
     */
    public readonly options: CommandInteractionOptionResolver;

    public readonly messageContext?: MessageContext;
    public readonly interactionContext?: InteractionContext;

    constructor(prefix: string, bot: T, message?: Message, interaction?: Interaction) {
        if (!interaction && !message) {
            console.warn('Context must be created with either a message or interaction');
        }

        this.prefix = prefix;
        this.bot = bot;

        this.messageContext = message ? new MessageContext(bot, message, prefix) : undefined;

        this.interactionContext = interaction ? new InteractionContext(bot, interaction) : undefined;

        this.guildId = message ? message.guildId : interaction ? interaction.guildId : undefined;

        this.userId = message ? message.authorId : interaction ? interaction.user.id : undefined;

        this.isBot = message ? message.isBot : interaction ? interaction.user.toggles.bot : false;

        this.channelId = message ? message.channelId : interaction ? interaction.channelId : undefined;

        this.options = new CommandInteractionOptionResolver(
            !message ? interaction?.data?.options ?? [] : MessageContext.getOptionsFromMessage(prefix, message),
            interaction?.data?.resolved,
        );

        Object.defineProperty(this, 'bot', { enumerable: false, writable: false, value: bot });
    }

    /**
     * The raw options from the interaction
     */
    public get rawOptions(): OasisCommandInteractionOption[] {
        if (this.messageContext) {
            return MessageContext.getOptionsFromMessage(this.prefix, this.messageContext.message) ?? [];
        }

        if (this.interactionContext) {
            return this.interactionContext.interaction.data?.options?.map(transformInteractionDataOption) ?? [];
        }

        return [];
    }

    /**
     * get the name of the command that has been triggered
     */
    public getCommandName(force: true): string;
    public getCommandName(force?: boolean): string | undefined;
    public getCommandName(force?: boolean) {
        if (this.messageContext) {
            const c = MessageContext.parseArgs(this.prefix, this.messageContext.message);

            return c?.[0];
        }

        if (this.interactionContext) {
            const c = this.interactionContext.interaction.data?.name;

            if (!c) {
                return force ? '' : undefined;
            }

            return c;
        }

        return force ? '' : undefined;
    }

    /**
     * Defer the reply, returns nothing
     */
    public defer() {
        return this.respond({
            type: InteractionResponseTypes.DeferredChannelMessageWithSource,
        }) as Promise<undefined>;
    }

    /**
     * Responds to the user
     */
    public respond(data: CreateCommand) {
        if (this.messageContext) {
            return this.messageContext.respond(data);
        }

        if (this.interactionContext) {
            return this.interactionContext.respond(data);
        }

        return Promise.resolve(undefined);
    }

    /**
     * Responds privately to the user
     */
    public async respondPrivately(data: CreateCommand & { time?: number }) {
        if (this.messageContext) {
            const m = await this.messageContext.respond(data);

            if (m && data.time) {
                await sleep(data.time);
                await this.bot.helpers.deleteMessage(m.channelId, m.id);
            }

            return m;
        }

        if (this.interactionContext) {
            return this.interactionContext.respond({ ...data, private: true });
        }

        return Promise.resolve(undefined);
    }
}

/** Sleep function */
export function sleep(ms: number): Promise<unknown> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
