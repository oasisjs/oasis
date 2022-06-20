import { type Context } from '../../deps.ts';
import { Argument as Option, SubCommand } from '../../deps.ts';

@SubCommand({
    dependencies: ['repl']
})
export class Ping {
    @Option('Wheter to mention the user or not', true)
    declare mention: boolean;

    get options() {
        return [this.mention];
    }

    async run(ctx: Context) {
        const toMention = ctx.options.getBoolean(0) ?? ctx.options.getBoolean('mention', true);
        console.log('result of Ping:', toMention);
        await ctx.respond({ with: `Ping! ${toMention ? `<@${ctx.userId}>` : ''}` });
    }
}
