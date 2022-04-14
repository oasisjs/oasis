import type {
    Id,
    Bot,
    CreateMessage,
    Interaction,
    Message,
    InteractionDataOption,
    InteractionApplicationCommandCallbackData,
    InteractionDataResolved,
} from "../../deps.ts";
import type { MessageEmbed } from "../../builders/mod.ts";
import { ApplicationCommandOptionTypes, InteractionResponseTypes } from "../../deps.ts";

/** idea from the Discord.js authors */
export class CommandInteractionOptionResolver {
    private _options: OasisCommandInteractionOption[];
    private _subcommand?: string;
    private _group?: string;
    public hoistedOptions: OasisCommandInteractionOption[];
    public resolved?: InteractionDataResolved;

    constructor(options?: InteractionDataOption[], resolved?: InteractionDataResolved) {
        this._options = options?.map(transformInteractionDataOption) ?? [];
        this.hoistedOptions = options?.map(transformInteractionDataOption) ?? [];

        if (this.hoistedOptions[0]?.type === ApplicationCommandOptionTypes.SubCommand) {
            this._group = this.hoistedOptions[0].name;
            this.hoistedOptions = (this.hoistedOptions[0].options ?? []).map(transformInteractionDataOption);
        }

        if (this.hoistedOptions[0]?.type === ApplicationCommandOptionTypes.SubCommandGroup) {
            this._subcommand = this.hoistedOptions[0].name;
            this.hoistedOptions = (this.hoistedOptions[0].options ?? []).map(transformInteractionDataOption);
        }

        this.resolved = resolved;
    }

    private getTypedOption(
        name: string | number,
        type: ApplicationCommandOptionTypes,
        properties: Array<keyof OasisCommandInteractionOption>,
        required: boolean
    ) {
        const option = this.get(name, required);

        if (!option) {
            return;
        }

        // if (option.type !== type) {
        //     throw new TypeError("Option types does not match");
        // }

        if (required === true && properties.every(prop => !option[prop])) {
            throw new TypeError(`Properties ${properties.join(", ")} are missing in option ${name}`);
        }

        return option;
    }

    public get(name: string | number, required: true): OasisCommandInteractionOption;
    public get(name: string | number, required: boolean): OasisCommandInteractionOption | undefined;
    public get(name: string | number, required?: boolean) {
        const option = this._options.find(o =>
            typeof name === "number" ? o.name === name.toString() : o.name === name
        );

        if (!option) {
            if (required && name in this._options.map(o => o.name)) {
                throw new TypeError("Option marked as required was undefined");
            }

            return;
        }

        return option;
    }

    /** searches for a string option */
    public getString(name: string | number, required: true): string;
    public getString(name: string | number, required?: boolean): string | undefined;
    public getString(name: string | number, required = false) {
        const option = this.getTypedOption(name, ApplicationCommandOptionTypes.String, ["Otherwise"], required);

        return option?.Otherwise ?? undefined;
    }

    /** searches for a number option */
    public getNumber(name: string | number, required: true): number;
    public getNumber(name: string | number, required?: boolean): number | undefined;
    public getNumber(name: string | number, required = false) {
        const option = this.getTypedOption(name, ApplicationCommandOptionTypes.Number, ["Otherwise"], required);

        return option?.Otherwise ?? undefined;
    }

    /** searhces for an integer option */
    public getInteger(name: string | number, required: true): number;
    public getInteger(name: string | number, required?: boolean): number | undefined;
    public getInteger(name: string | number, required = false) {
        const option = this.getTypedOption(name, ApplicationCommandOptionTypes.Integer, ["Otherwise"], required);

        return option?.Otherwise ?? undefined;
    }

    /** searches for a boolean option */
    public getBoolean(name: string | number, required: true): boolean;
    public getBoolean(name: string | number, required?: boolean): boolean | undefined;
    public getBoolean(name: string | number, required = false) {
        const option = this.getTypedOption(name, ApplicationCommandOptionTypes.Boolean, ["Otherwise"], required);

        return option?.Otherwise ?? undefined;
    }

    /** searches for a user option */
    public getUser(name: string | number, required: true): bigint;
    public getUser(name: string | number, required?: boolean): bigint | undefined;
    public getUser(name: string | number, required = false) {
        const option = this.getTypedOption(name, ApplicationCommandOptionTypes.User, ["Otherwise"], required);

        return option?.Otherwise ?? undefined;
    }

