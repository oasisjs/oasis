import type { CreateCommand } from './create_command.ts';
import {
    CommandInteractionOption,
    CommandInteractionOptionResolver,
    CreateMessage,
    Interaction,
    InteractionApplicationCommandCallbackData,
    Session,
    Snowflake,
    User,
} from '../../../deps.ts';
import { ApplicationCommandOptionTypes, Message, transformOasisInteractionDataOption } from '../../../deps.ts';
import { commands, subCommandGroups, subCommands } from '../cache.ts';

export interface Context {
    readonly session: Session;
    respond(data: CreateCommand): Promise<Message | undefined>;
    commandN: string | undefined;
    isMessageContext(): this is MessageContext;
    isInteractionContext(): this is InteractionContext;
    options?: CommandInteractionOptionResolver;

    guildId?: Snowflake;
    channelId?: Snowflake;
    user?: User;
}

export class ContextFactory {
    from(session: Session, data: Interaction): InteractionContext;
    from(session: Session, data: Message, prefix: string): MessageContext;
    from(
        session: Session,
        data: Message | Interaction,
        prefix?: string,
    ): Context {
        if (data instanceof Message) {
            if (!prefix) throw new Error('Prefix is mandatory');
            return new MessageContext(session, data, prefix);
        } else {
            return new InteractionContext(session, data);
        }
    }
}

const YES: ReadonlySet<string> = new Set(['yes', 'y', 'on', 'true']);
const NO: ReadonlySet<string> = new Set(['no', 'n', 'off', 'false']);

/**
 * Context class for messages
 */
export class MessageContext {
    session: Session;
    message: Message;
    prefix: string;

    options?: CommandInteractionOptionResolver;
    guildId?: Snowflake;
    channelId?: Snowflake;
    user: User;

    constructor(session: Session, message: Message, prefix: string) {
        this.prefix = prefix;
        this.message = message;
        this.session = session;
        this.guildId = message.guildId;
        this.channelId = message.channelId;
        this.user = message.author;

        const resolved = MessageContext.getOptionsFromMessage(prefix, message);

        if (resolved) {
            this.options = new CommandInteractionOptionResolver(resolved);
        }
    }

    /** sends a message */
    async respond(data: CreateCommand) {
        const parsed: CreateMessage = {
            // pass
        };

        if ('embeds' in data) {
            parsed.embeds = data.embeds?.map((e) => e.toJSON?.() || e);
        } else if (typeof data.with === 'string') {
            parsed.content = data.with;
        } else if (Array.isArray(data.with)) {
            parsed.embeds = data.with.map((e) => 'toJSON' in e ? e.toJSON() : e);
        } else if (!data.with) {
            parsed.content = undefined;
        } else {
            parsed.embeds = ['toJSON' in data.with ? data.with.toJSON() : data.with];
        }
        if ('components' in data) {
            parsed.components = 'toJSON' in data.components ? data.components.toJSON() : data.components;
        }

        const m = await this.message.reply({
            ...parsed,
            allowedMentions: 'mentions' in data ? data.mentions : undefined,
            tts: 'tts' in data ? data.tts : undefined,
            file: 'files' in data ? data.files : undefined,
            // @ts-ignore: TODO
            messageReference: 'reference' in data ? data.reference : undefined,
        });

        return m;
    }

    /** sends a message replying to someone */
    async reply(options: CreateCommand): Promise<Message | undefined> {
        const m = await this.respond(
            Object.assign(options, {
                reference: {
                    // @ts-ignore: TODO
                    messageId: this.message.messageReaction?.messageId,
                    guildId: this.message.guildId,
                    failIfNotExists: true,
                },
            } as CreateCommand),
        );

        return m;
    }

