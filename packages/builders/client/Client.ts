import type { Bot, EventHandlers } from '../../deps.ts';
import { createBot, GatewayIntents, getBotIdFromToken, startBot } from '../../deps.ts';

export class OasisClient {
    readonly bot: Bot;

    constructor(events: Partial<EventHandlers> = {}) {
        this.bot = createBot({
            intents: 0,
            botId: 0n,
            token: '',
            events,
        });
    }

    setToken(token: string) {
        // automatically set the id
        return (
            this.bot.token = token, this.bot.id = getBotIdFromToken(token), this
        );
    }

    /**
     * Optionally set the bot's id
     */
    setId(id: bigint) {
        return this.bot.id = id, this;
    }

    /**
     * Adds intents to the bot's instance
     */
    addIntent(intents: GatewayIntents) {
        return this.bot.intents |= intents, this;
    }

    /**
     * Adds multiple intents via `setIntent``
     */
    addIntents(intents: Array<keyof typeof GatewayIntents> | Array<GatewayIntents>) {
        intents.map((intent) => typeof intent === 'string' ? GatewayIntents[intent] : intent).forEach(this.addIntent);
        return this;
    }

    /**
     * Starts the bot
     */
    start(token = this.bot.token): Promise<void> {
        return startBot(this.bot);
    }
}