    /** searches for a channel option */
    public getChannel(name: string | number, required: true): bigint;
    public getChannel(name: string | number, required?: boolean): bigint | undefined;
    public getChannel(name: string | number, required = false) {
        const option = this.getTypedOption(name, ApplicationCommandOptionTypes.Channel, ["Otherwise"], required);

        return option?.Otherwise ?? undefined;
    }

    /** searches for a mentionable-based option */
    public getMentionable(name: string | number, required: true): string;
    public getMentionable(name: string | number, required?: boolean): string | undefined;
    public getMentionable(name: string | number, required = false) {
        const option = this.getTypedOption(name, ApplicationCommandOptionTypes.Mentionable, ["Otherwise"], required);

        return option?.Otherwise ?? undefined;
    }

    /** searches for a mentionable-based option */
    public getRole(name: string | number, required: true): bigint;
    public getRole(name: string | number, required?: boolean): bigint | undefined;
    public getRole(name: string | number, required = false) {
        const option = this.getTypedOption(name, ApplicationCommandOptionTypes.Role, ["Otherwise"], required);

        return option?.Otherwise ?? undefined;
    }

    /** searches for an attachment option */
    public getAttachment(name: string | number, required: true): string;
    public getAttachment(name: string | number, required?: boolean): string | undefined;
    public getAttachment(name: string | number, required = false) {
        const option = this.getTypedOption(name, ApplicationCommandOptionTypes.Attachment, ["Otherwise"], required);

        return option?.Otherwise ?? undefined;
    }

    /** searches for the focused option */
    public getFocused(full = false) {
        const focusedOption = this.hoistedOptions.find(option => option.focused);

        if (!focusedOption) {
            throw new TypeError("No option found");
        }

        return full ? focusedOption : focusedOption.Otherwise;
    }

    public getSubcommand(required = true) {
        if (required && !this._subcommand) {
            throw new TypeError("Option marked as required was undefined");
        }

        return [this._subcommand, this.hoistedOptions];
    }

    public getSubcommandGroup(required = false) {
        if (required && !this._group) {
            throw new TypeError("Option marked as required was undefined");
        }

        return [this._group, this.hoistedOptions];
    }
}

export interface OasisCommandInteractionOption extends Id<Omit<InteractionDataOption, "value">> {
    Attachment?: string;
    Boolean?: boolean;
    User?: bigint;
    Role?: bigint;
    Number?: number;
    Integer?: number;
    Channel?: bigint;
    String?: string;
    Mentionable?: string;
    Otherwise: string | number | boolean | bigint | undefined;
}

export function transformInteractionDataOption(o: InteractionDataOption): OasisCommandInteractionOption {
    const output: OasisCommandInteractionOption = { ...o, Otherwise: o.value as string | boolean | number | undefined };

    switch (o.type) {
        case ApplicationCommandOptionTypes.String:
            output.String = o.value as string;
            break;
        case ApplicationCommandOptionTypes.Number:
            output.Number = o.value as number;
            break;
        case ApplicationCommandOptionTypes.Integer:
            output.Integer = o.value as number;
            break;
        case ApplicationCommandOptionTypes.Boolean:
            output.Boolean = o.value as boolean;
            break;
        case ApplicationCommandOptionTypes.Role:
            output.Role = BigInt(o.value as string);
            break;
        case ApplicationCommandOptionTypes.User:
            output.User = BigInt(o.value as string);
            break;
        case ApplicationCommandOptionTypes.Channel:
            output.Channel = BigInt(o.value as string);
            break;

        case ApplicationCommandOptionTypes.Mentionable:
        case ApplicationCommandOptionTypes.SubCommand:
        case ApplicationCommandOptionTypes.SubCommandGroup:
        default:
            output.Otherwise = o.value as string | boolean | number | undefined;
    }

    return output;
}

/** @private */
type ReplyFunction = (options: CreateMessage) => Promise<Message | undefined>;

/** @private */
type RespondFunction = (options: CreateMessage) => Promise<Message | undefined>;

/** @private */
type RespondWithFunction = (content: string | MessageEmbed) => Promise<Message | undefined>;

/** @private */
type WhisperFunction = (options: CreateMessage) => Promise<Message | undefined>;

export interface ContextFunctions {
    reply: ReplyFunction;
    respond: RespondFunction;
    respondWith: RespondWithFunction;
    whisper: WhisperFunction;
}

export class MessageContext {
    public bot: Bot;
    public message: Message;
    public prefix: string;

