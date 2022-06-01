import type { Bot, CreateBotOptions, EventHandlers } from '../../deps.ts';
import { createBot, GatewayIntents, getBotIdFromToken, startBot } from '../../deps.ts';

export class OasisClient {
    #options: CreateBotOptions;

    constructor(events: Partial<EventHandlers> = {}) {
        this.#options = {
            intents: 0,
            token: '',
            events,
        };
    }

    setToken(token: string): this {
        // automatically set the id
        return (
            this.#options.token = token, this.#options.botId = getBotIdFromToken(token), this
        );
    }

    /**
     * Optionally set the bot's id
     */
    setId(id: bigint): this {
        return this.#options.botId = id, this;
    }

    /**
     * Adds intents to the bot's instance
     */
    addIntent(intents: GatewayIntents): this {
        return this.#options.intents! |= intents, this;
    }

    /**
     * Adds multiple intents via `setIntent``
     */
    addIntents(intents: Array<keyof typeof GatewayIntents> | Array<GatewayIntents>): this {
        intents.map((intent) => typeof intent === 'string' ? GatewayIntents[intent] : intent).forEach(this.addIntent);
        return this;
    }

    /**
     * Starts the bot
     */
    start<A extends Bot>(plugins: Array<(bot: Bot) => Bot> = []): Promise<A> {
        const bot = plugins.reduce((y, x) => x(y), createBot(this.#options));

        return startBot(bot).then(() => bot as A);
    }
}
