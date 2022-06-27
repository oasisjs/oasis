import type { Bot, CreateMessage, Message } from '../../deps.ts';
import type { OasisCommandInteractionOption } from './CommandInteractionOptionResolver.ts';
import type { CreateCommand } from './CreateCommand.ts';
import { ApplicationCommandOptionTypes } from '../../deps.ts';
import { transformOasisInteractionDataOption } from './CommandInteractionOptionResolver.ts';
import { subCommandGroups, subCommands } from '../cache.ts';

const YES: ReadonlySet<string> = new Set(['yes', 'y', 'on', 'true']);
const NO: ReadonlySet<string> = new Set(['no', 'n', 'off', 'false']);

/**
 * Context class for messages
 */
export class MessageContext<T extends Bot = Bot> {
    bot: T;
    message: Message;
    prefix: string;

    constructor(bot: T, message: Message, prefix: string) {
        this.prefix = prefix;
        this.message = message;
        this.bot = bot;

        Object.defineProperty(this, 'bot', { enumerable: false, writable: false, value: bot });
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
            parsed.embeds = data.with.map((e) => e.toJSON());
        } else if (!data.with) {
            parsed.content = undefined;
        } else {
            parsed.embeds = [data.with.toJSON()];
        }
        if ('components' in data) {
            parsed.components = data.components;
        }

        const m = await this.bot.helpers.sendMessage(this.message.channelId, {
            ...parsed,
            allowedMentions: 'mentions' in data ? data.mentions : undefined,
            tts: 'tts' in data ? data.tts : undefined,
            file: 'files' in data ? data.files : undefined,
            messageReference: 'reference' in data ? data.reference : undefined,
        });

        return m;
    }

    /** sends a message replying to someone */
    async reply(options: CreateCommand): Promise<Message | undefined> {
        const m = await this.respond(
            Object.assign(options, {
                reference: {
                    messageId: this.message.messageReference?.messageId,
                    guildId: this.message.guildId,
                    failIfNotExists: true,
                },
            } as CreateCommand),
        );

        return m;
    }

    static transformArgs(args: string[], commandName?: string): OasisCommandInteractionOption[] {
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

    static parseArgs(prefix: string, message: Message): [string, string[]] | undefined {
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

    static getOptionsFromMessage(prefix: string, message: Message): OasisCommandInteractionOption[] | undefined {
        const c = MessageContext.parseArgs(prefix, message);
        const a = MessageContext.transformArgs(c?.[1] ?? [], c?.[0]);

        if (!a) {
            return undefined;
        }

        return a;
    }
}