    public constructor(bot: Bot, message: Message, prefix: string) {
        this.prefix = prefix;
        this.message = message;
        this.bot = bot;

        Object.defineProperty(this, "bot", { enumerable: false, writable: false, value: bot });
    }

    public async respond(options: CreateMessage): Promise<Message | undefined> {
        const m = await this.bot.helpers.sendMessage(this.message.channelId, options);

        return m;
    }

    public async respondWith(content: string | MessageEmbed): Promise<Message | undefined> {
        if (typeof content === "string") {
            const m = await this.respond({ content });

            return m;
        } else {
            const m = await this.respond({ embeds: [content.toJSON()] });

            return m;
        }
    }

    public async reply(options: CreateMessage): Promise<Message | undefined> {
        const m = await this.respond(
            Object.assign(options, {
                messageReference: {
                    messageId: this.message.messageReference?.messageId,
                    guildId: this.message.guildId,
                    failIfNotExists: true,
                },
            } as CreateMessage)
        );

        return m;
    }

    public static transformArgs(args: string[]): OasisCommandInteractionOption[] {
        return args.map((arg, i) => {
            // possibly a mention
            if (/\d{17,19}/g.test(arg)) {
                return transformInteractionDataOption({
                    name: i.toString(),
                    type: ApplicationCommandOptionTypes.Mentionable,
                    value: String(arg.match(/\d{17,19}/g)?.[0]),
                });
            }

            // try parsing the arg as a number
            const num = Number(arg);

            // if it's not a number, it's a string
            if (isNaN(num)) {
                return transformInteractionDataOption({
                    name: i.toString(),
                    type: ApplicationCommandOptionTypes.String,
                    value: arg,
                });
            } else {
                return transformInteractionDataOption({
                    name: i.toString(),
                    type: ApplicationCommandOptionTypes.Number,
                    value: num,
                });
            }
        });
    }

    public static parseArgs(prefix: string, message: Message): [string, string[]] | undefined {
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

    public static getOptionsFromMessage(prefix: string, message: Message): OasisCommandInteractionOption[] | undefined {
        const c = MessageContext.parseArgs(prefix, message);
        const a = MessageContext.transformArgs(c?.[1] ?? []);

        if (!a) {
            return undefined;
        }

        return a;
    }
}

export class InteractionContext {
    public bot: Bot;
    public interaction: Interaction;

    public constructor(bot: Bot, interaction: Interaction) {
        this.interaction = interaction;
        this.bot = bot;

        Object.defineProperty(this, "bot", { enumerable: false, writable: false, value: bot });
    }

    public async respond(
        type: InteractionResponseTypes,
        data: InteractionApplicationCommandCallbackData
    ): Promise<Message | undefined> {
        const m = await this.bot.helpers.sendInteractionResponse(this.interaction.id, this.interaction.token, {
            type,
            data,
        });

        return m;
    }

    public async respondWith(
        type: InteractionResponseTypes,
        content: string | MessageEmbed
    ): Promise<Message | undefined> {
        if (typeof content === "string") {
            const m = await this.respond(type, { content });

            return m;
        } else {
            const m = await this.respond(type, { embeds: [content.toJSON()] });

            return m;
        }
    }

    public async whisper(
        type: InteractionResponseTypes,
        data: InteractionApplicationCommandCallbackData
    ): Promise<Message | undefined> {
        const m = await this.bot.helpers.sendInteractionResponse(this.interaction.id, this.interaction.token, {
            type,
            data: {
                ...data,
                flags: 64,
            },
        });

        return m;
    }
}

export class Context<T extends Bot = Bot> extends CommandInteractionOptionResolver implements ContextFunctions {
    public readonly prefix: string;
    public readonly bot: T;
    public readonly guildId?: bigint;
    public readonly userId?: bigint;
    public readonly isBot: boolean;
    public readonly channelId?: bigint;

    public readonly messageContext?: MessageContext;
    public readonly interactionContext?: InteractionContext;

    constructor(prefix: string, bot: T, message?: Message, interaction?: Interaction) {
        if (!interaction && !message) {
            console.warn("Context must be created with either a message or interaction");
        }

        super(
            !message ? interaction?.data?.options ?? [] : MessageContext.getOptionsFromMessage(prefix, message),
            interaction?.data?.resolved
        );

        this.prefix = prefix;
        this.bot = bot;

        this.messageContext = message ? new MessageContext(bot, message, prefix) : undefined;

        this.interactionContext = interaction ? new InteractionContext(bot, interaction) : undefined;

        this.guildId = message ? message.guildId : interaction ? interaction.guildId : undefined;

        this.userId = message ? message.authorId : interaction ? interaction.user.id : undefined;

        this.isBot = message ? message.isBot : interaction ? interaction.user.toggles.bot : false;

        this.channelId = message ? message.channelId : interaction ? interaction.channelId : undefined;

        Object.defineProperty(this, "bot", { enumerable: false, writable: false, value: bot });
    }

