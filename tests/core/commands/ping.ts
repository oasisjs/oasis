import { Command, Context, Snowflake } from '../../deps.ts';

@Command
export class Ping {
    readonly data = {
        name: 'ping',
        description: 'ping the bot',
    };

    #getPingFromContext(ctx: Context): number {
        if (ctx.isMessageContext()) {
            return Snowflake.snowflakeToTimestamp(ctx.message.id);
        }

        if (ctx.isInteractionContext()) {
            return Snowflake.snowflakeToTimestamp(ctx.interaction.id);
        }

        throw new Error('Cannot resolve context!');
    }

    async run(ctx: Context) {
        const pingTimestamp = this.#getPingFromContext(ctx);
        await ctx.respond({ with: `Pong! (${Date.now() - pingTimestamp}ms)` });
    }
}