    static transformArgs(
        args: string[],
        commandName?: string,
    ): CommandInteractionOption[] {
        function mapArgs(arg: string, i: number) {
            // possibly a mention
            if (/\d{17,19}/g.test(arg)) {
                return transformOasisInteractionDataOption({
                    name: i.toString(),
                    type: ApplicationCommandOptionTypes.Mentionable,
                    value: String(arg.match(/\d{17,19}/g)?.[0]),
                });
            }

            // try parsing the arg as a number
            const num = Number(arg);

            // if it's not a number, it's a string
            if (isNaN(num)) {
                const str = String(arg);

                // an string could be parsed as boolean tho:
                if (YES.has(str.toLowerCase())) {
                    return transformOasisInteractionDataOption({
                        name: i.toString(),
                        type: ApplicationCommandOptionTypes.Boolean,
                        value: true,
                    });
                }

                if (NO.has(str.toLowerCase())) {
                    return transformOasisInteractionDataOption({
                        name: i.toString(),
                        type: ApplicationCommandOptionTypes.Boolean,
                        value: false,
                    });
                }

                return transformOasisInteractionDataOption({
                    name: i.toString(),
                    type: ApplicationCommandOptionTypes.String,
                    value: arg,
                });
            } else {
                return transformOasisInteractionDataOption({
                    name: i.toString(),
                    type: ApplicationCommandOptionTypes.Number,
                    value: num,
                });
            }
        }

        if (!subCommands.has(`${commandName}/${args[0]}`)) {
            if (!subCommandGroups.has(`${commandName}/${args[0]}/${args[1]}`)) {
                return args.map(mapArgs);
            } else {
                return [
                    transformOasisInteractionDataOption({
                        name: args[1],
                        type: ApplicationCommandOptionTypes.SubCommandGroup,
                        options: args.slice(1).map(mapArgs),
                    }),
                ];
            }
        } else {
            return [
                transformOasisInteractionDataOption({
                    name: args[0],
                    type: ApplicationCommandOptionTypes.SubCommand,
                    options: args.slice(1).map(mapArgs),
                }),
            ];
        }
    }

    static parseArgs(
        prefix: string,
        message: Message,
    ): [string, string[]] | undefined {
        const args = message.content.slice(prefix.length).trim().split(/ +/gm);
        const name = args.shift()?.toLowerCase();

        if (!message.content.startsWith(prefix)) {
            return;
        }

        if (!name) {
            return;
        }

        return [name, args];
    }

    static getOptionsFromMessage(
        prefix: string,
        message: Message,
    ): CommandInteractionOption[] | undefined {
        const c = MessageContext.parseArgs(prefix, message);
        const a = MessageContext.transformArgs(c?.[1] ?? [], c?.[0]);

        if (!a) {
            return undefined;
        }

        return a;
    }

    get commandN(): string | undefined {
        const c = MessageContext.parseArgs(this.prefix, this.message);

        return c?.[0];
    }

    isInteractionContext(): this is InteractionContext {
        return 'interaction' in this;
    }

    isMessageContext(): this is MessageContext {
        return 'message' in this;
    }
}

export class InteractionContext implements Context {
    readonly session: Session;
    interaction: Interaction;
    options?: CommandInteractionOptionResolver;
    guildId?: Snowflake;
    channelId?: Snowflake;
    user?: User;

    constructor(session: Session, interaction: Interaction) {
        this.interaction = interaction;
        this.session = session;
        this.guildId = interaction.guildId;
        this.channelId = interaction.channelId;
        this.user = interaction.user;

        if (interaction.isCommand()) {
            this.options = interaction.options;
        }
    }

    /** responds to an interaction */
    async respond(data: CreateCommand): Promise<Message | undefined> {
        const parsed: InteractionApplicationCommandCallbackData = {
            // pass
        };

        if ('embeds' in data) {
            parsed.embeds = data.embeds?.map((e) => e.toJSON?.() || e);
        } else if (typeof data.with === 'string') {
            parsed.content = data.with;
        } else if (Array.isArray(data.with)) {
            parsed.embeds = data.with.map((e) => 'toJSON' in e ? e.toJSON() : e);
        } else if (!data.with) {
            parsed.content = undefined;
        } else {
            parsed.embeds = ['toJSON' in data.with ? data.with.toJSON() : data.with];
        }
        if ('components' in data) {
            parsed.components = 'toJSON' in data.components ? data.components.toJSON() : data.components;
        }

        const m = await this.interaction.respondWith({
            ...parsed,
            flags: 'private' in data && data.private ? 64 : undefined,
            allowedMentions: 'mentions' in data ? data.mentions : undefined,
            // @ts-ignore: TODO
            tts: 'tts' in data ? data.tts : undefined,
            file: 'files' in data ? data.files : undefined,
        });

        return m;
    }

    get commandN(): string | undefined {
        if (this.interaction.isCommand()) {
            return this.interaction.commandName;
        }

        return undefined;
    }

    isInteractionContext(): this is InteractionContext {
        return 'interaction' in this;
    }

    isMessageContext(): this is MessageContext {
        return 'message' in this;
    }
}
