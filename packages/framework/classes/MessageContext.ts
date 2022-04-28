import type { Bot, CreateMessage, Message } from '../../deps.ts';
import type { OasisCommandInteractionOption } from './CommandInteractionOptionResolver.ts';
import type { CreateCommand } from './CreateCommand.ts';
import { ApplicationCommandOptionTypes } from '../../deps.ts';
import { transformInteractionDataOption } from './CommandInteractionOptionResolver.ts';

/**
 * Context class for messages
 */
export class MessageContext<T extends Bot = Bot> {
    public bot: T;
    public message: Message;
    public prefix: string;

    public constructor(bot: T, message: Message, prefix: string) {
        this.prefix = prefix;
        this.message = message;
        this.bot = bot;

        Object.defineProperty(this, 'bot', { enumerable: false, writable: false, value: bot });
    }

    public async respond(data: CreateCommand) {
        const parsed: CreateMessage = {
            // pass
        };

        if ('embeds' in data) {
            parsed.embeds = data.embeds.map((e) => e.toJSON());
        } else if (typeof data.with === 'string') {
            parsed.content = data.with;
        } else if (Array.isArray(data.with)) {
            parsed.embeds = data.with.map((e) => e.toJSON());
        } else if (!data.with) {
            parsed.content = undefined;
        } else {
            parsed.embeds = [data.with.toJSON()];
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

    public async reply(options: CreateCommand): Promise<Message | undefined> {
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