    public get options(): OasisCommandInteractionOption[] {
        if (this.messageContext) {
            return MessageContext.getOptionsFromMessage(this.prefix, this.messageContext.message) ?? [];
        }

        if (this.interactionContext) {
            return this.interactionContext.interaction.data?.options?.map(transformInteractionDataOption) ?? [];
        }

        return [];
    }

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
                return force ? "" : undefined;
            }

            return c;
        }

        return force ? "" : undefined;
    }

    private _respond(type: InteractionResponseTypes, options: CreateMessage): Promise<Message | undefined> {
        if (this.messageContext) {
            return this.messageContext.respond(options);
        }

        if (this.interactionContext) {
            return this.interactionContext.respond(type, options);
        }

        return Promise.resolve(undefined);
    }

    private _reply(type: InteractionResponseTypes, options: CreateMessage): Promise<Message | undefined> {
        if (this.messageContext) {
            return this.messageContext.respond(options);
        }

        if (this.interactionContext) {
            return this.interactionContext.respond(type, options);
        }

        return Promise.resolve(undefined);
    }

    private _respondWith(type: InteractionResponseTypes, content: string | MessageEmbed): Promise<Message | undefined> {
        if (this.messageContext) {
            return this.messageContext.respondWith(content);
        }

        if (this.interactionContext) {
            return this.interactionContext.respondWith(type, content);
        }

        return Promise.resolve(undefined);
    }

    private async _whisper(
        type: InteractionResponseTypes,
        options: CreateMessage,
        time = 8000
    ): Promise<Message | undefined> {
        if (this.messageContext) {
            const m = await this.messageContext.respond(options);

            if (m) {
                await sleep(time);
                await this.bot.helpers.deleteMessage(m.channelId, m.id);
            }

            return m;
        }

        if (this.interactionContext) {
            return this.interactionContext.whisper(type, options);
        }

        return Promise.resolve(undefined);
    }

    /** send a response to the interaction or message */
    public respond(options: CreateMessage): Promise<Message | undefined> {
        return this._respond(InteractionResponseTypes.ChannelMessageWithSource, options);
    }

    /** send a reply */
    public reply(options: CreateMessage): Promise<Message | undefined> {
        return this._reply(InteractionResponseTypes.ChannelMessageWithSource, options);
    }

    /** forward a string or embed to the respond function */
    public respondWith(content: string | MessageEmbed): Promise<Message | undefined> {
        return this._respondWith(InteractionResponseTypes.ChannelMessageWithSource, content);
    }

    public whisper(options: CreateMessage, time = 8000): Promise<Message | undefined> {
        return this._whisper(InteractionResponseTypes.ChannelMessageWithSource, options, time);
    }

    /** valid on interaction context, on message context returns undefined */
    public async defer(): Promise<ContextFunctions | undefined> {
        if (this.messageContext || !this.interactionContext) {
            return;
        }

        await this.bot.helpers.sendInteractionResponse(
            this.interactionContext.interaction.id,
            this.interactionContext.interaction.token,
            {
                type: InteractionResponseTypes.DeferredChannelMessageWithSource,
            }
        );

        const respond = (options: CreateMessage): Promise<Message | undefined> => {
            return this._respond(InteractionResponseTypes.DeferredChannelMessageWithSource, options);
        };

        const respondWith = (content: string | MessageEmbed): Promise<Message | undefined> => {
            return this._respondWith(InteractionResponseTypes.DeferredChannelMessageWithSource, content);
        };

        const reply = (options: CreateMessage): Promise<Message | undefined> => {
            return this._reply(InteractionResponseTypes.DeferredChannelMessageWithSource, options);
        };

        const whisper = (options: CreateMessage): Promise<Message | undefined> => {
            return this._whisper(InteractionResponseTypes.DeferredChannelMessageWithSource, options);
        };

        return { respond, respondWith, reply, whisper };
    }
}

export function sleep(ms: number): Promise<unknown> {
    return new Promise(resolve => setTimeout(resolve, ms));
}
