import { Context } from '../deps.ts';
import { Command, Option, SubCommand, SubCommandGroup } from '../deps.ts';

@SubCommand({
    dependencies: ['repl', 'group'],
})
export class Ping {
    @Option('Wheter to mention the user or not', true)
    declare mention: boolean;

    get options() {
        return [this.mention];
    }

    async run(ctx: Context) {
        const toMention = ctx.options?.getBoolean(0) ?? ctx.options?.getBoolean('mention', true);
        await ctx.respond({ with: `Ping! ${toMention ? ctx.user?.toString() : ''}` });
    }
}

@SubCommand({
    dependencies: ['repl', 'group'],
})
export class Pong {
    @Option('Wheter to mention the user or not', true)
    declare mention: boolean;

    get options() {
        return [this.mention];
    }

    async run(ctx: Context) {
        const toMention = ctx.options?.getBoolean(0) ?? ctx.options?.getBoolean('mention', true);
        await ctx.respond({ with: `Pong! ${toMention ? ctx.user?.toString() : ''}` });
    }
}

@SubCommandGroup
export class Group {
    @Option.SubCommand('a', Ping)
    declare ping: Ping;

    @Option.SubCommand('b', Pong)
    declare pong: Ping;

    get options() {
        return [this.ping, this.pong];
    }
}

@Command
export class Repl {
    readonly data = {
        name: 'repl',
        description: 'ping the bot',
    };

    @Option.SubCommandGroup('g', Group)
    declare group: Ping;

    get options() {
        return [this.group];
    }

    run(_ctx: Context) {
        console.log('it works');
    }
}
